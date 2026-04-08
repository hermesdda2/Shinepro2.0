import { useState, useRef, useEffect, useCallback } from 'react';
import { useLang } from '../../LangContext';
import DatePicker from 'react-datepicker';
import { isBefore, startOfDay } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import { API_URL as API } from '../../config';

const DOW_TO_KEY = ['sun','mon','tue','wed','thu','fri','sat'];

// ━━━ VALIDATION HELPERS ━━━

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(val) {
  if (!val) return 'required';
  if (!EMAIL_REGEX.test(val)) return 'invalid';
  return null;
}

function countDigits(val) {
  return (val || '').replace(/\D/g, '').length;
}

function validatePhone(val) {
  if (!val) return 'required';
  const digits = countDigits(val);
  if (digits < 10 || digits > 11) return 'invalid';
  return null;
}

function formatPhone(raw) {
  // Strip everything except digits
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 0) return '';
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  // 11 digits — treat first as country code
  return `+${digits.slice(0, 1)} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 11)}`;
}

// Only allow digits, spaces, +, (, ), -
function sanitizePhoneInput(val) {
  return val.replace(/[^\d\s+()-]/g, '');
}

function isFormValid(details) {
  const addr = details.address !== undefined ? details.address : '';
  return (
    !!details.name?.trim() &&
    validateEmail(details.email) === null &&
    validatePhone(details.phone) === null &&
    !!addr.trim() &&
    !!details.date &&
    !!details.time
  );
}

// ━━━ STYLES ━━━

const labelStyle = {
  display: 'block',
  fontSize: '0.82rem',
  fontWeight: 600,
  color: '#9a9a9a',
  marginBottom: '6px',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
};

function getInputStyle(hasError, isValid) {
  return {
    width: '100%',
    background: '#1a1a1a',
    border: `1.5px solid ${hasError ? '#FF4444' : isValid ? '#FFD700' : '#2a2a2a'}`,
    borderRadius: '12px',
    padding: '12px 16px',
    color: '#ffffff',
    fontSize: '16px', // 16px prevents iOS auto-zoom
    outline: 'none',
    transition: 'border-color 0.2s',
    fontFamily: 'inherit',
  };
}

function ErrorMsg({ msg }) {
  if (!msg) return null;
  return (
    <p style={{
      fontSize: '0.75rem',
      color: '#FF4444',
      marginTop: '5px',
      animation: 'fadeInErr 0.2s ease',
    }}>
      {msg}
    </p>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

// Calendar icon
function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="1.5" y="3" width="15" height="13.5" rx="2" stroke="#FFD700" strokeWidth="1.5"/>
      <path d="M1.5 7.5h15" stroke="#FFD700" strokeWidth="1.5"/>
      <path d="M6 1.5V4.5" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 1.5V4.5" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="6" cy="11" r="1" fill="#FFD700"/>
      <circle cx="9" cy="11" r="1" fill="#FFD700"/>
      <circle cx="12" cy="11" r="1" fill="#FFD700"/>
    </svg>
  );
}

const today = startOfDay(new Date());

