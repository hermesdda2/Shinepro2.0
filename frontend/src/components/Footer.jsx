import { Link } from 'react-router-dom';
import { useLang } from '../LangContext';
import { COMPANY_INFO } from '../data';
import { 
  Phone, Mail, MapPin, MessageCircle
} from 'lucide-react';

export default function Footer() {
  const { lang, t } = useLang();

  // Corrected bilingual strings (bypassing encoding corruption in i18n.js)
  const ft = {
    nav:      lang === 'es' ? 'Navegación'          : 'Navigation',
    contact:  lang === 'es' ? 'Contacto'            : 'Contact',
    location: lang === 'es' ? 'Ubicación'           : 'Location',
    tagline:  lang === 'es' ? 'Negocio familiar de detallado móvil premium.' : 'Family owned & operated mobile detailing service.',
    taglineNav: lang === 'es' ? 'SPA AUTOMOTRIZ MÓVIL' : 'MOBILE AUTO SPA',
    rights:   lang === 'es' ? '© 2026 Shine Pro. Todos los Derechos Reservados.' : '© 2026 Shine Pro. All Rights Reserved.',
    privacy:  lang === 'es' ? 'Aviso de Privacidad'     : 'Privacy Policy',
    terms:    lang === 'es' ? 'Términos y Condiciones'  : 'Terms & Conditions',
    madeWith: lang === 'es' ? 'Hecho por HD Impulso Digital' : 'Made by HD Impulso Digital',
  };

  // SHARED STYLES
  const colHeadingStyle = { color: '#FFF', fontSize: '0.9rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem' };
  const linkStyle = { color: '#8B9AB3', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s', fontWeight: 500 };

  return (
    <footer style={{
      background: '#07090D', borderTop: '1px solid rgba(255, 212, 0, 0.1)',
      padding: '5rem 0 3rem', position: 'relative', overflow: 'hidden'
    }}>
      {/* Decorative Pattern */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,212,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,212,0,0.02) 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.5, pointerEvents: 'none' }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        
        {/* ==========================================================
            DESKTOP FOOTER (4 COLUMNS)
           ========================================================== */}
        <div className="footer-desktop-only">
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 0.8fr 1fr 1.2fr', gap: '4rem', marginBottom: '5rem' }}>
            {/* Column 1: Brand */}
            <div>
              <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', textDecoration: 'none' }}>
                <img src="/logo.png" alt="Shine Pro" style={{ height: 54, width: 'auto' }} />
                <div>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, color: 'var(--primary)', fontSize: '1.4rem', lineHeight: 1 }}>SHINE PRO</div>
                  <div style={{ fontSize: '0.7rem', color: '#FFF', letterSpacing: '0.2em', marginTop: '4px' }}>{ft.taglineNav}</div>
                </div>
              </Link>
              <p style={{ color: '#8B9AB3', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2.5rem', maxWidth: '350px' }}>
                {ft.tagline}
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <SocialIcon type="facebook" link="https://facebook.com/" color="#1877F2" />
                <SocialIcon type="instagram" link="https://instagram.com/" color="#E4405F" />
                <SocialIcon type="whatsapp" link="https://wa.me/17143344582" color="#25D366" />
              </div>
            </div>

            {/* Column 2: Nav */}
            <div style={{ textAlign: 'left' }}>
              <h4 style={colHeadingStyle}>{ft.nav}</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {[
                  { label: t.nav.services, link: '/#services' },
                  { label: t.nav.packages, link: '/#packages' },
                  { label: t.nav.about, link: '/#about' },
                  { label: t.nav.contact, link: '/#contact' }
                ].map((n, i) => (
                  <li key={i}><a href={n.link} style={linkStyle}>{n.label}</a></li>
                ))}
              </ul>
            </div>

            {/* Column 3: Contact */}
            <div style={{ textAlign: 'left' }}>
              <h4 style={colHeadingStyle}>{ft.contact}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <ContactItem icon={<Phone size={18} />} text={COMPANY_INFO.phone} link={`tel:${COMPANY_INFO.phone}`} />
                <ContactItem icon={<MessageCircle size={18} />} text="WhatsApp" link="https://wa.me/17143344582" />
                <ContactItem icon={<Mail size={18} />} text={COMPANY_INFO.email} link={`mailto:${COMPANY_INFO.email}`} />
              </div>
            </div>

            {/* Column 4: Location */}
            <div style={{ textAlign: 'left' }}>
              <h4 style={colHeadingStyle}>{ft.location}</h4>
              <MapCard mini={true} />
            </div>
          </div>
        </div>

        {/* ==========================================================
            MOBILE FOOTER (LAURENCIO SPECIFIC)
           ========================================================== */}
        <div className="footer-mobile-only">
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
            {/* R1: LOGO CENTRADO */}
            <div style={{ marginBottom: '4.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img src="/logo.png" alt="Shine Pro" style={{ height: 72, width: 'auto', marginBottom: '1.25rem' }} />
              <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, color: 'var(--primary)', fontSize: '1.8rem', lineHeight: 1 }}>SHINE PRO</div>
              <div style={{ fontSize: '0.8rem', color: '#FFF', letterSpacing: '0.3rem', marginTop: '6px', textTransform: 'uppercase' }}>{ft.taglineNav}</div>
              <p style={{ color: '#8B9AB3', fontSize: '1rem', lineHeight: 1.6, maxWidth: '450px', margin: '2rem auto 0', opacity: 0.9 }}>
                {ft.tagline}
              </p>
            </div>

            {/* R2: CONTACT (L) | NAV (R) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '4rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '4rem' }}>
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ ...colHeadingStyle, fontSize: '0.95rem', marginBottom: '1.5rem' }}>{ft.contact}</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <ContactItem icon={<Phone size={16} />} text={COMPANY_INFO.phone} link={`tel:${COMPANY_INFO.phone}`} mobile />
                  <ContactItem icon={<MessageCircle size={16} />} text="WhatsApp" link="https://wa.me/17143344582" mobile />
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h4 style={{ ...colHeadingStyle, fontSize: '0.95rem', marginBottom: '1.5rem' }}>{ft.nav}</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <li><a href="/#services" style={{ ...linkStyle, fontSize: '1rem' }}>{t.nav.services}</a></li>
                  <li><a href="/#packages" style={{ ...linkStyle, fontSize: '1rem' }}>{t.nav.packages}</a></li>
                </ul>
              </div>
            </div>

            {/* R3: SOCIALS & MAP */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '5rem' }}>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <SocialIcon type="facebook" link="https://facebook.com/" color="#1877F2" mobile />
                <SocialIcon type="instagram" link="https://instagram.com/" color="#E4405F" mobile />
                <SocialIcon type="whatsapp" link="https://wa.me/17143344582" color="#25D366" mobile />
              </div>
              <MapCard />
            </div>
          </div>
        </div>

        {/* SHARED BOTTOM RIGHTS — single line */}
        <div style={{
          marginTop: '6rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center',
          gap: '0 6px', fontSize: '0.8rem', color: '#9a9a9a', textAlign: 'center', lineHeight: 2,
        }}>
          <span>{ft.rights}</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <Link to="/admin/login" style={{ color: '#9a9a9a', textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.color = '#FFD700'}
            onMouseLeave={e => e.currentTarget.style.color = '#9a9a9a'}
          >Admin</Link>
          <span style={{ opacity: 0.4 }}>·</span>
          <Link to="/privacy" style={{ color: '#9a9a9a', textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.color = '#FFD700'}
            onMouseLeave={e => e.currentTarget.style.color = '#9a9a9a'}
          >{ft.privacy}</Link>
          <span style={{ opacity: 0.4 }}>·</span>
          <Link to="/terms" style={{ color: '#9a9a9a', textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.color = '#FFD700'}
            onMouseLeave={e => e.currentTarget.style.color = '#9a9a9a'}
          >{ft.terms}</Link>
          <span style={{ opacity: 0.4 }}>·</span>
          <a href="https://hdimpulsodigital.com/" target="_blank" rel="noreferrer"
            style={{ color: '#5C6B8A', textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.color = '#9a9a9a'}
            onMouseLeave={e => e.currentTarget.style.color = '#5C6B8A'}
          >{ft.madeWith}</a>
        </div>
      </div>

      <style>{`
        .footer-mobile-only { display: none; }
        .footer-desktop-only { display: block; }

        @media (max-width: 991px) {
          .footer-desktop-only { display: none; }
          .footer-mobile-only { display: block; }
        }
      `}</style>
    </footer>
  );
}

// HELPER COMPONENTS
function SocialIcon({ type, link, color, mobile }) {
  const getIcon = () => {
    if (type === 'facebook') return (
      <svg width={mobile ? 28 : 22} height={mobile ? 28 : 22} viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    );
    if (type === 'instagram') return (
      <svg width={mobile ? 28 : 22} height={mobile ? 28 : 22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
      </svg>
    );
    if (type === 'whatsapp') return (
       <svg width={mobile ? 28 : 22} height={mobile ? 28 : 22} viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
       </svg>
    );
     return <MessageCircle size={mobile ? 24 : 18} />;
  };

  return (
    <a href={link} target="_blank" rel="noreferrer" style={{
      width: mobile ? 62 : 44, height: mobile ? 62 : 44, borderRadius: '16px',
      background: 'rgba(255,255,255,0.03)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', color: '#FFF',
      border: '1px solid rgba(255,255,255,0.08)', transition: 'all 0.3s'
    }}
    onMouseEnter={e => e.currentTarget.style.background = color}
    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
    >
      {getIcon()}
    </a>
  );
}

function ContactItem({ icon, text, link, mobile }) {
  return (
    <div style={{ 
      display: 'flex', alignItems: 'center', gap: '0.9rem', 
      color: '#8B9AB3', justifyContent: mobile ? 'flex-start' : 'inherit' 
    }}>
      <span style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center' }}>{icon}</span>
      <a href={link} style={{ fontSize: mobile ? '1rem' : '0.95rem', color: 'inherit', textDecoration: 'none', fontWeight: 500 }}>{text}</a>
    </div>
  );
}

function MapCard({ mini }) {
  return (
    <div style={{
      background: '#111E35', borderRadius: '24px', overflow: 'hidden',
      border: '1px solid rgba(255,212,0,0.15)', position: 'relative', 
      width: '100%', maxWidth: mini ? '350px' : '100%',
      boxShadow: '0 25px 50px rgba(0,0,0,0.4)'
    }}>
      <div style={{ height: mini ? 140 : 220, background: '#0A0D14' }}>
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d424396.3176723366!2d-118.067332!3d33.674996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80dc925c54d5f7cf%3A0xdea6c3618ff4d607!2sOrange%20County%2C%20CA!5e0!3m2!1sen!2sus!4v1712255475431!5m2!1sen!2sus"
          width="100%" height="100%" style={{ border: 0, filter: 'grayscale(1) invert(0.92) contrast(1.2) brightness(0.8)' }} 
          allowFullScreen="" loading="lazy">
        </iframe>
      </div>
      <div style={{ padding: '1.25rem', background: 'rgba(255,212,0,0.1)' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', justifyContent: 'center' }}>
          <MapPin size={18} color="var(--primary)" />
          <span style={{ fontSize: '1rem', color: '#FFF', fontWeight: 900 }}>Orange County, CA</span>
        </div>
      </div>
    </div>
  );
}


