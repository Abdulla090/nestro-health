# Supabase Database Setup

## The 404 Error Issue

The error `mnwtskbpvadlntjapwyw.supabase.co/rest/v1/profiles?select=*&id=eq.d7230218-2550-4237-8378-48a2a4fad01c - Failed to load resource: the server responded with a status of 404` indicates that:

1. The app is trying to access the `profiles` table in Supabase
2. This table either doesn't exist or has incorrect permissions

## Solution

You need to create the `profiles` table in your Supabase project.

### Option 1: Use the SQL Editor in Supabase Dashboard

1. Go to your [Supabase Dashboard](https://app.supabase.io)
2. Select your project: `mnwtskbpvadlntjapwyw`
3. Navigate to the SQL Editor
4. Copy and paste the SQL from the file: `supabase/migrations/20231115000000_create_profiles_table.sql`
5. Run the SQL

### Option 2: Use Supabase CLI

If you have Supabase CLI installed:

```powershell
supabase db push
```

## Schema Details

The table structure matches your application code:

- `id`: UUID primary key
- `username`: The name input by users (required)
- `full_name`: Optional full name 
- `avatar_url`: Optional avatar URL
- `created_at`: Timestamp
- `updated_at`: Timestamp
- `language_preference`: Language preference (defaults to 'ku')

## Permissions

The SQL creates these Row Level Security policies:

1. Anyone can read all profiles
2. Authenticated users can update their own profiles
3. Anyone can create profiles (for your name-only signup flow)

## How Your App Currently Works

1. Users enter just their name in the create-profile page
2. The `createSimpleProfile` function generates a UUID and stores their profile
3. No email or password is needed
4. Names can be reused by selecting from previously used names

This design aligns with your request to "store their information with their name without any email or anything". 