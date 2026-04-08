import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../../AdminAuthContext';

export default function PrivateRoute({ children }) {
  const { isAuthenticated } = useAdminAuth();
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
}
