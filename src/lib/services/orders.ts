// Service layer for order operations.
// When Supabase is connected, these functions replace direct context mutations.

import { supabase } from '@/lib/supabase/client';
import type {
  Order,
  OrderItem,
  OrderStatus,
  OrderType,
  PaymentMethod,
} from '@/lib/supabase/database.types';

export type { Order, OrderItem, OrderStatus, OrderType, PaymentMethod };

export interface CreateOrderPayload {
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  customer_id?: string;
  order_type: OrderType;
  payment_method: PaymentMethod;
  notes?: string;
  delivery_address?: string;
  items: Array<{
    product_id?: string;
    product_name: string;
    product_price: number;
    quantity: number;
  }>;
}

// ─── Read ─────────────────────────────────────────────────────────────────────

export async function fetchOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function fetchOrdersByCustomer(customerId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function fetchOrderItems(orderId: string): Promise<OrderItem[]> {
  const { data, error } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', orderId);

  if (error) throw error;
  return data ?? [];
}

// ─── Write ────────────────────────────────────────────────────────────────────

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const { items, ...orderFields } = payload;

  const total = items.reduce(
    (sum, item) => sum + item.product_price * item.quantity,
    0
  );

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({ ...orderFields, total })
    .select()
    .single();

  if (orderError) throw orderError;

  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    product_name: item.product_name,
    product_price: item.product_price,
    quantity: item.quantity,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) throw itemsError;

  return order;
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<void> {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId);

  if (error) throw error;
}

// ─── Real-time subscription helper ───────────────────────────────────────────

export function subscribeToOrders(
  onUpdate: (orders: Order[]) => void
): () => void {
  const channel = supabase
    .channel('orders-realtime')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'orders' },
      async () => {
        const orders = await fetchOrders();
        onUpdate(orders);
      }
    )
    .subscribe();

  return () => { supabase.removeChannel(channel); };
}
