// Northorya — Mapa dos Seus Padrões V1.1
// Script do Painel de Administração e CRM

(function() {
  'use strict';

  let adminToken = localStorage.getItem('northorya_admin_token');
  let currentStatusFilter = 'todos';
  let searchTimeout = null;

  // Elementos do DOM
  const loginBox = document.getElementById('admin-login-box');
  const dashboard = document.getElementById('admin-dashboard');
  const formLogin = document.getElementById('form-login');
  const adminPassword = document.getElementById('admin-password');
  const btnLogout = document.getElementById('btn-logout');

  const btnToggleConfig = document.getElementById('btn-toggle-config');
  const configPanel = document.getElementById('config-panel');
  const inputBookingUrl = document.getElementById('input-booking-url');
  const btnSaveBookingUrl = document.getElementById('btn-save-booking-url');
  const btnTestBookingUrl = document.getElementById('btn-test-booking-url');
  const configSaveMsg = document.getElementById('config-save-msg');

  const statIniciados = document.getElementById('stat-iniciados');
  const statConcluidos = document.getElementById('stat-concluidos');
  const statTaxa = document.getElementById('stat-taxa');
  const statAcessosCalendar = document.getElementById('stat-acessos-calendar');
  const statConfirmadas = document.getElementById('stat-confirmadas');
  const statRealizadas = document.getElementById('stat-realizadas');

  const leadsTableBody = document.getElementById('leads-table-body');
  const noLeadsMsg = document.getElementById('no-leads-msg');
  const inputSearch = document.getElementById('input-search');
  const btnRefresh = document.getElementById('btn-refresh');
  const filterBadges = document.querySelectorAll('.badge-filter');

  // Status legíveis e cores
  const STATUS_CONFIG = {
    quiz_iniciado: { label: 'Iniciado', class: 'status-iniciado' },
    quiz_concluido: { label: 'Concluído', class: 'status-concluido' },
    interesse_sessao: { label: 'Interesse', class: 'status-interesse' },
    link_agendamento_acessado: { label: 'Acessou Calendar', class: 'status-acessou' },
    sessao_confirmada_manual: { label: 'Confirmada (Manual)', class: 'status-confirmado' },
    sessao_realizada: { label: 'Realizada', class: 'status-realizado' },
    acompanhamento_iniciado: { label: 'Acompanhamento', class: 'status-acompanhamento' }
  };

  // Inicialização
  function init() {
    if (adminToken) {
      showDashboard();
    } else {
      showLogin();
    }
  }

  function showLogin() {
    loginBox.style.display = 'block';
    dashboard.style.display = 'none';
  }

  function showDashboard() {
    loginBox.style.display = 'none';
    dashboard.style.display = 'block';
    loadConfig();
    loadLeads();
  }

  // Evento de Login
  formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = adminPassword.value.trim();

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();

      if (data.success && data.token) {
        adminToken = data.token;
        localStorage.setItem('northorya_admin_token', adminToken);
        showDashboard();
      } else {
        alert(data.error || 'Senha incorreta');
      }
    } catch (err) {
      alert('Erro ao conectar ao servidor');
    }
  });

  // Logout
  btnLogout.addEventListener('click', () => {
    adminToken = null;
    localStorage.removeItem('northorya_admin_token');
    showLogin();
  });

  // Alternar painel de configuração
  btnToggleConfig.addEventListener('click', () => {
    configPanel.style.display = configPanel.style.display === 'none' ? 'block' : 'none';
  });

  // Carrega configuração atual da URL de agendamento
  async function loadConfig() {
    try {
      const res = await fetch('/api/config');
      const data = await res.json();
      if (data.googleCalendarBookingUrl) {
        inputBookingUrl.value = data.googleCalendarBookingUrl;
        btnTestBookingUrl.href = data.googleCalendarBookingUrl;
      }
    } catch (e) {
      console.warn('Erro ao carregar config:', e);
    }
  }

  // Salvar nova URL de agendamento
  btnSaveBookingUrl.addEventListener('click', async () => {
    const newUrl = inputBookingUrl.value.trim();
    if (!newUrl) return;

    btnSaveBookingUrl.disabled = true;
    btnSaveBookingUrl.innerText = 'Salvando...';

    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ googleCalendarBookingUrl: newUrl })
      });
      const data = await res.json();

      if (data.success) {
        btnTestBookingUrl.href = data.googleCalendarBookingUrl;
        configSaveMsg.style.display = 'block';
        setTimeout(() => { configSaveMsg.style.display = 'none'; }, 4000);
      } else {
        alert(data.error || 'Erro ao salvar URL');
      }
    } catch (e) {
      alert('Erro de conexão ao salvar');
    } finally {
      btnSaveBookingUrl.disabled = false;
      btnSaveBookingUrl.innerText = 'Salvar Nova URL';
    }
  });

  // Carregar lista de leads e atualizar métricas
  async function loadLeads() {
    try {
      const params = new URLSearchParams();
      if (currentStatusFilter !== 'todos') params.append('status', currentStatusFilter);
      if (inputSearch.value.trim()) params.append('search', inputSearch.value.trim());

      const res = await fetch(`/api/admin/leads?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      if (res.status === 401) {
        alert('Sessão expirada. Faça login novamente.');
        adminToken = null;
        localStorage.removeItem('northorya_admin_token');
        showLogin();
        return;
      }

      const data = await res.json();
      renderMetrics(data.metrics);
      renderTable(data.leads);
    } catch (e) {
      console.error('Erro ao carregar leads:', e);
    }
  }

  // Renderiza métricas do funil
  function renderMetrics(m) {
    if (!m) return;
    statIniciados.innerText = m.iniciados || 0;
    statConcluidos.innerText = m.concluidos || 0;
    statTaxa.innerText = `${m.taxaConclusao || 0}%`;
    statAcessosCalendar.innerText = m.acessosCalendar || 0;
    statConfirmadas.innerText = m.confirmadosManual || 0;
    statRealizadas.innerText = m.realizadas || 0;
  }

  // Renderiza a tabela de leads
  function renderTable(leads) {
    leadsTableBody.innerHTML = '';

    if (!leads || leads.length === 0) {
      noLeadsMsg.style.display = 'block';
      return;
    }
    noLeadsMsg.style.display = 'none';

    leads.forEach(lead => {
      const tr = document.createElement('tr');
      const dateStr = new Date(lead.created_at).toLocaleString('pt-BR', {
        day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
      });

      const participantName = lead.name || '<em style="color: var(--text-muted);">Anônimo</em>';
      
      // Link direto do WhatsApp se fornecido
      let waHtml = '<span style="color: var(--text-muted);">-</span>';
      if (lead.whatsapp) {
        const cleanWa = lead.whatsapp.replace(/\D/g, '');
        const waLink = `https://wa.me/${cleanWa.startsWith('55') ? cleanWa : '55' + cleanWa}`;
        waHtml = `
          <a href="${waLink}" target="_blank" rel="noopener" style="color: #2C7A7B; text-decoration: none; font-weight: 600; display: inline-flex; align-items: center; gap: 4px;">
            <span>💬 ${lead.whatsapp}</span>
          </a>
        `;
      }

      // Origem
      const originHtml = `<span class="origin-badge">${lead.origin || 'direto'}</span>`;

      // Status Select
      const selectHtml = `
        <select class="form-input lead-status-select" data-id="${lead.id}" style="padding: 6px 10px; font-size: 0.8rem; width: 175px;">
          ${Object.entries(STATUS_CONFIG).map(([val, conf]) => `
            <option value="${val}" ${lead.status === val ? 'selected' : ''}>${conf.label}</option>
          `).join('')}
        </select>
      `;

      // Anotações
      const notesVal = lead.notes || '';

      tr.innerHTML = `
        <td style="white-space: nowrap; color: var(--text-muted); font-size: 0.82rem;">${dateStr}</td>
        <td><strong>${participantName}</strong></td>
        <td>${waHtml}</td>
        <td>${originHtml}</td>
        <td><span style="font-size: 0.82rem;">${lead.dominant_title || 'Em andamento'}</span></td>
        <td>${selectHtml}</td>
        <td>
          <div style="display: flex; gap: 6px; align-items: center;">
            <input type="text" class="form-input lead-notes-input" data-id="${lead.id}" value="${notesVal}" placeholder="Adicionar nota..." style="padding: 4px 8px; font-size: 0.8rem; width: 140px;">
            <button class="btn btn-secondary btn-save-notes" data-id="${lead.id}" style="padding: 4px 10px; font-size: 0.78rem;">Salvar</button>
          </div>
        </td>
      `;

      leadsTableBody.appendChild(tr);
    });

    // Eventos de alteração de Status
    document.querySelectorAll('.lead-status-select').forEach(sel => {
      sel.addEventListener('change', async (e) => {
        const leadId = e.target.getAttribute('data-id');
        const newStatus = e.target.value;
        await updateLead(leadId, { status: newStatus });
      });
    });

    // Eventos de salvar Anotações
    document.querySelectorAll('.btn-save-notes').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const leadId = e.target.getAttribute('data-id');
        const input = document.querySelector(`.lead-notes-input[data-id="${leadId}"]`);
        const notes = input ? input.value : '';
        btn.innerText = '✓';
        await updateLead(leadId, { notes });
        setTimeout(() => { btn.innerText = 'Salvar'; }, 2000);
      });
    });
  }

  // Atualiza lead via API
  async function updateLead(leadId, patch) {
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(patch)
      });
      if (res.ok) {
        // Se alterou status, recarrega métricas
        if (patch.status) {
          loadLeads();
        }
      }
    } catch (e) {
      console.error('Erro ao atualizar lead:', e);
    }
  }

  // Filtros de Status
  filterBadges.forEach(badge => {
    badge.addEventListener('click', () => {
      filterBadges.forEach(b => b.classList.remove('active'));
      badge.classList.add('active');
      currentStatusFilter = badge.getAttribute('data-status');
      loadLeads();
    });
  });

  // Busca com debounce
  inputSearch.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(loadLeads, 300);
  });

  btnRefresh.addEventListener('click', loadLeads);

  init();
})();
