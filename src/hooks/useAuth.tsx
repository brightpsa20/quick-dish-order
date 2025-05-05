
import React, { useState, useEffect, useContext, createContext } from 'react';
import { supabase } from '../integrations/supabase/client';

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
    // Set up auth state change listener first
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
    
    // Then check for active session
    const checkSession = async () => {
      setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
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
      }
      
      setLoading(false);
    };
    
    checkSession();
    
    return () => {
      subscription?.unsubscribe();
    };
  }, []);
  
  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in with:', email);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      console.log('Sign in response:', data, error);
      if (error) {
        console.error('Login error:', error);
        return { error };
      }
      return { error: null };
    } catch (error) {
      console.error('Unexpected error during login:', error);
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
