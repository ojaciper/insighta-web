import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaGithub } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
// import { apiClient } from '../services/api';
import toast from 'react-hot-toast';

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for OAuth callback parameters in URL
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const error = params.get('error');
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');

    // Handle error from GitHub
    if (error) {
      toast.error('Authentication failed. Please try again.');
      navigate('/login');
      return;
    }

    // If backend redirected with tokens in URL
    if (access_token && refresh_token) {
      handleTokenRedirect(access_token, refresh_token);
      return;
    }

    // If we have a code from GitHub callback
    if (code) {
      handleAuthCode(code);
      return;
    }

    // If already authenticated, go to dashboard
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [location, isAuthenticated, navigate]);

  const handleTokenRedirect = (access_token: string, refresh_token: string) => {
    // Store tokens directly
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    
    // Fetch user info
    fetchUserInfo(access_token);
    
    toast.success('Login successful!');
    navigate('/dashboard');
  };

  const handleAuthCode = async (code: string) => {
    setLoading(true);
    try {
      // Exchange code for tokens via backend
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/auth/github/callback?code=${code}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Version': '1',
        },
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        // Store tokens
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        toast.success(`Welcome back, @${data.user.username}!`);
        
        // Clear the URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
        navigate('/dashboard');
      } else {
        toast.error(data.message || 'Authentication failed');
        navigate('/login');
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error('Authentication failed');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserInfo = async (token: string) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-API-Version': '1',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('user', JSON.stringify(data.user));
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    }
  };

  const handleLogin = () => {
    console.log("hello world how are you doing")
    setLoading(true);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    window.location.href = `${API_URL}/auth/github`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-3xl">I</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Insighta Labs+</h1>
          <p className="text-gray-600">Demographic Intelligence Platform</p>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center space-x-3 bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          <FaGithub className="text-xl" />
          <span>{loading ? 'Redirecting...' : 'Continue with GitHub'}</span>
        </button>

        <p className="text-xs text-center text-gray-500 mt-6">
          Securely authenticate with your GitHub account
        </p>
      </div>
    </div>
  );
}