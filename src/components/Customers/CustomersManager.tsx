import React, { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit, Trash2, Phone, Mail, Star } from 'lucide-react';
import NewCustomerModal from './NewCustomerModal';
import { mockCustomers } from '../../data/mockData';
import { Customer } from '../../types';

export default function CustomersManager() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleAddCustomer = (newCustomer: Customer) => {
    setCustomers([newCustomer, ...customers]);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowEditModal(true);
  };

  const handleDeleteCustomer = (customerId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      setCustomers(customers.filter(c => c.id !== customerId));
    }
  };

  const handleViewCustomer = (customer: Customer) => {
    alert(`Détails du client: ${customer.name}\nEmail: ${customer.email || 'N/A'}\nTéléphone: ${customer.phone || 'N/A'}\nTotal achats: ${formatCurrency(customer.totalPurchases)}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getLoyaltyLevel = (points: number) => {
    if (points >= 200) return { level: 'VIP', color: 'text-purple-600 bg-purple-100' };
    if (points >= 100) return { level: 'Gold', color: 'text-yellow-600 bg-yellow-100' };
    if (points >= 50) return { level: 'Silver', color: 'text-gray-600 bg-gray-100' };
    return { level: 'Bronze', color: 'text-orange-600 bg-orange-100' };
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des clients</h1>
          <p className="text-gray-600">Gérez votre base clients et fidélisation</p>
        </div>
        
        <button 
          onClick={() => setShowNewCustomerModal(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 flex items-center gap-2"
        >
          <Plus size={20} />
          Nouveau client
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total clients</p>
              <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <Star className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Clients VIP</p>
              <p className="text-2xl font-bold text-gray-900">
                {customers.filter(c => c.loyaltyPoints >= 200).length}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <Star className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">CA moyen/client</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(customers.reduce((acc, c) => acc + c.totalPurchases, 0) / customers.length)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <Star className="text-green-600" size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Points fidélité</p>
              <p className="text-2xl font-bold text-gray-900">
                {customers.reduce((acc, c) => acc + c.loyaltyPoints, 0)}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Star className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher un client..."
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

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((customer) => {
          const loyalty = getLoyaltyLevel(customer.loyaltyPoints);
          
          return (
            <div key={customer.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              {/* Customer Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {customer.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{customer.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${loyalty.color}`}>
                      {loyalty.level}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => handleViewCustomer(customer)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Eye size={16} />
                  </button>
                  <button 
                    onClick={() => handleEditCustomer(customer)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDeleteCustomer(customer.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                {customer.email && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail size={16} />
                    <span className="text-sm">{customer.email}</span>
                  </div>
                )}
                {customer.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone size={16} />
                    <span className="text-sm">{customer.phone}</span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-500">Total achats</p>
                  <p className="font-bold text-gray-900">{formatCurrency(customer.totalPurchases)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Points fidélité</p>
                  <p className="font-bold text-gray-900">{customer.loyaltyPoints}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">Dernier achat</p>
                <p className="text-sm font-medium text-gray-900">{formatDate(customer.lastPurchase)}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Nouveau Client */}
      <NewCustomerModal
        isOpen={showNewCustomerModal}
        onClose={() => setShowNewCustomerModal(false)}
        onSave={handleAddCustomer}
      />
    </div>
  );
}