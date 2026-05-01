import { useEffect, useRef, useState } from 'react';
import { Search, X, Plus, Package } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  coffee: 'Coffee',
  food: 'Food',
  pastries: 'Pastries',
  beverages: 'Beverages',
};

export function SearchModal({ isOpen, onClose, products, onAddToCart }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [added, setAdded] = useState<Set<number>>(new Set());

  const filtered = query.trim().length > 0
    ? products.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        CATEGORY_LABELS[p.category]?.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  // Group by category
  const grouped = filtered.reduce<Record<string, Product[]>>((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {});

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setAdded(new Set());
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const handleAdd = (product: Product) => {
    onAddToCart(product);
    setAdded((prev) => new Set(prev).add(product.id));
    setTimeout(() => {
      setAdded((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Search Panel */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-2xl rounded-b-3xl overflow-hidden max-h-[85vh] flex flex-col">
        {/* Search Input */}
        <div className="flex items-center gap-4 px-6 py-5 border-b border-gray-100">
          <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search menu — coffee, pastries, food…"
            className="flex-1 outline-none text-lg bg-transparent placeholder-gray-300"
          />
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          {query.trim().length === 0 ? (
            <div className="px-6 py-10 text-center text-gray-400">
              <Search className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <p>Start typing to search the menu</p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {['Coffee', 'Pastries', 'Food', 'Beverages'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setQuery(cat)}
                    className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-600 transition-colors"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="px-6 py-10 text-center text-gray-400">
              <Package className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <p>No results for "<span className="text-gray-600">{query}</span>"</p>
              <p className="text-sm mt-1 text-gray-300">Try a different keyword</p>
            </div>
          ) : (
            <div className="px-6 py-4 space-y-6">
              {Object.entries(grouped).map(([category, items]) => (
                <div key={category}>
                  <p className="text-xs tracking-widest uppercase text-gray-400 mb-3">
                    {CATEGORY_LABELS[category]}
                  </p>
                  <div className="space-y-2">
                    {items.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors group"
                      >
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p>{product.name}</p>
                          <p className="text-sm text-gray-400 truncate">{product.description}</p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="text-sm">₱{product.price}</span>
                          <button
                            onClick={() => handleAdd(product)}
                            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-sm ${
                              added.has(product.id)
                                ? 'bg-green-500 text-white scale-95'
                                : 'bg-black text-white hover:bg-black/80'
                            }`}
                          >
                            {added.has(product.id) ? (
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <Plus className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <p className="text-center text-sm text-gray-300 pb-2">
                {filtered.length} result{filtered.length !== 1 ? 's' : ''} found
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
