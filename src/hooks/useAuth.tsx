
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, username: string, fullName?: string) => {
    console.log('Attempting signup for:', email, username);
    
    // Use a more reliable redirect URL that works in both environments
    const redirectUrl = window.location.origin;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          username,
          full_name: fullName || ''
        }
      }
    });
    
    console.log('Signup result:', { data, error });
    
    // If signup was successful but user needs email confirmation
    if (data.user && !data.user.email_confirmed_at && !error) {
      console.log('User created but needs email confirmation');
    }
    
    return { data, error };
  };

  const signIn = async (emailOrUsername: string, password: string) => {
    console.log('Attempting signin for:', emailOrUsername);
    
    // Check if input is email (contains @) or username
    const isEmail = emailOrUsername.includes('@');
    
    if (isEmail) {
      // Sign in with email
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailOrUsername,
        password,
      });
      console.log('Email signin result:', { data, error });
      return { data, error };
    } else {
      // Sign in with username - first get email from profiles table
      console.log('Looking up username:', emailOrUsername);
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', emailOrUsername)
        .single();
      
      console.log('Username lookup result:', { profileData, profileError });
      
      if (profileError || !profileData?.email) {
        return { 
          data: null, 
          error: { message: 'Username not found' }
        };
      }
      
      // Sign in with the found email
      const { data, error } = await supabase.auth.signInWithPassword({
        email: profileData.email,
        password,
      });
      console.log('Username signin result:', { data, error });
      return { data, error };
    }
  };

  const signOut = async () => {
    console.log('Signing out user');
    const { error } = await supabase.auth.signOut();
    if (!error) {
      window.location.href = '/auth';
    }
    return { error };
  };

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut
  };
};
