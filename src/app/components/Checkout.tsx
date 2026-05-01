import { useState } from 'react';
import { X, ChevronRight, ChevronLeft, MapPin, Phone, Mail, User, Check, Package, Truck, CreditCard, Smartphone, Banknote, Store } from 'lucide-react';
import type { SavedOrder } from './OrderHistory';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderComplete: (order: SavedOrder) => void;
}

type DeliveryType = 'delivery' | 'pickup';
type PaymentMethod = 'cod' | 'gcash' | 'card';

interface OrderDetails {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  notes: string;
  deliveryType: DeliveryType;
  paymentMethod: PaymentMethod;
}

const DELIVERY_FEE = 49;
const STEPS = ['Review Order', 'Delivery Details', 'Payment', 'Confirmation'];

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((step, index) => (
        <div key={step} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all duration-300 ${
                index < currentStep
                  ? 'bg-black text-white'
                  : index === currentStep
                  ? 'bg-black text-white ring-4 ring-black/20'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
            </div>
            <span
              className={`text-xs mt-1 whitespace-nowrap hidden sm:block transition-colors ${
                index <= currentStep ? 'text-black' : 'text-gray-400'
              }`}
            >
              {step}
            </span>
          </div>
          {index < STEPS.length - 1 && (
            <div
              className={`w-10 sm:w-16 h-px mx-1 mb-4 sm:mb-5 transition-colors duration-300 ${
                index < currentStep ? 'bg-black' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function OrderReview({ items, deliveryType, onNext, onBack }: {
  items: CartItem[];
  deliveryType: DeliveryType;
  onNext: () => void;
  onBack: () => void;
}) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = deliveryType === 'delivery' ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Package className="w-6 h-6" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate">{item.name}</p>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
            </div>
            <p className="flex-shrink-0">₱{item.price * item.quantity}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-3 border-t border-gray-100 pt-4">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span>₱{subtotal}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Delivery Fee</span>
          <span>{deliveryType === 'pickup' ? <span className="text-green-600">Free</span> : `₱${DELIVERY_FEE}`}</span>
        </div>
        <div className="flex justify-between text-lg border-t border-gray-100 pt-3">
          <span>Total</span>
          <span>₱{total}</span>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 border border-black/20 hover:border-black transition-colors rounded-full flex items-center justify-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Cart
        </button>
        <button
          onClick={onNext}
          className="flex-1 py-3 bg-black text-white hover:bg-black/80 transition-all rounded-full flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
        >
          Continue
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function DeliveryDetails({ details, onChange, onNext, onBack }: {
  details: OrderDetails;
  onChange: (field: keyof OrderDetails, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const isValid =
    details.name.trim() &&
    details.phone.trim() &&
    details.email.trim() &&
    (details.deliveryType === 'pickup' || details.address.trim());

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-5">
        {/* Delivery Type Toggle */}
        <div className="flex gap-3">
          <button
            onClick={() => onChange('deliveryType', 'delivery')}
            className={`flex-1 py-3 px-4 rounded-2xl border-2 transition-all flex items-center justify-center gap-2 ${
              details.deliveryType === 'delivery'
                ? 'border-black bg-black text-white'
                : 'border-gray-200 hover:border-gray-400'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span className="text-sm">Delivery</span>
          </button>
          <button
            onClick={() => onChange('deliveryType', 'pickup')}
            className={`flex-1 py-3 px-4 rounded-2xl border-2 transition-all flex items-center justify-center gap-2 ${
              details.deliveryType === 'pickup'
                ? 'border-black bg-black text-white'
                : 'border-gray-200 hover:border-gray-400'
            }`}
          >
            <Store className="w-4 h-4" />
            <span className="text-sm">Pick Up</span>
          </button>
        </div>

        {details.deliveryType === 'pickup' && (
          <div className="bg-gray-50 rounded-2xl p-4 flex gap-3">
            <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm">Fabella Coffee — Main Branch</p>
              <p className="text-sm text-gray-500">123 Café Street, Makati City</p>
              <p className="text-sm text-gray-500 mt-1">Mon–Fri: 6am–10pm · Sat–Sun: 7am–11pm</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Full Name *"
              value={details.name}
              onChange={(e) => onChange('name', e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="tel"
              placeholder="Phone Number *"
              value={details.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              placeholder="Email Address *"
              value={details.email}
              onChange={(e) => onChange('email', e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-black transition-colors"
            />
          </div>

          {details.deliveryType === 'delivery' && (
            <>
              <div className="relative">
                <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                <textarea
                  placeholder="Delivery Address *"
                  value={details.address}
                  onChange={(e) => onChange('address', e.target.value)}
                  rows={2}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-black transition-colors resize-none"
                />
              </div>

              <input
                type="text"
                placeholder="City / Municipality"
                value={details.city}
                onChange={(e) => onChange('city', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-black transition-colors"
              />
            </>
          )}

          <textarea
            placeholder="Order notes (optional)"
            value={details.notes}
            onChange={(e) => onChange('notes', e.target.value)}
            rows={2}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-black transition-colors resize-none"
          />
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 border border-black/20 hover:border-black transition-colors rounded-full flex items-center justify-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          className="flex-1 py-3 bg-black text-white hover:bg-black/80 disabled:opacity-40 disabled:cursor-not-allowed transition-all rounded-full flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
        >
          Continue
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function PaymentStep({ details, items, onChange, onNext, onBack }: {
  details: OrderDetails;
  items: CartItem[];
  onChange: (field: keyof OrderDetails, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = details.deliveryType === 'delivery' ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  const paymentOptions: { value: PaymentMethod; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      value: 'cod',
      label: 'Cash on Delivery',
      icon: <Banknote className="w-5 h-5" />,
      desc: 'Pay with cash when your order arrives',
    },
    {
      value: 'gcash',
      label: 'GCash',
      icon: <Smartphone className="w-5 h-5" />,
      desc: 'Send payment via GCash mobile wallet',
    },
    {
      value: 'card',
      label: 'Credit / Debit Card',
      icon: <CreditCard className="w-5 h-5" />,
      desc: 'Visa, Mastercard, and more',
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4">
        <p className="text-sm text-gray-500 mb-2">Select your payment method</p>

        {paymentOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange('paymentMethod', option.value)}
            className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-start gap-4 ${
              details.paymentMethod === option.value
                ? 'border-black bg-black text-white'
                : 'border-gray-200 hover:border-gray-400'
            }`}
          >
            <div className={`mt-0.5 ${details.paymentMethod === option.value ? 'text-white' : 'text-gray-500'}`}>
              {option.icon}
            </div>
            <div>
              <p>{option.label}</p>
              <p className={`text-sm mt-0.5 ${details.paymentMethod === option.value ? 'text-white/70' : 'text-gray-400'}`}>
                {option.desc}
              </p>
            </div>
            <div className="ml-auto flex-shrink-0 mt-0.5">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                details.paymentMethod === option.value ? 'border-white' : 'border-gray-300'
              }`}>
                {details.paymentMethod === option.value && (
                  <div className="w-2.5 h-2.5 rounded-full bg-white" />
                )}
              </div>
            </div>
          </button>
        ))}

        {details.paymentMethod === 'gcash' && (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
            <p className="text-sm text-blue-800">After placing your order, send payment to:</p>
            <p className="text-blue-900 mt-1">GCash: <span>+63 917 123 4567</span></p>
            <p className="text-sm text-blue-600 mt-1">Name: Fabella Coffee</p>
          </div>
        )}

        {details.paymentMethod === 'card' && (
          <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
            <input
              type="text"
              placeholder="Card Number"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors text-sm"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="MM / YY"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors text-sm"
              />
              <input
                type="text"
                placeholder="CVV"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors text-sm"
              />
            </div>
            <input
              type="text"
              placeholder="Cardholder Name"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors text-sm"
            />
            <p className="text-xs text-gray-400 text-center">Demo only — no actual payment is processed.</p>
          </div>
        )}

        <div className="mt-4 bg-gray-50 rounded-2xl p-4 space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span>₱{subtotal}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Delivery</span>
            <span>{details.deliveryType === 'pickup' ? <span className="text-green-600">Free</span> : `₱${DELIVERY_FEE}`}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-200">
            <span>Total</span>
            <span>₱{total}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 border border-black/20 hover:border-black transition-colors rounded-full flex items-center justify-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 py-3 bg-black text-white hover:bg-black/80 transition-all rounded-full flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
        >
          Place Order
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function OrderConfirmation({ details, items, orderNumber, onClose }: {
  details: OrderDetails;
  items: CartItem[];
  orderNumber: string;
  onClose: () => void;
}) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = details.deliveryType === 'delivery' ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  const paymentLabels: Record<PaymentMethod, string> = {
    cod: 'Cash on Delivery',
    gcash: 'GCash',
    card: 'Credit / Debit Card',
  };

  const estTime = details.deliveryType === 'delivery' ? '30–50 minutes' : '15–20 minutes';

  return (
    <div className="flex flex-col h-full items-center">
      <div className="flex-1 overflow-y-auto w-full">
        {/* Success Icon */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-black flex items-center justify-center mb-4 shadow-lg">
            <Check className="w-10 h-10 text-white" strokeWidth={2.5} />
          </div>
          <h3 className="text-2xl mb-1">Order Placed!</h3>
          <p className="text-gray-500 text-sm">Thank you, {details.name.split(' ')[0]}!</p>
        </div>

        {/* Order Number */}
        <div className="bg-gray-50 rounded-2xl p-5 mb-5 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Order Number</p>
          <p className="text-2xl tracking-widest">{orderNumber}</p>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 rounded-2xl p-5 mb-5 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Delivery Type</span>
            <span className="capitalize">{details.deliveryType === 'pickup' ? 'Store Pick Up' : 'Delivery'}</span>
          </div>
          {details.deliveryType === 'delivery' && details.address && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Address</span>
              <span className="text-right max-w-[60%]">{details.address}{details.city ? `, ${details.city}` : ''}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Payment</span>
            <span>{paymentLabels[details.paymentMethod]}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Est. Time</span>
            <span>{estTime}</span>
          </div>
          <div className="flex justify-between text-sm border-t border-gray-200 pt-3">
            <span className="text-gray-500">Total Paid</span>
            <span>₱{total}</span>
          </div>
        </div>

        {/* Items */}
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm py-2 border-b border-gray-100 last:border-0">
              <span>{item.name} <span className="text-gray-400">×{item.quantity}</span></span>
              <span>₱{item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        <p className="text-sm text-gray-400 text-center mt-6">
          A confirmation will be sent to {details.email}
        </p>
      </div>

      <button
        onClick={onClose}
        className="mt-6 w-full py-3 bg-black text-white hover:bg-black/80 transition-all rounded-full shadow-md hover:shadow-lg"
      >
        Back to Menu
      </button>
    </div>
  );
}

function generateOrderNumber() {
  return `FC-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 900 + 100)}`;
}

export function Checkout({ isOpen, onClose, items, onOrderComplete }: CheckoutProps) {
  const [step, setStep] = useState(0);
  const [orderNumber, setOrderNumber] = useState('');
  const [details, setDetails] = useState<OrderDetails>({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    notes: '',
    deliveryType: 'delivery',
    paymentMethod: 'cod',
  });

  const handleChange = (field: keyof OrderDetails, value: string) => {
    setDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = () => {
    const num = generateOrderNumber();
    setOrderNumber(num);
    setStep(3);
  };

  const handleClose = () => {
    if (step === 3) {
      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const deliveryFee = details.deliveryType === 'delivery' ? DELIVERY_FEE : 0;
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-PH', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      });
      onOrderComplete({
        orderNumber,
        date: dateStr,
        items: items.map((i) => ({
          id: i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
        })),
        subtotal,
        deliveryFee,
        total: subtotal + deliveryFee,
        deliveryType: details.deliveryType,
        paymentMethod: details.paymentMethod,
        name: details.name,
        address: details.address,
        city: details.city,
        status: 'pending',
      });
    }
    onClose();
    setStep(0);
    setDetails({
      name: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      notes: '',
      deliveryType: 'delivery',
      paymentMethod: 'cod',
    });
  };

  if (!isOpen) return null;

  const stepTitles = ['Review Order', 'Delivery Details', 'Payment', 'Order Confirmed'];

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" onClick={step < 3 ? handleClose : undefined} />

      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white z-50 shadow-2xl flex flex-col rounded-l-3xl">
        {/* Header */}
        <div className="p-6 flex justify-between items-center border-b border-gray-100">
          <div>
            <h2 className="text-xl">Checkout</h2>
            <p className="text-sm text-gray-400 mt-0.5">{stepTitles[step]}</p>
          </div>
          <button onClick={handleClose} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 pt-6">
          <StepIndicator currentStep={step} />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden px-6 pb-6 flex flex-col">
          {step === 0 && (
            <OrderReview
              items={items}
              deliveryType={details.deliveryType}
              onNext={() => setStep(1)}
              onBack={handleClose}
            />
          )}
          {step === 1 && (
            <DeliveryDetails
              details={details}
              onChange={handleChange}
              onNext={() => setStep(2)}
              onBack={() => setStep(0)}
            />
          )}
          {step === 2 && (
            <PaymentStep
              details={details}
              items={items}
              onChange={handleChange}
              onNext={handlePlaceOrder}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <OrderConfirmation
              details={details}
              items={items}
              orderNumber={orderNumber}
              onClose={handleClose}
            />
          )}
        </div>
      </div>
    </>
  );
}