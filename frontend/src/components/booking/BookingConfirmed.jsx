import { useState, useEffect } from 'react';
import { useLang } from '../../LangContext';
import { VEHICLES, SERVICES, CONTACT } from '../../data/bookingData';
import { API_URL as API } from '../../config';

export default function BookingConfirmed({ bookingState, bookingId, onNewBooking }) {
  const { lang } = useLang();

  const [allAddons, setAllAddons] = useState([]);
  useEffect(() => {
    fetch(`${API}/api/addons`).then(r => r.ok ? r.json() : []).then(setAllAddons).catch(() => {});
  }, []);

  const vehicle = VEHICLES.find(v => v.id === bookingState.vehicle);
  const services = SERVICES[bookingState.vehicle] || [];
  const service = services.find(s => s.id === bookingState.service);
  const selectedAddons = allAddons.filter(a => (bookingState.addons || []).includes(a.slug));
  const details = bookingState.details || {};

  const location = bookingState.location || {};
  const servicePrice = service ? (lang === 'es' ? service.priceEs : service.priceEn) : 0;
  const addonsTotal = selectedAddons.reduce((acc, a) => acc + a.precio, 0);
  const travelFee = location.travelFee || 0;
  const total = servicePrice + addonsTotal + travelFee;

  return (
    <div style={{ textAlign: 'center', padding: '2rem 1rem', maxWidth: '560px', margin: '0 auto' }}>

      {/* Success icon */}
      <div style={{
        width: '80px', height: '80px', borderRadius: '50%',
        background: 'rgba(255,215,0,0.12)', border: '2px solid #FFD700',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 1.5rem',
        boxShadow: '0 0 30px rgba(255,215,0,0.2)',
      }}>
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <path d="M8 18l6.5 6.5L28 11" stroke="#FFD700" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFD700', marginBottom: '0.5rem' }}>
        {lang === 'es' ? '¡Reserva Enviada!' : 'Booking Submitted!'}
      </h2>
      {bookingId && (
        <p style={{ color: '#555', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
          {lang === 'es' ? 'Número de reserva:' : 'Booking #'}{' '}
          <span style={{ color: '#FFD700', fontWeight: 700 }}>#{bookingId}</span>
        </p>
      )}
      <p style={{ color: '#9a9a9a', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        {lang === 'es'
          ? 'Confirmaremos tu cita pronto por email o teléfono.'
          : "We'll confirm your appointment shortly via email or phone."}
      </p>
      <p style={{ color: '#FFD700', fontWeight: 700, fontSize: '1rem', marginBottom: '2rem' }}>
        {CONTACT.phone}
      </p>

      {/* Summary card */}
      <div style={{
        background: '#141414', border: '1px solid #2a2a2a', borderRadius: '16px',
        padding: '1.5rem', textAlign: 'left', marginBottom: '2rem',
      }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#FFD700', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
          {lang === 'es' ? 'Resumen de Reserva' : 'Booking Summary'}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { label: lang === 'es' ? 'Nombre' : 'Name', value: details.name },
            { label: lang === 'es' ? 'Vehículo' : 'Vehicle', value: vehicle ? (lang === 'es' ? vehicle.labelEs : vehicle.labelEn) : null },
            { label: lang === 'es' ? 'Servicio' : 'Service', value: service ? (lang === 'es' ? service.nameEs : service.nameEn) : null },
            { label: lang === 'es' ? 'Fecha' : 'Date', value: details.date },
            { label: lang === 'es' ? 'Hora' : 'Time', value: details.time },
            { label: lang === 'es' ? 'Dirección' : 'Address', value: location.address || details.address },
            { label: lang === 'es' ? 'Cargo de Viaje' : 'Travel Fee', value: travelFee === 0 ? 'FREE' : `+$${travelFee}` },
          ].filter(r => r.value).map((row, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', fontSize: '0.85rem' }}>
              <span style={{ color: '#9a9a9a' }}>{row.label}</span>
              <span style={{ color: '#fff', textAlign: 'right' }}>{row.value}</span>
            </div>
          ))}

          {selectedAddons.length > 0 && (
            <div style={{ fontSize: '0.85rem' }}>
              <span style={{ color: '#9a9a9a' }}>{lang === 'es' ? 'Extras' : 'Add-Ons'}: </span>
              <span style={{ color: '#fff' }}>{selectedAddons.map(a => lang === 'es' ? a.nombre_es : a.nombre_en).join(', ')}</span>
            </div>
          )}

          <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #2a2a2a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#9a9a9a', fontSize: '0.85rem' }}>{lang === 'es' ? 'Total Estimado' : 'Estimated Total'}</span>
            <span style={{ color: '#FFD700', fontWeight: 800, fontSize: '1.3rem' }}>${total}</span>
          </div>
        </div>
      </div>

      {/* Contact info */}
      <div style={{
        background: 'rgba(255,215,0,0.06)', border: '1px solid rgba(255,215,0,0.2)',
        borderRadius: '12px', padding: '1rem', marginBottom: '2rem',
      }}>
        <p style={{ color: '#e0e0e0', fontSize: '0.85rem', margin: 0 }}>
          {lang === 'es'
            ? '¿Tienes preguntas? Contáctanos:'
            : 'Questions? Reach out to us:'}{' '}
          <a href={`tel:${CONTACT.phone}`} style={{ color: '#FFD700', fontWeight: 700, textDecoration: 'none' }}>
            {CONTACT.phone}
          </a>
          {' · '}
          <a href={`mailto:${CONTACT.email}`} style={{ color: '#FFD700', fontWeight: 700, textDecoration: 'none' }}>
            {CONTACT.email}
          </a>
        </p>
      </div>

      {/* New booking button */}
      <button
        onClick={onNewBooking}
        style={{
          background: 'transparent',
          border: '2px solid #2a2a2a',
          borderRadius: '50px',
          padding: '12px 32px',
          color: '#fff',
          fontSize: '0.9rem',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'border-color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = '#FFD700'}
        onMouseLeave={e => e.currentTarget.style.borderColor = '#2a2a2a'}
      >
        {lang === 'es' ? 'Nueva Reserva' : 'Book Another Service'}
      </button>
    </div>
  );
}
