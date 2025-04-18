"use client";

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { formatDistanceToNow } from 'date-fns';

interface User {
  id: string;
  username: string;
  department: string;
  stage: string;
  joinDate: string;
  status: 'active' | 'inactive';
  recordCount: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [stageFilter, setStageFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'username', direction: 'asc' });

  // Departments list (matching the profile creation options)
  const departments = [
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
    { value: "Geology", label: "Geology" }
  ];

  // Stages list
  const stages = [
    { value: "all", label: "All Stages" },
    { value: "First", label: "First" },
    { value: "Second", label: "Second" },
    { value: "Third", label: "Third" },
    { value: "Fourth", label: "Fourth" },
    { value: "Fifth", label: "Fifth" },
    { value: "Sixth", label: "Sixth" }
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Simulated API call - replace with actual API call
        const response = await fetch('/api/admin/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        // For demo, using mock data
        const mockUsers = [
          {
            id: '1',
            username: 'John Doe',
            department: 'Computer Science',
            stage: 'Third',
            joinDate: '2024-01-15',
            status: 'active',
            recordCount: 5
          },
          // Add more mock users here
        ];
        setUsers(mockUsers);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const formatDate = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const filteredAndSortedUsers = users
    .filter(user => {
      const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = departmentFilter === 'all' || user.department === departmentFilter;
      const matchesStage = stageFilter === 'all' || user.stage === stageFilter;
      return matchesSearch && matchesDepartment && matchesStage;
    })
    .sort((a, b) => {
      const direction = sortConfig.direction === 'asc' ? 1 : -1;
      if (a[sortConfig.key] < b[sortConfig.key]) return -1 * direction;
      if (a[sortConfig.key] > b[sortConfig.key]) return 1 * direction;
      return 0;
    });

  // Group users by department and stage
  const groupedUsers = filteredAndSortedUsers.reduce((acc, user) => {
    const key = `${user.department}-${user.stage}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(user);
    return acc;
  }, {} as Record<string, User[]>);

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Users Management</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <input
                type="text"
                placeholder="Search users..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                {departments.map((dept) => (
                  <option key={dept.value} value={dept.value}>
                    {dept.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
              >
                {stages.map((stage) => (
                  <option key={stage.value} value={stage.value}>
                    {stage.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedUsers).map(([key, groupUsers]) => {
              const [department, stage] = key.split('-');
              return (
                <div key={key} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {department} - Stage {stage}
                    </h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort('username')}
                          >
                            User
                            {sortConfig.key === 'username' && (
                              <span className="ml-1">
                                {sortConfig.direction === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Join Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Records
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {groupUsers.map((user) => (
                          <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{user.username}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{formatDate(user.joinDate)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.recordCount}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button className="text-blue-600 hover:text-blue-900 mr-4">View</button>
                              <button className="text-red-600 hover:text-red-900">Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
} 