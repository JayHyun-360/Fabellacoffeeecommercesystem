'use client';

import React from 'react';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard, UtensilsCrossed, Receipt, Settings, ArrowLeft,
  TrendingUp, ShoppingBag, Coffee, Package, Plus, Pencil, Trash2,
  Eye, EyeOff, X, Check, Search, Image, ChevronDown,
  BarChart3, Star, AlertCircle,
  Banknote, Smartphone, CreditCard
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { useApp, type Product, type HeroSlide } from '../context/AppContext';
import type { SavedOrder } from '../components/OrderHistory';
import logoImg from '../../imports/682349994_793900143580024_743914547050463231_n.png';

type AdminSection = 'dashboard' | 'menu' | 'transactions' | 'settings';

const CATEGORY_LABELS: Record<string, string> = {
  coffee: 'Coffee', food: 'Food', pastries: 'Pastries', beverages: 'Beverages',
};

const CATEGORY_COLORS: Record<string, string> = {
  coffee: 'bg-amber-100 text-amber-800', food: 'bg-green-100 text-green-800',
  pastries: 'bg-pink-100 text-pink-800', beverages: 'bg-blue-100 text-blue-800',
};

const STATUS_CONFIG: Record<SavedOrder['status'], { label: string; badge: string; dot: string }> = {
  pending:   { label: 'Pending',     badge: 'bg-amber-50 text-amber-700 border border-amber-200',  dot: 'bg-amber-400'  },
  cancelled: { label: 'Cancelled',   badge: 'bg-red-50 text-red-700 border border-red-200',        dot: 'bg-red-400'    },
  ongoing:   { label: 'In Progress', badge: 'bg-blue-50 text-blue-700 border border-blue-200',     dot: 'bg-blue-400'   },
  received:  { label: 'Completed',   badge: 'bg-green-50 text-green-700 border border-green-200',  dot: 'bg-green-400'  },
};

// ─── Product Modal ───────────────────────────────────────────────────────────

interface ProductModalProps {
  product?: Product;
  onSave: (p: Omit<Product, 'id'> & { id?: number }) => void;
  onClose: () => void;
}

