import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { Database } from '../../lib/supabase';
import { CheckCircle, XCircle, Edit, Save, Loader2 } from 'lucide-react';

type ProductionHistory = Database['public']['Tables']['production_history']['Row'];
type Product = Database['public']['Tables']['products']['Row'];

export default function ProductionHistoryManager() {
  const { user } = useAuth();
  const [history, setHistory] = useState<ProductionHistory[]>([]);
  const [products, setProducts] = useState<Map<string, Product>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchProductionHistory();
      fetchProducts();
    }
  }, [user]);

  const fetchProductionHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('production_history')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHistory(data);
    } catch (err: any) {
      console.error('Erreur lors du chargement de l\'historique de production:', err.message);
      setError('Impossible de charger l\'historique de production.');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;
      const productsMap = new Map<string, Product>();
      data.forEach(product => productsMap.set(product.id, product));
      setProducts(productsMap);
    } catch (err: any) {
      console.error('Erreur lors du chargement des produits:', err.message);
    }
  };

  const handleStatusChange = async (id: string, currentStatus: 'completed' | 'failed') => {
    setStatusUpdateLoading(id);
    setError(null);
    try {
      const newStatus = currentStatus === 'completed' ? 'failed' : 'completed';
      const { error: updateError } = await supabase
        .from('production_history')
        .update({ status: newStatus })
        .eq('id', id);

      if (updateError) throw updateError;

      // If status changes to 'completed', add items to stock
      if (newStatus === 'completed') {
        const item = history.find(h => h.id === id);
        if (item) {
          const product = products.get(item.product_id);
          if (product) {
            // Update product stock
            const { error: productUpdateError } = await supabase
              .from('products')
              .update({ stock: product.stock + item.quantity_produced })
              .eq('id', product.id);

            if (productUpdateError) throw productUpdateError;

            // Add entry to stock_updates history
            const { error: stockUpdateError } = await supabase
              .from('stock_updates')
              .insert({
                product_id: product.id,
                quantity_change: item.quantity_produced,
                type: 'entry',
                description: `Production terminée: ${item.production_plan_id}`,
                user_id: user!.id,
              });

            if (stockUpdateError) throw stockUpdateError;
          }
        }
      }

      setHistory(prev =>
        prev.map(item => (item.id === id ? { ...item, status: newStatus } : item))
      );
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour du statut:', err.message);
      setError('Impossible de mettre à jour le statut.');
    } finally {
      setStatusUpdateLoading(null);
    }
  };

  const getProductName = (productId: string) => {
    return products.get(productId)?.name || 'Produit inconnu';
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Historique de production</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Erreur:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin text-blue-500" size={32} />
        </div>
      ) : history.length === 0 ? (
        <p className="text-gray-600 text-center">Aucun historique de production trouvé.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produit
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantité produite
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date de création
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {history.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {getProductName(item.product_id)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.quantity_produced}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.status === 'completed' ? 'Terminée' : 'Échouée'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleStatusChange(item.id, item.status)}
                      disabled={statusUpdateLoading === item.id}
                      className={`text-blue-600 hover:text-blue-900 ml-4 ${statusUpdateLoading === item.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {statusUpdateLoading === item.id ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : item.status === 'completed' ? (
                        <XCircle size={20} />
                      ) : (
                        <CheckCircle size={20} />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