// ━━━ CALENDAR STYLES ━━━
const CALENDAR_STYLES = `
  @keyframes fadeInErr { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }

  .shinepro-datepicker-wrapper { width: 100%; position: relative; }
  .shinepro-datepicker-wrapper .react-datepicker-wrapper,
  .shinepro-datepicker-wrapper .react-datepicker__input-container { width: 100%; display: block; }

  .shinepro-datepicker-popper { z-index: 9999 !important; }
  .shinepro-datepicker-popper .react-datepicker {
    background: #1a1a1a !important; border: 1px solid #2a2a2a !important;
    border-radius: 16px !important; box-shadow: 0 20px 60px rgba(0,0,0,0.5) !important;
    font-family: inherit !important; overflow: hidden; color: #fff !important;
  }
  .shinepro-datepicker-popper .react-datepicker__header {
    background: #141414 !important; border-bottom: 1px solid #2a2a2a !important;
    border-radius: 0 !important; padding: 14px 16px 10px !important;
  }
  .shinepro-datepicker-popper .react-datepicker__current-month {
    color: #fff !important; font-weight: 700 !important; font-size: 1rem !important;
    font-family: inherit !important; margin-bottom: 8px !important;
  }
  .shinepro-datepicker-popper .react-datepicker__navigation { top: 12px !important; }
  .shinepro-datepicker-popper .react-datepicker__navigation-icon::before {
    border-color: #9a9a9a !important; border-width: 2px 2px 0 0 !important;
    width: 7px !important; height: 7px !important; transition: border-color 0.2s !important;
  }
  .shinepro-datepicker-popper .react-datepicker__navigation:hover .react-datepicker__navigation-icon::before { border-color: #FFD700 !important; }
  .shinepro-datepicker-popper .react-datepicker__day-names { margin: 0 !important; padding: 6px 0 2px !important; }
  .shinepro-datepicker-popper .react-datepicker__day-name {
    color: #9a9a9a !important; font-size: 0.72rem !important; text-transform: uppercase !important;
    font-weight: 600 !important; width: 2.2rem !important; line-height: 2.2rem !important; font-family: inherit !important;
  }
  .shinepro-datepicker-popper .react-datepicker__month { background: #1a1a1a !important; margin: 0 !important; padding: 8px 10px 12px !important; }
  .shinepro-datepicker-popper .react-datepicker__day {
    color: #e0e0e0 !important; border-radius: 8px !important; width: 2.2rem !important;
    line-height: 2.2rem !important; font-size: 0.85rem !important; font-family: inherit !important;
    transition: background 0.15s, color 0.15s !important; margin: 2px !important;
  }
  .shinepro-datepicker-popper .react-datepicker__day:hover:not(.react-datepicker__day--disabled):not(.react-datepicker__day--selected) {
    background: #2a2a2a !important; color: #fff !important;
  }
  .shinepro-datepicker-popper .react-datepicker__day--selected,
  .shinepro-datepicker-popper .react-datepicker__day--keyboard-selected {
    background: #FFD700 !important; color: #000 !important; font-weight: 700 !important; border-radius: 8px !important;
  }
  .shinepro-datepicker-popper .react-datepicker__day--selected:hover { background: #FFC200 !important; }
  .shinepro-datepicker-popper .react-datepicker__day--today:not(.react-datepicker__day--selected) {
    border: 1px solid #FFD700 !important; color: #FFD700 !important; font-weight: 600 !important; background: transparent !important;
  }
  .shinepro-datepicker-popper .react-datepicker__day--disabled { color: #333 !important; cursor: not-allowed !important; opacity: 0.5 !important; }
  .shinepro-datepicker-popper .react-datepicker__day--outside-month { color: #333 !important; opacity: 0.4 !important; }
  .shinepro-datepicker-popper .react-datepicker__triangle { display: none !important; }
`;

// ━━━ MAIN COMPONENT ━━━

