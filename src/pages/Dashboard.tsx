import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { FaUsers, FaVenusMars, FaGlobe, FaCalendarAlt } from 'react-icons/fa';
import { apiClient } from '../services/api';
import { DemographicsStats } from '../types';
import { ThreeDots } from 'react-loader-spinner';
import toast from 'react-hot-toast';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState<DemographicsStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for tokens in URL (from OAuth redirect)
    const params = new URLSearchParams(location.search);
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');
    const user_param = params.get('user');
    
    if (access_token && refresh_token) {
      console.log('Tokens found in URL, storing them...');
      
      // Store tokens
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      
      // Store user info if provided
      if (user_param) {
        try {
          const user = JSON.parse(atob(user_param));
          localStorage.setItem('user', JSON.stringify(user));
          toast.success(`Welcome back, @${user.username}!`);
        } catch (e) {
          console.error('Failed to parse user info', e);
        }
      }
      
      // Clean URL by removing tokens (optional but good practice)
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    // Check if authenticated
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.log('No token found, redirecting to login');
      navigate('/login');
      return;
    }
    
    fetchStats();
  }, [location, navigate]);

  const fetchStats = async () => {
    try {
      const response = await apiClient.get<DemographicsStats>('/api/profiles/stats/demographics');
      setStats(response);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <ThreeDots color="#6d28d9" height={80} width={80} />
      </div>
    );
  }

  const genderData = {
    labels: Object.keys(stats?.gender_distribution || {}),
    datasets: [
      {
        data: Object.values(stats?.gender_distribution || {}),
        backgroundColor: ['#3b82f6', '#ec4899'],
        borderWidth: 0,
      },
    ],
  };

  const ageGroupData = {
    labels: Object.keys(stats?.age_group_distribution || {}),
    datasets: [
      {
        label: 'Number of Profiles',
        data: Object.values(stats?.age_group_distribution || {}),
        backgroundColor: '#8b5cf6',
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  const statsCards = [
    { title: 'Total Profiles', value: stats?.total_profiles || 0, icon: FaUsers, color: 'bg-blue-500' },
    {
      title: 'Gender Ratio',
      value: `${Math.round(
        (Object.values(stats?.gender_distribution || {})[0] || 0) / (stats?.total_profiles || 1) * 100
      )}% Male`,
      icon: FaVenusMars,
      color: 'bg-pink-500',
    },
    { title: 'Countries', value: stats?.top_countries?.length || 0, icon: FaGlobe, color: 'bg-green-500' },
    { title: 'Data Points', value: stats?.total_profiles || 0, icon: FaCalendarAlt, color: 'bg-purple-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{card.title}</p>
                <p className="text-2xl font-bold mt-1">{card.value}</p>
              </div>
              <div className={`${card.color} p-3 rounded-full text-white`}>
                <card.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Gender Distribution</h2>
          <div className="h-64">
            <Doughnut data={genderData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Age Group Distribution</h2>
          <div className="h-64">
            <Bar data={ageGroupData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Top Countries</h2>
        <div className="space-y-3">
          {stats?.top_countries?.map((country, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="font-medium text-gray-700">{country.country_id}</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-48 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 rounded-full h-2"
                    style={{ width: `${(country.count / (stats?.total_profiles || 1)) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600">{country.count} profiles</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}