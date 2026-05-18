'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Clock, Truck, Store, Package, MapPin,
  CheckCircle, XCircle, Banknote, Smartphone, CreditCard,
  RefreshCw, Coffee, ChevronDown, ChevronUp, AlertCircle,
  UtensilsCrossed, ShoppingBag, QrCode, Wifi, Check, X,
  User, LogOut
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import type { SavedOrder } from '../components/OrderHistory';
import logoImg from '../../imports/682349994_793900143580024_743914547050463231_n.png';

type StatusFilter = 'all' | 'pending' | 'ongoing' | 'received' | 'cancelled';

const ORDER_TYPE_CONFIG: Record<SavedOrder['deliveryType'], { label: string; icon: React.ReactNode; bg: string; text: string }> = {
  'delivery': { label: 'Delivery',  icon: <Truck className="w-3.5 h-3.5" />,           bg: 'bg-blue-50',    text: 'text-blue-700'    },
  'pickup':   { label: 'Pick Up',   icon: <ShoppingBag className="w-3.5 h-3.5" />,     bg: 'bg-purple-50',  text: 'text-purple-700'  },
  'dine-in':  { label: 'Dine In',   icon: <UtensilsCrossed className="w-3.5 h-3.5" />, bg: 'bg-amber-50',   text: 'text-amber-700'   },
  'takeout':  { label: 'Takeout',   icon: <ShoppingBag className="w-3.5 h-3.5" />,     bg: 'bg-emerald-50', text: 'text-emerald-700' },
};

const STATUS_CONFIG: Record<SavedOrder['status'], { label: string; dot: string; badge: string; ring: string }> = {
  pending:   { label: 'Pending',     dot: 'bg-amber-400', badge: 'bg-amber-50 text-amber-700 border border-amber-200',  ring: 'ring-amber-200/60'  },
  cancelled: { label: 'Cancelled',   dot: 'bg-red-400',   badge: 'bg-red-50 text-red-700 border border-red-200',        ring: 'ring-red-200/60'    },
  ongoing:   { label: 'In Progress', dot: 'bg-blue-400',  badge: 'bg-blue-50 text-blue-700 border border-blue-200',     ring: 'ring-blue-200/60'   },
  received:  { label: 'Completed',   dot: 'bg-green-400', badge: 'bg-green-50 text-green-700 border border-green-200',  ring: 'ring-green-200/60'  },
};

const PAYMENT_INFO: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  cod:   { icon: <Banknote className="w-4 h-4" />,   label: 'Cash',  color: 'text-gray-700'   },
  gcash: { icon: <Smartphone className="w-4 h-4" />, label: 'GCash', color: 'text-blue-600'   },
  card:  { icon: <CreditCard className="w-4 h-4" />, label: 'Card',  color: 'text-violet-600' },
};

