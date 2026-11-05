import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from './config.js';
import { initDatabase } from './db/index.js';
import { QUESTIONS, DIMENSIONS } from './services/quizEngine.js';
import { leadService } from './services/leadService.js';
import { configService } from './services/configService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '..', 'public');

// Inicializa o banco de dados SQLite
initDatabase();

// MIME Types
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Helper para ler o corpo JSON da requisição
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 1e6) {
        req.destroy();
        reject(new Error('Payload muito extenso'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(new Error('JSON inválido'));
      }
    });
    req.on('error', reject);
  });
}

// Helper para envio de resposta JSON
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

// Helper de autenticação admin
function checkAdminAuth(req) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return false;
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  return token === config.adminPassword;
}

// Servidor HTTP
const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const method = req.method.toUpperCase();

  // Tratamento de CORS Preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  try {
    // ================= ROTAS DE API =================

    // 1. Healthcheck
    if (pathname === '/api/health' && method === 'GET') {
      return sendJson(res, 200, {
        status: 'ok',
        app: 'Northorya — Mapa dos Seus Padrões',
        version: '1.1.0',
        timestamp: new Date().toISOString()
      });
    }

    // 2. Configurações Públicas (Link Oficial do Google Calendar)
    if (pathname === '/api/config' && method === 'GET') {
      return sendJson(res, 200, {
        googleCalendarBookingUrl: configService.getBookingUrl(),
        appName: 'Northorya — Mapa dos Seus Padrões',
        host: 'Edson Batista',
        durationMinutes: 30
      });
    }

    // 3. Perguntas do Quiz
    if (pathname === '/api/quiz/questions' && method === 'GET') {
      const sanitizedQuestions = QUESTIONS.map(q => ({
        id: q.id,
        dimension: q.dimension,
        text: q.text,
        options: q.options.map(o => ({ id: o.id, text: o.text }))
      }));
      return sendJson(res, 200, {
        questions: sanitizedQuestions,
        dimensions: DIMENSIONS
      });
    }

    // 4. Início do Quiz (rastreio de início e origem)
    if (pathname === '/api/quiz/start' && method === 'POST') {
      const body = await parseJsonBody(req);
      const userAgent = req.headers['user-agent'] || '';
      const result = leadService.startQuiz({
        origin: body.origin || 'direto',
        userAgent
      });
      return sendJson(res, 201, result);
    }

    // 5. Conclusão do Quiz e Devolutiva
    if (pathname === '/api/quiz/submit' && method === 'POST') {
      const body = await parseJsonBody(req);
      const { leadId, name, whatsapp, answers, origin, lgpdConsent } = body;

      const result = leadService.submitQuiz(leadId, {
        name,
        whatsapp,
        answers,
        origin,
        lgpdConsent: lgpdConsent !== false
      });

      return sendJson(res, 200, result);
    }

    // 6. Registro de intenção de agendamento (clique no botão do Calendar)
    if (pathname === '/api/quiz/track-intent' && method === 'POST') {
      const body = await parseJsonBody(req);
      const { leadId, action } = body;
      const result = leadService.trackBookingIntent(leadId, { action });
      return sendJson(res, 200, {
        ...result,
        bookingUrl: configService.getBookingUrl()
      });
    }

    // 7. Obtenção de resultado já salvo
    if (pathname.startsWith('/api/quiz/result/') && method === 'GET') {
      const leadId = pathname.replace('/api/quiz/result/', '').trim();
      const result = leadService.getResult(leadId);
      if (!result) {
        return sendJson(res, 404, { error: 'Resultado não encontrado' });
      }
      return sendJson(res, 200, result);
    }

    // 8. Login Admin
    if (pathname === '/api/admin/login' && method === 'POST') {
      const body = await parseJsonBody(req);
      if (body.password === config.adminPassword) {
        return sendJson(res, 200, {
          success: true,
          token: config.adminPassword
        });
      }
      return sendJson(res, 401, { error: 'Senha incorreta' });
    }

    // 9. Listagem de Leads (CRM)
    if (pathname === '/api/admin/leads' && method === 'GET') {
      if (!checkAdminAuth(req)) {
        return sendJson(res, 401, { error: 'Acesso restrito ao administrador' });
      }
      const status = parsedUrl.searchParams.get('status') || undefined;
      const origin = parsedUrl.searchParams.get('origin') || undefined;
      const search = parsedUrl.searchParams.get('search') || undefined;

      const data = leadService.listLeads({ status, origin, search });
      return sendJson(res, 200, data);
    }

    // 10. Atualização de Lead no CRM (status, anotações)
    if (pathname.startsWith('/api/admin/leads/') && method === 'PATCH') {
      if (!checkAdminAuth(req)) {
        return sendJson(res, 401, { error: 'Acesso restrito ao administrador' });
      }
      const leadId = pathname.replace('/api/admin/leads/', '').trim();
      const body = await parseJsonBody(req);
      const result = leadService.updateLeadAdmin(leadId, body);
      return sendJson(res, 200, result);
    }

    // 11. Atualização do link de agendamento pelo Admin
    if (pathname === '/api/admin/config' && method === 'POST') {
      if (!checkAdminAuth(req)) {
        return sendJson(res, 401, { error: 'Acesso restrito ao administrador' });
      }
      const body = await parseJsonBody(req);
      const updatedUrl = configService.setBookingUrl(body.googleCalendarBookingUrl);
      return sendJson(res, 200, {
        success: true,
        googleCalendarBookingUrl: updatedUrl
      });
    }

    // ================= ROTAS DE ARQUIVOS ESTÁTICOS =================

    let filePath = '';
    if (pathname === '/' || pathname === '/index.html') {
      filePath = path.join(publicDir, 'index.html');
    } else if (pathname === '/resultado' || pathname === '/resultado.html') {
      filePath = path.join(publicDir, 'resultado.html');
    } else if (pathname === '/admin' || pathname === '/admin.html') {
      filePath = path.join(publicDir, 'admin.html');
    } else {
      filePath = path.join(publicDir, pathname);
    }

    // Prevenção de Path Traversal
    const safePath = path.normalize(filePath);
    if (!safePath.startsWith(publicDir)) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Acesso Negado');
    }

    if (fs.existsSync(safePath) && fs.statSync(safePath).isFile()) {
      const ext = path.extname(safePath).toLowerCase();
      const mime = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': mime });
      fs.createReadStream(safePath).pipe(res);
      return;
    }

    // Fallback 404
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Página não encontrada');

  } catch (err) {
    console.error('Erro na requisição:', err);
    sendJson(res, 500, { error: err.message || 'Erro interno do servidor' });
  }
});

// Inicialização quando executado diretamente
const isMain = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isMain) {
  server.listen(config.port, '0.0.0.0', () => {
    console.log(`\n=================================================`);
    console.log(` NORTHORYA — MAPA DOS SEUS PADRÕES (V1.1)`);
    console.log(` Servidor rodando na porta ${config.port}`);
    console.log(` Agendamento Google: ${configService.getBookingUrl()}`);
    console.log(`=================================================\n`);
  });
}

export { server };
