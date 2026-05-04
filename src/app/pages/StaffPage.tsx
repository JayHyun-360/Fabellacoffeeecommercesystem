import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowLeft, Clock, Truck, Store, Phone, User, Package, MapPin,
  CheckCircle, XCircle, ArrowRight, Banknote, Smartphone, CreditCard,
  RefreshCw, Coffee, ChevronDown, ChevronUp, AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { SavedOrder } from '../components/OrderHistory';
import logoImg from '../../imports/682349994_793900143580024_743914547050463231_n.png';

type StatusFilter = 'all' | 'pending' | 'ongoing' | 'received' | 'cancelled';

const STATUS_CONFIG: Record<SavedOrder['status'], { label: string; dot: string; badge: string }> = {
  pending: { label: 'Pending', dot: 'bg-amber-400', badge: 'bg-amber-50 text-amber-700 border border-amber-200' },
  cancelled: { label: 'Cancelled', dot: 'bg-red-400', badge: 'bg-red-50 text-red-700 border border-red-200' },
  ongoing: { label: 'On Delivery', dot: 'bg-blue-400', badge: 'bg-blue-50 text-blue-700 border border-blue-200' },
  received: { label: 'Completed', dot: 'bg-green-400', badge: 'bg-green-50 text-green-700 border border-green-200' },
};

const PAYMENT_ICONS: Record<string, React.ReactNode> = {
  cod: <Banknote className="w-4 h-4" />,
  gcash: <Smartphone className="w-4 h-4" />,
  card: <CreditCard className="w-4 h-4" />,
};

const PAYMENT_LABELS: Record<string, string> = {
  cod: 'Cash on Delivery',
  gcash: 'GCash',
  card: 'Card Payment',
};

