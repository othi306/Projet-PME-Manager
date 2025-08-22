import { Customer, Product, Sale, FinancialRecord, DashboardStats, Notification } from '../types';

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const twoDaysAgo = new Date(today);
twoDaysAgo.setDate(today.getDate() - 2);

const formatToISO = (date: Date) => date.toISOString().split('.')[0] + 'Z';

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Marie Dubois',
    email: 'marie.dubois@email.com',
    phone: '06 12 34 56 78',
    totalPurchases: 1250.50,
    lastPurchase: formatToISO(yesterday),
    loyaltyPoints: 125
  },
  {
    id: '2',
    name: 'Pierre Martin',
    email: 'pierre.martin@email.com',
    phone: '06 98 76 54 32',
    totalPurchases: 890.30,
    lastPurchase: formatToISO(twoDaysAgo),
    loyaltyPoints: 89
  },
  {
    id: '3',
    name: 'Sophie Laurent',
    email: 'sophie.laurent@email.com',
    phone: '06 55 44 33 22',
    totalPurchases: 2100.75,
    lastPurchase: formatToISO(today),
    loyaltyPoints: 210
  },
  {
    id: '4',
    name: 'Marc Dupont',
    email: 'marc.dupont@email.com',
    phone: '07 11 22 33 44',
    totalPurchases: 500.00,
    lastPurchase: formatToISO(yesterday),
    loyaltyPoints: 50
  },
  {
    id: '5',
    name: 'Julie Petit',
    email: 'julie.petit@email.com',
    phone: '07 55 66 77 88',
    totalPurchases: 150.00,
    lastPurchase: formatToISO(today),
    loyaltyPoints: 15
  }
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Pain de campagne',
    category: 'Boulangerie',
    price: 3.50,
    stock: 25,
    minStock: 10,
    supplier: 'Moulin Blanc',
    lastRestocked: formatToISO(yesterday)
  },
  {
    id: '2',
    name: 'Croissant',
    category: 'Viennoiserie',
    price: 1.20,
    stock: 5, // Low stock
    minStock: 15,
    supplier: 'Beurre d\'Or',
    lastRestocked: formatToISO(twoDaysAgo)
  },
  {
    id: '3',
    name: 'Tarte aux pommes',
    category: 'Pâtisserie',
    price: 18.50,
    stock: 8,
    minStock: 5,
    supplier: 'Fruits du Verger',
    lastRestocked: formatToISO(yesterday)
  },
  {
    id: '4',
    name: 'Baguette Tradition',
    category: 'Boulangerie',
    price: 1.10,
    stock: 50,
    minStock: 20,
    supplier: 'Moulin Blanc',
    lastRestocked: formatToISO(today)
  },
  {
    id: '5',
    name: 'Éclair au chocolat',
    category: 'Pâtisserie',
    price: 3.00,
    stock: 12,
    minStock: 8,
    supplier: 'Choco Rêve',
    lastRestocked: formatToISO(yesterday)
  }
];

export const mockSales: Sale[] = [
  {
    id: '1',
    date: formatToISO(today),
    amount: 25.40,
    customer: mockCustomers[0],
    items: [
      { id: '1', name: 'Pain de campagne', quantity: 2, unitPrice: 3.50, total: 7.00 },
      { id: '2', name: 'Croissant', quantity: 4, unitPrice: 1.20, total: 4.80 },
      { id: '3', name: 'Tarte aux pommes', quantity: 1, unitPrice: 18.50, total: 18.50 }
    ],
    paymentMethod: 'card',
    status: 'completed'
  },
  {
    id: '2',
    date: formatToISO(today),
    amount: 15.00,
    customer: mockCustomers[4],
    items: [
      { id: '4', name: 'Baguette Tradition', quantity: 5, unitPrice: 1.10, total: 5.50 },
      { id: '5', name: 'Éclair au chocolat', quantity: 3, unitPrice: 3.00, total: 9.00 }
    ],
    paymentMethod: 'cash',
    status: 'completed'
  },
  {
    id: '3',
    date: formatToISO(yesterday),
    amount: 50.00,
    customer: mockCustomers[2],
    items: [
      { id: '3', name: 'Tarte aux pommes', quantity: 2, unitPrice: 18.50, total: 37.00 },
      { id: '1', name: 'Pain de campagne', quantity: 3, unitPrice: 3.50, total: 10.50 }
    ],
    paymentMethod: 'card',
    status: 'completed'
  },
  {
    id: '4',
    date: formatToISO(twoDaysAgo),
    amount: 10.00,
    customer: mockCustomers[1],
    items: [
      { id: '2', name: 'Croissant', quantity: 8, unitPrice: 1.20, total: 9.60 }
    ],
    paymentMethod: 'card',
    status: 'completed'
  }
];

export const mockFinancialRecords: FinancialRecord[] = [
  {
    id: '1',
    date: formatToISO(today),
    type: 'income',
    category: 'Ventes',
    amount: 25.40 + 15.00,
    description: 'Ventes journée'
  },
  {
    id: '2',
    date: formatToISO(today),
    type: 'expense',
    category: 'Matières premières',
    amount: 150.00,
    description: 'Achat farine et beurre'
  },
  {
    id: '3',
    date: formatToISO(yesterday),
    type: 'income',
    category: 'Ventes',
    amount: 50.00,
    description: 'Ventes hier'
  },
  {
    id: '4',
    date: formatToISO(yesterday),
    type: 'expense',
    category: 'Salaires',
    amount: 1200.00,
    description: 'Paiement salaires'
  }
];

export const mockDashboardStats: DashboardStats = {
  todaySales: 0, // Calculated by hook
  monthSales: 0, // Calculated by hook
  totalCustomers: mockCustomers.length,
  lowStockItems: mockProducts.filter(p => p.stock < p.minStock).length,
  cashFlow: 0, // Calculated by hook
  topProducts: [] // Calculated by hook
};

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'stock',
    title: 'Stock faible',
    message: 'Croissants: seulement 5 unités restantes',
    date: formatToISO(today),
    read: false,
    priority: 'high'
  },
  {
    id: '2',
    type: 'motivation',
    title: 'Excellente journée !',
    message: 'Vous avez déjà dépassé votre objectif quotidien de 20% !',
    date: formatToISO(today),
    read: false,
    priority: 'medium'
  },
  {
    id: '3',
    type: 'payment',
    title: 'Paiement en attente',
    message: 'Facture #1234 - Marie Dubois (125.50€)',
    date: formatToISO(yesterday),
    read: true,
    priority: 'medium'
  }
];

export const motivationalMessages = [
  "Chaque jour est une nouvelle opportunité de réussir !",
  "Votre passion fait la différence dans votre entreprise.",
  "Les petits pas d'aujourd'hui sont les grands succès de demain.",
  "Votre détermination inspire votre équipe et vos clients.",
  "L'excellence n'est pas un acte, mais une habitude.",
  "Votre entreprise grandit grâce à votre vision et votre travail.",
  "Chaque client satisfait est un ambassadeur de votre réussite.",
  "L'innovation commence par oser faire différemment."
];
