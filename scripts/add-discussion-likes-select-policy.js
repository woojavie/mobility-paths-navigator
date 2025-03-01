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
  console.log('Checking and fixing discussion_likes table permissions...');

  try {
    // Get Supabase credentials
    const { supabaseUrl, supabaseKey } = await promptForCredentials();
    
    // Initialize Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test if we can access the discussion_likes table
    console.log('Testing access to discussion_likes table...');
    const { data, error } = await supabase
      .from('discussion_likes')
      .select('*')
      .limit(1);
    
    if (error) {
      if (error.code === 'PGRST301') {
        console.log('Confirmed: Permission issue detected. Please run the following SQL in your Supabase SQL editor:');
        console.log('\n-------------------------------------------');
        console.log('CREATE POLICY "Anyone can read discussion likes" ON public.discussion_likes FOR SELECT USING (true);');
        console.log('-------------------------------------------\n');
        console.log('After running this SQL, the like/unlike functionality should work correctly.');
      } else {
        console.error('Unexpected error:', error.message);
      }
    } else {
      console.log('✅ No permission issues detected. The discussion_likes table is accessible.');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

main(); 