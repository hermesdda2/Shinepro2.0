import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import { useAdminAuth } from '../AdminAuthContext';
import { useLang } from '../LangContext';
import { API_URL as API } from '../config';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

// ── Helpers ───────────────────────────────────────────────────────────────────
const STATUS_STYLE = {
  pending:   { bg: 'rgba(255,215,0,0.1)',  color: '#FFD700', border: 'rgba(255,215,0,0.3)',  label: 'Pending',   labelEs: 'Pendiente'  },
  confirmed: { bg: 'rgba(34,197,94,0.1)',  color: '#22c55e', border: 'rgba(34,197,94,0.3)',  label: 'Confirmed', labelEs: 'Confirmado' },
  cancelled: { bg: 'rgba(239,68,68,0.1)',  color: '#ef4444', border: 'rgba(239,68,68,0.3)',  label: 'Cancelled', labelEs: 'Cancelado'  },
};

const PIE_COLORS = ['#FFD700', '#FFA500', '#FF6B00', '#FF3B00', '#CC3300', '#991F00'];

function pad(n) { return String(n).padStart(2, '0'); }
function dateStr(d) { return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; }

function StatusBadge({ status, lang }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.pending;
  return (
    <span style={{
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      padding: '2px 9px', borderRadius: '50px', fontSize: '0.67rem', fontWeight: 700, whiteSpace: 'nowrap',
    }}>
      {lang === 'es' ? s.labelEs : s.label}
    </span>
  );
}

// ── Real-time clock ───────────────────────────────────────────────────────────
function Clock({ lang }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const TZ = 'America/Los_Angeles';
  const locale = lang === 'es' ? 'es-US' : 'en-US';

  const h = parseInt(time.toLocaleString('en-US', { hour: 'numeric', hour12: false, timeZone: TZ }), 10);
  const greeting = h < 12
    ? (lang === 'es' ? 'Buenos días' : 'Good morning')
    : h < 18
      ? (lang === 'es' ? 'Buenas tardes' : 'Good afternoon')
      : (lang === 'es' ? 'Buenas noches' : 'Good evening');

  const timeStr = time.toLocaleTimeString(locale, {
    hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: TZ,
  });
  const dateLabel = time.toLocaleDateString(locale, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: TZ,
  });

  return (
    <div style={{ textAlign: 'right' }}>
      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFD700', fontFamily: 'monospace', letterSpacing: '0.05em', lineHeight: 1 }}>{timeStr}</div>
      <div style={{ fontSize: '0.75rem', color: '#3a4a6b', marginTop: '3px', textTransform: 'capitalize' }}>{dateLabel}</div>
      <div style={{ fontSize: '0.78rem', color: '#9a9a9a', marginTop: '2px' }}>
        {greeting}, <span style={{ color: '#FFD700', fontWeight: 700 }}>Andrés</span> 👋
      </div>
    </div>
  );
}

// ── KPI Card ──────────────────────────────────────────────────────────────────
function KpiCard({ icon, label, value, accent, prefix = '', loading }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: '#0f1219',
        border: `1px solid ${hov ? 'rgba(255,215,0,0.25)' : '#1a2035'}`,
        borderRadius: '20px', padding: '1.5rem',
        display: 'flex', flexDirection: 'column', gap: '10px',
        transition: 'all 0.2s ease',
        transform: hov ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hov ? '0 8px 32px rgba(0,0,0,0.3)' : 'none',
      }}
    >
      <div style={{
        width: '42px', height: '42px', borderRadius: '12px',
        background: 'rgba(255,255,255,0.04)', border: '1px solid #1a2035',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: '2.5rem', fontWeight: 800, color: accent || '#fff', lineHeight: 1, letterSpacing: '-0.02em' }}>
          {loading ? '—' : `${prefix}${value}`}
        </div>
        <div style={{ fontSize: '0.78rem', color: '#3a4a6b', fontWeight: 500, marginTop: '6px' }}>{label}</div>
      </div>
    </div>
  );
}

