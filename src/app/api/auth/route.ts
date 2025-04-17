import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://mnwtskbpvadlntjapwyw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ud3Rza2JwdmFkbG50amFwd3l3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4OTMzOTIsImV4cCI6MjA2MDQ2OTM5Mn0.-xOOs36h-nd80BjRPhsmNsLEyy1BBTuhYp4Uc3Asvkc';

// Create a supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  
  if (action === 'status') {
    return NextResponse.json({ status: 'ok' });
  }
  
  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, name } = body;
    
    // Create a simple profile
    if (action === 'create-profile' && name) {
      try {
        // Generate unique ID
        const uniqueId = crypto.randomUUID();
        
        // Insert into profiles table
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
          console.error('Profile creation error:', error);
          return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
        
        return NextResponse.json({ 
          success: true, 
          id: uniqueId,
          message: 'Profile created successfully' 
        });
      } catch (err: any) {
        console.error('Exception in profile creation:', err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
      }
    }
    
    // Get profile by name
    if (action === 'get-profile' && name) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', name)
          .limit(1);
        
        if (error) {
          console.error('Error fetching profile:', error);
          return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
        
        if (!data || data.length === 0) {
          return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 });
        }
        
        return NextResponse.json({ 
          success: true, 
          profile: data[0] 
        });
      } catch (err: any) {
        console.error('Exception fetching profile:', err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
      }
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
} 