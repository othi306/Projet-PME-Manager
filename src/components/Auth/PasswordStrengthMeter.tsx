import React from 'react';
import { Check, X, Shield } from 'lucide-react';

interface PasswordStrengthMeterProps {
  password: string;
  showDetails?: boolean;
}

export default function PasswordStrengthMeter({ password, showDetails = true }: PasswordStrengthMeterProps) {
  const checks = {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    noCommon: !['password', '123456', 'qwerty', 'admin'].some(common => 
      password.toLowerCase().includes(common)
    )
  };

  const passedChecks = Object.values(checks).filter(Boolean).length;
  const strength = passedChecks <= 2 ? 'weak' : passedChecks <= 4 ? 'medium' : passedChecks <= 5 ? 'strong' : 'excellent';

  const strengthConfig = {
    weak: { color: 'bg-red-500', text: 'Faible', textColor: 'text-red-600' },
    medium: { color: 'bg-yellow-500', text: 'Moyen', textColor: 'text-yellow-600' },
    strong: { color: 'bg-blue-500', text: 'Fort', textColor: 'text-blue-600' },
    excellent: { color: 'bg-green-500', text: 'Excellent', textColor: 'text-green-600' }
  };

  if (!password) return null;

  return (
    <div className="mt-3 space-y-3">
      {/* Barre de progression */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-600">Force du mot de passe</span>
          <span className={`text-xs font-bold ${strengthConfig[strength].textColor}`}>
            {strengthConfig[strength].text}
          </span>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5, 6].map((level) => (
            <div
              key={level}
              className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                passedChecks >= level
                  ? strengthConfig[strength].color
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Détails des critères */}
      {showDetails && (
        <div className="bg-slate-50 rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={14} className="text-slate-600" />
            <span className="text-xs font-semibold text-slate-700">Critères de sécurité</span>
          </div>
          
          <div className="grid grid-cols-1 gap-1 text-xs">
            {[
              { key: 'minLength', label: 'Au moins 8 caractères' },
              { key: 'hasUpper', label: 'Une majuscule (A-Z)' },
              { key: 'hasLower', label: 'Une minuscule (a-z)' },
              { key: 'hasNumber', label: 'Un chiffre (0-9)' },
              { key: 'hasSpecial', label: 'Un caractère spécial (!@#$...)' },
              { key: 'noCommon', label: 'Pas de mot de passe commun' }
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center gap-2">
                {checks[key as keyof typeof checks] ? (
                  <Check size={12} className="text-green-500" />
                ) : (
                  <X size={12} className="text-red-500" />
                )}
                <span className={checks[key as keyof typeof checks] ? 'text-green-600' : 'text-red-500'}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}