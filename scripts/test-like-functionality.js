#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import readline from 'readline';

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Prompt for Supabase credentials
function promptForCredentials() {
  return new Promise((resolve) => {
    rl.question('Enter your Supabase URL: ', (supabaseUrl) => {
      rl.question('Enter your Supabase service role key: ', (supabaseKey) => {
        resolve({ supabaseUrl, supabaseKey });
      });
    });
  });
}

async function main() {
  console.log('Testing like functionality...');

  try {
    // Get Supabase credentials
    const { supabaseUrl, supabaseKey } = await promptForCredentials();
    
    // Initialize Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get a valid user ID
    console.log('Fetching a valid user ID...');
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (usersError) throw usersError;
    if (!users || users.length === 0) {
      console.error('No users found in the profiles table. Please create a user first.');
      process.exit(1);
    }
    
    const userId = users[0].id;
    console.log(`Using user ID: ${userId}`);
    
    // Get a discussion to test with
    console.log('\nFetching a discussion to test with...');
    let { data: discussions, error: discussionsError } = await supabase
      .from('discussions')
      .select('id')
      .limit(1);
    
    if (discussionsError) throw discussionsError;
    if (!discussions || discussions.length === 0) {
      console.log('No discussions found. Creating a test discussion...');
      const { data: newDiscussion, error: createError } = await supabase
        .from('discussions')
        .insert([
          { 
            title: 'Test Discussion', 
            content: 'This is a test discussion for like functionality.',
            user_id: userId
          }
        ])
        .select();
      
      if (createError) throw createError;
      discussions = newDiscussion;
    }
    
    const discussionId = discussions[0].id;
    console.log(`Using discussion ID: ${discussionId}`);
    
    // Test 1: Check if liked
    console.log('\nTest 1: Checking if user has liked the discussion...');
    const { data: likeCheck, error: likeCheckError } = await supabase
      .from('discussion_likes')
      .select('*')
      .eq('user_id', userId)
      .eq('discussion_id', discussionId)
      .is('reply_id', null);
    
    if (likeCheckError) {
      console.error('❌ Error checking like status:', likeCheckError.message);
    } else {
      const isLiked = likeCheck && likeCheck.length > 0;
      console.log(`✅ Like check successful. User has ${isLiked ? '' : 'not '}liked the discussion.`);
      
      // Test 2: Add like if not liked, or remove if liked
      if (!isLiked) {
        console.log('\nTest 2: Adding like...');
        const { data: addLike, error: addLikeError } = await supabase
          .from('discussion_likes')
          .insert([
            { 
              user_id: userId, 
              discussion_id: discussionId,
              reply_id: null
            }
          ]);
        
        if (addLikeError) {
          console.error('❌ Error adding like:', addLikeError.message);
        } else {
          console.log('✅ Like added successfully!');
        }
      } else {
        console.log('\nTest 2: Removing like...');
        const { data: removeLike, error: removeLikeError } = await supabase
          .from('discussion_likes')
          .delete()
          .eq('user_id', userId)
          .eq('discussion_id', discussionId)
          .is('reply_id', null);
        
        if (removeLikeError) {
          console.error('❌ Error removing like:', removeLikeError.message);
        } else {
          console.log('✅ Like removed successfully!');
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

main(); 