import { createContext, useContext, useState, ReactNode } from 'react';
import type { SavedOrder } from '../components/OrderHistory';
import heroDefaultImg from '../../imports/682530946_1011749808048143_8253999997136808313_n.jpg';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: 'coffee' | 'food' | 'pastries' | 'beverages';
  image: string;
  available: boolean;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

export interface StoreSettings {
  heroSlides: HeroSlide[];
  storeName: string;
  email: string;
  phone: string;
  address: string;
  weekdayHours: string;
  weekendHours: string;
  announcement: string;
}

const INITIAL_PRODUCTS: Product[] = [
  { id: 1, name: 'Espresso', description: 'Rich and bold single shot', price: 85, category: 'coffee', image: 'https://images.unsplash.com/photo-1528401635478-821b5f89ff94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBlc3ByZXNzbyUyMGN1cHxlbnwxfHx8fDE3Nzc0NjkyMjB8MA&ixlib=rb-4.1.0&q=80&w=1080', available: true },
  { id: 2, name: 'Cappuccino', description: 'Espresso with steamed milk foam', price: 120, category: 'coffee', image: 'https://images.unsplash.com/photo-1645445644664-8f44112f334c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxjb2ZmZWUlMjBlc3ByZXNzbyUyMGN1cHxlbnwxfHx8fDE3Nzc0NjkyMjB8MA&ixlib=rb-4.1.0&q=80&w=1080', available: true },
  { id: 3, name: 'Flat White', description: 'Smooth microfoam perfection', price: 135, category: 'coffee', image: 'https://images.unsplash.com/photo-1612871616386-b0346398949d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxjb2ZmZWUlMjBlc3ByZXNzbyUyMGN1cHxlbnwxfHx8fDE3Nzc0NjkyMjB8MA&ixlib=rb-4.1.0&q=80&w=1080', available: true },
  { id: 4, name: 'Cold Brew', description: 'Smooth, cold-steeped coffee', price: 145, category: 'coffee', image: 'https://images.unsplash.com/photo-1637178628249-215e78e3c716?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxjb2ZmZWUlMjBlc3ByZXNzbyUyMGN1cHxlbnwxfHx8fDE3Nzc0NjkyMjB8MA&ixlib=rb-4.1.0&q=80&w=1080', available: true },
  { id: 5, name: 'Avocado Toast', description: 'Sourdough with fresh avocado', price: 185, category: 'food', image: 'https://images.unsplash.com/photo-1676471970358-1cff04452e7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdm9jYWRvJTIwdG9hc3QlMjBicmVha2Zhc3R8ZW58MXx8fHwxNzc3NDY5MjIxfDA&ixlib=rb-4.1.0&q=80&w=1080', available: true },
  { id: 6, name: 'Breakfast Burrito', description: 'Eggs, cheese, and chorizo', price: 165, category: 'food', image: 'https://images.unsplash.com/photo-1609158087148-3bae840bcfda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxhdm9jYWRvJTIwdG9hc3QlMjBicmVha2Zhc3R8ZW58MXx8fHwxNzc3NDY5MjIxfDA&ixlib=rb-4.1.0&q=80&w=1080', available: true },
  { id: 7, name: 'Caesar Salad', description: 'Classic with parmesan', price: 155, category: 'food', image: 'https://images.unsplash.com/photo-1616902685816-fbe1aeb3ea79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxhdm9jYWRvJTIwdG9hc3QlMjBicmVha2Zhc3R8ZW58MXx8fHwxNzc3NDY5MjIxfDA&ixlib=rb-4.1.0&q=80&w=1080', available: true },
  { id: 8, name: 'Grilled Sandwich', description: 'Turkey and swiss on rye', price: 175, category: 'food', image: 'https://images.unsplash.com/photo-1616902666559-af398792d890?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxhdm9jYWRvJTIwdG9hc3QlMjBicmVha2Zhc3R8ZW58MXx8fHwxNzc3NDY5MjIxfDA&ixlib=rb-4.1.0&q=80&w=1080', available: true },
  { id: 9, name: 'Croissant', description: 'Buttery and flaky', price: 65, category: 'pastries', image: 'https://images.unsplash.com/photo-1751151856149-5ebf1d21586a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcm9pc3NhbnQlMjBwYXN0cnklMjBiYWtlcnl8ZW58MXx8fHwxNzc3NDY5MjIxfDA&ixlib=rb-4.1.0&q=80&w=1080', available: true },
  { id: 10, name: 'Blueberry Muffin', description: 'Fresh baked daily', price: 55, category: 'pastries', image: 'https://images.unsplash.com/photo-1571157577110-493b325fdd3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxjcm9pc3NhbnQlMjBwYXN0cnklMjBiYWtlcnl8ZW58MXx8fHwxNzc3NDY5MjIxfDA&ixlib=rb-4.1.0&q=80&w=1080', available: true },
  { id: 11, name: 'Chocolate Brownie', description: 'Rich and fudgy', price: 75, category: 'pastries', image: 'https://images.unsplash.com/photo-1737700088850-d0b53f9d39ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxjcm9pc3NhbnQlMjBwYXN0cnklMjBiYWtlcnl8ZW58MXx8fHwxNzc3NDY5MjIxfDA&ixlib=rb-4.1.0&q=80&w=1080', available: true },
  { id: 12, name: 'Almond Scone', description: 'Light and crumbly', price: 70, category: 'pastries', image: 'https://images.unsplash.com/photo-1712723246766-3eaea22e52ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxjcm9pc3NhbnQlMjBwYXN0cnklMjJiYWtlcnl8ZW58MXx8fHwxNzc3NDY5MjIxfDA&ixlib=rb-4.1.0&q=80&w=1080', available: true },
  { id: 13, name: 'Matcha Latte', description: 'Ceremonial grade matcha', price: 150, category: 'beverages', image: 'https://images.unsplash.com/photo-1708572727896-117b5ea25a86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXRjaGElMjBsYXR0ZSUyMHRlYXxlbnwxfHx8fDE3Nzc0NjkyMjF8MA&ixlib=rb-4.1.0&q=80&w=1080', available: true },
  { id: 14, name: 'Chai Tea', description: 'Spiced black tea latte', price: 115, category: 'beverages', image: 'https://images.unsplash.com/photo-1708572808503-48242f5c9a89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxtYXRjaGElMjBsYXR0ZSUyMHRlYXxlbnwxfHx8fDE3Nzc0NjkyMjF8MA&ixlib=rb-4.1.0&q=80&w=1080', available: true },
  { id: 15, name: 'Fresh Orange Juice', description: 'Squeezed to order', price: 95, category: 'beverages', image: 'https://images.unsplash.com/photo-1727850005779-1e24cac382d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxtYXRjaGElMjBsYXR0ZSUyMHRlYXxlbnwxfHx8fDE3Nzc0NjkyMjF8MA&ixlib=rb-4.1.0&q=80&w=1080', available: true },
  { id: 16, name: 'Hot Chocolate', description: 'Rich Belgian chocolate', price: 125, category: 'beverages', image: 'https://images.unsplash.com/photo-1727850005809-d575cdcac28c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxtYXRjaGElMjBsYXR0ZSUyMHRlYXxlbnwxfHx8fDE3Nzc0NjkyMjF8MA&ixlib=rb-4.1.0&q=80&w=1080', available: true },
];

