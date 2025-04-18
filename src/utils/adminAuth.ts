'use client';

// Simple client-side admin authentication utility
// In a real application, you would use a more secure authentication method

// Check if the user is authenticated as admin
export const isAdminAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    const adminData = localStorage.getItem('nestroAdmin');
    if (!adminData) return false;
    
    const { isAuthenticated, timestamp } = JSON.parse(adminData);
    
    // Session expires after 24 hours
    const now = new Date().getTime();
    const expiry = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    if (isAuthenticated && (now - timestamp) < expiry) {
      return true;
    }
    
    return false;
  } catch (error) {
    return false;
  }
};

// Admin logout function
export const adminLogout = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('nestroAdmin');
  window.location.href = '/admin/login';
};

// Get admin username
export const getAdminUsername = (): string => {
  if (typeof window === 'undefined') return '';
  
  try {
    const adminData = localStorage.getItem('nestroAdmin');
    if (!adminData) return '';
    
    const { username } = JSON.parse(adminData);
    return username || '';
  } catch (error) {
    return '';
  }
}; 