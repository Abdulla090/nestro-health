"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export default function CreateProfilePage() {
  const { t } = useLanguage();
  const { profile, loading, createProfile, loadProfileByName } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [stage, setStage] = useState('');
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [savedProfiles, setSavedProfiles] = useState<string[]>([]);

  // Departments
  const departments = [
    { value: "", label: "Select Department" },
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

  // Stages
  const stages = [
    { value: "", label: "Select Stage" },
    { value: "First", label: "First" },
    { value: "Second", label: "Second" },
    { value: "Third", label: "Third" },
    { value: "Fourth", label: "Fourth" },
    { value: "Fifth", label: "Fifth" },
    { value: "Sixth", label: "Sixth" }
  ];

  // Redirect if already has a profile
  useEffect(() => {
    // Check for query parameter that indicates we came from a redirect
    const url = new URL(window.location.href);
    const fromAuth = url.searchParams.get('from') === 'signin' || 
                    url.searchParams.get('no_redirect') === 'true';
    
    // If we already have a profile and we're not coming from an auth redirect,
    // redirect to the profile page
    if (!loading && profile && !fromAuth) {
      console.log('Profile already exists, redirecting to profile page');
      window.location.href = '/profile';
    }
    
    // Load saved profile names from localStorage
    const loadSavedProfiles = () => {
      const profilesJson = localStorage.getItem('savedProfileNames');
      if (profilesJson) {
        try {
          const profiles = JSON.parse(profilesJson);
          if (Array.isArray(profiles)) {
            setSavedProfiles(profiles);
          }
        } catch (e) {
          console.error('Error parsing saved profiles:', e);
        }
      }
    };
    
    loadSavedProfiles();
  }, [profile, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name.trim()) {
      setError(t('auth.nameRequired'));
      return;
    }

    if (!department) {
      setError('Department is required');
      return;
    }

    if (!stage) {
      setError('Stage is required');
      return;
    }
    
    try {
      setIsCreating(true);
      console.log('Creating profile with name:', name, 'department:', department, 'stage:', stage);
      const { success, error } = await createProfile(name, department, stage);
      console.log('Profile creation result:', success, error);
      
      if (!success) {
        setError(error?.message || 'Failed to create profile');
        return;
      }
      
      // Save name to localStorage for future use
      const updatedProfiles = [...savedProfiles];
      if (!updatedProfiles.includes(name)) {
        updatedProfiles.push(name);
        localStorage.setItem('savedProfileNames', JSON.stringify(updatedProfiles));
      }
      
      // Redirect to profile page after successful creation
      console.log('Redirecting to profile page');
      
      // Set a flag in localStorage to indicate a successful redirect is in progress
      localStorage.setItem('redirectingToProfile', 'true');
      
      // Use a short timeout to ensure state is saved before redirect
      setTimeout(() => {
        window.location.href = '/profile';
      }, 100);
    } catch (err: any) {
      console.error('Error creating profile:', err);
      setError(err.message || 'Failed to create profile');
    } finally {
      setIsCreating(false);
    }
  };

  const handleLoadProfile = async (profileName: string) => {
    try {
      setError('');
      setIsCreating(true);
      console.log('Loading profile by name:', profileName);
      const { success, error } = await loadProfileByName(profileName);
      console.log('Load profile result:', success, error);
      
      if (!success) {
        setError(error?.message || 'Failed to load profile');
        return;
      }
      
      // Redirect to profile page after successful load
      console.log('Redirecting to profile page');
      window.location.href = '/profile';
    } catch (err: any) {
      console.error('Error loading profile:', err);
      setError(err.message || 'Failed to load profile');
    } finally {
      setIsCreating(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            {t('auth.createProfile')}
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('auth.enterName')}
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <div className="rounded-md shadow-sm">
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.name')}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder={t('auth.name')}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <select
                id="department"
                name="department"
                required
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                {departments.map((dept) => (
                  <option key={dept.value} value={dept.value}>
                    {dept.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="stage" className="block text-sm font-medium text-gray-700 mb-2">
                Stage
              </label>
              <select
                id="stage"
                name="stage"
                required
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={stage}
                onChange={(e) => setStage(e.target.value)}
              >
                {stages.map((stg) => (
                  <option key={stg.value} value={stg.value}>
                    {stg.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isCreating}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {isCreating ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('auth.creatingProfile')}
                </span>
              ) : (
                t('auth.createButton')
              )}
            </button>
          </div>
        </form>
        
        {savedProfiles.length > 0 && (
          <div className="mt-8">
            <h2 className="text-center text-lg font-medium text-gray-900 mb-4">
              {t('auth.loadProfile')}
            </h2>
            <div className="space-y-2">
              {savedProfiles.map((profileName) => (
                <button
                  key={profileName}
                  onClick={() => handleLoadProfile(profileName)}
                  className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {profileName}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 