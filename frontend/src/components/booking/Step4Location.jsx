import { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Polygon, Marker } from '@react-google-maps/api';
import { useLang } from '../../LangContext';
import { CONTACT } from '../../data/bookingData';
import { API_URL as API } from '../../config';

const LIBRARIES = ['places'];

const MAP_CENTER = { lat: 33.7500, lng: -117.8700 };
const MAP_ZOOM = 10;

const DARK_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#1a1a1a' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#9a9a9a' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0a0d14' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2a2a2a' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#555' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#111111' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#2a2a2a' }] },
];

// ━━━ REAL POLYGON COORDINATES ━━━

const zone1Polygon = [
  { lat: 33.7701, lng: -117.9311 },
  { lat: 33.7879, lng: -117.8531 },
  { lat: 33.7455, lng: -117.8268 },
  { lat: 33.6846, lng: -117.8265 },
  { lat: 33.6189, lng: -117.9289 },
  { lat: 33.6395, lng: -118.0150 },
  { lat: 33.7068, lng: -118.0019 },
  { lat: 33.7412, lng: -117.9939 },
];

const zone2Polygon = [
  { lat: 33.8704, lng: -117.9242 },
  { lat: 33.8703, lng: -117.7831 },
  { lat: 33.8272, lng: -117.7645 },
  { lat: 33.7879, lng: -117.8531 },
  { lat: 33.7701, lng: -117.9311 },
  { lat: 33.7412, lng: -117.9939 },
  { lat: 33.7068, lng: -118.0019 },
  { lat: 33.6395, lng: -118.0150 },
  { lat: 33.6590, lng: -118.0050 },
  { lat: 33.6604, lng: -118.0597 },
  { lat: 33.7500, lng: -118.0597 },
  { lat: 33.8300, lng: -118.0100 },
];

const zone3Polygon = [
  { lat: 34.0522, lng: -118.2437 },
  { lat: 33.9700, lng: -118.1500 },
  { lat: 33.8358, lng: -118.1048 },
  { lat: 33.9164, lng: -118.0833 },
  { lat: 33.9797, lng: -117.9956 },
  { lat: 33.9319, lng: -117.9483 },
  { lat: 33.9167, lng: -117.9000 },
  { lat: 33.8886, lng: -117.8131 },
  { lat: 33.8703, lng: -117.7831 },
  { lat: 33.8704, lng: -117.9242 },
  { lat: 33.8300, lng: -118.0100 },
  { lat: 33.7500, lng: -118.0597 },
  { lat: 33.7700, lng: -118.1500 },
];

const zone4Polygon = [
  { lat: 34.1066, lng: -117.5931 },
  { lat: 33.9806, lng: -117.3755 },
  { lat: 33.7500, lng: -117.4500 },
  { lat: 33.9731, lng: -117.7152 },
  { lat: 34.0550, lng: -117.7500 },
  { lat: 34.0122, lng: -117.6889 },
  { lat: 34.0633, lng: -117.6500 },
  { lat: 34.1500, lng: -117.5000 },
];

// ━━━ POLYGON → ZONE MAPPING (fixed visual shapes, data from DB) ━━━

// Colors per visual zone index (1-4)
const ZONE_COLORS = {
  1: { color: '#FFD700', fillColor: 'rgba(255,215,0,0.15)' },
  2: { color: '#FFA500', fillColor: 'rgba(255,165,0,0.15)' },
  3: { color: '#FF6B00', fillColor: 'rgba(255,107,0,0.15)' },
  4: { color: '#FF3B00', fillColor: 'rgba(255,59,0,0.15)' },
};

// Polygons keyed by zona number (immutable)
const ZONE_POLYGONS = {
  1: zone1Polygon,
  2: zone2Polygon,
  3: zone3Polygon,
  4: zone4Polygon,
};