const SAMPLE_ORDERS: SavedOrder[] = [
  {
    orderNumber: 'FC-884521-342',
    date: 'May 3, 2026, 09:15 AM',
    items: [{ id: 1, name: 'Espresso', price: 85, quantity: 2, image: INITIAL_PRODUCTS[0].image }, { id: 9, name: 'Croissant', price: 65, quantity: 1, image: INITIAL_PRODUCTS[8].image }],
    subtotal: 235, deliveryFee: 49, total: 284, deliveryType: 'delivery', paymentMethod: 'gcash',
    name: 'Maria Santos', address: '145 Cagwait Road', city: 'Bislig', status: 'received',
  },
  {
    orderNumber: 'FC-773209-118',
    date: 'May 3, 2026, 11:42 AM',
    items: [{ id: 2, name: 'Cappuccino', price: 120, quantity: 1 }, { id: 5, name: 'Avocado Toast', price: 185, quantity: 1 }],
    subtotal: 305, deliveryFee: 0, total: 305, deliveryType: 'pickup', paymentMethod: 'cod',
    name: 'Jose Reyes', status: 'received',
  },
  {
    orderNumber: 'FC-661480-507',
    date: 'May 3, 2026, 02:20 PM',
    items: [{ id: 13, name: 'Matcha Latte', price: 150, quantity: 2 }, { id: 11, name: 'Chocolate Brownie', price: 75, quantity: 2 }],
    subtotal: 450, deliveryFee: 49, total: 499, deliveryType: 'delivery', paymentMethod: 'card',
    name: 'Ana Dela Cruz', address: '78 Mangagoy St', city: 'Bislig', status: 'received',
  },
  {
    orderNumber: 'FC-550371-290',
    date: 'May 4, 2026, 07:05 AM',
    items: [{ id: 3, name: 'Flat White', price: 135, quantity: 1 }, { id: 10, name: 'Blueberry Muffin', price: 55, quantity: 2 }],
    subtotal: 245, deliveryFee: 49, total: 294, deliveryType: 'delivery', paymentMethod: 'cod',
    name: 'Ramon Villanueva', address: '22 Borja St', city: 'Bislig', status: 'received',
  },
  {
    orderNumber: 'FC-449162-033',
    date: 'May 4, 2026, 08:30 AM',
    items: [{ id: 4, name: 'Cold Brew', price: 145, quantity: 2 }, { id: 8, name: 'Grilled Sandwich', price: 175, quantity: 1 }],
    subtotal: 465, deliveryFee: 0, total: 465, deliveryType: 'pickup', paymentMethod: 'gcash',
    name: 'Liza Mercado', status: 'ongoing',
  },
];

