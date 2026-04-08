import { useLang } from '../../LangContext';
import { TIME_SLOTS } from '../../data/bookingData';

const inputStyle = {
  width: '100%',
  background: '#1a1a1a',
  border: '1.5px solid #2a2a2a',
  borderRadius: '12px',
  padding: '12px 16px',
  color: '#ffffff',
  fontSize: '0.92rem',
  outline: 'none',
  transition: 'border-color 0.2s',
  fontFamily: 'inherit',
};

const labelStyle = {
  display: 'block',
  fontSize: '0.82rem',
  fontWeight: 600,
  color: '#9a9a9a',
  marginBottom: '6px',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
};

function Field({ label, children }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

export default function Step4Details({ bookingState, onUpdate }) {
  const { lang } = useLang();
  const details = bookingState.details || {};

  const set = (key, val) => onUpdate({ details: { ...details, [key]: val } });

  // Today's date as min for date picker
  const today = new Date().toISOString().split('T')[0];

  const focusStyle = (e) => { e.target.style.borderColor = '#FFD700'; };
  const blurStyle = (e) => { e.target.style.borderColor = '#2a2a2a'; };

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
          {lang === 'es' ? 'Tu Información' : 'Your Information'}
        </h2>
        <p style={{ color: '#9a9a9a', fontSize: '0.95rem' }}>
          {lang === 'es' ? 'Completa tus datos para la reserva' : 'Fill in your details to complete the booking'}
        </p>
      </div>

      <div style={{ maxWidth: '620px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* Name */}
        <Field label={lang === 'es' ? 'Nombre Completo' : 'Full Name'}>
          <input
            type="text"
            placeholder={lang === 'es' ? 'Tu nombre completo' : 'Your full name'}
            value={details.name || ''}
            onChange={e => set('name', e.target.value)}
            onFocus={focusStyle} onBlur={blurStyle}
            style={inputStyle}
          />
        </Field>

        {/* Email + Phone */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Field label="Email">
            <input
              type="email"
              placeholder="email@example.com"
              value={details.email || ''}
              onChange={e => set('email', e.target.value)}
              onFocus={focusStyle} onBlur={blurStyle}
              style={inputStyle}
            />
          </Field>
          <Field label={lang === 'es' ? 'Teléfono' : 'Phone'}>
            <input
              type="tel"
              placeholder="+1 (000) 000-0000"
              value={details.phone || ''}
              onChange={e => set('phone', e.target.value)}
              onFocus={focusStyle} onBlur={blurStyle}
              style={inputStyle}
            />
          </Field>
        </div>

        {/* Address */}
        <Field label={lang === 'es' ? 'Dirección del Servicio' : 'Service Address'}>
          <input
            type="text"
            placeholder={lang === 'es' ? 'Dirección completa, ciudad, CA, código postal' : 'Full address, city, CA, zip code'}
            value={details.address || ''}
            onChange={e => set('address', e.target.value)}
            onFocus={focusStyle} onBlur={blurStyle}
            style={inputStyle}
          />
        </Field>

        {/* Date + Time */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Field label={lang === 'es' ? 'Fecha Preferida' : 'Preferred Date'}>
            <input
              type="date"
              min={today}
              value={details.date || ''}
              onChange={e => set('date', e.target.value)}
              onFocus={focusStyle} onBlur={blurStyle}
              style={{ ...inputStyle, colorScheme: 'dark' }}
            />
          </Field>
          <Field label={lang === 'es' ? 'Hora Preferida' : 'Preferred Time'}>
            <select
              value={details.time || ''}
              onChange={e => set('time', e.target.value)}
              onFocus={focusStyle} onBlur={blurStyle}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              <option value="">{lang === 'es' ? 'Seleccionar hora' : 'Select time'}</option>
              {TIME_SLOTS.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </Field>
        </div>

        {/* Notes */}
        <Field label={lang === 'es' ? 'Notas Adicionales (opcional)' : 'Additional Notes (optional)'}>
          <textarea
            rows={3}
            placeholder={lang === 'es' ? 'Instrucciones especiales, código de acceso, etc.' : 'Special instructions, gate code, parking notes, etc.'}
            value={details.notes || ''}
            onChange={e => set('notes', e.target.value)}
            onFocus={focusStyle} onBlur={blurStyle}
            style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }}
          />
        </Field>

        {/* Payment method */}
        <Field label={lang === 'es' ? 'Método de Pago' : 'Payment Method'}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {[
              { val: 'pay_now', labelEn: 'Pay Now', labelEs: 'Pagar Ahora', icon: '💳', noteEn: 'Secure payment via Stripe', noteEs: 'Pago seguro con Stripe' },
              { val: 'pay_arrival', labelEn: 'Pay on Arrival', labelEs: 'Pagar al Llegar', icon: '🤝', noteEn: 'Pay when service is complete', noteEs: 'Paga cuando termine el servicio' },
            ].map(opt => {
              const isActive = bookingState.payment === opt.val;
              return (
                <button
                  key={opt.val}
                  onClick={() => onUpdate({ payment: opt.val })}
                  style={{
                    background: '#1a1a1a',
                    border: `2px solid ${isActive ? '#FFD700' : '#2a2a2a'}`,
                    borderRadius: '12px',
                    padding: '1rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                    boxShadow: isActive ? '0 0 0 1px #FFD700, 0 0 12px rgba(255,215,0,0.1)' : 'none',
                  }}
                >
                  <div style={{ fontSize: '1.4rem', marginBottom: '6px' }}>{opt.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: isActive ? '#FFD700' : '#fff', marginBottom: '3px' }}>
                    {lang === 'es' ? opt.labelEs : opt.labelEn}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#9a9a9a' }}>
                    {lang === 'es' ? opt.noteEs : opt.noteEn}
                  </div>
                </button>
              );
            })}
          </div>
        </Field>

      </div>
    </div>
  );
}
