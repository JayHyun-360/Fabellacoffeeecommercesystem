import { Plus } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="group cursor-pointer bg-white shadow-sm hover:shadow-xl transition-all rounded-[2rem] overflow-hidden">
      <div className="aspect-square bg-gray-100 relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg">{product.name}</h3>
          <span className="text-sm">₱{product.price}</span>
        </div>

        <p className="text-sm opacity-60 mb-4">{product.description}</p>

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
