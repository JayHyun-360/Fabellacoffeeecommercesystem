'use client';

import { useState } from 'react';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { MenuSection } from '../components/MenuSection';
import { Cart } from '../components/Cart';
import { Checkout } from '../components/Checkout';
import { OrderHistory } from '../components/OrderHistory';
import { SearchModal } from '../components/SearchModal';
import { useApp, type Product } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import type { SavedOrder } from '../components/OrderHistory';

interface CartItem extends Product {
  quantity: number;
}

export function CustomerPage() {
  const { products, orders, addOrder, updateOrderStatus, settings } = useApp();
  const { isAdmin } = useAuth();
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Only show available products to customers
  const availableProducts = products.filter((p) => p.available);

  const addToCart = (product: typeof products[0]) => {
    if (isAdmin) return;
    setCartItems((items) => {
      const existing = items.find((item) => item.id === product.id);
      if (existing) {
        return items.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...items, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((items) => items.map((item) => (item.id === id ? { ...item, quantity } : item)));
  };

  const removeFromCart = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const handleOrderComplete = (order: SavedOrder) => {
    setCartItems([]);
    setCheckoutOpen(false);
    addOrder(order);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        cartCount={isAdmin ? 0 : cartCount}
        onCartClick={isAdmin ? undefined : () => setCartOpen(true)}
        onHistoryClick={() => setHistoryOpen(true)}
        onSearchClick={() => setSearchOpen(true)}
      />

      {isAdmin && (
        <div className="bg-purple-600 text-white text-center py-2 px-6 text-sm tracking-wide">
          Preview Mode — You are viewing the store as a customer. Ordering is disabled.
        </div>
      )}

      <Hero />

      {settings.announcement && (
        <div className="bg-black text-white text-center py-3 px-6 text-sm tracking-wide">
          {settings.announcement}
        </div>
      )}

      <MenuSection
        id="coffee"
        title="Coffee"
        products={availableProducts.filter((p) => p.category === 'coffee')}
        onAddToCart={addToCart}
      />

      <div className="bg-gradient-to-br from-gray-900 to-black text-white py-32 px-6 my-20 rounded-[4rem] mx-6 shadow-2xl">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm tracking-[0.3em] uppercase mb-4 opacity-80">Our Promise</p>
          <h2 className="text-5xl mb-6">Ethically Sourced, Perfectly Roasted</h2>
          <p className="text-lg opacity-90">
            Every bean is carefully selected from sustainable farms around the world,
            ensuring exceptional quality in every cup.
          </p>
        </div>
      </div>

      <MenuSection
        id="food"
        title="Food"
        products={availableProducts.filter((p) => p.category === 'food')}
        onAddToCart={addToCart}
      />

      <MenuSection
        id="pastries"
        title="Pastries"
        products={availableProducts.filter((p) => p.category === 'pastries')}
        onAddToCart={addToCart}
      />

      <MenuSection
        id="beverages"
        title="Beverages"
        products={availableProducts.filter((p) => p.category === 'beverages')}
        onAddToCart={addToCart}
      />

      <footer className="bg-gray-50/80 py-12 px-6 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="mb-4">FABELLA</h3>
              <p className="text-sm opacity-60">Crafting excellence since 2020</p>
            </div>
            <div>
              <h4 className="mb-4">Menu</h4>
              <div className="space-y-2 text-sm opacity-60">
                <p>Coffee</p><p>Food</p><p>Pastries</p><p>Beverages</p>
              </div>
            </div>
            <div>
              <h4 className="mb-4">Contact</h4>
              <div className="space-y-2 text-sm opacity-60">
                <p>{settings.email}</p>
                <p>{settings.phone}</p>
              </div>
            </div>
            <div>
              <h4 className="mb-4">Hours</h4>
              <div className="space-y-2 text-sm opacity-60">
                <p>Mon–Fri: {settings.weekdayHours}</p>
                <p>Sat–Sun: {settings.weekendHours}</p>
              </div>
            </div>
          </div>
          <div className="pt-8 text-center text-sm opacity-60">
            <p>&copy; 2026 {settings.storeName}. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <Cart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
      />

      <Checkout
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={cartItems}
        onOrderComplete={handleOrderComplete}
      />

      <OrderHistory
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        orders={orders}
        onUpdateStatus={updateOrderStatus}
      />

      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        products={availableProducts}
        onAddToCart={addToCart}
      />
    </div>
  );
}
