// src/components/FilterSidebar.jsx
import React from 'react';
import { Search } from 'lucide-react';

const FilterSidebar = ({ filters, onFilterChange, onClearFilters }) => {
  return (
    <aside className="w-full lg:w-72 bg-gray-800 p-6 shadow-xl rounded-2xl border border-gray-700 flex-shrink-0">
      <h2 className="text-xl font-bold mb-6 text-white border-b border-gray-700 pb-2">Filter Tournaments</h2>

      <div className="space-y-6">
        {/* Search Tournaments */}
        <div>
          <label htmlFor="searchTournaments" className="block text-sm font-medium text-gray-300 mb-2">
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
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-white placeholder-gray-400 transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
        </div>

        {/* Sport */}
        <div>
          <label htmlFor="sport" className="block text-sm font-medium text-gray-300 mb-2">
            Sport
          </label>
          <select
            id="sport"
            name="sport"
            value={filters?.sport || ''}
            onChange={onFilterChange}
            className="w-full py-2 px-3 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-white transition-all appearance-none"
          >
            <option className="bg-gray-800 text-gray-300">Select a sport</option>
            <option className="bg-gray-800">Football</option>
            <option className="bg-gray-800">Cricket</option>
            <option className="bg-gray-800">Badminton</option>
            <option className="bg-gray-800">Athletics</option>
            <option className="bg-gray-800">Basketball</option>
            <option className="bg-gray-800">Tennis</option>
            <option className="bg-gray-800">Running</option>
            <option className="bg-gray-800">Volleyball</option>
            <option className="bg-gray-800">Kabaddi</option>
          </select>
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={filters?.location || ''}
            onChange={onFilterChange}
            placeholder="e.g., Mumbai, Delhi"
            className="w-full py-2 px-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-white placeholder-gray-400 transition-all"
          />
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Date Range
          </label>
          <div className="flex space-x-2">
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={filters?.startDate || ''}
              onChange={onFilterChange}
              className="w-1/2 py-2 px-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-white placeholder-gray-400"
            />
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={filters?.endDate || ''}
              onChange={onFilterChange}
              className="w-1/2 py-2 px-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-white placeholder-gray-400"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={filters?.category || ''}
            onChange={onFilterChange}
            className="w-full py-2 px-3 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-white transition-all appearance-none"
          >
            <option className="bg-gray-800 text-gray-300">Select category</option>
            <option className="bg-gray-800">Local League</option>
            <option className="bg-gray-800">National Championship</option>
            <option className="bg-gray-800">Amateur Cup</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label htmlFor="sortBy" className="block text-sm font-medium text-gray-300 mb-2">
            Sort By
          </label>
          <select
            id="sortBy"
            name="sortBy"
            value={filters?.sortBy || ''}
            onChange={onFilterChange}
            className="w-full py-2 px-3 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-white transition-all appearance-none"
          >
            <option className="bg-gray-800">Date (Upcoming)</option>
            <option className="bg-gray-800">Date (Past)</option>
            <option className="bg-gray-800">Alphabetical (A-Z)</option>
            <option className="bg-gray-800">Location</option>
          </select>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="mt-8 space-y-3">
        <button
          onClick={onClearFilters}
          className="w-full bg-transparent text-gray-300 border border-gray-500 py-2 px-4 rounded-lg hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium">
          Clear Filters
        </button>
      </div>
    </aside>
  );
};

export default FilterSidebar;