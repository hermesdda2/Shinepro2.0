import { useState, useEffect } from 'react';
import { useLang } from '../LangContext';
import { VEHICLES, SERVICES, ADDONS } from '../data/bookingData';
import StepIndicator from '../components/booking/StepIndicator';
import Step1Vehicle from '../components/booking/Step1Vehicle';
import Step2Service from '../components/booking/Step2Service';
import Step3AddOns from '../components/booking/Step3AddOns';
// import Step4Location from '../components/booking/Step4Location'; // disabled — location step removed
import Step5Details from '../components/booking/Step5Details';
import Step6Summary from '../components/booking/Step6Summary';
import BookingConfirmed from '../components/booking/BookingConfirmed';

const INITIAL_STATE = {
  vehicle: null,
  service: null,
  addons: [],
  // location: { address: '', zone: null, travelFee: 0, coordinates: { lat: null, lng: null } }, // disabled — location step removed
  details: {},
  payment: null,
};

/* ZONE_NAMES — disabled while location step is removed
const ZONE_NAMES = {
  1: { en: 'Zone 1', es: 'Zona 1' },
  2: { en: 'Zone 2', es: 'Zona 2' },
  3: { en: 'Zone 3', es: 'Zona 3' },
  4: { en: 'Zone 4', es: 'Zona 4' },
};
*/

