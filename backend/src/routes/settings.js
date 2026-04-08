const express = require('express');
const pool = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

async function getSetting(key) {
  const { rows } = await pool.query('SELECT value FROM settings WHERE key = $1', [key]);
  return rows[0]?.value ?? null;
}

async function setSetting(key, value) {
  await pool.query(`
    INSERT INTO settings (key, value, updated_at) VALUES ($1, $2, NOW())
    ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()
  `, [key, JSON.stringify(value)]);
}

// GET /api/settings — all settings
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT key, value FROM settings ORDER BY key');
    const result = {};
    rows.forEach(r => { result[r.key] = r.value; });
    res.json(result);
  } catch (err) {
    console.error('GET /settings error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT /api/settings/prices
router.put('/prices', async (req, res) => {
  try {
    await setSetting('prices', req.body);
    // Also sync to services table
    const prices = req.body;
    for (const [slug, vehiclePrices] of Object.entries(prices)) {
      await pool.query(`
        UPDATE services SET
          precio_sedan    = $1,
          precio_pickup   = $2,
          precio_midsize  = $3,
          precio_fullsize = $4,
          nombre_en       = COALESCE($5, nombre_en),
          nombre_es       = COALESCE($6, nombre_es)
        WHERE slug = $7
      `, [
        vehiclePrices.sedan,
        vehiclePrices.pickup,
        vehiclePrices.midsize,
        vehiclePrices.fullsize,
        vehiclePrices.name_en || null,
        vehiclePrices.name_es || null,
        slug,
      ]);
    }
    res.json({ ok: true });
  } catch (err) {
    console.error('PUT /settings/prices error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT /api/settings/addons
router.put('/addons', async (req, res) => {
  try {
    await setSetting('addons', req.body);
    // Sync addons table
    for (const addon of req.body) {
      await pool.query(
        'UPDATE addons SET precio = $1, activo = $2 WHERE slug = $3',
        [addon.precio, addon.activo, addon.slug]
      );
    }
    res.json({ ok: true });
  } catch (err) {
    console.error('PUT /settings/addons error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT /api/settings/zones
router.put('/zones', async (req, res) => {
  try {
    await setSetting('zones', req.body);
    // Sync zones table
    for (const zone of req.body) {
      await pool.query(
        'UPDATE zones SET fee = $1, activo = $2 WHERE zona = $3',
        [zone.fee, zone.activo, zone.zona]
      );
    }
    res.json({ ok: true });
  } catch (err) {
    console.error('PUT /settings/zones error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT /api/settings/schedule
router.put('/schedule', async (req, res) => {
  try {
    await setSetting('schedule', req.body);
    res.json({ ok: true });
  } catch (err) {
    console.error('PUT /settings/schedule error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT /api/settings/business
router.put('/business', async (req, res) => {
  try {
    await setSetting('business', req.body);
    res.json({ ok: true });
  } catch (err) {
    console.error('PUT /settings/business error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
