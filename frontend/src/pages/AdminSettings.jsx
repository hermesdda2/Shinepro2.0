import { useState, useEffect, useRef } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import { useAdminAuth } from '../AdminAuthContext';
import { useLang } from '../LangContext';
import { API_URL as API } from '../config';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const VEHICLE_KEYS   = ['sedan', 'pickup', 'midsize', 'fullsize'];
const VEHICLE_LABELS = { sedan: 'Sedan', pickup: 'Pickup/SUV', midsize: 'Mid-Size', fullsize: 'Full-Size' };
const PACKAGE_LABELS = {
  'super-wash':      { en: 'Super Wash',      es: 'Super Lavado'       },
  'wash-wax':        { en: 'Wash & Wax',      es: 'Lavado y Cera'      },
  'mini-detail':     { en: 'Mini Detail',     es: 'Mini Detallado'     },
  'complete-detail': { en: 'Complete Detail', es: 'Detallado Completo' },
};
const DAY_KEYS    = ['mon','tue','wed','thu','fri','sat','sun'];
const DAY_LABELS    = { mon:'Monday',  tue:'Tuesday',   wed:'Wednesday', thu:'Thursday', fri:'Friday', sat:'Saturday', sun:'Sunday'  };
const DAY_LABELS_ES = { mon:'Lunes',   tue:'Martes',    wed:'Miércoles', thu:'Jueves',   fri:'Viernes',sat:'Sábado',   sun:'Domingo' };

const ALL_HOUR_SLOTS = [
  '8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM',
  '1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM',
];
const WORK_HOUR_OPTIONS = [
  '6:00 AM','7:00 AM','8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM',
  '1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM',
  '7:00 PM','8:00 PM','9:00 PM','10:00 PM',
];

// ── Shared UI ─────────────────────────────────────────────────────────────────
function SectionCard({ title, children }) {
  const mobile = window.innerWidth <= 768;
  return (
    <div style={{ background: '#0f1219', border: '1px solid #1a2035', borderRadius: '20px', marginBottom: '1.5rem', overflow: 'hidden' }}>
      <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #1a2035', background: '#080b11' }}>
        <span style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.01em' }}>{title}</span>
      </div>
      <div style={{ padding: mobile ? '1rem' : '1.5rem' }}>{children}</div>
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <div onClick={() => onChange(!value)} style={{
      width: '40px', height: '22px', borderRadius: '50px', cursor: 'pointer',
      background: value ? '#FFD700' : '#1a2035',
      border: `1px solid ${value ? 'rgba(255,215,0,0.4)' : '#2a3555'}`,
      position: 'relative', flexShrink: 0, transition: 'all 0.2s',
    }}>
      <div style={{
        width: '16px', height: '16px', borderRadius: '50%',
        background: value ? '#000' : '#3a4a6b',
        position: 'absolute', top: '2px', left: value ? '20px' : '2px',
        transition: 'left 0.2s',
      }} />
    </div>
  );
}

function SaveBtn({ onClick, saving, saved, lang, fullWidth = false }) {
  return (
    <button onClick={onClick} disabled={saving} style={{
      padding: '13px 28px', borderRadius: '50px',
      background: saved ? 'rgba(34,197,94,0.12)' : saving ? '#0f1219' : 'linear-gradient(135deg, #FFD700, #FFC200)',
      color: saved ? '#22c55e' : saving ? '#3a4a6b' : '#000',
      border: saved ? '1px solid rgba(34,197,94,0.25)' : saving ? '1px solid #1a2035' : 'none',
      fontWeight: 800, fontSize: '0.85rem', cursor: saving ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s', minWidth: fullWidth ? 'unset' : '130px',
      width: fullWidth ? '100%' : 'auto',
      letterSpacing: '0.02em', minHeight: '44px',
      boxShadow: saved || saving ? 'none' : '0 4px 20px rgba(255,215,0,0.25)',
    }}>
      {saving ? (lang === 'es' ? 'Guardando...' : 'Saving...')
       : saved  ? (lang === 'es' ? '✓ Guardado'  : '✓ Saved')
       :           (lang === 'es' ? 'Guardar Cambios' : 'Save Changes')}
    </button>
  );
}

