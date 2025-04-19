"use client";

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { formatDistanceToNow } from 'date-fns';
import { isAdminAuthenticated } from '@/utils/adminAuth';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import FilterBar from '@/components/FilterBar';

interface UserProfile {
  id: string;
  created_at: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  department: string | null;
  stage: string | null;
  recordCounts?: {
    bmi: number;
    water: number;
    sleep: number;
    total: number;
  };
}

interface UsersByDepartment {
  [department: string]: {
    [stage: string]: UserProfile[];
  };
}

const mockUsers: UserProfile[] = [
  {
    id: '1',
    created_at: '2023-05-15T10:30:00Z',
    email: 'john.doe@example.com',
    full_name: 'John Doe',
    avatar_url: null,
    department: 'Engineering',
    stage: 'Senior',
    recordCounts: { bmi: 3, water: 5, sleep: 2, total: 10 },
  },
  {
    id: '2',
    created_at: '2023-05-16T09:15:00Z',
    email: 'jane.smith@example.com',
    full_name: 'Jane Smith',
    avatar_url: null,
    department: 'Marketing',
    stage: 'Junior',
    recordCounts: { bmi: 2, water: 4, sleep: 1, total: 7 },
  },
  {
    id: '3',
    created_at: '2023-05-17T14:45:00Z',
    email: 'alice.johnson@example.com',
    full_name: 'Alice Johnson',
    avatar_url: null,
    department: 'Engineering',
    stage: 'Mid',
    recordCounts: { bmi: 1, water: 2, sleep: 3, total: 6 },
  },
];

// Add a helper to format dates safely
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Unknown';
  try {
    return new Date(dateString).toLocaleDateString();
  } catch (e) {
    return 'Invalid date';
  }
};

// Add helper to sanitize potentially broken text encoding
const sanitizeName = (name: string | null | undefined): string => {
  if (!name) return 'Unnamed User';
  // If the name contains encoding issues (common with non-Latin characters), show a fallback
  if (/Ø|Ù|Û|Ø¹|Ø¨/.test(name)) return 'User';
  return name;
};

