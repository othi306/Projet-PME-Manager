import React, { useState, useEffect } from 'react';
import { X, Package, Plus, Minus, FileText } from 'lucide-react';
import { StockUpdate, Product } from '../../types';
import { mockProducts } from '../../data/mockData';

interface StockUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (update: StockUpdate) => void;
}

export default function StockUpdateModal({ isOpen, onClose, onSave }: StockUpdateModalProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [updateType, setUpdateType] = useState<'entry' | 'exit'>('entry');
  const [quantity, setQuantity] = useState<number>(1);
  const [reason, setReason] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setProducts(mockProducts);
      setSelectedProductId('');
      setUpdateType('entry');
      setQuantity(1);
      setReason('');
      setDescription('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const selectedProduct = products.find(p => p.id === selectedProductId);

  const reasonOptions = {
    entry: [
      'Réapprovisionnement',
      'Retour client',
      'Correction inventaire',
      'Production terminée',
      'Transfert entrepôt',
      'Autre'
    ],
    exit: [
      'Vente',
      'Perte/Casse',
      'Péremption',
      'Correction inventaire',
      'Transfert entrepôt',
      'Échantillon',
      'Autre'
    ]
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProductId || !reason || quantity <= 0) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const update: StockUpdate = {
      id: Date.now().toString(),
      productId: selectedProductId,
      type: updateType,
      quantity,
      reason,
      description: description.trim() || undefined,
      date: new Date().toISOString(),
      userId: 'current-user-id'
    };

    onSave(update);
    onClose();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <Package size={24} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Mise à jour du stock</h2>
              <p className="text-gray-600">Ajouter ou retirer des articles du stock</p>
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
          {/* Type d'opération */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Type d'opération *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUpdateType('entry')}
                className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-center gap-2 ${
                  updateType === 'entry'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Plus size={20} />
                <span className="font-medium">Entrée</span>
              </button>
              <button
                type="button"
                onClick={() => setUpdateType('exit')}
                className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-center gap-2 ${
                  updateType === 'exit'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Minus size={20} />
                <span className="font-medium">Sortie</span>
              </button>
            </div>
          </div>

          {/* Sélection du produit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Produit *
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Sélectionner un produit</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - Stock actuel: {product.stock}
                </option>
              ))}
            </select>
          </div>

          {/* Informations du produit sélectionné */}
          {selectedProduct && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-medium text-gray-900 mb-2">Informations produit</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Stock actuel:</span>
                  <span className="ml-2 font-medium">{selectedProduct.stock}</span>
                </div>
                <div>
                  <span className="text-gray-600">Prix unitaire:</span>
                  <span className="ml-2 font-medium">{formatCurrency(selectedProduct.price)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Catégorie:</span>
                  <span className="ml-2 font-medium">
                    {selectedProduct.category === 'raw_material' ? 'Matière première' : 'Article de vente'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Stock minimum:</span>
                  <span className="ml-2 font-medium">{selectedProduct.minStock}</span>
                </div>
              </div>
            </div>
          )}

          {/* Quantité */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantité *
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            {selectedProduct && (
              <p className="mt-1 text-sm text-gray-600">
                Nouveau stock: {updateType === 'entry' 
                  ? selectedProduct.stock + quantity 
                  : Math.max(0, selectedProduct.stock - quantity)
                }
                {updateType === 'exit' && quantity > selectedProduct.stock && (
                  <span className="text-red-600 ml-2">⚠️ Quantité supérieure au stock disponible</span>
                )}
              </p>
            )}
          </div>

          {/* Motif */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motif *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Sélectionner un motif</option>
              {reasonOptions[updateType].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (optionnel)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Détails supplémentaires..."
            />
          </div>

          {/* Résumé de l'opération */}
          {selectedProduct && reason && (
            <div className={`rounded-xl p-4 border-2 ${
              updateType === 'entry' 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <FileText size={16} className={updateType === 'entry' ? 'text-green-600' : 'text-red-600'} />
                <span className="font-medium text-gray-900">Résumé de l'opération</span>
              </div>
              <p className="text-sm text-gray-700">
                <strong>{updateType === 'entry' ? 'Ajout' : 'Retrait'}</strong> de{' '}
                <strong>{quantity}</strong> unité(s) de{' '}
                <strong>{selectedProduct.name}</strong> pour{' '}
                <strong>{reason.toLowerCase()}</strong>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Impact financier: {updateType === 'entry' ? '+' : '-'}{formatCurrency(quantity * selectedProduct.price)}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className={`flex-1 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 flex items-center justify-center gap-2 ${
                updateType === 'entry'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600'
                  : 'bg-gradient-to-r from-red-600 to-pink-600'
              }`}
            >
              {updateType === 'entry' ? <Plus size={20} /> : <Minus size={20} />}
              {updateType === 'entry' ? 'Ajouter au stock' : 'Retirer du stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
