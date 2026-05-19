'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Clock, Truck, Store, Package, MapPin,
  CheckCircle, XCircle, Banknote, Smartphone, CreditCard,
  RefreshCw, Coffee, ChevronDown, ChevronUp, AlertCircle,
  UtensilsCrossed, ShoppingBag, QrCode, Wifi, Check, X,
  User, LogOut, Menu, Sparkles, TrendingUp, LayoutDashboard,
  BookOpen, Shield
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { StaffGuideSection, StaffPrivacySection } from '../components/StaffLegalFAQ';
import type { SavedOrder } from '../components/OrderHistory';
import logoImg from '../../imports/682349994_793900143580024_743914547050463231_n.png';

type StaffSection = 'dashboard' | 'manual' | 'privacy';
type StatusFilter = 'all' | 'pending' | 'ongoing' | 'received' | 'cancelled';

const ORDER_TYPE_CONFIG: Record<SavedOrder['deliveryType'], { label: string; icon: React.ReactNode; bg: string; text: string; border: string }> = {
  'delivery': { label: 'Delivery',  icon: <Truck className="w-3.5 h-3.5" />,           bg: 'bg-blue-50/50',    text: 'text-blue-700',    border: 'border-blue-100'    },
  'pickup':   { label: 'Pick Up',   icon: <ShoppingBag className="w-3.5 h-3.5" />,     bg: 'bg-purple-50/50',  text: 'text-purple-700',  border: 'border-purple-100'  },
  'dine-in':  { label: 'Dine In',   icon: <UtensilsCrossed className="w-3.5 h-3.5" />, bg: 'bg-amber-50/50',   text: 'text-amber-700',   border: 'border-amber-100'   },
  'takeout':  { label: 'Takeout',   icon: <ShoppingBag className="w-3.5 h-3.5" />,     bg: 'bg-emerald-50/50', text: 'text-emerald-700', border: 'border-emerald-100' },
};

const STATUS_CONFIG: Record<SavedOrder['status'], { label: string; dot: string; badge: string; ring: string; text: string }> = {
  pending:   { label: 'Pending',     dot: 'bg-amber-400', badge: 'bg-amber-50 text-amber-700 border-amber-200',  ring: 'ring-amber-200/60',  text: 'text-amber-700' },
  cancelled: { label: 'Cancelled',   dot: 'bg-red-400',   badge: 'bg-red-50 text-red-700 border-red-200',        ring: 'ring-red-200/60',    text: 'text-red-700'   },
  ongoing:   { label: 'In Progress', dot: 'bg-blue-400',  badge: 'bg-blue-50/50 text-blue-700 border-blue-200',  ring: 'ring-blue-200/60',   text: 'text-blue-700'  },
  received:  { label: 'Completed',   dot: 'bg-green-400', badge: 'bg-green-50 text-green-700 border-green-200',  ring: 'ring-green-200/60',  text: 'text-green-700' },
};

const PAYMENT_INFO: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  cod:   { icon: <Banknote className="w-3.5 h-3.5" />,   label: 'Cash',  color: 'text-gray-700 border-gray-200 bg-gray-50'   },
  gcash: { icon: <Smartphone className="w-3.5 h-3.5" />, label: 'GCash', color: 'text-blue-600 border-blue-100 bg-blue-50/50'  },
  card:  { icon: <CreditCard className="w-3.5 h-3.5" />, label: 'Card',  color: 'text-violet-600 border-violet-100 bg-violet-50/50' },
};

