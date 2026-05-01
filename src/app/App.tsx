import { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { MenuSection } from './components/MenuSection';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { OrderHistory } from './components/OrderHistory';
import { SearchModal } from './components/SearchModal';
import type { SavedOrder } from './components/OrderHistory';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

const products: Product[] = [
  { id: 1, name: 'Espresso', description: 'Rich and bold single shot', price: 85, category: 'coffee', image: 'https://images.unsplash.com/photo-1528401635478-821b5f89ff94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBlc3ByZXNzbyUyMGN1cHxlbnwxfHx8fDE3Nzc0NjkyMjB8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 2, name: 'Cappuccino', description: 'Espresso with steamed milk foam', price: 120, category: 'coffee', image: 'https://images.unsplash.com/photo-1645445644664-8f44112f334c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxjb2ZmZWUlMjBlc3ByZXNzbyUyMGN1cHxlbnwxfHx8fDE3Nzc0NjkyMjB8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 3, name: 'Flat White', description: 'Smooth microfoam perfection', price: 135, category: 'coffee', image: 'https://images.unsplash.com/photo-1612871616386-b0346398949d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxjb2ZmZWUlMjBlc3ByZXNzbyUyMGN1cHxlbnwxfHx8fDE3Nzc0NjkyMjB8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 4, name: 'Cold Brew', description: 'Smooth, cold-steeped coffee', price: 145, category: 'coffee', image: 'https://images.unsplash.com/photo-1637178628249-215e78e3c716?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxjb2ZmZWUlMjBlc3ByZXNzbyUyMGN1cHxlbnwxfHx8fDE3Nzc0NjkyMjB8MA&ixlib=rb-4.1.0&q=80&w=1080' },

  { id: 5, name: 'Avocado Toast', description: 'Sourdough with fresh avocado', price: 185, category: 'food', image: 'https://images.unsplash.com/photo-1676471970358-1cff04452e7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdm9jYWRvJTIwdG9hc3QlMjBicmVha2Zhc3R8ZW58MXx8fHwxNzc3NDY5MjIxfDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 6, name: 'Breakfast Burrito', description: 'Eggs, cheese, and chorizo', price: 165, category: 'food', image: 'https://images.unsplash.com/photo-1609158087148-3bae840bcfda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxhdm9jYWRvJTIwdG9hc3QlMjBicmVha2Zhc3R8ZW58MXx8fHwxNzc3NDY5MjIxfDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 7, name: 'Caesar Salad', description: 'Classic with parmesan', price: 155, category: 'food', image: 'https://images.unsplash.com/photo-1616902685816-fbe1aeb3ea79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxhdm9jYWRvJTIwdG9hc3QlMjBicmVha2Zhc3R8ZW58MXx8fHwxNzc3NDY5MjIxfDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 8, name: 'Grilled Sandwich', description: 'Turkey and swiss on rye', price: 175, category: 'food', image: 'https://images.unsplash.com/photo-1616902666559-af398792d890?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxhdm9jYWRvJTIwdG9hc3QlMjBicmVha2Zhc3R8ZW58MXx8fHwxNzc3NDY5MjIxfDA&ixlib=rb-4.1.0&q=80&w=1080' },

  { id: 9, name: 'Croissant', description: 'Buttery and flaky', price: 65, category: 'pastries', image: 'https://images.unsplash.com/photo-1751151856149-5ebf1d21586a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcm9pc3NhbnQlMjBwYXN0cnklMjBiYWtlcnl8ZW58MXx8fHwxNzc3NDY5MjIxfDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 10, name: 'Blueberry Muffin', description: 'Fresh baked daily', price: 55, category: 'pastries', image: 'https://images.unsplash.com/photo-1571157577110-493b325fdd3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxjcm9pc3NhbnQlMjBwYXN0cnklMjBiYWtlcnl8ZW58MXx8fHwxNzc3NDY5MjIxfDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 11, name: 'Chocolate Brownie', description: 'Rich and fudgy', price: 75, category: 'pastries', image: 'https://images.unsplash.com/photo-1737700088850-d0b53f9d39ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxjcm9pc3NhbnQlMjBwYXN0cnklMjBiYWtlcnl8ZW58MXx8fHwxNzc3NDY5MjIxfDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 12, name: 'Almond Scone', description: 'Light and crumbly', price: 70, category: 'pastries', image: 'https://images.unsplash.com/photo-1712723246766-3eaea22e52ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxjcm9pc3NhbnQlMjBwYXN0cnklMjBiYWtlcnl8ZW58MXx8fHwxNzc3NDY5MjIxfDA&ixlib=rb-4.1.0&q=80&w=1080' },

  { id: 13, name: 'Matcha Latte', description: 'Ceremonial grade matcha', price: 150, category: 'beverages', image: 'https://images.unsplash.com/photo-1708572727896-117b5ea25a86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXRjaGElMjBsYXR0ZSUyMHRlYXxlbnwxfHx8fDE3Nzc0NjkyMjF8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 14, name: 'Chai Tea', description: 'Spiced black tea latte', price: 115, category: 'beverages', image: 'https://images.unsplash.com/photo-1708572808503-48242f5c9a89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxtYXRjaGElMjBsYXR0ZSUyMHRlYXxlbnwxfHx8fDE3Nzc0NjkyMjF8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 15, name: 'Fresh Orange Juice', description: 'Squeezed to order', price: 95, category: 'beverages', image: 'https://images.unsplash.com/photo-1727850005779-1e24cac382d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxtYXRjaGElMjBsYXR0ZSUyMHRlYXxlbnwxfHx8fDE3Nzc0NjkyMjF8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 16, name: 'Hot Chocolate', description: 'Rich Belgian chocolate', price: 125, category: 'beverages', image: 'https://images.unsplash.com/photo-1727850005809-d575cdcac28c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxtYXRjaGElMjBsYXR0ZSUyMHRlYXxlbnwxfHx8fDE3Nzc0NjkyMjF8MA&ixlib=rb-4.1.0&q=80&w=1080' },
];

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orderHistory, setOrderHistory] = useState<SavedOrder[]>([]);

  const addToCart = (product: Product) => {
    setCartItems((items) => {
      const existing = items.find((item) => item.id === product.id);
      if (existing) {
        return items.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
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
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
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
    setOrderHistory((prev) => [...prev, order]);
  };

  const handleUpdateOrderStatus = (orderNumber: string, newStatus: SavedOrder['status']) => {
    setOrderHistory((prev) =>
      prev.map((order) =>
        order.orderNumber === orderNumber
          ? { ...order, status: newStatus }
          : order
      )
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
        onHistoryClick={() => setHistoryOpen(true)}
        onSearchClick={() => setSearchOpen(true)}
      />

      <Hero />

      <MenuSection
        id="coffee"
        title="Coffee"
        products={products.filter((p) => p.category === 'coffee')}
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
        products={products.filter((p) => p.category === 'food')}
        onAddToCart={addToCart}
      />

      <MenuSection
        id="pastries"
        title="Pastries"
        products={products.filter((p) => p.category === 'pastries')}
        onAddToCart={addToCart}
      />

      <MenuSection
        id="beverages"
        title="Beverages"
        products={products.filter((p) => p.category === 'beverages')}
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
                <p>Coffee</p>
                <p>Food</p>
                <p>Pastries</p>
                <p>Beverages</p>
              </div>
            </div>
            <div>
              <h4 className="mb-4">Contact</h4>
              <div className="space-y-2 text-sm opacity-60">
                <p>hello@fabella.com</p>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>
            <div>
              <h4 className="mb-4">Hours</h4>
              <div className="space-y-2 text-sm opacity-60">
                <p>Mon-Fri: 6am - 10pm</p>
                <p>Sat-Sun: 7am - 11pm</p>
              </div>
            </div>
          </div>

          <div className="pt-8 text-center text-sm opacity-60">
            <p>&copy; 2026 Fabella Coffee. All rights reserved.</p>
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
        orders={orderHistory}
        onUpdateStatus={handleUpdateOrderStatus}
      />

      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        products={products}
        onAddToCart={addToCart}
      />
    </div>
  );
}