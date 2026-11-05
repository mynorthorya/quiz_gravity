import crypto from 'node:crypto';
import { db } from '../db/index.js';
import { evaluateQuiz } from './quizEngine.js';

export const VALID_STATUSES = [
  'quiz_iniciado',
  'quiz_concluido',
  'interesse_sessao',
  'link_agendamento_acessado',
  'sessao_confirmada_manual',
  'sessao_realizada',
  'acompanhamento_iniciado'
];

export const leadService = {
  // Inicia um novo ciclo de quiz gerando ID único
  startQuiz({ origin = 'direto', userAgent = '' }) {
    const leadId = crypto.randomUUID();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO leads (id, origin, status, created_at, updated_at)
      VALUES (?, ?, 'quiz_iniciado', ?, ?)
    `);
    stmt.run(leadId, (origin || 'direto').toLowerCase().trim(), now, now);

    this.logEvent(leadId, 'quiz_iniciado', { origin, userAgent });

    return { leadId };
  },

  // Processa a conclusão do quiz e gera o relatório determinístico
  submitQuiz(leadId, { name, whatsapp, answers, origin, lgpdConsent = true }) {
    const now = new Date().toISOString();

    // Se o leadId não existir ou for nulo, cria um novo
    let actualLeadId = leadId;
    const stmtCheck = db.prepare('SELECT id, status FROM leads WHERE id = ?');
    const existing = actualLeadId ? stmtCheck.get(actualLeadId) : null;

    if (!existing) {
      actualLeadId = crypto.randomUUID();
      const stmtCreate = db.prepare(`
        INSERT INTO leads (id, origin, status, created_at, updated_at)
        VALUES (?, ?, 'quiz_iniciado', ?, ?)
      `);
      stmtCreate.run(actualLeadId, (origin || 'direto').toLowerCase().trim(), now, now);
    }

    // Avaliação determinística através do motor
    const devolutiva = evaluateQuiz(answers || {});

    const cleanName = name ? String(name).trim() : null;
    const cleanWhatsapp = whatsapp ? String(whatsapp).replace(/[^\d+]/g, '') : null;
    const cleanOrigin = origin ? String(origin).toLowerCase().trim() : 'direto';

    const stmtUpdate = db.prepare(`
      UPDATE leads
      SET name = COALESCE(?, name),
          whatsapp = COALESCE(?, whatsapp),
          origin = COALESCE(?, origin),
          status = 'quiz_concluido',
          scores = ?,
          dominant_dimension = ?,
          dominant_title = ?,
          answers = ?,
          devolutiva = ?,
          lgpd_consent = ?,
          updated_at = ?
      WHERE id = ?
    `);

    stmtUpdate.run(
      cleanName,
      cleanWhatsapp,
      cleanOrigin,
      JSON.stringify(devolutiva.map.dimensions),
      devolutiva.map.dominantDimension,
      devolutiva.map.dominantTitle,
      JSON.stringify(answers || {}),
      JSON.stringify(devolutiva),
      lgpdConsent ? 1 : 0,
      now,
      actualLeadId
    );

    this.logEvent(actualLeadId, 'quiz_concluido', {
      globalIndex: devolutiva.map.globalIndex,
      dominant: devolutiva.map.dominantDimension,
      hasContact: !!(cleanName || cleanWhatsapp)
    });

    return {
      leadId: actualLeadId,
      devolutiva
    };
  },

  // Registra a intenção de agendamento (clique no botão)
  // Regra técnica estrita: Não confirma automaticamente a reserva.
  trackBookingIntent(leadId, { action = 'click_calendar_button' } = {}) {
    if (!leadId) return { success: false };

    const stmt = db.prepare('SELECT id, status FROM leads WHERE id = ?');
    const lead = stmt.get(leadId);
    if (!lead) return { success: false, error: 'Lead não encontrado' };

    const now = new Date().toISOString();

    // Apenas transiciona se ainda não foi confirmado manualmente ou avançado
    const canTransition = [
      'quiz_iniciado',
      'quiz_concluido',
      'interesse_sessao'
    ].includes(lead.status);

    const newStatus = 'link_agendamento_acessado';

    if (canTransition) {
      const updateStmt = db.prepare(`
        UPDATE leads 
        SET status = ?, updated_at = ? 
        WHERE id = ?
      `);
      updateStmt.run(newStatus, now, leadId);
    }

    this.logEvent(leadId, 'interesse_sessao', { action });
    this.logEvent(leadId, 'link_agendamento_acessado', { timestamp: now });

    return {
      success: true,
      leadId,
      status: canTransition ? newStatus : lead.status
    };
  },

  // Recupera o resultado de um lead já concluído
  getResult(leadId) {
    if (!leadId) return null;
    const stmt = db.prepare(`
      SELECT id, name, origin, status, dominant_dimension, dominant_title, devolutiva, created_at 
      FROM leads 
      WHERE id = ?
    `);
    const row = stmt.get(leadId);
    if (!row || !row.devolutiva) return null;

    return {
      leadId: row.id,
      name: row.name,
      origin: row.origin,
      status: row.status,
      dominantDimension: row.dominant_dimension,
      dominantTitle: row.dominant_title,
      devolutiva: JSON.parse(row.devolutiva),
      createdAt: row.created_at
    };
  },

  // Atualização manual pelo CRM / Painel do Administrador
  updateLeadAdmin(leadId, { status, notes }) {
    const stmt = db.prepare('SELECT id, status, notes FROM leads WHERE id = ?');
    const lead = stmt.get(leadId);
    if (!lead) throw new Error('Lead não encontrado');

    if (status && !VALID_STATUSES.includes(status)) {
      throw new Error(`Status inválido. Permitidos: ${VALID_STATUSES.join(', ')}`);
    }

    const now = new Date().toISOString();
    const newStatus = status || lead.status;
    const newNotes = notes !== undefined ? notes : lead.notes;

    const stmtUpdate = db.prepare(`
      UPDATE leads 
      SET status = ?, notes = ?, updated_at = ?
      WHERE id = ?
    `);
    stmtUpdate.run(newStatus, newNotes, now, leadId);

    if (status && status !== lead.status) {
      this.logEvent(leadId, status, { updatedBy: 'admin', previousStatus: lead.status });
    }

    return { success: true, leadId, status: newStatus, notes: newNotes };
  },

  // Listagem de leads com métricas e filtros para o CRM
  listLeads({ status, origin, search } = {}) {
    let query = `
      SELECT id, name, whatsapp, origin, status, dominant_title, dominant_dimension, scores, notes, lgpd_consent, created_at, updated_at
      FROM leads
      WHERE 1=1
    `;
    const params = [];

    if (status && status !== 'todos') {
      query += ` AND status = ?`;
      params.push(status);
    }

    if (origin && origin !== 'todos') {
      query += ` AND origin = ?`;
      params.push(origin.toLowerCase().trim());
    }

    if (search && search.trim().length > 0) {
      query += ` AND (name LIKE ? OR whatsapp LIKE ? OR notes LIKE ?)`;
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    query += ` ORDER BY datetime(created_at) DESC`;

    const stmt = db.prepare(query);
    const rows = stmt.all(...params);

    // Métricas do Funil
    const statsStmt = db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'quiz_iniciado' THEN 1 ELSE 0 END) as iniciados,
        SUM(CASE WHEN status IN ('quiz_concluido', 'interesse_sessao', 'link_agendamento_acessado', 'sessao_confirmada_manual', 'sessao_realizada', 'acompanhamento_iniciado') THEN 1 ELSE 0 END) as concluidos,
        SUM(CASE WHEN status IN ('interesse_sessao', 'link_agendamento_acessado', 'sessao_confirmada_manual', 'sessao_realizada', 'acompanhamento_iniciado') THEN 1 ELSE 0 END) as interesse,
        SUM(CASE WHEN status IN ('link_agendamento_acessado', 'sessao_confirmada_manual', 'sessao_realizada', 'acompanhamento_iniciado') THEN 1 ELSE 0 END) as acessos_calendar,
        SUM(CASE WHEN status = 'sessao_confirmada_manual' THEN 1 ELSE 0 END) as confirmados_manual,
        SUM(CASE WHEN status = 'sessao_realizada' THEN 1 ELSE 0 END) as realizadas,
        SUM(CASE WHEN status = 'acompanhamento_iniciado' THEN 1 ELSE 0 END) as acompanhamento
      FROM leads
    `);
    const metrics = statsStmt.get();

    return {
      leads: rows.map(r => ({
        ...r,
        scores: r.scores ? JSON.parse(r.scores) : null
      })),
      metrics: {
        totalLeads: metrics.total || 0,
        iniciados: metrics.iniciados || 0,
        concluidos: metrics.concluidos || 0,
        taxaConclusao: metrics.total ? Math.round((metrics.concluidos / metrics.total) * 100) : 0,
        interesseSessao: metrics.interesse || 0,
        acessosCalendar: metrics.acessos_calendar || 0,
        confirmadosManual: metrics.confirmados_manual || 0,
        realizadas: metrics.realizadas || 0,
        acompanhamento: metrics.acompanhamento || 0
      }
    };
  },

  // Registro de evento para auditoria
  logEvent(leadId, eventType, metadata = {}) {
    try {
      const now = new Date().toISOString();
      const stmt = db.prepare(`
        INSERT INTO events (lead_id, event_type, metadata, created_at)
        VALUES (?, ?, ?, ?)
      `);
      stmt.run(leadId, eventType, JSON.stringify(metadata), now);
    } catch (e) {
      console.error('Erro ao registrar evento:', e.message);
    }
  }
};
