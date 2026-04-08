import { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../LangContext';
import { COMPANY_INFO } from '../data';
import {
  Star, Check, Phone, Mail, MapPin, Clock,
  Car, Sparkles, Shield, Leaf, Zap, ChevronRight,
  Droplets, Wind, Award, ChevronLeft,
  ArrowRight
} from 'lucide-react';
import Footer from '../components/Footer';

const arrowStyle = {
  width: 44, height: 44, borderRadius: '50%',
  background: 'rgba(255,212,0,0.1)', border: '1px solid var(--primary)',
  color: 'var(--primary)', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  transition: 'all 0.3s'
};

// ==============================
//  PARTNERS MARQUEE
// ==============================
function Partners() {
  const brands = [
    { name: 'HONDA', logo: '/brands/honda.svg' },
    { name: "MEGUIAR'S", logo: '/brands/meguiars.png', useLocal: true },
    { name: 'CHEMICAL GUYS', logo: '/brands/chemical.svg' },
    { name: 'KOCH CHEMIE', logo: '/brands/koch.svg' },
    { name: 'GYEON QUARTZ', logo: '/brands/gyeon.svg' },
    { name: 'CARPRO', logo: '/brands/carpro.svg' },
    { name: 'NORSTYLE STUDIO', logo: '/brands/norstyle.svg' },
    { name: 'ARCHI', logo: '/brands/archi.svg' },
    { name: 'MARJALA', logo: '/brands/marjala.svg' },
    { name: 'H/S DESIGN STUDIO', logo: '/brands/hs_design.svg' },
    { name: "ADAM'S POLISHES", logo: '/brands/adams.svg' },
    { name: "RUPES", logo: '/brands/rupes.svg' },
  ];

  return (
    <div style={{
      background: '#07090D',
      height: '45px',
      borderTop: '1px solid rgba(255,212,0,0.08)',
      borderBottom: '1px solid rgba(255,212,0,0.08)',
      overflow: 'hidden',
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    }}>
      <div style={{
        display: 'flex',
        width: 'max-content',
        animation: 'marquee 50s linear infinite'
      }}>
        {[...brands, ...brands, ...brands, ...brands].map((b, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            margin: '0 2.5rem',
            opacity: 0.8,
            transition: 'opacity 0.4s ease',
            whiteSpace: 'nowrap'
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = 1}
            onMouseLeave={e => e.currentTarget.style.opacity = 0.8}
          >
            <Sparkles size={12} color="var(--primary)" fill="var(--primary)" style={{ opacity: 0.8 }} />
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              color: '#FFF',
              letterSpacing: '0.15em',
              fontFamily: 'Outfit, sans-serif'
            }}>
              {b.name}
            </span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-25%); }
        }
      `}</style>
    </div>
  );
}

function TrustBadge() {
  return (
    <div className="animate-fade-up" style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.75rem',
      background: 'rgba(255,255,255,0.03)',
      padding: '0.5rem 1rem',
      borderRadius: '50px',
      border: '1px solid rgba(255,212,0,0.15)',
      marginBottom: '2rem'
    }}>
      <div style={{ display: 'flex', gap: '2px' }}>
        {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="var(--primary)" color="var(--primary)" />)}
      </div>
      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#FFF', letterSpacing: '0.05em' }}>
        5.0 GOOGLE RATING
      </span>
    </div>
  );
}

// ==============================
//  BENEFIT BAR (Trust Highlight)
// ==============================
function BenefitBar() {
  useLang();
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768);
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);

  const items = [
    { icon: <MapPin size={20} />, text: 'WE COME TO YOU' },
    { icon: <Leaf size={20} />, text: 'ECO-FRIENDLY PRODUCTS' },
    { icon: <Award size={20} />, text: 'CERTIFIED DETAILERS' },
    { icon: <Check size={20} />, text: 'SATISFACTION GUARANTEED' },
  ];

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (!isMobile) return;
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % items.length);
        setVisible(true);
      }, 400);
    }, 2500);
    return () => clearInterval(timer);
  }, [isMobile, items.length]);

  const goTo = (i) => {
    if (i === current) return;
    setVisible(false);
    setTimeout(() => { setCurrent(i); setVisible(true); }, 400);
  };

  if (isMobile) {
    return (
      <div style={{ background: 'var(--navy-light)', borderBottom: '1px solid rgba(255,212,0,0.05)', padding: '1.25rem 1rem' }}>
        {/* Slide */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '0.75rem', height: '28px',
          opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease',
        }}>
          <div style={{ color: '#FFD700' }}>{items[current].icon}</div>
          <span style={{
            fontSize: '0.85rem', fontWeight: 700, color: '#fff',
            letterSpacing: '2px', textTransform: 'uppercase',
          }}>{items[current].text}</span>
        </div>
        {/* Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '0.75rem' }}>
          {items.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} style={{
              width: i === current ? 18 : 6, height: 6, borderRadius: 3,
              background: i === current ? '#FFD700' : '#444',
              border: 'none', cursor: 'pointer', padding: 0,
              transition: 'all 0.3s ease',
            }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--navy-light)', padding: '1.25rem 0', borderBottom: '1px solid rgba(255,212,0,0.05)' }}>
      <div className="container" style={{
        display: 'flex', flexWrap: 'wrap',
        alignItems: 'center', justifyContent: 'center', gap: '2.5rem 5rem',
      }}>
        {items.map((b, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ color: 'var(--primary)' }}>{b.icon}</div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#A0ABC0', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{b.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==============================
//  MOBILE HERO SLIDER
// ==============================
function MobileHeroSlider({ lang, images }) {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % images.length);
        setFading(false);
      }, 800);
    }, 3000);
    return () => clearInterval(timer);
  }, [images.length]);

  const goTo = (i) => {
    if (i === current) return;
    setFading(true);
    setTimeout(() => { setCurrent(i); setFading(false); }, 800);
  };

  return (
    <div id="hero-scroll-container" style={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden' }}>
      {/* Slides */}
      {images.map((src, i) => (
        <div key={i} style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${src})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: i === current ? (fading ? 0 : 1) : 0,
          transition: 'opacity 0.8s ease',
          zIndex: i === current ? 1 : 0,
        }} />
      ))}

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6))',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 3,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '0 24px',
      }}>
        <img src="/logo.png" alt="Shine Pro" style={{ width: 70, marginBottom: '1.25rem' }} />
        <h1 style={{
          fontSize: '2rem', fontWeight: 800, color: '#fff',
          lineHeight: 1.15, marginBottom: '0.75rem',
          textShadow: '0 2px 16px rgba(0,0,0,0.6)',
        }}>
          {lang === 'es' ? 'Tu Auto Merece lo Mejor' : 'Your Car Deserves the Best'}
        </h1>
        <p style={{
          fontSize: '0.95rem', color: '#e0e0e0', lineHeight: 1.6,
          marginBottom: '2rem', textShadow: '0 1px 8px rgba(0,0,0,0.5)',
        }}>
          {lang === 'es'
            ? 'Detallado profesional a domicilio en Orange County'
            : 'Professional mobile detailing at your doorstep'}
        </p>
        <Link
          to="/booking"
          style={{
            display: 'inline-block', background: '#FFD700', color: '#000',
            fontWeight: 800, fontSize: '1rem', padding: '14px 40px',
            borderRadius: '50px', textDecoration: 'none',
            letterSpacing: '0.04em', boxShadow: '0 4px 24px rgba(255,215,0,0.4)',
          }}
        >
          {lang === 'es' ? 'Reservar Ahora' : 'Book Now'}
        </Link>
      </div>

      {/* Dot indicators */}
      <div style={{
        position: 'absolute', bottom: '2rem', left: '50%',
        transform: 'translateX(-50%)', zIndex: 4,
        display: 'flex', gap: '8px',
      }}>
        {images.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} style={{
            width: i === current ? 22 : 8,
            height: 8, borderRadius: 4,
            background: i === current ? '#FFD700' : '#555',
            border: 'none', cursor: 'pointer', padding: 0,
            transition: 'all 0.3s ease',
          }} />
        ))}
      </div>
    </div>
  );
}

// ==============================
//  HERO SECTION
// ==============================
const DESKTOP_FRAMES = 67;
const DESKTOP_FOLDER = '/Hero Shine Pro 3.0-jpg/';
const MOBILE_FRAMES = 46;
const MOBILE_FOLDER = '/Hero Vertical2.0/';

function padded(n) {
  return String(n).padStart(3, '0');
}

function Hero() {
  const { lang } = useLang();
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef(null);

  const [loadedCount, setLoadedCount] = useState(0);
  const [allLoaded, setAllLoaded] = useState(false);
  const [frameProgress, setFrameProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ── Preload frames (switches set on isMobile) ────────────────
  useEffect(() => {
    const totalFrames = isMobile ? MOBILE_FRAMES : DESKTOP_FRAMES;
    const folder = isMobile ? MOBILE_FOLDER : DESKTOP_FOLDER;
    const images = [];
    let loaded = 0;

    imagesRef.current = [];
    setLoadedCount(0);
    setAllLoaded(false);
    currentFrameRef.current = 0;
    setFrameProgress(0);

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      img.src = `${folder}ezgif-frame-${padded(i)}.jpg`;
      img.onload = () => {
        loaded++;
        setLoadedCount(loaded);
        if (loaded === images.length) setAllLoaded(true);
      };
      img.onerror = () => {
        loaded++;
        setLoadedCount(loaded);
        if (loaded === images.length) setAllLoaded(true);
      };
      images.push(img);
    }
    imagesRef.current = images;
  }, [isMobile]);

  // ── Draw frame on canvas (cover-fit for both orientations) ───
  const drawFrame = useCallback((index) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img || !img.complete) return;

    const ctx = canvas.getContext('2d');
    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;
    if (!iw || !ih) return;

    // Cover-fit: fills canvas while preserving aspect ratio
    const scale = Math.max(cw / iw, ch / ih);
    const sw = iw * scale;
    const sh = ih * scale;
    const sx = (cw - sw) / 2;
    const sy = (ch - sh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, sx, sy, sw, sh);
  }, []);

  // ── Resize canvas to viewport ────────────────────────────────
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawFrame(currentFrameRef.current);
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [drawFrame, allLoaded]);

  // ── Scroll → frame ───────────────────────────────────────────
  useEffect(() => {
    if (!allLoaded) return;
    drawFrame(0);

    const handleScroll = () => {
      const scrollEl = document.getElementById('hero-scroll-container');
      if (!scrollEl) return;

      const rect = scrollEl.getBoundingClientRect();
      const scrollableHeight = scrollEl.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const progress = Math.min(1, scrolled / scrollableHeight);

      const totalImages = imagesRef.current.length;
      const targetFrame = Math.min(totalImages - 1, Math.floor(progress * (totalImages - 1)));

      setFrameProgress(progress);

      if (targetFrame !== currentFrameRef.current) {
        currentFrameRef.current = targetFrame;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => drawFrame(targetFrame));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [allLoaded, drawFrame]);

  // ── Text opacity stages ──────────────────────────────────────
  // Mobile: logo at 15/46≈0.30, full text at 36/46≈0.76
  // Desktop: same thresholds work well
  const logoOpacity = frameProgress > 0.30 ? Math.min(1, (frameProgress - 0.30) / 0.15) : 0;
  const textOpacity = frameProgress > 0.76 ? Math.min(1, (frameProgress - 0.76) / 0.12) : 0;

  const loadPct = Math.round((loadedCount / (isMobile ? MOBILE_FRAMES : DESKTOP_FRAMES)) * 100);

  return (
    <div id="hero-scroll-container" style={{ height: '400vh', position: 'relative' }}>

      {/* Sticky canvas area */}
      <div style={{ position: 'sticky', top: 0, width: '100%', height: '100vh', overflow: 'hidden' }}>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            display: 'block',
            willChange: 'transform',
            imageRendering: 'crisp-edges',
          }}
        />

        {/* Dark gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.75) 100%)',
          pointerEvents: 'none',
        }} />


        {/* Text overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'flex-end',
          paddingBottom: '10vh',
          pointerEvents: textOpacity > 0 ? 'auto' : 'none',
        }}>
          {/* Logo tagline */}
          <div style={{
            opacity: logoOpacity,
            transition: 'opacity 0.3s ease',
            marginBottom: '1rem',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.7rem', color: '#FFD700', letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 700 }}>
              SHINE PRO · MOBILE AUTO SPA
            </div>
          </div>

          {/* Main text */}
          <div style={{
            opacity: textOpacity,
            transform: `translateY(${(1 - textOpacity) * 20}px)`,
            transition: 'opacity 0.4s ease, transform 0.4s ease',
            textAlign: 'center',
            padding: isMobile ? '0 20px' : '0 1.5rem',
          }}>
            <h1 style={{
              fontSize: isMobile ? '2rem' : 'clamp(2.2rem, 6vw, 4rem)',
              fontWeight: 800, color: '#ffffff', lineHeight: 1.1,
              marginBottom: '1rem', textShadow: '0 2px 20px rgba(0,0,0,0.5)',
            }}>
              {lang === 'es' ? 'Tu Auto Merece lo Mejor' : 'Your Car Deserves the Best'}
            </h1>
            <p style={{
              fontSize: isMobile ? '0.95rem' : 'clamp(1rem, 2.5vw, 1.2rem)',
              color: '#e0e0e0', margin: '0 auto 2rem', maxWidth: '560px',
              lineHeight: 1.6, textShadow: '0 1px 8px rgba(0,0,0,0.5)',
            }}>
              {lang === 'es'
                ? 'Detallado profesional a domicilio en Orange County'
                : 'Professional mobile detailing at your doorstep'}
            </p>
            {!isMobile && (
              <Link
                to="/booking"
                style={{
                  display: 'inline-block', background: '#FFD700', color: '#000',
                  fontWeight: 800, fontSize: '1rem', padding: '14px 40px',
                  borderRadius: '50px', textDecoration: 'none',
                  letterSpacing: '0.04em', boxShadow: '0 4px 24px rgba(255,215,0,0.4)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#FFC200'; e.currentTarget.style.transform = 'scale(1.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#FFD700'; e.currentTarget.style.transform = 'scale(1)'; }}
              >
                {lang === 'es' ? 'Reservar Ahora' : 'Book Now'}
              </Link>
            )}
          </div>
        </div>

        {/* Scroll hint — visible only at start */}
        <div style={{
          position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
          opacity: frameProgress < 0.1 ? 1 - frameProgress * 10 : 0,
          transition: 'opacity 0.3s',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
          pointerEvents: 'none',
        }}>
          <span style={{ fontSize: '0.7rem', color: '#9a9a9a', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            {lang === 'es' ? 'Desplázate' : 'Scroll'}
          </span>
          <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, #FFD700, transparent)' }} />
        </div>

      </div>
    </div>
  );
}

// ==============================
//  COMPARISON SECTION (Before/After)
// ==============================
function Comparison() {
  const { t } = useLang();
  const [sliderPos, setSliderPos] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const updateWidth = () => setContainerWidth(containerRef.current.offsetWidth);
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handleMove = (e) => {
    if (!isResizing && e.type !== 'touchmove') return;
    if (!containerRef.current) return;
    const container = containerRef.current.getBoundingClientRect();
    const x = (e.pageX || e.touches[0].pageX) - container.left;
    const position = Math.max(0, Math.min(100, (x / container.width) * 100));
    setSliderPos(position);
  };

  return (
    <section id="results" style={{ padding: '8rem 0', background: 'var(--navy)', position: 'relative', overflow: 'hidden' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>

          {/* Text Content */}
          <div className="animate-fade-up comparison-text">
            <div className="badge" style={{ marginBottom: '1.5rem' }}>{t.comparison.badge}</div>
            <h2 className="section-title" style={{ textAlign: 'left', margin: 0 }}>
              {t.comparison.title}<br />
              <span className="text-glow">{t.comparison.titleSpan}</span>
            </h2>
            <p style={{ color: '#8B9AB3', fontSize: '1.05rem', marginTop: '1.5rem', lineHeight: 1.6, maxWidth: '100%' }}>
              {t.comparison.subtitle}
            </p>

            <div className="comparison-stats" style={{ display: 'flex', gap: '2rem', marginTop: '3rem' }}>
              <div>
                <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '2.5rem' }}>100%</div>
                <div style={{ color: '#8B9AB3', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 600 }}>{t.comparison.visibleResults}</div>
              </div>
              <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '2rem' }}>
                <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '2.5rem' }}>0%</div>
                <div style={{ color: '#8B9AB3', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 600 }}>{t.comparison.effortRequired}</div>
              </div>
            </div>
          </div>

          {/* Slider Content */}
          <div
            ref={containerRef}
            className="animate-fade-up"
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '4/3',
              maxWidth: '600px',
              margin: '0 auto',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
              cursor: 'col-resize',
              userSelect: 'none',
              touchAction: 'none',
              border: '1px solid rgba(255,212,0,0.1)',
              background: '#0A0D14'
            }}
            onMouseMove={handleMove}
            onTouchMove={handleMove}
            onMouseDown={() => setIsResizing(true)}
            onMouseUp={() => setIsResizing(false)}
            onMouseLeave={() => setIsResizing(false)}
          >
            {/* After Image (Background, Clean) */}
            <img
              src="/after.jpg"
              alt="Clean Car"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div style={{
              position: 'absolute', bottom: 20, right: 20,
              background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)',
              padding: '8px 18px', borderRadius: '50px',
              color: '#FFF', fontSize: '0.82rem', fontWeight: 800,
              zIndex: 10, pointerEvents: 'none', border: '1px solid rgba(255,255,255,0.15)',
              textTransform: 'uppercase', letterSpacing: '0.05em'
            }}>
              {t.comparison.labels.after}
            </div>

            {/* Before Image (Overlay, Dirty) */}
            <div style={{
              position: 'absolute', top: 0, left: 0, height: '100%',
              width: `${sliderPos}%`, overflow: 'hidden',
              borderRight: '3px solid var(--primary)',
              zIndex: 5
            }}>
              <img
                src="/before.jpg"
                alt="Dirty Car"
                style={{
                  width: containerWidth || '600px',
                  height: '100%',
                  objectFit: 'cover',
                  maxWidth: 'none',
                  position: 'absolute', top: 0, left: 0
                }}
              />
              <div style={{
                position: 'absolute', bottom: 20, left: 20,
                background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)',
                padding: '8px 18px', borderRadius: '50px',
                color: '#FFF', fontSize: '0.82rem', fontWeight: 800,
                zIndex: 10, pointerEvents: 'none', border: '1px solid rgba(255,255,255,0.15)',
                textTransform: 'uppercase', letterSpacing: '0.05em'
              }}>
                {t.comparison.labels.before}
              </div>
            </div>

            {/* Handle */}
            <div style={{
              position: 'absolute', top: 0, bottom: 0, left: `${sliderPos}%`,
              width: 2, background: 'var(--primary)', zIndex: 20,
              transform: 'translateX(-50%)'
            }}>
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 54, height: 54, borderRadius: '50%',
                background: 'var(--primary)', color: '#000',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 25px var(--primary)',
              }}>
                <div style={{ display: 'flex', gap: 2 }}>
                  <ChevronLeft size={20} strokeWidth={4} />
                  <ChevronRight size={20} strokeWidth={4} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .comparison-text {
            text-align: center !important;
          }
          .comparison-text .section-title {
            text-align: center !important;
          }
          .comparison-stats {
            justify-content: center !important;
          }
        }
      `}</style>
    </section>
  );
}
// ==============================
//  SERVICES SECTION (With Mobile Slider)
// ==============================
function Services() {
  const { t } = useLang();
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768);
  const [current, setCurrent] = useState(0);

  const servicesData = [
    { ...t.services.items.exterior, icon: <Droplets size={28} color="var(--primary)" /> },
    { ...t.services.items.interior, icon: <Wind size={28} color="var(--primary)" /> },
    { ...t.services.items.engine, icon: <Zap size={28} color="var(--primary)" /> },
    { ...t.services.items.headlights, icon: <Sparkles size={28} color="var(--primary)" /> }
  ];

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const svc = servicesData[current];

  return (
    <section id="services" className="section" style={{ background: 'var(--navy-light)', overflow: 'hidden' }}>
      <div className="container">
        <div className="section-header">
          <span className="badge">{t.services.badge}</span>
          <h2 style={{ color: '#FFF' }}>
            {t.services.title} <span className="gradient-text">{t.services.titleSpan}</span>
          </h2>
          <p>{t.services.subtitle}</p>
        </div>

        {isMobile ? (
          /* ── Mobile: one card centered + dot nav ── */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="card" style={{
              width: '85%', borderTop: '4px solid var(--primary)',
              padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column',
              alignItems: 'center', textAlign: 'center',
              height: '380px', overflow: 'hidden',
            }}>
              <div style={{
                width: 60, height: 60, borderRadius: '50%',
                background: 'var(--surface-2)', border: '1px solid rgba(255,212,0,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1.5rem', boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
              }}>
                {svc.icon}
              </div>
              <h3 style={{ color: '#FFF', fontSize: '1.4rem', fontWeight: 900, marginBottom: '1rem', textTransform: 'uppercase' }}>{svc.title}</h3>
              <p style={{ color: '#8B9AB3', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '2rem' }}>{svc.desc}</p>
              <a href="/booking" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 800, textDecoration: 'none', fontSize: '0.9rem' }}>
                {t.hero.cta} <ArrowRight size={16} />
              </a>
            </div>
            {/* Dots */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '1.5rem' }}>
              {servicesData.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)} style={{
                  width: i === current ? 20 : 8, height: 8, borderRadius: 4,
                  background: i === current ? '#FFD700' : '#444',
                  border: 'none', cursor: 'pointer', padding: 0,
                  transition: 'all 0.3s ease',
                }} />
              ))}
            </div>
            {/* Arrows */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button onClick={() => setCurrent(p => (p - 1 + servicesData.length) % servicesData.length)} style={arrowStyle}><ChevronLeft size={20} /></button>
              <button onClick={() => setCurrent(p => (p + 1) % servicesData.length)} style={arrowStyle}><ChevronRight size={20} /></button>
            </div>
          </div>
        ) : (
          /* ── Desktop: 4-column grid ── */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', width: '100%' }}>
            {servicesData.map((s, i) => (
              <div key={i} className="card animate-fade-up" style={{
                cursor: 'default', borderTop: '4px solid var(--primary)',
                animationDelay: `${i * 0.15}s`, padding: '2rem 1rem',
                minWidth: 0, display: 'flex', flexDirection: 'column',
                minHeight: '360px',
              }}>
                <div style={{
                  width: 60, height: 60, borderRadius: '50%',
                  background: 'var(--surface-2)', border: '1px solid rgba(255,212,0,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '1.5rem', boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
                }}>
                  {s.icon}
                </div>
                <h3 style={{ color: '#FFF', fontSize: '1.4rem', fontWeight: 900, marginBottom: '1rem', textTransform: 'uppercase' }}>{s.title}</h3>
                <p style={{ color: '#8B9AB3', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '2.5rem', flexGrow: 1 }}>{s.desc}</p>
                <a href="/booking" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 800, textDecoration: 'none', fontSize: '0.9rem', marginTop: 'auto' }}>
                  {t.hero.cta} <ArrowRight size={16} />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ==============================
//  VEHICLE SELECTION COMPONENT
// ==============================
function VehicleCard({ tab, active, onClick }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <button
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className="mobile-slider-item"
      style={{
        position: 'relative',
        background: active ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
        color: active ? '#000' : '#FFF',
        border: active ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 16, padding: '2rem 1rem',
        cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        boxShadow: active
          ? '0 15px 40px rgba(0,0,0,0.5), 0 0 25px rgba(255, 212, 0, 0.25)'
          : (opacity > 0 ? '0 10px 30px rgba(0,0,0,0.3), 0 0 15px rgba(255, 212, 0, 0.1)' : 'none'),
        transform: active ? 'scale(1.02) translateY(-4px)' : (opacity > 0 ? 'translateY(-2px)' : 'none'),
        minWidth: '150px'
      }}
    >
      {!active && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          opacity, transition: 'opacity 0.3s',
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 212, 0, 0.15), transparent 80%)`,
          zIndex: 1
        }} />
      )}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img src={tab.img} alt={tab.label} style={{ height: '75px', objectFit: 'contain', marginBottom: '1.25rem', opacity: active ? 1 : 0.7, transform: active ? 'scale(1.1)' : 'scale(1)', transition: 'transform 0.3s' }} />
        <span style={{ fontWeight: 900, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{tab.label}</span>
      </div>
    </button>
  );
}

// ==============================
//  PACKAGES SECTION (With Mobile Slider)
// ==============================
function Packages() {
  const { t } = useLang();
  const initMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const [isMobile, setIsMobile] = useState(initMobile);
  const [active, setActive] = useState(initMobile ? null : 'small_sedan');
  const [visible, setVisible] = useState(!initMobile);
  const [sliderIdx, setSliderIdx] = useState(0); // mobile vehicle slider index
  const [pkgIdx, setPkgIdx] = useState(0);        // mobile package slider index
  const packagesRef = useRef(null);
  const touchStartX = useRef(null);
  const pkgTouchStartX = useRef(null);

  const tabs = [
    { key: 'small_sedan', label: t.packages.vehicleTabs.small_sedan, img: "/cars/small-sedan.png" },
    { key: 'small_pickup', label: t.packages.vehicleTabs.small_pickup, img: "/cars/small-pickup.png" },
    { key: 'mid_size', label: t.packages.vehicleTabs.mid_size, img: "/cars/midsize.png" },
    { key: 'full_size', label: t.packages.vehicleTabs.full_size, img: "/cars/fullsize.png" },
  ];

  const pkgs = active ? (t.packages.data[active] || t.packages.data.small_sedan) : [];

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile && active === null) { setActive('small_sedan'); setVisible(true); }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [active]);

  const selectVehicle = (key) => {
    if (active === key) return;
    setPkgIdx(0); // reset package slider on vehicle change
    if (active !== null) {
      setVisible(false);
      setTimeout(() => { setActive(key); setVisible(true); }, 250);
    } else {
      setActive(key);
      setTimeout(() => {
        setVisible(true);
        if (isMobile) setTimeout(() => packagesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      }, 50);
    }
  };

  const handlePkgTouchStart = (e) => { pkgTouchStartX.current = e.touches[0].clientX; };
  const handlePkgTouchEnd = (e) => {
    if (pkgTouchStartX.current === null) return;
    const diff = pkgTouchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) setPkgIdx(p => (p + (diff > 0 ? 1 : -1) + pkgs.length) % pkgs.length);
    pkgTouchStartX.current = null;
  };

  // Mobile slider navigation — also triggers selectVehicle
  const goToSlide = (idx) => {
    const clamped = Math.max(0, Math.min(tabs.length - 1, idx));
    setSliderIdx(clamped);
    selectVehicle(tabs[clamped].key);
  };

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goToSlide(sliderIdx + (diff > 0 ? 1 : -1));
    touchStartX.current = null;
  };

  return (
    <section id="packages" className="section" style={{ background: 'var(--surface)' }}>
      <div className="container">
        <div className="section-header">
          <span className="badge" style={{ background: '#000', border: '1px solid var(--primary)' }}>{t.packages.badge}</span>
          <h2 style={{ color: '#FFF' }}>
            {t.packages.title} <span className="gradient-text">{t.packages.titleSpan}</span>
          </h2>
          <p>{t.packages.subtitle}</p>
          <Link to="/terms" style={{ color: '#8B9AB3', fontSize: '0.8rem', textDecoration: 'none', fontStyle: 'italic', display: 'block', marginTop: '1rem' }}>
            {t.footer.termsApply}
          </Link>
        </div>

        {/* Vehicle selector */}
        {isMobile ? (
          /* ── Mobile: 1-card slider ── */
          <div style={{ marginBottom: '2rem' }}>
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}
            >
              <button
                onClick={() => goToSlide(sliderIdx)}
                style={{
                  width: '85%', borderRadius: 16, padding: '1.5rem 1rem',
                  background: '#FFD700', color: '#000',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 24px rgba(255,212,0,0.3)',
                }}
              >
                <img src={tabs[sliderIdx].img} alt={tabs[sliderIdx].label} style={{ height: 70, objectFit: 'contain', marginBottom: '0.75rem' }} />
                <span style={{ fontWeight: 900, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {tabs[sliderIdx].label}
                </span>
              </button>
            </div>
            {/* Nav row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              <button onClick={() => goToSlide(sliderIdx - 1)} style={arrowStyle}><ChevronLeft size={20} /></button>
              <div style={{ display: 'flex', gap: '6px' }}>
                {tabs.map((_, i) => (
                  <button key={i} onClick={() => goToSlide(i)} style={{
                    width: i === sliderIdx ? 20 : 8, height: 8, borderRadius: 4,
                    background: i === sliderIdx ? '#FFD700' : '#444',
                    border: 'none', cursor: 'pointer', padding: 0,
                    transition: 'all 0.3s ease',
                  }} />
                ))}
              </div>
              <button onClick={() => goToSlide(sliderIdx + 1)} style={arrowStyle}><ChevronRight size={20} /></button>
            </div>
          </div>
        ) : (
          /* ── Desktop: 4-col grid ── */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            {tabs.map(tab => (
              <VehicleCard key={tab.key} tab={tab} active={active === tab.key} onClick={() => selectVehicle(tab.key)} />
            ))}
          </div>
        )}

        {/* Hint when nothing selected — mobile only */}
        {isMobile && !active && (
          <div style={{ textAlign: 'center', padding: '2rem 0 1rem' }}>
            <p style={{ color: '#9a9a9a', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
              Select your vehicle to see pricing
            </p>
            <div style={{ animation: 'bounce 1.5s ease-in-out infinite', display: 'inline-block', color: 'var(--primary)', fontSize: '1.5rem' }}>↓</div>
          </div>
        )}

        {/* Packages — revealed after selection */}
        <div
          ref={packagesRef}
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 400ms ease, transform 400ms ease',
            pointerEvents: visible ? 'auto' : 'none',
            marginTop: active ? '2rem' : 0,
            height: active ? 'auto' : 0,
            overflow: active ? 'visible' : 'hidden',
          }}
        >
          {isMobile ? (
            /* ── Mobile: 1 package card at a time ── */
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
              {pkgs.length > 0 && (() => {
                const pkg = pkgs[pkgIdx % pkgs.length];
                return (
                  <div
                    key={`${active}-${pkgIdx}`}
                    onTouchStart={handlePkgTouchStart}
                    onTouchEnd={handlePkgTouchEnd}
                    className={`card ${pkg.popular ? 'popular-card' : ''}`}
                    style={{
                      width: '85%', borderRadius: 24, padding: '2.5rem 2rem',
                      background: 'var(--navy-light)', border: '1px solid rgba(255,255,255,0.03)',
                      position: 'relative',
                    }}
                  >
                    {pkg.popular && (
                      <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--primary)', color: '#000', fontSize: '0.7rem', fontWeight: 900, padding: '6px 16px', borderBottomLeftRadius: 16, zIndex: 10, textTransform: 'uppercase' }}>
                        {t.packages.popular}
                      </div>
                    )}
                    <h3 style={{ color: '#FFF', fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>{pkg.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: '#8B9AB3', fontSize: '0.9rem' }}>
                      <Clock size={16} color="var(--primary)" /> {pkg.duration}
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '1.5rem' }}>${pkg.price}</div>
                    <div style={{ marginBottom: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
                      {pkg.features.map((f, j) => (
                        <div key={j} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
                          <Check size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
                          <span style={{ color: '#E8EDF5', fontSize: '0.88rem' }}>{f}</span>
                        </div>
                      ))}
                    </div>
                    <a href="/booking" className="btn-primary" style={{ width: '100%', justifyContent: 'center', display: 'flex' }}>
                      {t.nav.bookNow}
                    </a>
                  </div>
                );
              })()}
              {/* Package nav */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button onClick={() => setPkgIdx(p => (p - 1 + pkgs.length) % pkgs.length)} style={arrowStyle}><ChevronLeft size={20} /></button>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {pkgs.map((_, i) => (
                    <button key={i} onClick={() => setPkgIdx(i)} style={{
                      width: i === pkgIdx % pkgs.length ? 20 : 8, height: 8, borderRadius: 4,
                      background: i === pkgIdx % pkgs.length ? '#FFD700' : '#444',
                      border: 'none', cursor: 'pointer', padding: 0,
                      transition: 'all 0.3s ease',
                    }} />
                  ))}
                </div>
                <button onClick={() => setPkgIdx(p => (p + 1) % pkgs.length)} style={arrowStyle}><ChevronRight size={20} /></button>
              </div>
            </div>
          ) : (
            /* ── Desktop: grid ── */
            <div key={active} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', alignItems: 'stretch' }}>
              {pkgs.map((pkg) => (
                <div key={pkg.id}
                  className={`card ${pkg.popular ? 'popular-card' : ''}`}
                  style={{ borderRadius: 24, padding: '2.5rem 2rem', background: 'var(--navy-light)', border: '1px solid rgba(255,255,255,0.03)', position: 'relative', display: 'flex', flexDirection: 'column' }}
                >
                  {pkg.popular && (
                    <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--primary)', color: '#000', fontSize: '0.7rem', fontWeight: 900, padding: '6px 16px', borderBottomLeftRadius: 16, zIndex: 10, textTransform: 'uppercase' }}>
                      {t.packages.popular}
                    </div>
                  )}
                  <h3 style={{ color: '#FFF', fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>{pkg.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: '#8B9AB3', fontSize: '0.9rem' }}>
                    <Clock size={16} color="var(--primary)" /> {pkg.duration}
                  </div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '1.5rem' }}>${pkg.price}</div>
                  <div style={{ flex: 1, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
                    {pkg.features.map((f, j) => (
                      <div key={j} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <Check size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
                        <span style={{ color: '#E8EDF5', fontSize: '0.88rem' }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <a href="/booking" className="btn-primary" style={{ width: '100%', justifyContent: 'center', display: 'flex' }}>
                    {t.nav.bookNow}
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }
      `}</style>
    </section>
  );
}

