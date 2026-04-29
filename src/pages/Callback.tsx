import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ThreeDots } from 'react-loader-spinner';
import toast from 'react-hot-toast';

export function Callback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');
    const user_param = params.get('user');

    console.log('Callback page loaded');
    console.log('Access token:', access_token?.substring(0, 50));
    console.log('Refresh token:', refresh_token?.substring(0, 50));
    console.log('User param:', user_param);

    if (access_token && refresh_token) {
      // Store tokens
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      
      // Parse and store user info
      if (user_param) {
        try {
          const user = JSON.parse(atob(user_param));
          localStorage.setItem('user', JSON.stringify(user));
          console.log('User stored:', user);
          toast.success(`Welcome back, @${user.username}!`);
        } catch (e) {
          console.error('Failed to parse user info', e);
        }
      }
      
      // Redirect to dashboard
      navigate('/dashboard', { replace: true });
    } else {
      console.error('No tokens found in URL');
      toast.error('Authentication failed');
      navigate('/login', { replace: true });
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center">
      <div className="text-center">
        <ThreeDots color="#ffffff" height={80} width={80} />
        <p className="text-white mt-4">Completing authentication...</p>
      </div>
    </div>
  );
}