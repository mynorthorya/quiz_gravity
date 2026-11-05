import { db } from '../db/index.js';
import { config } from '../config.js';

export const configService = {
  getBookingUrl() {
    try {
      const stmt = db.prepare('SELECT value FROM settings WHERE key = ?');
      const row = stmt.get('google_calendar_booking_url');
      if (row && row.value && row.value.trim().length > 0) {
        return row.value.trim();
      }
    } catch (err) {
      console.warn('Erro ao ler URL do banco, usando fallback:', err.message);
    }
    return config.defaultBookingUrl;
  },

  setBookingUrl(url) {
    if (!url || typeof url !== 'string' || !url.startsWith('http')) {
      throw new Error('A URL de agendamento deve ser um endereço web válido (ex: https://...)');
    }
    const cleanUrl = url.trim();
    const now = new Date().toISOString();
    const stmt = db.prepare(`
      INSERT INTO settings (key, value, updated_at) 
      VALUES ('google_calendar_booking_url', ?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
    `);
    stmt.run(cleanUrl, now);
    return cleanUrl;
  }
};
