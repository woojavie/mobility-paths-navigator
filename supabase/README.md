# Supabase Setup for AccessPath Community

This directory contains the Supabase configuration and migration files for the AccessPath application.

## Community Tables

The community feature requires several tables to be created in your Supabase project:

1. `discussions` - For community discussions and questions
2. `reviews` - For accessibility reviews of places
3. `discussion_replies` - For replies to discussions
4. `discussion_likes` - For tracking likes on discussions and replies
5. `review_likes` - For tracking likes on reviews

## How to Apply Migrations

### Option 1: Using the Supabase CLI

1. Install the Supabase CLI if you haven't already:
   ```bash
   npm install -g supabase
   ```

2. Login to your Supabase account:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref <your-project-ref>
   ```

4. Apply the migrations:
   ```bash
   supabase db push
   ```

### Option 2: Manual SQL Execution

1. Log in to your Supabase dashboard
2. Go to the SQL Editor
3. Copy the contents of the migration file (`migrations/20240301_community_tables.sql`)
4. Paste into the SQL Editor and run the query

## Row Level Security (RLS) Policies

The migration includes RLS policies to ensure data security:

- Everyone can read discussions, reviews, and replies
- Only authenticated users can create new discussions, reviews, replies, and likes
- Users can only update or delete their own content

## Triggers

The migration includes triggers to automatically:

- Update the reply count on discussions when replies are added or deleted
- Update the like count on discussions and replies when likes are added or deleted

## Database Schema

### discussions
- `id` - UUID primary key
- `title` - Text, required
- `content` - Text, required
- `user_id` - UUID, references auth.users
- `author` - Text, required
- `created_at` - Timestamp
- `updated_at` - Timestamp
- `replies_count` - Integer, default 0
- `likes_count` - Integer, default 0

### reviews
- `id` - UUID primary key
- `place` - Text, required
- `location` - Text, required
- `rating` - Numeric(2,1), between 0 and 5
- `text` - Text, required
- `user_id` - UUID, references auth.users
- `author` - Text, required
- `created_at` - Timestamp
- `updated_at` - Timestamp

### discussion_replies
- `id` - UUID primary key
- `discussion_id` - UUID, references discussions
- `content` - Text, required
- `user_id` - UUID, references auth.users
- `author` - Text, required
- `created_at` - Timestamp
- `updated_at` - Timestamp
- `likes_count` - Integer, default 0

### discussion_likes
- `id` - UUID primary key
- `discussion_id` - UUID, references discussions (nullable)
- `reply_id` - UUID, references discussion_replies (nullable)
- `user_id` - UUID, references auth.users
- `created_at` - Timestamp

### review_likes
- `id` - UUID primary key
- `review_id` - UUID, references reviews
- `user_id` - UUID, references auth.users
- `created_at` - Timestamp 