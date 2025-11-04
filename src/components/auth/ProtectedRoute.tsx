import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('admin' | 'closer' | 'sdr' | 'viewer')[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { session, currentRole, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!session) {
        navigate('/login');
      } else if (allowedRoles && currentRole && !allowedRoles.includes(currentRole)) {
        navigate('/leads');
      }
    }
  }, [session, currentRole, loading, navigate, allowedRoles]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (allowedRoles && currentRole && !allowedRoles.includes(currentRole)) {
    return null;
  }

  return <>{children}</>;
}
