import { useState, useEffect, useCallback, useMemo } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import { useAdminAuth } from '../AdminAuthContext';
import { useLang } from '../LangContext';
import { API_URL as API } from '../config';
import { VEHICLES, SERVICES, ADDONS, TIME_SLOTS } from '../data/bookingData';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// ── Constants ─────────────────────────────────────────────────────────────────
const STATUS_STYLE = {
  pending:   { bg: 'rgba(255,215,0,0.1)',  color: '#FFD700', border: 'rgba(255,215,0,0.3)',  label: 'Pending',   labelEs: 'Pendiente'  },
  confirmed: { bg: 'rgba(34,197,94,0.1)',  color: '#22c55e', border: 'rgba(34,197,94,0.3)',  label: 'Confirmed', labelEs: 'Confirmado' },
  cancelled: { bg: 'rgba(239,68,68,0.1)',  color: '#ef4444', border: 'rgba(239,68,68,0.3)',  label: 'Cancelled', labelEs: 'Cancelado'  },
};
const ZONES_INFO = {
  1: { nameEn: 'Zone 1 — Free',       fee: 0  },
  2: { nameEn: 'Zone 2 — +$10',       fee: 10 },
  3: { nameEn: 'Zone 3 — +$20',       fee: 20 },
  4: { nameEn: 'Zone 4 — +$35',       fee: 35 },
};
const DAYS_EN = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const DAYS_ES = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
const HOURS = Array.from({length: 11}, (_, i) => i + 8); // 8-18

// ── Helpers ───────────────────────────────────────────────────────────────────
function pad(n) { return String(n).padStart(2, '0'); }
function hourToSlot(h) {
  if (h === 12) return '12:00 PM';
  if (h > 12)  return `${h - 12}:00 PM`;
  return `${h}:00 AM`;
}
function dateStr(d) { return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; }
function parseHour(hora) {
  if (!hora) return 8;
  const [time, ampm] = hora.split(' ');
  let [h] = time.split(':').map(Number);
  if (ampm === 'PM' && h !== 12) h += 12;
  if (ampm === 'AM' && h === 12) h = 0;
  return h;
}
function monthStart(y, m) { return new Date(y, m, 1); }
function monthEnd(y, m)   { return new Date(y, m+1, 0); }
function weekStart(d) { const c = new Date(d); c.setDate(c.getDate() - c.getDay()); return c; }

// ── Small reusable components ─────────────────────────────────────────────────
function StatusBadge({ status, lang }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.pending;
  return (
    <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, padding: '2px 9px', borderRadius: '50px', fontSize: '0.68rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
      {lang === 'es' ? s.labelEs : s.label}
    </span>
  );
}

