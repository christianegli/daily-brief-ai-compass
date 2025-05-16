
import { createClient } from '@supabase/supabase-js';

// Supabase client initialization with environment variables populated by Lovable's Supabase integration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if Supabase environment variables are properly set
const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.error('Missing Supabase environment variables. Make sure your Supabase integration is properly set up.');
}

// Create the Supabase client
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
);

// Authentication helper functions with configuration checks
export const signUp = async (email: string, password: string) => {
  if (!isSupabaseConfigured) {
    return { 
      data: null, 
      error: new Error('Supabase is not properly configured. Please check your Supabase integration in the project settings.') 
    };
  }
  
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  if (!isSupabaseConfigured) {
    return { 
      data: null, 
      error: new Error('Supabase is not properly configured. Please check your Supabase integration in the project settings.') 
    };
  }
  
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
};

export const signOut = async () => {
  if (!isSupabaseConfigured) {
    return { error: new Error('Supabase is not properly configured. Please check your Supabase integration in the project settings.') };
  }
  
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  if (!isSupabaseConfigured) {
    return { 
      user: null, 
      error: new Error('Supabase is not properly configured. Please check your Supabase integration in the project settings.') 
    };
  }
  
  const { data, error } = await supabase.auth.getSession();
  return { user: data?.session?.user, error };
};
