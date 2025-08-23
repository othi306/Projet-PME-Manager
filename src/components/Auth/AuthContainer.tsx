import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { CompanyRegistrationForm } from './CompanyRegistrationForm';
import { useAuth } from '../../hooks/useAuth';
import { SignUpData, SignInData } from '../../types';

export function AuthContainer() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  
  const { signUpWithCompany, signIn, signInWithGoogle } = useAuth();

  const handleSignUp = async (data: SignUpData) => {
    setLoading(true);
    setError(undefined);
    
    try {
      const { error } = await signUpWithCompany(data);
      
      if (error) {
        setError(error.message);
      } else {
        // Succès - l'utilisateur sera redirigé automatiquement
        console.log('Inscription réussie');
      }
    } catch (err) {
      setError('Une erreur inattendue s\'est produite');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (data: SignInData) => {
    setLoading(true);
    setError(undefined);
    
    try {
      const { error } = await signIn(data);
      
      if (error) {
        setError(error.message);
      } else {
        // Succès - l'utilisateur sera redirigé automatiquement
        console.log('Connexion réussie');
      }
    } catch (err) {
      setError('Une erreur inattendue s\'est produite');
      console.error('Signin error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(undefined);
    
    try {
      const { error } = await signInWithGoogle();
      
      if (error) {
        setError(error.message);
      }
      // Pour Google OAuth, la redirection se fait automatiquement
    } catch (err) {
      setError('Une erreur inattendue s\'est produite');
      console.error('Google signin error:', err);
    } finally {
      setLoading(false);
    }
  };

  const switchToLogin = () => {
    setIsLogin(true);
    setError(undefined);
  };

  const switchToRegister = () => {
    setIsLogin(false);
    setError(undefined);
  };

  if (isLogin) {
    return (
      <LoginForm
        onSubmit={handleSignIn}
        onGoogleSignIn={handleGoogleSignIn}
        onSwitchToRegister={switchToRegister}
        loading={loading}
        error={error}
      />
    );
  }

  return (
    <CompanyRegistrationForm
      onSubmit={handleSignUp}
      onSwitchToLogin={switchToLogin}
      loading={loading}
      error={error}
    />
  );
}
