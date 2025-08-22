import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign, 
  AlertTriangle,
  Star,
  Calendar,
  Target
} from 'lucide-react';
import StatsCard from './StatsCard';
import NewSaleModal from '../Sales/NewSaleModal';
import { motivationalMessages } from '../../data/mockData';
import { useDashboardStats } from '../../hooks/useDashboardStats';

interface DashboardProps {
  onNavigate?: (tab: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [motivationalMessage, setMotivationalMessage] = useState('');
  const [showNewSaleModal, setShowNewSaleModal] = useState(false);
  const stats = useDashboardStats();

  useEffect(() => {
    // Sélectionner un message motivationnel aléatoire
    const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    setMotivationalMessage(randomMessage);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const handleNewSale = (sale: any) => {
    console.log('Nouvelle vente:', sale);
    // Ici vous pouvez ajouter la logique pour sauvegarder la vente
    // Par exemple, l'ajouter à votre état global ou l'envoyer à Supabase
  };
  return (
    <div className="p-6 space-y-6">
      {/* Message motivationnel */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <Star size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">Bonjour Jean ! 👋</h2>
            <p className="text-blue-100">{motivationalMessage}</p>
          </div>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Ventes aujourd'hui"
          value={formatCurrency(stats.todaySales)}
          change="+12.5%"
          changeType="positive"
          icon={TrendingUp}
          gradient="from-green-500 to-emerald-500"
        />
        
        <StatsCard
          title="Clients totaux"
          value={stats.totalCustomers}
          change="+8 nouveaux"
          changeType="positive"
          icon={Users}
          gradient="from-blue-500 to-cyan-500"
        />
        
        <StatsCard
          title="Articles en rupture"
          value={stats.lowStockItems}
          change="Attention requise"
          changeType="negative"
          icon={AlertTriangle}
          gradient="from-red-500 to-pink-500"
        />
        
        <StatsCard
          title="Trésorerie"
          value={formatCurrency(stats.cashFlow)}
          change="+5.2%"
          changeType="positive"
          icon={DollarSign}
          gradient="from-purple-500 to-indigo-500"
        />
      </div>

      {/* Graphiques et analyses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ventes du mois */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Ventes du mois</h3>
            <Calendar size={20} className="text-gray-400" />
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Objectif mensuel</span>
              <span className="font-semibold">{formatCurrency(30000)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${(stats.monthSales / 30000) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Réalisé</span>
              <span className="font-bold text-green-600">{formatCurrency(stats.monthSales)}</span>
            </div>
          </div>
        </div>

        {/* Produits populaires */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Produits populaires</h3>
            <Target size={20} className="text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {stats.topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-900">{product.name}</span>
                </div>
                <span className="text-gray-600">{product.sales} ventes</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Actions rapides</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => setShowNewSaleModal(true)}
            className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
          >
            <Package size={24} className="mb-2" />
            <span className="block font-medium">Nouvelle vente</span>
          </button>
          
          <button 
            onClick={() => onNavigate && onNavigate('customers')}
            className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
          >
            <Users size={24} className="mb-2" />
            <span className="block font-medium">Ajouter client</span>
          </button>
          
          <button 
            onClick={() => onNavigate && onNavigate('finance')}
            className="p-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
          >
            <TrendingUp size={24} className="mb-2" />
            <span className="block font-medium">Voir rapports</span>
          </button>
        </div>
      </div>

      {/* Modal Nouvelle Vente */}
      <NewSaleModal
        isOpen={showNewSaleModal}
        onClose={() => setShowNewSaleModal(false)}
        onSave={handleNewSale}
      />
    </div>
  );
}
