import { apiClient } from './api';
import { AuthResponse, User } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const authService = {
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('access_token');
  },

  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await apiClient.get<{ status: string; user: User }>('/api/users/me');
      return response.user;
    } catch (error) {
      return null;
    }
  },

  login: () => {
    window.location.href = `${API_URL}/auth/github`;
  },

  logout: async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      try {
        await apiClient.post('/auth/logout', { refresh_token: refreshToken });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  handleCallback: async (code: string): Promise<AuthResponse | null> => {
    try {
      const response = await fetch(`${API_URL}/auth/github/callback?code=${code}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Version': '1',
        },
      });
      
      const data = await response.json();
      
      if (response.ok && data.status === 'success') {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        return data;
      }
      return null;
    } catch (error) {
      console.error('Callback error:', error);
      return null;
    }
  },
};