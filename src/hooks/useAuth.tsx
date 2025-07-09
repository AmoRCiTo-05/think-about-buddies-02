
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
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, username: string, fullName?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
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
    
    return { data, error };
  };

  const signIn = async (emailOrUsername: string, password: string) => {
    // Check if input is email (contains @) or username
    const isEmail = emailOrUsername.includes('@');
    
    if (isEmail) {
      // Sign in with email
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailOrUsername,
        password,
      });
      return { data, error };
    } else {
      // Sign in with username - first get email from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', emailOrUsername)
        .single();
      
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
      return { data, error };
    }
  };

  const signOut = async () => {
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
