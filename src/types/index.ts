export interface User {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'manager' | 'employee';
  company: string;
  avatar?: string;
}

export interface Sale {
  id: string;
  date: string;
  amount: number;
  customer: Customer;
  items: SaleItem[];
  paymentMethod: 'cash' | 'card' | 'transfer' | 'check';
  status: 'completed' | 'pending' | 'cancelled';
  saleStatus: 'paid_delivered' | 'paid_not_delivered' | 'delivered_not_paid';
}

export interface SaleItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  totalPurchases: number;
  lastPurchase: string;
  loyaltyPoints: number;
}

export interface Product {
  id: string;
  name: string;
  category: 'raw_material' | 'sale_item';
  price: number;
  stock: number;
  minStock: number;
  supplier?: string;
  lastRestocked: string;
}

export interface FinancialRecord {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  receipt?: string;
}

export interface DashboardStats {
  todaySales: number;
  monthSales: number;
  totalCustomers: number;
  lowStockItems: number;
  cashFlow: number;
  topProducts: Array<{ name: string; sales: number }>;
}

export interface Notification {
  id: string;
  type: 'stock' | 'payment' | 'sale' | 'motivation';
  title: string;
  message: string;
  date: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface CashRegisterClosure {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  totalSales: number;
  totalCash: number;
  totalCard: number;
  totalTransfer: number;
  totalCheck: number;
  salesCount: number;
  expectedCash: number;
  actualCash: number;
  difference: number;
  notes?: string;
  userId: string;
}

export interface Supplier {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  contactPerson?: string;
  paymentTerms: string;
  status: 'active' | 'inactive';
  totalDebt: number;
  totalCredit: number;
  lastOrder?: string;
}

export interface SupplierProduct {
  id: string;
  supplierId: string;
  productName: string;
  supplierReference: string;
  unitPrice: number;
  minOrderQuantity: number;
  deliveryTime: number; // en jours
  isActive: boolean;
}

export interface SupplierInvoice {
  id: string;
  supplierId: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  items: SupplierInvoiceItem[];
  notes?: string;
}

export interface SupplierInvoiceItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface StockUpdate {
  id: string;
  productId: string;
  type: 'entry' | 'exit';
  quantity: number;
  reason: string;
  description?: string;
  date: string;
  userId: string;
}
