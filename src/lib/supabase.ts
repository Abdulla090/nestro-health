import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://mnwtskbpvadlntjapwyw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ud3Rza2JwdmFkbG50amFwd3l3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4OTMzOTIsImV4cCI6MjA2MDQ2OTM5Mn0.-xOOs36h-nd80BjRPhsmNsLEyy1BBTuhYp4Uc3Asvkc';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for user profiles
export type Profile = {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at?: string;
  language_preference: 'en' | 'ku';
};

// Types for health records
export type HealthRecord = {
  id: string;
  user_id: string;
  record_type: 'bmi' | 'calories' | 'weight' | 'water' | 'blood_pressure' | 'body_fat';
  record_date: string;
  record_value: number;
  record_value_2?: number; // For measurements that need two values (like blood pressure)
  notes?: string;
  created_at: string;
};

// Auth related functions
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Add a passwordless sign-in method
export const signInWithMagicLink = async (email: string) => {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: typeof window !== 'undefined' ? window.location.origin + '/auth/callback' : undefined,
    }
  });
  
  return { data, error };
};

// Profile related functions
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  return { data, error };
};

export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
  
  return { data, error };
};

export const createProfile = async (profile: Omit<Profile, 'id' | 'created_at'> & { id: string }) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert([
      { 
        ...profile,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ]);
  
  return { data, error };
};

// Simplified profile creation with just a name
export const createSimpleProfile = async (name: string) => {
  console.log('Creating simple profile with name:', name);
  if (!name) {
    console.error('Name is required for profile creation');
    return { error: { message: 'Name is required' }, data: null };
  }
  
  try {
    const uniqueId = crypto.randomUUID();
    console.log('Generated profile ID:', uniqueId);
    
    const { data, error } = await supabase
      .from('profiles')
      .insert([
        { 
          id: uniqueId,
          username: name,
          full_name: name,
          language_preference: 'ku', // Default to Kurdish
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ]);
    
    if (error) {
      console.error('Supabase error creating profile:', error);
      return { data, error, id: null };
    }
    
    console.log('Profile created successfully with ID:', uniqueId);
    return { data, error, id: uniqueId };
  } catch (e) {
    console.error('Exception in createSimpleProfile:', e);
    return { data: null, error: { message: 'Failed to create profile' }, id: null };
  }
};

// Get profile by name
export const getProfileByName = async (name: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', name)
      .limit(1);
    
    if (error) {
      console.error('Error fetching profile by name:', error);
      return { data: null, error };
    }

    // Check if we have any results
    if (!data || data.length === 0) {
      return { data: null, error: { message: 'Profile not found' } };
    }
    
    // Return the first match
    return { data: data[0], error: null };
  } catch (e) {
    console.error('Exception in getProfileByName:', e);
    return { data: null, error: { message: 'Failed to fetch profile' } };
  }
};

// Health records functions
export const createHealthRecord = async (record: Omit<HealthRecord, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('health_records')
    .insert([
      {
        ...record,
        created_at: new Date().toISOString(),
      }
    ]);
  
  return { data, error };
};

export const getHealthRecords = async (userId: string, recordType?: HealthRecord['record_type']) => {
  // Validate userId
  if (!userId) {
    console.error('getHealthRecords called with invalid userId:', userId);
    return { data: null, error: { message: 'Invalid user ID provided' } };
  }

  try {
    console.log(`Fetching health records for user ${userId}${recordType ? ` with type ${recordType}` : ''}`);
    
    let query = supabase
      .from('health_records')
      .select('*')
      .eq('user_id', userId);
    
    if (recordType) {
      query = query.eq('record_type', recordType);
    }
    
    const { data, error } = await query.order('record_date', { ascending: false });
    
    if (error) {
      console.error('Supabase error in getHealthRecords:', error);
    }
    
    console.log(`Retrieved ${data?.length || 0} health records`);
    return { data: data || [], error };
  } catch (err) {
    console.error('Exception in getHealthRecords:', err);
    return { data: [], error: { message: 'Failed to retrieve health records', details: err } };
  }
}; 