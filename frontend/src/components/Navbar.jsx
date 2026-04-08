import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import { useLang } from '../LangContext';

export default function Navbar() {
  const { t, lang, toggleLang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const scrollTo = (id) => {
    setMenuOpen(false);
    if (location.pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? 'rgba(10, 13, 20, 0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255, 212, 0, 0.1)' : 'none',
        transition: 'all 0.4s ease',
        padding: '1rem 0',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link 
            to="/" 
            onClick={(e) => {
              if (location.pathname === '/') {
                e.preventDefault();
                scrollTo('home');
              }
            }}
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
          >
            <img src="/logo.png" alt="Shine Pro" style={{ height: '52px', width: 'auto', objectFit: 'contain' }} />
            <div className="desktop-nav">
              <div style={{
                fontFamily: 'Outfit, sans-serif', fontWeight: 900,
                fontSize: '1.4rem', letterSpacing: '0.02em',
                color: 'var(--primary)', textTransform: 'uppercase', lineHeight: 1
              }}>
                SHINE PRO
              </div>
              <div style={{ fontSize: '0.65rem', color: '#FFF', letterSpacing: '0.2em', marginTop: '2px', opacity: 0.8 }}>
                {t.nav.tagline}
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }} className="desktop-nav">
            {[
              { label: t.nav.services, id: 'services' },
              { label: t.nav.reviews, id: 'reviews' },
              { label: t.nav.packages, id: 'packages' },
              { label: t.nav.locations, id: 'locations' },
              { label: t.nav.about, id: 'about' },
              { label: t.nav.contact, id: 'contact' },
            ].map(item => (
              <button key={item.id} onClick={() => scrollTo(item.id)}
                style={{
                  background: 'none', border: 'none', color: 'rgba(255,255,255,0.85)',
                  cursor: 'pointer', font: '600 0.9rem Inter, sans-serif',
                  transition: 'color 0.2s', textTransform: 'uppercase', letterSpacing: '0.04em'
                }}
                onMouseEnter={e => e.target.style.color = '#FFD400'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.85)'}
              >{item.label}</button>
            ))}
          </div>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={toggleLang} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 212, 0, 0.3)',
              color: '#FFF', borderRadius: '50px', padding: '0.5rem 1.15rem',
              cursor: 'pointer', fontSize: '0.9rem', fontWeight: 900, transition: 'all 0.3s',
            }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', overflow: 'hidden', border: '1.5px solid rgba(255,255,255,0.4)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src={lang === 'en' ? "/flags/usa.webp" : "/flags/mexico.webp"}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <span style={{ color: 'var(--primary)', letterSpacing: '0.05em' }}>{lang.toUpperCase()}</span>
            </button>
            <Link to="/booking" className="btn-primary desktop-nav" style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem', textDecoration: 'none' }}>
              {t.nav.bookNow}
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)}
              style={{
                display: 'none', background: 'none', border: 'none',
                color: '#fff', cursor: 'pointer'
              }}
              className="mobile-menu-btn"
            >
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: '72px', left: 0, right: 0, zIndex: 999,
          background: 'rgba(10, 13, 20, 0.98)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,212,0,0.2)',
          padding: '1.5rem',
          display: 'flex', flexDirection: 'column', gap: '1.25rem'
        }}>
          {[
            { label: t.nav.services, id: 'services' },
            { label: t.nav.reviews, id: 'reviews' },
            { label: t.nav.packages, id: 'packages' },
            { label: t.nav.locations, id: 'locations' },
            { label: t.nav.about, id: 'about' },
            { label: t.nav.contact, id: 'contact' },
          ].map(item => (
            <button key={item.id} onClick={() => scrollTo(item.id)}
              style={{
                background: 'none', border: 'none', color: '#fff',
                cursor: 'pointer', font: '600 1.1rem Inter, sans-serif',
                textAlign: 'left', padding: '0.5rem 0', textTransform: 'uppercase',
                borderBottom: '1px solid rgba(255,255,255,0.05)'
              }}
            >{item.label}</button>
          ))}
          <Link to="/booking" className="btn-primary" style={{ textAlign: 'center', marginTop: '0.5rem', textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>
            {t.nav.bookNow}
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}


