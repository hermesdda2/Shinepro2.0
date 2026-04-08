import { useState, useRef, useEffect } from 'react';
import { useLang } from '../../LangContext';
import { VEHICLES } from '../../data/bookingData';

const VEHICLE_IMAGES = {
  small_sedan: '/cars/small-sedan.png',
  small_pickup: '/cars/small-pickup.png',
  mid_size: '/cars/midsize.png',
  full_size: '/cars/fullsize.png',
};

export default function Step1Vehicle({ bookingState, onUpdate }) {
  const { lang } = useLang();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Active index in carousel (may differ from bookingState.vehicle until clicked center)
  const initialIdx = bookingState.vehicle
    ? VEHICLES.findIndex(v => v.id === bookingState.vehicle)
    : 0;
  const [activeIdx, setActiveIdx] = useState(initialIdx >= 0 ? initialIdx : 0);

  // Touch swipe
  const touchStartX = useRef(null);

  const goTo = (idx) => {
    const clamped = Math.max(0, Math.min(VEHICLES.length - 1, idx));
    setActiveIdx(clamped);
    onUpdate({ vehicle: VEHICLES[clamped].id, service: null, addons: [] });
  };

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(activeIdx + (diff > 0 ? 1 : -1));
    touchStartX.current = null;
  };

  return (
    <div>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
          {lang === 'es' ? 'Selecciona Tu Vehículo' : 'Select Your Vehicle'}
        </h2>
        <p style={{ color: '#9a9a9a', fontSize: '0.95rem' }}>
          {lang === 'es' ? 'El precio varía según el tamaño del vehículo' : 'Pricing varies based on your vehicle size'}
        </p>
      </div>

      {/* Carousel */}
      <div
        style={{ position: 'relative', width: '100%', overflow: 'hidden', userSelect: 'none' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Arrow left — hidden on mobile */}
        {!isMobile && (
          <ArrowBtn
            direction="left"
            onClick={() => goTo(activeIdx - 1)}
            disabled={activeIdx === 0}
          />
        )}

        {/* Track */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: isMobile ? '280px' : '260px',
          gap: '0',
          padding: isMobile ? '0 16px' : '0 60px',
        }}>
          {VEHICLES.map((v, idx) => {
            const offset = idx - activeIdx;
            const isCenter = offset === 0;
            const isVisible = Math.abs(offset) <= 1;

            if (!isVisible) return null;

            return (
              <div
                key={v.id}
                onClick={() => goTo(idx)}
                style={{
                  position: 'relative',
                  flex: isCenter ? '0 0 55%' : '0 0 22%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: isCenter ? 'default' : 'pointer',
                  transition: 'all 0.3s ease',
                  transform: isCenter ? 'scale(1)' : 'scale(0.75)',
                  opacity: isCenter ? 1 : 0.45,
                  zIndex: isCenter ? 2 : 1,
                  filter: isCenter ? 'none' : 'brightness(0.5)',
                }}
              >
                {/* Image */}
                <div style={{
                  width: '100%',
                  height: isMobile && isCenter ? '220px' : '180px',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  position: 'relative',
                }}>
                  <img
                    src={VEHICLE_IMAGES[v.id]}
                    alt={v.labelEn}
                    style={{
                      maxWidth: '100%',
                      maxHeight: isMobile && isCenter ? '200px' : '160px',
                      objectFit: 'contain',
                      filter: isCenter ? 'drop-shadow(0 8px 24px rgba(255,215,0,0.18))' : 'none',
                      transition: 'filter 0.3s ease',
                    }}
                  />
                  {/* Floor glow */}
                  {isCenter && (
                    <div style={{
                      position: 'absolute',
                      bottom: '-8px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '70%',
                      height: '20px',
                      background: 'radial-gradient(ellipse at center, rgba(255,215,0,0.25) 0%, transparent 70%)',
                      borderRadius: '50%',
                      filter: 'blur(6px)',
                    }} />
                  )}
                </div>

                {/* Name & badge */}
                {isCenter && (
                  <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <div style={{ fontSize: isMobile ? '1.6rem' : '1.4rem', fontWeight: 700, color: '#FFD700', marginBottom: '6px' }}>
                      {lang === 'es' ? v.labelEs : v.labelEn}
                    </div>
                    <div style={{
                      display: 'inline-block',
                      background: '#FFD700', color: '#000',
                      fontSize: '0.65rem', fontWeight: 800,
                      padding: '3px 14px', borderRadius: '50px',
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                    }}>
                      {lang === 'es' ? 'Seleccionado' : 'Selected'}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Arrow right — hidden on mobile */}
        {!isMobile && (
          <ArrowBtn
            direction="right"
            onClick={() => goTo(activeIdx + 1)}
            disabled={activeIdx === VEHICLES.length - 1}
          />
        )}
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '1.5rem' }}>
        {VEHICLES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            style={{
              width: idx === activeIdx ? '24px' : '8px',
              height: '8px',
              borderRadius: '50px',
              background: idx === activeIdx ? '#FFD700' : '#2a2a2a',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
}

function ArrowBtn({ direction, onClick, disabled }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-60%)',
        [direction === 'left' ? 'left' : 'right']: '8px',
        zIndex: 10,
        width: '44px', height: '44px',
        borderRadius: '50%',
        background: '#1a1a1a',
        border: `1.5px solid ${hovered && !disabled ? '#FFD700' : '#2a2a2a'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.3 : 1,
        transition: 'all 0.2s ease',
      }}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        {direction === 'left'
          ? <path d="M11 4l-5 5 5 5" stroke={hovered && !disabled ? '#FFD700' : '#fff'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          : <path d="M7 4l5 5-5 5" stroke={hovered && !disabled ? '#FFD700' : '#fff'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        }
      </svg>
    </button>
  );
}
