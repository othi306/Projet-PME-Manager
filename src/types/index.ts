// Types pour les entreprises et utilisateurs
export interface Company {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  siret?: string;
  industry?: string;
  website?: string;
  logo_url?: string;
  subscription_plan: 'basic' | 'premium' | 'enterprise';
  subscription_status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  company_id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'manager' | 'employee';
  permissions: UserPermissions;
  is_active: boolean;
  last_login?: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface UserPermissions {
  sales: boolean;
  inventory: boolean;
  finance: boolean;
  customers: boolean;
  production: boolean;
  reports: boolean;
  settings: boolean;
  user_management: boolean;
}

// Types pour l'authentification
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  company?: Company;
  user_metadata?: {
    name?: string;
    company?: string;
  };
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  company_name: string;
  company_email?: string;
  company_phone?: string;
  industry?: string;
}

export interface SignInData {
  email: string;
  password: string;
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
