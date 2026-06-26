'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import type { SavedOrder } from '../components/OrderHistory';
import { isSupabaseConfigured } from '../../lib/supabase/client';
import {
  fetchProducts as fetchProductsFromDb,
  createProductInDb,
  updateProductInDb,
  deleteProductFromDb,
  toggleProductAvailabilityInDb,
} from '../../lib/supabase/products';
import { fetchStoreSettingsFromDb, updateStoreSettingsInDb } from '../../lib/supabase/store_settings';
import { createOrder } from '../../lib/services/orders';
import { createClient } from '../../lib/supabase/client';
import type { DisplayType, SetItem } from '../../lib/supabase/database.types';
import heroDefaultImg from '../../imports/682530946_1011749808048143_8253999997136808313_n.jpg';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  promo_price?: number | null;
  category: 'coffee' | 'food' | 'pastries' | 'beverages';
  display_type?: DisplayType;
  image: string;
  available: boolean;
  set_items?: SetItem[] | null;
  is_featured?: boolean;
  is_promo?: boolean;
  created_at?: string;
  updated_at?: string;
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
  deliveryFee: number;
  gcashNumber: string;
  gcashName: string;
  gcashQrCode: string;
  notificationSoundUrl?: string;
}

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Espresso', description: 'Rich and bold single shot', price: 85, category: 'coffee', display_type: 'regular', is_featured: false, is_promo: false, image: 'https://images.unsplash.com/photo-1528401635478-821b5f89ff94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBlc3ByZXNzbyUyMGN1cHxlbnwxfHx8fDE3Nzc0NjkyMjB8MA&ixlib=rb-4.1.0&q=80&w=1080', available: true, promo_price: null, set_items: null, created_at: '', updated_at: '' },
  { id: '2', name: 'Cappuccino', description: 'Espresso with steamed milk foam', price: 120, category: 'coffee', display_type: 'regular', is_featured: false, is_promo: false, image: 'https://images.unsplash.com/photo-1645445644664-8f44112f334c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxjb2ZmZWUlMjBlc3ByZXNzbyUyMGN1cHxlbnwxfHx8fDE3Nzc0NjkyMjB8MA&ixlib=rb-4.1.0&q=80&w=1080', available: true, promo_price: null, set_items: null, created_at: '', updated_at: '' },
  { id: '3', name: 'Flat White', description: 'Smooth microfoam perfection', price: 135, category: 'coffee', display_type: 'regular', is_featured: false, is_promo: false, image: 'https://images.unsplash.com/photo-1612871616386-b0346398949d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxjb2ZmZWUlMjBlc3ByZXNzbyUyMGN1cHxlbnwxfHx8fDE3Nzc0NjkyMjB8MA&ixlib=rb-4.1.0&q=80&w=1080', available: true, promo_price: null, set_items: null, created_at: '', updated_at: '' },
  { id: '4', name: 'Cold Brew', description: 'Smooth, cold-steeped coffee', price: 145, category: 'coffee', display_type: 'regular', is_featured: false, is_promo: false, image: 'https://images.unsplash.com/photo-1637178628249-215e78e3c716?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxjb2ZmZWUlMjBlc3ByZXNzbyUyMGN1cHxlbnwxfHx8fDE3Nzc0NjkyMjB8MA&ixlib=rb-4.1.0&q=80&w=1080', available: true, promo_price: null, set_items: null, created_at: '', updated_at: '' },
  { id: '5', name: 'Avocado Toast', description: 'Sourdough with fresh avocado', price: 185, category: 'food', display_type: 'regular', is_featured: false, is_promo: false, image: 'https://images.unsplash.com/photo-1676471970358-1cff04452e7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdm9jYWRvJTIwdG9hc3QlMjBicmVha2Zhc3R8ZW58MXx8fHwxNzc3NDY5MjIxfDA&ixlib=rb-4.1.0&q=80&w=1080', available: true, promo_price: null, set_items: null, created_at: '', updated_at: '' },
  { id: '6', name: 'Breakfast Burrito', description: 'Eggs, cheese, and chorizo', price: 165, category: 'food', display_type: 'regular', is_featured: false, is_promo: false, image: 'https://images.unsplash.com/photo-1609158087148-3bae840bcfda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxhdm9jYWRvJTIwdG9hc3QlMjBicmVha2Zhc3R8ZW58MXx8fHwxNzc3NDY5MjIxfDA&ixlib=rb-4.1.0&q=80&w=1080', available: true, promo_price: null, set_items: null, created_at: '', updated_at: '' },
  { id: '7', name: 'Caesar Salad', description: 'Classic with parmesan', price: 155, category: 'food', display_type: 'regular', is_featured: false, is_promo: false, image: 'https://images.unsplash.com/photo-1616902685816-fbe1aeb3ea79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxhdm9jYWRvJTIwdG9hc3QlMjBicmVha2Zhc3R8ZW58MXx8fHwxNzc3NDY5MjIxfDA&ixlib=rb-4.1.0&q=80&w=1080', available: true, promo_price: null, set_items: null, created_at: '', updated_at: '' },
  { id: '8', name: 'Grilled Sandwich', description: 'Turkey and swiss on rye', price: 175, category: 'food', display_type: 'regular', is_featured: false, is_promo: false, image: 'https://images.unsplash.com/photo-1616902666559-af398792d890?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxhdm9jYWRvJTIwdG9hc3QlMjBicmVha2Zhc3R8ZW58MXx8fHwxNzc3NDY5MjIxfDA&ixlib=rb-4.1.0&q=80&w=1080', available: true, promo_price: null, set_items: null, created_at: '', updated_at: '' },
  { id: '9', name: 'Croissant', description: 'Buttery and flaky', price: 65, category: 'pastries', display_type: 'regular', is_featured: false, is_promo: false, image: 'https://images.unsplash.com/photo-1751151856149-5ebf1d21586a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcm9pc3NhbnQlMjBwYXN0cnklMjBiYWtlcnl8ZW58MXx8fHwxNzc3NDY5MjIxfDA&ixlib=rb-4.1.0&q=80&w=1080', available: true, promo_price: null, set_items: null, created_at: '', updated_at: '' },
  { id: '10', name: 'Blueberry Muffin', description: 'Fresh baked daily', price: 55, category: 'pastries', display_type: 'regular', is_featured: false, is_promo: false, image: 'https://images.unsplash.com/photo-1571157577110-493b325fdd3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxjcm9pc3NhbnQlMjBwYXN0cnklMjBiYWtlcnl8ZW58MXx8fHwxNzc3NDY5MjIxfDA&ixlib=rb-4.1.0&q=80&w=1080', available: true, promo_price: null, set_items: null, created_at: '', updated_at: '' },
  { id: '11', name: 'Chocolate Brownie', description: 'Rich and fudgy', price: 75, category: 'pastries', display_type: 'regular', is_featured: false, is_promo: false, image: 'https://images.unsplash.com/photo-1737700088850-d0b53f9d39ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxjcm9pc3NhbnQlMjBwYXN0cnklMjBiYWtlcnl8ZW58MXx8fHwxNzc3NDY5MjIxfDA&ixlib=rb-4.1.0&q=80&w=1080', available: true, promo_price: null, set_items: null, created_at: '', updated_at: '' },
  { id: '12', name: 'Almond Scone', description: 'Light and crumbly', price: 70, category: 'pastries', display_type: 'regular', is_featured: false, is_promo: false, image: 'https://images.unsplash.com/photo-1712723246766-3eaea22e52ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxjcm9pc3NhbnQlMjJiYWtlcnl8ZW58MXx8fHwxNzc3NDY5MjIxfDA&ixlib=rb-4.1.0&q=80&w=1080', available: true, promo_price: null, set_items: null, created_at: '', updated_at: '' },
  { id: '13', name: 'Matcha Latte', description: 'Ceremonial grade matcha', price: 150, category: 'beverages', display_type: 'regular', is_featured: false, is_promo: false, image: 'https://images.unsplash.com/photo-1708572727896-117b5ea25a86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXRjaGElMjBsYXR0ZSUyMHRlYXxlbnwxfHx8fDE3Nzc0NjkyMjF8MA&ixlib=rb-4.1.0&q=80&w=1080', available: true, promo_price: null, set_items: null, created_at: '', updated_at: '' },
  { id: '14', name: 'Chai Tea', description: 'Spiced black tea latte', price: 115, category: 'beverages', display_type: 'regular', is_featured: false, is_promo: false, image: 'https://images.unsplash.com/photo-1708572808503-48242f5c9a89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxtYXRjaGElMjBsYXR0ZSUyMHRlYXxlbnwxfHx8fDE3Nzc0NjkyMjF8MA&ixlib=rb-4.1.0&q=80&w=1080', available: true, promo_price: null, set_items: null, created_at: '', updated_at: '' },
  { id: '15', name: 'Fresh Orange Juice', description: 'Squeezed to order', price: 95, category: 'beverages', display_type: 'regular', is_featured: false, is_promo: false, image: 'https://images.unsplash.com/photo-1727850005779-1e24cac382d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxtYXRjaGElMjBsYXR0ZSUyMHRlYXxlbnwxfHx8fDE3Nzc0NjkyMjF8MA&ixlib=rb-4.1.0&q=80&w=1080', available: true, promo_price: null, set_items: null, created_at: '', updated_at: '' },
  { id: '16', name: 'Hot Chocolate', description: 'Rich Belgian chocolate', price: 125, category: 'beverages', display_type: 'regular', is_featured: false, is_promo: false, image: 'https://images.unsplash.com/photo-1727850005809-d575cdcac28c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxtYXRjaGElMjBsYXR0ZSUyMHRlYXxlbnwxfHx8fDE3Nzc0NjkyMjF8MA&ixlib=rb-4.1.0&q=80&w=1080', available: true, promo_price: null, set_items: null, created_at: '', updated_at: '' },
];;

