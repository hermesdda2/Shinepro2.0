const express = require('express');
const pool = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

// GET /api/admin/bookings — list with advanced filters
router.get('/', async (req, res) => {
  const { status, fecha, search, limit = 100, offset = 0 } = req.query;

  let query = 'SELECT * FROM bookings';
  const params = [];
  const conditions = [];

  if (status && status !== 'all') {
    params.push(status);
    conditions.push(`status = $${params.length}`);
  }
  if (fecha) {
    params.push(fecha);
    conditions.push(`fecha = $${params.length}`);
  }
  if (search) {
    params.push(`%${search.toLowerCase()}%`);
    conditions.push(`(LOWER(nombre) LIKE $${params.length} OR LOWER(email) LIKE $${params.length})`);
  }

  if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
  query += ' ORDER BY fecha ASC, hora ASC';
  params.push(parseInt(limit, 10));
  query += ` LIMIT $${params.length}`;
  params.push(parseInt(offset, 10));
  query += ` OFFSET $${params.length}`;

  try {
    const { rows } = await pool.query(query, params);
    const count = await pool.query(
      'SELECT COUNT(*) FROM bookings' + (conditions.length ? ' WHERE ' + conditions.slice(0, -2).join(' AND ') : ''),
      params.slice(0, -2)
    );
    res.json({ bookings: rows, total: parseInt(count.rows[0].count, 10) });
  } catch (err) {
    console.error('GET /admin/bookings error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET /api/admin/bookings/stats/today — full dashboard stats
router.get('/stats/today', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Week bounds (Mon-Sun)
    const now = new Date();
    const dow = now.getDay(); // 0=Sun
    const diffToMon = (dow === 0 ? -6 : 1 - dow);
    const weekMon = new Date(now); weekMon.setDate(now.getDate() + diffToMon);
    const weekSun = new Date(weekMon); weekSun.setDate(weekMon.getDate() + 6);
    const weekStart = weekMon.toISOString().split('T')[0];
    const weekEnd   = weekSun.toISOString().split('T')[0];

    // Month bounds
    const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
    const monthEnd   = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

    const [
      todayCount, todayRevenue, weekCount, weekRevenue,
      pendingCount, cancelledWeek, cancelledMonth,
      pendingBookings, todayBookings, upcomingBookings,
      bookingsByDayWeek, cancellationsByDayWeek, servicesDist,
      nextAppt,
    ] = await Promise.all([
      // Today confirmed/pending count
      pool.query(`SELECT COUNT(*) FROM bookings WHERE fecha = $1 AND status != 'cancelled'`, [today]),
      // Today revenue (confirmed only)
      pool.query(`SELECT COALESCE(SUM(total),0) AS revenue FROM bookings WHERE fecha = $1 AND status = 'confirmed'`, [today]),
      // Week count (confirmed/pending)
      pool.query(`SELECT COUNT(*) FROM bookings WHERE fecha BETWEEN $1 AND $2 AND status != 'cancelled'`, [weekStart, weekEnd]),
      // Week revenue
      pool.query(`SELECT COALESCE(SUM(total),0) AS revenue FROM bookings WHERE fecha BETWEEN $1 AND $2 AND status = 'confirmed'`, [weekStart, weekEnd]),
      // All pending count
      pool.query(`SELECT COUNT(*) FROM bookings WHERE status = 'pending'`),
      // Cancelled this week
      pool.query(`SELECT COUNT(*) FROM bookings WHERE fecha BETWEEN $1 AND $2 AND status = 'cancelled'`, [weekStart, weekEnd]),
      // Cancelled this month
      pool.query(`SELECT COUNT(*) FROM bookings WHERE fecha BETWEEN $1 AND $2 AND status = 'cancelled'`, [monthStart, monthEnd]),
      // Full pending list
      pool.query(`SELECT * FROM bookings WHERE status = 'pending' ORDER BY fecha ASC, hora ASC LIMIT 20`),
      // Today's bookings ordered by time
      pool.query(`SELECT * FROM bookings WHERE fecha = $1 ORDER BY hora ASC`, [today]),
      // Upcoming (future confirmed/pending)
      pool.query(`SELECT * FROM bookings WHERE fecha > $1 AND status != 'cancelled' ORDER BY fecha ASC, hora ASC LIMIT 5`, [today]),
      // Confirmed bookings per day this week
      pool.query(`
        SELECT fecha::text, COUNT(*) as count
        FROM bookings
        WHERE fecha BETWEEN $1 AND $2 AND status != 'cancelled'
        GROUP BY fecha ORDER BY fecha
      `, [weekStart, weekEnd]),
      // Cancellations per day this week
      pool.query(`
        SELECT fecha::text, COUNT(*) as count
        FROM bookings
        WHERE fecha BETWEEN $1 AND $2 AND status = 'cancelled'
        GROUP BY fecha ORDER BY fecha
      `, [weekStart, weekEnd]),
      // Services distribution this month
      pool.query(`
        SELECT paquete, COUNT(*) as count
        FROM bookings
        WHERE fecha BETWEEN $1 AND $2 AND status != 'cancelled'
        GROUP BY paquete ORDER BY count DESC
      `, [monthStart, monthEnd]),
      // Next upcoming appointment today
      pool.query(`
        SELECT hora FROM bookings
        WHERE fecha = $1 AND status = 'confirmed'
        ORDER BY hora ASC LIMIT 1
      `, [today]),
    ]);

    // Build bookings_by_day array for Mon-Sun of this week
    const dayMap = {};
    (bookingsByDayWeek.rows || []).forEach(r => { dayMap[r.fecha] = parseInt(r.count, 10); });
    const cancelMap = {};
    (cancellationsByDayWeek.rows || []).forEach(r => { cancelMap[r.fecha] = parseInt(r.count, 10); });

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekMon); d.setDate(weekMon.getDate() + i);
      const ds = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('en-US', { weekday: 'short' });
      weekDays.push({ date: ds, label, bookings: dayMap[ds] || 0, cancellations: cancelMap[ds] || 0 });
    }

    // Services distribution with percentages
    const totalServices = servicesDist.rows.reduce((s, r) => s + parseInt(r.count, 10), 0);
    const servicesDistribution = servicesDist.rows.map(r => ({
      name: r.paquete,
      count: parseInt(r.count, 10),
      percentage: totalServices > 0 ? Math.round((parseInt(r.count, 10) / totalServices) * 100) : 0,
    }));

    res.json({
      // KPI numbers
      today_bookings:   parseInt(todayCount.rows[0].count, 10),
      today_revenue:    parseInt(todayRevenue.rows[0].revenue, 10),
      week_bookings:    parseInt(weekCount.rows[0].count, 10),
      week_revenue:     parseInt(weekRevenue.rows[0].revenue, 10),
      pending_confirm:  parseInt(pendingCount.rows[0].count, 10),
      cancelled_week:   parseInt(cancelledWeek.rows[0].count, 10),
      cancelled_month:  parseInt(cancelledMonth.rows[0].count, 10),
      next_appointment: nextAppt.rows[0]?.hora || null,
      // Lists
      pending_bookings:  pendingBookings.rows,
      today_bookings_list: todayBookings.rows,
      upcoming_bookings: upcomingBookings.rows,
      // Chart data
      week_days:            weekDays,
      services_distribution: servicesDistribution,
    });
  } catch (err) {
    console.error('GET /admin/bookings/stats/today error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET /api/admin/bookings/:id — full detail
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM bookings WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('GET /admin/bookings/:id error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// PATCH /api/admin/bookings/:id/status
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;
  if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  try {
    const { rows } = await pool.query(
      'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('PATCH /admin/bookings/:id/status error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
