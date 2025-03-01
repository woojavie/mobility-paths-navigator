#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import readline from 'readline';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  console.log('Adding parent_reply_id column to discussion_replies table...');

  try {
    // Get Supabase credentials
    const { supabaseUrl, supabaseKey } = await promptForCredentials();
    
    // Initialize Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'add-parent-reply-id.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Execute the SQL commands
    console.log('Executing SQL migration...');
    
    // Since we can't execute multiple SQL statements at once through the Supabase API,
    // we'll need to inform the user to run this in the SQL editor
    console.log('\nPlease run the following SQL in your Supabase SQL editor:');
    console.log('\n-------------------------------------------');
    console.log(sql);
    console.log('-------------------------------------------\n');
    console.log('After running this SQL, the reply-to-reply functionality will be available.');
    
    // Test if we can access the discussion_replies table
    console.log('\nTesting access to discussion_replies table...');
    const { data, error } = await supabase
      .from('discussion_replies')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error accessing discussion_replies table:', error.message);
    } else {
      console.log('✅ Successfully accessed discussion_replies table.');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

main(); 