function ProductModal({ product, onSave, onClose }: ProductModalProps) {
  const [form, setForm] = useState({
    name: product?.name ?? '',
    description: product?.description ?? '',
    price: product?.price?.toString() ?? '',
    category: product?.category ?? 'coffee',
    image: product?.image ?? '',
    available: product?.available ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) return;
    onSave({
      ...(product ? { id: product.id } : {}),
      name: form.name.trim(),
      description: form.description.trim(),
      price: parseInt(form.price, 10),
      category: form.category as Product['category'],
      image: form.image.trim(),
      available: form.available,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-200/50">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg">{product ? 'Edit Product' : 'Add New Product'}</h3>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Image Preview */}
          {form.image && (
            <div className="w-full h-40 rounded-2xl overflow-hidden bg-gray-100">
              <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}

          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Image URL</label>
            <div className="relative">
              <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-xs text-gray-500 mb-1.5 block">Product Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Caramel Macchiato"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors text-sm"
              />
            </div>

            <div className="col-span-2">
              <label className="text-xs text-gray-500 mb-1.5 block">Description</label>
              <input
                type="text"
                placeholder="Short description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors text-sm"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">Price (₱) *</label>
              <input
                type="number"
                required
                min={1}
                placeholder="85"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors text-sm"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">Category *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as Product['category'] })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors text-sm"
              >
                {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div>
              <p className="text-sm">Available for ordering</p>
              <p className="text-xs text-gray-400 mt-0.5">Show this item on the customer menu</p>
            </div>
            <button
              type="button"
              onClick={() => setForm({ ...form, available: !form.available })}
              className={`w-12 h-6 rounded-full transition-all relative ${form.available ? 'bg-black' : 'bg-gray-200'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form.available ? 'left-6' : 'left-0.5'}`} />
            </button>
          </div>

          <div className="flex gap-3 pt-3">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 border border-gray-200 hover:border-black rounded-full text-sm transition-all hover:shadow-md">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 py-3 bg-gradient-to-br from-gray-900 to-black text-white hover:shadow-xl hover:scale-105 rounded-full text-sm transition-all flex items-center justify-center gap-2">
              <Check className="w-4 h-4" />
              {product ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Dashboard Section ───────────────────────────────────────────────────────

function DashboardSection() {
  const { orders, products } = useApp();

  const chartData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (6 - i));
      const isToday = i === 6;
      // Only real orders — no mock data
      const dayRevenue = isToday
        ? orders.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0)
        : 0;
      return {
        day: days[d.getDay()],
        revenue: dayRevenue,
        isToday,
      };
    });
  }, [orders]);

  const totalRevenue = orders.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);
  const totalOrders = orders.length;
  const completedOrders = orders.filter((o) => o.status === 'received').length;
  const avgOrder = completedOrders > 0
    ? Math.round(orders.filter((o) => o.status === 'received').reduce((s, o) => s + o.total, 0) / completedOrders)
    : 0;

  // Top selling items
  const itemCounts: Record<string, { name: string; count: number; revenue: number; image?: string }> = {};
  orders.forEach((o) => {
    if (o.status === 'cancelled') return;
    o.items.forEach((item) => {
      if (!itemCounts[item.name]) itemCounts[item.name] = { name: item.name, count: 0, revenue: 0, image: item.image };
      itemCounts[item.name].count += item.quantity;
      itemCounts[item.name].revenue += item.price * item.quantity;
    });
  });
  const topItems = Object.values(itemCounts).sort((a, b) => b.count - a.count).slice(0, 5);

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl mb-1">Dashboard</h2>
        <p className="text-sm text-gray-400">Overview of your store's performance</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Total Revenue', value: `₱${totalRevenue.toLocaleString()}`, icon: <TrendingUp className="w-5 h-5" />, sub: 'All active orders', gradient: 'from-green-50 to-emerald-50' },
          { label: 'Total Orders', value: totalOrders, icon: <ShoppingBag className="w-5 h-5" />, sub: 'All time', gradient: 'from-blue-50 to-sky-50' },
          { label: 'Avg Order Value', value: `₱${avgOrder}`, icon: <BarChart3 className="w-5 h-5" />, sub: 'Per completed order', gradient: 'from-purple-50 to-violet-50' },
          { label: 'Menu Items', value: products.filter((p) => p.available).length, icon: <Coffee className="w-5 h-5" />, sub: `${products.filter((p) => !p.available).length} unavailable`, gradient: 'from-amber-50 to-orange-50' },
        ].map((kpi) => (
          <div key={kpi.label} className={`bg-gradient-to-br ${kpi.gradient} rounded-3xl p-6 border border-gray-200/50 shadow-md hover:shadow-xl transition-all`}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-white/80 rounded-2xl flex items-center justify-center shadow-sm">
                {kpi.icon}
              </div>
            </div>
            <p className="text-3xl mb-2">{kpi.value}</p>
            <p className="text-sm text-gray-600">{kpi.label}</p>
            <p className="text-xs text-gray-500 mt-1">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Chart + Top Items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-200/50 shadow-lg">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-gray-800">Revenue Overview</p>
              <p className="text-sm text-gray-400">₱{totalRevenue.toLocaleString()} session total</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} tickFormatter={(v) => `₱${(v/1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(v: number) => [`₱${v.toLocaleString()}`, 'Revenue']}
                contentStyle={{ borderRadius: '12px', border: '1px solid #f0f0f0', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
              />
              <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={`bar-cell-${entry.day}-${i}`} fill={entry.isToday ? '#000' : '#e5e7eb'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-400 text-center mt-2">Revenue reflects active session orders</p>
        </div>

        {/* Top Items */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/50 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-4 h-4" />
            <p className="text-gray-800">Top Selling Items</p>
          </div>
          {topItems.length === 0 ? (
            <div className="text-center py-8 text-gray-300 text-sm">No sales data yet</div>
          ) : (
            <div className="space-y-3">
              {topItems.map((item, i) => (
                <div key={item.name} className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 w-4">{i + 1}</span>
                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {item.image
                      ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center"><Package className="w-3 h-3 text-gray-400" /></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">×{item.count} sold</p>
                  </div>
                  <p className="text-sm flex-shrink-0">₱{item.revenue}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200/50 shadow-lg">
        <p className="text-gray-800 mb-4">Recent Orders</p>
        {recentOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-300 text-sm">No orders yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-gray-50">
                  <th className="text-left pb-3 font-normal">Order #</th>
                  <th className="text-left pb-3 font-normal">Customer</th>
                  <th className="text-left pb-3 font-normal hidden sm:table-cell">Date</th>
                  <th className="text-right pb-3 font-normal">Total</th>
                  <th className="text-right pb-3 font-normal">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((o) => (
                  <tr key={o.orderNumber} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 text-xs text-gray-500">{o.orderNumber}</td>
                    <td className="py-3">{o.name}</td>
                    <td className="py-3 text-gray-400 hidden sm:table-cell text-xs">{o.date}</td>
                    <td className="py-3 text-right">₱{o.total}</td>
                    <td className="py-3 text-right">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_CONFIG[o.status].badge}`}>
                        {STATUS_CONFIG[o.status].label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Menu Management Section ────────────────────────────────────────────────

function MenuManagementSection() {
  const { products, addProduct, updateProduct, deleteProduct, toggleProductAvailability } = useApp();
  const [editProduct, setEditProduct] = useState<Product | undefined>();
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState<string>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const filtered = products.filter((p) => {
    const matchCat = catFilter === 'all' || p.category === catFilter;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleSave = (data: Omit<Product, 'id'> & { id?: number }) => {
    if (data.id !== undefined) {
      updateProduct(data as Product);
    } else {
      addProduct(data as Omit<Product, 'id'>);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl mb-1">Menu Management</h2>
          <p className="text-sm text-gray-400">{products.length} items · {products.filter((p) => p.available).length} available</p>
        </div>
        <button
          onClick={() => { setEditProduct(undefined); setModalOpen(true); }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-gray-900 to-black text-white rounded-full hover:shadow-xl hover:scale-105 transition-all text-sm shadow-lg"
        >
          <Plus className="w-4 h-4" />Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:border-black transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'coffee', 'food', 'pastries', 'beverages'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCatFilter(cat)}
              className={`px-4 py-2.5 rounded-full text-sm border transition-all ${
                catFilter === cat ? 'bg-gradient-to-br from-gray-900 to-black text-white border-black shadow-lg scale-105' : 'bg-white border-gray-200 hover:border-black hover:shadow-md'
              }`}
            >
              {cat === 'all' ? 'All' : CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((product) => (
          <div
            key={product.id}
            className={`bg-white rounded-3xl border overflow-hidden shadow-md transition-all ${
              !product.available ? 'opacity-60 border-gray-200' : 'border-gray-200 hover:shadow-xl hover:scale-105'
            }`}
          >
            <div className="aspect-video bg-gray-100 relative overflow-hidden">
              {product.image
                ? <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center"><Package className="w-8 h-8 text-gray-300" /></div>}
              {!product.available && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                  <span className="bg-white text-xs px-2 py-1 rounded-full border border-gray-200 text-gray-500">Unavailable</span>
                </div>
              )}
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-sm leading-snug">{product.name}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${CATEGORY_COLORS[product.category]}`}>
                  {CATEGORY_LABELS[product.category]}
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-3 line-clamp-1">{product.description}</p>
              <p className="text-sm mb-3">₱{product.price}</p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleProductAvailability(product.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    product.available ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                  }`}
                  title={product.available ? 'Mark unavailable' : 'Mark available'}
                >
                  {product.available ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => { setEditProduct(product); setModalOpen(true); }}
                  className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirm(product.id)}
                  className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors ml-auto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-16 text-center text-gray-300">
            <Package className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p>No products found</p>
          </div>
        )}
      </div>

      {modalOpen && (
        <ProductModal
          product={editProduct}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}

      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-[2rem] p-8 shadow-2xl w-full max-w-sm text-center border border-gray-200/50">
            <div className="w-16 h-16 bg-gradient-to-br from-red-50 to-red-100 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-md">
              <AlertCircle className="w-7 h-7 text-red-500" />
            </div>
            <p className="text-xl mb-2">Delete Product?</p>
            <p className="text-sm text-gray-500 mb-8">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 border border-gray-200 hover:border-black rounded-full text-sm transition-all hover:shadow-md">
                Cancel
              </button>
              <button onClick={() => { deleteProduct(deleteConfirm); setDeleteConfirm(null); }}
                className="flex-1 py-3 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-full text-sm hover:shadow-xl hover:scale-105 transition-all">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Transactions Section ─────────────────────────────────────────────────────

const ORDER_TYPE_CFG: Record<string, { label: string; bg: string; text: string }> = {
  'delivery': { label: 'Delivery',  bg: 'bg-blue-50',    text: 'text-blue-700'    },
  'pickup':   { label: 'Pick Up',   bg: 'bg-purple-50',  text: 'text-purple-700'  },
  'dine-in':  { label: 'Dine In',   bg: 'bg-amber-50',   text: 'text-amber-700'   },
  'takeout':  { label: 'Takeout',   bg: 'bg-emerald-50', text: 'text-emerald-700' },
};

const PAYMENT_CFG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  cod:   { label: 'Cash',  color: 'text-gray-700',   icon: <Banknote className="w-3.5 h-3.5" />   },
  gcash: { label: 'GCash', color: 'text-blue-600',   icon: <Smartphone className="w-3.5 h-3.5" /> },
  card:  { label: 'Card',  color: 'text-violet-600', icon: <CreditCard className="w-3.5 h-3.5" /> },
};

function TransactionsSection() {
  const { orders, updateOrderStatus } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const filtered = orders.filter((o) => {
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchType = typeFilter === 'all' || o.deliveryType === typeFilter;
    const matchPayment = paymentFilter === 'all' || o.paymentMethod === paymentFilter;
    const matchSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.name.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchType && matchPayment && matchSearch;
  });

  const totalRevenue = orders.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);
  const completedRevenue = orders.filter((o) => o.status === 'received').reduce((s, o) => s + o.total, 0);
  const gcashRevenue = orders.filter((o) => o.paymentMethod === 'gcash' && o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);
  const cashRevenue = orders.filter((o) => o.paymentMethod === 'cod' && o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);

  const typeBreakdown = ['dine-in', 'takeout', 'delivery', 'pickup'].map((type) => ({
    type,
    count: orders.filter((o) => o.deliveryType === type && o.status !== 'cancelled').length,
    revenue: orders.filter((o) => o.deliveryType === type && o.status !== 'cancelled').reduce((s, o) => s + o.total, 0),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl mb-1">Transaction History</h2>
          <p className="text-sm text-gray-400">
            {orders.length} total transactions · ₱{totalRevenue.toLocaleString()} revenue
          </p>
        </div>
      </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `₱${totalRevenue.toLocaleString()}`, sub: 'excl. cancelled', gradient: 'from-green-50 to-emerald-50', border: 'border-green-200/60' },
          { label: 'Completed', value: `₱${completedRevenue.toLocaleString()}`, sub: `${orders.filter(o => o.status === 'received').length} orders`, gradient: 'from-blue-50 to-sky-50', border: 'border-blue-200/60' },
          { label: 'GCash', value: `₱${gcashRevenue.toLocaleString()}`, sub: `${orders.filter(o => o.paymentMethod === 'gcash' && o.status !== 'cancelled').length} txns`, gradient: 'from-indigo-50 to-blue-50', border: 'border-indigo-200/60' },
          { label: 'Cash', value: `₱${cashRevenue.toLocaleString()}`, sub: `${orders.filter(o => o.paymentMethod === 'cod' && o.status !== 'cancelled').length} txns`, gradient: 'from-amber-50 to-yellow-50', border: 'border-amber-200/60' },
        ].map((s) => (
          <div key={s.label} className={`bg-gradient-to-br ${s.gradient} border ${s.border} rounded-3xl p-5 shadow-sm hover:shadow-md transition-all`}>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">{s.label}</p>
            <p className="text-2xl text-gray-900 mb-1">{s.value}</p>
            <p className="text-xs text-gray-500">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Order Type Breakdown */}
      <div className="bg-white rounded-3xl border border-gray-200/50 shadow-lg p-6">
        <p className="text-sm text-gray-700 mb-4">Breakdown by Order Type</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {typeBreakdown.map(({ type, count, revenue }) => {
            const cfg = ORDER_TYPE_CFG[type];
            return (
              <div key={type} className={`${cfg.bg} rounded-2xl p-4`}>
                <p className={`text-xs ${cfg.text} uppercase tracking-wider mb-2`}>{cfg.label}</p>
                <p className="text-2xl text-gray-900">{count}</p>
                <p className="text-xs text-gray-500 mt-1">₱{revenue.toLocaleString()}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or order #…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:border-black transition-colors"
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:border-black transition-colors">
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="ongoing">In Progress</option>
          <option value="received">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:border-black transition-colors">
          <option value="all">All Types</option>
          <option value="dine-in">Dine In</option>
          <option value="takeout">Takeout</option>
          <option value="delivery">Delivery</option>
          <option value="pickup">Pick Up</option>
        </select>
        <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:border-black transition-colors">
          <option value="all">All Payments</option>
          <option value="cod">Cash</option>
          <option value="gcash">GCash</option>
          <option value="card">Card</option>
        </select>
        <span className="text-xs text-gray-400">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Transaction Cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200/50 shadow-lg py-16 text-center text-gray-300">
            <Receipt className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p>No transactions found</p>
          </div>
        ) : (
          filtered.map((o) => {
            const statusCfg = STATUS_CONFIG[o.status];
            const typeCfg = ORDER_TYPE_CFG[o.deliveryType] ?? { label: o.deliveryType, bg: 'bg-gray-50', text: 'text-gray-600' };
            const paymentCfg = PAYMENT_CFG[o.paymentMethod] ?? { label: o.paymentMethod, color: 'text-gray-600', icon: null };
            const isExpanded = expandedOrder === o.orderNumber;

            return (
              <div key={o.orderNumber} className={`bg-white rounded-3xl border shadow-md hover:shadow-lg transition-all overflow-hidden ${
                o.status === 'pending' ? 'border-amber-200/60' :
                o.status === 'ongoing' ? 'border-blue-200/60' :
                o.status === 'received' ? 'border-green-200/40' : 'border-gray-200/50'
              }`}>
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50/40 transition-colors"
                  onClick={() => setExpandedOrder(isExpanded ? null : o.orderNumber)}
                >
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${statusCfg.dot}`} />
                    <div className="flex-1 min-w-[120px]">
                      <p className="text-sm text-gray-900">{o.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{o.date}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full hidden sm:inline-flex ${typeCfg.bg} ${typeCfg.text}`}>
                      {typeCfg.label}
                    </span>
                    <div className={`items-center gap-1 text-xs ${paymentCfg.color} hidden sm:flex`}>
                      {paymentCfg.icon}{paymentCfg.label}
                    </div>
                    <span className="text-xs text-gray-400 hidden md:block">{o.items.length} item{o.items.length !== 1 ? 's' : ''}</span>
                    <span className="text-sm text-gray-900">₱{o.total}</span>
                    <span className={`text-xs px-2.5 py-1 rounded-full ${statusCfg.badge}`}>{statusCfg.label}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50/40 p-5 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Items Ordered</p>
                        <div className="space-y-2">
                          {o.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                                {item.image
                                  ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                  : <Package className="w-4 h-4 text-gray-400 m-auto" />}
                              </div>
                              <span className="flex-1 text-sm">{item.name} <span className="text-gray-400">×{item.quantity}</span></span>
                              <span className="text-sm">₱{item.price * item.quantity}</span>
                            </div>
                          ))}
                          <div className="border-t border-gray-200 pt-2 flex justify-between text-sm">
                            <span className="text-gray-500">Total</span><span>₱{o.total}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Order Details</p>
                        <div className="space-y-2.5 text-sm bg-white rounded-2xl p-4 border border-gray-100">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Order Type</span>
                            <span className={`text-xs px-2.5 py-1 rounded-full ${typeCfg.bg} ${typeCfg.text}`}>{typeCfg.label}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Payment</span>
                            <div className={`flex items-center gap-1.5 ${paymentCfg.color}`}>{paymentCfg.icon}<span>{paymentCfg.label}</span></div>
                          </div>
                          {o.address && (
                            <div className="flex justify-between gap-4">
                              <span className="text-gray-400 flex-shrink-0">Address</span>
                              <span className="text-right text-gray-700">{o.address}{o.city ? `, ${o.city}` : ''}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-gray-400">Subtotal</span><span>₱{o.subtotal}</span>
                          </div>
                          {o.deliveryFee > 0 && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">Delivery Fee</span><span>₱{o.deliveryFee}</span>
                            </div>
                          )}
                        </div>
                        {(o.status === 'pending' || o.status === 'ongoing') && (
                          <div className="flex gap-2 mt-3">
                            {o.status === 'pending' && (
                              <button onClick={() => updateOrderStatus(o.orderNumber, 'cancelled')}
                                className="px-4 py-2.5 text-xs border border-red-200 text-red-600 rounded-2xl hover:bg-red-50 hover:shadow-md transition-all">
                                Cancel
                              </button>
                            )}
                            <button onClick={() => updateOrderStatus(o.orderNumber, o.status === 'pending' ? 'ongoing' : 'received')}
                              className="flex-1 px-4 py-2.5 text-xs bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl hover:shadow-lg hover:scale-105 transition-all">
                              {o.status === 'pending' ? 'Mark In Progress' : 'Mark Completed'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {(['pending', 'ongoing', 'received', 'cancelled'] as SavedOrder['status'][]).map((s) => {
          const count = orders.filter((o) => o.status === s).length;
          const rev = orders.filter((o) => o.status === s).reduce((sum, o) => sum + o.total, 0);
          return (
            <div key={s} className="bg-white border border-gray-200/50 rounded-3xl p-5 shadow-md hover:shadow-lg transition-all">
              <span className={`text-xs px-2.5 py-1 rounded-full ${STATUS_CONFIG[s].badge}`}>
                {STATUS_CONFIG[s].label}
              </span>
              <p className="text-2xl mt-3 text-gray-900">{count}</p>
              <p className="text-xs text-gray-500 mt-1">₱{rev.toLocaleString()}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Store Settings Section ───────────────────────────────────────────────────

function StoreSettingsSection() {
  const { settings, updateSettings, updateHeroSlide, addHeroSlide, removeHeroSlide } = useApp();
  const [info, setInfo] = useState({ ...settings });
  const [saved, setSaved] = useState(false);
  const [newSlide, setNewSlide] = useState({ title: '', subtitle: '', description: '', image: '' });
  const [addingSlide, setAddingSlide] = useState(false);

  const handleSaveInfo = () => {
    updateSettings({
      storeName: info.storeName,
      email: info.email,
      phone: info.phone,
      address: info.address,
      weekdayHours: info.weekdayHours,
      weekendHours: info.weekendHours,
      announcement: info.announcement,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl mb-1">Store Settings</h2>
        <p className="text-sm text-gray-400">Customize your store's appearance and information</p>
      </div>

      {/* Hero Slides */}
      <div className="bg-white rounded-3xl border border-gray-200/50 shadow-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-gray-800">Hero Carousel Slides</p>
            <p className="text-xs text-gray-400 mt-0.5">Edit or add slides shown on the customer homepage</p>
          </div>
          <button
            onClick={() => setAddingSlide(true)}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-br from-gray-900 to-black text-white rounded-full text-sm hover:shadow-lg hover:scale-105 transition-all"
          >
            <Plus className="w-4 h-4" />Add Slide
          </button>
        </div>

        <div className="space-y-4">
          {settings.heroSlides.map((slide, idx) => (
            <SlideEditor
              key={slide.id}
              slide={slide}
              index={idx}
              canDelete={settings.heroSlides.length > 1}
              onUpdate={(updates) => updateHeroSlide(slide.id, updates)}
              onDelete={() => removeHeroSlide(slide.id)}
            />
          ))}

          {addingSlide && (
            <div className="border border-dashed border-gray-300 rounded-2xl p-4 space-y-3">
              <p className="text-sm text-gray-600">New Slide</p>
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Title" value={newSlide.title} onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })}
                  className="col-span-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black" />
                <input placeholder="Subtitle" value={newSlide.subtitle} onChange={(e) => setNewSlide({ ...newSlide, subtitle: e.target.value })}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black" />
                <input placeholder="Description" value={newSlide.description} onChange={(e) => setNewSlide({ ...newSlide, description: e.target.value })}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black" />
                <input placeholder="Image URL" value={newSlide.image} onChange={(e) => setNewSlide({ ...newSlide, image: e.target.value })}
                  className="col-span-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black" />
              </div>
              <div className="flex gap-2">
                <button onClick={() => setAddingSlide(false)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-full text-sm hover:border-black hover:shadow-md transition-all">
                  Cancel
                </button>
                <button onClick={() => {
                  if (newSlide.title && newSlide.image) {
                    addHeroSlide(newSlide);
                    setNewSlide({ title: '', subtitle: '', description: '', image: '' });
                    setAddingSlide(false);
                  }
                }}
                  className="flex-1 py-2.5 bg-gradient-to-br from-gray-900 to-black text-white rounded-full text-sm hover:shadow-lg hover:scale-105 transition-all">
                  Add Slide
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Store Info */}
      <div className="bg-white rounded-3xl border border-gray-200/50 shadow-lg p-6">
        <p className="text-gray-800 mb-5">Store Information</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Store Name', key: 'storeName', placeholder: 'Fabella Coffee' },
            { label: 'Phone Number', key: 'phone', placeholder: '+63 917 123 4567' },
            { label: 'Email Address', key: 'email', placeholder: 'hello@fabella.com' },
            { label: 'Address', key: 'address', placeholder: 'Store address' },
            { label: 'Weekday Hours', key: 'weekdayHours', placeholder: '6am - 10pm' },
            { label: 'Weekend Hours', key: 'weekendHours', placeholder: '7am - 11pm' },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className="text-xs text-gray-400 mb-1.5 block">{label}</label>
              <input
                type="text"
                placeholder={placeholder}
                value={(info as unknown as Record<string, string>)[key]}
                onChange={(e) => setInfo({ ...info, [key]: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black transition-colors"
              />
            </div>
          ))}

          <div className="sm:col-span-2">
            <label className="text-xs text-gray-400 mb-1.5 block">Announcement Banner (leave blank to hide)</label>
            <input
              type="text"
              placeholder="e.g. Free delivery on orders over ₱500 today!"
              value={info.announcement}
              onChange={(e) => setInfo({ ...info, announcement: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black transition-colors"
            />
          </div>
        </div>

        <button
          onClick={handleSaveInfo}
          className={`mt-6 flex items-center gap-2 px-8 py-3 rounded-full text-sm transition-all shadow-lg ${
            saved ? 'bg-gradient-to-br from-green-600 to-emerald-600 text-white scale-105' : 'bg-gradient-to-br from-gray-900 to-black text-white hover:shadow-xl hover:scale-105'
          }`}
        >
          {saved ? <><Check className="w-4 h-4" />Saved!</> : <>Save Changes</>}
        </button>
      </div>
    </div>
  );
}

function SlideEditor({ slide, index, canDelete, onUpdate, onDelete }: {
  slide: HeroSlide; index: number; canDelete: boolean;
  onUpdate: (u: Partial<HeroSlide>) => void; onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...slide });

  const handleSave = () => {
    onUpdate(form);
    setEditing(false);
  };

  return (
    <div className="border border-gray-200/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-white to-gray-50/30">
        <div className="w-20 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
          <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm truncate">{slide.title}</p>
          <p className="text-xs text-gray-400">{slide.subtitle}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={() => setEditing(!editing)}
            className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <Pencil className="w-4 h-4 text-gray-500" />
          </button>
          {canDelete && (
            <button onClick={onDelete}
              className="p-2 rounded-lg bg-red-50 hover:bg-red-100 transition-colors">
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          )}
        </div>
      </div>

      {editing && (
        <div className="border-t border-gray-100 p-4 bg-gray-50/40 space-y-3">
          {form.image && (
            <div className="w-full h-36 rounded-xl overflow-hidden bg-gray-200">
              <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="col-span-2 px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black" />
            <input placeholder="Subtitle" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black" />
            <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black" />
            <input placeholder="Image URL (Unsplash, etc.)" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="col-span-2 px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setEditing(false)}
              className="flex-1 py-2.5 border border-gray-200 rounded-full text-sm hover:border-black hover:shadow-md transition-all">
              Cancel
            </button>
            <button onClick={handleSave}
              className="flex-1 py-2.5 bg-gradient-to-br from-gray-900 to-black text-white rounded-full text-sm hover:shadow-lg hover:scale-105 transition-all">
              Save Slide
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Admin Page ──────────────────��───────────────────────────────────────

export function AdminPage() {
  const router = useRouter();
  const [section, setSection] = useState<AdminSection>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems: { key: AdminSection; label: string; icon: React.ReactNode }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { key: 'menu', label: 'Menu Management', icon: <UtensilsCrossed className="w-5 h-5" /> },
    { key: 'transactions', label: 'Transactions', icon: <Receipt className="w-5 h-5" /> },
    { key: 'settings', label: 'Store Settings', icon: <Settings className="w-5 h-5" /> },
  ];

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
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-900 to-black p-0.5 shadow-lg">
              <div className="w-full h-full rounded-2xl bg-white p-1 flex items-center justify-center">
                <img src={typeof logoImg === 'string' ? logoImg : logoImg.src} alt="Fabella Coffee" className="w-full h-full object-contain" />
              </div>
            </div>
            <div>
              <p className="text-sm tracking-tight">FABELLA COFFEE</p>
              <p className="text-xs text-gray-400">Admin Panel</p>
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

        {/* Footer */}
        <div className="p-5 border-t border-gray-100">
          <button
            onClick={() => router.push('/')}
            className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm text-gray-600 hover:bg-gray-50 hover:shadow-sm transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Store
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar (mobile) */}
        <header className="lg:hidden bg-white/80 backdrop-blur-xl border-b border-gray-100 flex-shrink-0 z-20 px-4 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="p-2.5 rounded-2xl hover:bg-gray-100 transition-all">
              <BarChart3 className="w-5 h-5" />
            </button>
            <div>
              <p className="text-sm">Admin Panel</p>
              <p className="text-xs text-gray-400">{navItems.find((n) => n.key === section)?.label}</p>
            </div>
          </div>
          <button           onClick={() => router.push('/')}
                      className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-br from-gray-900 to-black text-white rounded-full text-sm hover:shadow-lg transition-all">
                      <ArrowLeft className="w-4 h-4" />Exit
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl w-full mx-auto">
            {section === 'dashboard' && <DashboardSection />}
            {section === 'menu' && <MenuManagementSection />}
            {section === 'transactions' && <TransactionsSection />}
            {section === 'settings' && <StoreSettingsSection />}
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
