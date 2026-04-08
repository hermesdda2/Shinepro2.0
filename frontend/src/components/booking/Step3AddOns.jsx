import { useState, useEffect } from 'react';
import { useLang } from '../../LangContext';
import { API_URL as API } from '../../config';

export default function Step3AddOns({ bookingState, onUpdate }) {
  const { lang } = useLang();
  const selected = bookingState.addons || [];
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const [addons, setAddons] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/addons`)
      .then(r => r.ok ? r.json() : [])
      .then(data => setAddons(data.filter(a => a.activo)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const toggle = (slug) => {
    const updated = selected.includes(slug)
      ? selected.filter(a => a !== slug)
      : [...selected, slug];
    onUpdate({ addons: updated });
  };

  const selectedAddons = addons.filter(a => selected.includes(a.slug));
  const addonsTotal = selectedAddons.reduce((acc, a) => acc + a.precio, 0);

  return (
    <div>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
          {lang === 'es' ? 'Servicios Adicionales' : 'Select Add-Ons'}
        </h2>
        <p style={{ color: '#9a9a9a', fontSize: '0.95rem' }}>
          {lang === 'es' ? 'Opcionales — agrega lo que necesites' : 'Optional — enhance your service'}
        </p>
      </div>

      {/* Chips / Cards */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        flexWrap: isMobile ? 'nowrap' : 'wrap',
        gap: '12px',
        justifyContent: 'center',
        maxWidth: isMobile ? '100%' : '720px',
        margin: '0 auto',
      }}>
        {addons.map((addon) => {
          const isSelected = selected.includes(addon.slug);
          const name = lang === 'es' ? addon.nombre_es : addon.nombre_en;

          return (
            <button
              key={addon.id}
              onClick={() => toggle(addon.slug)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '14px 20px',
                borderRadius: isMobile ? '14px' : '50px',
                border: `1.5px solid ${isSelected ? '#FFD700' : '#2a2a2a'}`,
                background: isSelected ? 'rgba(255, 215, 0, 0.1)' : '#141414',
                color: isSelected ? '#FFD700' : '#e0e0e0',
                fontSize: '0.88rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                whiteSpace: isMobile ? 'normal' : 'nowrap',
                width: isMobile ? '100%' : 'auto',
                textAlign: 'left',
              }}
              onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.borderColor = '#3a3a3a'; e.currentTarget.style.background = '#1a1a1a'; } }}
              onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.background = '#141414'; } }}
            >
              {isSelected && (
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M2 6.5l3 3L11 3" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              <span style={{ flex: 1 }}>{name}</span>
              <span style={{ opacity: 0.6, margin: '0 2px' }}>•</span>
              <span style={{ fontWeight: 700, color: isSelected ? '#FFD700' : '#9a9a9a', flexShrink: 0 }}>
                +${addon.precio}
              </span>
            </button>
          );
        })}
      </div>

      {/* Footer note */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        {selected.length === 0 ? (
          <p style={{ color: '#555', fontSize: '0.85rem' }}>
            {lang === 'es'
              ? 'Ningún extra seleccionado — puedes continuar sin ellos.'
              : 'No add-ons selected — you can skip this step.'}
          </p>
        ) : (
          <p style={{ color: '#FFD700', fontSize: '0.88rem', fontWeight: 600 }}>
            {selected.length} {lang === 'es' ? 'extra(s) seleccionado(s)' : `add-on${selected.length > 1 ? 's' : ''} selected`}
            {' — '}
            <span style={{ fontWeight: 800 }}>+${addonsTotal}</span>
            {' '}
            {lang === 'es' ? 'agregado' : 'added'}
          </p>
        )}
      </div>
    </div>
  );
}
