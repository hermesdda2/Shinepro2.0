import { useState, useEffect } from 'react';
import { useLang } from '../../LangContext';
import { VEHICLES, SERVICES, ADDONS } from '../../data/bookingData';

import { API_URL } from '../../config';

/* ZONES — disabled while location step is removed
const ZONES = {
  1: { nameEn: 'Zone 1 — Irvine / OC Core', nameEs: 'Zona 1 — Irvine / Centro OC' },
  2: { nameEn: 'Zone 2 — Greater OC', nameEs: 'Zona 2 — OC Extendido' },
  3: { nameEn: 'Zone 3 — LA / East OC', nameEs: 'Zona 3 — LA / Este de OC' },
  4: { nameEn: 'Zone 4 — Inland Empire', nameEs: 'Zona 4 — Inland Empire' },
};
*/

export default function Step6Summary({ bookingState, onConfirm }) {
  const { lang } = useLang();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const vehicle = VEHICLES.find(v => v.id === bookingState.vehicle);
  const services = SERVICES[bookingState.vehicle] || [];
  const service = services.find(s => s.id === bookingState.service);
  const selectedAddons = ADDONS.filter(a => (bookingState.addons || []).includes(a.id));
  const details = bookingState.details || {};
  // const location = bookingState.location || {}; // disabled — location step removed
  // const zoneInfo = location.zone ? ZONES[location.zone] : null; // disabled

  const servicePrice = service ? (lang === 'es' ? service.priceEs : service.priceEn) : 0;
  const addonsTotal = selectedAddons.reduce((acc, a) => acc + a.price, 0);
  // const travelFee = location.travelFee || 0; // disabled — location step removed
  const total = servicePrice + addonsTotal;

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);

    const payload = {
      nombre:     details.name,
      email:      details.email,
      telefono:   details.phone,
      direccion:  details.address || '',
      // zona and travel_fee disabled — location step removed
      zona:       null,
      travel_fee: 0,
      vehiculo:   bookingState.vehicle,
      paquete:    bookingState.service,
      addons:     bookingState.addons || [],
      fecha:      details.date,
      hora:       details.time,
      notas:      details.notes || null,
      total,
    };

    try {
      const res = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.status === 201) {
        const data = await res.json();
        onConfirm(data.id);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(
          data.error ||
          (lang === 'es' ? 'Error al enviar la reserva. Intenta de nuevo.' : 'Error submitting booking. Please try again.')
        );
      }
    } catch {
      setError(
        lang === 'es'
          ? 'No se pudo conectar con el servidor. Verifica tu conexión.'
          : 'Could not connect to the server. Check your connection.'
      );
    } finally {
      setLoading(false);
    }
  };

  const Row = ({ label, value, highlight }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', padding: '0.6rem 0', borderBottom: '1px solid #2a2a2a' }}>
      <span style={{ color: '#9a9a9a', fontSize: '0.88rem' }}>{label}</span>
      <span style={{ color: highlight ? '#FFD700' : '#fff', fontWeight: highlight ? 800 : 500, fontSize: highlight ? '1.1rem' : '0.9rem', textAlign: 'right' }}>{value}</span>
    </div>
  );

  const SectionHeader = ({ label }) => (
    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#FFD700', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem', marginTop: '1rem' }}>
      {label}
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

      <div style={{ maxWidth: '580px', margin: '0 auto', background: '#141414', border: '1px solid #2a2a2a', borderRadius: '16px', padding: '1.75rem' }}>

        {/* Service */}
        <SectionHeader label={lang === 'es' ? 'Servicio' : 'Service'} />
        <Row label={lang === 'es' ? 'Vehículo' : 'Vehicle'} value={vehicle ? (lang === 'es' ? vehicle.labelEs : vehicle.labelEn) : '—'} />
        <Row label={lang === 'es' ? 'Paquete' : 'Package'} value={service ? (lang === 'es' ? service.nameEs : service.nameEn) : '—'} />
        {service && <Row label={lang === 'es' ? 'Duración estimada' : 'Est. Duration'} value={`${service.duration} min`} />}
        <Row label={lang === 'es' ? 'Precio del paquete' : 'Package Price'} value={`$${servicePrice}`} />

        {/* Add-ons */}
        {selectedAddons.length > 0 && (
          <>
            <SectionHeader label={lang === 'es' ? 'Extras' : 'Add-Ons'} />
            {selectedAddons.map(a => (
              <Row key={a.id} label={lang === 'es' ? a.nameEs : a.nameEn} value={`+$${a.price}`} />
            ))}
          </>
        )}

        {/* Location — disabled while location step is removed
        <SectionHeader label={lang === 'es' ? 'Ubicación' : 'Location'} />
        <Row label={lang === 'es' ? 'Dirección' : 'Service Address'} value={location.address || details.address || '—'} />
        {zoneInfo && (
          <Row label={lang === 'es' ? 'Zona' : 'Zone'} value={lang === 'es' ? zoneInfo.nameEs : zoneInfo.nameEn} />
        )}
        <Row
          label={lang === 'es' ? 'Cargo de Viaje' : 'Travel Fee'}
          value={travelFee === 0 ? 'FREE' : `+$${travelFee}`}
        />
        */}

        {/* Contact & Schedule */}
        <SectionHeader label={lang === 'es' ? 'Datos de Contacto' : 'Contact & Schedule'} />
        <Row label={lang === 'es' ? 'Nombre' : 'Name'} value={details.name || '—'} />
        <Row label="Email" value={details.email || '—'} />
        <Row label={lang === 'es' ? 'Teléfono' : 'Phone'} value={details.phone || '—'} />
        <Row label={lang === 'es' ? 'Fecha' : 'Date'} value={details.date || '—'} />
        <Row label={lang === 'es' ? 'Hora' : 'Time'} value={details.time || '—'} />
        <Row
          label={lang === 'es' ? 'Método de pago' : 'Payment Method'}
          value={lang === 'es' ? 'Pagar al Llegar' : 'Pay on Arrival'}
        />
        {details.notes && <Row label={lang === 'es' ? 'Notas' : 'Notes'} value={details.notes} />}

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

      {/* Error message */}
      {error && (
        <div style={{
          maxWidth: '580px', margin: '1rem auto 0',
          background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.4)',
          borderRadius: '10px', padding: '0.85rem 1.1rem',
          color: '#FF6B6B', fontSize: '0.88rem', textAlign: 'center',
        }}>
          {error}
        </div>
      )}

      {/* Confirm button */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button
          onClick={handleConfirm}
          disabled={loading}
          style={{
            background: loading ? '#2a2a2a' : '#FFD700',
            color: loading ? '#555' : '#000',
            border: 'none', borderRadius: isMobile ? '14px' : '50px',
            padding: isMobile ? '16px' : '16px 48px',
            width: isMobile ? '100%' : 'auto',
            fontSize: '1rem', fontWeight: 800,
            cursor: loading ? 'not-allowed' : 'pointer',
            letterSpacing: '0.04em', transition: 'all 0.2s ease',
            boxShadow: loading ? 'none' : '0 4px 20px rgba(255,215,0,0.3)',
            minWidth: isMobile ? 'unset' : '220px',
          }}
          onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = '#FFC200'; e.currentTarget.style.transform = 'scale(1.03)'; } }}
          onMouseLeave={e => { if (!loading) { e.currentTarget.style.background = '#FFD700'; e.currentTarget.style.transform = 'scale(1)'; } }}
        >
          {loading
            ? (lang === 'es' ? 'Enviando...' : 'Submitting...')
            : (lang === 'es' ? 'Confirmar Reserva' : 'Confirm Booking')}
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