// ==============================
//  TESTIMONIALS (SLIDER)
// ==============================
function Testimonials() {
  const { lang } = useLang();
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - 400 : scrollLeft + 400;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const reviews = [
    {
      name: 'Elena M.',
      date: lang === 'en' ? '3 DAYS AGO' : 'HACE 3 DÍAS',
      text: lang === 'en'
        ? "Shine Pro left my Tesla looking like it just came out of the showroom. Their attention to detail is incredible!"
        : "Shine Pro dejó mi Tesla como si acabara de salir del concesionario. ¡Su atención al detalle es increíble!"
    },
    {
      name: 'Carlos V.',
      date: lang === 'en' ? '1 WEEK AGO' : 'HACE 1 SEMANA',
      text: lang === 'en'
        ? "The best mobile car wash in Orange County. They come to your office, which is super convenient for me."
        : "El mejor lavado móvil en Orange County. Vienen a tu oficina, lo cual es súper conveniente para mí."
    },
    {
      name: 'Sofia H.',
      date: lang === 'en' ? '2 WEEKS AGO' : 'HACE 2 SEMANAS',
      text: lang === 'en'
        ? "Excellent ceramic coating. My car stays clean much longer now. Highly professional and polite team."
        : "Excelente recubrimiento cerámico. Mi auto permanece limpio mucho más tiempo ahora. Equipo muy profesional."
    },
    {
      name: 'Robert D.',
      date: lang === 'en' ? '1 MONTH AGO' : 'HACE 1 MES',
      text: lang === 'en'
        ? "Amazing interior detailing. They removed stains I thought were permanent. Worth every penny."
        : "Increíble detallado interior. Quitaron manchas que pensé que eran permanentes. Vale cada centavo."
    },
    {
      name: 'Lucia F.',
      date: lang === 'en' ? '2 MONTHS AGO' : 'HACE 2 MESES',
      text: lang === 'en'
        ? "Prompt, detail-oriented, and friendly. Shine Pro is my go-to for all my vehicles."
        : "Puntuales, detallistas y amables. Shine Pro es mi opción para todos mis vehículos."
    },
  ];

  return (
    <section id="reviews" style={{ background: '#F9FAFB', padding: '6rem 0', overflow: 'hidden', color: '#111' }}>
      <div className="container">
        {/* Google Reviews Header */}
        <div className="text-center mb-10">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
            <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" alt="Google" style={{ height: '24px' }} />
            <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#424242' }}>Reviews</span>
            <div style={{ display: 'flex', gap: '3px' }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#EA4335" color="#EA4335" />)}
            </div>
            <span style={{ fontSize: '1rem', color: '#757575', fontWeight: 600, marginLeft: '5px' }}>4.9/5</span>
          </div>
          <h2 style={{ color: '#000', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, textTransform: 'none', letterSpacing: '-0.02em', marginBottom: '0' }}>
            {lang === 'en' ? 'What Our Customers Say' : 'Lo Que Dicen Nuestros Clientes'}
          </h2>
        </div>

        {/* Reviews Slider */}
        <div style={{ position: 'relative', marginTop: '4rem' }}>
          <div
            ref={scrollRef}
            className="no-scrollbar"
            style={{
              display: 'flex',
              gap: '24px',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              padding: '24px 8px 48px',
            }}
          >
            {reviews.map((r, i) => (
              <div key={i} className="review-card-google" style={{
                flex: '0 0 min(350px, 85vw)',
                background: '#FFF',
                borderRadius: '16px',
                padding: '2.5rem',
                boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
                border: '1px solid #EFEFEF',
                scrollSnapAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '280px',
                position: 'relative'
              }}>
                <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" alt="Google" style={{ height: '14px', position: 'absolute', top: '2.5rem', right: '2.5rem', opacity: 0.4 }} />

                <div>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '1.5rem' }}>
                    {[...Array(5)].map((_, j) => <Star key={j} size={14} fill="#EA4335" color="#EA4335" />)}
                  </div>
                  <p style={{ color: '#424242', fontSize: '0.95rem', fontStyle: 'italic', lineHeight: 1.7, marginBottom: '2rem' }}>
                    "{r.text}"
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #F3F4F6', paddingTop: '1.5rem' }}>
                  <div style={{ fontWeight: 900, fontSize: '0.95rem', color: '#111' }}>{r.name}</div>
                  <div style={{ fontSize: '0.7rem', color: '#9CA3AF', fontWeight: 800, textTransform: 'uppercase' }}>{r.date}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => scroll('left')}
            className="slider-arrow hide-mobile"
            style={{ position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)', background: '#FFF', width: '50px', height: '50px', borderRadius: '50%', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', cursor: 'pointer', zIndex: 10, color: '#EA4335' }}
          >
            <ChevronLeft size={24} strokeWidth={3} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="slider-arrow hide-mobile"
            style={{ position: 'absolute', right: '-20px', top: '50%', transform: 'translateY(-50%)', background: '#FFF', width: '50px', height: '50px', borderRadius: '50%', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', cursor: 'pointer', zIndex: 10, color: '#EA4335' }}
          >
            <ChevronRight size={24} strokeWidth={3} />
          </button>
        </div>
      </div>
      <style>{`
        .review-card-google:hover { transform: translateY(-5px); box-shadow: 0 20px 50px rgba(0,0,0,0.1); transition: all 0.3s; }
        @media (max-width: 768px) { .hide-mobile { display: none !important; } }
      `}</style>
    </section>
  );
}

// ==============================
//  ABOUT SECTION
// ==============================
function About() {
  const { t } = useLang();
  const values = [
    { icon: <Leaf size={22} />, ...t.about.values.eco },
    { icon: <Award size={22} />, ...t.about.values.quality },
    { icon: <Car size={22} />, ...t.about.values.convenient },
    { icon: <Shield size={22} />, ...t.about.values.trusted },
  ];
  return (
    <section id="about" className="section" style={{ background: 'var(--surface)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
          {/* Left */}
          <div className="about-text">
            <span className="badge">{t.about.badge}</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 7vw, 3.5rem)', fontWeight: 900, marginBottom: '1.5rem', color: '#FFF' }}>
              {t.about.title} <span className="gradient-text">{t.about.titleSpan}</span>
            </h2>
            <p style={{ color: '#A0ABC0', lineHeight: 1.8, marginBottom: '1rem', fontSize: '1.05rem' }}>{t.about.desc1}</p>
            <p style={{ color: '#A0ABC0', lineHeight: 1.8, marginBottom: '2.5rem', fontSize: '1.05rem' }}>{t.about.desc2}</p>
            <a href="/booking" className="btn-primary">{t.nav.bookNow}</a>
          </div>
          {/* Right */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {values.map((v, i) => (
              <div key={i} className="card" style={{ padding: '1.75rem', background: 'var(--navy)', border: '1px solid rgba(255,212,0,0.1)' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: 'rgba(255,212,0,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--primary)', marginBottom: '1rem', flexShrink: 0
                }}>{v.icon}</div>
                <h4 style={{ fontWeight: 800, marginBottom: '0.5rem', fontSize: '1.05rem' }}>{v.title}</h4>
                <p style={{ color: '#8B9AB3', fontSize: '0.85rem', lineHeight: 1.6 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <style>{`
          @media(max-width:900px){ #about > div > div { grid-template-columns: 1fr !important; } }
          @media(max-width:768px){
            .about-text { text-align: center !important; }
            .about-text .btn-primary { display: block; width: fit-content; margin: 0 auto; }
          }
        `}</style>
      </div>
    </section>
  );
}

// ==============================
//  LOCATIONS SECTION
// ==============================
function Locations() {
  const { t } = useLang();
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768);
  const [locIdx, setLocIdx] = useState(0);
  const touchStartX = useRef(null);
  const autoPlayRef = useRef(null);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const areas = t.locations.areas;

  const startAutoPlay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      setLocIdx(p => (p + 1) % areas.length);
    }, 2500);
  };

  // Start auto-play on mobile mount, clear on unmount
  useEffect(() => {
    if (!isMobile) return;
    startAutoPlay();
    return () => { if (autoPlayRef.current) clearInterval(autoPlayRef.current); };
  }, [isMobile, areas.length]);

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      setLocIdx(p => diff > 0 ? (p + 1) % areas.length : (p - 1 + areas.length) % areas.length);
      // Pause auto-play for 4s after manual swipe
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      setTimeout(startAutoPlay, 4000);
    }
    touchStartX.current = null;
  };

  return (
    <section id="locations" style={{ padding: '8rem 0', background: 'var(--navy)', overflow: 'hidden', position: 'relative' }}>
      {/* Decorative Grid Pattern */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(255,212,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,212,0,0.02) 1px, transparent 1px)',
        backgroundSize: '30px 30px', pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>

          {/* Map Image — hidden on mobile */}
          {!isMobile && (
            <div className="animate-fade-up" style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', inset: '-20px',
                background: 'radial-gradient(circle, rgba(255,212,0,0.1) 0%, transparent 70%)', zIndex: -1
              }} />
              <div style={{
                background: 'rgba(255,255,255,0.02)', borderRadius: '40px', padding: '1rem',
                border: '1px solid rgba(255,212,0,0.1)',
                transform: 'perspective(1000px) rotateY(-5deg)',
                boxShadow: '0 40px 100px rgba(0,0,0,0.4)', transition: 'all 0.5s', overflow: 'hidden'
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'perspective(1000px) rotateY(0deg)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'perspective(1000px) rotateY(-5deg)'}
              >
                <img src="/locations_map_creative_1775317017356.png" alt="Orange County Service Area"
                  style={{ width: '100%', height: 'auto', borderRadius: '30px', display: 'block', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }} />
              </div>
            </div>
          )}

          {/* Locations Content */}
          <div className="animate-fade-up" style={{ paddingLeft: isMobile ? 0 : 'min(5%, 3rem)', textAlign: 'center' }}>
            <div className="badge" style={{ marginBottom: '1.5rem' }}>{t.locations.badge}</div>
            <h2 className="section-title" style={{ textAlign: 'center', margin: 0 }}>
              {t.locations.title}<br />
              <span className="text-glow">{t.locations.titleSpan}</span>
            </h2>
            <p style={{ color: '#8B9AB3', fontSize: '1.05rem', marginTop: '1.5rem', lineHeight: 1.7, maxWidth: 500, margin: '1.5rem auto 0' }}>
              {t.locations.subtitle}
            </p>

            {isMobile ? (
              /* ── Mobile: 1 card slider ── */
              <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
                <div
                  key={locIdx}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  style={{
                    width: '85%', display: 'flex', gap: '1.25rem', alignItems: 'center',
                    justifyContent: 'center', padding: '1.75rem',
                    background: '#1a1a1a', borderRadius: '16px',
                    border: '1px solid rgba(255,212,0,0.1)',
                  }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: '12px',
                    background: 'rgba(255,212,0,0.08)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    border: '1px solid rgba(255,212,0,0.15)'
                  }}>
                    <MapPin size={22} color="var(--primary)" />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <h4 style={{ color: '#FFF', fontSize: '1.1rem', margin: 0, fontWeight: 700 }}>{areas[locIdx].city}</h4>
                    <p style={{ color: '#8B9AB3', fontSize: '0.85rem', margin: '4px 0 0', fontWeight: 600 }}>{areas[locIdx].zip}</p>
                  </div>
                </div>
                {/* Dots only */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  {areas.map((_, i) => (
                    <button key={i} onClick={() => setLocIdx(i)} style={{
                      width: i === locIdx ? 20 : 8, height: 8, borderRadius: 4,
                      background: i === locIdx ? '#FFD700' : '#444',
                      border: 'none', cursor: 'pointer', padding: 0,
                      transition: 'all 0.3s ease',
                    }} />
                  ))}
                </div>
              </div>
            ) : (
              /* ── Desktop: grid list ── */
              <div style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem' }}>
                {areas.map((area, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: '1.25rem', alignItems: 'flex-start',
                    padding: '1.5rem', background: 'rgba(255,255,255,0.03)',
                    borderRadius: '16px', border: '1px solid rgba(255,212,0,0.05)', transition: 'all 0.3s'
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,212,0,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,212,0,0.15)'; e.currentTarget.style.transform = 'translateY(-5px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,212,0,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <div style={{
                      width: 44, height: 44, borderRadius: '12px',
                      background: 'rgba(255,212,0,0.08)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      border: '1px solid rgba(255,212,0,0.15)'
                    }}>
                      <MapPin size={22} color="var(--primary)" />
                    </div>
                    <div>
                      <h4 style={{ color: '#FFF', fontSize: '1.1rem', margin: 0, fontWeight: 700 }}>{area.city}</h4>
                      <p style={{ color: '#8B9AB3', fontSize: '0.85rem', margin: '4px 0 0', fontWeight: 600, opacity: 0.8 }}>{area.zip}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ==============================
//  GALLERY SECTION
// ==============================
// ==============================
//  FLOATING MOBILE CTA
// ==============================
function FloatingCTA() {
  const { t } = useLang();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', bottom: '24px', left: '20px', right: '20px',
      zIndex: 1000, display: 'none'
    }} className="mobile-cta-btn animate-fade-up">
      <a href={`tel:${COMPANY_INFO.phone}`} style={{
        background: 'var(--primary)', color: '#000',
        padding: '1rem', borderRadius: '12px', textAlign: 'center',
        fontWeight: 800, fontSize: '1rem', textDecoration: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
        boxShadow: '0 12px 30px rgba(0,0,0,0.5), 0 0 15px rgba(255, 212, 0, 0.4)',
        textTransform: 'uppercase', letterSpacing: '0.05em'
      }}>
        {t.nav.bookNow} <Phone size={18} />
      </a>
      <style>{`
        @media (min-width: 769px) and (max-width: 991px) { .mobile-cta-btn { display: block !important; } }
      `}</style>
    </div>
  );
}

function Gallery() {
  useLang();
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768);
  const [current, setCurrent] = useState(0);

  const photos = [
    { src: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80', label: 'Exterior Care' },
    { src: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&q=80', label: 'Interior Detailing' },
    { src: 'https://images.unsplash.com/photo-1517672651691-24622a91b550?auto=format&fit=crop&q=80', label: 'Wheel Refinement' },
    { src: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80', label: 'Paint Protection' },
    { src: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80', label: 'Engine Bay' },
    { src: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80', label: 'Ceramic Coating' },
  ];

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Auto-play
  useEffect(() => {
    if (!isMobile) return;
    const timer = setInterval(() => setCurrent(p => (p + 1) % photos.length), 3000);
    return () => clearInterval(timer);
  }, [isMobile, photos.length]);

  const prev = () => setCurrent(p => (p - 1 + photos.length) % photos.length);
  const next = () => setCurrent(p => (p + 1) % photos.length);

  const dotStyle = (i) => ({
    width: i === current ? 20 : 8, height: 8, borderRadius: 4,
    background: i === current ? '#FFD700' : '#555',
    border: 'none', cursor: 'pointer', padding: 0,
    transition: 'all 0.3s ease',
  });

  const arrowBtn = { width: 40, height: 40, borderRadius: '50%', background: '#FFD700', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 };

  return (
    <section id="gallery" className="section" style={{ background: 'var(--surface)' }}>
      <div className="container">
        <div className="section-header">
          <span className="badge">Visual Excellence</span>
          <h2 style={{ color: '#FFF' }}>Results That <span className="gradient-text">Speak Volumes</span></h2>
          <p>Browse our portfolio and see the Shine Pro standard in every project.</p>
        </div>

        {isMobile ? (
          /* ── Mobile slider ── */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            {/* Image */}
            <div style={{ position: 'relative', width: '100%', height: '280px', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,212,0,0.1)' }}>
              <img
                src={photos[current].src}
                alt={photos[current].label}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                display: 'flex', alignItems: 'flex-end', padding: '1rem',
              }}>
                <span style={{ color: '#FFF', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {photos[current].label}
                </span>
              </div>
            </div>
            {/* Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button onClick={prev} style={arrowBtn}><ChevronLeft size={20} color="#000" strokeWidth={3} /></button>
              <div style={{ display: 'flex', gap: '6px' }}>
                {photos.map((_, i) => <button key={i} onClick={() => setCurrent(i)} style={dotStyle(i)} />)}
              </div>
              <button onClick={next} style={arrowBtn}><ChevronRight size={20} color="#000" strokeWidth={3} /></button>
            </div>
          </div>
        ) : (
          /* ── Desktop grid ── */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {photos.map((p, i) => (
              <div key={i} className="gallery-item" style={{
                position: 'relative', aspectRatio: '16/10',
                borderRadius: '24px', overflow: 'hidden',
                cursor: 'pointer', border: '1px solid rgba(255,212,0,0.1)'
              }}>
                <img src={p.src} alt={p.label} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} className="zoom-on-hover" />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                  display: 'flex', alignItems: 'flex-end', padding: '1.5rem',
                  opacity: 0, transition: 'opacity 0.3s'
                }} className="gallery-overlay">
                  <span style={{ color: '#FFF', fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{p.label}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`
        .gallery-item:hover .zoom-on-hover { transform: scale(1.1); }
        .gallery-item:hover .gallery-overlay { opacity: 1; }
      `}</style>
    </section>
  );
}

// ==============================
//  CONTACT / CTA SECTION
// ==============================
function Contact() {
  const { t } = useLang();
  return (
    <section id="contact" className="section" style={{ background: 'var(--navy)' }}>
      <div className="container">
        {/* CTA Banner */}
        <div style={{
          background: 'linear-gradient(135deg, var(--primary-dark), var(--primary))',
          borderRadius: 24, padding: '4rem',
          marginBottom: '5rem', textAlign: 'center',
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(255, 212, 0, 0.2)',
        }}>
          <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: 'rgba(255,255,255,0.2)', borderRadius: '50%' }} />
          <h2 style={{ color: '#000', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, marginBottom: '1rem', textTransform: 'uppercase' }}>
            {t.contact.bannerTitle}
          </h2>
          <p style={{ color: 'rgba(0,0,0,0.8)', marginBottom: '2.5rem', fontSize: '1.15rem', fontWeight: 600 }}>
            {t.contact.bannerSubtitle}
          </p>
          <a href="/booking" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: '#000', color: 'var(--primary)', fontWeight: 800,
            padding: '1.1rem 3rem', borderRadius: 50, textDecoration: 'none',
            fontSize: '1.05rem', boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
            transition: 'all 0.2s', textTransform: 'uppercase'
          }}>
            {t.hero.cta} <ArrowRight size={18} />
          </a>
        </div>

        {/* Contact info */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
          {[
            { icon: <Phone size={24} color="var(--primary)" />, label: t.contact.phone, val: COMPANY_INFO.phone },
            { icon: <Mail size={24} color="var(--primary)" />, label: t.contact.email, val: COMPANY_INFO.email },
            { icon: <MapPin size={24} color="var(--primary)" />, label: t.contact.location, val: t.contact.locationValue },
            { icon: <Clock size={24} color="var(--primary)" />, label: t.contact.hours, val: t.contact.hoursValue },
          ].map((c, i) => (
            <div key={i} className="card" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '1.25rem',
              padding: '2.5rem 1.5rem',
              background: 'var(--surface)',
              border: '1px solid rgba(255, 212, 0, 0.05)'
            }}>
              <div style={{
                width: 60, height: 60, borderRadius: '50%',
                background: 'rgba(255, 212, 0, 0.08)', border: '1px solid rgba(255, 212, 0, 0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
              }}>{c.icon}</div>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#8B9AB3', marginBottom: '0.4rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{c.label}</div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#FFF' }}>{c.val}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


// ==============================
//  HOME PAGE (assembles all sections)
// ==============================
export default function Home() {
  return (
    <>
      <FloatingCTA />
      <Hero />
      <BenefitBar />
      <Services />
      <Partners />
      <Comparison />
      <Gallery />
      <Testimonials />
      <Packages />
      <Locations />
      <About />
      <Contact />
      <Footer />
    </>
  );
}


