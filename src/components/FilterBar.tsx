import { useState } from 'react';
import { FaFilter, FaTimes } from 'react-icons/fa';

interface FilterBarProps {
  filters: {
    gender?: string;
    age_group?: string;
    country_id?: string;
    min_age?: number;
    max_age?: number;
  };
  onFilterChange: (key: string, value: string | number) => void;
  onClearFilters: () => void;
}

export function FilterBar({ filters, onFilterChange, onClearFilters }: FilterBarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex justify-between items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
        >
          <FaFilter />
          <span>Filters</span>
        </button>
        <button
          onClick={onClearFilters}
          className="text-sm text-red-600 hover:text-red-700"
        >
          Clear All
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <select
            value={filters.gender || ''}
            onChange={(e) => onFilterChange('gender', e.target.value)}
            className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <select
            value={filters.age_group || ''}
            onChange={(e) => onFilterChange('age_group', e.target.value)}
            className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Age Groups</option>
            <option value="child">Child</option>
            <option value="teenager">Teenager</option>
            <option value="adult">Adult</option>
            <option value="senior">Senior</option>
          </select>

          <input
            type="text"
            placeholder="Country Code"
            value={filters.country_id || ''}
            onChange={(e) => onFilterChange('country_id', e.target.value.toUpperCase())}
            className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="number"
            placeholder="Min Age"
            value={filters.min_age || ''}
            onChange={(e) => onFilterChange('min_age', e.target.value)}
            className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="number"
            placeholder="Max Age"
            value={filters.max_age || ''}
            onChange={(e) => onFilterChange('max_age', e.target.value)}
            className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      )}
    </div>
  );
}