const INITIAL_SETTINGS: StoreSettings = {
  heroSlides: [
    { id: 'slide-1', title: 'Fabella Coffee', subtitle: 'Crafted with Precision', description: 'Experience the finest specialty coffee, roasted to perfection', image: heroDefaultImg },
    { id: 'slide-2', title: 'Fresh Pastries', subtitle: 'Baked Daily', description: 'Indulge in our artisanal pastries and baked goods', image: 'https://images.unsplash.com/photo-1613559724083-359907cb5cb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxjb2ZmZWUlMjBlc3ByZXNzbyUyMGN1cHxlbnwxfHx8fDE3Nzc0NjkyMjB8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 'slide-3', title: 'Gourmet Menu', subtitle: 'All Day Dining', description: 'Explore our carefully curated food menu', image: 'https://images.unsplash.com/photo-1545418314-7ce0b9b53901?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxjb2ZmZWUlMjBzaG9wJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzc3Mzg3MTY1fDA&ixlib=rb-4.1.0&q=80&w=1080' },
  ],
  storeName: 'Fabella Coffee',
  email: 'hello@fabella.com',
  phone: '+63 917 123 4567',
  address: 'Ramz Square, Bislig, Philippines, 8311',
  weekdayHours: '6am - 10pm',
  weekendHours: '7am - 11pm',
  announcement: '',
};

interface AppContextType {
  products: Product[];
  orders: SavedOrder[];
  settings: StoreSettings;
  addOrder: (order: SavedOrder) => void;
  updateOrderStatus: (orderNumber: string, status: SavedOrder['status']) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: number) => void;
  toggleProductAvailability: (id: number) => void;
  updateSettings: (updates: Partial<StoreSettings>) => void;
  updateHeroSlide: (id: string, updates: Partial<HeroSlide>) => void;
  addHeroSlide: (slide: Omit<HeroSlide, 'id'>) => void;
  removeHeroSlide: (id: string) => void;
}

const AppContext = createContext<AppContextType>(null!);

export function AppProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<SavedOrder[]>(SAMPLE_ORDERS);
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_SETTINGS);

  const addOrder = (order: SavedOrder) => setOrders((prev) => [order, ...prev]);

  const updateOrderStatus = (orderNumber: string, status: SavedOrder['status']) =>
    setOrders((prev) => prev.map((o) => (o.orderNumber === orderNumber ? { ...o, status } : o)));

  const addProduct = (product: Omit<Product, 'id'>) => {
    const id = Math.max(0, ...products.map((p) => p.id)) + 1;
    setProducts((prev) => [...prev, { ...product, id }]);
  };

  const updateProduct = (product: Product) =>
    setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));

  const deleteProduct = (id: number) =>
    setProducts((prev) => prev.filter((p) => p.id !== id));

  const toggleProductAvailability = (id: number) =>
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, available: !p.available } : p)));

  const updateSettings = (updates: Partial<StoreSettings>) =>
    setSettings((prev) => ({ ...prev, ...updates }));

  const updateHeroSlide = (id: string, updates: Partial<HeroSlide>) =>
    setSettings((prev) => ({
      ...prev,
      heroSlides: prev.heroSlides.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));

  const addHeroSlide = (slide: Omit<HeroSlide, 'id'>) =>
    setSettings((prev) => ({
      ...prev,
      heroSlides: [...prev.heroSlides, { ...slide, id: `slide-${Date.now()}` }],
    }));

  const removeHeroSlide = (id: string) =>
    setSettings((prev) => ({
      ...prev,
      heroSlides: prev.heroSlides.filter((s) => s.id !== id),
    }));

  return (
    <AppContext.Provider
      value={{
        products, orders, settings,
        addOrder, updateOrderStatus,
        addProduct, updateProduct, deleteProduct, toggleProductAvailability,
        updateSettings, updateHeroSlide, addHeroSlide, removeHeroSlide,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
