import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ allowedRoles }) {
  const { user } = useAuth();

  if (!user) {
    // Not logged in, redirect to home
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Role not authorized, redirect to home (or optionally an unauthorized page)
    return <Navigate to="/" replace />;
  }

  // Authorized, render the child components
  return <Outlet />;
}