function useSaveState() {
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const trigger = async (fn) => {
    setSaving(true); setSaved(false);
    try { await fn(); setSaved(true); setTimeout(() => setSaved(false), 2500); }
    catch (err) { alert(err.message); }
    finally { setSaving(false); }
  };
  return { saving, saved, trigger };
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ message, onDone }) {
  useEffect(() => {
    const id = setTimeout(onDone, 3000);
    return () => clearTimeout(id);
  }, []);
  return (
    <div style={{
      position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 2000,
      background: '#1a2035', border: '1px solid #2a3555',
      borderLeft: '4px solid #FFD700', borderRadius: '12px',
      padding: '14px 20px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', gap: '10px',
      animation: 'toastIn 0.3s ease',
      fontSize: '0.88rem', fontWeight: 600, color: '#fff',
    }}>
      <span style={{ color: '#FFD700', fontSize: '1rem' }}>✓</span>
      {message}
      <style>{`@keyframes toastIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}

// ── Confirm Dialog ────────────────────────────────────────────────────────────
function ConfirmDialog({ title, message, confirmLabel = 'Confirm', confirmColor = '#ef4444', onConfirm, onCancel }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
      onClick={onCancel}>
      <div style={{ background: '#0f1219', border: '1px solid #2a2a2a', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '360px', boxShadow: '0 32px 80px rgba(0,0,0,0.7)', textAlign: 'center' }}
        onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🗑️</div>
        <h3 style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff', marginBottom: '0.75rem' }}>{title}</h3>
        <p style={{ color: '#9a9a9a', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>{message}</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onCancel} style={{ flex: 1, padding: '11px', borderRadius: '50px', background: 'transparent', border: '1px solid #1a2035', color: '#9a9a9a', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem' }}>Cancelar</button>
          <button onClick={onConfirm} style={{ flex: 1, padding: '11px', borderRadius: '50px', background: confirmColor, color: '#fff', border: 'none', fontWeight: 800, cursor: 'pointer', fontSize: '0.88rem' }}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

// ── AddOns Section ────────────────────────────────────────────────────────────
function AddOnsSection({ token, lang, t, inputStyle }) {
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  const [addons, setAddons] = useState(null);
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // addon to delete
  const [showNewModal, setShowNewModal] = useState(false);
  const [newForm, setNewForm] = useState({ nombre_en: '', nombre_es: '', precio: '', activo: true });
  const [newSaving, setNewSaving] = useState(false);
  const addonsSave = useSaveState();
  const saveAddons = (data) => fetch(`${API}/api/settings/addons`, { method: 'PUT', headers, body: JSON.stringify(data) }).then(r => { if (!r.ok) throw new Error('Failed'); });
  const [editingName, setEditingName] = useState(null); // id of addon being name-edited

  const showToast = (msg) => setToast(msg);

  const fetchAddons = async () => {
    const res = await fetch(`${API}/api/addons`, { headers });
    if (res.ok) setAddons(await res.json());
  };

  useEffect(() => { fetchAddons(); }, [token]);

  const patchAddon = async (id, fields) => {
    await fetch(`${API}/api/addons/${id}`, { method: 'PUT', headers, body: JSON.stringify(fields) });
    await fetchAddons();
  };

  const deleteAddon = async (id) => {
    await fetch(`${API}/api/addons/${id}`, { method: 'DELETE', headers });
    setConfirmDelete(null);
    await fetchAddons();
    showToast(t('Add-On deleted', 'Add-On eliminado'));
  };

  const createAddon = async () => {
    if (!newForm.nombre_en.trim() || !newForm.precio || Number(newForm.precio) <= 0) return;
    setNewSaving(true);
    try {
      const res = await fetch(`${API}/api/addons`, {
        method: 'POST', headers,
        body: JSON.stringify({ ...newForm, precio: Number(newForm.precio) }),
      });
      if (res.ok) {
        await fetchAddons();
        setShowNewModal(false);
        setNewForm({ nombre_en: '', nombre_es: '', precio: '', activo: true });
        showToast(t('✓ Add-On created successfully', '✓ Add-On creado correctamente'));
      }
    } finally { setNewSaving(false); }
  };

  if (!addons) return <div style={{ color: '#3a4a6b', padding: '2rem', textAlign: 'center' }}>{t('Loading...','Cargando...')}</div>;

  return (
    <>
      <div style={{ background: '#0f1219', border: '1px solid #1a2035', borderRadius: '20px', marginBottom: '1.5rem', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '1.1rem 1.5rem', borderBottom: '1px solid #1a2035', background: '#080b11' }}>
          <span style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.01em' }}>Add-Ons</span>
        </div>

        {/* List */}
        <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {addons.length === 0 && (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#3a4a6b', fontSize: '0.85rem' }}>
              {t('No add-ons yet.', 'Sin add-ons aún.')}
            </div>
          )}
          {addons.map((a) => (
            <AddonRow
              key={a.id} addon={a} lang={lang} t={t} inputStyle={inputStyle}
              editingName={editingName} setEditingName={setEditingName}
              onToggle={(val) => patchAddon(a.id, { activo: val })}
              onPriceChange={(val) => patchAddon(a.id, { precio: Number(val) })}
              onNameSave={(val) => { patchAddon(a.id, { nombre_en: val, nombre_es: val }); setEditingName(null); }}
              onDelete={() => setConfirmDelete(a)}
            />
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #1a2035', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={() => setShowNewModal(true)}
            style={{ padding: '9px 18px', borderRadius: '50px', background: 'transparent', border: '1px solid #2a2a2a', color: '#fff', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#FFD700'; e.currentTarget.style.color = '#FFD700'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#fff'; }}
          >
            + {t('New Add-On', 'Nuevo Add-On')}
          </button>
          <SaveBtn onClick={() => addonsSave.trigger(() => saveAddons(addons))} saving={addonsSave.saving} saved={addonsSave.saved} lang={lang} />
        </div>
      </div>

      {/* New Add-On Modal */}
      {showNewModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={() => setShowNewModal(false)}>
          <div style={{ background: '#0f1219', border: '1px solid #2a2a2a', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '400px', boxShadow: '0 32px 80px rgba(0,0,0,0.7)' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 800, fontSize: '1.1rem', margin: 0 }}>➕ {t('New Add-On', 'Nuevo Add-On')}</h3>
              <button onClick={() => setShowNewModal(false)} style={{ background: 'none', border: 'none', color: '#3a4a6b', cursor: 'pointer', fontSize: '1.3rem' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.68rem', color: '#3a4a6b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                  {t('Name (EN)', 'Nombre')} *
                </label>
                <input type="text" placeholder={t('e.g. Window Tinting', 'ej. Tinte de Vidrios')}
                  value={newForm.nombre_en} onChange={e => setNewForm(f => ({ ...f, nombre_en: e.target.value }))}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#FFD700'} onBlur={e => e.target.style.borderColor = '#1a2035'}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.68rem', color: '#3a4a6b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                  {t('Name (ES)', 'Nombre en Español')}
                </label>
                <input type="text" placeholder={t('e.g. Tinte de Vidrios', 'ej. Tinte de Vidrios')}
                  value={newForm.nombre_es} onChange={e => setNewForm(f => ({ ...f, nombre_es: e.target.value }))}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#FFD700'} onBlur={e => e.target.style.borderColor = '#1a2035'}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.68rem', color: '#3a4a6b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                  {t('Price', 'Precio')} *
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#FFD700', fontWeight: 700 }}>$</span>
                  <input type="number" min="0" placeholder="0"
                    value={newForm.precio} onChange={e => setNewForm(f => ({ ...f, precio: e.target.value }))}
                    style={{ ...inputStyle, paddingLeft: '26px' }}
                    onFocus={e => e.target.style.borderColor = '#FFD700'} onBlur={e => e.target.style.borderColor = '#1a2035'}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Toggle value={newForm.activo} onChange={val => setNewForm(f => ({ ...f, activo: val }))} />
                <span style={{ fontSize: '0.85rem', color: '#9a9a9a' }}>{t('Active by default', 'Activo por defecto')}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '1.75rem' }}>
              <button onClick={() => setShowNewModal(false)} style={{ flex: 1, padding: '11px', borderRadius: '50px', background: 'transparent', border: '1px solid #1a2035', color: '#9a9a9a', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem' }}>
                {t('Cancel', 'Cancelar')}
              </button>
              <button onClick={createAddon} disabled={newSaving || !newForm.nombre_en.trim() || !newForm.precio || Number(newForm.precio) <= 0}
                style={{ flex: 1, padding: '11px', borderRadius: '50px', background: (!newForm.nombre_en.trim() || !newForm.precio || Number(newForm.precio) <= 0) ? '#1a2035' : 'linear-gradient(135deg,#FFD700,#FFC200)', color: (!newForm.nombre_en.trim() || !newForm.precio) ? '#3a4a6b' : '#000', border: 'none', fontWeight: 800, cursor: 'pointer', fontSize: '0.88rem' }}>
                {newSaving ? t('Saving...','Guardando...') : t('Create Add-On','Crear Add-On')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmDelete && (
        <ConfirmDialog
          title={t('Delete Add-On', 'Eliminar Add-On')}
          message={`${t('Delete','¿Eliminar')} "${lang === 'es' ? confirmDelete.nombre_es : confirmDelete.nombre_en}"? ${t('This add-on will no longer appear in the client booking.','Este add-on dejará de aparecer en el booking del cliente.')}`}
          confirmLabel={t('Yes, Delete', 'Sí, Eliminar')}
          onConfirm={() => deleteAddon(confirmDelete.id)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </>
  );
}

function AddonRow({ addon: a, lang, t, inputStyle, editingName, setEditingName, onToggle, onPriceChange, onNameSave, onDelete }) {
  const [nameVal, setNameVal] = useState(lang === 'es' ? a.nombre_es : a.nombre_en);
  const [priceVal, setPriceVal] = useState(a.precio);
  const isEditingName = editingName === a.id;

  // Sync if lang or addon changes
  useEffect(() => { setNameVal(lang === 'es' ? a.nombre_es : a.nombre_en); }, [a, lang]);
  useEffect(() => { setPriceVal(a.precio); }, [a.precio]);

  const commitName = () => {
    if (nameVal.trim() && nameVal !== (lang === 'es' ? a.nombre_es : a.nombre_en)) {
      onNameSave(nameVal.trim());
    } else {
      setEditingName(null);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: '#080b11', borderRadius: '12px', border: '1px solid #1a2035', transition: 'border-color 0.15s' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = '#2a3555'}
      onMouseLeave={e => e.currentTarget.style.borderColor = '#1a2035'}
    >
      {/* Toggle */}
      <Toggle value={a.activo} onChange={onToggle} />

      {/* Name — click to edit */}
      {isEditingName ? (
        <input
          autoFocus
          value={nameVal}
          onChange={e => setNameVal(e.target.value)}
          onBlur={commitName}
          onKeyDown={e => { if (e.key === 'Enter') commitName(); if (e.key === 'Escape') { setNameVal(lang === 'es' ? a.nombre_es : a.nombre_en); setEditingName(null); } }}
          style={{ flex: 1, background: 'transparent', border: 'none', borderBottom: '1px solid #FFD700', color: '#FFD700', fontSize: '0.85rem', outline: 'none', padding: '2px 0', fontFamily: 'Inter, sans-serif' }}
        />
      ) : (
        <span
          onClick={() => { setEditingName(a.id); setNameVal(lang === 'es' ? a.nombre_es : a.nombre_en); }}
          title={t('Click to edit name', 'Click para editar nombre')}
          style={{ flex: 1, fontSize: '0.85rem', color: a.activo ? '#fff' : '#3a4a6b', cursor: 'text', transition: 'color 0.2s', userSelect: 'none' }}
          onMouseEnter={e => { if (!isEditingName) e.currentTarget.style.color = '#FFD700'; }}
          onMouseLeave={e => { if (!isEditingName) e.currentTarget.style.color = a.activo ? '#fff' : '#3a4a6b'; }}
        >
          {lang === 'es' ? a.nombre_es : a.nombre_en}
        </span>
      )}

      {/* Price */}
      <div style={{ position: 'relative', width: '85px', flexShrink: 0 }}>
        <span style={{ position: 'absolute', left: '9px', top: '50%', transform: 'translateY(-50%)', color: '#FFD700', fontWeight: 700, fontSize: '0.78rem' }}>$</span>
        <input type="number" min="0" value={priceVal}
          onChange={e => setPriceVal(e.target.value)}
          onBlur={() => { if (Number(priceVal) !== a.precio) onPriceChange(priceVal); }}
          style={{ ...inputStyle, paddingLeft: '22px', textAlign: 'right', fontSize: '0.82rem' }}
          onFocus={e => e.target.style.borderColor = '#FFD700'}
          onBlur2={e => e.target.style.borderColor = '#1a2035'}
        />
      </div>

      {/* Delete */}
      <button onClick={onDelete} title={t('Delete', 'Eliminar')}
        style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'transparent', border: '1px solid transparent', color: '#3a4a6b', cursor: 'pointer', fontSize: '0.88rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; e.currentTarget.style.color = '#ef4444'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.color = '#3a4a6b'; }}
      >
        🗑️
      </button>
    </div>
  );
}

// ── Zones Section ─────────────────────────────────────────────────────────────
function ZonesSection({ token, lang, t, inputStyle }) {
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  const [zones, setZones] = useState(null);
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newForm, setNewForm] = useState({ nombre_en: '', nombre_es: '', fee: '', activo: true });
  const [newSaving, setNewSaving] = useState(false);
  const [editingName, setEditingName] = useState(null);
  const zonesSave = useSaveState();

  const showToast = (msg) => setToast(msg);

  const fetchZones = async () => {
    const res = await fetch(`${API}/api/zones`, { headers });
    if (res.ok) setZones(await res.json());
  };

  useEffect(() => { fetchZones(); }, [token]);

  const patchZone = async (id, fields) => {
    await fetch(`${API}/api/zones/${id}`, { method: 'PUT', headers, body: JSON.stringify(fields) });
    await fetchZones();
  };

  const deleteZone = async (id) => {
    await fetch(`${API}/api/zones/${id}`, { method: 'DELETE', headers });
    setConfirmDelete(null);
    await fetchZones();
    showToast(t('Zone deleted', 'Zona eliminada'));
  };

  const createZone = async () => {
    if (!newForm.nombre_en.trim() || newForm.fee === '') return;
    setNewSaving(true);
    try {
      const res = await fetch(`${API}/api/zones`, {
        method: 'POST', headers,
        body: JSON.stringify({ ...newForm, fee: Number(newForm.fee) }),
      });
      if (res.ok) {
        await fetchZones();
        setShowNewModal(false);
        setNewForm({ nombre_en: '', nombre_es: '', fee: '', activo: true });
        showToast(t('✓ Zone created successfully', '✓ Zona creada correctamente'));
      }
    } finally { setNewSaving(false); }
  };

  const saveZones = async (currentZones) => {
    for (const z of currentZones) {
      await fetch(`${API}/api/zones/${z.id}`, {
        method: 'PUT', headers,
        body: JSON.stringify({ nombre_en: z.nombre_en, nombre_es: z.nombre_es, fee: z.fee, activo: z.activo }),
      });
    }
    showToast(t('✓ Zones saved', '✓ Zonas guardadas'));
  };

  if (!zones) return <div style={{ color: '#3a4a6b', padding: '2rem', textAlign: 'center' }}>{t('Loading...','Cargando...')}</div>;

  return (
    <>
      <div style={{ background: '#0f1219', border: '1px solid #1a2035', borderRadius: '20px', marginBottom: '1.5rem', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '1.1rem 1.5rem', borderBottom: '1px solid #1a2035', background: '#080b11', display: 'flex', alignItems: 'center' }}>
          <span style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.01em' }}>{t('Zones & Travel Fees', 'Zonas y Cargos de Viaje')}</span>
        </div>

        {/* List */}
        <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {zones.length === 0 && (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#3a4a6b', fontSize: '0.85rem' }}>
              {t('No zones configured. Create one below.', 'Sin zonas. Crea una abajo.')}
            </div>
          )}
          {zones.map((z) => (
            <ZoneRow
              key={z.id} zone={z} lang={lang} t={t} inputStyle={inputStyle}
              editingName={editingName} setEditingName={setEditingName}
              onToggle={(val) => patchZone(z.id, { activo: val })}
              onFeeChange={(val) => patchZone(z.id, { fee: Number(val) })}
              onNameSave={(val) => { patchZone(z.id, { nombre_en: val, nombre_es: val }); setEditingName(null); }}
              onDelete={() => setConfirmDelete(z)}
            />
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #1a2035', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={() => setShowNewModal(true)}
            style={{ padding: '9px 18px', borderRadius: '50px', background: 'transparent', border: '1px solid #2a2a2a', color: '#fff', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#FFD700'; e.currentTarget.style.color = '#FFD700'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#fff'; }}
          >
            + {t('New Zone', 'Nueva Zona')}
          </button>
          <SaveBtn onClick={() => zonesSave.trigger(() => saveZones(zones))} saving={zonesSave.saving} saved={zonesSave.saved} lang={lang} />
        </div>
      </div>

      {/* New Zone Modal */}
      {showNewModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={() => setShowNewModal(false)}>
          <div style={{ background: '#0f1219', border: '1px solid #2a2a2a', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '400px', boxShadow: '0 32px 80px rgba(0,0,0,0.7)' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 800, fontSize: '1.1rem', margin: 0 }}>➕ {t('New Zone', 'Nueva Zona')}</h3>
              <button onClick={() => setShowNewModal(false)} style={{ background: 'none', border: 'none', color: '#3a4a6b', cursor: 'pointer', fontSize: '1.3rem' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.68rem', color: '#3a4a6b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                  {t('Name (EN)', 'Nombre')} *
                </label>
                <input type="text" placeholder={t('e.g. Zone 5 — San Diego', 'ej. Zona 5 — San Diego')}
                  value={newForm.nombre_en} onChange={e => setNewForm(f => ({ ...f, nombre_en: e.target.value }))}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#FFD700'} onBlur={e => e.target.style.borderColor = '#1a2035'}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.68rem', color: '#3a4a6b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                  {t('Name (ES)', 'Nombre en Español')}
                </label>
                <input type="text" placeholder={t('e.g. Zone 5 — San Diego (Spanish name)', 'ej. Zona 5 — San Diego')}
                  value={newForm.nombre_es} onChange={e => setNewForm(f => ({ ...f, nombre_es: e.target.value }))}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#FFD700'} onBlur={e => e.target.style.borderColor = '#1a2035'}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.68rem', color: '#3a4a6b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                  {t('Travel Fee', 'Cargo de Viaje')} <span style={{ color: '#3a4a6b', fontWeight: 400 }}>({t('0 = FREE','0 = GRATIS')})</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#FFD700', fontWeight: 700 }}>$</span>
                  <input type="number" min="0" placeholder="0"
                    value={newForm.fee} onChange={e => setNewForm(f => ({ ...f, fee: e.target.value }))}
                    style={{ ...inputStyle, paddingLeft: '26px' }}
                    onFocus={e => e.target.style.borderColor = '#FFD700'} onBlur={e => e.target.style.borderColor = '#1a2035'}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Toggle value={newForm.activo} onChange={val => setNewForm(f => ({ ...f, activo: val }))} />
                <span style={{ fontSize: '0.85rem', color: '#9a9a9a' }}>{t('Active by default', 'Activo por defecto')}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '1.75rem' }}>
              <button onClick={() => setShowNewModal(false)} style={{ flex: 1, padding: '11px', borderRadius: '50px', background: 'transparent', border: '1px solid #1a2035', color: '#9a9a9a', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem' }}>
                {t('Cancel', 'Cancelar')}
              </button>
              <button onClick={createZone} disabled={newSaving || !newForm.nombre_en.trim() || newForm.fee === ''}
                style={{ flex: 1, padding: '11px', borderRadius: '50px', background: (!newForm.nombre_en.trim() || newForm.fee === '') ? '#1a2035' : 'linear-gradient(135deg,#FFD700,#FFC200)', color: (!newForm.nombre_en.trim() || newForm.fee === '') ? '#3a4a6b' : '#000', border: 'none', fontWeight: 800, cursor: 'pointer', fontSize: '0.88rem' }}>
                {newSaving ? t('Saving...','Guardando...') : t('Create Zone','Crear Zona')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmDelete && (
        <ConfirmDialog
          title={t('Delete Zone', 'Eliminar Zona')}
          message={`${t('Delete','¿Eliminar')} "${lang === 'es' ? confirmDelete.nombre_es : confirmDelete.nombre_en}"? ${t('Clients in this zone will no longer be able to book services.','Los clientes en esta zona no podrán agendar servicios.')}`}
          confirmLabel={t('Yes, Delete', 'Sí, Eliminar')}
          onConfirm={() => deleteZone(confirmDelete.id)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </>
  );
}

function ZoneRow({ zone: z, lang, t, inputStyle, editingName, setEditingName, onToggle, onFeeChange, onDelete, onNameSave }) {
  const [nameVal, setNameVal] = useState(lang === 'es' ? z.nombre_es : z.nombre_en);
  const [feeVal, setFeeVal] = useState(z.fee);
  const isEditingName = editingName === z.id;

  useEffect(() => { setNameVal(lang === 'es' ? z.nombre_es : z.nombre_en); }, [z, lang]);
  useEffect(() => { setFeeVal(z.fee); }, [z.fee]);

  const commitName = () => {
    const cur = lang === 'es' ? z.nombre_es : z.nombre_en;
    if (nameVal.trim() && nameVal !== cur) onNameSave(nameVal.trim());
    else setEditingName(null);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: '#080b11', borderRadius: '12px', border: '1px solid #1a2035', transition: 'border-color 0.15s' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = '#2a3555'}
      onMouseLeave={e => e.currentTarget.style.borderColor = '#1a2035'}
    >
      <Toggle value={z.activo} onChange={onToggle} />

      {isEditingName ? (
        <input autoFocus value={nameVal}
          onChange={e => setNameVal(e.target.value)}
          onBlur={commitName}
          onKeyDown={e => { if (e.key === 'Enter') commitName(); if (e.key === 'Escape') { setNameVal(lang === 'es' ? z.nombre_es : z.nombre_en); setEditingName(null); } }}
          style={{ flex: 1, background: 'transparent', border: 'none', borderBottom: '1px solid #FFD700', color: '#FFD700', fontSize: '0.85rem', outline: 'none', padding: '2px 0', fontFamily: 'Inter, sans-serif' }}
        />
      ) : (
        <span onClick={() => { setEditingName(z.id); setNameVal(lang === 'es' ? z.nombre_es : z.nombre_en); }}
          title={t('Click to edit name', 'Click para editar nombre')}
          style={{ flex: 1, fontSize: '0.85rem', color: z.activo ? '#fff' : '#3a4a6b', cursor: 'text', transition: 'color 0.2s', userSelect: 'none' }}
          onMouseEnter={e => { if (!isEditingName) e.currentTarget.style.color = '#FFD700'; }}
          onMouseLeave={e => { if (!isEditingName) e.currentTarget.style.color = z.activo ? '#fff' : '#3a4a6b'; }}
        >
          {lang === 'es' ? z.nombre_es : z.nombre_en}
        </span>
      )}

      {/* Fee input */}
      <div style={{ position: 'relative', width: '95px', flexShrink: 0 }}>
        <span style={{ position: 'absolute', left: '9px', top: '50%', transform: 'translateY(-50%)', color: '#FFD700', fontWeight: 700, fontSize: '0.78rem' }}>$</span>
        <input type="number" min="0" value={feeVal}
          onChange={e => setFeeVal(e.target.value)}
          onBlur={() => { if (Number(feeVal) !== z.fee) onFeeChange(feeVal); }}
          style={{ ...inputStyle, paddingLeft: '22px', textAlign: 'right', fontSize: '0.82rem' }}
          onFocus={e => e.target.style.borderColor = '#FFD700'}
          onBlur2={e => e.target.style.borderColor = '#1a2035'}
        />
      </div>


      {/* Delete */}
      <button onClick={onDelete} title={t('Delete', 'Eliminar')}
        style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'transparent', border: '1px solid transparent', color: '#3a4a6b', cursor: 'pointer', fontSize: '0.88rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; e.currentTarget.style.color = '#ef4444'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.color = '#3a4a6b'; }}
      >
        🗑️
      </button>
    </div>
  );
}

// ── Schedule Section ──────────────────────────────────────────────────────────
function ScheduleSection({ schedule, lang, t, inputStyle, updateDay, toggleDayHour, updateWork, updateSurch, addHoliday, removeHoliday, scheduleSave, saveUrl }) {
  const [activePanel, setActivePanel] = useState('mon');
  const [holidayDate, setHolidayDate] = useState(null);
  const [holidayLabel, setHolidayLabel] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const NAV_ITEMS = [
    ...DAY_KEYS.map(day => ({ id: day, labelEn: DAY_LABELS[day], labelEs: DAY_LABELS_ES[day], isDay: true })),
    { id: 'holidays', labelEn: 'Holidays', labelEs: 'Inhábiles', isDay: false },
    { id: 'work',     labelEn: 'Work Hrs',  labelEs: 'Jornada',   isDay: false },
  ];

  const dayData = (day) => schedule.days[day] || { enabled: false, hours: [] };
  const holidays = schedule.holidays || [];

  // ── Shared panel content ──────────────────────────────────────────────────
  const PanelContent = () => {
    // Day panel
    if (DAY_KEYS.includes(activePanel)) {
      const day = activePanel;
      const data = dayData(day);
      const dayName = lang === 'es' ? DAY_LABELS_ES[day] : DAY_LABELS[day];
      return (
        <div>
          {/* Toggle row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: isMobile ? 'space-between' : 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontWeight: 800, fontSize: '1.2rem', color: '#fff', margin: 0 }}>{dayName}</h3>
              <div style={{ fontSize: '0.65rem', color: '#3a4a6b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>
                {t('Work Day', 'Día Laborable')}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.8rem', color: data.enabled ? '#22c55e' : '#3a4a6b', fontWeight: 600 }}>
                {data.enabled ? t('Active', 'Activo') : t('Inactive', 'Inactivo')}
              </span>
              <Toggle value={data.enabled} onChange={val => updateDay(day, 'enabled', val)} />
            </div>
          </div>

          {data.enabled ? (
            <div>
              <div style={{ fontSize: '0.65rem', color: '#FFD700', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
                {t('Select available hours', 'Selecciona las horas habilitadas')}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {ALL_HOUR_SLOTS.map(hour => {
                  const active = (data.hours || []).includes(hour);
                  return (
                    <button key={hour} onClick={() => toggleDayHour(day, hour)} style={{
                      padding: '8px 14px', borderRadius: '8px', cursor: 'pointer',
                      fontWeight: active ? 700 : 500, fontSize: '0.82rem',
                      background: active ? '#FFD700' : '#0f1219',
                      color: active ? '#000' : '#9a9a9a',
                      border: `1px solid ${active ? '#FFD700' : '#2a2a2a'}`,
                      transition: 'all 0.15s', minHeight: '38px',
                    }}
                      onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = '#FFD700'; e.currentTarget.style.color = '#FFD700'; } }}
                      onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#9a9a9a'; } }}
                    >
                      {hour}
                    </button>
                  );
                })}
              </div>
              {(data.hours || []).length === 0 && (
                <p style={{ color: '#3a4a6b', fontSize: '0.8rem', marginTop: '12px' }}>
                  {t('No hours selected — day will be unavailable for clients.', 'Sin horas seleccionadas — el día no estará disponible para clientes.')}
                </p>
              )}
              <p style={{ color: '#3a4a6b', fontSize: '0.75rem', marginTop: '14px', lineHeight: 1.5 }}>
                {t('Selected hours will appear available to clients when booking.', 'Las horas seleccionadas aparecerán disponibles para clientes al agendar.')}
              </p>
            </div>
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed #1a2035' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🚫</div>
              <div style={{ color: '#3a4a6b', fontSize: '0.85rem' }}>
                {t('This day is disabled. Clients cannot book on this day.', 'Este día está deshabilitado. Los clientes no podrán agendar.')}
              </div>
            </div>
          )}
        </div>
      );
    }

    // Holidays panel
    if (activePanel === 'holidays') {
      return (
        <div>
          <div style={{ marginBottom: '1.5rem', textAlign: isMobile ? 'center' : 'left' }}>
            <h3 style={{ fontWeight: 800, fontSize: '1.2rem', color: '#fff', margin: 0 }}>{t('Holidays', 'Días Inhábiles')}</h3>
            <div style={{ fontSize: '0.65rem', color: '#3a4a6b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>
              {t('Business closed totally', 'Negocio cerrado totalmente')}
            </div>
          </div>

          {/* Add form */}
          <div style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.65rem', color: '#ef4444', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
              {t('Add Holiday', 'Agregar Día Inhábil')}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className={isMobile ? 'datepicker-full-width' : ''}>
                <DatePicker
                  selected={holidayDate}
                  onChange={(date) => setHolidayDate(date)}
                  dateFormat="MM/dd/yyyy"
                  placeholderText={t('Select date', 'Seleccionar fecha')}
                  calendarClassName="dark-calendar"
                  className={isMobile ? 'dark-datepicker-input datepicker-full-width' : 'dark-datepicker-input'}
                  minDate={new Date()}
                  wrapperClassName={isMobile ? 'datepicker-full-width' : ''}
                />
              </div>
              <input type="text" placeholder={t('Label (e.g. Christmas)', 'Nombre (ej. Navidad)')}
                value={holidayLabel} onChange={e => setHolidayLabel(e.target.value)}
                style={{ ...inputStyle }}
                onFocus={e => e.target.style.borderColor = '#FFD700'}
                onBlur={e => e.target.style.borderColor = '#1a2035'}
              />
              <button
                onClick={() => {
                  if (!holidayDate) return;
                  const yyyy = holidayDate.getFullYear();
                  const mm = String(holidayDate.getMonth() + 1).padStart(2, '0');
                  const dd = String(holidayDate.getDate()).padStart(2, '0');
                  addHoliday(`${yyyy}-${mm}-${dd}`, holidayLabel);
                  setHolidayDate(null);
                  setHolidayLabel('');
                }}
                disabled={!holidayDate}
                style={{ width: '100%', padding: '13px', borderRadius: '10px', background: holidayDate ? '#FFD700' : '#1a2035', color: holidayDate ? '#000' : '#3a4a6b', border: 'none', fontWeight: 800, cursor: holidayDate ? 'pointer' : 'not-allowed', fontSize: '0.88rem', minHeight: '44px' }}
              >
                + {t('Add', 'Añadir')}
              </button>
            </div>
          </div>

          {/* Holiday list */}
          {holidays.length === 0 ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: '#3a4a6b', fontSize: '0.85rem' }}>
              {t('No holidays configured', 'No hay fechas inhábiles configuradas')}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {holidays.map(h => {
                const entry = typeof h === 'object' ? h : { date: h, label: '' };
                const formatted = new Date(entry.date + 'T12:00:00').toLocaleDateString(lang === 'es' ? 'es-US' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' });
                return (
                  <div key={entry.date} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '10px' }}>
                    <span style={{ fontSize: '1.1rem' }}>📅</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>{formatted}</div>
                      {entry.label && <div style={{ fontSize: '0.72rem', color: '#9a9a9a' }}>{entry.label}</div>}
                    </div>
                    <button onClick={() => removeHoliday(entry.date)}
                      style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'transparent', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, minHeight: '32px' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >✕</button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    // Work Hours panel
    if (activePanel === 'work') {
      return (
        <div>
          <div style={{ marginBottom: '1.5rem', textAlign: isMobile ? 'center' : 'left' }}>
            <h3 style={{ fontWeight: 800, fontSize: '1.2rem', color: '#fff', margin: 0 }}>{t('Work Hours', 'Jornada Laboral')}</h3>
            <div style={{ fontSize: '0.65rem', color: '#3a4a6b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>
              {t('General business hours', 'Horario general de atención')}
            </div>
          </div>

          {/* Opening / Closing — side by side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1.25rem' }}>
            {[
              { field: 'work_start', labelEn: 'Opening', labelEs: 'Apertura' },
              { field: 'work_end',   labelEn: 'Closing',  labelEs: 'Cierre'   },
            ].map(f => (
              <div key={f.field}>
                <label style={{ display: 'block', fontSize: '0.68rem', color: '#3a4a6b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                  {t(f.labelEn, f.labelEs)}
                </label>
                <select value={schedule[f.field] || ''} onChange={e => updateWork(f.field, e.target.value)}
                  style={{ ...inputStyle, cursor: 'pointer', fontSize: '16px' }}
                  onFocus={e => e.target.style.borderColor = '#FFD700'}
                  onBlur={e => e.target.style.borderColor = '#1a2035'}
                >
                  {WORK_HOUR_OPTIONS.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
            ))}
          </div>

          <div style={{ padding: '1rem', background: 'rgba(255,215,0,0.04)', border: '1px solid rgba(255,215,0,0.12)', borderRadius: '12px', fontSize: '0.8rem', color: '#9a9a9a', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            ℹ️ {t('Clients can only book within this time range. Hours configured per day outside this range will be ignored.', 'Los clientes solo podrán agendar dentro de este rango. Las horas fuera de este rango configuradas por día serán ignoradas.')}
          </div>

          {/* Surcharges — side by side */}
          <div style={{ fontSize: '0.65rem', color: '#3a4a6b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
            {t('Surcharges', 'Recargos')}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { field: 'sunday_surcharge',  labelEn: 'Sunday %',  labelEs: 'Domingo %' },
              { field: 'holiday_surcharge', labelEn: 'Holiday %', labelEs: 'Festivo %' },
            ].map(f => (
              <div key={f.field}>
                <label style={{ display: 'block', fontSize: '0.68rem', color: '#3a4a6b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                  {t(f.labelEn, f.labelEs)}
                </label>
                <input type="number" min="0" max="100" value={schedule[f.field] ?? 0}
                  onChange={e => updateSurch(f.field, e.target.value)}
                  style={{ ...inputStyle, fontSize: '16px' }}
                  onFocus={e => e.target.style.borderColor = '#FFD700'}
                  onBlur={e => e.target.style.borderColor = '#1a2035'}
                />
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  // ── Sidebar nav item style (desktop only) ─────────────────────────────────
  const navItem = (id) => {
    const active = activePanel === id;
    const isDayKey = DAY_KEYS.includes(id);
    const enabled = isDayKey ? dayData(id).enabled : true;
    return {
      width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
      padding: '10px 14px', cursor: 'pointer', border: 'none',
      background: active ? 'rgba(255,215,0,0.08)' : 'transparent',
      borderLeft: `3px solid ${active ? '#FFD700' : 'transparent'}`,
      color: active ? '#FFD700' : enabled ? '#e0e0e0' : '#3a4a6b',
      fontSize: '0.85rem', fontWeight: active ? 700 : 500,
      textAlign: 'left', transition: 'all 0.15s', boxSizing: 'border-box',
    };
  };

  return (
    <div style={{ background: '#0f1219', border: '1px solid #1a2035', borderRadius: '20px', marginBottom: '1.5rem', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #1a2035', background: '#080b11', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <span style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.01em' }}>{t('Schedule & Hours', 'Horario de Trabajo')}</span>
        <SaveBtn onClick={() => scheduleSave.trigger(() => saveUrl('schedule', schedule))} saving={scheduleSave.saving} saved={scheduleSave.saved} lang={lang} fullWidth={false} />
      </div>

      {isMobile ? (
        /* ══════════════════════════════════════════════════
           MOBILE: horizontal scrollable tabs + content
        ══════════════════════════════════════════════════ */
        <div>
          {/* Tabs row */}
          <div style={{
            display: 'flex', gap: '8px', overflowX: 'auto', padding: '12px 16px',
            background: '#080b11', borderBottom: '1px solid #1a2035',
            scrollbarWidth: 'none', msOverflowStyle: 'none',
          }}>
            <style>{`.sched-tabs::-webkit-scrollbar { display: none; }`}</style>
            {NAV_ITEMS.map(item => {
              const active = activePanel === item.id;
              const isDayKey = DAY_KEYS.includes(item.id);
              const enabled = isDayKey ? dayData(item.id).enabled : true;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePanel(item.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    height: '36px', padding: '0 14px', borderRadius: '20px',
                    border: 'none', cursor: 'pointer', flexShrink: 0,
                    background: active ? '#FFD700' : '#1a1a1a',
                    color: active ? '#000' : '#9a9a9a',
                    fontWeight: active ? 700 : 500, fontSize: '0.8rem',
                    transition: 'all 0.15s',
                  }}
                >
                  {isDayKey && (
                    <span style={{
                      width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0,
                      background: active ? '#000' : (enabled ? '#22c55e' : '#3a4a6b'),
                    }} />
                  )}
                  <span style={{ whiteSpace: 'nowrap' }}>{lang === 'es' ? item.labelEs : item.labelEn}</span>
                </button>
              );
            })}
          </div>

          {/* Panel content */}
          <div style={{ padding: '20px' }}>
            <PanelContent />
          </div>
        </div>
      ) : (
        /* ══════════════════════════════════════════════════
           DESKTOP: sidebar left + panel right
        ══════════════════════════════════════════════════ */
        <div style={{ display: 'flex', minHeight: '480px' }}>

          {/* LEFT sidebar */}
          <div style={{ width: '200px', flexShrink: 0, background: '#080b11', borderRight: '1px solid #1a2035', display: 'flex', flexDirection: 'column', padding: '8px 0' }}>
            {[
              ...DAY_KEYS.map(day => ({ id: day, labelEn: DAY_LABELS[day], labelEs: DAY_LABELS_ES[day], isDay: true })),
              { id: '__div__', divider: true },
              { id: 'holidays', icon: '📅', labelEn: 'Holidays', labelEs: 'Días Inhábiles', isDay: false },
              { id: 'work',     icon: '🕐', labelEn: 'Work Hours', labelEs: 'Jornada Laboral', isDay: false },
            ].map(item => {
              if (item.divider) return <div key="div" style={{ height: '1px', background: '#1a2035', margin: '6px 0' }} />;
              const isDayKey = DAY_KEYS.includes(item.id);
              const enabled = isDayKey ? dayData(item.id).enabled : true;
              return (
                <button key={item.id} onClick={() => setActivePanel(item.id)} style={navItem(item.id)}>
                  {item.icon && <span style={{ fontSize: '0.9rem', flexShrink: 0 }}>{item.icon}</span>}
                  {!item.icon && (
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: enabled ? '#22c55e' : '#3a4a6b', flexShrink: 0, transition: 'background 0.2s' }} />
                  )}
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {lang === 'es' ? item.labelEs : item.labelEn}
                  </span>
                </button>
              );
            })}
          </div>

          {/* RIGHT panel */}
          <div style={{ flex: 1, padding: '1.75rem', overflowY: 'auto' }}>
            <PanelContent />
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AdminSettings() {
  const { token } = useAdminAuth();
  const { lang } = useLang();
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  const t = (en, es) => lang === 'es' ? es : en;

  const [prices,          setPrices]          = useState(null);
  const [addons,          setAddons]          = useState(null);
  const [zones,           setZones]           = useState(null);
  const [schedule,        setSchedule]        = useState(null);
  const [business,        setBusiness]        = useState(null);
  const [loading,         setLoading]         = useState(true);
  const [pricesNameToast, setPricesNameToast] = useState(null);
  const pricesRef = useRef(null);

  const pricesSave   = useSaveState();
  const addonsSave   = useSaveState();
  const zonesSave    = useSaveState();
  const scheduleSave = useSaveState();
  const businessSave = useSaveState();

  useEffect(() => {
    fetch(`${API}/api/settings`, { headers })
      .then(r => r.json())
      .then(data => {
        if (data.prices) {
          // Inject name_en/name_es from PACKAGE_LABELS if not already stored
          const enriched = {};
          for (const [slug, vp] of Object.entries(data.prices)) {
            enriched[slug] = {
              name_en: vp.name_en ?? PACKAGE_LABELS[slug]?.en ?? slug,
              name_es: vp.name_es ?? PACKAGE_LABELS[slug]?.es ?? slug,
              ...vp,
            };
          }
          setPrices(enriched);
        }
        if (data.addons)   setAddons(data.addons);
        if (data.zones)    setZones(data.zones);
        if (data.schedule) setSchedule(data.schedule);
        if (data.business) setBusiness(data.business);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  // Keep ref in sync so onBlur closures always save latest prices
  useEffect(() => { pricesRef.current = prices; }, [prices]);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const inputStyle = {
    padding: '12px 13px', borderRadius: '10px',
    background: '#080b11', border: '1px solid #1a2035', color: '#fff',
    fontSize: '16px', outline: 'none', width: '100%', boxSizing: 'border-box',
    fontFamily: 'Inter, sans-serif', transition: 'border-color 0.15s',
    minHeight: '44px',
  };

  if (loading) return (
    <AdminLayout title={t('Settings', 'Ajustes')}>
      <div style={{ color: '#3a4a6b', padding: '4rem', textAlign: 'center' }}>{t('Loading...', 'Cargando...')}</div>
    </AdminLayout>
  );

  // helpers
  const updatePrice   = (pkg, vehicle, val) => setPrices(p => ({ ...p, [pkg]: { ...p[pkg], [vehicle]: Number(val) } }));
  const updatePkgName = (pkg, field, val)  => setPrices(p => ({ ...p, [pkg]: { ...p[pkg], [field]: val } }));
  const updateAddon   = (idx, field, val)   => setAddons(a => a.map((x, i) => i === idx ? { ...x, [field]: field === 'precio' ? Number(val) : val } : x));
  const updateZone    = (idx, field, val)   => setZones(z => z.map((x, i) => i === idx ? { ...x, [field]: field === 'fee' ? Number(val) : val } : x));
  const updateDay     = (day, field, val)   => setSchedule(s => ({ ...s, days: { ...s.days, [day]: { ...s.days[day], [field]: val } } }));
  const toggleDayHour = (day, hour)         => setSchedule(s => {
    const hours = s.days[day].hours || [];
    const next  = hours.includes(hour) ? hours.filter(h => h !== hour) : [...hours, hour];
    // Keep sorted by ALL_HOUR_SLOTS order
    const sorted = ALL_HOUR_SLOTS.filter(h => next.includes(h));
    return { ...s, days: { ...s.days, [day]: { ...s.days[day], hours: sorted } } };
  });
  const updateSurch   = (field, val)        => setSchedule(s => ({ ...s, [field]: Number(val) }));
  const updateWork    = (field, val)        => setSchedule(s => ({ ...s, [field]: val }));
  const addHoliday    = (date, label) => {
    if (!date || (schedule.holidays || []).some(h => h.date === date)) return;
    setSchedule(s => ({ ...s, holidays: [...(s.holidays || []), { date, label: label || '' }].sort((a,b) => a.date.localeCompare(b.date)) }));
  };
  const removeHoliday = (date) => setSchedule(s => ({ ...s, holidays: (s.holidays || []).filter(h => h.date !== date) }));

  const saveUrl = (path, data) => fetch(`${API}/api/settings/${path}`, { method: 'PUT', headers, body: JSON.stringify(data) }).then(r => { if (!r.ok) throw new Error('Failed'); });

  return (
    <AdminLayout title={t('Settings', 'Ajustes')}>

      {/* 1 — Prices */}
      {prices && (
        <SectionCard title={t('Package Prices', 'Precios de Paquetes')}>
          {pricesNameToast && <Toast message={pricesNameToast} onDone={() => setPricesNameToast(null)} />}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem', tableLayout: 'fixed' }}>
              <colgroup>
                <col style={{ width: 'auto' }} />
                {VEHICLE_KEYS.map(v => <col key={v} style={{ width: '100px' }} />)}
              </colgroup>
              <thead>
                <tr>
                  <th style={{ padding: '8px 12px', textAlign: 'left', color: '#3a4a6b', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {t('Package', 'Paquete')}
                  </th>
                  {VEHICLE_KEYS.map(v => (
                    <th key={v} style={{ padding: '8px 6px', textAlign: 'center', color: '#3a4a6b', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em', width: '100px' }}>
                      {VEHICLE_LABELS[v]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(prices).map(([pkg, vp]) => {
                  const nameField = lang === 'es' ? 'name_es' : 'name_en';
                  const displayName = lang === 'es' ? (vp.name_es || PACKAGE_LABELS[pkg]?.es) : (vp.name_en || PACKAGE_LABELS[pkg]?.en);
                  return (
                    <tr key={pkg} style={{ borderTop: '1px solid #1a2035' }}>
                      <td style={{ padding: '6px 12px' }}>
                        <input
                          type="text"
                          value={displayName ?? ''}
                          onChange={e => updatePkgName(pkg, nameField, e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') e.target.blur(); }}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            borderBottom: '2px solid transparent',
                            color: '#fff',
                            fontWeight: 600,
                            fontSize: '0.83rem',
                            width: '100%',
                            outline: 'none',
                            padding: '2px 0',
                            cursor: 'text',
                            transition: 'border-color 0.15s',
                            fontFamily: 'Inter, sans-serif',
                          }}
                          onFocus={e => e.target.style.borderBottomColor = '#FFD700'}
                          onBlur={e => {
                            e.target.style.borderBottomColor = 'transparent';
                            pricesSave.trigger(() => saveUrl('prices', pricesRef.current));
                            setPricesNameToast(t('✓ Name updated', '✓ Nombre actualizado'));
                          }}
                        />
                      </td>
                      {VEHICLE_KEYS.map(v => (
                        <td key={v} style={{ padding: '6px 6px', width: '100px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
                            <span style={{ color: '#FFD700', fontWeight: 700, fontSize: '0.82rem', flexShrink: 0 }}>$</span>
                            <input
                              type="number"
                              min="0"
                              value={vp[v] ?? ''}
                              onChange={e => updatePrice(pkg, v, e.target.value)}
                              style={{
                                ...inputStyle,
                                width: '72px',
                                minWidth: '72px',
                                padding: '8px 6px',
                                textAlign: 'center',
                                fontSize: '0.88rem',
                                minHeight: 'unset',
                              }}
                              onFocus={e => e.target.style.borderColor = '#FFD700'}
                              onBlur={e => e.target.style.borderColor = '#1a2035'}
                            />
                          </div>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
            <SaveBtn onClick={() => pricesSave.trigger(() => saveUrl('prices', prices))} saving={pricesSave.saving} saved={pricesSave.saved} lang={lang} fullWidth={isMobile} />
          </div>
        </SectionCard>
      )}

      {/* 2 — Add-Ons */}
      <AddOnsSection token={token} lang={lang} t={t} inputStyle={inputStyle} />

      {/* 3 — Zones — disabled while location step is removed */}
      {/* <ZonesSection token={token} lang={lang} t={t} inputStyle={inputStyle} /> */}

      {/* 4 — Schedule */}
      {schedule && <ScheduleSection schedule={schedule} lang={lang} t={t} inputStyle={inputStyle}
        updateDay={updateDay} toggleDayHour={toggleDayHour}
        updateWork={updateWork} updateSurch={updateSurch}
        addHoliday={addHoliday} removeHoliday={removeHoliday}
        scheduleSave={scheduleSave} saveUrl={saveUrl}
      />}

      {/* 5 — Business Info */}
      {business && (
        <SectionCard title={t('Business Info', 'Info del Negocio')}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {[
              { key: 'name',      label: t('Business Name', 'Nombre del Negocio'), type: 'text'  },
              { key: 'phone',     label: t('Phone', 'Teléfono'),                   type: 'tel'   },
              { key: 'email',     label: 'Email',                                  type: 'email' },
              { key: 'address',   label: t('Base Address', 'Dirección Base'),      type: 'text'  },
              { key: 'instagram', label: 'Instagram',                               type: 'text'  },
              { key: 'facebook',  label: 'Facebook',                                type: 'text'  },
            ].map(f => (
              <div key={f.key}>
                <label style={{ display: 'block', fontSize: '0.7rem', color: '#3a4a6b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                  {f.label}
                </label>
                <input type={f.type} value={business[f.key] || ''}
                  onChange={e => setBusiness(b => ({ ...b, [f.key]: e.target.value }))}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#FFD700'}
                  onBlur={e => e.target.style.borderColor = '#1a2035'}
                />
              </div>
            ))}
          </div>
          <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
            <SaveBtn onClick={() => businessSave.trigger(() => saveUrl('business', business))} saving={businessSave.saving} saved={businessSave.saved} lang={lang} fullWidth={isMobile} />
          </div>
        </SectionCard>
      )}
    </AdminLayout>
  );
}
