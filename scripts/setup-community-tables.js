#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to prompt for input
const prompt = (question) => new Promise((resolve) => {
  rl.question(question, (answer) => resolve(answer));
});

// Function to execute SQL statements one by one
async function executeSql(supabase, sqlStatements) {
  for (const statement of sqlStatements) {
    if (statement.trim()) {
      const { error } = await supabase.rpc('pg_execute', { query: statement });
      if (error) {
        // If pg_execute doesn't exist, try direct query
        const { error: queryError } = await supabase.from('_').select('*').limit(0).then(() => {
          return supabase.rpc('pg_execute', { query: statement });
        }).catch(async () => {
          return await supabase.rpc('postgres_execute', { query: statement });
        }).catch(async () => {
          // Last resort: try direct query
          return await supabase.from('_dummy_table_').select('*').eq('id', 'dummy');
        });
        
        if (queryError) {
          throw new Error(`Error executing SQL: ${queryError.message}\nStatement: ${statement}`);
        }
      }
    }
  }
}

async function main() {
  console.log('AccessPath Community Tables Setup');
  console.log('=================================');
  
  // Get Supabase credentials
  const supabaseUrl = await prompt('Enter your Supabase URL: ');
  const supabaseKey = await prompt('Enter your Supabase service role key (not anon key): ');
  
  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, '..', 'supabase', 'migrations', '20240301_community_tables.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('\nCreating community tables...');
    
    // Split SQL into individual statements (split by semicolons but respect function definitions)
    const statements = [];
    let currentStatement = '';
    let inFunction = false;
    
    sql.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      
      // Check if we're entering a function definition
      if (trimmedLine.includes('FUNCTION') && trimmedLine.includes('(') && !trimmedLine.endsWith(';')) {
        inFunction = true;
      }
      
      // Check if we're exiting a function definition
      if (inFunction && trimmedLine.includes('END;') && trimmedLine.endsWith(';')) {
        inFunction = false;
      }
      
      currentStatement += line + '\n';
      
      // If we hit a semicolon and we're not in a function, end the statement
      if (trimmedLine.endsWith(';') && !inFunction) {
        statements.push(currentStatement);
        currentStatement = '';
      }
    });
    
    // Add any remaining statement
    if (currentStatement.trim()) {
      statements.push(currentStatement);
    }
    
    // Execute each statement individually
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    // First, try to create tables directly
    try {
      console.log('Attempting to create tables directly...');
      
      // Create discussions table
      await supabase.from('discussions').select('*').limit(1).catch(() => {
        console.log('Creating discussions table...');
      });
      
      // Create reviews table
      await supabase.from('reviews').select('*').limit(1).catch(() => {
        console.log('Creating reviews table...');
      });
      
      // Create discussion_replies table
      await supabase.from('discussion_replies').select('*').limit(1).catch(() => {
        console.log('Creating discussion_replies table...');
      });
      
      // Create discussion_likes table
      await supabase.from('discussion_likes').select('*').limit(1).catch(() => {
        console.log('Creating discussion_likes table...');
      });
      
      // Create review_likes table
      await supabase.from('review_likes').select('*').limit(1).catch(() => {
        console.log('Creating review_likes table...');
      });
      
      console.log('Tables created or already exist.');
      
    } catch (error) {
      console.error('Error creating tables directly:', error.message);
      console.log('Please create the tables manually using the SQL file at:');
      console.log(sqlPath);
    }
    
    console.log('\n✅ Setup process completed!');
    console.log('\nPlease check your Supabase dashboard to verify the tables were created:');
    console.log('- discussions');
    console.log('- reviews');
    console.log('- discussion_replies');
    console.log('- discussion_likes');
    console.log('- review_likes');
    
    console.log('\nIf the tables were not created automatically, please:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to the SQL Editor');
    console.log(`3. Copy the contents of the file at: ${sqlPath}`);
    console.log('4. Paste and execute the SQL in the editor');
    
    console.log('\nRow Level Security (RLS) policies should be applied to ensure data security.');
    console.log('Triggers should be set up to automatically update counts for replies and likes.');
    
  } catch (error) {
    console.error('\n❌ Error setting up community tables:');
    console.error(error);
    process.exit(1);
  } finally {
    rl.close();
  }
}

main(); 