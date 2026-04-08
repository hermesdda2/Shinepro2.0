import { useEffect } from 'react';
import { useLang } from '../LangContext';
import Footer from '../components/Footer';
import { Gavel, Clock, Truck, ShieldAlert } from 'lucide-react';

export default function Terms() {
  const { t } = useLang();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ background: 'var(--navy)', minHeight: '100vh', paddingTop: '120px' }}>
      <div className="container" style={{ maxWidth: '900px', marginBottom: '8rem' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '5rem', textAlign: 'center' }}>
          <div className="badge" style={{ marginBottom: '1.5rem' }}>{t.legal.title}</div>
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
            fontWeight: 900, 
            color: '#FFF', 
            marginBottom: '1rem',
            lineHeight: 1.1
          }}>
            {t.legal.termsTitle}
          </h1>
          <p style={{ color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.1em', fontSize: '0.85rem' }}>
            {t.legal.lastUpdated}
          </p>
        </div>

        {/* Content Section */}
        <div style={{ 
          background: 'var(--surface)', 
          padding: '4rem', 
          borderRadius: '32px', 
          border: '1px solid rgba(255, 212, 0, 0.05)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.3)'
        }}>
          
          <div style={{ marginBottom: '4rem' }}>
             <p style={{ color: '#FFF', fontSize: '1.15rem', lineHeight: 1.8, marginBottom: '2.5rem', opacity: 0.9 }}>
              {t.legal.termsIntro}
             </p>
          </div>

          <div style={{ display: 'grid', gap: '3.5rem' }}>
            
            {/* Cancellations */}
            <div style={{ display: 'flex', gap: '2rem' }}>
              <div style={{ 
                flexShrink: 0, width: '60px', height: '60px', borderRadius: '18px', 
                background: 'rgba(255,212,0,0.08)', display: 'flex', alignItems: 'center', 
                justifyContent: 'center', border: '1px solid rgba(255,212,0,0.1)' 
              }}>
                <Clock color="var(--primary)" size={28} />
              </div>
              <div>
                <h3 style={{ color: '#FFF', fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem' }}>
                  {t.legal.cancellations}
                </h3>
                <p style={{ color: '#8B9AB3', fontSize: '1rem', lineHeight: 1.7 }}>
                  {t.legal.cancellationsDesc}
                </p>
              </div>
            </div>

            {/* Excessive Dirtiness */}
            <div style={{ display: 'flex', gap: '2rem' }}>
              <div style={{ 
                flexShrink: 0, width: '60px', height: '60px', borderRadius: '18px', 
                background: 'rgba(255,212,0,0.08)', display: 'flex', alignItems: 'center', 
                justifyContent: 'center', border: '1px solid rgba(255,212,0,0.1)' 
              }}>
                <ShieldAlert color="var(--primary)" size={28} />
              </div>
              <div>
                <h3 style={{ color: '#FFF', fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem' }}>
                  {t.legal.conditionTitle}
                </h3>
                <p style={{ color: '#8B9AB3', fontSize: '1rem', lineHeight: 1.7 }}>
                  {t.legal.conditionDesc}
                </p>
              </div>
            </div>

            {/* Travel Fees */}
            <div style={{ display: 'flex', gap: '2rem' }}>
              <div style={{ 
                flexShrink: 0, width: '60px', height: '60px', borderRadius: '18px', 
                background: 'rgba(255,212,0,0.08)', display: 'flex', alignItems: 'center', 
                justifyContent: 'center', border: '1px solid rgba(255,212,0,0.1)' 
              }}>
                <Truck color="var(--primary)" size={28} />
              </div>
              <div>
                <h3 style={{ color: '#FFF', fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem' }}>
                  {t.legal.travelTitle}
                </h3>
                <p style={{ color: '#8B9AB3', fontSize: '1rem', lineHeight: 1.7 }}>
                  {t.legal.travelDesc}
                </p>
              </div>
            </div>

            {/* Liability */}
            <div style={{ display: 'flex', gap: '2rem' }}>
              <div style={{ 
                flexShrink: 0, width: '60px', height: '60px', borderRadius: '18px', 
                background: 'rgba(255,212,0,0.08)', display: 'flex', alignItems: 'center', 
                justifyContent: 'center', border: '1px solid rgba(255,212,0,0.1)' 
              }}>
                <Gavel color="var(--primary)" size={28} />
              </div>
              <div>
                <h3 style={{ color: '#FFF', fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem' }}>
                  {t.legal.liabilityTitle}
                </h3>
                <p style={{ color: '#8B9AB3', fontSize: '1rem', lineHeight: 1.7 }}>
                  {t.legal.liabilityDesc}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}


