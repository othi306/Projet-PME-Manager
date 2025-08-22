import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    // TEMPORARY: Mock user for testing
    const mockUser = {
      id: 'test-user-id',
      email: 'test@example.com',
      user_metadata: { name: 'Test User', company: 'Test PME' },
      app_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString()
    } as User;
    
    const mockSession = {
      user: mockUser,
      access_token: 'mock-token'
    } as Session;
    
    setTimeout(() => {
      if (isMounted) {
        setSession(mockSession);
        setUser(mockUser);
        setLoading(false);
      }
    }, 100);
    
    return () => {
      isMounted = false;
    };
  }, []);

  const initializeUserData = async (user: User) => {
    if (!user?.id) return;
    
    try {
      console.log('Initializing user data for:', user.id);
      
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();

      if (existingUser) {
        console.log('User already exists, skipping initialization');
        return;
      }

      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.name || '',
            company: user.user_metadata?.company || '',
            role: 'admin'
          }
        ]);

      if (profileError && profileError.code !== '23505') { // Ignore duplicate key error
        console.error('Error creating user profile:', profileError);
        return;
      }

      // Initialize empty data for all tables
      const initPromises = [
        // Initialize clients table (empty)
        supabase.from('clients').select('id').eq('user_id', user.id).limit(1),
        
        // Initialize products table (empty)
        supabase.from('products').select('id').eq('user_id', user.id).limit(1),
        
        // Initialize sales table (empty)
        supabase.from('sales').select('id').eq('user_id', user.id).limit(1),
        
        // Initialize finance table (empty)
        supabase.from('finance').select('id').eq('user_id', user.id).limit(1),
        
        // Initialize journal table (empty)
        supabase.from('journal').select('id').eq('user_id', user.id).limit(1),
      ];

      await Promise.allSettled(initPromises);
      console.log('User data initialized successfully');
      
    } catch (error) {
      console.error('Error initializing user data:', error);
    }
  };

  const signUp = async (email: string, password: string, userData: { name: string; company: string }) => {
    // Validation côté client supplémentaire
    if (password.length < 8) {
      return { data: null, error: { message: 'Le mot de passe doit contenir au moins 8 caractères' } };
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    // Rate limiting côté client
    const lastAttempt = localStorage.getItem('lastLoginAttempt');
    const now = Date.now();
    
    if (lastAttempt && now - parseInt(lastAttempt) < 1000) {
      return { data: null, error: { message: 'Trop de tentatives rapides. Veuillez patienter.' } };
    }
    
    localStorage.setItem('lastLoginAttempt', now.toString());
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    // Nettoyer le rate limiting en cas de succès
    if (!error) {
      localStorage.removeItem('lastLoginAttempt');
    }
    
    return { data, error };
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
  };
}