// User Profile Modal Component
const UserProfileModal = ({ user, onClose }: { user: UserProfile | null, onClose: () => void }) => {
  if (!user) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">User Profile</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Modal Content */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row">
              {/* User Avatar */}
              <div className="flex-shrink-0 flex items-center justify-center mb-4 md:mb-0 md:mr-6">
                <div className="h-24 w-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                  {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                </div>
              </div>
              
              {/* User Info */}
              <div className="flex-grow">
                <h3 className="text-2xl font-bold text-gray-800">{sanitizeName(user.full_name)}</h3>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-gray-700">{user.email || 'No email provided'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Joined</p>
                    <p className="text-gray-700">{formatDate(user.created_at)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Department</p>
                    <p className="text-gray-700">{user.department || 'Unassigned'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Stage</p>
                    <p className="text-gray-700">{user.stage || 'Unassigned'}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Health Records Summary */}
            {user.recordCounts && (
              <div className="mt-8">
                <h4 className="font-semibold text-gray-800 mb-4">Health Records</h4>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-md text-center">
                      <div className="text-2xl font-bold text-blue-600">{user.recordCounts.bmi}</div>
                      <div className="text-sm text-gray-500">BMI Records</div>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-md text-center">
                      <div className="text-2xl font-bold text-indigo-600">{user.recordCounts.water}</div>
                      <div className="text-sm text-gray-500">Water Records</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-md text-center">
                      <div className="text-2xl font-bold text-purple-600">{user.recordCounts.sleep}</div>
                      <div className="text-sm text-gray-500">Sleep Records</div>
                    </div>
                    <div className="bg-gray-200 p-4 rounded-md text-center">
                      <div className="text-2xl font-bold text-gray-700">{user.recordCounts.total}</div>
                      <div className="text-sm text-gray-500">Total Records</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
              <button 
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Close
              </button>
              <button 
                className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                View Complete Records
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [stageFilter, setStageFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'username', direction: 'asc' });
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Check if the user is authenticated
    if (!isAdminAuthenticated()) {
      router.push('/admin/login');
      return;
    }

    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/admin/users');
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}. Details: ${errorText}`);
        }
        
        const data = await response.json();
        // Ensure we're working with an array
        const usersArray = Array.isArray(data) ? data : [];
        setUsers(usersArray);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch users');
        
        // In development mode, use mock data
        if (process.env.NODE_ENV === 'development') {
          console.log('Using mock data in development mode');
          setUsers(mockUsers);
        } else {
          // Initialize with empty array to prevent errors
          setUsers([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [router]);

  // Filter users based on search term and filters
  const filteredUsers = (users || []).filter(user => {
    const matchesSearch = searchTerm 
      ? (user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
         user.email?.toLowerCase().includes(searchTerm.toLowerCase()))
      : true;
    
    const matchesDepartment = departmentFilter === 'all' || 
      user.department === departmentFilter;
    
    const matchesStage = stageFilter === 'all' || 
      user.stage === stageFilter;
    
    return matchesSearch && matchesDepartment && matchesStage;
  });

  // Group users by department and stage
  const groupUsersByDepartmentAndStage = (userList: UserProfile[]): UsersByDepartment => {
    return userList.reduce((acc: UsersByDepartment, user) => {
      const department = user.department || 'Unassigned';
      const stage = user.stage || 'Unassigned';
      
      if (!acc[department]) {
        acc[department] = {};
      }
      
      if (!acc[department][stage]) {
        acc[department][stage] = [];
      }
      
      acc[department][stage].push(user);
      return acc;
    }, {});
  };

  // Group filtered users by department and stage
  const usersByDepartment = groupUsersByDepartmentAndStage(filteredUsers);

  // Handler for showing user profile
  const handleViewUserProfile = (user: UserProfile) => {
    setSelectedUser(user);
  };

  // Handler for closing modal
  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  // Display loading state
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Users</h1>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Display error message
  if (error && users.length === 0) {
    return (
      <AdminLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Users</h1>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p><strong>Error:</strong> {error}</p>
          </div>
          <p>Please try again later or contact support if the problem persists.</p>
        </div>
      </AdminLayout>
    );
  }

  // Display empty state
  if (users.length === 0) {
    return (
      <AdminLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Users</h1>
          <div className="text-center py-10">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">No users are currently registered in the system.</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Users</h1>
            {error && (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded text-sm">
                <p>Showing partial data. Error: {error}</p>
              </div>
            )}
          </div>
          
          {/* Replace the custom filter UI with the FilterBar component */}
          <FilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            departmentFilter={departmentFilter}
            setDepartmentFilter={setDepartmentFilter}
            stageFilter={stageFilter}
            setStageFilter={setStageFilter}
            totalCount={users.length}
            filteredCount={filteredUsers.length}
            title="Filter Users"
          />
        </div>

        {/* Display empty state for filtered results */}
        {filteredUsers.length === 0 && users.length > 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No matching users</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setDepartmentFilter('all');
                setStageFilter('all');
              }}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* User groups by department and stage */}
        <div className="grid grid-cols-1 gap-6">
          {Object.entries(usersByDepartment).map(([department, stageGroups]) => (
            <div key={department} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-blue-600 px-4 py-2 text-white font-semibold">
                {department} ({Object.values(stageGroups).flat().length} users)
              </div>
              <div className="p-4">
                {Object.entries(stageGroups).map(([stage, stageUsers]) => (
                  <div key={stage} className="mb-4 last:mb-0">
                    <h3 className="text-lg font-semibold mb-2 text-gray-700">
                      {stage} ({stageUsers.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {stageUsers.map((user) => (
                        <div 
                          key={user.id} 
                          className="bg-gray-50 p-4 rounded-md border border-gray-200 hover:bg-blue-50 hover:border-blue-200 cursor-pointer transition-colors"
                          onClick={() => handleViewUserProfile(user)}
                        >
                          <div className="flex items-center mb-2">
                            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold mr-3">
                              {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                              <div className="font-medium">
                                {sanitizeName(user.full_name)}
                              </div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600 mt-2">
                            <div>
                              Joined: {formatDate(user.created_at)}
                            </div>
                            {user.recordCounts && (
                              <div className="mt-1 grid grid-cols-4 gap-1 text-xs">
                                <div className="bg-blue-100 p-1 rounded text-center">
                                  <span className="font-semibold">{user.recordCounts.bmi}</span> BMI
                                </div>
                                <div className="bg-blue-100 p-1 rounded text-center">
                                  <span className="font-semibold">{user.recordCounts.water}</span> Water
                                </div>
                                <div className="bg-blue-100 p-1 rounded text-center">
                                  <span className="font-semibold">{user.recordCounts.sleep}</span> Sleep
                                </div>
                                <div className="bg-gray-100 p-1 rounded text-center">
                                  <span className="font-semibold">{user.recordCounts.total}</span> Total
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Profile Modal */}
      {selectedUser && (
        <UserProfileModal 
          user={selectedUser} 
          onClose={handleCloseModal} 
        />
      )}
    </AdminLayout>
  );
} 