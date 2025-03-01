#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const readline = require('readline');

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
  console.log('Adding missing SELECT policy for discussion_likes table...');

  try {
    // Get Supabase credentials
    const { supabaseUrl, supabaseKey } = await promptForCredentials();
    
    // Initialize Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Simple SQL to add the policy
    const sql = `
      CREATE POLICY IF NOT EXISTS "Anyone can read discussion likes" 
      ON public.discussion_likes FOR SELECT USING (true);
    `;
    
    // Execute SQL directly
    const { error } = await supabase.sql(sql);
    if (error) throw error;
    
    console.log('✅ Policy added successfully! Like/unlike functionality should now work correctly.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

main(); 