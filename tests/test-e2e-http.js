/**
 * Teste End-to-End de Integração HTTP In-Process Northorya V1.1
 */

import { EventEmitter } from 'node:events';
import assert from 'node:assert/strict';
import { server } from '../src/server.js';
import { config } from '../src/config.js';

// Simulador de requisição HTTP In-Process (Compatível com Sandbox Windows)
function simulateRequest(method, urlPath, headers = {}, body = null) {
  return new Promise((resolve, reject) => {
    const req = new EventEmitter();
    req.method = method;
    req.url = urlPath;
    req.headers = { host: 'localhost:3000', ...headers };

    const res = new EventEmitter();
    let resStatusCode = 200;
    let resHeaders = {};
    let resData = '';

    res.writeHead = function(statusCode, headersObj) {
      resStatusCode = statusCode;
      if (headersObj) resHeaders = { ...resHeaders, ...headersObj };
    };

    res.setHeader = function(name, value) {
      resHeaders[name.toLowerCase()] = value;
    };

    res.write = function(chunk) {
      resData += chunk ? chunk.toString() : '';
    };

    res.end = function(chunk) {
      if (chunk) resData += chunk.toString();
      let json = null;
      try { json = JSON.parse(resData); } catch(e) {}
      resolve({ status: resStatusCode, headers: resHeaders, body: resData, json });
    };

    // Aciona o handler do servidor
    server.emit('request', req, res);

    if (body) {
      req.emit('data', typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.emit('end');
  });
}

async function runE2ETests() {
  console.log('--- Iniciando Testes HTTP E2E (In-Process) ---');

  // 1. Healthcheck
  const health = await simulateRequest('GET', '/api/health');
  assert.equal(health.status, 200);
  assert.equal(health.json.app, 'Northorya — Mapa dos Seus Padrões');
  console.log('✓ Healthcheck OK:', health.json.version);

  // 2. Configuração pública (link do Google Calendar)
  const conf = await simulateRequest('GET', '/api/config');
  assert.equal(conf.status, 200);
  assert.equal(conf.json.googleCalendarBookingUrl, 'https://calendar.app.google/fLHxUx7qa3H547bv7');
  console.log('✓ Public config Google Calendar URL OK:', conf.json.googleCalendarBookingUrl);

  // 3. Perguntas
  const questionsRes = await simulateRequest('GET', '/api/quiz/questions');
  assert.equal(questionsRes.status, 200);
  assert.equal(questionsRes.json.questions.length, 20);
  console.log('✓ 20 Perguntas recuperadas com sucesso');

  // 4. Início do Quiz
  const startRes = await simulateRequest('POST', '/api/quiz/start', { 'content-type': 'application/json' }, { origin: 'instagram' });
  assert.equal(startRes.status, 201);
  const leadId = startRes.json.leadId;
  assert.ok(leadId);
  console.log('✓ Quiz iniciado, leadId:', leadId);

  // 5. Conclusão do Quiz (Devolutiva Determinística)
  const submitRes = await simulateRequest('POST', '/api/quiz/submit', { 'content-type': 'application/json' }, {
    leadId,
    name: 'Edson Batista',
    whatsapp: '11999998888',
    origin: 'instagram',
    answers: {
      1: 'd', 2: 'd', 3: 'd', 4: 'd', // Máxima tensão em energia
      5: 'a', 6: 'a', 7: 'a', 8: 'a',
      9: 'a', 10: 'a', 11: 'a', 12: 'a',
      13: 'a', 14: 'a', 15: 'a', 16: 'a',
      17: 'a', 18: 'a', 19: 'a', 20: 'a'
    }
  });
  assert.equal(submitRes.status, 200);
  assert.ok(submitRes.json.devolutiva);
  assert.equal(submitRes.json.devolutiva.map.dominantDimension, 'energia_limites');
  assert.equal(submitRes.json.devolutiva.map.dimensions.energia_limites.percentage, 100);
  console.log('✓ Devolutiva determinística calculada com sucesso');

  // 6. Registro de intenção de agendamento (clique no botão do Calendar)
  const trackRes = await simulateRequest('POST', '/api/quiz/track-intent', { 'content-type': 'application/json' }, {
    leadId,
    action: 'click_calendar_button'
  });
  assert.equal(trackRes.status, 200);
  assert.equal(trackRes.json.status, 'link_agendamento_acessado');
  console.log('✓ Intenção de agendamento registrada como "link_agendamento_acessado" sem confirmação automática');

  // 7. Acesso ao Painel Admin CRM
  const adminRes = await simulateRequest('GET', '/api/admin/leads', {
    'authorization': `Bearer ${config.adminPassword}`
  });
  assert.equal(adminRes.status, 200);
  assert.ok(adminRes.json.leads.length >= 1);
  assert.ok(adminRes.json.metrics.acessosCalendar >= 1);
  console.log('✓ Painel Admin e Métricas do CRM validadas');

  console.log('\n=========================================');
  console.log('TODOS OS TESTES HTTP E2E FORAM APROVADOS!');
  console.log('=========================================\n');
}

runE2ETests();
