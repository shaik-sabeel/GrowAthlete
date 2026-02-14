// src/components/FilterSidebar.jsx
import React from 'react';
import { Search } from 'lucide-react';

const FilterSidebar = ({ filters, onFilterChange, onClearFilters }) => {
  return (
    <aside className="w-full lg:w-72 bg-white p-6 shadow-md rounded-lg flex-shrink-0">
      <h2 className="text-xl font-semibold mb-6 text-black" style={{ color: 'black' }}>Filter Tournaments</h2>

      <div className="space-y-6">
        {/* Search Tournaments */}
        <div>
          <label htmlFor="searchTournaments" className="block text-sm font-medium text-gray-700 mb-2">
            Search tournaments...
          </label>
          <div className="relative">
            <input
              type="text"
              id="searchTournaments"
              name="search"
              value={filters?.search || ''}
              onChange={onFilterChange}
              placeholder="e.g., Marathon, League"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-900"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
        </div>

        {/* Sport */}
        <div>
          <label htmlFor="sport" className="block text-sm font-medium text-gray-700 mb-2">
            Sport
          </label>
          <select
            id="sport"
            name="sport"
            value={filters?.sport || ''}
            onChange={onFilterChange}
            className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-900"
          >
            <option>Select a sport</option>
            <option>Football</option>
            <option>Cricket</option>
            <option>Badminton</option>
            <option>Athletics</option>
            <option>Basketball</option>
            <option>Tennis</option>
            <option>Running</option>
            <option>Volleyball</option>
            <option>Kabaddi</option>
          </select>
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={filters?.location || ''}
            onChange={onFilterChange}
            placeholder="e.g., Mumbai, Delhi"
            className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-900"
          />
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Range
          </label>
          <div className="flex space-x-2">
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={filters?.startDate || ''}
              onChange={onFilterChange}
              className="w-1/2 py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-900"
            />
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={filters?.endDate || ''}
              onChange={onFilterChange}
              className="w-1/2 py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-900"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={filters?.category || ''}
            onChange={onFilterChange}
            className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-900"
          >
            <option>Select category</option>
            <option>Local League</option>
            <option>National Championship</option>
            <option>Amateur Cup</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            id="sortBy"
            name="sortBy"
            value={filters?.sortBy || ''}
            onChange={onFilterChange}
            className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-900"
          >
            <option>Date (Upcoming)</option>
            <option>Date (Past)</option>
            <option>Alphabetical (A-Z)</option>
            <option>Location</option>
          </select>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="mt-8 space-y-3">
        <button
          onClick={onClearFilters}
          className="w-full bg-white text-gray-700 border border-gray-300 py-2 px-4 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors">
          Clear Filters
        </button>
      </div>
    </aside>
  );
};

export default FilterSidebar;