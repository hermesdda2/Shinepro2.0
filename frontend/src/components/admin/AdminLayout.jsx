import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAdminAuth } from '../../AdminAuthContext';
import { useLang } from '../../LangContext';

const NAV = [
  { path: '/admin',          icon: '⊞', labelEn: 'Dashboard', labelEs: 'Dashboard' },
  { path: '/admin/bookings', icon: '◫', labelEn: 'Bookings',  labelEs: 'Reservas'  },
  { path: '/admin/settings', icon: '⚙', labelEn: 'Settings',  labelEs: 'Ajustes'   },
];

const W_COLLAPSED = 64;
const W_EXPANDED  = 220;

function getSavedOpen() {
  try { return localStorage.getItem('admin_sidebar') === 'open'; } catch { return false; }
}

export default function AdminLayout({ children, title }) {
  const { admin, logout } = useAdminAuth();
  const { lang, toggleLang } = useLang();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(getSavedOpen);
  const [hovered, setHovered] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => {
    if (isMobile) {
      setDrawerOpen(prev => !prev);
    } else {
      setOpen(prev => {
        const next = !prev;
        try { localStorage.setItem('admin_sidebar', next ? 'open' : 'closed'); } catch {}
        return next;
      });
    }
  };

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? (lang === 'es' ? 'Buenos días'   : 'Good morning')
    : hour < 18  ? (lang === 'es' ? 'Buenas tardes'  : 'Good afternoon')
    :               (lang === 'es' ? 'Buenas noches'  : 'Good evening');

  const sideW = open ? W_EXPANDED : W_COLLAPSED;

  // ── Sidebar nav content (shared between desktop & mobile drawer) ──
  const SidebarContent = ({ onClose }) => (
    <>
      {/* Logo + toggle/close */}
      <div style={{
        width: '100%', padding: '0.9rem 0', borderBottom: '1px solid #1a2035',
        display: 'flex', alignItems: 'center',
        justifyContent: isMobile ? 'space-between' : (open ? 'space-between' : 'center'),
        paddingLeft: isMobile ? '1rem' : (open ? '1rem' : 0),
        paddingRight: isMobile ? '0.75rem' : (open ? '0.75rem' : 0),
        boxSizing: 'border-box',
        gap: '8px',
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
            background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <img src="/logo.png" alt="Shine Pro" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
          </div>
          {(isMobile || open) && (
            <span style={{
              fontWeight: 900, fontSize: '0.9rem', color: '#FFD700',
              fontFamily: 'Outfit, sans-serif', letterSpacing: '0.07em',
              whiteSpace: 'nowrap',
            }}>
              SHINE PRO
            </span>
          )}
        </Link>

        {/* Close/toggle button */}
        <button
          onClick={isMobile ? onClose : toggleSidebar}
          title={isMobile ? 'Close' : (open ? 'Collapse' : 'Expand')}
          style={{
            background: 'transparent', border: '1px solid #1a2035', borderRadius: '8px',
            color: '#3a4a6b', cursor: 'pointer', fontSize: '0.9rem',
            width: '32px', height: '32px', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#FFD700'; e.currentTarget.style.color = '#FFD700'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#1a2035'; e.currentTarget.style.color = '#3a4a6b'; }}
        >
          {isMobile ? '✕' : '☰'}
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, width: '100%', padding: '0.75rem 0', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {NAV.map(item => {
          const active = location.pathname === item.path ||
            (item.path !== '/admin' && location.pathname.startsWith(item.path));
          const isHov = hovered === item.path;
          const label = lang === 'es' ? item.labelEs : item.labelEn;
          const showLabel = isMobile || open;

          return (
            <div key={item.path} style={{ position: 'relative', width: '100%' }}>
              {/* Tooltip (only when collapsed on desktop) */}
              {!isMobile && !open && isHov && (
                <div style={{
                  position: 'absolute', left: `${W_COLLAPSED + 8}px`, top: '50%', transform: 'translateY(-50%)',
                  background: '#1a2035', border: '1px solid #2a3555', borderRadius: '8px',
                  padding: '5px 10px', fontSize: '0.75rem', fontWeight: 600, color: '#fff',
                  whiteSpace: 'nowrap', zIndex: 200, pointerEvents: 'none',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                }}>
                  {label}
                </div>
              )}
              <button
                onClick={() => { navigate(item.path); if (isMobile) setDrawerOpen(false); }}
                onMouseEnter={() => setHovered(item.path)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  gap: showLabel ? '12px' : 0,
                  justifyContent: showLabel ? 'flex-start' : 'center',
                  padding: showLabel ? (isMobile ? '14px 1.25rem' : '10px 1.1rem') : '10px 0',
                  background: active ? 'rgba(255,215,0,0.08)' : isHov ? 'rgba(255,255,255,0.03)' : 'transparent',
                  border: 'none',
                  borderLeft: active ? '3px solid #FFD700' : '3px solid transparent',
                  color: active || isHov ? '#FFD700' : '#3a4a6b',
                  fontSize: '1rem', cursor: 'pointer', transition: 'all 0.15s',
                  textAlign: 'left', whiteSpace: 'nowrap',
                  minHeight: '44px',
                }}
              >
                <span style={{ fontSize: isMobile ? '1.2rem' : '1rem', flexShrink: 0, lineHeight: 1 }}>{item.icon}</span>
                {showLabel && (
                  <span style={{ fontSize: isMobile ? '1rem' : '0.88rem', fontWeight: active ? 700 : 500 }}>
                    {label}
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </nav>

      {/* Bottom: avatar + logout */}
      <div style={{ borderTop: '1px solid #1a2035', padding: '0.75rem 0', width: '100%', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: (isMobile || open) ? '10px' : 0,
          justifyContent: (isMobile || open) ? 'flex-start' : 'center',
          padding: (isMobile || open) ? '8px 1.1rem' : '8px 0',
        }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
            background: 'rgba(255,215,0,0.12)', border: '2px solid rgba(255,215,0,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.8rem', fontWeight: 800, color: '#FFD700',
          }}>
            {admin?.email?.[0]?.toUpperCase() || 'A'}
          </div>
          {(isMobile || open) && (
            <span style={{ fontSize: '0.78rem', color: '#9a9a9a', whiteSpace: 'nowrap' }}>
              {admin?.email?.split('@')[0] || 'Admin'}
            </span>
          )}
        </div>

        <button
          onClick={handleLogout}
          title={lang === 'es' ? 'Cerrar Sesión' : 'Logout'}
          onMouseEnter={e => setHovered('logout')}
          onMouseLeave={e => setHovered(null)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center',
            gap: (isMobile || open) ? '12px' : 0,
            justifyContent: (isMobile || open) ? 'flex-start' : 'center',
            padding: (isMobile || open) ? (isMobile ? '14px 1.25rem' : '10px 1.1rem') : '10px 0',
            background: hovered === 'logout' ? 'rgba(239,68,68,0.08)' : 'transparent',
            border: 'none',
            borderLeft: '3px solid transparent',
            color: hovered === 'logout' ? '#ef4444' : '#3a4a6b',
            cursor: 'pointer', transition: 'all 0.15s',
            whiteSpace: 'nowrap',
            minHeight: '44px',
          }}
        >
          <span style={{ fontSize: isMobile ? '1.2rem' : '1rem', flexShrink: 0 }}>🚪</span>
          {(isMobile || open) && (
            <span style={{ fontSize: isMobile ? '1rem' : '0.88rem', fontWeight: 500 }}>
              {lang === 'es' ? 'Cerrar Sesión' : 'Logout'}
            </span>
          )}
        </button>
      </div>
    </>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0d14', fontFamily: 'Inter, sans-serif', color: '#fff' }}>

      {/* ── Desktop Sidebar ─────────────────────────────────────────────────── */}
      {!isMobile && (
        <aside style={{
          width: `${sideW}px`,
          minHeight: '100vh',
          background: '#080b11',
          borderRight: '1px solid #1a2035',
          display: 'flex', flexDirection: 'column',
          alignItems: open ? 'flex-start' : 'center',
          position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100,
          transition: 'width 0.3s ease',
          overflow: 'hidden',
        }}>
          <SidebarContent onClose={() => {}} />
        </aside>
      )}

      {/* ── Mobile Drawer Overlay ───────────────────────────────────────────── */}
      {isMobile && drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(2px)', zIndex: 200,
          }}
        />
      )}

      {/* ── Mobile Drawer ───────────────────────────────────────────────────── */}
      {isMobile && (
        <aside style={{
          position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 201,
          width: '260px',
          background: '#080b11',
          borderRight: '1px solid #1a2035',
          display: 'flex', flexDirection: 'column',
          alignItems: 'flex-start',
          transform: drawerOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}>
          <SidebarContent onClose={() => setDrawerOpen(false)} />
        </aside>
      )}

      {/* ── Main area ───────────────────────────────────────────────────────── */}
      <div style={{
        flex: 1,
        marginLeft: isMobile ? 0 : `${sideW}px`,
        transition: isMobile ? 'none' : 'margin-left 0.3s ease',
        display: 'flex', flexDirection: 'column',
        minWidth: 0,
      }}>

        {/* Header */}
        <header style={{
          height: isMobile ? '56px' : '68px',
          background: 'rgba(10,13,20,0.95)',
          borderBottom: '1px solid #1a2035',
          backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: isMobile ? '0 1rem' : '0 2rem',
          position: 'sticky', top: 0, zIndex: 90,
          gap: '12px',
        }}>
          {/* Left: hamburger (mobile) + title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '0', minWidth: 0 }}>
            {/* Hamburger — mobile only */}
            {isMobile && (
              <button
                onClick={toggleSidebar}
                style={{
                  background: 'transparent', border: '1px solid #1a2035', borderRadius: '8px',
                  color: '#9a9a9a', cursor: 'pointer', fontSize: '1.1rem',
                  width: '36px', height: '36px', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                ☰
              </button>
            )}

            {isMobile ? (
              /* Mobile header: centered title */
              <div style={{ flex: 1, textAlign: 'center', minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff', lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
                <div style={{ fontSize: '0.65rem', color: '#3a4a6b', marginTop: '1px' }}>
                  {greeting}, <span style={{ color: '#FFD700', fontWeight: 600 }}>Andrés</span>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.5rem', color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{title}</div>
                <div style={{ fontSize: '0.75rem', color: '#3a4a6b', marginTop: '2px' }}>
                  {greeting}, <span style={{ color: '#FFD700', fontWeight: 600 }}>Andrés</span> 👋
                </div>
              </div>
            )}
          </div>

          {/* Right: lang toggle */}
          <button onClick={toggleLang} style={{
            background: '#0f1219', border: '1px solid #1a2035', borderRadius: '50px',
            padding: '5px 10px 5px 6px',
            display: 'flex', alignItems: 'center', gap: '6px',
            cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0,
            minHeight: '36px',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#FFD700'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#1a2035'}
          >
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', overflow: 'hidden', border: '1.5px solid rgba(255,255,255,0.2)', flexShrink: 0 }}>
              <img
                src={lang === 'en' ? '/flags/usa.webp' : '/flags/mexico.webp'}
                alt={lang}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
            <span style={{ color: '#FFD700', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em' }}>
              {lang.toUpperCase()}
            </span>
          </button>
        </header>

        {/* Page content */}
        <main style={{
          flex: 1,
          padding: isMobile ? '1rem' : '2rem',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}
