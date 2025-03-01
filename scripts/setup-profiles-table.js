#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Prompt for Supabase URL and key
const promptForCredentials = () => {
  return new Promise((resolve) => {
    rl.question('Enter your Supabase URL: ', (supabaseUrl) => {
      rl.question('Enter your Supabase service role key: ', (supabaseKey) => {
        resolve({ supabaseUrl, supabaseKey });
        rl.close();
      });
    });
  });
};

const main = async () => {
  try {
    console.log('Setting up profiles table in Supabase...');
    
    // Get Supabase credentials
    const { supabaseUrl, supabaseKey } = await promptForCredentials();
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Read SQL file
    const sqlFilePath = path.join(__dirname, '..', 'supabase', 'migrations', '20240302_profiles_table.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');
    
    console.log('Executing SQL migration...');
    
    // Execute SQL
    try {
      // Try using pgmigrate function if available
      const { error } = await supabase.rpc('pgmigrate', { query: sql });
      
      if (error) {
        throw error;
      }
    } catch (error) {
      // Fallback to direct query if pgmigrate is not available
      console.log('Falling back to direct SQL execution...');
      const { error: directError } = await supabase.sql(sql);
      
      if (directError) {
        throw directError;
      }
    }
    
    console.log('✅ Profiles table setup completed successfully!');
    console.log('Users will now automatically have profiles created when they sign up.');
    console.log('You can now use the profiles table in your application.');
    
  } catch (error) {
    console.error('❌ Error setting up profiles table:', error.message);
    process.exit(1);
  }
};

main(); 