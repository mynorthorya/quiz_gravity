import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Carregador simples e nativo de variáveis .env
function loadEnv() {
  const envPath = path.join(rootDir, '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

loadEnv();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  defaultBookingUrl: process.env.GOOGLE_CALENDAR_BOOKING_URL || 'https://calendar.app.google/fLHxUx7qa3H547bv7',
  adminPassword: process.env.ADMIN_PASSWORD || 'northorya-admin-2026',
  nodeEnv: process.env.NODE_ENV || 'production',
  rootDir,
  dbPath: path.join(rootDir, 'data', 'northorya_padroes.sqlite')
};
