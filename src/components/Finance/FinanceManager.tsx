import React, { useState } from 'react';
import { Plus, TrendingUp, TrendingDown, DollarSign, CreditCard, Download, Calendar, Calculator } from 'lucide-react';
import NewTransactionModal from './NewTransactionModal';
import CashRegisterClosureModal from './CashRegisterClosureModal';
import { mockFinancialRecords } from '../../data/mockData';
import { FinancialRecord, CashRegisterClosure } from '../../types';

export default function FinanceManager() {
  const [records, setRecords] = useState<FinancialRecord[]>(mockFinancialRecords);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [showNewTransactionModal, setShowNewTransactionModal] = useState(false);
  const [showCashClosureModal, setShowCashClosureModal] = useState(false);
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income');
  const [cashClosures, setCashClosures] = useState<CashRegisterClosure[]>([]);

  const handleAddTransaction = (newTransaction: FinancialRecord) => {
    setRecords([newTransaction, ...records]);
  };

  const handleCashClosure = (closure: CashRegisterClosure) => {
    setCashClosures([closure, ...cashClosures]);
    
    // Ajouter l'écriture dans l'historique des finances
    const closureRecord: FinancialRecord = {
      id: `closure-${closure.id}`,
      date: closure.date,
      type: 'income',
      category: 'Clôture de caisse',
      amount: closure.totalSales,
      description: `Clôture de caisse - ${closure.salesCount} ventes - ${closure.difference !== 0 ? `Écart: ${closure.difference}€` : 'Aucun écart'}`
    };
    
    setRecords([closureRecord, ...records]);
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Date,Type,Catégorie,Description,Montant\n"
      + records.map(r => `${r.date},${r.type === 'income' ? 'Revenu' : 'Dépense'},${r.category},${r.description},${r.amount}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `finances_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  const totalIncome = records.filter(r => r.type === 'income').reduce((acc, r) => acc + r.amount, 0);
  const totalExpenses = records.filter(r => r.type === 'expense').reduce((acc, r) => acc + r.amount, 0);
  const netProfit = totalIncome - totalExpenses;

  const incomeByCategory = records
    .filter(r => r.type === 'income')
    .reduce((acc, r) => {
      acc[r.category] = (acc[r.category] || 0) + r.amount;
      return acc;
    }, {} as Record<string, number>);

  const expensesByCategory = records
    .filter(r => r.type === 'expense')
    .reduce((acc, r) => {
      acc[r.category] = (acc[r.category] || 0) + r.amount;
      return acc;
    }, {} as Record<string, number>);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion financière</h1>
          <p className="text-gray-600">Suivez vos revenus, dépenses et trésorerie</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => {
              setTransactionType('income');
              setShowNewTransactionModal(true);
            }}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 flex items-center gap-2"
          >
            <Plus size={20} />
            Nouvelle transaction
          </button>
          <button 
            onClick={handleExport}
            className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Download size={20} />
            Exporter
          </button>
        </div>
      </div>

      {/* Period Selector */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center gap-4">
          <Calendar size={20} className="text-gray-600" />
          <span className="text-gray-700 font-medium">Période:</span>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
            <option value="year">Cette année</option>
          </select>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <TrendingUp size={24} />
            </div>
            <span className="text-green-100 text-sm">+12.5%</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Revenus</h3>
          <p className="text-3xl font-bold">{formatCurrency(totalIncome)}</p>
        </div>
        
        <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <TrendingDown size={24} />
            </div>
            <span className="text-red-100 text-sm">+3.2%</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Dépenses</h3>
          <p className="text-3xl font-bold">{formatCurrency(totalExpenses)}</p>
        </div>
        
        <div className={`bg-gradient-to-r ${netProfit >= 0 ? 'from-blue-500 to-cyan-500' : 'from-gray-500 to-slate-500'} rounded-2xl p-6 text-white shadow-xl`}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <DollarSign size={24} />
            </div>
            <span className={`text-sm ${netProfit >= 0 ? 'text-blue-100' : 'text-gray-100'}`}>
              {netProfit >= 0 ? '+' : ''}{((netProfit / totalIncome) * 100).toFixed(1)}%
            </span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Bénéfice net</h3>
          <p className="text-3xl font-bold">{formatCurrency(netProfit)}</p>
        </div>
      </div>

      {/* Charts and Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income by Category */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Revenus par catégorie</h3>
          <div className="space-y-4">
            {Object.entries(incomeByCategory).map(([category, amount]) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">{category}</span>
                </div>
                <span className="font-bold text-gray-900">{formatCurrency(amount)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Expenses by Category */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Dépenses par catégorie</h3>
          <div className="space-y-4">
            {Object.entries(expensesByCategory).map(([category, amount]) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700">{category}</span>
                </div>
                <span className="font-bold text-gray-900">{formatCurrency(amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Transactions récentes</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-900">Date</th>
                <th className="text-left p-4 font-semibold text-gray-900">Type</th>
                <th className="text-left p-4 font-semibold text-gray-900">Catégorie</th>
                <th className="text-left p-4 font-semibold text-gray-900">Description</th>
                <th className="text-left p-4 font-semibold text-gray-900">Montant</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <span className="text-gray-900">{formatDate(record.date)}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {record.type === 'income' ? (
                        <TrendingUp size={16} className="text-green-600" />
                      ) : (
                        <TrendingDown size={16} className="text-red-600" />
                      )}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        record.type === 'income' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {record.type === 'income' ? 'Revenu' : 'Dépense'}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-700">{record.category}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-900">{record.description}</span>
                  </td>
                  <td className="p-4">
                    <span className={`font-bold ${
                      record.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {record.type === 'income' ? '+' : '-'}{formatCurrency(record.amount)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Actions rapides</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <button 
            onClick={() => {
              setTransactionType('income');
              setShowNewTransactionModal(true);
            }}
            className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
          >
            <TrendingUp size={24} className="mb-2" />
            <span className="block font-medium">Ajouter revenu</span>
          </button>
          
          <button 
            onClick={() => {
              setTransactionType('expense');
              setShowNewTransactionModal(true);
            }}
            className="p-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
          >
            <TrendingDown size={24} className="mb-2" />
            <span className="block font-medium">Ajouter dépense</span>
          </button>
          
          <button 
            onClick={() => setShowCashClosureModal(true)}
            className="p-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
          >
            <Calculator size={24} className="mb-2" />
            <span className="block font-medium">Clôture caisse</span>
          </button>
          
          <button 
            onClick={() => alert('Fonctionnalité de rapprochement bancaire à venir')}
            className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
          >
            <CreditCard size={24} className="mb-2" />
            <span className="block font-medium">Rapprochement</span>
          </button>
          
          <button 
            onClick={handleExport}
            className="p-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
          >
            <Download size={24} className="mb-2" />
            <span className="block font-medium">Export comptable</span>
          </button>
        </div>
      </div>

      {/* Modal Nouvelle Transaction */}
      <NewTransactionModal
        isOpen={showNewTransactionModal}
        onClose={() => setShowNewTransactionModal(false)}
        onSave={handleAddTransaction}
        type={transactionType}
      />

      {/* Modal Clôture de Caisse */}
      <CashRegisterClosureModal
        isOpen={showCashClosureModal}
        onClose={() => setShowCashClosureModal(false)}
        onSave={handleCashClosure}
      />
    </div>
  );
}
