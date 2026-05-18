import { ShoppingCart, Menu, X, Search, History, Users2, Coffee, ShieldCheck, ChevronRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import logoImg from '../../imports/682349994_793900143580024_743914547050463231_n.png';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  onHistoryClick: () => void;
  onSearchClick: () => void;
}

export function Header({ cartCount, onCartClick, onHistoryClick, onSearchClick }: HeaderProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accessOpen, setAccessOpen] = useState(false);
  const accessRef = useRef<HTMLDivElement>(null);

  // Close access popover when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (accessRef.current && !accessRef.current.contains(e.target as Node)) {
        setAccessOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-10">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 flex-shrink-0">
            <img src={typeof logoImg === 'string' ? logoImg : logoImg.src} alt="Fabella Coffee" className="h-14 w-14 object-contain" />
            <span className="text-sm tracking-tight font-medium">FABELLA COFFEE</span>
          </a>

          <nav className="hidden md:flex gap-8">
            <a href="#coffee" className="hover:opacity-60 transition-opacity text-sm">Coffee</a>
            <a href="#food" className="hover:opacity-60 transition-opacity text-sm">Food</a>
            <a href="#pastries" className="hover:opacity-60 transition-opacity text-sm">Pastries</a>
            <a href="#beverages" className="hover:opacity-60 transition-opacity text-sm">Beverages</a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <button
            onClick={onSearchClick}
            className="hover:opacity-60 transition-opacity hidden md:flex items-center gap-2 text-sm text-gray-500 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full"
          >
            <Search className="w-4 h-4" />
            <span className="hidden lg:block">Search menu…</span>
          </button>

          {/* Mobile search icon */}
          <button onClick={onSearchClick} className="md:hidden hover:opacity-60 transition-opacity">
            <Search className="w-5 h-5" />
          </button>

          {/* Order History — Hidden on mobile */}
          <button onClick={onHistoryClick} className="hidden md:block hover:opacity-60 transition-opacity" title="Order History">
            <History className="w-5 h-5" />
          </button>

          {/* Cart — Hidden on mobile */}
          <button onClick={onCartClick} className="hidden md:block relative hover:opacity-60 transition-opacity">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Access Switcher */}
          <div className="relative" ref={accessRef}>
            <button
              onClick={() => setAccessOpen(!accessOpen)}
              title="Switch Portal"
              className={`w-9 h-9 flex items-center justify-center rounded-full transition-all ${
                accessOpen ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
            >
              <Users2 className="w-4.5 h-4.5 w-[18px] h-[18px]" />
            </button>

            {accessOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                <div className="px-4 pt-4 pb-2">
                  <p className="text-xs text-gray-400 uppercase tracking-widest">Choose Access</p>
                </div>

                <div className="p-2 space-y-1">
                  <button
                    onClick={() => { router.push('/staff'); setAccessOpen(false); }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group text-left"
                  >
                    <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Coffee className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">Staff Portal</p>
                      <p className="text-xs text-gray-400">Track orders & deliveries</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                  </button>

                  <button
                    onClick={() => { router.push('/admin'); setAccessOpen(false); }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group text-left"
                  >
                    <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">Admin Panel</p>
                      <p className="text-xs text-gray-400">Manage store & settings</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                  </button>
                </div>

                <div className="px-4 py-3 border-t border-gray-50 bg-gray-50/50">
                  <p className="text-xs text-gray-400 text-center">Currently viewing: Customer Store</p>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
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

          <div className="border-t border-gray-200 pt-4 mt-2 space-y-1">
            <button onClick={() => { onHistoryClick(); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-3 hover:opacity-60 transition-opacity py-2">
              <History className="w-5 h-5" /><span>Order History</span>
            </button>

            <button onClick={() => { onCartClick(); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-3 hover:opacity-60 transition-opacity py-2 relative">
              <ShoppingCart className="w-5 h-5" /><span>Cart</span>
              {cartCount > 0 && (
                <span className="ml-auto bg-black text-white text-xs px-2 py-1 rounded-full">{cartCount}</span>
              )}
            </button>

            <div className="border-t border-gray-100 pt-2 mt-1">
              <p className="text-xs text-gray-400 mb-2 px-1">Switch Portal</p>
              <button onClick={() => { router.push('/staff'); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 py-2 hover:opacity-60 transition-opacity">
                <Coffee className="w-5 h-5 text-blue-500" /><span className="text-sm">Staff Portal</span>
              </button>
              <button onClick={() => { router.push('/admin'); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 py-2 hover:opacity-60 transition-opacity">
                <ShieldCheck className="w-5 h-5 text-purple-500" /><span className="text-sm">Admin Panel</span>
              </button>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