// ─── GCash QR Modal ──────────────────────────────────────────────────────────
function GCashQRModal({ amount, customerName, onClose, onMarkPaid }: {
  amount: number; customerName: string; onClose: () => void; onMarkPaid: () => void;
}) {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=09171234567&color=0065B3&bgcolor=ffffff&qzone=1`;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden border border-gray-200/50">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-5 text-white">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors">
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <Smartphone className="w-5 h-5" />
            <span className="tracking-wide text-sm">GCash Payment</span>
          </div>
          <p className="text-3xl text-white mb-0.5">₱{amount.toLocaleString()}</p>
          <p className="text-blue-100 text-sm">for {customerName}</p>
        </div>

        {/* QR Code */}
        <div className="p-6 flex flex-col items-center gap-4">
          <div className="bg-white rounded-2xl p-3 shadow-lg border border-gray-100 relative">
            <img src={qrUrl} alt="GCash QR Code" className="w-[200px] h-[200px] rounded-xl" />
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow-md">
              Scan with GCash App
            </div>
          </div>

          <div className="mt-3 w-full bg-blue-50 rounded-2xl p-4 text-center border border-blue-100">
            <p className="text-xs text-blue-500 mb-1">Fabella Coffee GCash</p>
            <p className="text-xl tracking-widest text-blue-700">0917-123-4567</p>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Wifi className="w-3.5 h-3.5" />
            Ask customer to scan or send to the number above
          </div>

          <button
            onClick={onMarkPaid}
            className="w-full py-3.5 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            Payment Received — Mark as Paid
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
  const payment = PAYMENT_INFO[order.paymentMethod];

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
      <div className={`bg-white rounded-3xl overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl ring-1 ${status.ring} ${
        order.status === 'pending' ? 'ring-2 ring-amber-200' :
        order.status === 'ongoing' ? 'ring-2 ring-blue-200' : 'ring-gray-200/50'
      }`}>
        {/* Top accent bar */}
        {isActive && (
          <div className={`h-1 w-full ${order.status === 'pending' ? 'bg-gradient-to-r from-amber-400 to-orange-400' : 'bg-gradient-to-r from-blue-400 to-cyan-400'}`} />
        )}

        {/* Card Header */}
        <div
          className="p-4 cursor-pointer hover:bg-gray-50/60 transition-colors"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-start gap-3">
            {/* Queue Number */}
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 text-sm shadow-sm ${
              order.status === 'pending' ? 'bg-gradient-to-br from-amber-400 to-orange-400 text-white' :
              order.status === 'ongoing' ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white' :
              order.status === 'received' ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white' :
              'bg-gray-100 text-gray-400'
            }`}>
              #{queueNum}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-sm text-gray-900">{order.name}</span>
                <span className={`text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 ${status.badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                  {status.label}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${orderType.bg} ${orderType.text}`}>
                  {orderType.icon}{orderType.label}
                </span>
                <span className="text-xs text-gray-400">{timeStr}</span>
              </div>

              <div className="flex items-center justify-between mt-1.5">
                <span className="text-sm text-gray-600">
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''} · <span className="text-gray-900">₱{order.total}</span>
                </span>
                <div className={`flex items-center gap-1 text-xs ${payment.color}`}>
                  {payment.icon}
                  <span>{payment.label}</span>
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
            {/* Delivery/Address Info */}
            {(order.deliveryType === 'delivery' || order.deliveryType === 'pickup') && (
              <div className="bg-white rounded-2xl p-3 space-y-2 border border-gray-100">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Fulfillment</p>
                {order.deliveryType === 'delivery' && order.address ? (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{order.address}{order.city ? `, ${order.city}` : ''}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">Pick Up at Ramz Square Branch</span>
                  </div>
                )}
              </div>
            )}

            {/* Order Items */}
            <div className="space-y-2">
              <p className="text-xs text-gray-400 uppercase tracking-wide">Items</p>
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                    {item.image
                      ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center"><Package className="w-4 h-4 text-gray-400" /></div>}
                  </div>
                  <span className="flex-1 text-sm">{item.name}</span>
                  <span className="text-xs text-gray-400">×{item.quantity}</span>
                  <span className="text-sm text-gray-900">₱{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="bg-white rounded-2xl p-3 space-y-1.5 border border-gray-100">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span><span>₱{order.subtotal}</span>
              </div>
              {order.deliveryFee > 0 && (
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Delivery Fee</span><span>₱{order.deliveryFee}</span>
                </div>
              )}
              <div className="flex justify-between text-sm pt-1.5 border-t border-gray-100">
                <span>Total</span><span className="text-gray-900">₱{order.total}</span>
              </div>
              <div className={`flex items-center gap-1.5 text-xs ${payment.color} pt-1`}>
                {payment.icon}
                <span>{payment.label}</span>
                {order.paymentMethod === 'cod' && order.status === 'pending' && (
                  <span className="ml-auto text-amber-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />Collect payment
                  </span>
                )}
                {order.paymentMethod === 'gcash' && order.status === 'pending' && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowGCashQR(true); }}
                    className="ml-auto flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <QrCode className="w-3.5 h-3.5" />Show QR
                  </button>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {isActive && (
              <div className="flex gap-3 pt-1">
                {order.status === 'pending' && (
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-1.5 px-5 py-3 border border-red-200 text-red-600 rounded-2xl hover:bg-red-50 hover:shadow-md transition-all text-sm"
                  >
                    <XCircle className="w-4 h-4" />Cancel
                  </button>
                )}
                {order.paymentMethod === 'gcash' && order.status === 'pending' ? (
                  <button
                    onClick={() => setShowGCashQR(true)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl hover:shadow-lg hover:scale-105 transition-all text-sm"
                  >
                    <QrCode className="w-4 h-4" />Show GCash QR
                  </button>
                ) : (
                  <button
                    onClick={order.status === 'pending' ? handleAccept : handleComplete}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl hover:shadow-lg hover:scale-105 transition-all text-sm"
                  >
                    {order.status === 'pending' ? (
                      <><CheckCircle className="w-4 h-4" />
                        {order.deliveryType === 'delivery' ? 'Accept & Start Delivery' :
                         order.deliveryType === 'pickup'   ? 'Accept Order' :
                         order.deliveryType === 'dine-in'  ? 'Accept — Dine In' : 'Accept — Takeout'}
                      </>
                    ) : (
                      <><CheckCircle className="w-4 h-4" />
                        {order.deliveryType === 'delivery' ? 'Mark Delivered' : 'Mark Completed'}
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
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const timeStr = currentTime.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' });
  const dateStr = currentTime.toLocaleDateString('en-PH', { weekday: 'long', month: 'short', day: 'numeric' });

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
    { key: 'all',       label: 'All',       count: orders.length  },
    { key: 'pending',   label: 'Pending',   count: pendingCount   },
    { key: 'ongoing',   label: 'Active',    count: ongoingCount   },
    { key: 'received',  label: 'Done'                             },
    { key: 'cancelled', label: 'Cancelled'                        },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-br from-gray-900 via-gray-900 to-black sticky top-0 z-40 shadow-2xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-sm p-0.5 border border-white/20 shadow-lg">
                <div className="w-full h-full rounded-2xl bg-white/95 flex items-center justify-center p-1">
                  <img src={typeof logoImg === 'string' ? logoImg : logoImg.src} alt="Fabella Coffee" className="w-full h-full object-contain" />
                </div>
              </div>
              <div>
                <p className="text-white text-sm tracking-widest">FABELLA COFFEE</p>
                <p className="text-gray-400 text-xs flex items-center gap-1">
                  <Coffee className="w-3 h-3" />{isAdmin ? 'Staff Preview' : 'Staff Portal'}
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Clock className="w-3.5 h-3.5 text-gray-300" />
              <span className="text-sm text-gray-200">{dateStr} · {timeStr}</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Profile dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className={`w-9 h-9 flex items-center justify-center rounded-full transition-all overflow-hidden border ${
                    profileOpen ? 'border-white ring-2 ring-white/30' : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  {user?.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-[18px] h-[18px] text-white" />
                  )}
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                    {user && (
                      <div className="px-4 pt-4 pb-3 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          {user.user_metadata?.avatar_url ? (
                            <img src={user.user_metadata.avatar_url} alt="" className="w-10 h-10 rounded-full" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <User className="w-5 h-5 text-gray-500" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm truncate">{user.user_metadata?.full_name ?? 'Staff'}</p>
                            <p className="text-xs text-gray-400 truncate">{user.email}</p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                            {isAdmin ? 'Admin (Preview)' : 'Staff'}
                          </span>
                        </div>
                      </div>
                    )}
                    {isAdmin && (
                      <div className="p-2">
                        <button
                          onClick={() => { router.push('/admin'); setProfileOpen(false); }}
                          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left text-sm"
                        >
                          <ArrowLeft className="w-4 h-4 text-gray-400" />Back to Admin Panel
                        </button>
                      </div>
                    )}
                    <div className="p-2 border-t border-gray-100">
                      <button
                        onClick={() => { logout(); setProfileOpen(false); }}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 transition-colors text-red-600 text-sm"
                      >
                        <LogOut className="w-4 h-4" />Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Admin preview banner */}
      {isAdmin && (
        <div className="bg-blue-600 text-white text-center py-2 px-6 text-sm tracking-wide">
          Preview Mode — You are viewing the staff portal as admin. Actions are view-only.
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Pending',        value: pendingCount,                   gradient: 'from-amber-50 to-orange-50',  border: 'border-amber-200/60',  num: 'text-amber-600'  },
            { label: 'Active',         value: ongoingCount,                   gradient: 'from-blue-50 to-cyan-50',     border: 'border-blue-200/60',   num: 'text-blue-600'   },
            { label: 'Done Today',     value: completedToday,                 gradient: 'from-green-50 to-emerald-50', border: 'border-green-200/60',  num: 'text-green-600'  },
            { label: "Today's Revenue",value: `₱${todayRevenue.toLocaleString()}`, gradient: 'from-white to-gray-50', border: 'border-gray-200/60',   num: 'text-gray-900'   },
          ].map((s) => (
            <div key={s.label} className={`bg-gradient-to-br ${s.gradient} border ${s.border} rounded-3xl p-5 shadow-sm hover:shadow-md transition-all`}>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">{s.label}</p>
              <p className={`text-3xl ${s.num}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm transition-all shadow-sm ${
                statusFilter === tab.key
                  ? 'bg-gradient-to-br from-gray-900 to-black text-white shadow-lg scale-105'
                  : 'bg-white border border-gray-200 hover:border-black hover:shadow-md text-gray-700'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  statusFilter === tab.key ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Order Type Legend */}
        <div className="flex gap-3 flex-wrap">
          {Object.entries(ORDER_TYPE_CONFIG).map(([key, cfg]) => (
            <span key={key} className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full ${cfg.bg} ${cfg.text} border border-current/20`}>
              {cfg.icon}{cfg.label}
            </span>
          ))}
        </div>

        {/* Order Queue */}
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-5 shadow-md">
              <RefreshCw className="w-9 h-9 text-gray-300" />
            </div>
            <p className="text-gray-500 text-lg">Queue is clear</p>
            <p className="text-sm text-gray-400 mt-2">
              {statusFilter === 'all'
                ? 'No orders yet. Orders from customers will appear here.'
                : `No ${statusFilter} orders right now.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sorted.map((order, idx) => (
              <StaffOrderCard key={order.orderNumber} order={order} queueNum={idx + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
