import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingCart, User, CreditCard, Banknote, QrCode, Printer } from 'lucide-react';
import { mockProducts, mockCustomers } from '../../data/mockData';
import { Product, Customer, Sale } from '../../types';
import { supabase } from '../../lib/supabase';

interface NewSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sale: Omit<Sale, 'id'>) => void;
}

interface SaleItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  total: number;
}

export default function NewSaleModal({ isOpen, onClose, onSave }: NewSaleModalProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'transfer' | 'check'>('cash');
  const [saleStatus, setSaleStatus] = useState<'paid_delivered' | 'paid_not_delivered' | 'delivered_not_paid'>('paid_delivered');
  const [searchProduct, setSearchProduct] = useState('');
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [saleProducts, setSaleProducts] = useState<Product[]>([]);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  // Charger les produits de vente depuis Supabase
  useEffect(() => {
    const fetchSaleProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('category', 'sale_item');
        
        if (error) {
          console.error('Erreur lors du chargement des produits:', error);
          // Fallback sur les données mock filtrées
          setSaleProducts(mockProducts.filter(p => p.category === 'sale_item'));
        } else {
          setSaleProducts(data || []);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
        // Fallback sur les données mock filtrées
        setSaleProducts(mockProducts.filter(p => p.category === 'sale_item'));
      }
    };

    if (isOpen) {
      fetchSaleProducts();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const addProduct = (product: Product) => {
    const existingItem = saleItems.find(item => item.product.id === product.id);
    
    if (existingItem) {
      setSaleItems(saleItems.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.unitPrice }
          : item
      ));
    } else {
      setSaleItems([...saleItems, {
        product,
        quantity: 1,
        unitPrice: product.price,
        total: product.price
      }]);
    }
    setSearchProduct('');
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setSaleItems(saleItems.filter(item => item.product.id !== productId));
    } else {
      setSaleItems(saleItems.map(item => 
        item.product.id === productId 
          ? { ...item, quantity: newQuantity, total: newQuantity * item.unitPrice }
          : item
      ));
    }
  };

  const totalAmount = saleItems.reduce((sum, item) => sum + item.total, 0);

  const handleSave = () => {
    if (saleItems.length === 0) return;

    const defaultCustomer: Customer = {
      id: 'guest',
      name: 'Client anonyme',
      totalPurchases: 0,
      lastPurchase: new Date().toISOString().split('T')[0],
      loyaltyPoints: 0
    };

    const sale = {
      date: new Date().toISOString(),
      customer: selectedCustomer || defaultCustomer,
      items: saleItems.map(item => ({
        id: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total
      })),
      amount: totalAmount,
      paymentMethod,
      status: 'completed' as const,
      saleStatus
    };

    onSave(sale);
    
    // Reset form
    setSaleItems([]);
    setSelectedCustomer(null);
    setPaymentMethod('cash');
    setSaleStatus('paid_delivered');
    onClose();
  };

  const handlePrintReceipt = () => {
    if (saleItems.length === 0) return;
    
    const receiptContent = `
      REÇU DE VENTE
      ================
      Date: ${new Date().toLocaleDateString('fr-FR')}
      Client: ${selectedCustomer?.name || 'Client anonyme'}
      
      ARTICLES:
      ${saleItems.map(item => 
        `${item.product.name} x${item.quantity} - ${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(item.total)}`
      ).join('\n')}
      
      ================
      TOTAL: ${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totalAmount)}
      Paiement: ${paymentMethod === 'cash' ? 'Espèces' : paymentMethod === 'card' ? 'Carte' : paymentMethod}
      Statut: ${saleStatus === 'paid_delivered' ? 'Payé livré' : 
                saleStatus === 'paid_not_delivered' ? 'Payé non livré' : 'Livré non payé'}
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Reçu de vente</title></head>
          <body style="font-family: monospace; white-space: pre-line;">
            ${receiptContent}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleQrScan = () => {
    // Simulation du scan QR/code-barres
    setShowQrScanner(true);
    // Dans une vraie implémentation, on utiliserait une bibliothèque comme react-qr-scanner
    alert('Fonctionnalité QR/Code-barres à implémenter avec une bibliothèque dédiée');
    setShowQrScanner(false);
  };

  const addNewCustomer = () => {
    if (!newCustomer.name.trim()) {
      alert('Le nom du client est obligatoire');
      return;
    }

    try {
      const customer: Customer = {
        id: Date.now().toString(),
        name: newCustomer.name,
        email: newCustomer.email || undefined,
        phone: newCustomer.phone || undefined,
        address: newCustomer.address || undefined,
        totalPurchases: 0,
        lastPurchase: new Date().toISOString().split('T')[0],
        loyaltyPoints: 0
      };
      
      setSelectedCustomer(customer);
      setNewCustomer({
        name: '',
        email: '',
        phone: '',
        address: ''
      });
      setShowCustomerModal(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du client:', error);
      alert('Erreur lors de l\'ajout du client');
    }
  };

  const filteredProducts = mockProducts.filter(product =>
    product.name.toLowerCase().includes(searchProduct.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <ShoppingCart size={24} className="text-blue-600" />
            Nouvelle vente
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Left Panel - Products */}
          <div className="w-1/2 p-6 border-r border-gray-200 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Produits</h3>
              <button
                onClick={handleQrScan}
                className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                title="Scanner QR/Code-barres"
              >
                <QrCode size={20} />
              </button>
            </div>
            
            {/* Search */}
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchProduct}
              onChange={(e) => setSearchProduct(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            {/* Products Grid - Utiliser saleProducts au lieu de filteredProducts */}
            <div className="grid grid-cols-1 gap-3">
              {(saleProducts.length > 0 ? saleProducts : filteredProducts)
                .filter(product => product.name.toLowerCase().includes(searchProduct.toLowerCase()))
                .map((product) => (
                <button
                  key={product.id}
                  onClick={() => addProduct(product)}
                  className="p-4 border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all text-left"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{product.name}</h4>
                      <p className="text-sm text-gray-500">
                        {product.category === 'sale_item' ? 'Article de vente' : product.category}
                      </p>
                      <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">
                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(product.price)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Panel - Cart */}
          <div className="w-1/2 p-6 flex flex-col">
            {/* Customer Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Client</h3>
              <div className="flex gap-2">
                <select
                  value={selectedCustomer?.id || ''}
                  onChange={(e) => {
                    if (e.target.value === '') {
                      setSelectedCustomer(null);
                    } else {
                      const customer = mockCustomers.find(c => c.id === e.target.value);
                      setSelectedCustomer(customer || null);
                    }
                  }}
                  className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Client anonyme</option>
                  {mockCustomers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                  {selectedCustomer && !mockCustomers.find(c => c.id === selectedCustomer.id) && (
                    <option key={selectedCustomer.id} value={selectedCustomer.id}>
                      {selectedCustomer.name}
                    </option>
                  )}
                </select>
                <button
                  type="button"
                  onClick={() => setShowCustomerModal(true)}
                  className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <User size={20} />
                </button>
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto mb-6">
              <h3 className="text-lg font-semibold mb-3">Panier ({saleItems.length})</h3>
              
              {saleItems.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <ShoppingCart size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>Aucun produit sélectionné</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {saleItems.map((item) => (
                    <div key={item.product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product.name}</h4>
                        <p className="text-sm text-gray-500">
                          {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(item.unitPrice)}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      
                      <div className="w-20 text-right font-bold">
                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(item.total)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-3">Mode de paiement</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-3 rounded-xl border-2 transition-all flex items-center gap-2 ${
                    paymentMethod === 'cash' 
                      ? 'border-green-500 bg-green-50 text-green-700' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Banknote size={20} />
                  Espèces
                </button>
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border-2 transition-all flex items-center gap-2 ${
                    paymentMethod === 'card' 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <CreditCard size={20} />
                  Carte
                </button>
              </div>
            </div>

            {/* Sale Status */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Statut de vente</h3>
              <select
                value={saleStatus}
                onChange={(e) => setSaleStatus(e.target.value as 'paid_delivered' | 'paid_not_delivered' | 'delivered_not_paid')}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="paid_delivered">Payé livré</option>
                <option value="paid_not_delivered">Payé non livré</option>
                <option value="delivered_not_paid">Livré non payé</option>
              </select>
            </div>

            {/* Total and Actions */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-2xl font-bold text-blue-600">
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totalAmount)}
                </span>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="flex-1 p-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handlePrintReceipt}
                  disabled={saleItems.length === 0}
                  className="p-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Imprimer reçu"
                >
                  <Printer size={20} />
                </button>
                <button
                  onClick={handleSave}
                  disabled={saleItems.length === 0}
                  className="flex-1 p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Finaliser la vente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Customer Modal */}
      {showCustomerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Nouveau client</h3>
              <button
                onClick={() => {
                  setShowCustomerModal(false);
                  setNewCustomer({ name: '', email: '', phone: '', address: '' });
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nom du client *"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="email"
                placeholder="Email (optionnel)"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="tel"
                placeholder="Téléphone (optionnel)"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Adresse (optionnel)"
                value={newCustomer.address}
                onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCustomerModal(false);
                  setNewCustomer({ name: '', email: '', phone: '', address: '' });
                }}
                className="flex-1 p-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={addNewCustomer}
                disabled={!newCustomer.name.trim()}
                className="flex-1 p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
