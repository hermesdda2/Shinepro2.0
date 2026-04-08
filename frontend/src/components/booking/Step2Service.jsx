import { useState, useRef, useEffect } from 'react';
import { useLang } from '../../LangContext';
import { SERVICES, VEHICLES } from '../../data/bookingData';

// Duration bar percentages (relative to Complete Detail = 100%)
const MAX_DURATION = 120;
function durationPct(minutes) {
  return Math.round((minutes / MAX_DURATION) * 100);
}

export default function Step2Service({ bookingState, onUpdate }) {
  const { lang } = useLang();
  const services = SERVICES[bookingState.vehicle] || [];
  const vehicle = VEHICLES.find(v => v.id === bookingState.vehicle);
  const scrollRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [mobileIdx, setMobileIdx] = useState(() => {
    const idx = services.findIndex(s => s.id === bookingState.service);
    return idx >= 0 ? idx : 0;
  });
  const touchStartXRef = useRef(null);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const goToMobile = (idx) => {
    const clamped = Math.max(0, Math.min(services.length - 1, idx));
    setMobileIdx(clamped);
  };

  const handleTouchStartMobile = (e) => { touchStartXRef.current = e.touches[0].clientX; };
  const handleTouchEndMobile = (e) => {
    if (touchStartXRef.current === null) return;
    const diff = touchStartXRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goToMobile(mobileIdx + (diff > 0 ? 1 : -1));
    touchStartXRef.current = null;
  };

  const ServiceCard = ({ svc }) => {
    const isSelected = bookingState.service === svc.id;
    const name = lang === 'es' ? svc.nameEs : svc.nameEn;
    const features = lang === 'es' ? svc.featuresEs : svc.featuresEn;
    const price = lang === 'es' ? svc.priceEs : svc.priceEn;
    const pct = durationPct(svc.duration);

    return (
      <div
        onClick={() => onUpdate({ service: svc.id })}
        style={{
          background: '#141414',
          border: `2px solid ${isSelected ? '#FFD700' : '#2a2a2a'}`,
          borderRadius: '20px',
          padding: '28px',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          gap: '0',
          transition: 'all 0.25s ease',
          transform: isSelected ? 'translateY(-4px)' : 'translateY(0)',
          boxShadow: isSelected ? '0 0 30px rgba(255,215,0,0.15)' : 'none',
          height: '100%',
        }}
      >
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9a9a9a', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '12px' }}>
          {name}
        </div>
        <div style={{ fontSize: '3.5rem', fontWeight: 800, color: '#FFD700', lineHeight: 1, marginBottom: '16px' }}>
          ${price}
        </div>
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.72rem', color: '#9a9a9a', fontWeight: 600 }}>{lang === 'es' ? 'Duración' : 'Duration'}</span>
            <span style={{ fontSize: '0.72rem', color: '#FFD700', fontWeight: 700 }}>{svc.duration} min</span>
          </div>
          <div style={{ height: '4px', background: '#2a2a2a', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: '#FFD700', borderRadius: '4px', transition: 'width 0.4s ease' }} />
          </div>
        </div>
        <div style={{ height: '1px', background: '#2a2a2a', marginBottom: '20px' }} />
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          {features.map((f, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.8rem', color: '#e0e0e0', lineHeight: 1.4 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: '1px' }}>
                <circle cx="7" cy="7" r="6.5" fill="rgba(255,215,0,0.12)" />
                <path d="M4 7l2 2 4-4" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {f}
            </li>
          ))}
        </ul>
        <button
          onClick={(e) => { e.stopPropagation(); onUpdate({ service: svc.id }); }}
          style={{
            marginTop: '20px', width: '100%', padding: '12px', borderRadius: '50px',
            border: `1.5px solid ${isSelected ? '#FFD700' : '#2a2a2a'}`,
            background: isSelected ? '#FFD700' : 'transparent',
            color: isSelected ? '#000' : '#fff',
            fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer',
            transition: 'all 0.2s ease', letterSpacing: '0.04em',
          }}
        >
          {isSelected ? (lang === 'es' ? '✓ Seleccionado' : '✓ Selected') : (lang === 'es' ? 'Seleccionar' : 'Select')}
        </button>
      </div>
    );
  };

  return (
    <div>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
          {lang === 'es' ? 'Elige Tu Paquete' : 'Choose Your Package'}
        </h2>
        <p style={{ color: '#9a9a9a', fontSize: '0.95rem' }}>
          {lang === 'es' ? `Precios para ${vehicle?.labelEs}` : `Pricing for ${vehicle?.labelEn}`}
        </p>
      </div>

      {isMobile ? (
        /* ── Mobile: single card slider ── */
        <div>
          <div
            style={{ position: 'relative', paddingTop: '1.5rem' }}
            onTouchStart={handleTouchStartMobile}
            onTouchEnd={handleTouchEndMobile}
          >
            {/* Popular badge */}
            {services[mobileIdx]?.popular && (
              <div style={{
                position: 'absolute', top: '-2px', left: '50%', transform: 'translateX(-50%)',
                background: '#FFD700', color: '#000', fontSize: '0.65rem', fontWeight: 800,
                padding: '4px 16px', borderRadius: '50px', letterSpacing: '0.08em',
                textTransform: 'uppercase', whiteSpace: 'nowrap', zIndex: 2,
              }}>
                {lang === 'es' ? '⭐ Más Popular' : '⭐ Most Popular'}
              </div>
            )}
            <div style={{ width: '90%', margin: '0 auto' }}>
              {services[mobileIdx] && <ServiceCard svc={services[mobileIdx]} />}
            </div>
          </div>

          {/* Dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '1.25rem' }}>
            {services.map((_, idx) => (
              <button key={idx} onClick={() => goToMobile(idx)} style={{
                width: idx === mobileIdx ? '24px' : '8px', height: '8px',
                borderRadius: '50px', background: idx === mobileIdx ? '#FFD700' : '#2a2a2a',
                border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.3s ease',
              }} />
            ))}
          </div>
        </div>
      ) : (
        /* ── Desktop: horizontal scroll ── */
        <div
          ref={scrollRef}
          style={{
            display: 'flex', gap: '1rem', overflowX: 'auto',
            scrollSnapType: 'x mandatory', paddingBottom: '1.25rem',
            paddingTop: '1.5rem', paddingLeft: '4px', paddingRight: '4px',
            scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch',
          }}
        >
          {services.map((svc) => (
            <div key={svc.id} style={{ position: 'relative', flexShrink: 0, width: '280px', scrollSnapAlign: 'start' }}>
              {svc.popular && (
                <div style={{
                  position: 'absolute', top: '-26px', left: '50%', transform: 'translateX(-50%)',
                  background: '#FFD700', color: '#000', fontSize: '0.65rem', fontWeight: 800,
                  padding: '4px 16px', borderRadius: '50px', letterSpacing: '0.08em',
                  textTransform: 'uppercase', whiteSpace: 'nowrap', zIndex: 2,
                }}>
                  {lang === 'es' ? '⭐ Más Popular' : '⭐ Most Popular'}
                </div>
              )}
              <ServiceCard svc={svc} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
