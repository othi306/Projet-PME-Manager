import React, { useState } from 'react';
import { Plus, Search, Building2, Phone, Mail, CreditCard, AlertCircle, Edit, Trash2, Package } from 'lucide-react';
import { Supplier, SupplierInvoice } from '../../types';

interface SupplierManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SupplierManager({ isOpen, onClose }: SupplierManagerProps) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: '1',
      name: 'Fournisseur Alpha',
      email: 'contact@alpha.com',
      phone: '01 23 45 67 89',
      address: '123 Rue de la Paix, 75001 Paris',
      contactPerson: 'Jean Dupont',
      paymentTerms: '30 jours',
      status: 'active',
      totalDebt: 1250.00,
      totalCredit: 0,
      lastOrder: '2024-01-15'
    },
    {
      id: '2',
      name: 'Fournisseur Beta',
      email: 'info@beta.fr',
      phone: '01 98 76 54 32',
      address: '456 Avenue des Champs, 69000 Lyon',
      contactPerson: 'Marie Martin',
      paymentTerms: '15 jours',
      status: 'active',
      totalDebt: 0,
      totalCredit: 500.00,
      lastOrder: '2024-01-20'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showNewSupplierModal, setShowNewSupplierModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  if (!isOpen) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getBalanceColor = (debt: number, credit: number) => {
    if (debt > 0) return 'text-red-600';
    if (credit > 0) return 'text-green-600';
    return 'text-gray-600';
  };

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalDebt = suppliers.reduce((sum, s) => sum + s.totalDebt, 0);
  const totalCredit = suppliers.reduce((sum, s) => sum + s.totalCredit, 0);
  const activeSuppliers = suppliers.filter(s => s.status === 'active').length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-xl">
              <Building2 size={24} className="text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Gestion des fournisseurs</h2>
              <p className="text-gray-600">Gérez vos fournisseurs et approvisionnements</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowNewSupplierModal(true)}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 flex items-center gap-2"
            >
              <Plus size={20} />
              Nouveau fournisseur
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <span className="text-gray-500">✕</span>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Fournisseurs actifs</p>
                  <p className="text-2xl font-bold text-gray-900">{activeSuppliers}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Building2 className="text-blue-600" size={24} />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total dettes</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(totalDebt)}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-xl">
                  <CreditCard className="text-red-600" size={24} />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total crédits</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(totalCredit)}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <CreditCard className="text-green-600" size={24} />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Solde net</p>
                  <p className={`text-2xl font-bold ${getBalanceColor(totalDebt, totalCredit)}`}>
                    {formatCurrency(totalCredit - totalDebt)}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Package className="text-purple-600" size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher un fournisseur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Suppliers Table */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left p-4 font-semibold text-gray-900">Fournisseur</th>
                    <th className="text-left p-4 font-semibold text-gray-900">Contact</th>
                    <th className="text-left p-4 font-semibold text-gray-900">Conditions</th>
                    <th className="text-left p-4 font-semibold text-gray-900">Statut</th>
                    <th className="text-left p-4 font-semibold text-gray-900">Solde</th>
                    <th className="text-left p-4 font-semibold text-gray-900">Dernière commande</th>
                    <th className="text-left p-4 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSuppliers.map((supplier) => (
                    <tr key={supplier.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center text-white font-bold">
                            {supplier.name.charAt(0)}
                          </div>
                          <div>
                            <span className="text-gray-900 font-medium">{supplier.name}</span>
                            <div className="text-sm text-gray-500">{supplier.contactPerson}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          {supplier.email && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail size={14} />
                              {supplier.email}
                            </div>
                          )}
                          {supplier.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone size={14} />
                              {supplier.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-gray-700">{supplier.paymentTerms}</span>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(supplier.status)}`}>
                          {supplier.status === 'active' ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div>
                          {supplier.totalDebt > 0 && (
                            <div className="text-red-600 font-medium">
                              Dette: {formatCurrency(supplier.totalDebt)}
                            </div>
                          )}
                          {supplier.totalCredit > 0 && (
                            <div className="text-green-600 font-medium">
                              Crédit: {formatCurrency(supplier.totalCredit)}
                            </div>
                          )}
                          {supplier.totalDebt === 0 && supplier.totalCredit === 0 && (
                            <span className="text-gray-500">Équilibré</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-gray-700">
                          {supplier.lastOrder ? formatDate(supplier.lastOrder) : 'Aucune'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setSelectedSupplier(supplier)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Voir détails"
                          >
                            <Package size={16} />
                          </button>
                          <button 
                            onClick={() => alert(`Édition de ${supplier.name}`)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => {
                              if (confirm(`Êtes-vous sûr de vouloir supprimer ${supplier.name} ?`)) {
                                setSuppliers(suppliers.filter(s => s.id !== supplier.id));
                              }
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer"
                          >
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

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Actions rapides</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button 
                onClick={() => setShowNewSupplierModal(true)}
                className="p-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
              >
                <Plus size={24} className="mb-2" />
                <span className="block font-medium">Nouveau fournisseur</span>
              </button>
              
              <button 
                onClick={() => alert('Fonctionnalité de commande à venir')}
                className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
              >
                <Package size={24} className="mb-2" />
                <span className="block font-medium">Nouvelle commande</span>
              </button>
              
              <button 
                onClick={() => alert('Fonctionnalité de facture à venir')}
                className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
              >
                <CreditCard size={24} className="mb-2" />
                <span className="block font-medium">Gérer factures</span>
              </button>
              
              <button 
                onClick={() => alert('Fonctionnalité de rapport à venir')}
                className="p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
              >
                <AlertCircle size={24} className="mb-2" />
                <span className="block font-medium">Rapport dettes</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
