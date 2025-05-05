
import React, { useState, useEffect, useContext, createContext } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Initialize Supabase client with environment variables or default placeholders
// that won't cause URL construction errors
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://placeholder-url.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "placeholder-key";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check for active session on component mount
    const checkSession = async () => {
      setLoading(true);
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (session) {
        // Get user details from database
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, email, role')
          .eq('id', session.user.id)
          .single();
          
        if (userData) {
          setUser(userData);
          setIsAdmin(userData.role === 'admin');
        }
      }
      
      setLoading(false);
    };
    
    checkSession();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          // Get user details from database
          const { data: userData } = await supabase
            .from('users')
            .select('id, email, role')
            .eq('id', session.user.id)
            .single();
            
          if (userData) {
            setUser(userData);
            setIsAdmin(userData.role === 'admin');
          }
        } else {
          setUser(null);
          setIsAdmin(false);
        }
        setLoading(false);
      }
    );
    
    return () => {
      subscription?.unsubscribe();
    };
  }, []);
  
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        return { error };
      }
      return { error: null };
    } catch (error) {
      return { error };
    }
  };
  
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signOut,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { supabase };
