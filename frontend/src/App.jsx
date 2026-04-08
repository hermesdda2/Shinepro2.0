import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LangProvider } from './LangContext';
import { AdminAuthProvider } from './AdminAuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/admin/PrivateRoute';
import './index.css';

const Home         = lazy(() => import('./pages/Home'));
const Privacy      = lazy(() => import('./pages/Privacy'));
const Terms        = lazy(() => import('./pages/Terms'));
const Booking      = lazy(() => import('./pages/Booking'));
const AdminLogin   = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminBookings  = lazy(() => import('./pages/AdminBookings'));
const AdminSettings  = lazy(() => import('./pages/AdminSettings'));

function App() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let p = 0;
    const interval = setInterval(() => {
      p += 25;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => setLoading(false), 200);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);



  if (loading) {
    return (
      <div style={{
        position: 'fixed', inset: 0, background: '#0A0D14',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', zIndex: 99999
      }}>
        <div style={{ marginBottom: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img 
            src="/logo.png" 
            alt="Shine Pro Logo" 
            className="logo-glow-anim" 
            style={{ width: '120px', height: 'auto', marginBottom: '1.5rem' }} 
          />
          <div style={{
            fontSize: '2.2rem', fontFamily: 'Outfit, sans-serif',
            fontWeight: 900, color: 'var(--primary)', letterSpacing: '0.08em',
            textTransform: 'uppercase', lineHeight: 1
          }}>
            SHINE PRO
          </div>
          <div style={{ 
            color: '#FFF', fontSize: '0.75rem', letterSpacing: '0.3em', 
            marginTop: '0.5rem', fontWeight: 600, opacity: 0.8,
            textTransform: 'uppercase'
          }}>
            MOBILE AUTO SPA
          </div>
        </div>
        <div style={{ width: '220px' }}>
          <div style={{
            width: '100%', height: '6px',
            background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden',
            border: '1px solid rgba(255,212,0,0.1)'
          }}>
            <div style={{
              height: '100%', width: `${progress}%`,
              background: 'linear-gradient(90deg, var(--primary-dark), var(--primary))',
              borderRadius: '10px', transition: 'width 0.1s linear',
              boxShadow: '0 0 15px var(--primary)'
            }} />
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            marginTop: '1rem', fontSize: '0.7rem', color: '#8B9AB3',
            fontWeight: 800, letterSpacing: '0.2em'
          }}>
            <span>LOADING...</span>
            <span style={{ color: 'var(--primary)' }}>{progress}%</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminAuthProvider>
      <LangProvider>
        <BrowserRouter>
          <Suspense fallback={null}>
            <Routes>
              {/* Public client routes */}
              <Route path="/*" element={
                <>
                  <Navbar />
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/booking" element={<Booking />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                  </Routes>
                </>
              } />

              {/* Admin routes — no Navbar */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
              <Route path="/admin/bookings" element={<PrivateRoute><AdminBookings /></PrivateRoute>} />
              <Route path="/admin/settings" element={<PrivateRoute><AdminSettings /></PrivateRoute>} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </LangProvider>
    </AdminAuthProvider>
  );
}

export default App;


