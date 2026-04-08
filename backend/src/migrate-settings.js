/**
 * Settings migration — adds settings table and seeds initial data.
 * Run once: node src/migrate-settings.js
 */
require('dotenv').config();
const pool = require('./db');

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS settings (
        key        VARCHAR(100) PRIMARY KEY,
        value      JSONB        NOT NULL,
        updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      );
    `);

    // ── prices ────────────────────────────────────────────────────────────────
    await client.query(`
      INSERT INTO settings (key, value) VALUES ('prices', $1)
      ON CONFLICT (key) DO NOTHING;
    `, [JSON.stringify({
      "super-wash":      { sedan: 50, pickup: 55, midsize: 60, fullsize: 65 },
      "wash-wax":        { sedan: 85, pickup: 90, midsize: 95, fullsize: 100 },
      "mini-detail":     { sedan: 150, pickup: 165, midsize: 175, fullsize: 185 },
      "complete-detail": { sedan: 275, pickup: 295, midsize: 315, fullsize: 335 }
    })]);

    // ── addons ────────────────────────────────────────────────────────────────
    await client.query(`
      INSERT INTO settings (key, value) VALUES ('addons', $1)
      ON CONFLICT (key) DO NOTHING;
    `, [JSON.stringify([
      { slug: 'clay-bar',        nombre_en: 'Clay Bar Treatment',      nombre_es: 'Tratamiento Clay Bar',           precio: 40, activo: true },
      { slug: 'engine-cleaning', nombre_en: 'Engine Cleaning',         nombre_es: 'Limpieza de Motor',              precio: 35, activo: true },
      { slug: 'ozone-treatment', nombre_en: 'Ozone Treatment',         nombre_es: 'Tratamiento de Ozono',           precio: 30, activo: true },
      { slug: 'ceramic-spray',   nombre_en: 'Ceramic Spray',           nombre_es: 'Spray Cerámico',                 precio: 45, activo: true },
      { slug: 'headlight-resto', nombre_en: 'Headlight Restoration',   nombre_es: 'Restauración de Faros',          precio: 50, activo: true },
      { slug: 'pet-hair',        nombre_en: 'Pet Hair Removal',        nombre_es: 'Remoción de Pelo de Mascota',    precio: 25, activo: true }
    ])]);

    // ── zones ─────────────────────────────────────────────────────────────────
    await client.query(`
      INSERT INTO settings (key, value) VALUES ('zones', $1)
      ON CONFLICT (key) DO NOTHING;
    `, [JSON.stringify([
      { zona: 1, nombre_en: 'Zone 1 — Irvine / OC Core',   nombre_es: 'Zona 1 — Irvine / Centro OC', fee: 0,  activo: true },
      { zona: 2, nombre_en: 'Zone 2 — Greater OC',          nombre_es: 'Zona 2 — OC Extendido',       fee: 10, activo: true },
      { zona: 3, nombre_en: 'Zone 3 — LA / East OC',        nombre_es: 'Zona 3 — LA / Este de OC',    fee: 20, activo: true },
      { zona: 4, nombre_en: 'Zone 4 — Inland Empire',       nombre_es: 'Zona 4 — Inland Empire',      fee: 35, activo: true }
    ])]);

    // ── schedule ──────────────────────────────────────────────────────────────
    await client.query(`
      INSERT INTO settings (key, value) VALUES ('schedule', $1)
      ON CONFLICT (key) DO NOTHING;
    `, [JSON.stringify({
      days: {
        mon: { enabled: true,  start: '08:00', end: '17:00' },
        tue: { enabled: true,  start: '08:00', end: '17:00' },
        wed: { enabled: true,  start: '08:00', end: '17:00' },
        thu: { enabled: true,  start: '08:00', end: '17:00' },
        fri: { enabled: true,  start: '08:00', end: '17:00' },
        sat: { enabled: true,  start: '09:00', end: '15:00' },
        sun: { enabled: false, start: '09:00', end: '14:00' }
      },
      holidays: [],
      sunday_surcharge: 0,
      holiday_surcharge: 0
    })]);

    // ── business ──────────────────────────────────────────────────────────────
    await client.query(`
      INSERT INTO settings (key, value) VALUES ('business', $1)
      ON CONFLICT (key) DO NOTHING;
    `, [JSON.stringify({
      name:    'Shine Pro Mobile Auto Spa',
      phone:   '+1 (714) 334-4582',
      email:   'andres@shinepro.net',
      address: 'Orange County, CA',
      instagram: '',
      facebook: ''
    })]);

    await client.query('COMMIT');
    console.log('✅  Settings migration complete.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌  Settings migration failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