// ── Confirmation Modal (inline) ───────────────────────────────────────────────
function ConfirmModal({ title, message, confirmLabel, confirmColor = '#FFD700', confirmTextColor = '#000', cancelLabel, onConfirm, onCancel }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: '#0f1219', border: '1px solid #2a2a2a', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '360px', boxShadow: '0 32px 80px rgba(0,0,0,0.7)', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{confirmColor === '#FFD700' ? '⚠️' : '🗑️'}</div>
        <h3 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.75rem', color: '#fff' }}>{title}</h3>
        <p style={{ color: '#9a9a9a', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>{message}</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onCancel} style={{ flex: 1, padding: '11px', borderRadius: '50px', background: 'transparent', border: '1px solid #1a2035', color: '#9a9a9a', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem' }}>{cancelLabel}</button>
          <button onClick={onConfirm} style={{ flex: 1, padding: '11px', borderRadius: '50px', background: confirmColor, color: confirmTextColor, border: 'none', fontWeight: 800, cursor: 'pointer', fontSize: '0.88rem' }}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

// ── KPI Slider (mobile only) ──────────────────────────────────────────────────
function KpiSlider({ children, loading }) {
  const cards = Array.isArray(children) ? children : [children];
  const total = cards.length;
  const [idx, setIdx] = useState(0);
  const autoPlayRef = useRef(null);
  const touchStartX = useRef(null);
  const pauseTimeoutRef = useRef(null);

  const startAutoPlay = () => {
    clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      setIdx(prev => (prev + 1) % total);
    }, 3000);
  };

  const pauseAutoPlay = (resumeAfter = 4000) => {
    clearInterval(autoPlayRef.current);
    clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(startAutoPlay, resumeAfter);
  };

  useEffect(() => {
    startAutoPlay();
    return () => {
      clearInterval(autoPlayRef.current);
      clearTimeout(pauseTimeoutRef.current);
    };
  }, [total]);

  const goTo = (i) => {
    setIdx(i);
    pauseAutoPlay();
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      setIdx(prev => (prev + (diff > 0 ? 1 : -1) + total) % total);
      pauseAutoPlay();
    }
    touchStartX.current = null;
  };

  return (
    <div style={{ marginBottom: '2rem' }}>
      {/* Slider track */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ position: 'relative', overflow: 'hidden', touchAction: 'pan-y' }}
      >
        <div style={{
          display: 'flex',
          transform: `translateX(calc(-${idx * 100}% - ${idx * 0}px))`,
          transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          {cards.map((card, i) => (
            <div key={i} style={{
              flex: '0 0 100%',
              display: 'flex',
              justifyContent: 'center',
              padding: '0 5%',
              boxSizing: 'border-box',
            }}>
              <div style={{ width: '100%' }}>
                {card}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '7px', marginTop: '1rem' }}>
        {cards.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              width: i === idx ? '22px' : '7px',
              height: '7px',
              borderRadius: '50px',
              background: i === idx ? '#FFD700' : '#2a3555',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Chart Wrapper Card ────────────────────────────────────────────────────────
function ChartCard({ title, children }) {
  return (
    <div style={{ background: '#0f1219', border: '1px solid #1a2035', borderRadius: '20px', padding: '1.5rem', overflow: 'hidden' }}>
      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#9a9a9a', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{title}</div>
      {children}
    </div>
  );
}

const darkTooltipStyle = {
  contentStyle: { background: '#0f1219', border: '1px solid #1a2035', borderRadius: '10px', fontSize: '0.78rem', color: '#fff' },
  itemStyle: { color: '#fff' },
  labelStyle: { color: '#9a9a9a', fontWeight: 700 },
  cursor: { fill: 'rgba(255,255,255,0.03)' },
};

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { token } = useAdminAuth();
  const { lang } = useLang();
  const navigate = useNavigate();
  const t = (en, es) => lang === 'es' ? es : en;
  const headers = { Authorization: `Bearer ${token}` };

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('day'); // day | week | month
  const [agendaDate, setAgendaDate] = useState(new Date());
  const [confirmAction, setConfirmAction] = useState(null); // { id, action: 'confirmed'|'cancelled', nombre }
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/admin/bookings/stats/today`, { headers });
      if (res.ok) setStats(await res.json());
    } catch { /* silent — UI shows empty state */ }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const changeStatus = async (id, status) => {
    setConfirmAction(null);
    await fetch(`${API}/api/admin/bookings/${id}/status`, {
      method: 'PATCH',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchStats();
  };

  // KPI values per period
  const kpiValues = {
    day: {
      bookings:    stats?.today_bookings ?? 0,
      bookingsLbl: t('Bookings Today', 'Citas Hoy'),
      revenue:     stats?.today_revenue ?? 0,
      revenueLbl:  t("Today's Revenue", 'Ingresos Hoy'),
    },
    week: {
      bookings:    stats?.week_bookings ?? 0,
      bookingsLbl: t('Bookings This Week', 'Citas Esta Semana'),
      revenue:     stats?.week_revenue ?? 0,
      revenueLbl:  t('Weekly Revenue', 'Ingresos Semana'),
    },
    month: {
      bookings:    stats?.week_bookings ?? 0,
      bookingsLbl: t('Bookings This Month', 'Citas Este Mes'),
      revenue:     stats?.week_revenue ?? 0,
      revenueLbl:  t('Monthly Revenue', 'Ingresos Mes'),
    },
  };
  const kpi = kpiValues[period];

  // Agenda day data
  const agendaDateStr = dateStr(agendaDate);
  const agendaBookings = (stats?.today_bookings_list || []).filter(b => b.fecha?.slice(0,10) === agendaDateStr);
  const today = dateStr(new Date());

  const shiftAgenda = (dir) => {
    setAgendaDate(prev => {
      const d = new Date(prev); d.setDate(d.getDate() + dir); return d;
    });
  };

  // Section heading style
  const secHeading = {
    fontSize: '1rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.01em',
    display: 'flex', alignItems: 'center', gap: '8px',
  };

  const pendingList = stats?.pending_bookings || [];
  const upcomingList = stats?.upcoming_bookings || [];
  const weekDays = stats?.week_days || [];
  const servDist = stats?.services_distribution || [];

  return (
    <AdminLayout title={t('Dashboard', 'Dashboard')}>

      {/* ── Top: Clock ──────────────────────────────────────────────────────── */}
      {!isMobile && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
          <Clock lang={lang} />
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SECCIÓN 1 — SOLICITUDES PENDIENTES
      ══════════════════════════════════════════════════════════════════════ */}
      <div style={{ background: '#0f1219', border: `1px solid ${pendingList.length > 0 ? 'rgba(255,215,0,0.3)' : '#1a2035'}`, borderRadius: '20px', marginBottom: '2rem', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #1a2035', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: pendingList.length > 0 ? 'rgba(255,215,0,0.03)' : 'transparent' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: pendingList.length > 0 ? 'rgba(255,215,0,0.12)' : 'rgba(255,255,255,0.04)', border: `1px solid ${pendingList.length > 0 ? 'rgba(255,215,0,0.3)' : '#1a2035'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
              🔔
            </div>
            <div>
              <div style={secHeading}>
                {t('Pending Requests', 'Solicitudes Pendientes')}
                {pendingList.length > 0 && (
                  <span style={{ background: '#FFD700', color: '#000', fontSize: '0.7rem', fontWeight: 900, padding: '2px 8px', borderRadius: '50px' }}>
                    {pendingList.length}
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.73rem', color: '#3a4a6b', marginTop: '2px' }}>
                {t('New bookings that need confirmation', 'Citas nuevas que necesitan confirmación')}
              </div>
            </div>
          </div>
          <button
            onClick={fetchStats}
            style={{ padding: '7px 14px', borderRadius: '50px', background: 'transparent', border: '1px solid #1a2035', color: '#9a9a9a', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#FFD700'; e.currentTarget.style.color = '#FFD700'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#1a2035'; e.currentTarget.style.color = '#9a9a9a'; }}
          >
            ↻ {t('Refresh', 'Actualizar')}
          </button>
        </div>

        {/* Body */}
        {pendingList.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📅</div>
            <div style={{ fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
              {t('No pending requests', 'No hay citas nuevas por confirmar')}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#3a4a6b', maxWidth: '340px', margin: '0 auto', lineHeight: 1.6 }}>
              {t('When a client books, it will appear here automatically.', 'Cuando un cliente agende aparecerá aquí automáticamente.')}
            </div>
          </div>
        ) : (
          <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
            {pendingList.map((b, i) => (
              <div key={b.id} style={{
                display: 'flex', flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'flex-start' : 'center',
                gap: '12px', padding: isMobile ? '14px 1rem' : '14px 1.5rem',
                borderBottom: i < pendingList.length - 1 ? '1px solid #1a2035' : 'none',
                transition: 'background 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.015)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Top row on mobile: avatar + info + date */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
                  {/* Avatar */}
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 800, color: '#FFD700', flexShrink: 0 }}>
                    {b.nombre?.[0]?.toUpperCase() || '?'}
                  </div>
                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: isMobile ? 'normal' : 'nowrap' }}>{b.nombre}</div>
                    <div style={{ fontSize: '0.75rem', color: '#9a9a9a' }}>{b.paquete} · {b.vehiculo}</div>
                  </div>
                  {/* Date/Time */}
                  <div style={{ flexShrink: 0, textAlign: 'right' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFD700' }}>{b.hora}</div>
                    <div style={{ fontSize: '0.7rem', color: '#3a4a6b' }}>{b.fecha?.slice(0, 10)}</div>
                  </div>
                </div>
                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0, width: isMobile ? '100%' : 'auto' }}>
                  <button
                    onClick={() => setConfirmAction({ id: b.id, action: 'confirmed', nombre: b.nombre, fecha: b.fecha?.slice(0,10), hora: b.hora })}
                    style={{ flex: isMobile ? 1 : 'none', padding: '10px 14px', borderRadius: '50px', background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)', color: '#FFD700', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap', minHeight: '44px' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#FFD700'; e.currentTarget.style.color = '#000'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,215,0,0.1)'; e.currentTarget.style.color = '#FFD700'; }}
                  >
                    ✓ {t('Confirm', 'Confirmar')}
                  </button>
                  <button
                    onClick={() => setConfirmAction({ id: b.id, action: 'cancelled', nombre: b.nombre, fecha: b.fecha?.slice(0,10), hora: b.hora })}
                    style={{ flex: isMobile ? 1 : 'none', padding: '10px 14px', borderRadius: '50px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap', minHeight: '44px' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
                  >
                    ✗ {t('Reject', 'Rechazar')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          SECCIÓN 2 — PERIOD TOGGLE + KPI CARDS
      ══════════════════════════════════════════════════════════════════════ */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '10px' }}>
        <div style={secHeading}>📊 {t('Performance', 'Rendimiento')}</div>
        {/* Period toggle */}
        <div style={{ display: 'flex', background: '#0f1219', border: '1px solid #1a2035', borderRadius: '10px', overflow: 'hidden' }}>
          {[['day', t('Day','Día')], ['week', t('Week','Semana')], ['month', t('Month','Mes')]].map(([v, lbl]) => (
            <button key={v} onClick={() => setPeriod(v)} style={{
              padding: '7px 16px', border: 'none',
              background: period === v ? 'rgba(255,215,0,0.12)' : 'transparent',
              color: period === v ? '#FFD700' : '#3a4a6b',
              fontWeight: period === v ? 700 : 500, fontSize: '0.8rem',
              cursor: 'pointer', transition: 'all 0.15s',
              borderRight: v !== 'month' ? '1px solid #1a2035' : 'none',
            }}>{lbl}</button>
          ))}
        </div>
      </div>

      {isMobile ? (
        <KpiSlider loading={loading}>
          <KpiCard icon="📅" label={kpi.bookingsLbl}  value={kpi.bookings}                        accent="#fff"    loading={loading} />
          <KpiCard icon="📆" label={t('This Week','Esta Semana')} value={stats?.week_bookings ?? 0} accent="#22c55e" loading={loading} />
          <KpiCard icon="⏳" label={t('Pending Confirm','Por Confirmar')} value={stats?.pending_confirm ?? 0} accent="#FFD700" loading={loading} />
          <KpiCard icon="✗"  label={t('Cancellations','Cancelaciones')}   value={period === 'month' ? (stats?.cancelled_month ?? 0) : (stats?.cancelled_week ?? 0)} accent="#ef4444" loading={loading} />
        </KpiSlider>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <KpiCard icon="📅" label={kpi.bookingsLbl}  value={kpi.bookings}                        accent="#fff"    loading={loading} />
          <KpiCard icon="📆" label={t('This Week','Esta Semana')} value={stats?.week_bookings ?? 0} accent="#22c55e" loading={loading} />
          <KpiCard icon="⏳" label={t('Pending Confirm','Por Confirmar')} value={stats?.pending_confirm ?? 0} accent="#FFD700" loading={loading} />
          <KpiCard icon="✗"  label={t('Cancellations','Cancelaciones')}   value={period === 'month' ? (stats?.cancelled_month ?? 0) : (stats?.cancelled_week ?? 0)} accent="#ef4444" loading={loading} />
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SECCIÓN 3 — GRÁFICAS
      ══════════════════════════════════════════════════════════════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>

        {/* Bar: Bookings per day */}
        <ChartCard title={t('Bookings per day — This week', 'Lavados por día — Esta semana')}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weekDays} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2035" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: '#3a4a6b', fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fill: '#3a4a6b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip {...darkTooltipStyle} formatter={(v) => [v, t('Bookings','Citas')]} />
              <Bar dataKey="bookings" fill="#FFD700" radius={[6,6,0,0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Bar: Cancellations per day */}
        <ChartCard title={t('Cancellations — This week', 'Cancelaciones — Esta semana')}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weekDays} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2035" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: '#3a4a6b', fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fill: '#3a4a6b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip {...darkTooltipStyle} formatter={(v) => [v, t('Cancellations','Cancelaciones')]} />
              <Bar dataKey="cancellations" fill="rgba(239,68,68,0.7)" radius={[6,6,0,0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Donut: Services distribution */}
      {servDist.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <ChartCard title={t('Most requested services — This month', 'Servicios más pedidos — Este mes')}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '2rem' }}>
              <ResponsiveContainer width={260} height={220}>
                <PieChart>
                  <Pie data={servDist} dataKey="count" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3}>
                    {servDist.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#0f1219', border: '1px solid #1a2035', borderRadius: '10px', fontSize: '0.78rem', color: '#fff' }}
                    formatter={(v, name, props) => [`${v} citas (${props.payload.percentage}%)`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Legend */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {servDist.map((s, i) => (
                  <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: PIE_COLORS[i % PIE_COLORS.length], flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>{s.name}</div>
                      <div style={{ fontSize: '0.7rem', color: '#3a4a6b' }}>{s.count} {t('bookings','citas')} · {s.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SECCIÓN 4 — AGENDA DEL DÍA + PRÓXIMAS CITAS
      ══════════════════════════════════════════════════════════════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem' }}>

        {/* Agenda del Día */}
        <div style={{ background: '#0f1219', border: '1px solid #1a2035', borderRadius: '20px', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #1a2035', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={secHeading}>📋 {t("Today's Schedule", 'Agenda del Día')}</div>
              <div style={{ fontSize: '0.72rem', color: '#3a4a6b', marginTop: '3px', textTransform: 'capitalize' }}>
                {agendaDate.toLocaleDateString(lang === 'es' ? 'es-US' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <NavBtn onClick={() => shiftAgenda(-1)}>←</NavBtn>
              <button onClick={() => setAgendaDate(new Date())} style={{ padding: '5px 10px', borderRadius: '8px', background: agendaDateStr === today ? 'rgba(255,215,0,0.1)' : 'transparent', border: `1px solid ${agendaDateStr === today ? 'rgba(255,215,0,0.3)' : '#1a2035'}`, color: agendaDateStr === today ? '#FFD700' : '#9a9a9a', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>
                {t('Today', 'Hoy')}
              </button>
              <NavBtn onClick={() => shiftAgenda(1)}>→</NavBtn>
            </div>
          </div>
          <div style={{ padding: '0.5rem 0' }}>
            {agendaBookings.length === 0 ? (
              <div style={{ padding: '2.5rem', textAlign: 'center', color: '#3a4a6b', fontSize: '0.85rem' }}>
                {t('No bookings for this day', 'Sin citas para este día')}
              </div>
            ) : (
              agendaBookings.map(b => (
                <div key={b.id} style={{ display: 'flex', gap: '12px', padding: '10px 1.5rem', borderBottom: '1px solid #0a0d14', alignItems: 'flex-start', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.015)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {/* Time dot */}
                  <div style={{ flexShrink: 0, paddingTop: '3px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: STATUS_STYLE[b.status]?.color || '#FFD700', border: '2px solid rgba(255,255,255,0.1)' }} />
                    <div style={{ width: '1px', flex: 1, background: '#1a2035', minHeight: '20px' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#FFD700', marginBottom: '3px' }}>{b.hora}</div>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.nombre}</div>
                    <div style={{ fontSize: '0.75rem', color: '#9a9a9a' }}>{b.paquete} · {b.vehiculo}</div>
                    {b.direccion && <div style={{ fontSize: '0.72rem', color: '#3a4a6b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.direccion}</div>}
                    <div style={{ marginTop: '5px' }}><StatusBadge status={b.status} lang={lang} /></div>
                  </div>
                  <div style={{ fontWeight: 800, color: '#22c55e', fontSize: '0.88rem', flexShrink: 0 }}>${b.total}</div>
                </div>
              ))
            )}
          </div>
          <div style={{ padding: '0.75rem 1.5rem', borderTop: '1px solid #1a2035' }}>
            <button onClick={() => navigate('/admin/bookings')} style={{ background: 'none', border: 'none', color: '#FFD700', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.02em', padding: 0 }}>
              {t('View all bookings →', 'Ver todas las citas →')}
            </button>
          </div>
        </div>

        {/* Próximas Citas */}
        <div style={{ background: '#0f1219', border: '1px solid #1a2035', borderRadius: '20px', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #1a2035' }}>
            <div style={secHeading}>🕐 {t('Upcoming Bookings', 'Próximas Citas')}</div>
            <div style={{ fontSize: '0.72rem', color: '#3a4a6b', marginTop: '3px' }}>
              {t('Next 5 confirmed appointments', 'Próximas 5 citas confirmadas')}
            </div>
          </div>
          <div style={{ padding: '0.5rem 0' }}>
            {upcomingList.length === 0 ? (
              <div style={{ padding: '2.5rem', textAlign: 'center', color: '#3a4a6b', fontSize: '0.85rem' }}>
                {t('No upcoming bookings', 'Sin próximas citas')}
              </div>
            ) : (
              upcomingList.map(b => {
                const bDate = new Date(b.fecha + 'T12:00:00');
                const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
                const isTomorrow = b.fecha?.slice(0,10) === dateStr(tomorrow);
                const dateDisplay = isTomorrow
                  ? t('Tomorrow', 'Mañana')
                  : bDate.toLocaleDateString(lang === 'es' ? 'es-US' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric' });

                return (
                  <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 1.5rem', borderBottom: '1px solid #0a0d14', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.015)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Status dot */}
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: STATUS_STYLE[b.status]?.color || '#FFD700', flexShrink: 0 }} />
                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {b.nombre?.split(' ')[0]} {b.nombre?.split(' ')[1]?.[0] || ''}.
                      </div>
                      <div style={{ fontSize: '0.73rem', color: '#9a9a9a' }}>{b.paquete}</div>
                    </div>
                    {/* Date */}
                    <div style={{ flexShrink: 0, textAlign: 'right' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#FFD700', textTransform: 'capitalize' }}>{dateDisplay}</div>
                      <div style={{ fontSize: '0.7rem', color: '#3a4a6b' }}>{b.hora}</div>
                    </div>
                    {/* Price */}
                    <div style={{ fontWeight: 800, color: '#22c55e', fontSize: '0.88rem', flexShrink: 0 }}>${b.total}</div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ── Confirmation Modal ───────────────────────────────────────────────── */}
      {confirmAction && (
        <ConfirmModal
          title={confirmAction.action === 'confirmed' ? t('Confirm Booking', 'Confirmar Reserva') : t('Reject Booking', 'Rechazar Reserva')}
          message={confirmAction.action === 'confirmed'
            ? `${t('Confirm booking for','Confirmar cita de')} ${confirmAction.nombre} ${t('on','el')} ${confirmAction.fecha} ${t('at','a las')} ${confirmAction.hora}?`
            : `${t('Are you sure you want to reject the booking for','¿Seguro que deseas rechazar la cita de')} ${confirmAction.nombre}? ${t('This cannot be undone.','Esta acción no se puede deshacer.')}`
          }
          confirmLabel={confirmAction.action === 'confirmed' ? t('Yes, Confirm','Sí, Confirmar') : t('Yes, Reject','Sí, Rechazar')}
          confirmColor={confirmAction.action === 'confirmed' ? '#FFD700' : '#ef4444'}
          confirmTextColor={confirmAction.action === 'confirmed' ? '#000' : '#fff'}
          cancelLabel={t('Back','Volver')}
          onConfirm={() => changeStatus(confirmAction.id, confirmAction.action)}
          onCancel={() => setConfirmAction(null)}
        />
      )}
    </AdminLayout>
  );
}

function NavBtn({ onClick, children }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'transparent', border: `1px solid ${hov ? '#FFD700' : '#1a2035'}`, color: hov ? '#FFD700' : '#9a9a9a', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
    >
      {children}
    </button>
  );
}
