import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../AdminAuthContext';

export default function AdminLogin() {
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const inputBase = {
    width: '100%', padding: '13px 16px', borderRadius: '12px',
    background: '#080b11', border: '1px solid #1a2035',
    color: '#fff', fontSize: '0.92rem', outline: 'none',
    boxSizing: 'border-box', transition: 'border-color 0.2s',
    fontFamily: 'Inter, sans-serif',
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0d14',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Inter, sans-serif',
      backgroundImage: `
        radial-gradient(ellipse at 20% 50%, rgba(255,215,0,0.04) 0%, transparent 55%),
        radial-gradient(ellipse at 80% 10%, rgba(255,215,0,0.03) 0%, transparent 50%)
      `,
    }}>
      <div style={{ width: '100%', maxWidth: '420px', padding: '0 1.5rem' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '20px',
            background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.25rem', backdropFilter: 'blur(10px)',
          }}>
            <img src="/logo.png" alt="Shine Pro" style={{ width: '48px', height: 'auto' }} />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#FFD700', letterSpacing: '0.1em', fontFamily: 'Outfit, sans-serif' }}>
            SHINE PRO
          </div>
          <div style={{ fontSize: '0.7rem', color: '#3a4a6b', letterSpacing: '0.3em', textTransform: 'uppercase', marginTop: '4px', fontWeight: 600 }}>
            Admin Panel
          </div>
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(15,18,25,0.8)',
          border: '1px solid #1a2035',
          borderRadius: '24px',
          padding: '2.25rem',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,215,0,0.03)',
          backdropFilter: 'blur(20px)',
        }}>
          <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.35rem', letterSpacing: '-0.01em' }}>
            Sign In
          </h2>
          <p style={{ color: '#3a4a6b', fontSize: '0.85rem', marginBottom: '2rem' }}>
            Access the Shine Pro dashboard
          </p>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.72rem', color: '#9a9a9a', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Email
              </label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="mail@mail.com" required
                style={{ ...inputBase, border: `1px solid ${error ? 'rgba(239,68,68,0.5)' : '#1a2035'}` }}
                onFocus={e => e.target.style.borderColor = '#FFD700'}
                onBlur={e => e.target.style.borderColor = error ? 'rgba(239,68,68,0.5)' : '#1a2035'}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ display: 'block', fontSize: '0.72rem', color: '#9a9a9a', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" required
                  style={{ ...inputBase, paddingRight: '48px', border: `1px solid ${error ? 'rgba(239,68,68,0.5)' : '#1a2035'}` }}
                  onFocus={e => e.target.style.borderColor = '#FFD700'}
                  onBlur={e => e.target.style.borderColor = error ? 'rgba(239,68,68,0.5)' : '#1a2035'}
                />
                <button type="button" onClick={() => setShowPass(s => !s)} style={{
                  position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#3a4a6b', padding: 0, fontSize: '1rem',
                }}>
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: '12px', padding: '11px 14px', marginBottom: '1.25rem',
                color: '#ef4444', fontSize: '0.83rem', textAlign: 'center',
              }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '15px', borderRadius: '50px',
              background: loading ? '#0f1219' : 'linear-gradient(135deg, #FFD700, #FFC200)',
              color: loading ? '#3a4a6b' : '#000',
              border: loading ? '1px solid #1a2035' : 'none',
              fontSize: '0.95rem', fontWeight: 800,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s', letterSpacing: '0.04em',
              boxShadow: loading ? 'none' : '0 8px 30px rgba(255,215,0,0.3)',
            }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(255,215,0,0.4)'; } }}
              onMouseLeave={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(255,215,0,0.3)'; } }}
            >
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: '#1a2035', fontSize: '0.73rem', marginTop: '1.75rem', letterSpacing: '0.05em' }}>
          Shine Pro Mobile Auto Spa — Admin
        </p>
      </div>
    </div>
  );
}
