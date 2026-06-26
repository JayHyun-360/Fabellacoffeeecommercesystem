// Service layer for order operations.
// When Supabase is connected, these functions replace direct context mutations.

import { supabase } from "@/lib/supabase/client";
import type {
  Order,
  OrderItem,
  OrderStatus,
  OrderType,
  PaymentMethod,
} from "@/lib/supabase/database.types";

export type { Order, OrderItem, OrderStatus, OrderType, PaymentMethod };

export interface CreateOrderPayload {
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  customer_id?: string;
  order_type: OrderType;
  payment_method: PaymentMethod;
  notes?: string;
  notes_data?: {
    customer?: string | null;
    staff?: string | null;
    delivery?: string | null;
    internal?: string | null;
  };
  delivery_address?: string;
  queue_number: number;
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
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function fetchOrdersByCustomer(
  customerId: string,
): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function fetchOrderItems(orderId: string): Promise<OrderItem[]> {
  const { data, error } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId);

  if (error) throw error;
  return data ?? [];
}

// ─── Write ────────────────────────────────────────────────────────────────────

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const { items, ...orderFields } = payload;

  const total = items.reduce(
    (sum, item) => sum + item.product_price * item.quantity,
    0,
  );

  const insertData: any = {
    customer_name: payload.customer_name,
    customer_id: payload.customer_id || null,
    customer_email: payload.customer_email || null,
    customer_phone: payload.customer_phone || null,
    order_type: payload.order_type,
    payment_method: payload.payment_method,
    delivery_address: payload.delivery_address || null,
    notes: payload.notes || null,
    total,
    status: "pending",
  };

  const resolvedNotesData = payload.notes_data ?? {
    customer: payload.notes ?? null,
    staff: null,
    delivery: null,
    internal: null,
  };

  insertData.notes_data = resolvedNotesData;

  if (payload.queue_number !== undefined) {
    insertData.queue_number = payload.queue_number;
  }

  const { data, error: orderError } = await supabase
    .from("orders")
    .insert(insertData)
    .select()
    .single();

  if (orderError) throw orderError;
  const order = data as Order;

  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.product_id || null,
    product_name: item.product_name,
    product_price: item.product_price,
    quantity: item.quantity,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems as any);

  if (itemsError) throw itemsError;

  return order;
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
): Promise<void> {
  const { error } = await (supabase.from("orders") as any)
    .update({ status })
    .eq("id", orderId);

  if (error) throw error;
}

// ─── Real-time subscription helper ───────────────────────────────────────────

export function subscribeToOrders(
  onUpdate: (orders: Order[]) => void,
): () => void {
  const channel = supabase
    .channel("orders-realtime")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "orders" },
      async () => {
        const orders = await fetchOrders();
        onUpdate(orders);
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
