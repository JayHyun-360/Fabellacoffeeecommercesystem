import { ShoppingCart, Menu, X, Search } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
}

export function Header({ cartCount, onCartClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <h1 className="text-2xl tracking-tight">FABELLA</h1>

          <nav className="hidden md:flex gap-8">
            <a href="#coffee" className="hover:opacity-60 transition-opacity">Coffee</a>
            <a href="#food" className="hover:opacity-60 transition-opacity">Food</a>
            <a href="#pastries" className="hover:opacity-60 transition-opacity">Pastries</a>
            <a href="#beverages" className="hover:opacity-60 transition-opacity">Beverages</a>
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <button className="hover:opacity-60 transition-opacity hidden md:block">
            <Search className="w-5 h-5" />
          </button>

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

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="md:hidden px-6 py-4 flex flex-col gap-4 bg-gray-50/80 backdrop-blur-sm">
          <a href="#coffee" className="hover:opacity-60 transition-opacity py-2">Coffee</a>
          <a href="#food" className="hover:opacity-60 transition-opacity py-2">Food</a>
          <a href="#pastries" className="hover:opacity-60 transition-opacity py-2">Pastries</a>
          <a href="#beverages" className="hover:opacity-60 transition-opacity py-2">Beverages</a>
        </nav>
      )}
    </header>
  );
}
