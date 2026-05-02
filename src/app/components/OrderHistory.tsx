import { X, Package, Truck, Store, ChevronDown, ChevronUp, Clock, Receipt, XCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export interface SavedOrder {
  orderNumber: string;
  date: string;
  items: { id: number; name: string; price: number; quantity: number; image?: string }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryType: 'delivery' | 'pickup';
  paymentMethod: 'cod' | 'gcash' | 'card';
  name: string;
  address?: string;
  city?: string;
  status: 'pending' | 'cancelled' | 'ongoing' | 'received';
}

interface OrderHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  orders: SavedOrder[];
  onUpdateStatus: (orderNumber: string, newStatus: SavedOrder['status']) => void;
}

const STATUS_CONFIG: Record<SavedOrder['status'], { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: 'text-amber-700', bg: 'bg-amber-50' },
  cancelled: { label: 'Cancelled', color: 'text-red-700', bg: 'bg-red-50' },
  ongoing: { label: 'On Going (On Delivery)', color: 'text-blue-700', bg: 'bg-blue-50' },
  received: { label: 'Received (Completed)', color: 'text-green-700', bg: 'bg-green-50' },
};

const PAYMENT_LABELS: Record<string, string> = {
  cod: 'Cash on Delivery',
  gcash: 'GCash',
  card: 'Credit / Debit Card',
};

function OrderCard({ order, onUpdateStatus }: { order: SavedOrder; onUpdateStatus: (orderNumber: string, newStatus: SavedOrder['status']) => void }) {
  const [expanded, setExpanded] = useState(false);
  const status = STATUS_CONFIG[order.status];

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel this order?')) {
      onUpdateStatus(order.orderNumber, 'cancelled');
    }
  };

  const handleProgressStatus = () => {
    if (order.status === 'pending') {
      onUpdateStatus(order.orderNumber, 'ongoing');
    } else if (order.status === 'ongoing') {
      onUpdateStatus(order.orderNumber, 'received');
    }
  };

  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden">
      {/* Order Header */}
      <div
        className="p-4 flex items-start gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
          {order.deliveryType === 'delivery'
            ? <Truck className="w-5 h-5 text-gray-600" />
            : <Store className="w-5 h-5 text-gray-600" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm tracking-wider">{order.orderNumber}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full ${status.bg} ${status.color}`}>
              {status.label}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{order.date}</p>
          <p className="text-sm mt-1">
            {order.items.length} item{order.items.length !== 1 ? 's' : ''} · <span>₱{order.total}</span>
          </p>
        </div>

        <div className="flex-shrink-0 text-gray-400 mt-1">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-gray-100 p-4 space-y-4 bg-gray-50/50">
          {/* Items */}
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm">{item.name}</p>
                  <p className="text-xs text-gray-400">×{item.quantity}</p>
                </div>
                <p className="text-sm">₱{item.price * item.quantity}</p>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 pt-3 space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span>₱{order.subtotal}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Delivery</span>
              <span>{order.deliveryFee === 0 ? 'Free' : `₱${order.deliveryFee}`}</span>
            </div>
            <div className="flex justify-between text-sm pt-1 border-t border-gray-100">
              <span>Total</span>
              <span>₱{order.total}</span>
            </div>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
            <div className="bg-white rounded-xl p-3">
              <p className="text-gray-400 mb-0.5">Payment</p>
              <p className="text-gray-700">{PAYMENT_LABELS[order.paymentMethod]}</p>
            </div>
            <div className="bg-white rounded-xl p-3">
              <p className="text-gray-400 mb-0.5">
                {order.deliveryType === 'delivery' ? 'Delivered to' : 'Pick Up'}
              </p>
              <p className="text-gray-700 truncate">
                {order.deliveryType === 'pickup'
                  ? 'Ramz Square Branch'
                  : order.address
                  ? `${order.address}${order.city ? `, ${order.city}` : ''}`
                  : '—'}
              </p>
            </div>
          </div>

          {/* Status Actions */}
          {(order.status === 'pending' || order.status === 'ongoing') && (
            <div className="flex gap-2 mt-2">
              {order.status === 'pending' && (
                <button
                  onClick={handleCancel}
                  className="flex-1 py-2.5 px-4 bg-white border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <XCircle className="w-4 h-4" />
                  Cancel Order
                </button>
              )}
              <button
                onClick={handleProgressStatus}
                className="flex-1 py-2.5 px-4 bg-black text-white rounded-xl hover:bg-black/80 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                {order.status === 'pending' ? (
                  <>
                    <ArrowRight className="w-4 h-4" />
                    Mark as On Going
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Mark as Received
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function OrderHistory({ isOpen, onClose, orders, onUpdateStatus }: OrderHistoryProps) {
  if (!isOpen) return null;

  const sortedOrders = [...orders].reverse();

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col rounded-l-3xl">
        {/* Header */}
        <div className="p-6 flex justify-between items-center border-b border-gray-100">
          <div>
            <h2 className="text-xl">Order History</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              {orders.length} order{orders.length !== 1 ? 's' : ''} placed
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {sortedOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Receipt className="w-9 h-9 text-gray-300" />
              </div>
              <p className="text-gray-400">No orders yet</p>
              <p className="text-sm text-gray-300 mt-1">Your order history will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedOrders.map((order) => (
                <OrderCard key={order.orderNumber} order={order} onUpdateStatus={onUpdateStatus} />
              ))}
            </div>
          )}
        </div>

        {/* Footer hint */}
        {orders.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-400">
            <Clock className="w-3.5 h-3.5" />
            <span>Orders are saved for this session only</span>
          </div>
        )}
      </div>
    </>
  );
}