function BookingSidebar({ bookingState, lang }) {
  const [collapsed, setCollapsed] = useState(false);

  const vehicle = VEHICLES.find(v => v.id === bookingState.vehicle);
  const services = SERVICES[bookingState.vehicle] || [];
  const service = services.find(s => s.id === bookingState.service);
  const selectedAddons = ADDONS.filter(a => (bookingState.addons || []).includes(a.id));

  const servicePrice = service ? (lang === 'es' ? service.priceEs : service.priceEn) : 0;
  const addonsTotal = selectedAddons.reduce((acc, a) => acc + a.price, 0);
  // const travelFee = location.travelFee || 0; // disabled — location step removed
  const total = servicePrice + addonsTotal;

  return (
    <div style={{
      background: '#141414', border: '1px solid #2a2a2a', borderRadius: '16px',
      overflow: 'hidden', position: 'sticky', top: '100px',
    }}>
      {/* Header */}
      <div
        style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #2a2a2a', cursor: 'pointer' }}
        onClick={() => setCollapsed(c => !c)}
      >
        <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#FFD700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {lang === 'es' ? 'Tu Reserva' : 'Booking Summary'}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#FFD700', fontWeight: 800, fontSize: '1rem' }}>${total}</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
            style={{ transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
            <path d="M2 5l5 5 5-5" stroke="#9a9a9a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {!collapsed && (
        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {vehicle ? (
            <SidebarRow label={lang === 'es' ? 'Vehículo' : 'Vehicle'} value={lang === 'es' ? vehicle.labelEs : vehicle.labelEn} />
          ) : (
            <SidebarEmpty label={lang === 'es' ? 'Selecciona un vehículo' : 'Select a vehicle'} />
          )}

          {service ? (
            <>
              <SidebarRow label={lang === 'es' ? 'Paquete' : 'Package'} value={`${lang === 'es' ? service.nameEs : service.nameEn} — $${servicePrice}`} />
              <SidebarRow label={lang === 'es' ? 'Duración' : 'Duration'} value={`${service.duration} min`} />
            </>
          ) : (
            <SidebarEmpty label={lang === 'es' ? 'Selecciona un paquete' : 'Select a package'} />
          )}

          {selectedAddons.length > 0 && (
            <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: '10px' }}>
              <div style={{ fontSize: '0.7rem', color: '#9a9a9a', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                {lang === 'es' ? 'Extras' : 'Add-Ons'}
              </div>
              {selectedAddons.map(a => (
                <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#e0e0e0', marginBottom: '4px' }}>
                  <span>{lang === 'es' ? a.nameEs : a.nameEn}</span>
                  <span style={{ color: '#FFD700' }}>+${a.price}</span>
                </div>
              ))}
            </div>
          )}

          {/* Travel fee row — disabled while location step is removed
          {location.zone !== null && location.zone !== undefined && (
            <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: '#9a9a9a' }}>
                  {lang === 'es' ? 'Cargo de Viaje' : 'Travel Fee'}{' '}
                  <span style={{ color: '#555' }}>({lang === 'es' ? ZONE_NAMES[location.zone]?.es : ZONE_NAMES[location.zone]?.en})</span>
                </span>
                <span style={{ color: travelFee === 0 ? '#4ade80' : '#FFD700', fontWeight: 700 }}>
                  {travelFee === 0 ? 'FREE' : `+$${travelFee}`}
                </span>
              </div>
            </div>
          )}
          */}

          {/* Total */}
          <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#fff' }}>
              {lang === 'es' ? 'Total Estimado' : 'Estimated Total'}
            </span>
            <span style={{ fontWeight: 800, fontSize: '1.3rem', color: '#FFD700' }}>
              ${total}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function SidebarRow({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: '0.68rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>{label}</div>
      <div style={{ fontSize: '0.88rem', color: '#e0e0e0', fontWeight: 500 }}>{value}</div>
    </div>
  );
}

function SidebarEmpty({ label }) {
  return <div style={{ fontSize: '0.82rem', color: '#444', fontStyle: 'italic' }}>{label}</div>;
}

function canProceed(step, bookingState) {
  if (step === 1) return !!bookingState.vehicle;
  if (step === 2) return !!bookingState.service;
  if (step === 3) return true; // add-ons optional
  // step 4 was Location — removed; step 4 is now Details
  if (step === 4) {
    const d = bookingState.details || {};
    return !!(d.name && d.email && d.phone && d.date && d.time);
  }
  return true;
}

export default function Booking() {
  const { lang } = useLang();
  const [step, setStep] = useState(1);
  const [bookingState, setBookingState] = useState(INITIAL_STATE);
  const [confirmed, setConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const update = (partial) => setBookingState(prev => ({ ...prev, ...partial }));

  const goTo = (newStep) => {
    setAnimating(true);
    setTimeout(() => {
      setStep(newStep);
      setAnimating(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 150);
  };

  const next = () => {
    if (canProceed(step, bookingState)) {
      goTo(step + 1);
    } else {
      // Notify active step to show all validation errors
      window.dispatchEvent(new CustomEvent('shinepro:next-attempt'));
    }
  };
  const back = () => { if (step > 1) goTo(step - 1); };

  const handleConfirm = (id) => {
    setBookingId(id);
    setAnimating(true);
    setTimeout(() => {
      setConfirmed(true);
      setAnimating(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 150);
  };

  const handleNewBooking = () => {
    setBookingState(INITIAL_STATE);
    setConfirmed(false);
    setBookingId(null);
    setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const TOTAL_STEPS = 5;
  const showSidebar = step >= 2 && !confirmed && !isMobile;

  return (
    <div style={{ minHeight: '100vh', background: '#0a0d14', paddingTop: '90px', paddingBottom: isMobile ? '6rem' : '4rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.25rem' }}>

        {/* Page header */}
        {!confirmed && (
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{
              display: 'inline-block', background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.25)',
              borderRadius: '50px', padding: '4px 16px', fontSize: '0.75rem', fontWeight: 700,
              color: '#FFD700', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem',
            }}>
              {lang === 'es' ? 'Reserva en Línea' : 'Online Booking'}
            </div>
            <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 800, color: '#fff', marginBottom: '0.4rem' }}>
              {lang === 'es' ? 'Agenda Tu Servicio' : 'Schedule Your Service'}
            </h1>
            <p style={{ color: '#9a9a9a', fontSize: '0.95rem' }}>
              {lang === 'es'
                ? 'Proceso rápido y sencillo — 5 pasos para tu cita perfecta'
                : 'Quick & easy — 5 steps to your perfect detail appointment'}
            </p>
          </div>
        )}

        {/* Step indicator */}
        {!confirmed && <StepIndicator currentStep={step} />}

        {/* Main layout */}
        <div style={{
          display: showSidebar ? 'grid' : 'block',
          gridTemplateColumns: showSidebar ? '1fr 300px' : undefined,
          gap: '2rem',
          alignItems: 'start',
        }}>
          {/* Step content */}
          <div style={{
            opacity: animating ? 0 : 1,
            transform: animating ? 'translateY(8px)' : 'translateY(0)',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
          }}>
            {confirmed ? (
              <BookingConfirmed bookingState={bookingState} bookingId={bookingId} onNewBooking={handleNewBooking} />
            ) : (
              <>
                {step === 1 && <Step1Vehicle bookingState={bookingState} onUpdate={update} />}
                {step === 2 && <Step2Service bookingState={bookingState} onUpdate={update} />}
                {step === 3 && <Step3AddOns bookingState={bookingState} onUpdate={update} />}
                {/* step 4 was Step4Location — removed */}
                {step === 4 && <Step5Details bookingState={bookingState} onUpdate={update} />}
                {step === 5 && <Step6Summary bookingState={bookingState} onConfirm={handleConfirm} />}
              </>
            )}
          </div>

          {/* Sidebar */}
          {showSidebar && <BookingSidebar bookingState={bookingState} lang={lang} />}
        </div>

        {/* Desktop navigation buttons */}
        {!confirmed && step < TOTAL_STEPS && !isMobile && (
          <div style={{
            display: 'flex',
            justifyContent: step === 1 ? 'flex-end' : 'space-between',
            alignItems: 'center',
            marginTop: '2.5rem',
            maxWidth: showSidebar ? 'calc(100% - 332px)' : '100%',
          }}>
            {step > 1 && (
              <button
                onClick={back}
                style={{
                  background: 'transparent', border: '2px solid #2a2a2a',
                  borderRadius: '50px', padding: '12px 28px',
                  color: '#fff', fontSize: '0.92rem', fontWeight: 600,
                  cursor: 'pointer', transition: 'border-color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#555'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#2a2a2a'}
              >
                ← {lang === 'es' ? 'Atrás' : 'Back'}
              </button>
            )}

            <button
              onClick={next}
              style={{
                background: canProceed(step, bookingState) ? '#FFD700' : '#2a2a2a',
                color: canProceed(step, bookingState) ? '#000' : '#555',
                border: 'none', borderRadius: '50px', padding: '14px 36px',
                fontSize: '0.95rem', fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: canProceed(step, bookingState) ? '0 4px 16px rgba(255,215,0,0.25)' : 'none',
              }}
              onMouseEnter={e => { if (canProceed(step, bookingState)) e.currentTarget.style.background = '#FFC200'; }}
              onMouseLeave={e => { if (canProceed(step, bookingState)) e.currentTarget.style.background = '#FFD700'; }}
            >
              {lang === 'es' ? 'Siguiente Paso' : 'Next Step'} →
            </button>
          </div>
        )}

        {/* Mobile fixed bottom navigation */}
        {!confirmed && step < TOTAL_STEPS && isMobile && (
          <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000,
            background: '#0a0d14', borderTop: '1px solid #1a1a1a',
            padding: '12px 16px',
            display: 'flex',
            gap: step > 1 ? '10px' : '0',
          }}>
            {step > 1 && (
              <button
                onClick={back}
                style={{
                  background: 'transparent', border: '2px solid #2a2a2a',
                  borderRadius: '12px', padding: '14px 18px',
                  color: '#fff', fontSize: '0.92rem', fontWeight: 600,
                  cursor: 'pointer', flexShrink: 0,
                }}
              >
                ←
              </button>
            )}
            <button
              onClick={next}
              style={{
                flex: 1,
                background: canProceed(step, bookingState) ? '#FFD700' : '#2a2a2a',
                color: canProceed(step, bookingState) ? '#000' : '#555',
                border: 'none', borderRadius: '12px', padding: '16px',
                fontSize: '1rem', fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: canProceed(step, bookingState) ? '0 4px 16px rgba(255,215,0,0.25)' : 'none',
              }}
            >
              {lang === 'es' ? 'Siguiente Paso' : 'Next Step'} →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
