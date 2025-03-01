# AccessPath Community Setup Guide

This guide provides step-by-step instructions for setting up the community and user profile features in the AccessPath application.

## Prerequisites

Before you begin, make sure you have:

1. A Supabase account and project set up
2. Your Supabase URL and service role key ready
3. Node.js and npm installed

## Setup Steps

### 1. Set Up the Community Tables

The community feature requires several tables to be created in your Supabase project:

```bash
npm run setup:community
```

This script will:
- Create the `discussions` table for community discussions and questions
- Create the `reviews` table for accessibility reviews of places
- Create the `discussion_replies` table for replies to discussions
- Create the `discussion_likes` table for tracking likes on discussions
- Create the `review_likes` table for tracking likes on reviews
- Set up Row Level Security (RLS) policies for data protection
- Create triggers for automatic updates of reply and like counts

### 2. Set Up the Profiles Table

The user profile feature requires a profiles table to be created:

```bash
npm run setup:profiles
```

This script will:
- Create the `profiles` table for storing user information
- Set up a trigger to automatically create a profile when a new user signs up
- Set up RLS policies to protect user data
- Create an index on the username column for better performance

### 3. Configure Environment Variables

Make sure your environment variables are properly set up in your `.env` file:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Verifying the Setup

After running the setup scripts, you can verify that everything is working correctly:

1. Sign up a new user in your application
2. Check that a profile is automatically created for the user
3. Create a new discussion or review in the Community page
4. Verify that the content appears in the appropriate tab

## Troubleshooting

If you encounter any issues during setup:

1. Check the Supabase dashboard to ensure the tables were created correctly
2. Verify that the RLS policies are in place
3. Check the browser console for any errors
4. Ensure your environment variables are correctly set

## Manual Setup (Alternative)

If the setup scripts don't work for any reason, you can manually apply the migrations:

1. Log in to your Supabase dashboard
2. Go to the SQL Editor
3. Copy the contents of the migration files:
   - `supabase/migrations/20240301_community_tables.sql`
   - `supabase/migrations/20240302_profiles_table.sql`
4. Paste into the SQL Editor and run the queries

## Next Steps

After setting up the community and profiles features, you can:

1. Customize the user profile page to allow users to update their username and avatar
2. Add more features to the community page, such as filtering and sorting options
3. Implement notifications for new discussions and replies

For more information, refer to the [Supabase README](./supabase/README.md) and the [Community Setup Documentation](./COMMUNITY_SETUP.md). 