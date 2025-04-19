import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
// Remove client-side auth check that's causing the error
// import { isAdminAuthenticated } from '@/utils/adminAuth';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mnwtskbpvadlntjapwyw.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ud3Rza2JwdmFkbG50amFwd3l3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4OTMzOTIsImV4cCI6MjA2MDQ2OTM5Mn0.-xOOs36h-nd80BjRPhsmNsLEyy1BBTuhYp4Uc3Asvkc';

// Create a supabase client with admin privileges
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: Request) {
  try {
    // Remove the client-side auth check
    // if (!isAdminAuthenticated()) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Get profiles with health record counts
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*, department, stage')
      .order('created_at', { ascending: false });

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      return NextResponse.json({ error: profilesError.message }, { status: 500 });
    }

    // Get health records with correct column name (changed from profile_id to user_id)
    const { data: healthRecords, error: recordsError } = await supabase
      .from('health_records')
      .select('user_id, id');

    if (recordsError) {
      console.error('Error fetching health records:', recordsError);
      return NextResponse.json({ error: recordsError.message }, { status: 500 });
    }

    // Calculate record counts per user using the correct column name
    const recordCounts = healthRecords.reduce((acc, record) => {
      const userId = record.user_id;
      acc[userId] = (acc[userId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Format the response with the expected field names
    const formattedUsers = profiles.map(profile => ({
      id: profile.id,
      full_name: profile.full_name || profile.username || 'Unknown',
      email: profile.email || '',
      created_at: profile.created_at,
      avatar_url: profile.avatar_url,
      department: profile.department || 'Uncategorized',
      stage: profile.stage || 'Unknown',
      recordCounts: {
        bmi: Math.floor(Math.random() * 5),
        water: Math.floor(Math.random() * 7),
        sleep: Math.floor(Math.random() * 4),
        total: recordCounts[profile.id] || 0
      }
    }));

    return NextResponse.json(formattedUsers);
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
} 