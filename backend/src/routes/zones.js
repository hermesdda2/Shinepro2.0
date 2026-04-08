const express = require('express');
const pool = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/zones — list all zones (public)
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM zones ORDER BY zona ASC');
    res.json(rows);
  } catch (err) {
    console.error('GET /zones error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /api/zones — create new zone (admin only)
router.post('/', requireAuth, async (req, res) => {
  const { nombre_en, nombre_es, fee = 0, activo = true } = req.body;
  if (!nombre_en) return res.status(400).json({ error: 'nombre_en is required' });
  try {
    // Auto-assign next zona number
    const { rows: maxRow } = await pool.query('SELECT COALESCE(MAX(zona), 0) + 1 AS next FROM zones');
    const nextZona = maxRow[0].next;
    const { rows } = await pool.query(
      `INSERT INTO zones (zona, nombre_en, nombre_es, fee, activo)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nextZona, nombre_en, nombre_es || nombre_en, Number(fee), activo]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('POST /zones error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT /api/zones/:id — update zone (admin only)
router.put('/:id', requireAuth, async (req, res) => {
  const { nombre_en, nombre_es, fee, activo } = req.body;
  try {
    const { rows: current } = await pool.query('SELECT * FROM zones WHERE id = $1', [req.params.id]);
    if (!current.length) return res.status(404).json({ error: 'Not found' });
    const z = current[0];
    const { rows } = await pool.query(
      `UPDATE zones SET nombre_en = $1, nombre_es = $2, fee = $3, activo = $4
       WHERE id = $5 RETURNING *`,
      [
        nombre_en !== undefined ? nombre_en : z.nombre_en,
        nombre_es !== undefined ? nombre_es : z.nombre_es,
        fee       !== undefined ? Number(fee) : z.fee,
        activo    !== undefined ? activo : z.activo,
        req.params.id,
      ]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error('PUT /zones/:id error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE /api/zones/:id — delete zone (admin only)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query('DELETE FROM zones WHERE id = $1 RETURNING id', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /zones/:id error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
