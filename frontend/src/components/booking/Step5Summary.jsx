import { useState, useEffect } from 'react';
import { useLang } from '../../LangContext';
import { VEHICLES, SERVICES } from '../../data/bookingData';
import { API_URL as API } from '../../config';

export default function Step5Summary({ bookingState, onConfirm }) {
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

  const servicePrice = service ? (lang === 'es' ? service.priceEs : service.priceEn) : 0;
  const addonsTotal = selectedAddons.reduce((acc, a) => acc + a.precio, 0);
  const total = servicePrice + addonsTotal;

  const Row = ({ label, value, highlight }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', padding: '0.6rem 0', borderBottom: '1px solid #2a2a2a' }}>
      <span style={{ color: '#9a9a9a', fontSize: '0.88rem' }}>{label}</span>
      <span style={{ color: highlight ? '#FFD700' : '#fff', fontWeight: highlight ? 800 : 500, fontSize: highlight ? '1.1rem' : '0.9rem', textAlign: 'right' }}>{value}</span>
    </div>
  );

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
          {lang === 'es' ? 'Revisa Tu Reserva' : 'Review Your Booking'}
        </h2>
        <p style={{ color: '#9a9a9a', fontSize: '0.95rem' }}>
          {lang === 'es' ? 'Confirma los detalles antes de enviar' : 'Confirm your details before submitting'}
        </p>
      </div>

      <div style={{ maxWidth: '580px', margin: '0 auto', background: '#141414', border: '1px solid #2a2a2a', borderRadius: '16px', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0' }}>

        {/* Vehicle & Service */}
        <div style={{ marginBottom: '0.5rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#FFD700', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
            {lang === 'es' ? 'Servicio' : 'Service'}
          </div>
          <Row
            label={lang === 'es' ? 'Vehículo' : 'Vehicle'}
            value={vehicle ? (lang === 'es' ? vehicle.labelEs : vehicle.labelEn) : '—'}
          />
          <Row
            label={lang === 'es' ? 'Paquete' : 'Package'}
            value={service ? (lang === 'es' ? service.nameEs : service.nameEn) : '—'}
          />
          {service && (
            <Row
              label={lang === 'es' ? 'Duración estimada' : 'Est. Duration'}
              value={`${service.duration} min`}
            />
          )}
          <Row
            label={lang === 'es' ? 'Precio del paquete' : 'Package Price'}
            value={`$${servicePrice}`}
          />
        </div>

        {/* Add-ons */}
        {selectedAddons.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#FFD700', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
              {lang === 'es' ? 'Extras' : 'Add-Ons'}
            </div>
            {selectedAddons.map(a => (
              <Row
                key={a.id}
                label={lang === 'es' ? a.nombre_es : a.nombre_en}
                value={`+$${a.precio}`}
              />
            ))}
          </div>
        )}

        {/* Contact & Schedule */}
        <div style={{ marginTop: '1rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#FFD700', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
            {lang === 'es' ? 'Datos de Contacto' : 'Contact & Schedule'}
          </div>
          <Row label={lang === 'es' ? 'Nombre' : 'Name'} value={details.name || '—'} />
          <Row label="Email" value={details.email || '—'} />
          <Row label={lang === 'es' ? 'Teléfono' : 'Phone'} value={details.phone || '—'} />
          <Row label={lang === 'es' ? 'Dirección' : 'Address'} value={details.address || '—'} />
          <Row label={lang === 'es' ? 'Fecha' : 'Date'} value={details.date || '—'} />
          <Row label={lang === 'es' ? 'Hora' : 'Time'} value={details.time || '—'} />
          <Row
            label={lang === 'es' ? 'Método de pago' : 'Payment Method'}
            value={bookingState.payment === 'pay_now'
              ? (lang === 'es' ? 'Pagar Ahora (Stripe)' : 'Pay Now (Stripe)')
              : (lang === 'es' ? 'Pagar al Llegar' : 'Pay on Arrival')}
          />
          {details.notes && (
            <Row label={lang === 'es' ? 'Notas' : 'Notes'} value={details.notes} />
          )}
        </div>

        {/* Total */}
        <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '2px solid #2a2a2a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>
            {lang === 'es' ? 'Total Estimado' : 'Estimated Total'}
          </span>
          <span style={{ fontWeight: 800, fontSize: '1.6rem', color: '#FFD700' }}>
            ${total}
          </span>
        </div>
      </div>

      {/* Confirm Button */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button
          onClick={onConfirm}
          style={{
            background: '#FFD700',
            color: '#000',
            border: 'none',
            borderRadius: '50px',
            padding: '16px 48px',
            fontSize: '1rem',
            fontWeight: 800,
            cursor: 'pointer',
            letterSpacing: '0.04em',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 20px rgba(255,215,0,0.3)',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#FFC200'; e.currentTarget.style.transform = 'scale(1.03)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#FFD700'; e.currentTarget.style.transform = 'scale(1)'; }}
        >
          {lang === 'es' ? 'Confirmar Reserva' : 'Confirm Booking'}
        </button>
        <p style={{ color: '#555', fontSize: '0.78rem', marginTop: '1rem' }}>
          {lang === 'es'
            ? 'Al confirmar aceptas nuestros Términos y Condiciones.'
            : 'By confirming you agree to our Terms & Conditions.'}
        </p>
      </div>
    </div>
  );
}
