
import { createClient } from '@supabase/supabase-js';

// Supabase client initialization with environment variables populated by Lovable's Supabase integration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Make sure your Supabase integration is properly set up.');
}

// Provide a valid URL even if the environment variable is missing (to prevent runtime errors)
// This will create a client that won't work, but won't crash the app immediately
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
);

// Authentication helper functions
export const signUp = async (email: string, password: string) => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return { data: null, error: new Error('Supabase configuration is missing. Please check your environment variables.') };
  }
  
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return { data: null, error: new Error('Supabase configuration is missing. Please check your environment variables.') };
  }
  
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
};

export const signOut = async () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return { error: new Error('Supabase configuration is missing. Please check your environment variables.') };
  }
  
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return { user: null, error: new Error('Supabase configuration is missing. Please check your environment variables.') };
  }
  
  const { data, error } = await supabase.auth.getSession();
  return { user: data?.session?.user, error };
};
