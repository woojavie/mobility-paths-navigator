# AccessPath Community Feature Implementation

This document provides an overview of the community feature implementation for the AccessPath application.

## Overview

The community feature allows users to:
- Create and view discussions about accessibility topics
- Post and read reviews of places with accessibility ratings
- View other community members and their contributions

## Implementation Details

### Database Tables

The following tables have been created in Supabase:

1. `discussions` - Stores community discussions and questions
2. `reviews` - Stores accessibility reviews of places
3. `discussion_replies` - Stores replies to discussions
4. `discussion_likes` - Tracks likes on discussions and replies
5. `review_likes` - Tracks likes on reviews

### Components

The following components have been created:

1. **Form Components**
   - `DiscussionForm` - Form for creating new discussions
   - `ReviewForm` - Form for creating new accessibility reviews

2. **UI Components**
   - `NewPostDialog` - Dialog for adding new discussions or reviews
   - `CommunityPage` - Main page for the community feature

3. **Services**
   - `communityService.ts` - Service for interacting with the community data in Supabase

### Security

Row Level Security (RLS) policies have been implemented to ensure:
- Everyone can read discussions, reviews, and replies
- Only authenticated users can create new content
- Users can only update or delete their own content

### Setup Instructions

To set up the community feature:

1. Run the SQL migration to create the necessary tables:
   ```bash
   npm run setup:community
   ```

2. This will prompt you for your Supabase URL and service role key.

3. The script will create all required tables, triggers, and RLS policies.

## Usage

### Creating Discussions

Users can create new discussions by:
1. Clicking the "New Discussion" button on the Community page
2. Filling out the discussion form with a title and content
3. Submitting the form

### Creating Reviews

Users can create new accessibility reviews by:
1. Clicking the "Write Review" button on the Community page
2. Filling out the review form with place details, rating, and review text
3. Submitting the form

### Viewing Content

The Community page has three tabs:
1. **Discussions** - View and search community discussions
2. **Reviews** - View and search accessibility reviews
3. **Members** - View community members and their contributions

## Future Enhancements

Potential future enhancements include:
1. Ability to reply to discussions
2. Like/unlike functionality for discussions and reviews
3. User profile pages showing all contributions
4. Notifications for replies to discussions
5. Filtering options for discussions and reviews
6. Image uploads for reviews 