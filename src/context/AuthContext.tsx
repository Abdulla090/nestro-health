"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  supabase, 
  Profile, 
  getProfile, 
  createSimpleProfile, 
  getProfileByName,
  signIn as supabaseSignIn,
  signUp as supabaseSignUp,
  signOut as supabaseSignOut,
  updateProfile as supabaseUpdateProfile,
  createProfile as supabaseCreateProfile,
  signInWithMagicLink
} from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';

// Define User type
interface User {
  id: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: any }>;
  signInWithMagic: (email: string) => Promise<{ success: boolean; error?: any }>;
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: any }>;
  signOut: () => Promise<void>;
  getProfile: () => Promise<Profile | null>;
  updateProfile: (data: Partial<Profile>) => Promise<{ success: boolean; error?: any }>;
  createProfile: (name: string) => Promise<{ success: boolean; error?: any }>;
  loadProfileByName: (name: string) => Promise<{ success: boolean; error?: any }>;
  setProfile: (profile: Profile | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();

  // Check for stored profile ID
  useEffect(() => {
    const checkStoredProfile = async () => {
      setLoading(true);
      const storedProfileId = localStorage.getItem('profileId');
      
      if (storedProfileId) {
        const { data: profileData } = await getProfile(storedProfileId);
        if (profileData) {
          setProfile(profileData);
        } else {
          // Clear invalid stored profile
          localStorage.removeItem('profileId');
        }
      }
      
      setLoading(false);
    };
    
    checkStoredProfile();
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabaseSignIn(email, password);
      
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }
      
      if (data.user) {
        setUser({ id: data.user.id, email: data.user.email });
        
        // Fetch user profile
        const { data: profileData } = await getProfile(data.user.id);
        if (profileData) {
          setProfile(profileData);
        }
        
        return { success: true };
      }
      
      return { success: false, error: 'Sign in failed' };
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign in');
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Sign in with magic link function
  const signInWithMagic = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await signInWithMagicLink(email);
      
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }
      
      // Success - email has been sent
      return { success: true };
    } catch (err: any) {
      setError(err.message || 'An error occurred sending the magic link');
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabaseSignUp(email, password);
      
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }
      
      if (data.user) {
        setUser({ id: data.user.id, email: data.user.email });
        
        // Create profile for the new user
        const { error: profileError } = await supabaseCreateProfile({
          id: data.user.id,
          username: name,
          full_name: name,
          language_preference: language as 'en' | 'ku',
        });
        
        if (profileError) {
          setError(profileError.message);
          return { success: false, error: profileError.message };
        }
        
        // Fetch the created profile
        const { data: profileData } = await getProfile(data.user.id);
        if (profileData) {
          setProfile(profileData);
        }
        
        return { success: true };
      }
      
      return { success: false, error: 'Sign up failed' };
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign up');
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Get profile function
  const getUserProfile = async (): Promise<Profile | null> => {
    if (!user) return null;
    
    try {
      const { data, error } = await getProfile(user.id);
      
      if (error) {
        setError(error.message);
        return null;
      }
      
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch profile');
      return null;
    }
  };

  // Update profile function
  const updateUserProfile = async (updates: Partial<Profile>) => {
    if (!profile) {
      return { success: false, error: 'No profile to update' };
    }
    
    try {
      setLoading(true);
      const { error } = await supabaseUpdateProfile(profile.id, updates);
      
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }
      
      // Update local state with the changes
      setProfile({ ...profile, ...updates });
      return { success: true };
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Create profile with just a name
  const createProfileWithName = async (name: string) => {
    if (!name.trim()) {
      return { success: false, error: 'Name is required' };
    }
    
    try {
      setLoading(true);
      setError(null);
      console.log('Creating profile with name:', name);
      
      // Check if profile with this name already exists
      const { data: existingProfile, error: searchError } = await getProfileByName(name);
      
      if (existingProfile) {
        // Profile exists, use it
        console.log('Profile already exists, using it:', existingProfile);
        setProfile(existingProfile);
        localStorage.setItem('profileId', existingProfile.id);
        return { success: true };
      }
      
      if (searchError) {
        console.error('Error searching for existing profile:', searchError);
      }
      
      // Create new profile
      console.log('Creating new profile...');
      const { error, id } = await createSimpleProfile(name);
      
      if (error) {
        console.error('Error creating profile:', error);
        setError(error.message);
        return { success: false, error };
      }
      
      if (id) {
        console.log('New profile created with ID:', id);
        
        // Get the newly created profile
        const { data: newProfile } = await getProfile(id);
        if (newProfile) {
          console.log('New profile loaded:', newProfile);
          setProfile(newProfile);
          localStorage.setItem('profileId', id);
        } else {
          console.error('Could not find newly created profile');
        }
      } else {
        console.error('No ID returned from profile creation');
        return { success: false, error: { message: 'Failed to create profile' } };
      }
      
      return { success: true };
    } catch (err: any) {
      console.error('Exception in createProfileWithName:', err);
      setError(err.message || 'Failed to create profile');
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Load profile by name
  const loadProfileByName = async (name: string) => {
    setLoading(true);
    setError(null);
    console.log('Loading profile by name:', name);
    
    try {
      const { data, error } = await getProfileByName(name);
      
      if (error) {
        console.error('Error loading profile:', error);
        setError(error.message || 'Failed to load profile');
        setProfile(null);
        return { success: false, error: error.message };
      }
      
      if (!data) {
        console.error('Profile not found');
        setError('Profile not found');
        setProfile(null);
        return { success: false, error: 'Profile not found' };
      }
      
      // Set profile data and save ID to localStorage
      console.log('Profile found:', data);
      setProfile(data);
      localStorage.setItem('profileId', data.id);
      
      // Log success for debugging
      console.log('Profile loaded successfully:', data.username);
      
      return { success: true };
    } catch (err: any) {
      console.error('Exception in loadProfileByName:', err);
      setError(err.message || 'An unexpected error occurred');
      setProfile(null);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // No need to call supabaseSignOut for name-only profiles
      // Just clear the local storage and state
      localStorage.removeItem('profileId');
      setUser(null);
      setProfile(null);
    } catch (err: any) {
      setError(err.message || 'Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  // Handle setting the profile state
  const setProfileData = (profile: Profile | null) => {
    if (profile) {
      // Validate that the profile has a valid ID
      if (!profile.id) {
        console.error('Profile missing ID:', profile);
      } else {
        console.log('Setting profile with ID:', profile.id);
      }
    }
    
    setProfile(profile);
  };

  const value: AuthContextType = {
    user,
    profile,
    loading,
    error,
    signIn,
    signInWithMagic,
    signUp,
    signOut,
    getProfile: getUserProfile,
    updateProfile: updateUserProfile,
    createProfile: createProfileWithName,
    loadProfileByName,
    setProfile: setProfileData
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 