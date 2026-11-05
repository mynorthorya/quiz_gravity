/**
 * NORTHORYA — MAPA DOS SEUS PADRÕES V1.1
 * Suíte de Testes Automatizados Obrigatórios
 */

import assert from 'node:assert/strict';
import http from 'node:http';
import { evaluateQuiz, QUESTIONS, DIMENSIONS } from '../src/services/quizEngine.js';
import { leadService } from '../src/services/leadService.js';
import { configService } from '../src/services/configService.js';
import { config } from '../src/config.js';
import { initDatabase } from '../src/db/index.js';

console.log('--- Iniciando Testes Automatizados Northorya V1.1 ---');

// Inicializa banco de dados de teste
initDatabase();

async function runTests() {
  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    try {
      fn();
      console.log(`✓ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`✗ [FAIL] ${name}:`, err.message);
      failed++;
    }
  }

  async function asyncTest(name, fn) {
    try {
      await fn();
      console.log(`✓ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`✗ [FAIL] ${name}:`, err.message);
      failed++;
    }
  }

  // 1. Verificação das 20 perguntas e 5 dimensões
  test('Estrutura de Perguntas: deve conter exatamente 20 perguntas comportamentais', () => {
    assert.equal(QUESTIONS.length, 20);
    const dimensionsCount = {};
    for (const q of QUESTIONS) {
      dimensionsCount[q.dimension] = (dimensionsCount[q.dimension] || 0) + 1;
      assert.equal(q.options.length, 4, `Pergunta ${q.id} deve ter 4 opções calibradas`);
    }
    assert.equal(Object.keys(dimensionsCount).length, 5, 'Deve cobrir as 5 dimensões');
    for (const [dim, count] of Object.entries(dimensionsCount)) {
      assert.equal(count, 4, `Dimensão ${dim} deve ter exatamente 4 perguntas`);
    }
  });

  // 2. Motor determinístico de interpretação
  test('Motor Determinístico: deve gerar resultado consistente e reprodutível', () => {
    // Cenário: Respostas focadas na Dimensão de Energia e Limites (todas opções 'd' na dimensão 1)
    const answers = {
      1: 'd', 2: 'd', 3: 'd', 4: 'd', // Energia (tensão máxima)
      5: 'a', 6: 'a', 7: 'a', 8: 'a', // Decisão (tensão mínima)
      9: 'a', 10: 'a', 11: 'a', 12: 'a',
      13: 'a', 14: 'a', 15: 'a', 16: 'a',
      17: 'a', 18: 'a', 19: 'a', 20: 'a'
    };

    const devolutiva1 = evaluateQuiz(answers);
    const devolutiva2 = evaluateQuiz(answers);

    assert.equal(devolutiva1.map.dominantDimension, 'energia_limites');
    assert.equal(devolutiva1.map.dimensions.energia_limites.percentage, 100);
    assert.deepEqual(devolutiva1, devolutiva2, 'Resultados devem ser 100% determinísticos');
    assert.ok(devolutiva1.themes.length > 0, 'Deve gerar temas identificados');
    assert.ok(devolutiva1.connections.length > 0, 'Deve gerar conexões comportamentais');
    assert.ok(devolutiva1.resources.length > 0, 'Deve gerar recursos pessoais relatados');
    assert.ok(devolutiva1.reflectionQuestions.length > 0, 'Deve gerar perguntas para reflexão');
  });

  // 3. Configuração do link oficial de agendamento Google Calendar
  test('Link Oficial do Google Calendar: deve ser configurável sem alterar o código-fonte', () => {
    const defaultUrl = 'https://calendar.app.google/fLHxUx7qa3H547bv7';
    const currentUrl = configService.getBookingUrl();
    assert.equal(currentUrl, defaultUrl);

    // Atualização pelo admin
    const testCustomUrl = 'https://calendar.app.google/teste-personalizado-123';
    configService.setBookingUrl(testCustomUrl);
    assert.equal(configService.getBookingUrl(), testCustomUrl);

    // Restaura para o padrão oficial V1.1
    configService.setBookingUrl(defaultUrl);
    assert.equal(configService.getBookingUrl(), defaultUrl);
  });

  // 4. Ciclo de estados do Lead e Registro de Intenção (Regra técnica crítica V1.1)
  test('Transição de Estados e Registro de Intenção sem marcar confirmada', () => {
    // 4.1 Início do quiz
    const { leadId } = leadService.startQuiz({ origin: 'instagram' });
    let lead = leadService.getResult(leadId);

    // 4.2 Conclusão do quiz
    const submitRes = leadService.submitQuiz(leadId, {
      name: 'Participante Teste',
      whatsapp: '11988887777',
      origin: 'instagram',
      answers: { 1: 'b', 2: 'c' },
      lgpdConsent: true
    });
    assert.equal(submitRes.leadId, leadId);

    const afterSubmit = leadService.getResult(leadId);
    assert.equal(afterSubmit.status, 'quiz_concluido');

    // 4.3 Participante clica em "Escolher meu dia e horário"
    const trackRes = leadService.trackBookingIntent(leadId, { action: 'click_calendar_button' });
    assert.equal(trackRes.success, true);
    assert.equal(trackRes.status, 'link_agendamento_acessado');

    // REGRA TÉCNICA OBRIGATÓRIA: Não marcar como confirmada automaticamente!
    const afterClick = leadService.getResult(leadId);
    assert.equal(afterClick.status, 'link_agendamento_acessado');
    assert.notEqual(afterClick.status, 'sessao_confirmada_manual');
  });

  // 5. CRM: Atualização manual de status e ciclo completo
  test('CRM: Permite transição manual dos estados até acompanhamento', () => {
    const { leadId } = leadService.startQuiz({ origin: 'whatsapp' });
    leadService.submitQuiz(leadId, { name: 'Lead CRM', answers: { 1: 'b' } });

    // Admin confirma manualmente a sessão
    leadService.updateLeadAdmin(leadId, { status: 'sessao_confirmada_manual', notes: 'Contato confirmado pelo WhatsApp' });
    let lead = leadService.getResult(leadId);
    assert.equal(lead.status, 'sessao_confirmada_manual');

    // Admin marca como realizada
    leadService.updateLeadAdmin(leadId, { status: 'sessao_realizada' });
    lead = leadService.getResult(leadId);
    assert.equal(lead.status, 'sessao_realizada');

    // Admin inicia acompanhamento
    leadService.updateLeadAdmin(leadId, { status: 'acompanhamento_iniciado' });
    lead = leadService.getResult(leadId);
    assert.equal(lead.status, 'acompanhamento_iniciado');
  });

  // 6. Teste de Privacidade (LGPD): URLs não devem conter respostas comportamentais
  test('Privacidade LGPD: Booking URL não deve vazar respostas comportamentais', () => {
    const bookingUrl = configService.getBookingUrl();
    const parsed = new URL(bookingUrl);
    assert.equal(parsed.searchParams.get('answers'), null);
    assert.equal(parsed.searchParams.get('scores'), null);
    assert.equal(parsed.hostname, 'calendar.app.google');
  });

  // 7. Teste de Persistência: o resultado continua disponível ao retornar
  test('Persistência: Devolutiva continua disponível para consulta posterior', () => {
    const { leadId } = leadService.startQuiz({ origin: 'whatsapp' });
    leadService.submitQuiz(leadId, {
      name: 'Cliente Fiel',
      answers: { 1: 'a', 2: 'a', 3: 'a', 4: 'a' }
    });

    const retrieved = leadService.getResult(leadId);
    assert.ok(retrieved);
    assert.equal(retrieved.name, 'Cliente Fiel');
    assert.ok(retrieved.devolutiva.map);
  });

  console.log(`\n=========================================`);
  console.log(`RESULTADO DOS TESTES: ${passed} passaram, ${failed} falharam.`);
  console.log(`=========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