function StaffOrderCard({ order }: { order: SavedOrder }) {
  const { updateOrderStatus } = useApp();
  const [expanded, setExpanded] = useState(false);
  const status = STATUS_CONFIG[order.status];

  const handleAccept = () => updateOrderStatus(order.orderNumber, 'ongoing');
  const handleComplete = () => updateOrderStatus(order.orderNumber, 'received');
  const handleCancel = () => {
    if (confirm(`Cancel order ${order.orderNumber}?`)) {
      updateOrderStatus(order.orderNumber, 'cancelled');
    }
  };

  const timeStr = order.date.split(', ').slice(1).join(', ');

  return (
    <div className={`bg-white rounded-3xl border overflow-hidden transition-all duration-300 hover:shadow-xl ${
      order.status === 'pending' ? 'border-amber-200 shadow-lg shadow-amber-100/50' :
      order.status === 'ongoing' ? 'border-blue-200 shadow-lg shadow-blue-100/50' :
      'border-gray-200 shadow-md'
    }`}>
      {/* Card Header */}
      <div
        className="p-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
            order.deliveryType === 'delivery' ? 'bg-gray-100' : 'bg-gray-100'
          }`}>
            {order.deliveryType === 'delivery'
              ? <Truck className="w-5 h-5 text-gray-600" />
              : <Store className="w-5 h-5 text-gray-600" />}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-sm tracking-wider text-gray-800">{order.orderNumber}</span>
              <span className={`text-xs px-2.5 py-1 rounded-full ${status.badge}`}>
                <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${status.dot}`} />
                {status.label}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <span className="flex items-center gap-1 text-sm text-gray-600">
                <User className="w-3.5 h-3.5" />{order.name}
              </span>
              <span className="text-xs text-gray-400">{timeStr}</span>
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-sm text-gray-500">
                {order.items.length} item{order.items.length !== 1 ? 's' : ''} · ₱{order.total}
              </span>
              <div className="flex items-center gap-1 text-gray-400">
                {PAYMENT_ICONS[order.paymentMethod]}
                <span className="text-xs">{PAYMENT_LABELS[order.paymentMethod]}</span>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 text-gray-400 mt-1">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50/40 p-4 space-y-4">
          {/* Customer Contact */}
          <div className="bg-white rounded-xl p-3 space-y-2 border border-gray-100">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Customer Contact</p>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{order.name}</span>
            </div>
            {order.deliveryType === 'delivery' && order.address && (
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600">{order.address}{order.city ? `, ${order.city}` : ''}</span>
              </div>
            )}
            {order.deliveryType === 'pickup' && (
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Store Pick-Up — Ramz Square Branch</span>
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="space-y-2">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Order Items</p>
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                  {item.image
                    ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center"><Package className="w-4 h-4 text-gray-400" /></div>}
                </div>
                <span className="flex-1 text-sm">{item.name}</span>
                <span className="text-xs text-gray-400">×{item.quantity}</span>
                <span className="text-sm">₱{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="bg-white rounded-xl p-3 space-y-1.5 border border-gray-100">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span><span>₱{order.subtotal}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Delivery Fee</span>
              <span>{order.deliveryFee === 0 ? <span className="text-green-600">Free</span> : `₱${order.deliveryFee}`}</span>
            </div>
            <div className="flex justify-between text-sm pt-1.5 border-t border-gray-100">
              <span>Total</span><span>₱{order.total}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 pt-1">
              {PAYMENT_ICONS[order.paymentMethod]}
              <span>{PAYMENT_LABELS[order.paymentMethod]}</span>
              {order.paymentMethod === 'cod' && order.status === 'pending' && (
                <span className="ml-auto text-amber-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />Collect on delivery
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {(order.status === 'pending' || order.status === 'ongoing') && (
            <div className="flex gap-3 pt-2">
              {order.status === 'pending' && (
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-1.5 px-5 py-3 border border-red-200 text-red-600 rounded-2xl hover:bg-red-50 hover:shadow-md transition-all text-sm"
                >
                  <XCircle className="w-4 h-4" />Cancel
                </button>
              )}
              <button
                onClick={order.status === 'pending' ? handleAccept : handleComplete}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl hover:shadow-lg hover:scale-105 transition-all text-sm"
              >
                {order.status === 'pending' ? (
                  <><ArrowRight className="w-4 h-4" />Accept & Start Delivery</>
                ) : (
                  <><CheckCircle className="w-4 h-4" />Mark as Delivered</>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function StaffPage() {
  const navigate = useNavigate();
  const { orders } = useApp();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = currentTime.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' });
  const dateStr = currentTime.toLocaleDateString('en-PH', { weekday: 'short', month: 'short', day: 'numeric' });

  const todayStr = currentTime.toDateString();
  const todayOrders = orders.filter((o) => {
    try { return new Date(o.date).toDateString() === todayStr; } catch { return false; }
  });

  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const ongoingCount = orders.filter((o) => o.status === 'ongoing').length;
  const completedToday = todayOrders.filter((o) => o.status === 'received').length;
  const todayRevenue = todayOrders.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);

  const filtered = statusFilter === 'all'
    ? orders
    : orders.filter((o) => o.status === statusFilter);

  // Sort: pending first, then ongoing, then rest
  const sorted = [...filtered].sort((a, b) => {
    const order = { pending: 0, ongoing: 1, received: 2, cancelled: 3 };
    return order[a.status] - order[b.status];
  });

  const tabs: { key: StatusFilter; label: string; count?: number }[] = [
    { key: 'all', label: 'All Orders', count: orders.length },
    { key: 'pending', label: 'Pending', count: pendingCount },
    { key: 'ongoing', label: 'On Delivery', count: ongoingCount },
    { key: 'received', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-900 to-black p-0.5 shadow-lg">
              <div className="w-full h-full rounded-2xl bg-white p-1 flex items-center justify-center">
                <img src={logoImg} alt="Fabella Coffee" className="w-full h-full object-contain" />
              </div>
            </div>
            <div>
              <p className="text-sm tracking-tight">FABELLA COFFEE</p>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <Coffee className="w-3 h-3" />Staff Portal
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 bg-gradient-to-br from-gray-50 to-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-sm text-gray-600">{dateStr} · {timeStr}</span>
          </div>

          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-br from-gray-900 to-black text-white rounded-full text-sm transition-all hover:shadow-lg hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Store</span>
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Pending', value: pendingCount, color: 'text-amber-600', gradient: 'from-amber-50 to-amber-100/50', border: 'border-amber-200/50' },
            { label: 'On Delivery', value: ongoingCount, color: 'text-blue-600', gradient: 'from-blue-50 to-blue-100/50', border: 'border-blue-200/50' },
            { label: 'Completed Today', value: completedToday, color: 'text-green-600', gradient: 'from-green-50 to-green-100/50', border: 'border-green-200/50' },
            { label: "Today's Revenue", value: `₱${todayRevenue.toLocaleString()}`, color: 'text-gray-800', gradient: 'from-white to-gray-50', border: 'border-gray-200/50' },
          ].map((stat) => (
            <div key={stat.label} className={`bg-gradient-to-br ${stat.gradient} border ${stat.border} rounded-3xl p-5 shadow-sm hover:shadow-md transition-all`}>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">{stat.label}</p>
              <p className={`text-3xl ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm transition-all shadow-sm ${
                statusFilter === tab.key
                  ? 'bg-gradient-to-br from-gray-900 to-black text-white shadow-lg scale-105'
                  : 'bg-white border border-gray-200 hover:border-black hover:shadow-md text-gray-700'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  statusFilter === tab.key ? 'bg-white/25' : 'bg-gray-100'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Order Queue */}
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-5 shadow-md">
              <RefreshCw className="w-9 h-9 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">No orders here</p>
            <p className="text-sm text-gray-400 mt-2">
              {statusFilter === 'all' ? 'Waiting for customer orders…' : `No ${statusFilter} orders`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sorted.map((order) => (
              <StaffOrderCard key={order.orderNumber} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