// ─── GCash QR Modal ──────────────────────────────────────────────────────────
function GCashQRModal({ amount, customerName, onClose, onMarkPaid }: {
  amount: number; customerName: string; onClose: () => void; onMarkPaid: () => void;
}) {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=09171234567&color=0065B3&bgcolor=ffffff&qzone=1`;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-sm sm:rounded-[2.5rem] rounded-t-[2rem] shadow-2xl overflow-hidden border border-gray-100 max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 text-white relative flex-shrink-0">
          <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-all">
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-white/10">
              <Smartphone className="w-4 h-4 text-white" />
            </div>
            <span className="tracking-widest text-xs font-bold uppercase text-blue-100">GCash Payment</span>
          </div>
          <p className="text-3xl font-semibold mb-1">₱{amount.toLocaleString()}</p>
          <p className="text-blue-100/80 text-xs">Awaiting payment from <span className="font-semibold text-white">{customerName}</span></p>
        </div>

        {/* QR Code Content — scrollable on very small screens */}
        <div className="p-6 flex flex-col items-center gap-5 overflow-y-auto">
          <div className="bg-white rounded-3xl p-3 shadow-lg border border-gray-100 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-0.5 bg-blue-500 animate-bounce" />
            <img src={qrUrl} alt="GCash QR Code" className="w-[160px] h-[160px] rounded-2xl" />
          </div>

          <div className="w-full bg-blue-50/50 rounded-2xl p-4 text-center border border-blue-100/50">
            <p className="text-[10px] text-blue-500 font-bold uppercase tracking-wider mb-1">Fabella Coffee GCash</p>
            <p className="text-xl font-semibold tracking-wider text-blue-800">0917 123 4567</p>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Wifi className="w-4 h-4 text-blue-500 animate-pulse" />
            <span>Scan QR or send to GCash number above</span>
          </div>

          <button
            onClick={onMarkPaid}
            className="w-full py-3.5 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm font-semibold"
          >
            <Check className="w-4 h-4" />
            Confirm Payment Received
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Staff Order Card ─────────────────────────────────────────────────────────
function StaffOrderCard({ order, queueNum }: { order: SavedOrder; queueNum: number }) {
  const { updateOrderStatus } = useApp();
  const [expanded, setExpanded] = useState(false);
  const [showGCashQR, setShowGCashQR] = useState(false);

  const status = STATUS_CONFIG[order.status];
  const orderType = ORDER_TYPE_CONFIG[order.deliveryType];
  const payment = PAYMENT_INFO[order.paymentMethod] || PAYMENT_INFO['cod'];

  const handleAccept = () => updateOrderStatus(order.orderNumber, 'ongoing');
  const handleComplete = () => updateOrderStatus(order.orderNumber, 'received');
  const handleCancel = () => {
    if (confirm('Cancel this order?')) updateOrderStatus(order.orderNumber, 'cancelled');
  };
  const handleGCashPaid = () => {
    updateOrderStatus(order.orderNumber, order.status === 'pending' ? 'ongoing' : 'received');
    setShowGCashQR(false);
  };

  const timeStr = order.date.includes(',') ? order.date.split(', ').slice(1).join(', ') : order.date;
  const isActive = order.status === 'pending' || order.status === 'ongoing';

  return (
    <>
      <div className={`bg-white rounded-3xl overflow-hidden transition-all duration-300 border border-gray-100 hover:shadow-xl hover:border-gray-200/80 group ${
        order.status === 'pending' ? 'ring-2 ring-amber-400/20 shadow-md shadow-amber-500/2' :
        order.status === 'ongoing' ? 'ring-2 ring-blue-500/20 shadow-md shadow-blue-500/2' : 'shadow-sm'
      }`}>
        {/* Color Highlight Bar */}
        <div className={`h-1.5 w-full transition-all ${
          order.status === 'pending' ? 'bg-gradient-to-r from-amber-400 to-orange-400' :
          order.status === 'ongoing' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
          order.status === 'received' ? 'bg-gradient-to-r from-emerald-400 to-green-500' : 'bg-gray-200'
        }`} />

        {/* Card Header Content */}
        <div
          className="p-5 cursor-pointer hover:bg-gray-50/50 transition-colors"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-start gap-4">
            {/* Rounded Queue Badge */}
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-base font-bold shadow-sm ${
              order.status === 'pending' ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' :
              order.status === 'ongoing' ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white' :
              order.status === 'received' ? 'bg-gradient-to-br from-emerald-400 to-green-500 text-white' :
              'bg-gray-100 text-gray-400'
            }`}>
              #{queueNum}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 flex-wrap mb-1.5">
                <span className="text-base font-semibold text-gray-900 truncate">{order.name}</span>
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1.5 border ${status.badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                  {status.label}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${orderType.bg} ${orderType.text} ${orderType.border}`}>
                  {orderType.icon}{orderType.label}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-gray-300" />
                  {timeStr}
                </span>
              </div>

              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-gray-50">
                <span className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-800">{order.items.length}</span> item{order.items.length !== 1 ? 's' : ''} · <span className="font-bold text-gray-900">₱{order.total}</span>
                </span>
                <div className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-gray-100 text-gray-600 bg-gray-50`}>
                  {payment.icon}
                  <span>{payment.label}</span>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 text-gray-400 mt-1 hover:text-black transition-colors">
              {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </div>
        </div>

        {/* Expanded Info Drawer */}
        {expanded && (
          <div className="border-t border-gray-100 bg-gray-50/50 p-5 space-y-4 animate-in slide-in-from-top-2 duration-300">
            {/* Fulfillment Address Details */}
            {(order.deliveryType === 'delivery' || order.deliveryType === 'pickup') && (
              <div className="bg-white rounded-2xl p-4 space-y-2 border border-gray-100 shadow-sm">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Fulfillment Address</p>
                {order.deliveryType === 'delivery' && order.address ? (
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700 leading-relaxed font-medium">{order.address}{order.city ? `, ${order.city}` : ''}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5">
                    <Store className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-gray-700 font-medium">Pick Up at Store (Ramz Square Branch)</span>
                  </div>
                )}
              </div>
            )}

            {/* Sub-item Cards list */}
            <div className="bg-white rounded-2xl p-4 space-y-3 border border-gray-100 shadow-sm">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Order Items</p>
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-1 border-b border-gray-50 last:border-b-0">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                    {item.image
                      ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center"><Package className="w-4 h-4 text-gray-300" /></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold text-gray-800 truncate block">{item.name}</span>
                    <span className="text-xs text-gray-400">₱{item.price} each</span>
                  </div>
                  <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">×{item.quantity}</span>
                  <span className="text-sm font-bold text-gray-900 w-16 text-right">₱{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="bg-white rounded-2xl p-4 space-y-2 border border-gray-100 shadow-sm">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span><span className="font-semibold text-gray-800">₱{order.subtotal}</span>
              </div>
              {order.deliveryFee > 0 && (
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Delivery Rider Fee</span><span className="font-semibold text-gray-800">₱{order.deliveryFee}</span>
                </div>
              )}
              <div className="flex justify-between text-sm pt-2 border-t border-gray-100 font-bold text-gray-900">
                <span>Total Amount Due</span><span className="text-base text-black">₱{order.total}</span>
              </div>

              <div className="w-full h-px bg-gray-100 my-2" />

              <div className={`flex items-center gap-2 text-xs pt-1 ${payment.color}`}>
                {payment.icon}
                <span className="font-semibold">Paid via {payment.label}</span>
                {order.paymentMethod === 'cod' && order.status === 'pending' && (
                  <span className="ml-auto text-amber-600 flex items-center gap-1 font-bold animate-pulse">
                    <AlertCircle className="w-3.5 h-3.5" />Collect Cash
                  </span>
                )}
                {order.paymentMethod === 'gcash' && order.status === 'pending' && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowGCashQR(true); }}
                    className="ml-auto flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition-colors font-bold bg-blue-50 px-3 py-1 rounded-full border border-blue-100 shadow-sm"
                  >
                    <QrCode className="w-3.5 h-3.5" />Show GCash QR
                  </button>
                )}
              </div>
            </div>

            {/* CTAs / Action Buttons */}
            {isActive && (
              <div className="flex gap-3 pt-2">
                {order.status === 'pending' && (
                  <button
                    onClick={handleCancel}
                    className="flex items-center justify-center gap-1.5 px-5 py-3.5 border border-red-200 text-red-600 rounded-2xl hover:bg-red-50 hover:shadow-md transition-all text-xs font-semibold"
                  >
                    <XCircle className="w-4 h-4" />Cancel Order
                  </button>
                )}
                {order.paymentMethod === 'gcash' && order.status === 'pending' ? (
                  <button
                    onClick={() => setShowGCashQR(true)}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all text-xs font-semibold"
                  >
                    <QrCode className="w-4 h-4" />Show GCash QR Code
                  </button>
                ) : (
                  <button
                    onClick={order.status === 'pending' ? handleAccept : handleComplete}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all text-xs font-bold"
                  >
                    {order.status === 'pending' ? (
                      <><CheckCircle className="w-4 h-4 text-emerald-400" />
                        {order.deliveryType === 'delivery' ? 'Accept & Ship Delivery' :
                         order.deliveryType === 'pickup'   ? 'Accept Pick Up Order' :
                         order.deliveryType === 'dine-in'  ? 'Accept Dine-In Order' : 'Accept Takeout Order'}
                      </>
                    ) : (
                      <><CheckCircle className="w-4 h-4 text-emerald-400" />
                        {order.deliveryType === 'delivery' ? 'Mark Order Delivered' : 'Complete Preparation'}
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {showGCashQR && (
        <GCashQRModal
          amount={order.total}
          customerName={order.name}
          onClose={() => setShowGCashQR(false)}
          onMarkPaid={handleGCashPaid}
        />
      )}
    </>
  );
}

// ─── Staff Page ───────────────────────────────────────────────────────────────
export function StaffPage() {
  const router = useRouter();
  const { orders } = useApp();
  const { user, isAdmin, logout } = useAuth();
  
  const [section, setSection] = useState<StaffSection>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = currentTime.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' });
  const dateStr = currentTime.toLocaleDateString('en-PH', { weekday: 'long', month: 'short', day: 'numeric' });

  const navItems: { key: StaffSection; label: string; icon: React.ReactNode }[] = [
    { key: 'dashboard', label: 'Operations', icon: <LayoutDashboard className="w-5 h-5" /> },
    { key: 'manual', label: 'System Manual', icon: <BookOpen className="w-5 h-5" /> },
    { key: 'privacy', label: 'Data Governance', icon: <Shield className="w-5 h-5" /> },
  ];

  // Dashboard specific view logic
  const renderDashboard = () => {
    const todayStr = currentTime.toDateString();
    const todayOrders = orders.filter((o) => {
      try { return new Date(o.date).toDateString() === todayStr; } catch { return false; }
    });

    const pendingCount = orders.filter((o) => o.status === 'pending').length;
    const ongoingCount = orders.filter((o) => o.status === 'ongoing').length;
    const completedToday = todayOrders.filter((o) => o.status === 'received').length;
    const todayRevenue = todayOrders.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);

    const filtered = statusFilter === 'all' ? orders : orders.filter((o) => o.status === statusFilter);
    const sorted = [...filtered].sort((a, b) => {
      const priority = { pending: 0, ongoing: 1, received: 2, cancelled: 3 };
      return priority[a.status] - priority[b.status];
    });

    const tabs: { key: StatusFilter; label: string; count?: number }[] = [
      { key: 'all',       label: 'All Orders', count: orders.length  },
      { key: 'pending',   label: 'Pending',    count: pendingCount   },
      { key: 'ongoing',   label: 'Ongoing',    count: ongoingCount   },
      { key: 'received',  label: 'Completed'                         },
      { key: 'cancelled', label: 'Cancelled'                         },
    ];

    return (
      <div className="space-y-8 sm:space-y-10">
        {/* Banner Welcome Message */}
        <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-8 lg:p-10 text-white relative overflow-hidden shadow-xl shadow-gray-900/10">
          <div className="absolute right-0 bottom-0 opacity-10 translate-x-12 translate-y-12 select-none pointer-events-none">
            <Coffee className="w-64 h-64 sm:w-96 sm:h-96" />
          </div>
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Store operations ready</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-white">
              Hello, <span className="font-light">{user?.user_metadata?.full_name?.split(' ')[0] ?? 'Operator'}</span>
            </h1>
            <p className="text-gray-400 text-sm max-w-xl leading-relaxed hidden sm:block">
              Track real-time orders, coordinate dine-in &amp; delivery logistics, and mark items completed.
            </p>
          </div>
        </div>

        {/* Operational Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {[
            { label: 'Pending',        value: String(pendingCount),                     gradient: 'from-amber-500/5 to-amber-500/10',     border: 'border-amber-200/50',   color: 'text-amber-700',   icon: <Clock className="w-5 h-5 text-amber-600" /> },
            { label: 'Active',         value: String(ongoingCount),                     gradient: 'from-blue-500/5 to-blue-500/10',       border: 'border-blue-200/50',    color: 'text-blue-700',    icon: <Coffee className="w-5 h-5 text-blue-600" /> },
            { label: 'Done Today',     value: String(completedToday),                   gradient: 'from-emerald-500/5 to-emerald-500/10', border: 'border-emerald-200/50', color: 'text-emerald-700', icon: <CheckCircle className="w-5 h-5 text-emerald-600" /> },
            { label: "Revenue",        value: `₱${todayRevenue.toLocaleString()}`,      gradient: 'from-white to-gray-50',                border: 'border-gray-200/60',    color: 'text-gray-900',    icon: <TrendingUp className="w-5 h-5 text-gray-500" /> },
          ].map((s) => (
            <div key={s.label} className={`bg-gradient-to-br ${s.gradient} border ${s.border} rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-sm hover:shadow-md transition-all flex justify-between items-start group`}>
              <div className="space-y-1.5 min-w-0 flex-1 pr-2">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none">{s.label}</p>
                <p className={`text-2xl lg:text-3xl font-semibold tracking-tight truncate ${s.color}`}>{s.value}</p>
              </div>
              <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 group-hover:scale-110 transition-transform flex-shrink-0">
                {s.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Filter Navigation Tabs and Legends */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-6">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold transition-all shadow-sm ${
                  statusFilter === tab.key
                    ? 'bg-black text-white shadow-lg shadow-black/20 scale-[1.03]'
                    : 'bg-white border border-gray-200 hover:border-black text-gray-600 hover:text-black'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    statusFilter === tab.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Dining Legend (Desktop only) */}
          <div className="hidden lg:flex gap-2.5 flex-wrap">
            {Object.entries(ORDER_TYPE_CONFIG).map(([key, cfg]) => (
              <span key={key} className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${cfg.bg} ${cfg.text} border ${cfg.border} shadow-sm`}>
                {cfg.icon}
                <span>{cfg.label}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Order Cards Grid */}
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
            <div className="w-24 h-24 rounded-3xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-6 shadow-sm">
              <RefreshCw className="w-10 h-10 text-gray-300 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <p className="text-gray-800 text-xl font-semibold">Queue is clear</p>
            <p className="text-sm text-gray-400 mt-2 max-w-sm">
              {statusFilter === 'all'
                ? 'No customer orders have been recorded today. Fresh orders will display here automatically.'
                : `No ${statusFilter} orders are currently present in your operations queue.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {sorted.map((order, idx) => (
              <StaffOrderCard key={order.orderNumber} order={order} queueNum={idx + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex overflow-hidden">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar — fixed on mobile, permanent on desktop */}
      <aside className={`
        fixed inset-y-0 left-0 w-72 bg-white border-r border-gray-100 z-40 flex flex-col transition-transform duration-300 shadow-2xl
        lg:relative lg:translate-x-0 lg:shadow-none lg:z-auto lg:flex-shrink-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <img src={typeof logoImg === 'string' ? logoImg : logoImg.src} alt="Fabella Coffee" className="w-12 h-12 object-contain" />
            <div>
              <p className="text-sm tracking-tight font-semibold text-gray-950">FABELLA COFFEE</p>
              <p className="text-xs text-gray-400">Staff Portal</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-5 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => { setSection(item.key); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm transition-all ${
                section === item.key
                  ? 'bg-gradient-to-br from-gray-900 to-black text-white shadow-lg scale-105'
                  : 'text-gray-600 hover:bg-gray-50 hover:shadow-sm'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Admin Back Link (if isAdmin) */}
        {isAdmin && (
          <div className="px-5 pb-2">
             <button
                onClick={() => router.push('/admin')}
                className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm text-gray-600 hover:bg-gray-50 hover:shadow-sm transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Admin
              </button>
          </div>
        )}

        {/* Profile / Sign Out */}
        <div className="p-5 border-t border-gray-100">
          {user && (
            <div className="flex items-center gap-3 mb-3">
              {user.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="" className="w-9 h-9 rounded-full flex-shrink-0 object-cover" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-gray-500" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm truncate">{user.user_metadata?.full_name ?? 'Staff User'}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
            </div>
          )}
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-5 py-3 rounded-2xl text-sm text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {isAdmin && (
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center py-2 px-6 text-xs tracking-widest font-semibold uppercase animate-pulse shadow-md z-10 flex-shrink-0">
            Staff Portal Preview — Real Actions Disallowed
          </div>
        )}
        
        {/* Top bar (mobile) */}
        <header className="lg:hidden bg-white/80 backdrop-blur-xl border-b border-gray-100 flex-shrink-0 z-20 px-4 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="p-2.5 rounded-2xl hover:bg-gray-100 transition-all">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <p className="text-sm font-semibold">Staff Portal</p>
              <p className="text-xs text-gray-400">{navItems.find((n) => n.key === section)?.label}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100 shadow-inner">
              <Clock className="w-3.5 h-3.5 text-gray-400 animate-pulse" />
              <span className="text-xs font-semibold text-gray-600">{timeStr}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl w-full mx-auto relative">
            {/* Show top right clock for desktop */}
            <div className="hidden lg:flex justify-end mb-6 absolute right-0 -top-2">
               <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm z-10">
                 <Clock className="w-4 h-4 text-gray-400 animate-pulse" />
                 <span className="text-sm font-semibold text-gray-600">{dateStr} · {timeStr}</span>
               </div>
            </div>

            {section === 'dashboard' && renderDashboard()}
            {section === 'manual' && (
              <div className="pt-2">
                <StaffGuideSection />
              </div>
            )}
            {section === 'privacy' && (
              <div className="pt-2">
                <StaffPrivacySection />
              </div>
            )}
          </div>
        </main>

        {/* Bottom nav (mobile) */}
        <nav className="lg:hidden bg-white border-t border-gray-100 flex flex-shrink-0">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setSection(item.key)}
              className={`flex-1 flex flex-col items-center py-3 gap-0.5 text-xs transition-colors ${
                section === item.key ? 'text-black' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {item.icon}
              <span className="hidden sm:block">{item.label.split(' ')[0]}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
