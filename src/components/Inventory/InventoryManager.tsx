import React, { useState } from 'react';
import { Plus, Search, Filter, AlertTriangle, Package, TrendingDown, Edit, Trash2, Building2, RefreshCw, History } from 'lucide-react';
import NewProductModal from './NewProductModal';
import StockUpdateModal from './StockUpdateModal';
import SupplierManager from './SupplierManager';
import { mockProducts } from '../../data/mockData';
import { Product, StockUpdate } from '../../types';

export default function InventoryManager() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [showStockUpdateModal, setShowStockUpdateModal] = useState(false);
  const [showSupplierManager, setShowSupplierManager] = useState(false);
  const [stockUpdates, setStockUpdates] = useState<StockUpdate[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleAddProduct = (newProduct: Product) => {
    setProducts([newProduct, ...products]);
  };

  const handleStockUpdate = (update: StockUpdate) => {
    setStockUpdates([update, ...stockUpdates]);
    
    // Mettre à jour le stock du produit
    setProducts(products.map(p => {
      if (p.id === update.productId) {
        const newStock = update.type === 'entry' 
          ? p.stock + update.quantity 
          : Math.max(0, p.stock - update.quantity);
        
        return {
          ...p,
          stock: newStock,
          lastRestocked: update.type === 'entry' ? new Date().toISOString().split('T')[0] : p.lastRestocked
        };
      }
      return p;
    }));
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    // Ici vous pourriez ouvrir un modal d'édition
    alert(`Édition du produit: ${product.name}`);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const handleRestock = (product: Product) => {
    const quantity = prompt(`Quantité à ajouter au stock de ${product.name}:`);
    if (quantity && !isNaN(parseInt(quantity))) {
      setProducts(products.map(p => 
        p.id === product.id 
          ? { ...p, stock: p.stock + parseInt(quantity), lastRestocked: new Date().toISOString().split('T')[0] }
          : p
      ));
    }
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

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock === 0) return { status: 'Rupture', color: 'bg-red-100 text-red-800', icon: AlertTriangle };
    if (stock <= minStock) return { status: 'Stock faible', color: 'bg-yellow-100 text-yellow-800', icon: TrendingDown };
    return { status: 'En stock', color: 'bg-green-100 text-green-800', icon: Package };
  };

  const lowStockProducts = products.filter(p => p.stock <= p.minStock);
  const outOfStockProducts = products.filter(p => p.stock === 0);
  const totalValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);

  // Filtrer les produits selon le terme de recherche
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.supplier?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des stocks</h1>
          <p className="text-gray-600">Gérez votre inventaire et approvisionnements</p>
        </div>
        
        <button 
          onClick={() => setShowNewProductModal(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 flex items-center gap-2"
        >
          <Plus size={20} />
          Nouveau produit
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total produits</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <Package className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Valeur stock</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <Package className="text-green-600" size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Stock faible</p>
              <p className="text-2xl font-bold text-yellow-600">{lowStockProducts.length}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-xl">
              <TrendingDown className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Ruptures</p>
              <p className="text-2xl font-bold text-red-600">{outOfStockProducts.length}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-xl">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {lowStockProducts.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="text-yellow-600" size={24} />
            <h3 className="text-lg font-bold text-yellow-800">Alertes stock</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl p-4 border border-yellow-200">
                <h4 className="font-semibold text-gray-900">{product.name}</h4>
                <p className="text-sm text-gray-600">Stock: {product.stock} / Min: {product.minStock}</p>
                <button 
                  onClick={() => handleRestock(product)}
                  className="mt-2 text-sm bg-yellow-600 text-white px-3 py-1 rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Réapprovisionner
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher un produit..."
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

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-900">Produit</th>
                <th className="text-left p-4 font-semibold text-gray-900">Catégorie</th>
                <th className="text-left p-4 font-semibold text-gray-900">Prix</th>
                <th className="text-left p-4 font-semibold text-gray-900">Stock</th>
                <th className="text-left p-4 font-semibold text-gray-900">Statut</th>
                <th className="text-left p-4 font-semibold text-gray-900">Fournisseur</th>
                <th className="text-left p-4 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock, product.minStock);
                const StatusIcon = stockStatus.icon;
                
                return (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                          {product.name.charAt(0)}
                        </div>
                        <div>
                          <span className="text-gray-900 font-medium">{product.name}</span>
                          <div className="text-sm text-gray-500">
                            Réappro: {formatDate(product.lastRestocked)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {product.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-900 font-bold">
                        {formatCurrency(product.price)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div>
                        <span className="text-gray-900 font-medium">{product.stock}</span>
                        <div className="text-sm text-gray-500">Min: {product.minStock}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <StatusIcon size={16} className={stockStatus.color.includes('red') ? 'text-red-600' : 
                                                        stockStatus.color.includes('yellow') ? 'text-yellow-600' : 'text-green-600'} />
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${stockStatus.color}`}>
                          {stockStatus.status}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-700">{product.supplier || 'N/A'}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEditProduct(product)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Actions rapides</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button 
            onClick={() => setShowNewProductModal(true)}
            className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
          >
            <Plus size={24} className="mb-2" />
            <span className="block font-medium">Nouveau produit</span>
          </button>
          
          <button 
            onClick={() => setShowStockUpdateModal(true)}
            className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
          >
            <RefreshCw size={24} className="mb-2" />
            <span className="block font-medium">Mise à jour stock</span>
          </button>
          
          <button 
            onClick={() => setShowSupplierManager(true)}
            className="p-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
          >
            <Building2 size={24} className="mb-2" />
            <span className="block font-medium">Gestion fournisseurs</span>
          </button>
          
          <button 
            onClick={() => alert('Historique des mouvements de stock à venir')}
            className="p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
          >
            <History size={24} className="mb-2" />
            <span className="block font-medium">Historique stock</span>
          </button>
        </div>
      </div>

      {/* Modal Nouveau Produit */}
      <NewProductModal
        isOpen={showNewProductModal}
        onClose={() => setShowNewProductModal(false)}
        onSave={handleAddProduct}
      />

      {/* Modal Mise à jour Stock */}
      <StockUpdateModal
        isOpen={showStockUpdateModal}
        onClose={() => setShowStockUpdateModal(false)}
        onSave={handleStockUpdate}
      />

      {/* Modal Gestion Fournisseurs */}
      <SupplierManager
        isOpen={showSupplierManager}
        onClose={() => setShowSupplierManager(false)}
      />
    </div>
  );
}
