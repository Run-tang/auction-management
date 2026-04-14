import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router';
import { isAuthenticated, subscribe } from '../lib/store';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [, setTick] = useState(0);

  // Subscribe to store changes so authentication status updates reactively
  useEffect(() => subscribe(() => setTick(t => t + 1)), []);

  if (!isAuthenticated()) {
    // Redirect to login page, but save the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
