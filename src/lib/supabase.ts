import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Types for database tables
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          company: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          company: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          company?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      clients: {
        Row: {
          id: string;
          name: string;
          email: string | null;
          phone: string | null;
          address: string | null;
          loyalty_points: number;
          total_purchases: number;
          last_purchase: string | null;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          loyalty_points?: number;
          total_purchases?: number;
          last_purchase?: string | null;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          loyalty_points?: number;
          total_purchases?: number;
          last_purchase?: string | null;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          category: 'raw_material' | 'sale_item';
          stock: number;
          min_stock: number;
          unit_price: number;
          cost_price: number | null;
          supplier_id: string | null;
          user_id: string;
          last_restocked: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: 'raw_material' | 'sale_item';
          stock?: number;
          min_stock?: number;
          unit_price: number;
          cost_price?: number | null;
          supplier_id?: string | null;
          user_id: string;
          last_restocked?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: 'raw_material' | 'sale_item';
          stock?: number;
          min_stock?: number;
          unit_price?: number;
          cost_price?: number | null;
          supplier_id?: string | null;
          user_id?: string;
          last_restocked?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      sales: {
        Row: {
          id: string;
          client_id: string | null;
          total_amount: number;
          payment_method: 'cash' | 'card' | 'transfer' | 'check';
          payment_status: 'pending' | 'paid' | 'overdue' | 'cancelled';
          sale_status: 'paid_delivered' | 'paid_not_delivered' | 'delivered_not_paid';
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id?: string | null;
          total_amount: number;
          payment_method?: 'cash' | 'card' | 'transfer' | 'check';
          payment_status?: 'pending' | 'paid' | 'overdue' | 'cancelled';
          sale_status?: 'paid_delivered' | 'paid_not_delivered' | 'delivered_not_paid';
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string | null;
          total_amount?: number;
          payment_method?: 'cash' | 'card' | 'transfer' | 'check';
          payment_status?: 'pending' | 'paid' | 'overdue' | 'cancelled';
          sale_status?: 'paid_delivered' | 'paid_not_delivered' | 'delivered_not_paid';
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      finance: {
        Row: {
          id: string;
          type: 'income' | 'expense';
          amount: number;
          description: string;
          category: string;
          sale_id: string | null;
          receipt_url: string | null;
          user_id: string;
          created_at: string;
          updated_at: string;
          closing_date: string | null;
        };
        Insert: {
          id?: string;
          type: 'income' | 'expense';
          amount: number;
          description: string;
          category: string;
          sale_id?: string | null;
          receipt_url?: string | null;
          user_id: string;
          created_at?: string;
          updated_at?: string;
          closing_date?: string | null;
        };
        Update: {
          id?: string;
          type?: 'income' | 'expense';
          amount?: number;
          description?: string;
          category?: string;
          sale_id?: string | null;
          receipt_url?: string | null;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
          closing_date?: string | null;
        };
      };
      journal: {
        Row: {
          id: string;
          title: string;
          content: string;
          mood: 'excellent' | 'good' | 'neutral' | 'difficult' | 'challenging';
          category: 'business' | 'personal' | 'goals' | 'reflection' | 'ideas';
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          mood?: 'excellent' | 'good' | 'neutral' | 'difficult' | 'challenging';
          category?: 'business' | 'personal' | 'goals' | 'reflection' | 'ideas';
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          mood?: 'excellent' | 'good' | 'neutral' | 'difficult' | 'challenging';
          category?: 'business' | 'personal' | 'goals' | 'reflection' | 'ideas';
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      production_plans: {
        Row: {
          id: string;
          product_id: string;
          quantity: number;
          status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
          due_date: string;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          quantity: number;
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
          due_date: string;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          quantity?: number;
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
          due_date?: string;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      production_history: {
        Row: {
          id: string;
          production_plan_id: string;
          product_id: string;
          quantity_produced: number;
          status: 'completed' | 'failed';
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          production_plan_id: string;
          product_id: string;
          quantity_produced: number;
          status?: 'completed' | 'failed';
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          production_plan_id?: string;
          product_id?: string;
          quantity_produced?: number;
          status?: 'completed' | 'failed';
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      stock_updates: {
        Row: {
          id: string;
          product_id: string;
          quantity_change: number;
          type: 'entry' | 'exit';
          description: string | null;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          quantity_change: number;
          type: 'entry' | 'exit';
          description?: string | null;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          quantity_change?: number;
          type?: 'entry' | 'exit';
          description?: string | null;
          user_id?: string;
          created_at?: string;
        };
      };
      suppliers: {
        Row: {
          id: string;
          name: string;
          contact_person: string | null;
          email: string | null;
          phone: string | null;
          address: string | null;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          contact_person?: string | null;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          contact_person?: string | null;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      supplier_products: {
        Row: {
          id: string;
          supplier_id: string;
          product_name: string;
          unit_price: number;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          supplier_id: string;
          product_name: string;
          unit_price: number;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          supplier_id?: string;
          product_name?: string;
          unit_price?: number;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      supplier_invoices: {
        Row: {
          id: string;
          supplier_id: string;
          invoice_number: string;
          amount: number;
          due_date: string;
          payment_status: 'pending' | 'paid' | 'overdue';
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          supplier_id: string;
          invoice_number: string;
          amount: number;
          due_date: string;
          payment_status?: 'pending' | 'paid' | 'overdue';
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          supplier_id?: string;
          invoice_number?: string;
          amount?: number;
          due_date?: string;
          payment_status?: 'pending' | 'paid' | 'overdue';
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
