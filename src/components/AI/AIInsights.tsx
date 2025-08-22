import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  AlertCircle, 
  Lightbulb, 
  Target,
  Zap,
  BarChart3,
  MessageSquare
} from 'lucide-react';

interface AIInsight {
  id: string;
  type: 'prediction' | 'alert' | 'suggestion' | 'opportunity';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  action?: string;
}

export default function AIInsights() {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulation d'insights IA
    setTimeout(() => {
      setInsights([
        {
          id: '1',
          type: 'prediction',
          title: 'Prévision de ventes',
          description: 'Vos ventes de croissants vont augmenter de 23% cette semaine selon les tendances météo et historiques.',
          confidence: 87,
          impact: 'high',
          action: 'Augmenter le stock de farine'
        },
        {
          id: '2',
          type: 'alert',
          title: 'Risque de rupture',
          description: 'Stock de chocolat en poudre critique. Rupture prévue dans 2 jours.',
          confidence: 94,
          impact: 'high',
          action: 'Commander immédiatement'
        },
        {
          id: '3',
          type: 'suggestion',
          title: 'Optimisation marketing',
          description: 'Envoyez un SMS promotionnel à vos clients VIP pour les pâtisseries du weekend.',
          confidence: 76,
          impact: 'medium',
          action: 'Créer campagne SMS'
        },
        {
          id: '4',
          type: 'opportunity',
          title: 'Nouvelle opportunité',
          description: 'Tendance croissante pour les produits sans gluten dans votre zone (+45% de recherches).',
          confidence: 82,
          impact: 'medium',
          action: 'Explorer le marché'
        }
      ]);
      setLoading(false);
    }, 1500);
  }, []);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'prediction': return <BarChart3 size={20} />;
      case 'alert': return <AlertCircle size={20} />;
      case 'suggestion': return <Lightbulb size={20} />;
      case 'opportunity': return <Target size={20} />;
      default: return <Brain size={20} />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'prediction': return 'from-blue-500 to-cyan-500';
      case 'alert': return 'from-red-500 to-pink-500';
      case 'suggestion': return 'from-yellow-500 to-orange-500';
      case 'opportunity': return 'from-green-500 to-emerald-500';
      default: return 'from-purple-500 to-indigo-500';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 bg-green-100';
    if (confidence >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl">
            <Brain size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Insights IA</h3>
            <p className="text-sm text-gray-600">Analyse en cours...</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl">
          <Brain size={24} className="text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Insights IA</h3>
          <p className="text-sm text-gray-600">Recommandations personnalisées</p>
        </div>
        <div className="ml-auto">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Zap size={12} />
            <span>Temps réel</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {insights.map((insight) => (
          <div 
            key={insight.id}
            className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 bg-gradient-to-r ${getInsightColor(insight.type)} rounded-lg text-white flex-shrink-0`}>
                {getInsightIcon(insight.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900 text-sm">{insight.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(insight.confidence)}`}>
                    {insight.confidence}% sûr
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                
                {insight.action && (
                  <button className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors">
                    <MessageSquare size={12} />
                    {insight.action}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <button className="w-full text-center text-sm text-gray-600 hover:text-gray-800 transition-colors">
          Voir toutes les recommandations IA →
        </button>
      </div>
    </div>
  );
}
