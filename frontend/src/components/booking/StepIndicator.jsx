import { useState, useEffect } from 'react';
import { useLang } from '../../LangContext';

const STEPS_EN = ['Vehicle', 'Package', 'Add-Ons', 'Details', 'Review'];
const STEPS_ES = ['Vehículo', 'Paquete', 'Extras', 'Datos', 'Resumen'];

export default function StepIndicator({ currentStep }) {
  const { lang } = useLang();
  const steps = lang === 'es' ? STEPS_ES : STEPS_EN;
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const circleSize = isMobile ? '28px' : '38px';
  const iconSize = isMobile ? 12 : 16;
  const fontSize = isMobile ? '0.75rem' : '0.9rem';
  const labelSize = isMobile ? '0.55rem' : '0.65rem';
  const connectorMargin = isMobile ? '0 4px' : '0 8px';

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', padding: isMobile ? '0 0.5rem' : '0 1rem' }}>
      {steps.map((label, idx) => {
        const stepNum = idx + 1;
        const isCompleted = stepNum < currentStep;
        const isActive = stepNum === currentStep;

        return (
          <div key={stepNum} style={{ display: 'flex', alignItems: 'center', flex: idx < steps.length - 1 ? 1 : 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div style={{
                width: circleSize, height: circleSize, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize,
                background: isCompleted || isActive ? '#FFD700' : '#2a2a2a',
                color: isCompleted || isActive ? '#000000' : '#9a9a9a',
                boxShadow: isActive ? '0 0 0 3px rgba(255,215,0,0.25)' : 'none',
                transition: 'all 0.3s ease',
                flexShrink: 0,
              }}>
                {isCompleted ? (
                  <svg width={iconSize} height={iconSize} viewBox="0 0 16 16" fill="none">
                    <path d="M3 8l3.5 3.5L13 5" stroke="#000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : stepNum}
              </div>
              <span style={{
                fontSize: labelSize, fontWeight: 600, letterSpacing: '0.04em',
                color: isCompleted || isActive ? '#FFD700' : '#555555',
                textTransform: 'uppercase', whiteSpace: 'nowrap',
                transition: 'color 0.3s ease',
              }}>
                {label}
              </span>
            </div>

            {idx < steps.length - 1 && (
              <div style={{
                flex: 1, height: '2px', margin: connectorMargin, marginBottom: isMobile ? '16px' : '18px',
                background: isCompleted ? '#FFD700' : '#2a2a2a',
                transition: 'background 0.3s ease',
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}
