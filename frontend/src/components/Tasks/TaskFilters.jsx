import React from 'react';
import { FiFilter, FiX } from 'react-icons/fi';

const TaskFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const statuses = ['all', 'todo', 'in_progress', 'completed'];
  const priorities = ['all', 'low', 'medium', 'high'];

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FiFilter className="text-gray-500" />
          <h3 className="font-medium">Filters</h3>
        </div>
        <button onClick={onClearFilters} className="text-sm text-red-600 hover:text-red-700">
          Clear all
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            value={filters.status || 'all'}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
          <select
            value={filters.priority || 'all'}
            onChange={(e) => onFilterChange('priority', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {priorities.map(priority => (
              <option key={priority} value={priority}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <input
            type="text"
            placeholder="Search by title..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {(filters.status !== 'all' || filters.priority !== 'all' || filters.search) && (
        <div className="flex flex-wrap gap-2 mt-4">
          {filters.status !== 'all' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
              Status: {filters.status}
              <button onClick={() => onFilterChange('status', 'all')} className="ml-1">
                <FiX size={12} />
              </button>
            </span>
          )}
          {filters.priority !== 'all' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
              Priority: {filters.priority}
              <button onClick={() => onFilterChange('priority', 'all')} className="ml-1">
                <FiX size={12} />
              </button>
            </span>
          )}
          {filters.search && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
              Search: {filters.search}
              <button onClick={() => onFilterChange('search', '')} className="ml-1">
                <FiX size={12} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskFilters;