import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Star, 
  Target, 
  Award, 
  Users,
  Package,
  DollarSign
} from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  earned: boolean;
  progress: number;
  maxProgress: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  reward: string;
  timeLeft: string;
  type: 'daily' | 'weekly' | 'monthly';
}

export default function GamificationPanel() {
  const [userLevel] = useState(12);
  const [userXP] = useState(2450);
  const [nextLevelXP] = useState(3000);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    // Simulation des badges
    setBadges([
      {
        id: '1',
        name: 'Vendeur Pro',
        description: 'Réalisez 100 ventes',
        icon: <DollarSign size={16} />,
        earned: true,
        progress: 100,
        maxProgress: 100,
        rarity: 'common'
      },
      {
        id: '2',
        name: 'Maître du Stock',
        description: 'Gérez 500 produits',
        icon: <Package size={16} />,
        earned: true,
        progress: 500,
        maxProgress: 500,
        rarity: 'rare'
      },
      {
        id: '3',
        name: 'Client Champion',
        description: 'Fidélisez 50 clients',
        icon: <Users size={16} />,
        earned: false,
        progress: 32,
        maxProgress: 50,
        rarity: 'epic'
      },
      {
        id: '4',
        name: 'Entrepreneur Légendaire',
        description: 'Atteignez 100k€ de CA',
        icon: <Trophy size={16} />,
        earned: false,
        progress: 67500,
        maxProgress: 100000,
        rarity: 'legendary'
      }
    ]);

    // Simulation des challenges
    setChallenges([
      {
        id: '1',
        title: 'Ventes du jour',
        description: 'Réalisez 15 ventes aujourd\'hui',
        progress: 8,
        target: 15,
        reward: '+50 XP',
        timeLeft: '14h 32m',
        type: 'daily'
      },
      {
        id: '2',
        title: 'Nouveau client',
        description: 'Ajoutez 3 nouveaux clients cette semaine',
        progress: 1,
        target: 3,
        reward: '+100 XP + Badge',
        timeLeft: '4j 12h',
        type: 'weekly'
      },
      {
        id: '3',
        title: 'Objectif mensuel',
        description: 'Atteignez 25k€ de CA ce mois',
        progress: 18500,
        target: 25000,
        reward: '+500 XP + Badge Rare',
        timeLeft: '12j 8h',
        type: 'monthly'
      }
    ]);
  }, []);

  const getBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-500';
      case 'rare': return 'from-blue-400 to-blue-500';
      case 'epic': return 'from-purple-400 to-purple-500';
      case 'legendary': return 'from-yellow-400 to-orange-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getChallengeTypeColor = (type: string) => {
    switch (type) {
      case 'daily': return 'bg-green-100 text-green-800';
      case 'weekly': return 'bg-blue-100 text-blue-800';
      case 'monthly': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Niveau et XP */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Star size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Niveau {userLevel}</h3>
              <p className="text-indigo-100">Entrepreneur Expérimenté</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{userXP} XP</div>
            <div className="text-sm text-indigo-200">/ {nextLevelXP} XP</div>
          </div>
        </div>
        
        <div className="w-full bg-white/20 rounded-full h-3">
          <div 
            className="bg-white h-3 rounded-full transition-all duration-1000"
            style={{ width: `${(userXP / nextLevelXP) * 100}%` }}
          ></div>
        </div>
        <div className="text-center mt-2 text-sm text-indigo-200">
          {nextLevelXP - userXP} XP pour le niveau suivant
        </div>
      </div>

      {/* Badges */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl">
            <Award size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Badges</h3>
            <p className="text-sm text-gray-600">Vos accomplissements</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((badge) => (
            <div 
              key={badge.id}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                badge.earned 
                  ? 'border-transparent bg-gradient-to-br ' + getBadgeColor(badge.rarity) + ' text-white shadow-lg' 
                  : 'border-gray-200 bg-gray-50 text-gray-400'
              }`}
            >
              <div className="text-center">
                <div className={`mx-auto mb-2 p-2 rounded-lg ${badge.earned ? 'bg-white/20' : 'bg-gray-200'}`}>
                  {badge.icon}
                </div>
                <h4 className="font-semibold text-sm mb-1">{badge.name}</h4>
                <p className="text-xs opacity-80 mb-2">{badge.description}</p>
                
                {!badge.earned && (
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Challenges */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
            <Target size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Challenges</h3>
            <p className="text-sm text-gray-600">Objectifs en cours</p>
          </div>
        </div>

        <div className="space-y-4">
          {challenges.map((challenge) => (
            <div 
              key={challenge.id}
              className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{challenge.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getChallengeTypeColor(challenge.type)}`}>
                      {challenge.type === 'daily' ? 'Quotidien' : 
                       challenge.type === 'weekly' ? 'Hebdomadaire' : 'Mensuel'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{challenge.description}</p>
                </div>
                <div className="text-right ml-4">
                  <div className="text-sm font-medium text-gray-900">{challenge.reward}</div>
                  <div className="text-xs text-gray-500">{challenge.timeLeft}</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">
                  {challenge.id === '3' ? formatCurrency(challenge.progress) : challenge.progress} / {challenge.id === '3' ? formatCurrency(challenge.target) : challenge.target}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {Math.round((challenge.progress / challenge.target) * 100)}%
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((challenge.progress / challenge.target) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
