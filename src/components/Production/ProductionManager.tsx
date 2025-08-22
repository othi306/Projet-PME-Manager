import React, { useState } from 'react';
import ProductionPlanModal from './ProductionPlanModal';
import ProductionHistoryManager from './ProductionHistoryManager';
import { Database } from '../../lib/supabase';

type ProductionPlan = Database['public']['Tables']['production_plans']['Row'];

export default function ProductionManager() {
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [refreshHistory, setRefreshHistory] = useState(false);

  const handleSavePlan = (newPlan: ProductionPlan) => {
    console.log('Nouveau plan de production enregistré:', newPlan);
    setRefreshHistory(prev => !prev); // Trigger refresh of history
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestion de la Production</h1>
        <button
          onClick={() => setIsPlanModalOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
        >
          Planifier une production
        </button>
      </div>

      <ProductionHistoryManager key={refreshHistory.toString()} />

      <ProductionPlanModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        onSave={handleSavePlan}
      />
    </div>
  );
}
