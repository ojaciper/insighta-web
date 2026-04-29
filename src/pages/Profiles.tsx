import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { FaDownload } from 'react-icons/fa';
import { apiClient } from '../services/api';
import { Profile, Filters } from '../types';
import { ProfileTable } from '../components/ProfileTable';
import { FilterBar } from '../components/FilterBar';
import { Pagination } from '../components/Pagination';
import toast from 'react-hot-toast';
import { ThreeDots } from 'react-loader-spinner';

export function Profiles() {
//   const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    gender: '',
    age_group: '',
    country_id: '',
    min_age: undefined,
    max_age: undefined,
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  useEffect(() => {
    fetchProfiles();
  }, [filters]);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = {
        page: filters.page,
        limit: filters.limit,
      };
      if (filters.gender) params.gender = filters.gender;
      if (filters.age_group) params.age_group = filters.age_group;
      if (filters.country_id) params.country_id = filters.country_id;
      if (filters.min_age) params.min_age = filters.min_age;
      if (filters.max_age) params.max_age = filters.max_age;

      const response = await apiClient.get<{
        status: string;
        data: Profile[];
        page: number;
        limit: number;
        total: number;
        total_pages: number;
      }>('/api/profiles', params);

      setProfiles(response.data);
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.total_pages,
      });
    } catch (error) {
      toast.error('Failed to fetch profiles');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({
      gender: '',
      age_group: '',
      country_id: '',
      min_age: undefined,
      max_age: undefined,
      page: 1,
      limit: 10,
    });
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleExport = async () => {
    try {
      const params: Record<string, any> = { format: 'csv' };
      if (filters.gender) params.gender = filters.gender;
      if (filters.age_group) params.age_group = filters.age_group;
      if (filters.country_id) params.country_id = filters.country_id;
      if (filters.min_age) params.min_age = filters.min_age;
      if (filters.max_age) params.max_age = filters.max_age;

    //   const token = localStorage.getItem('access_token');
      const queryParams = new URLSearchParams(params).toString();
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const url = `${API_URL}/api/profiles/export?${queryParams}`;

      window.open(url, '_blank');
      toast.success('Export started!');
    } catch (error) {
      toast.error('Export failed');
    }
  };

  if (loading && profiles.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <ThreeDots color="#6d28d9" height={80} width={80} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Profiles</h1>
        <button
          onClick={handleExport}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <FaDownload />
          <span>Export CSV</span>
        </button>
      </div>

      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <ProfileTable profiles={profiles} />
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          limit={pagination.limit}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}