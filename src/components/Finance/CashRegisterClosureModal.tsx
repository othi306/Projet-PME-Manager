import React, { useState, useEffect } from 'react';
import { X, Calculator, DollarSign, CreditCard, Banknote, FileText, AlertCircle } from 'lucide-react';
import { CashRegisterClosure, Sale } from '../../types';
import { mockSales } from '../../data/mockData';

interface CashRegisterClosureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (closure: CashRegisterClosure) => void;
}

export default function CashRegisterClosureModal({ isOpen, onClose, onSave }: CashRegisterClosureModalProps) {
  const [actualCash, setActualCash] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [todaySales, setTodaySales] = useState<Sale[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Filtrer les ventes du jour
      const today = new Date().toISOString().split('T')[0];
      const dailySales = mockSales.filter(sale => 
        sale.date.startsWith(today) && sale.status === 'completed'
      );
      setTodaySales(dailySales);
      setActualCash(0);
      setNotes('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Calculs des totaux
  const totalSales = todaySales.reduce((sum, sale) => sum + sale.amount, 0);
  const totalCash = todaySales
    .filter(sale => sale.paymentMethod === 'cash')
    .reduce((sum, sale) => sum + sale.amount, 0);
  const totalCard = todaySales
    .filter(sale => sale.paymentMethod === 'card')
    .reduce((sum, sale) => sum + sale.amount, 0);
  const totalTransfer = todaySales
    .filter(sale => sale.paymentMethod === 'transfer')
    .reduce((sum, sale) => sum + sale.amount, 0);
  const totalCheck = todaySales
    .filter(sale => sale.paymentMethod === 'check')
    .reduce((sum, sale) => sum + sale.amount, 0);
  
  const salesCount = todaySales.length;
  const expectedCash = totalCash;
  const difference = actualCash - expectedCash;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const closure: CashRegisterClosure = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      startTime: '08:00',
      endTime: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      totalSales,
      totalCash,
      totalCard,
      totalTransfer,
      totalCheck,
      salesCount,
      expectedCash,
      actualCash,
      difference,
      notes: notes.trim() || undefined,
      userId: 'current-user-id'
    };

    onSave(closure);
    onClose();
  };

  const printReceipt = () => {
    const receiptContent = `
      CLÔTURE DE CAISSE
      ${new Date().toLocaleDateString('fr-FR')}
      ${new Date().toLocaleTimeString('fr-FR')}
      
      ================================
      RÉSUMÉ DES VENTES
      ================================
      Nombre de ventes: ${salesCount}
      Total des ventes: ${formatCurrency(totalSales)}
      
      RÉPARTITION PAR MODE DE PAIEMENT
      ================================
      Espèces: ${formatCurrency(totalCash)}
      Carte: ${formatCurrency(totalCard)}
      Virement: ${formatCurrency(totalTransfer)}
      Chèque: ${formatCurrency(totalCheck)}
      
      CONTRÔLE CAISSE
      ================================
      Espèces attendues: ${formatCurrency(expectedCash)}
      Espèces comptées: ${formatCurrency(actualCash)}
      Différence: ${formatCurrency(difference)}
      
      ${notes ? `Notes: ${notes}` : ''}
      
      ================================
      Signature: ___________________
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Clôture de caisse</title>
            <style>
              body { font-family: monospace; white-space: pre-line; padding: 20px; }
            </style>
          </head>
          <body>${receiptContent}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <Calculator size={24} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Clôture de caisse</h2>
              <p className="text-gray-600">Résumé des ventes du jour</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Résumé des ventes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Statistiques générales */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText size={20} className="text-blue-600" />
                Résumé des ventes
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Nombre de ventes:</span>
                  <span className="font-bold text-gray-900">{salesCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Total des ventes:</span>
                  <span className="font-bold text-green-600 text-lg">{formatCurrency(totalSales)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Période:</span>
                  <span className="font-medium text-gray-900">
                    {new Date().toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
            </div>

            {/* Répartition par mode de paiement */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign size={20} className="text-green-600" />
                Modes de paiement
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Banknote size={16} className="text-green-600" />
                    <span className="text-gray-700">Espèces:</span>
                  </div>
                  <span className="font-bold text-gray-900">{formatCurrency(totalCash)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CreditCard size={16} className="text-blue-600" />
                    <span className="text-gray-700">Carte:</span>
                  </div>
                  <span className="font-bold text-gray-900">{formatCurrency(totalCard)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-purple-600" />
                    <span className="text-gray-700">Virement:</span>
                  </div>
                  <span className="font-bold text-gray-900">{formatCurrency(totalTransfer)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-orange-600" />
                    <span className="text-gray-700">Chèque:</span>
                  </div>
                  <span className="font-bold text-gray-900">{formatCurrency(totalCheck)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contrôle de caisse */}
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-6 border border-yellow-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calculator size={20} className="text-yellow-600" />
              Contrôle de caisse
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Espèces attendues</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(expectedCash)}</p>
              </div>
              
              <div className="text-center">
                <label className="block text-sm text-gray-600 mb-1">Espèces comptées</label>
                <input
                  type="number"
                  step="0.01"
                  value={actualCash}
                  onChange={(e) => setActualCash(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center font-bold text-lg"
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Différence</p>
                <p className={`text-xl font-bold ${
                  difference === 0 ? 'text-green-600' : 
                  difference > 0 ? 'text-blue-600' : 'text-red-600'
                }`}>
                  {difference > 0 ? '+' : ''}{formatCurrency(difference)}
                </p>
              </div>
            </div>

            {difference !== 0 && (
              <div className={`flex items-center gap-2 p-3 rounded-lg ${
                difference > 0 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
              }`}>
                <AlertCircle size={16} />
                <span className="text-sm font-medium">
                  {difference > 0 
                    ? `Excédent de ${formatCurrency(Math.abs(difference))} détecté`
                    : `Manque de ${formatCurrency(Math.abs(difference))} détecté`
                  }
                </span>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (optionnel)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Commentaires, observations, incidents..."
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={printReceipt}
              className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <FileText size={20} />
              Aperçu du reçu
            </button>
            
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
            
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <Calculator size={20} />
              Clôturer la caisse
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
