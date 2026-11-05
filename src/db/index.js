import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from '../config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Garante que o diretório de dados existe
const dataDir = path.dirname(config.dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const db = new DatabaseSync(config.dbPath);

export function initDatabase() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  db.exec(schema);

  // Inicializa configuração padrão da URL se não existir
  const stmtCheck = db.prepare('SELECT value FROM settings WHERE key = ?');
  const existing = stmtCheck.get('google_calendar_booking_url');

  if (!existing) {
    const stmtInsert = db.prepare('INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?)');
    stmtInsert.run('google_calendar_booking_url', config.defaultBookingUrl, new Date().toISOString());
  }
}
