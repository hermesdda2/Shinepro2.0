const express = require('express');
const pool = require('../db');

const router = express.Router();

// GET /api/services — list all active services
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM services WHERE activo = TRUE ORDER BY duracion ASC'
    );
    res.json(rows);
  } catch (err) {
    console.error('GET /services error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
