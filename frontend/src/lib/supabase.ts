import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Product {
  id: number;
  name: string;
  quantity: number;
  price: number;
  created_at?: string;
  updated_at?: string;
}

export interface Bill {
  id: string;
  total: number;
  created_by: string;
  created_at: string;
}

export interface BillItem {
  id: string;
  bill_id: string;
  product_id: number | null;
  product_name: string;
  quantity: number;
  price: number;
  subtotal: number;
}
