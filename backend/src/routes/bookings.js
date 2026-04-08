const express = require('express');
const pool = require('../db');

const router = express.Router();

// POST /api/bookings — create a new booking
router.post('/', async (req, res) => {
  const {
    nombre, email, telefono, direccion,
    zona, travel_fee, vehiculo, paquete,
    addons = [], fecha, hora, notas, total,
  } = req.body;

  // Basic required-field validation
  const missing = [];
  ['nombre', 'email', 'telefono', 'direccion', 'vehiculo', 'paquete', 'fecha', 'hora', 'total']
    .forEach(f => { if (!req.body[f]) missing.push(f); });

  if (missing.length) {
    return res.status(400).json({ error: 'Missing required fields', fields: missing });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO bookings
         (nombre, email, telefono, direccion, zona, travel_fee,
          vehiculo, paquete, addons, fecha, hora, notas, total)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       RETURNING *`,
      [nombre, email, telefono, direccion, zona || null, travel_fee || 0,
       vehiculo, paquete, addons, fecha, hora, notas || null, total]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('POST /bookings error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET /api/bookings — list all bookings (admin)
router.get('/', async (req, res) => {
  const { status, fecha } = req.query;

  let query = 'SELECT * FROM bookings';
  const params = [];
  const conditions = [];

  if (status) {
    params.push(status);
    conditions.push(`status = $${params.length}`);
  }
  if (fecha) {
    params.push(fecha);
    conditions.push(`fecha = $${params.length}`);
  }
  if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
  query += ' ORDER BY fecha ASC, hora ASC';

  try {
    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('GET /bookings error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET /api/bookings/:id — get single booking
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM bookings WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Booking not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('GET /bookings/:id error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// PATCH /api/bookings/:id/status — update status
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;
  if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status. Use: pending | confirmed | cancelled' });
  }

  try {
    const { rows } = await pool.query(
      'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Booking not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('PATCH /bookings/:id/status error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /api/bookings/manual — create booking manually from admin (no zone validation)
router.post('/manual', async (req, res) => {
  const {
    nombre, email, telefono, direccion,
    zona, travel_fee, vehiculo, paquete,
    addons = [], fecha, hora, notas, total,
  } = req.body;

  const missing = [];
  ['nombre', 'vehiculo', 'paquete', 'fecha', 'hora', 'total']
    .forEach(f => { if (!req.body[f]) missing.push(f); });

  if (missing.length) {
    return res.status(400).json({ error: 'Missing required fields', fields: missing });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO bookings
         (nombre, email, telefono, direccion, zona, travel_fee,
          vehiculo, paquete, addons, fecha, hora, notas, total, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,'confirmed')
       RETURNING *`,
      [nombre, email || null, telefono || null, direccion || '', zona || null,
       travel_fee || 0, vehiculo, paquete, addons, fecha, hora, notas || null, total]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('POST /bookings/manual error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
