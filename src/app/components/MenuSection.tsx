import { ProductCard } from './ProductCard';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
}

interface MenuSectionProps {
  id: string;
  title: string;
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export function MenuSection({ id, title, products, onAddToCart }: MenuSectionProps) {
  return (
    <section id={id} className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl mb-4">{title}</h2>
          <div className="w-16 h-px bg-black mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
