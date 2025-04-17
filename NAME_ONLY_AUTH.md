# Name-Only Authentication Guide

Nestro Health is set up to use a simple name-only authentication system, without requiring email or password. This guide explains how it works and how to troubleshoot common issues.

## How It Works

1. Users only need to provide their name to create a profile
2. The system generates a unique ID for each profile
3. Names are stored in the Supabase `profiles` table
4. The app also saves profile IDs to localStorage for persistence

## The 400 (Bad Request) Error

If you see an error like:
```
POST https://mnwtskbpvadlntjapwyw.supabase.co/auth/v1/token?grant_type=password 400 (Bad Request)
```

This is because the app is still trying to use email/password authentication. We've updated the code to:

1. Redirect from signin/signup pages to the create-profile page
2. Update the navigation to only show "Create Profile" instead of Sign In/Sign Up
3. Modify the authentication context to properly handle name-only profiles

## How to Test

1. Go to the `/create-profile` page directly
2. Enter a name and click "Create Profile"
3. The app will create a profile with just the name and redirect to the profile page

## Required Database Setup

Make sure your Supabase project has the `profiles` table with the correct schema:

```sql
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  username TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  language_preference TEXT DEFAULT 'ku'
);
```

The SQL is available in: `supabase/migrations/20231115000000_create_profiles_table.sql`

## Troubleshooting

If you still see authentication errors, check:

1. That your Supabase profiles table exists with the correct schema
2. That Row Level Security (RLS) is properly configured to allow public read/write
3. That the navigation correctly shows "Create Profile" instead of Sign In/Sign Up
4. That localStorage is working in your browser

## Benefits of Name-Only Authentication

- Extremely simple user experience
- No need for email verification
- Users can quickly create profiles
- Saved names are available for reuse
- Perfect for applications that don't need secure authentication 