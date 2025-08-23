import React, { useState } from 'react';
import { Building2, Mail, Lock, User, Eye, EyeOff, Chrome, Shield, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const backgroundPattern = "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E";

export default function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    company: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeLeft, setBlockTimeLeft] = useState(0);

  const { signIn, signUpWithCompany, signInWithGoogle } = useAuth();

  // Validation de sécurité du mot de passe
  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      isValid: minLength && hasUpper && hasLower && hasNumber && hasSpecial,
      checks: {
        minLength,
        hasUpper,
        hasLower,
        hasNumber,
        hasSpecial
      }
    };
  };

  // Validation de l'email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Gestion du blocage temporaire après tentatives échouées
  const handleFailedAttempt = () => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    
    if (newAttempts >= 3) {
      setIsBlocked(true);
      setBlockTimeLeft(300); // 5 minutes
      
      const timer = setInterval(() => {
        setBlockTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsBlocked(false);
            setAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || isBlocked) return;
    
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Validations côté client
    if (!validateEmail(formData.email)) {
      setError('Format d\'email invalide');
      setLoading(false);
      return;
    }

    if (isSignUp) {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        setError('Le mot de passe ne respecte pas les critères de sécurité');
        setLoading(false);
        return;
      }
    }

    try {
      if (isSignUp) {
        if (!formData.name.trim() || !formData.company.trim()) {
          throw new Error('Le nom et l\'entreprise sont obligatoires');
        }
        
        const { error } = await signUpWithCompany({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          company_name: formData.company
        });
        
        if (error) throw error;
        
        setSuccess('Compte créé avec succès ! Vérifiez votre email pour confirmer votre compte.');
        setAttempts(0); // Reset attempts on success
      } else {
        const { error } = await signIn({
          email: formData.email,
          password: formData.password
        });
        if (error) throw error;
        
        setSuccess('Connexion réussie ! Redirection...');
        setAttempts(0); // Reset attempts on success
      }
    } catch (err) {
      console.error('Erreur d\'authentification:', err);
      
      let errorMessage = 'Une erreur est survenue';
      
      if (err instanceof Error) {
        if (err.message === 'Invalid login credentials') {
          errorMessage = 'Email ou mot de passe incorrect';
          handleFailedAttempt();
        } else if (err.message === 'Email not confirmed') {
          errorMessage = 'Veuillez confirmer votre email avant de vous connecter';
        } else if (err.message === 'User already registered') {
          errorMessage = 'Un compte existe déjà avec cet email';
        } else if (err.message.includes('Password')) {
          errorMessage = 'Mot de passe trop faible';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (loading || isBlocked) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
      setAttempts(0); // Reset attempts on success
    } catch (err) {
      console.error('Erreur Google Auth:', err);
      setError('Erreur lors de la connexion avec Google');
    } finally {
      setLoading(false);
    }
  };

  const passwordValidation = validatePassword(formData.password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{ backgroundImage: `url("${backgroundPattern}")` }}
      ></div>
      
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md p-8 border border-white/20 relative">
        {/* Security Badge */}
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg">
            <Shield size={14} />
            CONNEXION SÉCURISÉE
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-20 blur-xl"></div>

        <div className="text-center mb-8 relative z-10 mt-4">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <Building2 size={36} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
            PME Manager
          </h1>
          <p className="text-slate-600 font-medium">
            {isSignUp ? 'Créez votre espace de gestion sécurisé' : 'Accès sécurisé à votre espace'}
          </p>
        </div>

        {/* Blocage temporaire */}
        {isBlocked && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-xl mb-6">
            <div className="flex items-center">
              <AlertTriangle size={20} className="mr-3" />
              <div>
                <p className="font-semibold">Compte temporairement bloqué</p>
                <p className="text-sm">Trop de tentatives échouées. Réessayez dans {Math.floor(blockTimeLeft / 60)}:{(blockTimeLeft % 60).toString().padStart(2, '0')}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tentatives restantes */}
        {attempts > 0 && attempts < 3 && !isBlocked && (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 px-4 py-3 rounded-xl mb-6">
            <div className="flex items-center">
              <AlertTriangle size={16} className="mr-2" />
              <p className="text-sm">Tentative {attempts}/3. Attention aux prochaines tentatives.</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-xl mb-6 animate-pulse">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
              {error}
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-xl mb-6 animate-pulse">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-ping"></div>
              {success}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignUp && (
            <>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Nom complet *
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-slate-50/50 hover:bg-white"
                      placeholder="Votre nom complet"
                      disabled={isBlocked}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Nom de l'entreprise *
                  </label>
                  <div className="relative group">
                    <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-slate-50/50 hover:bg-white"
                      placeholder="Nom de votre entreprise"
                      disabled={isBlocked}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Adresse email
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-slate-50/50 hover:bg-white ${
                  formData.email && !validateEmail(formData.email) 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-slate-200'
                }`}
                placeholder="votre@email.com"
                disabled={isBlocked}
              />
            </div>
            {formData.email && !validateEmail(formData.email) && (
              <p className="text-red-500 text-xs mt-1">Format d'email invalide</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Mot de passe
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`w-full pl-12 pr-14 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-slate-50/50 hover:bg-white ${
                  isSignUp && formData.password && !passwordValidation.isValid 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-slate-200'
                }`}
                placeholder="••••••••"
                minLength={isSignUp ? 8 : 6}
                disabled={isBlocked}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                disabled={isBlocked}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            {/* Indicateur de force du mot de passe */}
            {isSignUp && formData.password && (
              <div className="mt-3 space-y-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        Object.values(passwordValidation.checks).filter(Boolean).length >= level
                          ? level <= 2 ? 'bg-red-500' : level <= 4 ? 'bg-yellow-500' : 'bg-green-500'
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-xs space-y-1">
                  <div className={`flex items-center gap-2 ${passwordValidation.checks.minLength ? 'text-green-600' : 'text-red-500'}`}>
                    <div className={`w-1 h-1 rounded-full ${passwordValidation.checks.minLength ? 'bg-green-500' : 'bg-red-500'}`} />
                    Au moins 8 caractères
                  </div>
                  <div className={`flex items-center gap-2 ${passwordValidation.checks.hasUpper ? 'text-green-600' : 'text-red-500'}`}>
                    <div className={`w-1 h-1 rounded-full ${passwordValidation.checks.hasUpper ? 'bg-green-500' : 'bg-red-500'}`} />
                    Une majuscule
                  </div>
                  <div className={`flex items-center gap-2 ${passwordValidation.checks.hasLower ? 'text-green-600' : 'text-red-500'}`}>
                    <div className={`w-1 h-1 rounded-full ${passwordValidation.checks.hasLower ? 'bg-green-500' : 'bg-red-500'}`} />
                    Une minuscule
                  </div>
                  <div className={`flex items-center gap-2 ${passwordValidation.checks.hasNumber ? 'text-green-600' : 'text-red-500'}`}>
                    <div className={`w-1 h-1 rounded-full ${passwordValidation.checks.hasNumber ? 'bg-green-500' : 'bg-red-500'}`} />
                    Un chiffre
                  </div>
                  <div className={`flex items-center gap-2 ${passwordValidation.checks.hasSpecial ? 'text-green-600' : 'text-red-500'}`}>
                    <div className={`w-1 h-1 rounded-full ${passwordValidation.checks.hasSpecial ? 'bg-green-500' : 'bg-red-500'}`} />
                    Un caractère spécial
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || isBlocked || (isSignUp && !passwordValidation.isValid)}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-semibold text-lg relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {isSignUp ? 'Création sécurisée...' : 'Connexion sécurisée...'}
                </>
              ) : (
                <>
                  <Shield size={20} />
                  {isSignUp ? 'Créer mon espace sécurisé' : 'Connexion sécurisée'}
                </>
              )}
            </span>
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500 font-medium">ou</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading || isBlocked}
            className="w-full mt-4 bg-white border-2 border-slate-200 text-slate-700 py-4 rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-3 group"
          >
            <Chrome size={20} className="text-slate-600 group-hover:text-blue-600 transition-colors" />
            Continuer avec Google
          </button>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
              setSuccess(null);
              setFormData({ email: '', password: '', name: '', company: '' });
            }}
            disabled={isBlocked}
            className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200 hover:underline disabled:opacity-50"
          >
            {isSignUp 
              ? 'Déjà un compte ? Se connecter' 
              : 'Pas de compte ? Créer un espace sécurisé'
            }
          </button>
        </div>

        {/* Informations de sécurité */}
        <div className="mt-6 bg-slate-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={16} className="text-green-600" />
            <span className="text-sm font-semibold text-slate-700">Sécurité renforcée</span>
          </div>
          <ul className="text-xs text-slate-600 space-y-1">
            <li>• Chiffrement SSL/TLS de bout en bout</li>
            <li>• Protection contre les attaques par force brute</li>
            <li>• Authentification à deux facteurs disponible</li>
            <li>• Données isolées par entreprise</li>
            <li>• Conformité RGPD</li>
          </ul>
        </div>

        {isSignUp && (
          <div className="mt-4 text-center">
            <p className="text-xs text-slate-500 leading-relaxed">
              En créant un compte, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
              Vos données sont sécurisées et chiffrées.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
