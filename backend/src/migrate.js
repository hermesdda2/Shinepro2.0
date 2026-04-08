/**
 * Database migration — creates all tables and seeds initial data.
 * Run once: node src/migrate.js
 */
require('dotenv').config();
const pool = require('./db');

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // ── zones ────────────────────────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS zones (
        id         SERIAL PRIMARY KEY,
        zona       INTEGER NOT NULL UNIQUE,
        nombre_en  TEXT    NOT NULL,
        nombre_es  TEXT    NOT NULL,
        fee        INTEGER NOT NULL DEFAULT 0,
        activo     BOOLEAN NOT NULL DEFAULT TRUE
      );
    `);

    // ── services ─────────────────────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS services (
        id              SERIAL  PRIMARY KEY,
        slug            TEXT    NOT NULL UNIQUE,
        nombre_en       TEXT    NOT NULL,
        nombre_es       TEXT    NOT NULL,
        duracion        INTEGER NOT NULL,
        -- price per vehicle type (USD)
        precio_sedan    INTEGER NOT NULL,
        precio_pickup   INTEGER NOT NULL,
        precio_midsize  INTEGER NOT NULL,
        precio_fullsize INTEGER NOT NULL,
        activo          BOOLEAN NOT NULL DEFAULT TRUE
      );
    `);

    // ── addons ───────────────────────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS addons (
        id        SERIAL  PRIMARY KEY,
        slug      TEXT    NOT NULL UNIQUE,
        nombre_en TEXT    NOT NULL,
        nombre_es TEXT    NOT NULL,
        precio    INTEGER NOT NULL,
        activo    BOOLEAN NOT NULL DEFAULT TRUE
      );
    `);

    // ── bookings ─────────────────────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id          SERIAL      PRIMARY KEY,
        nombre      TEXT        NOT NULL,
        email       TEXT        NOT NULL,
        telefono    TEXT        NOT NULL,
        direccion   TEXT        NOT NULL,
        zona        INTEGER     REFERENCES zones(zona),
        travel_fee  INTEGER     NOT NULL DEFAULT 0,
        vehiculo    TEXT        NOT NULL,
        paquete     TEXT        NOT NULL,
        addons      TEXT[]      NOT NULL DEFAULT '{}',
        fecha       DATE        NOT NULL,
        hora        TEXT        NOT NULL,
        notas       TEXT,
        total       INTEGER     NOT NULL,
        status      TEXT        NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','confirmed','cancelled')),
        created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // ── seed zones ────────────────────────────────────────────────────────────
    await client.query(`
      INSERT INTO zones (zona, nombre_en, nombre_es, fee) VALUES
        (1, 'Zone 1 — Free', 'Zona 1 — Gratis', 0),
        (2, 'Zone 2',        'Zona 2',           10),
        (3, 'Zone 3',        'Zona 3',           20),
        (4, 'Zone 4',        'Zona 4',           35)
      ON CONFLICT (zona) DO NOTHING;
    `);

    // ── seed services ─────────────────────────────────────────────────────────
    await client.query(`
      INSERT INTO services (slug, nombre_en, nombre_es, duracion, precio_sedan, precio_pickup, precio_midsize, precio_fullsize) VALUES
        ('super-wash',       'Super Wash',        'Super Lavado',       60,  50,  55,  60,  65),
        ('wash-wax',         'Wash & Wax',         'Lavado y Cera',      90,  85,  90,  95, 100),
        ('mini-detail',      'Mini Detail',        'Mini Detallado',    150, 150, 165, 175, 185),
        ('complete-detail',  'Complete Detail',    'Detallado Completo', 240, 275, 295, 315, 335)
      ON CONFLICT (slug) DO NOTHING;
    `);

    // ── seed addons ───────────────────────────────────────────────────────────
    await client.query(`
      INSERT INTO addons (slug, nombre_en, nombre_es, precio) VALUES
        ('clay-bar',        'Clay Bar Treatment',  'Tratamiento Clay Bar', 40),
        ('engine-cleaning', 'Engine Cleaning',     'Limpieza de Motor',    35),
        ('ozone-treatment', 'Ozone Treatment',     'Tratamiento de Ozono', 30),
        ('ceramic-spray',   'Ceramic Spray',       'Spray Cerámico',       45),
        ('headlight-resto', 'Headlight Restoration','Restauración de Faros',50),
        ('pet-hair',        'Pet Hair Removal',    'Remoción de Pelo de Mascota', 25)
      ON CONFLICT (slug) DO NOTHING;
    `);

    await client.query('COMMIT');
    console.log('✅  Migration complete — all tables created and seeded.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌  Migration failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
