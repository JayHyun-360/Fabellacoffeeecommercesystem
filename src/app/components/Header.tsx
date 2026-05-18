import { ShoppingCart, Menu, X, Search, History, Users2, Coffee, ShieldCheck, ChevronRight, LogIn, LogOut, User } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import logoImg from '../../imports/682349994_793900143580024_743914547050463231_n.png';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  cartCount: number;
  onCartClick?: () => void;
  onHistoryClick: () => void;
  onSearchClick: () => void;
}

export function Header({ cartCount, onCartClick, onHistoryClick, onSearchClick }: HeaderProps) {
  const router = useRouter();
  const { user, isAdmin, isStaff, isAnonymous, loginWithGoogle, linkGoogle, logout } = useAuth();
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
    <>
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

          {/* Cart — Hidden on mobile, hidden for admin preview */}
          {onCartClick && (
            <button onClick={onCartClick} className="hidden md:block relative hover:opacity-60 transition-opacity">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* Auth / Access Switcher */}
          <div className="relative" ref={accessRef}>
            <button
              onClick={() => setAccessOpen(!accessOpen)}
              title={user ? (user.user_metadata?.full_name ?? user.email ?? 'Account') : 'Sign In'}
              className={`w-9 h-9 flex items-center justify-center rounded-full transition-all overflow-hidden ${
                accessOpen ? 'bg-black text-white ring-2 ring-black/20' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
            >
              {user?.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : user && !isAnonymous ? (
                <User className="w-[18px] h-[18px]" />
              ) : (
                <Users2 className="w-[18px] h-[18px]" />
              )}
            </button>
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

            {onCartClick && (
              <button onClick={() => { onCartClick(); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 hover:opacity-60 transition-opacity py-2 relative">
                <ShoppingCart className="w-5 h-5" /><span>Cart</span>
                {cartCount > 0 && (
                  <span className="ml-auto bg-black text-white text-xs px-2 py-1 rounded-full">{cartCount}</span>
                )}
              </button>
            )}

            {/* Auth actions (mobile) */}
            {!user ? (
              <button onClick={() => { loginWithGoogle(); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 py-2 hover:opacity-60 transition-opacity">
                <LogIn className="w-5 h-5" /><span className="text-sm">Sign in with Google</span>
              </button>
            ) : isAnonymous ? (
              <button onClick={() => { linkGoogle(); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 py-2 hover:opacity-60 transition-opacity text-blue-600">
                <LogIn className="w-5 h-5" /><span className="text-sm">Link Google Account</span>
              </button>
            ) : null}

            {/* Portal links (mobile) — only for staff/admin, hidden from customers */}
            {isStaff && (
              <div className="border-t border-gray-100 pt-2 mt-1">
                <button onClick={() => { router.push('/staff'); setMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 py-2 hover:opacity-60 transition-opacity">
                  <Coffee className="w-5 h-5 text-blue-500" /><span className="text-sm">Staff Portal</span>
                </button>
              </div>
            )}
            {isAdmin && (
              <div className="border-t border-gray-100 pt-2 mt-1">
                <button onClick={() => { router.push('/admin'); setMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 py-2 hover:opacity-60 transition-opacity">
                  <ShieldCheck className="w-5 h-5 text-purple-500" /><span className="text-sm">Admin Panel</span>
                </button>
              </div>
            )}

            {user && (
              <button onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 py-2 hover:opacity-60 transition-opacity text-red-600">
                <LogOut className="w-5 h-5" /><span className="text-sm">Sign Out</span>
              </button>
            )}
          </div>
        </nav>
      )}
    </header>

      {accessOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={() => setAccessOpen(false)}
        >
          <div 
            className="bg-white rounded-[32px] shadow-2xl border border-gray-100/50 w-full max-w-sm overflow-hidden z-50 relative p-6 flex flex-col text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button 
              onClick={() => setAccessOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon & Title */}
            <div className="text-center pt-2 pb-4">
              <div className="mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                <User className="w-6 h-6 text-gray-800" />
              </div>
              <h3 className="text-lg font-semibold tracking-tight text-gray-900">
                {user ? 'My Account' : 'Welcome to Fabella Coffee'}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {user ? 'Manage your account details and portals' : 'Sign in or explore our menu'}
              </p>
            </div>

            {/* Content space */}
            <div className="space-y-4">
              {/* User info */}
              {user && !isAnonymous ? (
                <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3.5 border border-gray-100">
                  {user.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="" className="w-11 h-11 rounded-full border border-gray-200" />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center font-medium text-sm">
                      {user.user_metadata?.full_name?.[0]?.toUpperCase() ?? user.email?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-950 truncate text-sm leading-tight">{user.user_metadata?.full_name ?? 'User'}</p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
                  </div>
                </div>
              ) : user && isAnonymous ? (
                <div className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100 space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Browsing as Guest</p>
                    <p className="text-xs text-gray-400 mt-0.5">Link your Google account to sync orders permanently</p>
                  </div>
                  <button
                    onClick={() => { linkGoogle(); setAccessOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-2xl text-sm font-medium hover:bg-blue-100 transition-all hover:scale-[1.02]"
                  >
                    <LogIn className="w-4 h-4" /> Link Google Account
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={() => { loginWithGoogle(); setAccessOpen(false); }}
                    className="w-full flex items-center justify-center gap-2.5 px-4 py-3 bg-black text-white rounded-2xl text-sm font-medium hover:bg-black/90 transition-all hover:scale-[1.02] shadow-lg shadow-black/10"
                  >
                    <LogIn className="w-4 h-4" /> Sign in with Google
                  </button>
                </div>
              )}

              {/* Portal links — only for staff and admin, hidden from customers */}
              {(isStaff || isAdmin) && (
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider pl-1">Portals</p>
                  {isStaff && (
                    <button
                      onClick={() => { router.push('/staff'); setAccessOpen(false); }}
                      className="w-full flex items-center gap-3 p-2.5 rounded-2xl hover:bg-gray-50 transition-all text-left border border-transparent hover:border-gray-100 group"
                    >
                      <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Coffee className="w-4.5 h-4.5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800">Staff Portal</p>
                        <p className="text-[11px] text-gray-400">Track orders & preparation</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </button>
                  )}
                  {isAdmin && (
                    <button
                      onClick={() => { router.push('/admin'); setAccessOpen(false); }}
                      className="w-full flex items-center gap-3 p-2.5 rounded-2xl hover:bg-gray-50 transition-all text-left border border-transparent hover:border-gray-100 group"
                    >
                      <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <ShieldCheck className="w-4.5 h-4.5 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800">Admin Panel</p>
                        <p className="text-[11px] text-gray-400">Manage products, roles & settings</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </button>
                  )}
                </div>
              )}

              {/* Sign out */}
              {user && (
                <button
                  onClick={() => { logout(); setAccessOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 p-3 mt-2 rounded-2xl text-red-600 hover:bg-red-50 transition-all text-sm font-medium border border-transparent hover:border-red-100"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              )}
            </div>

            <div className="mt-5 pt-3.5 border-t border-gray-100 text-center">
              <p className="text-[10px] text-gray-400 font-medium tracking-wide">
                Currently viewing: Customer Store
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
