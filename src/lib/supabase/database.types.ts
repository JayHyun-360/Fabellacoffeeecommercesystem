// ─── Enums ───────────────────────────────────────────────────────────────────

export type AppRole = 'admin' | 'staff' | 'customer';
export type ProductCategory = 'coffee' | 'food' | 'pastries' | 'beverages';
export type DisplayType = 'regular' | 'promo' | 'set' | 'featured';
export type OrderStatus = 'pending' | 'ongoing' | 'completed' | 'cancelled';
export type OrderType = 'dine-in' | 'takeout' | 'delivery' | 'pickup';
export type PaymentMethod = 'cod' | 'gcash' | 'card';

// ─── Table Row Types ──────────────────────────────────────────────────────────

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: AppRole;
  is_anonymous: boolean;
  created_at: string;
  updated_at: string;
}

export interface SetItem {
  product_name: string;
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  promo_price: number | null;
  category: ProductCategory;
  display_type: DisplayType;
  image: string;
  available: boolean;
  set_items: SetItem[] | null;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  queue_number: number;
  customer_id: string | null;       // null for guest orders
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  order_type: OrderType;
  payment_method: PaymentMethod;
  status: OrderStatus;
  total: number;
  notes: string | null;
  delivery_address: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;             // denormalized snapshot
  product_price: number;            // snapshot at time of order
  quantity: number;
  subtotal: number;
}

export interface StoreSettings {
  id: string;
  store_name: string;
  email: string;
  phone: string;
  address: string;
  weekday_hours: string;
  weekend_hours: string;
  announcement: string | null;
  hero_slides: HeroSlide[];
  updated_at: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

// ─── Database Schema Shape (used by Supabase client generic) ─────────────────

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
      };
      products: {
        Row: Product;
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Product, 'id' | 'created_at'>>;
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, 'id' | 'queue_number' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Order, 'id' | 'created_at'>>;
      };
      order_items: {
        Row: OrderItem;
        Insert: Omit<OrderItem, 'id'>;
        Update: Partial<Omit<OrderItem, 'id' | 'order_id'>>;
      };
      store_settings: {
        Row: StoreSettings;
        Insert: Omit<StoreSettings, 'id' | 'updated_at'>;
        Update: Partial<Omit<StoreSettings, 'id'>>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      app_role: AppRole;
      product_category: ProductCategory;
      display_type: DisplayType;
      order_status: OrderStatus;
      order_type: OrderType;
      payment_method: PaymentMethod;
    };
  };
}
