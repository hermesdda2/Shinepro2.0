import { lazy, Suspense } from 'react';
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
  return (
    <AdminAuthProvider>
      <LangProvider>
        <BrowserRouter>
          <Suspense fallback={null}>
            <ReadySignal onReady={onReady} />
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


