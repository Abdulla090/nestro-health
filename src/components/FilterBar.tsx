'use client';

import React from 'react';

// Available departments and stages in the system
export const DEPARTMENTS = [
  { value: "all", label: "All Departments" },
  { value: "Computer Science", label: "Computer Science" },
  { value: "Information Technology", label: "Information Technology" },
  { value: "Business Administration", label: "Business Administration" },
  { value: "Law", label: "Law" },
  { value: "Medicine", label: "Medicine" },
  { value: "Engineering", label: "Engineering" },
  { value: "Mathematics", label: "Mathematics" },
  { value: "Physics", label: "Physics" },
  { value: "Chemistry", label: "Chemistry" },
  { value: "Biology", label: "Biology" },
  { value: "Nature", label: "Nature" },
  { value: "Geology", label: "Geology" },
  { value: "Uncategorized", label: "Uncategorized" },
  { value: "Unassigned", label: "Unassigned" }
];

export const STAGES = [
  { value: "all", label: "All Stages" },
  { value: "First", label: "First" },
  { value: "Second", label: "Second" },
  { value: "Third", label: "Third" },
  { value: "Fourth", label: "Fourth" },
  { value: "Fifth", label: "Fifth" },
  { value: "Sixth", label: "Sixth" },
  { value: "Senior", label: "Senior" },
  { value: "Mid", label: "Mid" },
  { value: "Junior", label: "Junior" },
  { value: "Unassigned", label: "Unassigned" }
];

interface FilterBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  departmentFilter: string;
  setDepartmentFilter: (value: string) => void;
  stageFilter: string;
  setStageFilter: (value: string) => void;
  showStats?: boolean;
  totalCount?: number;
  filteredCount?: number;
  title?: string;
}

export default function FilterBar({
  searchTerm,
  setSearchTerm,
  departmentFilter,
  setDepartmentFilter,
  stageFilter,
  setStageFilter,
  showStats = true,
  totalCount = 0,
  filteredCount = 0,
  title = "Filters"
}: FilterBarProps) {
  
  const clearFilters = () => {
    setSearchTerm('');
    setDepartmentFilter('all');
    setStageFilter('all');
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        {searchTerm || departmentFilter !== 'all' || stageFilter !== 'all' ? (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear All
          </button>
        ) : null}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Box */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            id="search"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        {/* Department Filter */}
        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
            Department
          </label>
          <select
            id="department"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {DEPARTMENTS.map((dept) => (
              <option key={dept.value} value={dept.value}>
                {dept.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Stage Filter */}
        <div>
          <label htmlFor="stage" className="block text-sm font-medium text-gray-700 mb-1">
            Stage
          </label>
          <select
            id="stage"
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {STAGES.map((stage) => (
              <option key={stage.value} value={stage.value}>
                {stage.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Filter Stats */}
      {showStats && (
        <div className="mt-4 text-sm text-gray-500">
          Showing {filteredCount} of {totalCount} items
          {departmentFilter !== 'all' && ` in ${departmentFilter}`}
          {stageFilter !== 'all' && ` at ${stageFilter} stage`}
          {searchTerm && ` matching "${searchTerm}"`}
        </div>
      )}
    </div>
  );
} 