function pointInPolygon(point, polygon) {
  let inside = false;
  const x = point.lat, y = point.lng;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lat, yi = polygon[i].lng;
    const xj = polygon[j].lat, yj = polygon[j].lng;
    const intersect = ((yi > y) !== (yj > y)) &&
      (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

// detectZone now receives live DB zones and checks activo
function detectZone(lat, lng, dbZones) {
  const point = { lat, lng };
  for (const zona of [1, 2, 3, 4]) {
    const poly = ZONE_POLYGONS[zona];
    if (!poly) continue;
    if (pointInPolygon(point, poly)) {
      const dbZone = dbZones.find(z => z.zona === zona);
      if (!dbZone) return { id: null, outside: true }; // zone deleted from DB
      if (!dbZone.activo) return { id: null, inactive: true, zona }; // zone disabled
      return {
        id: zona,
        nameEn: dbZone.nombre_en,
        nameEs: dbZone.nombre_es,
        fee: dbZone.fee,
        ...ZONE_COLORS[zona],
      };
    }
  }
  return { id: null, outside: true };
}

export default function Step4Location({ bookingState, onUpdate }) {
  const { lang } = useLang();
  const loc = bookingState.location || {};

  // DB zones (names, fees, active status)
  const [dbZones, setDbZones] = useState([]);
  useEffect(() => {
    fetch(`${API}/api/zones`)
      .then(r => r.ok ? r.json() : [])
      .then(setDbZones)
      .catch(() => {});
  }, []);

  // Active zones for legend (activo = true)
  const activeDbZones = dbZones.filter(z => z.activo);

  // Build ZONE_CONFIGS from DB data merged with polygon + colors
  const zoneConfigs = dbZones.map(z => ({
    id: z.zona,
    dbId: z.id,
    polygon: ZONE_POLYGONS[z.zona],
    nameEn: z.nombre_en,
    nameEs: z.nombre_es,
    fee: z.fee,
    activo: z.activo,
    ...ZONE_COLORS[z.zona],
  })).filter(z => z.polygon); // only zones with known polygons

  const [markerPos, setMarkerPos] = useState(
    loc.coordinates?.lat ? { lat: loc.coordinates.lat, lng: loc.coordinates.lng } : null
  );
  const [detectedZone, setDetectedZone] = useState(null);
  const [outsideArea, setOutsideArea] = useState(false);
  const [inactiveZone, setInactiveZone] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  // Initialize Places Autocomplete once map is loaded and input is ready
  useEffect(() => {
    if (!isLoaded || !inputRef.current || autocompleteRef.current) return;

    const ac = new window.google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: 'us' },
      fields: ['geometry', 'formatted_address'],
      types: ['address'],
    });

    ac.addListener('place_changed', () => {
      const place = ac.getPlace();
      if (!place.geometry || !place.geometry.location) return;

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const pos = { lat, lng };
      const zone = detectZone(lat, lng, dbZones);

      setMarkerPos(pos);
      setOutsideArea(!!zone.outside);
      setInactiveZone(!!zone.inactive);

      if (zone.id !== null) {
        setDetectedZone(zone);
        onUpdate({
          location: {
            address: place.formatted_address || '',
            zone: zone.id,
            travelFee: zone.fee,
            coordinates: { lat, lng },
          }
        });
      } else {
        setDetectedZone(null);
        onUpdate({
          location: {
            address: place.formatted_address || '',
            zone: null,
            travelFee: 0,
            coordinates: { lat, lng },
          }
        });
      }

      if (mapInstance) {
        mapInstance.panTo(pos);
        mapInstance.setZoom(13);
      }
    });

    autocompleteRef.current = ac;
  }, [isLoaded, mapInstance, onUpdate]);

  const handleMapClick = useCallback((e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    const pos = { lat, lng };
    const zone = detectZone(lat, lng, dbZones);

    setMarkerPos(pos);
    setOutsideArea(!!zone.outside);
    setInactiveZone(!!zone.inactive);

    if (zone.id !== null) {
      setDetectedZone(zone);
      onUpdate({
        location: {
          address: loc.address || '',
          zone: zone.id,
          travelFee: zone.fee,
          coordinates: { lat, lng },
        }
      });
    } else {
      setDetectedZone(null);
      onUpdate({
        location: {
          address: loc.address || '',
          zone: null,
          travelFee: 0,
          coordinates: { lat, lng },
        }
      });
    }
  }, [loc.address, onUpdate, dbZones]);

  const onMapLoad = useCallback((map) => {
    setMapInstance(map);
  }, []);

  const inputStyle = {
    width: '100%',
    background: '#1a1a1a',
    border: '1.5px solid #2a2a2a',
    borderRadius: '12px',
    padding: '13px 16px',
    color: '#ffffff',
    fontSize: '16px', // 16px prevents iOS auto-zoom
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  };

  return (
    <div>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
          {lang === 'es' ? 'Tu Ubicación de Servicio' : 'Your Service Location'}
        </h2>
        <p style={{ color: '#9a9a9a', fontSize: '0.95rem' }}>
          {lang === 'es'
            ? 'Ingresa tu dirección para ver disponibilidad y cargo de viaje'
            : 'Enter your address to check availability and travel fee'}
        </p>
      </div>

      {/* Two-column layout */}
      <div
        className="location-grid"
        style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: '1.5rem', alignItems: 'start' }}
      >
        {/* LEFT: Map */}
        <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #2a2a2a', height: '460px' }}>
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={markerPos || MAP_CENTER}
              zoom={MAP_ZOOM}
              options={{
                styles: DARK_STYLE,
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
              }}
              onLoad={onMapLoad}
              onClick={handleMapClick}
            >
              {/* Zone polygons */}
              {zoneConfigs.map((zone) => {
                const isActive = detectedZone?.id === zone.id;
                const colors = ZONE_COLORS[zone.id] || { color: '#888', fillColor: 'rgba(128,128,128,0.15)' };
                return (
                  <Polygon
                    key={zone.id}
                    paths={zone.polygon}
                    options={{
                      fillColor: zone.activo ? colors.color : '#555',
                      fillOpacity: isActive ? 0.35 : zone.activo ? 0.15 : 0.05,
                      strokeColor: zone.activo ? colors.color : '#555',
                      strokeOpacity: isActive ? 1 : zone.activo ? 0.5 : 0.2,
                      strokeWeight: isActive ? 3 : 1.5,
                      clickable: true,
                    }}
                    onClick={handleMapClick}
                  />
                );
              })}

              {/* Marker */}
              {markerPos && isLoaded && (
                <Marker
                  position={markerPos}
                  icon={{
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: detectedZone ? detectedZone.color : '#555',
                    fillOpacity: 1,
                    strokeColor: '#000',
                    strokeWeight: 2,
                  }}
                />
              )}
            </GoogleMap>
          ) : (
            <div style={{ width: '100%', height: '100%', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ color: '#555', fontSize: '0.9rem' }}>Loading map...</div>
            </div>
          )}
        </div>

        {/* RIGHT: Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Address input */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#9a9a9a', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
              {lang === 'es' ? 'Dirección del Servicio' : 'Service Address'}
            </label>
            <input
              ref={inputRef}
              type="text"
              defaultValue={loc.address || ''}
              placeholder={lang === 'es' ? 'Ingresa tu dirección...' : 'Enter your service address...'}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#FFD700'}
              onBlur={e => e.target.style.borderColor = '#2a2a2a'}
              disabled={!isLoaded}
            />
            <p style={{ fontSize: '0.75rem', color: '#555', marginTop: '6px' }}>
              {lang === 'es' ? 'O haz click directamente en el mapa' : 'Or click directly on the map'}
            </p>
          </div>

          {/* Result card */}
          {(outsideArea || inactiveZone) && !detectedZone ? (
            /* Outside or inactive zone */
            <div style={{ background: '#141414', border: '2px solid #FF3B00', borderRadius: '16px', padding: '1.25rem' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FF3B00', marginBottom: '8px' }}>
                ⚠️ {lang === 'es' ? 'Fuera del área de servicio' : 'Outside service area'}
              </div>
              <p style={{ fontSize: '0.82rem', color: '#9a9a9a', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                {lang === 'es'
                  ? 'Lo sentimos, esta área está fuera de nuestra cobertura actual. Llámanos para verificar disponibilidad.'
                  : 'Sorry, this area is currently outside our service coverage. Call us to check availability.'}
              </p>
              <a
                href={`tel:${CONTACT.phone}`}
                style={{ color: '#FFD700', fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none' }}
              >
                📞 {CONTACT.phone}
              </a>
            </div>
          ) : detectedZone ? (
            /* Zone detected */
            <div style={{ background: '#141414', border: `2px solid ${detectedZone.color}`, borderRadius: '16px', padding: '1.25rem' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9a9a9a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
                📍 {lang === 'es' ? 'Tu Zona de Servicio' : 'Your Service Zone'}
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                {lang === 'es' ? detectedZone.nameEs : detectedZone.nameEn}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4ade80', fontSize: '0.82rem', fontWeight: 600, marginBottom: '1rem' }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="7" fill="rgba(74,222,128,0.15)" />
                  <path d="M4 7l2 2 4-4" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {lang === 'es' ? 'Servicio disponible en tu zona' : 'Service available in your area'}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid #2a2a2a' }}>
                <span style={{ fontSize: '0.85rem', color: '#9a9a9a' }}>
                  {lang === 'es' ? 'Cargo de Viaje' : 'Travel Fee'}
                </span>
                <span style={{ fontSize: '1.3rem', fontWeight: 800, color: detectedZone.fee === 0 ? '#4ade80' : '#FFD700' }}>
                  {detectedZone.fee === 0 ? 'FREE' : `+$${detectedZone.fee}`}
                </span>
              </div>
            </div>
          ) : (
            /* Waiting for input */
            <div style={{ background: '#141414', border: '1px dashed #2a2a2a', borderRadius: '16px', padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>📍</div>
              <div style={{ color: '#555', fontSize: '0.85rem' }}>
                {lang === 'es'
                  ? 'Ingresa tu dirección o haz click en el mapa para detectar tu zona'
                  : 'Enter your address or click the map to detect your zone'}
              </div>
            </div>
          )}

          {/* Zone legend — only active zones */}
          <div style={{ background: '#141414', border: '1px solid #2a2a2a', borderRadius: '16px', padding: '1.25rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9a9a9a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
              {lang === 'es' ? 'Zonas de Servicio' : 'Service Zones'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {activeDbZones.length === 0 && (
                <div style={{ color: '#555', fontSize: '0.8rem', textAlign: 'center', padding: '0.5rem 0' }}>
                  {lang === 'es' ? 'No hay zonas activas' : 'No active zones'}
                </div>
              )}
              {activeDbZones.map(dbZone => {
                const colors = ZONE_COLORS[dbZone.zona] || { color: '#888', fillColor: 'rgba(128,128,128,0.15)' };
                const isActive = detectedZone?.id === dbZone.zona;
                return (
                  <div key={dbZone.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '6px 10px', borderRadius: '8px',
                    background: isActive ? colors.fillColor : 'transparent',
                    border: isActive ? `1px solid ${colors.color}` : '1px solid transparent',
                    transition: 'all 0.2s',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: colors.color, flexShrink: 0 }} />
                      <span style={{ fontSize: '0.8rem', color: isActive ? '#fff' : '#9a9a9a' }}>
                        {lang === 'es' ? dbZone.nombre_es : dbZone.nombre_en}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: dbZone.fee === 0 ? '#4ade80' : colors.color }}>
                      {dbZone.fee === 0 ? 'FREE' : `+$${dbZone.fee}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .location-grid { grid-template-columns: 1fr !important; }
        }
        /* Style Google autocomplete dropdown to match dark theme */
        .pac-container {
          background: #1a1a1a !important;
          border: 1px solid #2a2a2a !important;
          border-radius: 12px !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.6) !important;
          margin-top: 4px !important;
          font-family: inherit !important;
        }
        .pac-item {
          background: #1a1a1a !important;
          border-top: 1px solid #2a2a2a !important;
          color: #e0e0e0 !important;
          padding: 10px 14px !important;
          font-size: 0.85rem !important;
          cursor: pointer !important;
        }
        .pac-item:hover, .pac-item-selected {
          background: #252525 !important;
        }
        .pac-item-query {
          color: #FFD700 !important;
          font-size: 0.88rem !important;
        }
        .pac-matched { color: #FFD700 !important; }
        .pac-icon { display: none !important; }
      `}</style>
    </div>
  );
}