function Modal({ onClose, children, width = 520 }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
      onClick={onClose}>
      <div style={{ background: '#0f1219', border: '1px solid #2a2a2a', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: `${width}px`, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 32px 80px rgba(0,0,0,0.7)' }}
        onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function ConfirmModal({ title, message, confirmLabel, confirmColor = '#FFD700', confirmTextColor = '#000', cancelLabel, onConfirm, onCancel }) {
  return (
    <Modal onClose={onCancel} width={380}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{title.startsWith('⚠') ? '⚠️' : '🗑️'}</div>
        <h3 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.75rem' }}>{title.replace(/^[⚠🗑️]\s*/, '')}</h3>
        <p style={{ color: '#9a9a9a', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>{message}</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onCancel} style={{ flex: 1, padding: '11px', borderRadius: '50px', background: 'transparent', border: '1px solid #1a2035', color: '#9a9a9a', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem' }}>
            {cancelLabel}
          </button>
          <button onClick={onConfirm} style={{ flex: 1, padding: '11px', borderRadius: '50px', background: confirmColor, color: confirmTextColor, border: 'none', fontWeight: 800, cursor: 'pointer', fontSize: '0.88rem' }}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ── Detail Modal ──────────────────────────────────────────────────────────────
function DetailModal({ booking, onClose, onChangeStatus, lang }) {
  const [confirm, setConfirm] = useState(null); // 'confirmed' | 'cancelled'
  if (!booking) return null;
  const t = (en, es) => lang === 'es' ? es : en;
  const s = STATUS_STYLE[booking.status] || STATUS_STYLE.pending;

  const Row = ({ label, value }) => value != null && value !== '' ? (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', padding: '8px 0', borderBottom: '1px solid #1a2035', fontSize: '0.84rem' }}>
      <span style={{ color: '#3a4a6b', flexShrink: 0 }}>{label}</span>
      <span style={{ color: '#fff', textAlign: 'right' }}>{value}</span>
    </div>
  ) : null;

  const Sec = ({ children }) => <div style={{ fontSize: '0.65rem', color: '#FFD700', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '1.25rem', marginBottom: '4px' }}>{children}</div>;

  if (confirm) {
    const isConfirm = confirm === 'confirmed';
    return (
      <ConfirmModal
        title={isConfirm ? '⚠️ Confirmar Reserva' : '🗑️ Cancelar Reserva'}
        message={isConfirm
          ? `¿Confirmas la cita de ${booking.nombre} para el ${booking.fecha?.slice(0,10)} a las ${booking.hora}?`
          : `¿Estás seguro que deseas cancelar la cita de ${booking.nombre}? Esta acción no se puede deshacer.`}
        confirmLabel={isConfirm ? t('Yes, Confirm','Sí, Confirmar') : t('Yes, Cancel','Sí, Cancelar')}
        confirmColor={isConfirm ? '#FFD700' : '#ef4444'}
        confirmTextColor={isConfirm ? '#000' : '#fff'}
        cancelLabel={isConfirm ? t('Back','Volver') : t('Back','Volver')}
        onConfirm={() => { onChangeStatus(booking.id, confirm); setConfirm(null); onClose(); }}
        onCancel={() => setConfirm(null)}
      />
    );
  }

  return (
    <Modal onClose={onClose}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>#{booking.id}</span>
          <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, padding: '3px 10px', borderRadius: '50px', fontSize: '0.72rem', fontWeight: 700 }}>
            {lang === 'es' ? (STATUS_STYLE[booking.status]?.labelEs) : (STATUS_STYLE[booking.status]?.label)}
          </span>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#3a4a6b', cursor: 'pointer', fontSize: '1.3rem' }}>✕</button>
      </div>

      <Sec>{t('Client','Cliente')}</Sec>
      <Row label={t('Name','Nombre')} value={booking.nombre} />
      <Row label="Email" value={booking.email} />
      <Row label={t('Phone','Teléfono')} value={booking.telefono} />

      <Sec>{t('Service','Servicio')}</Sec>
      <Row label={t('Vehicle','Vehículo')} value={booking.vehiculo} />
      <Row label={t('Package','Paquete')} value={booking.paquete} />
      {booking.addons?.length > 0 && <Row label="Add-Ons" value={booking.addons.join(', ')} />}

      {/* Location section — disabled while location step is removed
      <Sec>{t('Location','Ubicación')}</Sec>
      <Row label={t('Address','Dirección')} value={booking.direccion} />
      <Row label={t('Zone','Zona')} value={booking.zona ? `Zone ${booking.zona}` : null} />
      <Row label={t('Travel Fee','Cargo Viaje')} value={booking.travel_fee === 0 ? 'FREE' : `+$${booking.travel_fee}`} />
      */}

      <Sec>{t('Schedule','Horario')}</Sec>
      <Row label={t('Date','Fecha')} value={booking.fecha?.slice(0,10)} />
      <Row label={t('Time','Hora')} value={booking.hora} />

      <Sec>{t('Financials','Totales')}</Sec>
      <Row label={t('Payment','Pago')} value={t('Pay on Arrival','Pagar al Llegar')} />
      <Row label="Total" value={`$${booking.total}`} />

      {booking.notas && (<><Sec>{t('Notes','Notas')}</Sec><p style={{ fontSize: '0.84rem', color: '#9a9a9a', margin: '6px 0 0', lineHeight: 1.5 }}>{booking.notas}</p></>)}

      {booking.status !== 'cancelled' && (
        <div style={{ display: 'flex', gap: '10px', marginTop: '2rem' }}>
          {booking.status === 'pending' && (
            <button onClick={() => setConfirm('confirmed')} style={{ flex: 1, padding: '13px', borderRadius: '50px', background: 'linear-gradient(135deg,#FFD700,#FFC200)', color: '#000', border: 'none', fontWeight: 800, cursor: 'pointer', fontSize: '0.9rem' }}>
              ✓ {t('Confirm','Confirmar')}
            </button>
          )}
          <button onClick={() => setConfirm('cancelled')} style={{ flex: 1, padding: '13px', borderRadius: '50px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>
            ✗ {t('Cancel booking','Cancelar cita')}
          </button>
        </div>
      )}
    </Modal>
  );
}

// ── New Booking Modal ─────────────────────────────────────────────────────────
function NewBookingModal({ onClose, onSaved, token, lang, initialDate = '', initialTime = '' }) {
  const t = (en, es) => lang === 'es' ? es : en;
  const [form, setForm] = useState({
    nombre: '', email: '', telefono: '', direccion: '',
    vehiculo: 'small_sedan', paquete: '', addons: [],
    // zona: '', // disabled — location step removed
    fecha: initialDate, hora: initialTime, notas: '',
  });
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const vehicleServices = SERVICES[form.vehiculo] || [];
  const selectedService = vehicleServices.find(s => s.id === form.paquete);
  const selectedAddons  = ADDONS.filter(a => form.addons.includes(a.id));
  // const travelFee = form.zona ? (ZONES_INFO[Number(form.zona)]?.fee || 0) : 0; // disabled
  const travelFee = 0;
  const servicePrice = selectedService?.priceEn || 0;
  const addonsTotal  = selectedAddons.reduce((s, a) => s + a.price, 0);
  const total = servicePrice + addonsTotal;

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggleAddon = (id) => {
    setForm(f => ({
      ...f,
      addons: f.addons.includes(id) ? f.addons.filter(x => x !== id) : [...f.addons, id],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/bookings/manual`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, zona: null, travel_fee: 0, total }),
      });
      if (res.ok) { onSaved(); onClose(); }
      else { const d = await res.json(); alert(d.error || 'Error'); }
    } catch { alert('Connection error'); }
    finally { setSaving(false); }
  };

  const [errors, setErrors] = useState({});

  const digitsOnly = (v) => v.replace(/\D/g, '');
  const formatPhone = (digits) => {
    const d = digits.slice(0, 10);
    if (d.length <= 3) return d;
    if (d.length <= 6) return `(${d.slice(0,3)}) ${d.slice(3)}`;
    return `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`;
  };
  const handlePhoneChange = (e) => {
    const formatted = formatPhone(digitsOnly(e.target.value));
    set('telefono', formatted);
    setErrors(v => ({ ...v, telefono: false }));
  };

  const validate = () => {
    const errs = {};
    // 'zona' removed from required fields — location step disabled
    ['nombre', 'email', 'telefono', 'paquete', 'fecha', 'hora'].forEach(k => {
      if (!form[k]) errs[k] = t('Required', 'Requerido');
    });
    if (!errs.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = t('Use format: email@example.com', 'Usa el formato: email@ejemplo.com');
    }
    if (!errs.telefono && digitsOnly(form.telefono).length !== 10) {
      errs.telefono = t('Enter 10-digit phone number', 'Ingresa 10 dígitos');
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const inpBase = { padding: '10px 13px', borderRadius: '10px', background: '#080b11', color: '#fff', fontSize: '0.84rem', outline: 'none', width: '100%', boxSizing: 'border-box', fontFamily: 'Inter, sans-serif' };
  const inp = (field) => ({ ...inpBase, border: `1px solid ${errors[field] ? '#ef4444' : '#1a2035'}`, transition: 'border-color 0.15s' });
  const lbl = { display: 'block', fontSize: '0.68rem', color: '#3a4a6b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' };
  const ErrMsg = ({ field }) => errors[field] ? <div style={{ color: '#ef4444', fontSize: '0.68rem', marginTop: '4px', fontWeight: 600 }}>{errors[field]}</div> : null;
  const Sec = ({ children }) => <div style={{ fontSize: '0.65rem', color: '#FFD700', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '1.25rem 0 0.75rem' }}>{children}</div>;

  if (confirm) {
    return (
      <ConfirmModal
        title="⚠️ Crear Reserva"
        message={`¿Confirmas crear la cita para ${form.nombre || 'el cliente'} el ${form.fecha} a las ${form.hora}? Total: $${total}`}
        confirmLabel={t('Yes, Create','Sí, Crear')}
        confirmColor="#FFD700" confirmTextColor="#000"
        cancelLabel={t('Back','Volver')}
        onConfirm={handleSave}
        onCancel={() => setConfirm(false)}
      />
    );
  }

  return (
    <Modal onClose={onClose} width={580}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontWeight: 800, fontSize: '1.2rem', margin: 0 }}>+ {t('New Booking','Nueva Cita')}</h2>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#3a4a6b', cursor: 'pointer', fontSize: '1.3rem' }}>✕</button>
      </div>

      <Sec>{t('Client','Cliente')}</Sec>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div>
          <label style={lbl}>{t('Full Name','Nombre Completo')} *</label>
          <input style={inp('nombre')} value={form.nombre} onChange={e => { set('nombre', e.target.value); setErrors(v=>({...v,nombre:false})); }} onFocus={e=>e.target.style.borderColor='#FFD700'} onBlur={e=>e.target.style.borderColor=errors.nombre?'#ef4444':'#1a2035'} />
          <ErrMsg field="nombre" />
        </div>
        <div>
          <label style={lbl}>Email *</label>
          <input type="email" style={inp('email')} value={form.email}
            onChange={e => { set('email', e.target.value); setErrors(v=>({...v,email:false})); }}
            onFocus={e=>e.target.style.borderColor='#FFD700'}
            onBlur={e => {
              const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
              e.target.style.borderColor = (!form.email || !valid) ? '#ef4444' : '#1a2035';
              if (form.email && !valid) setErrors(v=>({...v,email:t('Use format: email@example.com','Usa el formato: email@ejemplo.com')}));
            }}
            placeholder="ejemplo@correo.com" />
          <ErrMsg field="email" />
        </div>
        <div>
          <label style={lbl}>{t('Phone','Teléfono')} *</label>
          <input type="tel" inputMode="numeric" style={inp('telefono')} value={form.telefono}
            onChange={handlePhoneChange}
            onFocus={e=>e.target.style.borderColor='#FFD700'}
            onBlur={e => {
              const len = digitsOnly(form.telefono).length;
              e.target.style.borderColor = (len > 0 && len !== 10) ? '#ef4444' : errors.telefono ? '#ef4444' : '#1a2035';
              if (form.telefono && len !== 10) setErrors(v=>({...v,telefono:t('Enter 10-digit phone number','Ingresa 10 dígitos')}));
            }}
            placeholder="(714) 555-0000" maxLength={14} />
          <ErrMsg field="telefono" />
        </div>
        <div>
          <label style={lbl}>{t('Address','Dirección')} *</label>
          <input style={inp('direccion')} value={form.direccion} onChange={e => { set('direccion', e.target.value); setErrors(v=>({...v,direccion:false})); }} onFocus={e=>e.target.style.borderColor='#FFD700'} onBlur={e=>e.target.style.borderColor=errors.direccion?'#ef4444':'#1a2035'} />
          <ErrMsg field="direccion" />
        </div>
      </div>

      <Sec>{t('Service','Servicio')}</Sec>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div>
          <label style={lbl}>{t('Vehicle','Vehículo')} *</label>
          <select style={{ ...inp('vehiculo'), cursor: 'pointer' }} value={form.vehiculo} onChange={e => { set('vehiculo', e.target.value); set('paquete', ''); }} onFocus={e=>e.target.style.borderColor='#FFD700'} onBlur={e=>e.target.style.borderColor='#1a2035'}>
            {VEHICLES.map(v => <option key={v.id} value={v.id}>{v.labelEn}</option>)}
          </select>
        </div>
        <div>
          <label style={lbl}>{t('Package','Paquete')} *</label>
          <select style={{ ...inp('paquete'), cursor: 'pointer' }} value={form.paquete} onChange={e => { set('paquete', e.target.value); setErrors(v=>({...v,paquete:false})); }} onFocus={e=>e.target.style.borderColor='#FFD700'} onBlur={e=>e.target.style.borderColor=errors.paquete?'#ef4444':'#1a2035'}>
            <option value="">{t('Select...','Seleccionar...')}</option>
            {vehicleServices.map(s => <option key={s.id} value={s.id}>{s.nameEn} — ${s.priceEn}</option>)}
          </select>
          <ErrMsg field="paquete" />
        </div>
      </div>

      <div style={{ marginTop: '10px' }}>
        <label style={lbl}>Add-Ons</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {ADDONS.map(a => {
            const sel = form.addons.includes(a.id);
            return (
              <button key={a.id} onClick={() => toggleAddon(a.id)} style={{ padding: '5px 12px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', background: sel ? 'rgba(255,215,0,0.12)' : '#080b11', border: `1px solid ${sel ? '#FFD700' : '#1a2035'}`, color: sel ? '#FFD700' : '#9a9a9a' }}>
                {a.nameEn} +${a.price}
              </button>
            );
          })}
        </div>
      </div>

      <Sec>{t('Schedule','Horario')}</Sec>
      {/* Zone field disabled — location step removed
        <div>
          <label style={lbl}>{t('Zone','Zona')} *</label>
          <select style={{ ...inp('zona'), cursor: 'pointer' }} value={form.zona} onChange={e => { set('zona', e.target.value); setErrors(v=>({...v,zona:false})); }} onFocus={e=>e.target.style.borderColor='#FFD700'} onBlur={e=>e.target.style.borderColor=errors.zona?'#ef4444':'#1a2035'}>
            <option value="">{t('Select...','Seleccionar...')}</option>
            {Object.entries(ZONES_INFO).map(([k, z]) => <option key={k} value={k}>{z.nameEn}</option>)}
          </select>
          <ErrMsg field="zona" />
        </div>
      */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div>
          <label style={lbl}>{t('Date','Fecha')} *</label>
          <DatePicker
            selected={form.fecha ? new Date(form.fecha + 'T12:00:00') : null}
            onChange={date => {
              if (!date) { set('fecha', ''); return; }
              const yyyy = date.getFullYear();
              const mm = String(date.getMonth() + 1).padStart(2, '0');
              const dd = String(date.getDate()).padStart(2, '0');
              set('fecha', `${yyyy}-${mm}-${dd}`);
              setErrors(v=>({...v,fecha:false}));
            }}
            dateFormat="MM/dd/yyyy"
            placeholderText={t('Select date', 'Seleccionar fecha')}
            calendarClassName="dark-calendar"
            className={`dark-datepicker-input${errors.fecha ? ' dark-datepicker-error' : ''}`}
            minDate={new Date()}
            wrapperClassName="datepicker-full-width"
          />
          <ErrMsg field="fecha" />
        </div>
        <div>
          <label style={lbl}>{t('Time','Hora')} *</label>
          <select style={{ ...inp('hora'), cursor: 'pointer' }} value={form.hora} onChange={e => { set('hora', e.target.value); setErrors(v=>({...v,hora:false})); }} onFocus={e=>e.target.style.borderColor='#FFD700'} onBlur={e=>e.target.style.borderColor=errors.hora?'#ef4444':'#1a2035'}>
            <option value="">{t('Select...','Seleccionar...')}</option>
            {TIME_SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <ErrMsg field="hora" />
        </div>
      </div>

      <div style={{ marginTop: '10px' }}>
        <label style={lbl}>{t('Notes','Notas')}</label>
        <textarea style={{ ...inp('notas'), height: '70px', resize: 'vertical' }} value={form.notas} onChange={e => set('notas', e.target.value)} onFocus={e=>e.target.style.borderColor='#FFD700'} onBlur={e=>e.target.style.borderColor='#1a2035'} />
      </div>

      {/* Total */}
      <div style={{ marginTop: '1.25rem', padding: '1rem 1.25rem', background: 'rgba(255,215,0,0.06)', border: '1px solid rgba(255,215,0,0.15)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '0.8rem', color: '#9a9a9a' }}>
          <div>Service: ${servicePrice} · Add-ons: ${addonsTotal}</div>
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFD700' }}>${total}</div>
      </div>

      <button
        onClick={() => { if (!validate()) return; setConfirm(true); }}
        disabled={saving}
        style={{ width: '100%', marginTop: '1.25rem', padding: '14px', borderRadius: '50px', background: saving ? '#1a2035' : 'linear-gradient(135deg,#FFD700,#FFC200)', color: saving ? '#555' : '#000', border: 'none', fontWeight: 800, fontSize: '0.95rem', cursor: saving ? 'not-allowed' : 'pointer', boxShadow: '0 4px 20px rgba(255,215,0,0.2)' }}
      >
        {saving ? t('Saving...','Guardando...') : t('Create Booking','Crear Reserva')}
      </button>
    </Modal>
  );
}

// ── VIEWS ─────────────────────────────────────────────────────────────────────

function MonthView({ bookings, year, month, lang, onDayClick, onBookingClick }) {
  const t = (en, es) => lang === 'es' ? es : en;
  const days = lang === 'es' ? DAYS_ES : DAYS_EN;
  const today = dateStr(new Date());

  const start = monthStart(year, month);
  const end   = monthEnd(year, month);
  const firstDow = start.getDay();
  const totalCells = Math.ceil((firstDow + end.getDate()) / 7) * 7;

  const byDay = useMemo(() => {
    const map = {};
    bookings.forEach(b => {
      const d = b.fecha?.slice(0, 10);
      if (!map[d]) map[d] = [];
      map[d].push(b);
    });
    return map;
  }, [bookings]);

  const cells = [];
  for (let i = 0; i < totalCells; i++) {
    const date = new Date(year, month, i - firstDow + 1);
    const ds = dateStr(date);
    const inMonth = date.getMonth() === month;
    const isToday = ds === today;
    const dayBookings = byDay[ds] || [];

    cells.push(
      <div key={i}
        onClick={() => inMonth && onDayClick(ds)}
        style={{
          minHeight: '110px', padding: '8px', borderRadius: '12px',
          background: isToday ? 'rgba(255,215,0,0.05)' : 'transparent',
          border: isToday ? '1px solid rgba(255,215,0,0.3)' : '1px solid #1a2035',
          opacity: inMonth ? 1 : 0.25,
          cursor: inMonth ? 'pointer' : 'default',
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => { if (inMonth) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = isToday ? 'rgba(255,215,0,0.05)' : 'transparent'; }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: isToday ? 800 : 500, color: isToday ? '#FFD700' : '#fff' }}>
            {date.getDate()}
          </span>
          {dayBookings.length > 0 && (
            <span style={{ background: 'rgba(255,215,0,0.15)', color: '#FFD700', fontSize: '0.6rem', fontWeight: 800, padding: '1px 6px', borderRadius: '50px', border: '1px solid rgba(255,215,0,0.25)' }}>
              {dayBookings.length}
            </span>
          )}
        </div>
        {dayBookings.slice(0, 2).map(b => (
          <div key={b.id}
            onClick={e => { e.stopPropagation(); onBookingClick(b); }}
            style={{ fontSize: '0.65rem', background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.15)', borderRadius: '5px', padding: '2px 6px', marginBottom: '3px', color: '#FFD700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'pointer' }}
          >
            {b.hora} · {b.nombre?.split(' ')[0]}
          </div>
        ))}
        {dayBookings.length > 2 && (
          <div style={{ fontSize: '0.62rem', color: '#3a4a6b', paddingLeft: '2px' }}>+{dayBookings.length - 2} {t('more','más')}</div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '4px', marginBottom: '4px' }}>
        {days.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: '0.7rem', fontWeight: 700, color: '#3a4a6b', padding: '8px 0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{d}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '4px' }}>
        {cells}
      </div>
    </div>
  );
}

function WeekView({ bookings, weekDate, lang, onBookingClick, onSlotClick }) {
  const days = lang === 'es' ? DAYS_ES : DAYS_EN;
  const ws = weekStart(weekDate);
  const weekDays = Array.from({length: 7}, (_, i) => {
    const d = new Date(ws); d.setDate(ws.getDate() + i); return d;
  });
  const today = dateStr(new Date());

  const byDay = useMemo(() => {
    const map = {};
    bookings.forEach(b => {
      const d = b.fecha?.slice(0,10);
      if (!map[d]) map[d] = [];
      map[d].push(b);
    });
    return map;
  }, [bookings]);

  const hourH = 64;

  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ minWidth: '700px' }}>
        {/* Day headers */}
        <div style={{ display: 'grid', gridTemplateColumns: '48px repeat(7,1fr)', gap: '4px', marginBottom: '4px' }}>
          <div />
          {weekDays.map((d, i) => {
            const ds = dateStr(d);
            const isToday = ds === today;
            const count = (byDay[ds] || []).length;
            return (
              <div key={i} style={{ textAlign: 'center', padding: '8px 4px', borderRadius: '10px', background: isToday ? 'rgba(255,215,0,0.08)' : 'transparent', border: isToday ? '1px solid rgba(255,215,0,0.2)' : '1px solid transparent' }}>
                <div style={{ fontSize: '0.68rem', color: '#3a4a6b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{days[d.getDay()]}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: isToday ? '#FFD700' : '#fff', lineHeight: 1.2 }}>{d.getDate()}</div>
                {count > 0 && <div style={{ fontSize: '0.6rem', color: '#FFD700', fontWeight: 700 }}>{count} cit.</div>}
              </div>
            );
          })}
        </div>

        {/* Hour rows */}
        <div style={{ position: 'relative' }}>
          {HOURS.map(h => (
            <div key={h} style={{ display: 'grid', gridTemplateColumns: '48px repeat(7,1fr)', gap: '4px', marginBottom: '2px' }}>
              <div style={{ fontSize: '0.65rem', color: '#3a4a6b', textAlign: 'right', paddingRight: '8px', paddingTop: '4px', fontWeight: 600 }}>
                {h > 12 ? `${h-12}pm` : h === 12 ? '12pm' : `${h}am`}
              </div>
              {weekDays.map((d, di) => {
                const ds = dateStr(d);
                const dayBks = (byDay[ds] || []).filter(b => parseHour(b.hora) === h);
                const isEmpty = dayBks.length === 0;
                return (
                  <div key={di}
                    onClick={() => isEmpty && onSlotClick(ds, h)}
                    style={{ minHeight: `${hourH}px`, borderTop: '1px solid #1a2035', padding: '2px', position: 'relative', cursor: isEmpty ? 'pointer' : 'default' }}
                    onMouseEnter={e => { if (isEmpty) { e.currentTarget.style.background = 'rgba(255,215,0,0.05)'; e.currentTarget.style.border = '1px dashed rgba(255,215,0,0.3)'; e.currentTarget.querySelector?.('.slot-hint') && (e.currentTarget.querySelector('.slot-hint').style.opacity = '1'); } }}
                    onMouseLeave={e => { if (isEmpty) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.border = 'none'; e.currentTarget.querySelector?.('.slot-hint') && (e.currentTarget.querySelector('.slot-hint').style.opacity = '0'); } }}
                  >
                    {isEmpty && (
                      <div className="slot-hint" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: 'rgba(255,215,0,0.5)', fontWeight: 700, opacity: 0, transition: 'opacity 0.15s', pointerEvents: 'none' }}>
                        + {lang === 'es' ? 'Nueva cita' : 'New booking'}
                      </div>
                    )}
                    {dayBks.map(b => (
                      <div key={b.id} onClick={e => { e.stopPropagation(); onBookingClick(b); }}
                        style={{ background: 'rgba(255,215,0,0.07)', borderLeft: '3px solid #FFD700', borderRadius: '4px', padding: '4px 6px', marginBottom: '2px', cursor: 'pointer', transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,215,0,0.14)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,215,0,0.07)'}
                      >
                        <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#FFD700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.nombre?.split(' ')[0]}</div>
                        <div style={{ fontSize: '0.6rem', color: '#9a9a9a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.paquete}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DayView({ bookings, dayDate, lang, onBookingClick, onChangeStatus, onSlotClick }) {
  const t = (en, es) => lang === 'es' ? es : en;
  const ds = dateStr(dayDate);
  const dayBks = bookings.filter(b => b.fecha?.slice(0,10) === ds).sort((a,b) => parseHour(a.hora) - parseHour(b.hora));

  return (
    <div>
      {HOURS.map(h => {
        const hBks = dayBks.filter(b => parseHour(b.hora) === h);
        const isEmpty = hBks.length === 0;
        return (
          <div key={h} style={{ display: 'flex', gap: '12px', marginBottom: '4px' }}>
            <div style={{ width: '48px', flexShrink: 0, paddingTop: '12px', fontSize: '0.68rem', color: '#3a4a6b', textAlign: 'right', fontWeight: 600 }}>
              {h > 12 ? `${h-12}pm` : h === 12 ? '12pm' : `${h}am`}
            </div>
            <div
              onClick={() => isEmpty && onSlotClick(ds, h)}
              style={{ flex: 1, minHeight: '64px', borderTop: '1px solid #1a2035', padding: '4px 0', display: 'flex', flexDirection: 'column', gap: '6px', position: 'relative', cursor: isEmpty ? 'pointer' : 'default', borderRadius: '6px', transition: 'background 0.15s' }}
              onMouseEnter={e => { if (isEmpty) { e.currentTarget.style.background = 'rgba(255,215,0,0.05)'; e.currentTarget.style.outline = '1px dashed rgba(255,215,0,0.3)'; e.currentTarget.querySelector('.slot-hint') && (e.currentTarget.querySelector('.slot-hint').style.opacity = '1'); } }}
              onMouseLeave={e => { if (isEmpty) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.outline = 'none'; e.currentTarget.querySelector('.slot-hint') && (e.currentTarget.querySelector('.slot-hint').style.opacity = '0'); } }}
            >
              {isEmpty && (
                <div className="slot-hint" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', color: 'rgba(255,215,0,0.5)', fontWeight: 700, opacity: 0, transition: 'opacity 0.15s', pointerEvents: 'none' }}>
                  + {t('New booking', 'Nueva cita')}
                </div>
              )}
              {hBks.map(b => (
                <div key={b.id}
                  onClick={() => onBookingClick(b)}
                  style={{ background: '#0f1219', border: '1px solid #1a2035', borderLeft: '3px solid #FFD700', borderRadius: '10px', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#131926'}
                  onMouseLeave={e => e.currentTarget.style.background = '#0f1219'}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{b.nombre}</span>
                      <StatusBadge status={b.status} lang={lang} />
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#9a9a9a' }}>{b.paquete} · {b.vehiculo}</div>
                    <div style={{ fontSize: '0.75rem', color: '#3a4a6b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.direccion}</div>
                  </div>
                  <div style={{ flexShrink: 0, textAlign: 'right' }}>
                    <div style={{ color: '#22c55e', fontWeight: 800, fontSize: '0.95rem' }}>${b.total}</div>
                    <div style={{ display: 'flex', gap: '5px', marginTop: '6px' }}>
                      {b.status === 'pending' && (
                        <ActionBtn color="#22c55e" title="Confirm" onClick={e => { e.stopPropagation(); onChangeStatus(b.id, 'confirmed'); }}>✓</ActionBtn>
                      )}
                      {b.status !== 'cancelled' && (
                        <ActionBtn color="#ef4444" title="Cancel" onClick={e => { e.stopPropagation(); onChangeStatus(b.id, 'cancelled'); }}>✗</ActionBtn>
                      )}
                      <ActionBtn color="#9a9a9a" title="View" onClick={e => { e.stopPropagation(); onBookingClick(b); }}>👁</ActionBtn>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      {dayBks.length === 0 && (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#3a4a6b', fontSize: '0.88rem' }}>
          {t('No bookings this day','Sin citas este día')}
        </div>
      )}
    </div>
  );
}

function ActionBtn({ children, color, title, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} title={title}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ width: '28px', height: '28px', borderRadius: '7px', background: hov ? 'rgba(255,255,255,0.06)' : 'transparent', border: `1px solid ${hov ? color : '#1a2035'}`, color, cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
    >
      {children}
    </button>
  );
}

// ── Mobile Booking List (card view) ──────────────────────────────────────────
function MobileBookingList({ bookings, current, lang, onBookingClick, onChangeStatus, t }) {
  const ds = dateStr(current);
  const dayBks = bookings
    .filter(b => b.fecha?.slice(0,10) === ds)
    .sort((a, b) => parseHour(a.hora) - parseHour(b.hora));

  const allSorted = [...bookings].sort((a, b) => {
    if (a.fecha < b.fecha) return -1;
    if (a.fecha > b.fecha) return 1;
    return parseHour(a.hora) - parseHour(b.hora);
  });

  // Show current day's bookings, or fall back to all upcoming
  const list = dayBks.length > 0 ? dayBks : allSorted.filter(b => b.fecha?.slice(0,10) >= ds).slice(0, 20);

  if (list.length === 0) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#3a4a6b', fontSize: '0.88rem' }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📅</div>
        {t('No bookings for this day', 'Sin citas para este día')}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {list.map(b => {
        const s = STATUS_STYLE[b.status] || STATUS_STYLE.pending;
        return (
          <div
            key={b.id}
            onClick={() => onBookingClick(b)}
            style={{
              background: '#0f1219', border: `1px solid ${s.border}`,
              borderRadius: '14px', padding: '14px 16px',
              cursor: 'pointer', transition: 'background 0.15s',
            }}
          >
            {/* Top: name + status badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '8px' }}>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#fff', flex: 1, minWidth: 0 }}>{b.nombre}</div>
              <StatusBadge status={b.status} lang={lang} />
            </div>
            {/* Service + vehicle */}
            <div style={{ fontSize: '0.82rem', color: '#9a9a9a', marginBottom: '6px' }}>
              {b.paquete} · {b.vehiculo}
            </div>
            {/* Date + time + total */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ fontSize: '0.82rem', color: '#FFD700', fontWeight: 700 }}>
                {b.fecha?.slice(0,10)} · {b.hora}
              </div>
              <div style={{ fontWeight: 800, color: '#22c55e', fontSize: '0.95rem' }}>${b.total}</div>
            </div>
            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={e => { e.stopPropagation(); onBookingClick(b); }}
                style={{ flex: 1, padding: '10px', borderRadius: '10px', background: 'transparent', border: '1px solid #1a2035', color: '#9a9a9a', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', minHeight: '44px' }}
              >
                👁 {t('View', 'Ver')}
              </button>
              {b.status === 'pending' && (
                <button
                  onClick={e => { e.stopPropagation(); onChangeStatus(b.id, 'confirmed'); }}
                  style={{ flex: 1, padding: '10px', borderRadius: '10px', background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)', color: '#FFD700', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', minHeight: '44px' }}
                >
                  ✓ {t('Confirm', 'Confirmar')}
                </button>
              )}
              {b.status !== 'cancelled' && (
                <button
                  onClick={e => { e.stopPropagation(); onChangeStatus(b.id, 'cancelled'); }}
                  style={{ flex: 1, padding: '10px', borderRadius: '10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', minHeight: '44px' }}
                >
                  ✗ {t('Cancel', 'Cancelar')}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminBookings() {
  const { token } = useAdminAuth();
  const { lang } = useLang();
  const t = (en, es) => lang === 'es' ? es : en;
  const headers = { Authorization: `Bearer ${token}` };

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('month'); // month | week | day
  const [current, setCurrent] = useState(new Date());
  const [filters, setFilters] = useState({ search: '', status: 'all' });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newModalSlot, setNewModalSlot] = useState(null); // null | { date, time }
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const openNewModal = (date = '', time = '') => setNewModalSlot({ date, time });
  const handleSlotClick = (ds, h) => openNewModal(ds, hourToSlot(h));

  // Derived date values
  const year  = current.getFullYear();
  const month = current.getMonth();

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/admin/bookings?limit=500`, { headers });
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch { setBookings([]); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const changeStatus = useCallback(async (id, status) => {
    await fetch(`${API}/api/admin/bookings/${id}/status`, {
      method: 'PATCH', headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchBookings();
    setSelectedBooking(b => b?.id === id ? { ...b, status } : b);
  }, [token, fetchBookings]);

  // Filter bookings
  const filtered = useMemo(() => bookings.filter(b => {
    if (filters.status !== 'all' && b.status !== filters.status) return false;
    if (filters.search) {
      const s = filters.search.toLowerCase();
      if (!b.nombre?.toLowerCase().includes(s) && !b.email?.toLowerCase().includes(s)) return false;
    }
    return true;
  }), [bookings, filters]);

  // Count for current period
  const periodCount = useMemo(() => {
    if (view === 'month') {
      return filtered.filter(b => {
        const d = new Date(b.fecha);
        return d.getFullYear() === year && d.getMonth() === month;
      }).length;
    }
    if (view === 'week') {
      const ws = weekStart(current);
      const we = new Date(ws); we.setDate(ws.getDate() + 6);
      return filtered.filter(b => {
        const d = b.fecha?.slice(0,10);
        return d >= dateStr(ws) && d <= dateStr(we);
      }).length;
    }
    return filtered.filter(b => b.fecha?.slice(0,10) === dateStr(current)).length;
  }, [filtered, view, year, month, current]);

  // Navigation
  const navigate = (dir) => {
    setCurrent(prev => {
      const d = new Date(prev);
      if (view === 'month') d.setMonth(d.getMonth() + dir);
      else if (view === 'week') d.setDate(d.getDate() + dir * 7);
      else d.setDate(d.getDate() + dir);
      return d;
    });
  };

  const periodLabel = useMemo(() => {
    if (view === 'month') return current.toLocaleDateString(lang === 'es' ? 'es-US' : 'en-US', { month: 'long', year: 'numeric' });
    if (view === 'week') {
      const ws = weekStart(current);
      const we = new Date(ws); we.setDate(ws.getDate() + 6);
      return `${ws.toLocaleDateString('en-US',{month:'short',day:'numeric'})} – ${we.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}`;
    }
    return current.toLocaleDateString(lang === 'es' ? 'es-US' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  }, [view, current, lang]);

  const inputStyle = { padding: '9px 13px', borderRadius: '10px', background: '#080b11', border: '1px solid #1a2035', color: '#fff', fontSize: '0.84rem', outline: 'none', fontFamily: 'Inter, sans-serif', transition: 'border-color 0.15s' };

  return (
    <AdminLayout title={t('Bookings', 'Reservas')}>

      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.5rem' }}>
        {/* Search */}
        <input type="text" placeholder={t('Search name or email...','Buscar...')}
          value={filters.search} onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
          style={{ ...inputStyle, flex: '1', minWidth: '140px', fontSize: '16px' }}
          onFocus={e => e.target.style.borderColor = '#FFD700'} onBlur={e => e.target.style.borderColor = '#1a2035'}
        />
        {/* Status */}
        <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
          style={{ ...inputStyle, cursor: 'pointer', fontSize: '16px' }}>
          <option value="all">{t('All','Todos')}</option>
          <option value="pending">{t('Pending','Pendiente')}</option>
          <option value="confirmed">{t('Confirmed','Confirmado')}</option>
          <option value="cancelled">{t('Cancelled','Cancelado')}</option>
        </select>

        {!isMobile && <div style={{ flex: 1 }} />}

        {/* + New */}
        <button onClick={() => openNewModal()} style={{ padding: '12px 18px', borderRadius: '50px', background: 'linear-gradient(135deg,#FFD700,#FFC200)', color: '#000', border: 'none', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 4px 16px rgba(255,215,0,0.2)', minHeight: '44px', width: isMobile ? '100%' : 'auto' }}>
          + {t('New Booking','Nueva Cita')}
        </button>
      </div>

      {/* ── Calendar controls ───────────────────────────────────────────────── */}
      <div style={{ background: '#0f1219', border: '1px solid #1a2035', borderRadius: '16px', padding: '0.875rem 1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
        {/* View toggle — hidden on mobile (forced to day list) */}
        {!isMobile && (
          <div style={{ display: 'flex', background: '#080b11', border: '1px solid #1a2035', borderRadius: '10px', overflow: 'hidden' }}>
            {['month','week','day'].map(v => (
              <button key={v} onClick={() => setView(v)} style={{ padding: '7px 14px', border: 'none', background: view === v ? 'rgba(255,215,0,0.12)' : 'transparent', color: view === v ? '#FFD700' : '#3a4a6b', fontWeight: view === v ? 700 : 500, fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.15s', textTransform: 'capitalize', borderRight: v !== 'day' ? '1px solid #1a2035' : 'none' }}>
                {v === 'month' ? t('Month','Mes') : v === 'week' ? t('Week','Semana') : t('Day','Día')}
              </button>
            ))}
          </div>
        )}

        {/* Nav */}
        <button onClick={() => navigate(-1)} style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'transparent', border: '1px solid #1a2035', color: '#9a9a9a', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>←</button>

        <div style={{ flex: 1, textAlign: 'center', minWidth: 0 }}>
          <span style={{ fontWeight: 700, fontSize: isMobile ? '0.85rem' : '0.95rem', textTransform: 'capitalize' }}>{periodLabel}</span>
        </div>

        <button onClick={() => navigate(1)} style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'transparent', border: '1px solid #1a2035', color: '#9a9a9a', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>→</button>

        <button onClick={() => setCurrent(new Date())} style={{ padding: '7px 14px', borderRadius: '8px', background: 'transparent', border: '1px solid #1a2035', color: '#9a9a9a', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', minHeight: '40px' }}>
          {t('Today','Hoy')}
        </button>

        {/* Badge */}
        <div style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: '50px', padding: '4px 12px', fontSize: '0.75rem', fontWeight: 700, color: '#FFD700', whiteSpace: 'nowrap' }}>
          {loading ? '…' : periodCount} {t('bookings','citas')}
        </div>
      </div>

      {/* ── Calendar view ───────────────────────────────────────────────────── */}
      <div style={{ background: '#0a0d14', border: '1px solid #1a2035', borderRadius: '16px', padding: isMobile ? '0.75rem' : '1rem', minHeight: '400px' }}>
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#3a4a6b' }}>{t('Loading...','Cargando...')}</div>
        ) : isMobile ? (
          /* Mobile: card list view of current day's bookings */
          <MobileBookingList
            bookings={filtered} current={current} lang={lang}
            onBookingClick={setSelectedBooking} onChangeStatus={changeStatus}
            t={t}
          />
        ) : view === 'month' ? (
          <MonthView
            bookings={filtered} year={year} month={month} lang={lang}
            onDayClick={ds => { setCurrent(new Date(ds + 'T12:00:00')); setView('day'); }}
            onBookingClick={setSelectedBooking}
          />
        ) : view === 'week' ? (
          <WeekView bookings={filtered} weekDate={current} lang={lang} onBookingClick={setSelectedBooking} onSlotClick={handleSlotClick} />
        ) : (
          <DayView bookings={filtered} dayDate={current} lang={lang} onBookingClick={setSelectedBooking} onChangeStatus={changeStatus} onSlotClick={handleSlotClick} />
        )}
      </div>

      {/* ── Modals ──────────────────────────────────────────────────────────── */}
      {selectedBooking && (
        <DetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onChangeStatus={changeStatus}
          lang={lang}
        />
      )}

      {newModalSlot && (
        <NewBookingModal
          onClose={() => setNewModalSlot(null)}
          onSaved={fetchBookings}
          token={token}
          lang={lang}
          initialDate={newModalSlot.date}
          initialTime={newModalSlot.time}
        />
      )}
    </AdminLayout>
  );
}
