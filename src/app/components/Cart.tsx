import { X, Minus, Plus, ShoppingBag } from 'lucide-react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}

export function Cart({ isOpen, onClose, items, onUpdateQuantity, onRemove }: CartProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col rounded-l-3xl">
        <div className="p-6 bg-gray-50/50 flex justify-between items-center">
          <h2 className="text-xl">Your Cart</h2>
          <button onClick={onClose} className="hover:opacity-60 transition-opacity">
            <X className="w-6 h-6" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <ShoppingBag className="w-16 h-16 opacity-20 mb-4" />
            <p className="opacity-60">Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4">
                    <div className="w-20 h-20 bg-gray-100 flex items-center justify-center rounded-3xl shadow-sm">
                      <span className="text-2xl opacity-20">☕</span>
                    </div>

                    <div className="flex-1">
                      <h3 className="mb-2">{item.name}</h3>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 border border-black/20 hover:bg-black hover:text-white transition-colors flex items-center justify-center rounded-full"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 border border-black/20 hover:bg-black hover:text-white transition-colors flex items-center justify-center rounded-full"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="mb-2">₱{(item.price * item.quantity)}</p>
                      <button
                        onClick={() => onRemove(item.id)}
                        className="text-sm opacity-60 hover:opacity-100 transition-opacity"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50/50 p-6 space-y-4">
              <div className="flex justify-between text-xl">
                <span>Total</span>
                <span>₱{total}</span>
              </div>

              <button className="w-full py-3 bg-black text-white hover:bg-black/80 transition-all rounded-full shadow-md hover:shadow-lg">
                Proceed to Checkout
              </button>

              <button
                onClick={onClose}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 transition-all rounded-full"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
