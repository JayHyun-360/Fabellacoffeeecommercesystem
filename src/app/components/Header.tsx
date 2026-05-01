import { ShoppingCart, Menu, X, Search, History } from 'lucide-react';
import { useState } from 'react';
import logoImg from '../../imports/682349994_793900143580024_743914547050463231_n.png';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  onHistoryClick: () => void;
  onSearchClick: () => void;
}

export function Header({ cartCount, onCartClick, onHistoryClick, onSearchClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-10">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 flex-shrink-0">
            <img
              src={logoImg}
              alt="Fabella Coffee"
              className="h-14 w-14 object-contain"
            />
            <span className="text-xl tracking-tight font-medium">FABELLA COFFEE</span>
          </a>

          <nav className="hidden md:flex gap-8">
            <a href="#coffee" className="hover:opacity-60 transition-opacity text-sm">Coffee</a>
            <a href="#food" className="hover:opacity-60 transition-opacity text-sm">Food</a>
            <a href="#pastries" className="hover:opacity-60 transition-opacity text-sm">Pastries</a>
            <a href="#beverages" className="hover:opacity-60 transition-opacity text-sm">Beverages</a>
          </nav>
        </div>

        <div className="flex items-center gap-5">
          {/* Search */}
          <button
            onClick={onSearchClick}
            className="hover:opacity-60 transition-opacity hidden md:flex items-center gap-2 text-sm text-gray-500 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full"
          >
            <Search className="w-4 h-4" />
            <span className="hidden lg:block">Search menu…</span>
          </button>

          {/* Mobile search icon */}
          <button
            onClick={onSearchClick}
            className="md:hidden hover:opacity-60 transition-opacity"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Order History */}
          <button
            onClick={onHistoryClick}
            className="hover:opacity-60 transition-opacity"
            title="Order History"
          >
            <History className="w-5 h-5" />
          </button>

          {/* Cart */}
          <button
            onClick={onCartClick}
            className="relative hover:opacity-60 transition-opacity"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="md:hidden px-6 py-4 flex flex-col gap-4 bg-gray-50/80 backdrop-blur-sm border-t border-gray-100">
          <a href="#coffee" onClick={() => setMobileMenuOpen(false)} className="hover:opacity-60 transition-opacity py-2">Coffee</a>
          <a href="#food" onClick={() => setMobileMenuOpen(false)} className="hover:opacity-60 transition-opacity py-2">Food</a>
          <a href="#pastries" onClick={() => setMobileMenuOpen(false)} className="hover:opacity-60 transition-opacity py-2">Pastries</a>
          <a href="#beverages" onClick={() => setMobileMenuOpen(false)} className="hover:opacity-60 transition-opacity py-2">Beverages</a>
        </nav>
      )}
    </header>
  );
}
