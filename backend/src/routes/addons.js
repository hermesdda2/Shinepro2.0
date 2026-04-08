const express = require('express');
const pool = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/addons — list all active addons (public, used by booking flow)
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM addons ORDER BY id ASC'
    );
    res.json(rows);
  } catch (err) {
    console.error('GET /addons error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /api/addons — create new addon (admin only)
router.post('/', requireAuth, async (req, res) => {
  const { nombre_en, nombre_es, precio, activo = true } = req.body;
  if (!nombre_en || precio === undefined || precio === null) {
    return res.status(400).json({ error: 'nombre_en and precio are required' });
  }
  // Generate a slug from the name
  const slug = nombre_en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now();
  try {
    const { rows } = await pool.query(
      `INSERT INTO addons (slug, nombre_en, nombre_es, precio, activo)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [slug, nombre_en, nombre_es || nombre_en, Number(precio), activo]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('POST /addons error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT /api/addons/:id — update addon (admin only)
router.put('/:id', requireAuth, async (req, res) => {
  const { nombre_en, nombre_es, precio, activo } = req.body;
  try {
    const { rows: current } = await pool.query('SELECT * FROM addons WHERE id = $1', [req.params.id]);
    if (!current.length) return res.status(404).json({ error: 'Not found' });
    const a = current[0];
    const { rows } = await pool.query(
      `UPDATE addons SET
         nombre_en = $1, nombre_es = $2, precio = $3, activo = $4
       WHERE id = $5 RETURNING *`,
      [
        nombre_en !== undefined ? nombre_en : a.nombre_en,
        nombre_es !== undefined ? nombre_es : a.nombre_es,
        precio    !== undefined ? Number(precio) : a.precio,
        activo    !== undefined ? activo : a.activo,
        req.params.id,
      ]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error('PUT /addons/:id error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE /api/addons/:id — delete addon (admin only)
// Existing bookings that reference this addon by name keep their data intact
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query('DELETE FROM addons WHERE id = $1 RETURNING id', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /addons/:id error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
