import React from 'react';
import { Shield, Lock, Eye, AlertTriangle } from 'lucide-react';

interface SecurityBadgeProps {
  level: 'low' | 'medium' | 'high' | 'maximum';
  className?: string;
}

export default function SecurityBadge({ level, className = '' }: SecurityBadgeProps) {
  const configs = {
    low: {
      color: 'from-red-500 to-red-600',
      icon: AlertTriangle,
      text: 'SÉCURITÉ FAIBLE',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700'
    },
    medium: {
      color: 'from-yellow-500 to-orange-500',
      icon: Eye,
      text: 'SÉCURITÉ MOYENNE',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700'
    },
    high: {
      color: 'from-blue-500 to-blue-600',
      icon: Lock,
      text: 'SÉCURITÉ ÉLEVÉE',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    maximum: {
      color: 'from-green-500 to-emerald-500',
      icon: Shield,
      text: 'SÉCURITÉ MAXIMALE',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    }
  };

  const config = configs[level];
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold shadow-lg ${className}`}>
      <div className={`bg-gradient-to-r ${config.color} text-white px-3 py-1 rounded-full flex items-center gap-1`}>
        <Icon size={12} />
        {config.text}
      </div>
    </div>
  );
}