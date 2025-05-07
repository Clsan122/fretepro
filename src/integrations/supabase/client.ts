
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xitctqydapolbooqnrul.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpdGN0cXlkYXBvbGJvb3FucnVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNzUyMTksImV4cCI6MjA2MDY1MTIxOX0.aSQGjahTDO_OOUqqonWqQztdKkNpMtqE45HReHtf5Pk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage
  }
});