const INITIAL_SETTINGS: StoreSettings = {
  heroSlides: [
    { id: 'slide-1', title: 'Fabella Coffee', subtitle: 'Crafted with Precision', description: 'Experience the finest specialty coffee, roasted to perfection', image: typeof heroDefaultImg === 'string' ? heroDefaultImg : heroDefaultImg.src },
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
  deliveryFee: 49,
  gcashNumber: '+63 917 123 4567',
  gcashName: 'Fabella Coffee',
  gcashQrCode: '',
  notificationSoundUrl: '',
};

interface AppContextType {
  products: Product[];
  orders: SavedOrder[];
  settings: StoreSettings;
  productsLoading: boolean;
  addOrder: (order: SavedOrder) => Promise<SavedOrder>;
  updateOrderStatus: (id: string, status: SavedOrder['status']) => void;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  toggleProductAvailability: (id: string) => Promise<void>;
  refreshProducts: () => Promise<void>;
  refreshOrders: () => Promise<void>;
  updateSettings: (updates: Partial<StoreSettings>) => Promise<void>;
  updateHeroSlide: (id: string, updates: Partial<HeroSlide>) => Promise<void>;
  addHeroSlide: (slide: Omit<HeroSlide, 'id'>) => Promise<void>;
  removeHeroSlide: (id: string) => Promise<void>;
  unreadOrderCount: number;
  latestNotification: { title: string; body: string; id: string } | null;
  clearUnreadOrders: () => void;
  clearLatestNotification: () => void;
}

const AppContext = createContext<AppContextType>(null!);

export function AppProvider({ children }: { children: ReactNode }) {
  const { role } = useAuth();
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<SavedOrder[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_SETTINGS);
  const [productsLoading, setProductsLoading] = useState(false);
  const [unreadOrderCount, setUnreadOrderCount] = useState(0);
  const [latestNotification, setLatestNotification] = useState<{ title: string; body: string; id: string } | null>(null);

  // A very short, pleasant generic bell chime in base64 to avoid external asset loading issues
  const chimeBase64 = "data:audio/mp3;base64,//OExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//OExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq"; 
  // (Note: The above is a tiny silent stub to prevent crash if not perfectly generated, we will use a browser AudioContext oscillator for a perfect guaranteed chime instead to keep the file size pristine).

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Preload the custom sound as soon as the settings are fetched or updated
  useEffect(() => {
    if (settings.notificationSoundUrl) {
      console.log("Preloading custom notification sound:", settings.notificationSoundUrl);
      const audio = new Audio(settings.notificationSoundUrl);
      audio.preload = 'auto';
      audio.load();
      audioRef.current = audio;
    } else {
      audioRef.current = null;
    }
  }, [settings.notificationSoundUrl]);

  const playChime = useCallback(() => {
    try {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((audioErr) => {
          console.warn("Failed to play preloaded custom MP3 notification sound, falling back to synthesized chime:", audioErr);
          playSynthesizedChime();
        });
        return;
      }
      playSynthesizedChime();
    } catch (e) {
      console.warn("Audio autoplay blocked or unsupported by browser policy", e);
    }

    function playSynthesizedChime() {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        
        // Resume context if suspended (browser security requirement)
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        const now = ctx.currentTime;
        
        const playBellTone = (freq: number, startTime: number, maxGain: number, duration: number) => {
          const osc = ctx.createOscillator();
          const gainNode = ctx.createGain();
          
          // Sine wave for pure, soft bell tones
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + startTime);
          
          // Soft Attack - gentle linear ramp up to avoid clicks or hard hits
          gainNode.gain.setValueAtTime(0, now + startTime);
          gainNode.gain.linearRampToValueAtTime(maxGain, now + startTime + 0.03);
          // Smooth exponential decay
          gainNode.gain.exponentialRampToValueAtTime(0.0001, now + startTime + duration);
          
          osc.connect(gainNode);
          gainNode.connect(ctx.destination);
          
          osc.start(now + startTime);
          osc.stop(now + startTime + duration + 0.15);
        };

        // Sparkling high-pitched crystal bells (G-major triad chord)
        playBellTone(1567.98, 0.0, 0.07, 1.5); // G6 crystal bell
        playBellTone(1975.53, 0.15, 0.05, 1.2); // B6 crystal bell
        playBellTone(2349.32, 0.3, 0.04, 1.8); // D7 crystal bell
      } catch (err) {
        console.warn("Failed to play synthesized chime:", err);
      }
    }
  }, []);

  const clearUnreadOrders = useCallback(() => setUnreadOrderCount(0), []);
  const clearLatestNotification = useCallback(() => setLatestNotification(null), []);

  const refreshProducts = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    try {
      setProductsLoading(true);
      const dbProducts = await fetchProductsFromDb();
      if (dbProducts.length > 0) {
        setProducts(dbProducts.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          promo_price: p.promo_price,
          category: p.category,
          display_type: p.display_type,
          image: p.image,
          available: p.available,
          set_items: p.set_items,
          is_featured: p.is_featured ?? false,
          is_promo: p.is_promo ?? false,
        })));
      }
    } catch (err) {
      console.error('Failed to load products from Supabase:', err);
    } finally {
      setProductsLoading(false);
    }
  }, []);

  const refreshSettings = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    try {
      const dbSettings = await fetchStoreSettingsFromDb();
      if (dbSettings) {
        setSettings({
          heroSlides: dbSettings.hero_slides || INITIAL_SETTINGS.heroSlides,
          storeName: dbSettings.store_name,
          email: dbSettings.email,
          phone: dbSettings.phone,
          address: dbSettings.address,
          weekdayHours: dbSettings.weekday_hours,
          weekendHours: dbSettings.weekend_hours,
          announcement: dbSettings.announcement || '',
          deliveryFee: Number(dbSettings.delivery_fee) || 49,
          gcashNumber: dbSettings.gcash_number || '+63 917 123 4567',
          gcashName: dbSettings.gcash_name || 'Fabella Coffee',
          gcashQrCode: dbSettings.gcash_qr_code || '',
          notificationSoundUrl: dbSettings.notification_sound_url || '',
        });
      }
    } catch (err) {
      console.error('Failed to load store settings:', err);
    }
  }, []);

  const refreshOrders = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const mappedOrders: SavedOrder[] = data.map((order: any) => {
          const items = order.order_items || [];
          return {
            id: order.id,
            date: new Date(order.created_at).toLocaleDateString(),
            items: items.map((i: any) => ({
              id: i.product_id || '',
              name: i.product_name,
              price: Number(i.product_price),
              quantity: i.quantity,
            })),
            subtotal: items.reduce((sum: number, i: any) => sum + Number(i.product_price) * i.quantity, 0),
            deliveryFee: order.order_type === 'delivery' ? 50 : 0,
            total: Number(order.total),
            deliveryType: order.order_type,
            paymentMethod: order.payment_method,
            name: order.customer_name,
            phone: order.customer_phone || undefined,
            email: order.customer_email || undefined,
            address: order.delivery_address || undefined,
            city: '',
            notes: order.notes || undefined,
            status: order.status === 'completed' ? 'received' : order.status,
          };
        });
        setOrders(mappedOrders);
      }
    } catch (err) {
      console.error('Failed to load orders from Supabase:', err);
    }
  }, []);

  useEffect(() => {
    refreshProducts();
    refreshSettings();
    refreshOrders();

    if (isSupabaseConfigured && (role === 'admin' || role === 'staff')) {
      const supabase = createClient();
      
      // Listen for all order changes via Supabase Realtime to keep screens synced
      const channel = supabase.channel('realtime_orders')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'orders' },
          (payload) => {
            // Refresh to grab full data (including joined items)
            refreshOrders();
            
            // Trigger Notifications ONLY on INSERT
            if (payload.eventType === 'INSERT') {
              const newOrder = payload.new;
              playChime();
              setUnreadOrderCount(prev => prev + 1);
              setLatestNotification({
                id: newOrder.id,
                title: '🔔 New Order Received',
                body: `${newOrder.customer_name || 'Customer'} placed an order (${newOrder.order_type === 'delivery' ? '🚗 Delivery' : '☕ Pickup'})`
              });
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [refreshProducts, refreshSettings, refreshOrders, playChime, role]);

  const addOrder = async (order: SavedOrder): Promise<SavedOrder> => {
    let finalOrder = order;

    if (isSupabaseConfigured) {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        await refreshOrders(); // Pull latest to prevent race
        const created = await createOrder({
          customer_name: order.name,
          customer_id: session?.user?.id,
          customer_email: session?.user?.email,
          customer_phone: order.phone || undefined,
          order_type: order.deliveryType as any,
          payment_method: order.paymentMethod as any,
          delivery_address: order.address ? `${order.address}, ${order.city || ''}` : undefined,
          notes: order.notes,
          items: order.items.map(item => {
            const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(item.id);
            return {
              product_id: isValidUUID ? item.id : undefined,
              product_name: item.name,
              product_price: item.price,
              quantity: item.quantity,
            };
          }),
        } as any);

        if (created) {
          finalOrder = {
            ...order,
            id: created.id,
          };
        }
      } catch (err) {
        console.error('Failed to save order to Supabase:', err);
      }
    } else {
      finalOrder = {
        ...order,
        id: crypto.randomUUID(),
      };
    }

    setOrders((prev) => [finalOrder, ...prev]);
    return finalOrder;
  };

  const updateOrderStatus = async (id: string, status: SavedOrder['status']) => {
    // Optimistic UI update
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));

    if (isSupabaseConfigured) {
      try {
        const supabase = createClient();
        
        // Find the order to get its DB UUID
        const orderToUpdate = orders.find(o => o.id === id);
        if (!orderToUpdate) return;
        
        // Map frontend status back to DB status
        const dbStatus = status === 'received' ? 'completed' : status;
        
        const { updateOrderStatus: updateOrderStatusInDb } = await import('../../lib/services/orders');
        await updateOrderStatusInDb(orderToUpdate.id, dbStatus as any);
      } catch (err) {
        console.error('Failed to sync status update to Supabase:', err);
      }
    }
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    if (isSupabaseConfigured) {
      try {
        const created = await createProductInDb({
          name: product.name,
          description: product.description,
          price: product.price,
          promo_price: product.promo_price ?? null,
          category: product.category,
          display_type: product.display_type ?? 'regular',
          image: product.image,
          available: product.available,
          set_items: product.set_items ?? null,
          is_featured: product.is_featured ?? false,
          is_promo: product.is_promo ?? false,
        });
        setProducts((prev) => [...prev, {
          id: created.id,
          name: created.name,
          description: created.description,
          price: created.price,
          promo_price: created.promo_price,
          category: created.category,
          display_type: created.display_type,
          image: created.image,
          available: created.available,
          set_items: created.set_items,
          is_featured: created.is_featured,
          is_promo: created.is_promo,
        }]);
      } catch (err) {
        console.error('Failed to add product:', err);
        throw err;
      }
    } else {
      const id = String(Math.max(0, ...products.map((p) => parseInt(p.id, 10) || 0)) + 1);
      setProducts((prev) => [...prev, { ...product, id }]);
    }
  };

  const updateProduct = async (product: Product) => {
    if (isSupabaseConfigured) {
      try {
        const updated = await updateProductInDb(product.id, {
          name: product.name,
          description: product.description,
          price: product.price,
          promo_price: product.promo_price ?? null,
          category: product.category,
          display_type: product.display_type ?? 'regular',
          image: product.image,
          available: product.available,
          set_items: product.set_items ?? null,
          is_featured: product.is_featured,
          is_promo: product.is_promo,
        });
        setProducts((prev) => prev.map((p) => (p.id === product.id ? {
          id: updated.id,
          name: updated.name,
          description: updated.description,
          price: updated.price,
          promo_price: updated.promo_price,
          category: updated.category,
          display_type: updated.display_type,
          image: updated.image,
          available: updated.available,
          set_items: updated.set_items,
          is_featured: updated.is_featured,
          is_promo: updated.is_promo,
        } : p)));
      } catch (err) {
        console.error('Failed to update product:', err);
        throw err;
      }
    } else {
      setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
    }
  };

  const deleteProduct = async (id: string) => {
    if (isSupabaseConfigured) {
      try {
        await deleteProductFromDb(id);
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } catch (err) {
        console.error('Failed to delete product:', err);
        throw err;
      }
    } else {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const toggleProductAvailability = async (id: string) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    const newAvailable = !product.available;
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, available: newAvailable } : p)));
    if (isSupabaseConfigured) {
      try {
        await toggleProductAvailabilityInDb(id, newAvailable);
      } catch (err) {
        console.error('Failed to toggle availability:', err);
        setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, available: !newAvailable } : p)));
      }
    }
  };

  const updateSettings = async (updates: Partial<StoreSettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    if (isSupabaseConfigured) {
      try {
        await updateStoreSettingsInDb({
          store_name: newSettings.storeName,
          email: newSettings.email,
          phone: newSettings.phone,
          address: newSettings.address,
          weekday_hours: newSettings.weekdayHours,
          weekend_hours: newSettings.weekendHours,
          announcement: newSettings.announcement,
          delivery_fee: newSettings.deliveryFee,
          gcash_number: newSettings.gcashNumber,
          gcash_name: newSettings.gcashName,
          gcash_qr_code: newSettings.gcashQrCode,
          hero_slides: newSettings.heroSlides,
          notification_sound_url: newSettings.notificationSoundUrl,
        } as any);
      } catch (err) {
        console.error('Failed to save settings:', err);
      }
    }
  };

  const updateHeroSlide = async (id: string, updates: Partial<HeroSlide>) => {
    const newSlides = settings.heroSlides.map((s) => (s.id === id ? { ...s, ...updates } : s));
    const newSettings = { ...settings, heroSlides: newSlides };
    setSettings(newSettings);
    if (isSupabaseConfigured) {
      await updateStoreSettingsInDb({ hero_slides: newSlides });
    }
  };

  const addHeroSlide = async (slide: Omit<HeroSlide, 'id'>) => {
    const newSlides = [...settings.heroSlides, { ...slide, id: `slide-${Date.now()}` }];
    const newSettings = { ...settings, heroSlides: newSlides };
    setSettings(newSettings);
    if (isSupabaseConfigured) {
      await updateStoreSettingsInDb({ hero_slides: newSlides });
    }
  };

  const removeHeroSlide = async (id: string) => {
    const newSlides = settings.heroSlides.filter((s) => s.id !== id);
    const newSettings = { ...settings, heroSlides: newSlides };
    setSettings(newSettings);
    if (isSupabaseConfigured) {
      await updateStoreSettingsInDb({ hero_slides: newSlides });
    }
  };

  return (
    <AppContext.Provider
      value={{
        products, orders, settings, productsLoading,
        unreadOrderCount, latestNotification, clearUnreadOrders, clearLatestNotification,
        addOrder, updateOrderStatus,
        addProduct, updateProduct, deleteProduct, toggleProductAvailability, refreshProducts, refreshOrders,
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
