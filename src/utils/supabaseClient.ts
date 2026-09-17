import { createClient } from '@supabase/supabase-js';

const DEFAULT_URL = 'https://riuyniqxmwcvjmqobwsr.supabase.co';
const DEFAULT_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpdXluaXF4bXdjdmptcW9id3NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0NjExNzQsImV4cCI6MjEwNTAzNzE3NH0.4cb_WWK4JCJZ89XgWeTCLKXc49JZ2OAuaEAhEYBPU_U';

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || DEFAULT_URL).trim().replace(/"/g, '');
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_ANON_KEY).trim().replace(/"/g, '');

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
