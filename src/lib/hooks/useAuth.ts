import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from "../../hooks/use-toast";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    const initAuth = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        console.log('useAuth - Initial session check:', !!initialSession);
        if (error) throw error;

        setSession(initialSession);
        setUser(initialSession?.user ?? null);

        // Set up real-time subscription
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
          console.log('useAuth - Auth state change:', event, !!currentSession);
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('useAuth - Init error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      console.log('useAuth - Attempting sign in');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;

      console.log('useAuth - Sign in successful:', data);
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });

      return data;
    } catch (error) {
      console.error('useAuth - Sign in error:', error);
      throw error;
    }
  }, [toast]);

  const signUp = useCallback(async (email: string, password: string) => {
    try {
      console.log('useAuth - Attempting sign up');
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) throw error;

      console.log('useAuth - Sign up successful:', data);
      toast({
        title: "Account created!",
        description: "Welcome to ClimbComp.",
      });

      return data;
    } catch (error) {
      console.error('useAuth - Sign up error:', error);
      throw error;
    }
  }, [toast]);

  const signOut = useCallback(async () => {
    try {
      console.log('useAuth - Attempting sign out');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast({
        title: "Signed out",
        description: "You've been successfully signed out.",
      });
    } catch (error) {
      console.error('useAuth - Sign out error:', error);
      throw error;
    }
  }, [toast]);

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };
}