import { Plus, Tag, Layers, Star } from 'lucide-react';
import { type Product } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="group cursor-pointer bg-white shadow-sm hover:shadow-xl transition-all rounded-[2rem] overflow-hidden">
      <div className="aspect-square bg-gray-100 relative overflow-hidden">
        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
          {product.display_type === 'set' && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-purple-600 text-white shadow-md">
              <Layers className="w-3 h-3" /> Combo Set
            </span>
          )}
          {product.is_promo && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-red-600 text-white shadow-md">
              <Tag className="w-3 h-3" /> Save Big
            </span>
          )}
          {product.is_featured && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-amber-500 text-white shadow-md">
              <Star className="w-3 h-3" fill="currentColor" /> Popular
            </span>
          )}
        </div>

        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="text-lg leading-snug">{product.name}</h3>
          <div className="flex flex-col items-end flex-shrink-0">
            {product.promo_price ? (
              <>
                <span className="text-xs line-through text-gray-400">₱{product.price}</span>
                <span className="text-sm font-semibold text-red-600">₱{product.promo_price}</span>
              </>
            ) : (
              <span className="text-sm font-medium">₱{product.price}</span>
            )}
          </div>
        </div>

        <p className="text-sm opacity-60 mb-4 line-clamp-2 min-h-[2.5rem]">{product.description}</p>

        <button
          onClick={() => onAddToCart(product)}
          className="w-full py-3 bg-black text-white hover:bg-black/80 transition-all flex items-center justify-center gap-2 rounded-full shadow-md hover:shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
