import { useState, useEffect } from 'react';
import { mockSales, mockCustomers, mockProducts, mockFinancialRecords } from '../data/mockData';
import { DashboardStats } from '../types';

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    todaySales: 0,
    monthSales: 0,
    totalCustomers: 0,
    lowStockItems: 0,
    cashFlow: 0,
    topProducts: [],
  });

  useEffect(() => {
    // Simuler un calcul asynchrone
    const calculateStats = () => {
      const today = new Date();
      const todayString = today.toISOString().split('T')[0];
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];

      const todaySales = mockSales
        .filter(sale => sale.date.startsWith(todayString))
        .reduce((sum, sale) => sum + sale.amount, 0);

      const monthSales = mockSales
        .filter(sale => sale.date >= firstDayOfMonth)
        .reduce((sum, sale) => sum + sale.amount, 0);

      const totalCustomers = mockCustomers.length;

      const lowStockItems = mockProducts.filter(p => p.stock < p.minStock).length;

      // Calcul de la trésorerie à partir des enregistrements financiers
      const totalIncome = mockFinancialRecords
        .filter(record => record.type === 'income')
        .reduce((sum, record) => sum + record.amount, 0);

      const totalExpenses = mockFinancialRecords
        .filter(record => record.type === 'expense')
        .reduce((sum, record) => sum + record.amount, 0);

      const cashFlow = totalIncome - totalExpenses;

      const productSales: { [key: string]: number } = {};
      mockSales.forEach(sale => {
        sale.items.forEach(item => {
          productSales[item.name] = (productSales[item.name] || 0) + item.quantity;
        });
      });

      const topProducts = Object.entries(productSales)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([name, sales]) => ({ name, sales }));

      setStats({
        todaySales,
        monthSales,
        totalCustomers,
        lowStockItems,
        cashFlow,
        topProducts,
      });
    };

    calculateStats();
  }, []);

  return stats;
}
