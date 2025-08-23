import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { SignUpData, SignInData, Company, User as AppUser } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Récupérer la session actuelle
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          return;
        }

        if (session && isMounted) {
          setSession(session);
          setUser(session.user);
          await loadUserData(session.user.id);
        }
      } catch (error) {
        console.error('Error in getSession:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getSession();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;

        console.log('Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await loadUserData(session.user.id);
        } else {
          setAppUser(null);
          setCompany(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const loadUserData = async (userId: string) => {
    try {
      // Charger les données utilisateur
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError && userError.code !== 'PGRST116') {
        console.error('Error loading user data:', userError);
        return;
      }

      if (userData) {
        setAppUser(userData);
        
        // Charger les données de l'entreprise
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('id', userData.company_id)
          .single();

        if (companyError && companyError.code !== 'PGRST116') {
          console.error('Error loading company data:', companyError);
          return;
        }

        if (companyData) {
          setCompany(companyData);
        }
      }
    } catch (error) {
      console.error('Error in loadUserData:', error);
    }
  };


  const signUpWithCompany = async (signUpData: SignUpData) => {
    try {
      // Validation côté client
      if (signUpData.password.length < 8) {
        return { data: null, error: { message: 'Le mot de passe doit contenir au moins 8 caractères' } };
      }

      // Créer le compte utilisateur
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: signUpData.email,
        password: signUpData.password,
        options: {
          data: {
            name: signUpData.name,
            company_name: signUpData.company_name
          }
        }
      });

      if (authError) {
        return { data: null, error: authError };
      }

      if (authData.user) {
        // Utiliser la fonction PostgreSQL pour créer l'entreprise et l'utilisateur
        const { data: companyData, error: companyError } = await supabase
          .rpc('create_company_with_user', {
            company_name: signUpData.company_name,
            user_email: signUpData.company_email || signUpData.email,
            user_name: signUpData.name,
            user_auth_id: authData.user.id
          });

        if (companyError) {
          console.error('Error creating company:', companyError);
          return { data: authData, error: companyError };
        }

        // Mettre à jour les données de l'entreprise si des informations supplémentaires sont fournies
        if (signUpData.company_phone || signUpData.industry) {
          await supabase
            .from('companies')
            .update({
              phone: signUpData.company_phone,
              industry: signUpData.industry
            })
            .eq('id', companyData);
        }
      }

      return { data: authData, error: null };
    } catch (error) {
      console.error('Error in signUpWithCompany:', error);
      return { data: null, error: { message: 'Erreur lors de la création du compte' } };
    }
  };

  const signIn = async (signInData: SignInData) => {
    // Rate limiting côté client
    const lastAttempt = localStorage.getItem('lastLoginAttempt');
    const now = Date.now();
    
    if (lastAttempt && now - parseInt(lastAttempt) < 1000) {
      return { data: null, error: { message: 'Trop de tentatives rapides. Veuillez patienter.' } };
    }
    
    localStorage.setItem('lastLoginAttempt', now.toString());
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: signInData.email,
      password: signInData.password,
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
    appUser,
    company,
    loading,
    signUpWithCompany,
    signIn,
    signInWithGoogle,
    signOut,
    loadUserData,
  };
}