export default function Step5Details({ bookingState, onUpdate }) {
  const { lang } = useLang();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const details = bookingState.details || {};

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  const addressFromLocation = bookingState.location?.address || '';

  // Effective address value (prefer details.address if user typed, else prefill)
  const addressValue = details.address !== undefined ? details.address : addressFromLocation;

  // ── Schedule from admin settings ──
  const [scheduleSettings, setScheduleSettings] = useState(null);
  useEffect(() => {
    fetch(`${API}/api/settings`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.schedule) setScheduleSettings(data.schedule); })
      .catch(() => {});
  }, []);

  // Date is disabled if: in the past, or the day is disabled in schedule, or it's a holiday
  const isDateDisabled = (date) => {
    if (isBefore(date, today)) return true;
    if (!scheduleSettings) return false; // allow all while loading
    const dayKey = DOW_TO_KEY[date.getDay()];
    const dayConfig = scheduleSettings.days?.[dayKey];
    if (!dayConfig?.enabled) return true;
    if ((dayConfig.hours || []).length === 0) return true;
    // Check holidays
    const ds = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
    const holidays = scheduleSettings.holidays || [];
    if (holidays.some(h => (typeof h === 'object' ? h.date : h) === ds)) return true;
    return false;
  };

  // Available time slots for selected date
  const availableSlots = (() => {
    if (!scheduleSettings || !details.date) return null; // null = show all
    const d = new Date(details.date + 'T12:00:00');
    const dayKey = DOW_TO_KEY[d.getDay()];
    const hours = scheduleSettings.days?.[dayKey]?.hours || [];
    return hours;
  })();

  // Which fields the user has interacted with
  const [touched, setTouched] = useState({});

  // Field refs for scroll-to-error
  const refs = {
    name: useRef(null),
    email: useRef(null),
    phone: useRef(null),
    address: useRef(null),
    date: useRef(null),
    time: useRef(null),
    payment: useRef(null),
  };

  const touch = (field) => setTouched(prev => ({ ...prev, [field]: true }));

  const set = useCallback((key, val) => {
    onUpdate({ details: { ...details, [key]: val } });
  }, [details, onUpdate]);

  // Compute errors
  const errors = {
    name: !details.name?.trim() ? (lang === 'es' ? 'Este campo es requerido' : 'This field is required') : null,
    email: (() => {
      const r = validateEmail(details.email);
      if (r === 'required') return lang === 'es' ? 'Este campo es requerido' : 'This field is required';
      if (r === 'invalid') return lang === 'es' ? 'Ingresa un email válido' : 'Please enter a valid email address';
      return null;
    })(),
    phone: (() => {
      const r = validatePhone(details.phone);
      if (r === 'required') return lang === 'es' ? 'Este campo es requerido' : 'This field is required';
      if (r === 'invalid') return lang === 'es' ? 'Ingresa un número de teléfono válido (US)' : 'Please enter a valid US phone number';
      return null;
    })(),
    address: !addressValue?.trim() ? (lang === 'es' ? 'Este campo es requerido' : 'This field is required') : null,
    date: !details.date ? (lang === 'es' ? 'Selecciona una fecha' : 'Please select a date') : null,
    time: !details.time ? (lang === 'es' ? 'Selecciona una hora' : 'Please select a time') : null,
  };

  const hasError = (field) => touched[field] && !!errors[field];
  const isFieldValid = (field) => touched[field] && !errors[field];

  // When canProceed in Booking.jsx evaluates to false AND all fields are filled
  // we need a way to show all errors. We do this by listening for a click on the
  // disabled Next button — we attach a global click listener that triggers "showAll".
  // The Next button is outside this component so we use a document listener
  // that fires when the user clicks the Next Step area while the form is invalid.
  useEffect(() => {
    const handleNextAttempt = () => {
      if (!isFormValid(details)) {
        // Mark all fields as touched so errors appear
        setTouched({ name: true, email: true, phone: true, address: true, date: true, time: true });
        // Scroll to first error
        const fieldOrder = ['name', 'email', 'phone', 'address', 'date', 'time'];
        for (const f of fieldOrder) {
          if (errors[f] && refs[f]?.current) {
            refs[f].current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            break;
          }
        }
      }
    };
    window.addEventListener('shinepro:next-attempt', handleNextAttempt);
    return () => window.removeEventListener('shinepro:next-attempt', handleNextAttempt);
  }, [details, errors]);

  // Set payment to 'arrival' by default on mount
  useEffect(() => {
    if (!bookingState.payment) {
      onUpdate({ payment: 'arrival' });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Phone: auto-format and sanitize
  const handlePhoneChange = (e) => {
    const sanitized = sanitizePhoneInput(e.target.value);
    const formatted = formatPhone(sanitized);
    set('phone', formatted);
  };

  // Date picker
  const selectedDate = details.date ? new Date(details.date + 'T12:00:00') : null;
  const handleDateChange = (date) => {
    touch('date');
    if (!date) { set('date', ''); return; }
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const ds = `${yyyy}-${mm}-${dd}`;
    // Clear time if the currently selected time won't be available for the new date
    if (scheduleSettings && details.time) {
      const dayKey = DOW_TO_KEY[date.getDay()];
      const hours = scheduleSettings.days?.[dayKey]?.hours || [];
      if (!hours.includes(details.time)) {
        onUpdate({ details: { ...details, date: ds, time: '' } });
        return;
      }
    }
    set('date', ds);
  };

  const displayDate = selectedDate
    ? selectedDate.toLocaleDateString(lang === 'es' ? 'es-US' : 'en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
    : '';

  return (
    <div>
      <style>{CALENDAR_STYLES}</style>

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
          {lang === 'es' ? 'Tu Información' : 'Your Information'}
        </h2>
        <p style={{ color: '#9a9a9a', fontSize: '0.95rem' }}>
          {lang === 'es' ? 'Completa tus datos para la reserva' : 'Fill in your details to complete the booking'}
        </p>
      </div>

      <div style={{ maxWidth: '620px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* ── Full Name ── */}
        <div ref={refs.name}>
          <Field label={lang === 'es' ? 'Nombre Completo' : 'Full Name'}>
            <input
              type="text"
              placeholder={lang === 'es' ? 'Tu nombre completo' : 'Your full name'}
              value={details.name || ''}
              onChange={e => set('name', e.target.value)}
              onBlur={() => touch('name')}
              style={getInputStyle(hasError('name'), isFieldValid('name'))}
            />
            <ErrorMsg msg={hasError('name') ? errors.name : null} />
          </Field>
        </div>

        {/* ── Email + Phone ── */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem' }}>
          <div ref={refs.email}>
            <Field label="Email">
              <input
                type="email"
                placeholder="email@example.com"
                value={details.email || ''}
                onChange={e => set('email', e.target.value)}
                onBlur={() => touch('email')}
                style={getInputStyle(hasError('email'), isFieldValid('email'))}
              />
              <ErrorMsg msg={hasError('email') ? errors.email : null} />
            </Field>
          </div>
          <div ref={refs.phone}>
            <Field label={lang === 'es' ? 'Teléfono' : 'Phone'}>
              <input
                type="tel"
                placeholder="+1 (000) 000-0000"
                value={details.phone || ''}
                onChange={handlePhoneChange}
                onBlur={() => touch('phone')}
                style={getInputStyle(hasError('phone'), isFieldValid('phone'))}
              />
              <ErrorMsg msg={hasError('phone') ? errors.phone : null} />
            </Field>
          </div>
        </div>

        {/* ── Address ── */}
        <div ref={refs.address}>
          <Field label={lang === 'es' ? 'Dirección del Servicio' : 'Service Address'}>
            <input
              type="text"
              placeholder={lang === 'es' ? 'Dirección completa, ciudad, CA, código postal' : 'Full address, city, CA, zip code'}
              value={addressValue}
              onChange={e => set('address', e.target.value)}
              onBlur={() => touch('address')}
              style={getInputStyle(hasError('address'), isFieldValid('address'))}
            />
            {addressFromLocation && !details.address && !hasError('address') && (
              <p style={{ fontSize: '0.75rem', color: '#FFD700', marginTop: '5px', opacity: 0.8 }}>
                {lang === 'es' ? '✓ Pre-rellenado desde tu ubicación' : '✓ Pre-filled from your location'}
              </p>
            )}
            <ErrorMsg msg={hasError('address') ? errors.address : null} />
          </Field>
        </div>

        {/* ── Date + Time ── */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem' }}>

          <div ref={refs.date}>
            <Field label={lang === 'es' ? 'Fecha Preferida' : 'Preferred Date'}>
              <div className="shinepro-datepicker-wrapper">
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  minDate={today}
                  filterDate={(date) => !isDateDisabled(date)}
                  dateFormat="MMM d, yyyy"
                  popperClassName="shinepro-datepicker-popper"
                  calendarStartDay={0}
                  showPopperArrow={false}
                  popperPlacement="bottom-start"
                  customInput={
                    <div
                      style={{ position: 'relative', cursor: 'pointer' }}
                      onClick={() => touch('date')}
                    >
                      <input
                        readOnly
                        value={displayDate}
                        placeholder={lang === 'es' ? 'Seleccionar fecha' : 'Select date'}
                        style={{
                          ...getInputStyle(hasError('date'), isFieldValid('date')),
                          paddingRight: '44px',
                          cursor: 'pointer',
                        }}
                      />
                      <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                        <CalendarIcon />
                      </span>
                    </div>
                  }
                />
              </div>
              <ErrorMsg msg={hasError('date') ? errors.date : null} />
            </Field>
          </div>

          <div ref={refs.time}>
            <Field label={lang === 'es' ? 'Hora Preferida' : 'Preferred Time'}>
              <select
                value={details.time || ''}
                onChange={e => { set('time', e.target.value); touch('time'); }}
                onBlur={() => touch('time')}
                style={{ ...getInputStyle(hasError('time'), isFieldValid('time')), cursor: 'pointer' }}
              >
                <option value="">{lang === 'es' ? 'Seleccionar hora' : 'Select time'}</option>
                {(availableSlots !== null ? availableSlots : [
                  '8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM',
                  '1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM',
                ]).map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
              <ErrorMsg msg={hasError('time') ? errors.time : null} />
            </Field>
          </div>
        </div>

        {/* ── Notes (optional) ── */}
        <Field label={lang === 'es' ? 'Notas Adicionales (opcional)' : 'Additional Notes (optional)'}>
          <textarea
            rows={3}
            placeholder={lang === 'es' ? 'Instrucciones especiales, código de acceso, etc.' : 'Special instructions, gate code, parking notes, etc.'}
            value={details.notes || ''}
            onChange={e => set('notes', e.target.value)}
            onFocus={e => e.target.style.borderColor = '#FFD700'}
            onBlur={e => e.target.style.borderColor = '#2a2a2a'}
            style={{ ...getInputStyle(false, false), resize: 'vertical', minHeight: '80px' }}
          />
        </Field>

        {/* ── Payment — informational badge only ── */}
        <Field label={lang === 'es' ? 'Método de Pago' : 'Payment Method'}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px',
            background: '#141414',
            border: '1px solid #2a2a2a',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
          }}>
            <span style={{ fontSize: '1.4rem', lineHeight: 1, marginTop: '2px' }}>💛</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#ffffff', marginBottom: '4px' }}>
                {lang === 'es' ? 'Pago al Llegar' : 'Payment on Arrival'}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#9a9a9a', lineHeight: 1.5 }}>
                {lang === 'es'
                  ? 'Pagarás cuando completemos tu servicio'
                  : "You'll pay when we complete your service"}
              </div>
            </div>
          </div>
        </Field>

      </div>
    </div>
  );
}
