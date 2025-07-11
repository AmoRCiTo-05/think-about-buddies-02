
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email || 'No user');
      setAuthState({
        user: session?.user ?? null,
        session,
        loading: false,
      });
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change:', event, session?.user?.email || 'No user');
        setAuthState({
          user: session?.user ?? null,
          session,
          loading: false,
        });
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, username: string, fullName?: string) => {
    console.log('Attempting signup for:', email, username);
    
    // Use production domain for email redirects, fallback to current origin
    const isProduction = window.location.hostname !== 'localhost';
    const redirectUrl = isProduction 
      ? window.location.origin 
      : 'https://thinkfriends.vercel.app';
    
    console.log('Using redirect URL:', redirectUrl);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          username,
          full_name: fullName || username,
        }
      },
    });

    if (error) {
      console.error('Signup error:', error);
      throw error;
    }

    console.log('Signup successful:', data);
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    console.log('Attempting signin for:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Signin error:', error);
      throw error;
    }
    
    console.log('Signin successful:', data);
    return { data, error };
  };

  const signOut = async () => {
    console.log('Signing out user');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Signout error:', error);
    }
    return { error };
  };

  const resetPassword = async (email: string) => {
    console.log('Requesting password reset for:', email);
    
    // Use production domain for password reset redirects too
    const isProduction = window.location.hostname !== 'localhost';
    const redirectUrl = isProduction 
      ? `${window.location.origin}/auth?mode=reset` 
      : 'https://thinkfriends.vercel.app/auth?mode=reset';
    
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });
    
    if (error) {
      console.error('Password reset error:', error);
      throw error;
    }
    
    console.log('Password reset email sent:', data);
    return { data, error };
  };

  return {
    user: authState.user,
    session: authState.session,
    loading: authState.loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };
};
