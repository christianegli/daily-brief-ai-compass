
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase, getCurrentUser } from '@/lib/supabase';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { user: currentUser } = await getCurrentUser();
        setUser(currentUser || null);
      } catch (error) {
        console.error('Error getting current user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    // Initial user check
    checkUser();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      setUser(data?.user || null);
      toast.success("Successfully signed in!");
      navigate('/');
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast.error(error.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      toast.success("Registration successful! Please check your email to confirm your account.");
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast.error(error.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setUser(null);
      toast.success("Successfully signed out!");
      navigate('/login');
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast.error(error.message || "Failed to sign out");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn: handleSignIn,
        signUp: handleSignUp,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
