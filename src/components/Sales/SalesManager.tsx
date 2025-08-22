import React, { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit, Trash2, CreditCard, Banknote, Truck, DollarSign } from 'lucide-react';
import NewSaleModal from './NewSaleModal';
import { mockSales } from '../../data/mockData';
import { Sale } from '../../types';

export default function SalesManager() {
  const [sales, setSales] = useState<Sale[]>(mockSales.map(sale => ({
    ...sale,
    saleStatus: sale.saleStatus || 'paid_delivered' as 'paid_delivered' | 'paid_not_delivered' | 'delivered_not_paid'
  })));
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewSaleModal, setShowNewSaleModal] = useState(false);

  const handleNewSale = (sale: Omit<Sale, 'id'>) => {
    const newSale: Sale = {
      ...sale,
      id: Date.now().toString()
    };
    setSales(prev => [newSale, ...prev]);
    console.log('Nouvelle vente:', newSale);
  };

  const handleStatusUpdate = (saleId: string, action: 'deliver' | 'pay') => {
    setSales(prev => prev.map(sale => {
      if (sale.id === saleId) {
        if (action === 'deliver' && sale.saleStatus === 'paid_not_delivered') {
          return { ...sale, saleStatus: 'paid_delivered' as const };
        } else if (action === 'pay' && sale.saleStatus === 'delivered_not_paid') {
          return { ...sale, saleStatus: 'paid_delivered' as const };
        }
      }
      return sale;
    }));
  };
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'card':
        return <CreditCard size={16} className="text-blue-600" />;
      case 'cash':
        return <Banknote size={16} className="text-green-600" />;
      default:
        return <CreditCard size={16} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSaleStatusColor = (saleStatus: string) => {
    switch (saleStatus) {
      case 'paid_delivered':
        return 'bg-green-100 text-green-800';
      case 'paid_not_delivered':
        return 'bg-blue-100 text-blue-800';
      case 'delivered_not_paid':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSaleStatusText = (saleStatus: string) => {
    switch (saleStatus) {
      case 'paid_delivered':
        return 'Payé livré';
      case 'paid_not_delivered':
        return 'Payé non livré';
      case 'delivered_not_paid':
        return 'Livré non payé';
      default:
        return 'Inconnu';
    }
  };

  // Filtrer les ventes selon le terme de recherche
  const filteredSales = sales.filter(sale =>
    sale.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.amount.toString().includes(searchTerm)
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des ventes</h1>
          <p className="text-gray-600">Gérez vos ventes et transactions</p>
        </div>
        
        <button
          onClick={() => setShowNewSaleModal(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 flex items-center gap-2"
        >
          <Plus size={20} />
          Nouvelle vente
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher une vente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          
          <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
            <Filter size={20} />
            Filtres
          </button>
        </div>
      </div>

      {/* Sales List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-900">Date</th>
                <th className="text-left p-4 font-semibold text-gray-900">Client</th>
                <th className="text-left p-4 font-semibold text-gray-900">Montant</th>
                <th className="text-left p-4 font-semibold text-gray-900">Paiement</th>
                <th className="text-left p-4 font-semibold text-gray-900">Statut</th>
                <th className="text-left p-4 font-semibold text-gray-900">Statut Vente</th>
                <th className="text-left p-4 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <span className="text-gray-900 font-medium">
                      {formatDate(sale.date)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div>
                      <span className="text-gray-900 font-medium">{sale.customer.name}</span>
                      {sale.customer.email && (
                        <div className="text-sm text-gray-500">{sale.customer.email}</div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-900 font-bold">
                      {formatCurrency(sale.amount)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {getPaymentIcon(sale.paymentMethod)}
                      <span className="capitalize text-gray-700">
                        {sale.paymentMethod === 'card' ? 'Carte' : 
                         sale.paymentMethod === 'cash' ? 'Espèces' : sale.paymentMethod}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(sale.status)}`}>
                      {sale.status === 'completed' ? 'Terminée' :
                       sale.status === 'pending' ? 'En attente' : 'Annulée'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSaleStatusColor(sale.saleStatus)}`}>
                      {getSaleStatusText(sale.saleStatus)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye size={16} />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Edit size={16} />
                      </button>
                      {sale.saleStatus === 'paid_not_delivered' && (
                        <button 
                          onClick={() => handleStatusUpdate(sale.id, 'deliver')}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Marquer comme livré"
                        >
                          <Truck size={16} />
                        </button>
                      )}
                      {sale.saleStatus === 'delivered_not_paid' && (
                        <button 
                          onClick={() => handleStatusUpdate(sale.id, 'pay')}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Marquer comme payé"
                        >
                          <DollarSign size={16} />
                        </button>
                      )}
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Ventes aujourd'hui</h3>
          <p className="text-3xl font-bold">{formatCurrency(1250.50)}</p>
          <p className="text-green-100 text-sm mt-2">+12.5% vs hier</p>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Transactions</h3>
          <p className="text-3xl font-bold">24</p>
          <p className="text-blue-100 text-sm mt-2">+8 vs hier</p>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Panier moyen</h3>
          <p className="text-3xl font-bold">{formatCurrency(52.10)}</p>
          <p className="text-purple-100 text-sm mt-2">+3.2% vs hier</p>
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
