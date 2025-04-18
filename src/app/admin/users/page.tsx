"use client";

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { getAllProfiles, type Profile } from '@/lib/supabase';

export default function UsersPage() {
  const [users, setUsers] = useState<(Profile & { status: string, recordCount: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'ascending' | 'descending';
  }>({
    key: 'created_at',
    direction: 'descending'
  });

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const { data, error } = await getAllProfiles();
        
        if (error) {
          console.error("Error fetching users:", error);
          return;
        }
        
        // Add status (active/inactive) based on last activity
        // And placeholder recordCount until we implement join query
        const enhancedUsers = data.map(user => {
          const daysSinceCreation = Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24));
          const status = daysSinceCreation < 30 ? "active" : "inactive";
          
          return {
            ...user,
            status,
            recordCount: Math.floor(Math.random() * 20) // Placeholder until we implement proper join
          };
        });
        
        setUsers(enhancedUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchUsers();
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle sorting
  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction: 
        sortConfig.key === key && sortConfig.direction === 'ascending'
          ? 'descending'
          : 'ascending'
    });
  };

  // Filter and sort users
  const filteredAndSortedUsers = users
    .filter(user => {
      // Apply search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        (user.username?.toLowerCase().includes(searchLower) ?? false) ||
        (user.full_name?.toLowerCase().includes(searchLower) ?? false);
      
      // Apply status filter
      const matchesStatus = statusFilter === "all" || user.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Apply sorting
      const direction = sortConfig.direction === 'ascending' ? 1 : -1;
      
      switch (sortConfig.key) {
        case 'username':
          return direction * ((a.username || '').localeCompare(b.username || ''));
        case 'email':
          return direction * ((a.email || '').localeCompare(b.email || ''));
        case 'created_at':
          return direction * (new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        case 'status':
          return direction * (a.status.localeCompare(b.status));
        case 'recordCount':
          return direction * (a.recordCount - b.recordCount);
        default:
          return 0;
      }
    });

  // Get sort icons
  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return '↕';
    return sortConfig.direction === 'ascending' ? '↑' : '↓';
  };

  // Get status color
  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Users</h1>
          <p className="text-gray-600">Manage user accounts</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            className="btn-primary"
          >
            Export Users
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Loading users...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('username')}
                  >
                    User {getSortIcon('username')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('created_at')}
                  >
                    Join Date {getSortIcon('created_at')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    Status {getSortIcon('status')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('recordCount')}
                  >
                    Records {getSortIcon('recordCount')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedUsers.length > 0 ? (
                  filteredAndSortedUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            {user.avatar_url ? (
                              <img className="h-10 w-10 rounded-full" src={user.avatar_url} alt="" />
                            ) : (
                              <span className="text-indigo-600 font-semibold text-lg">
                                {user.username?.[0] || user.full_name?.[0] || '?'}
                              </span>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.full_name || user.username}</div>
                            <div className="text-sm text-gray-500">{user.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(user.created_at)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.recordCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button className="text-indigo-600 hover:text-indigo-900 px-2">
                          View
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 px-2">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                      No users found matching your search criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
} 