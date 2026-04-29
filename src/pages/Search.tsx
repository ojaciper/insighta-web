import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { apiClient } from '../services/api';
import { Profile } from '../types';
import { ProfileTable } from '../components/ProfileTable';
import { Pagination } from '../components/Pagination';
import toast from 'react-hot-toast';
import { ThreeDots } from 'react-loader-spinner';

export function Search() {
//   const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [interpreted, setInterpreted] = useState<Record<string, any> | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const handleSearch = async (page = 1) => {
    if (!query.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.get<{
        status: string;
        data: Profile[];
        page: number;
        limit: number;
        total: number;
        total_pages: number;
        query_interpreted: Record<string, any>;
      }>('/api/profiles/search', { q: query, page, limit: 10 });

      setResults(response.data);
      setInterpreted(response.query_interpreted);
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.total_pages,
      });

      if (response.data.length === 0) {
        toast('No results found', { icon: '🔍' });
      }
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    handleSearch(page);
  };

  const examples = [
    'young males',
    'females above 30',
    'people from nigeria',
    'adult males from kenya',
    'teenagers',
    'seniors',
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Natural Language Search</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(1)}
              placeholder="e.g., young males from nigeria, females above 30, adults from kenya"
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button
            onClick={() => handleSearch(1)}
            disabled={loading}
            className="flex items-center justify-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            <FaSearch />
            <span>Search</span>
          </button>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-2">Try these examples:</p>
          <div className="flex flex-wrap gap-2">
            {examples.map((example) => (
              <button
                key={example}
                onClick={() => {
                  setQuery(example);
                  handleSearch(1);
                }}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>

      {interpreted && Object.keys(interpreted).length > 0 && (
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-700 font-medium mb-1">Interpreted as:</p>
          <pre className="text-xs text-blue-600 overflow-x-auto">
            {JSON.stringify(interpreted, null, 2)}
          </pre>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ThreeDots color="#6d28d9" height={80} width={80} />
        </div>
      ) : results.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <ProfileTable profiles={results} />
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            totalItems={pagination.total}
            limit={pagination.limit}
            onPageChange={handlePageChange}
          />
        </div>
      ) : null}
    </div>
  );
}