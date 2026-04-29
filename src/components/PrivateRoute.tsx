import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ThreeDots } from 'react-loader-spinner';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ThreeDots color="#6d28d9" height={80} width={80} />
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}