import { useState } from 'react';
import { ChevronDown, ShieldCheck, FileText, HelpCircle, X } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

export function CustomerLegalFAQ() {
  const [activeTab, setActiveTab] = useState<'faq' | 'terms' | 'privacy'>('faq');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const faqs: FAQItem[] = [
    {
      q: 'How do I place an order on Fabella?',
      a: 'Browse our menu of single products or combo sets, add items to your cart, click the Cart icon at the top right, and proceed to checkout. You can select Dine-In, Takeout, or Delivery.',
    },
    {
      q: 'What are the available payment methods?',
      a: 'We offer Cash on Delivery (COD), Cash on Pickup, and GCash payments. For GCash payments, the checkout system provides a secure GCash phone number and GCash QR Code so you can complete your transaction seamlessly.',
    },
    {
      q: 'Is my phone number required for all options?',
      a: 'No! To serve you with the fastest process, providing a phone number is optional for Dine-In orders. We only require a valid phone number for Delivery orders to ensure our riders can contact you upon arrival.',
    },
    {
      q: 'How does the GCash QR code payment work?',
      a: 'During checkout, if you select GCash, our system displays the official GCash number and a QR Code. Simply scan the QR code in your GCash app, pay the exact amount, and our staff will verify and process your order immediately.',
    },
    {
      q: 'Can I cancel or change my order?',
      a: 'Once an order is submitted and marked "Ongoing" (In Progress) by our staff, it cannot be cancelled or modified as preparation has already begun. If you need to cancel an order that is still "Pending", please call the store immediately.',
    },
  ];

  return (
    <>
      {/* Accordion / Preview Section for customer home screen */}
      <section className="py-20 px-6 bg-gray-50/50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 block mb-2">Support & Safety</span>
            <h2 className="text-3xl font-light text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="w-12 h-0.5 bg-black mx-auto" />
          </div>

          <div className="space-y-3 mb-10">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-medium text-gray-800 hover:text-black transition-colors"
                >
                  <span className="text-sm sm:text-base pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-300 ${
                      openFAQ === idx ? 'rotate-180 text-black' : ''
                    }`}
                  />
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    openFAQ === idx ? 'max-h-40 border-t border-gray-50' : 'max-h-0'
                  }`}
                >
                  <p className="p-5 text-sm text-gray-600 leading-relaxed bg-gray-50/50">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center items-center gap-6 text-xs sm:text-sm text-gray-500 font-medium">
            <button
              onClick={() => {
                setActiveTab('terms');
                setShowModal(true);
              }}
              className="flex items-center gap-1.5 hover:text-black transition-colors"
            >
              <FileText className="w-4 h-4 text-gray-400" /> Terms of Use
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => {
                setActiveTab('privacy');
                setShowModal(true);
              }}
              className="flex items-center gap-1.5 hover:text-black transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-gray-400" /> Privacy Policy
            </button>
          </div>
        </div>
      </section>

      {/* Modern Pop-up Modal for Full Legal Text */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Glassmorphic Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowModal(false)} />

          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden border border-gray-100 flex flex-col max-h-[85vh] animate-in fade-in zoom-in duration-300">
            {/* Modal Header Tabs */}
            <div className="flex border-b border-gray-100 bg-gray-50/80 px-6 pt-6 gap-2">
              <button
                onClick={() => setActiveTab('faq')}
                className={`pb-4 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab === 'faq' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                <HelpCircle className="w-4 h-4" /> FAQ
              </button>
              <button
                onClick={() => setActiveTab('terms')}
                className={`pb-4 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab === 'terms' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                <FileText className="w-4 h-4" /> Terms of Use
              </button>
              <button
                onClick={() => setActiveTab('privacy')}
                className={`pb-4 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab === 'privacy' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                <ShieldCheck className="w-4 h-4" /> Privacy Policy
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="ml-auto p-1.5 hover:bg-gray-200/50 rounded-full transition-colors self-start -mt-2 text-gray-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-8 overflow-y-auto text-sm text-gray-600 leading-relaxed space-y-6">
              {activeTab === 'faq' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-2">How long will my order take?</h3>
                    <p>Usually, beverage orders are prepared within 5 to 10 minutes. Food items or large combo sets take 15 to 20 minutes to cook fresh.</p>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-2">Can I order without a registered account?</h3>
                    <p>Yes! We allow anonymous guest checkouts so you can place Dine-In or Takeout orders instantly without wasting time creating a password.</p>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-2">How will I know if my order is ready?</h3>
                    <p>For in-store checkouts, keep an eye on your assigned Order queue number on the store counter screens. For deliveries, our rider will call the phone number you provided.</p>
                  </div>
                </div>
              )}

              {activeTab === 'terms' && (
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-gray-900">Fabella Terms of Use</h3>
                  <p>Welcome to Fabella Coffee. By using our website, making checkouts, or purchasing products, you agree to these legal terms:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Order Accuracy:</strong> You are responsible for ensuring that all contact details and selected options (Dine-In, Takeout, or Delivery) are entered correctly.</li>
                    <li><strong>Payment obligation:</strong> Placing an order represents a financial commitment. If you choose Cash on Delivery or Cash on Pickup, you must pay the total amount upon receipt.</li>
                    <li><strong>No cancellation policy:</strong> Once the kitchen changes your order status to "Ongoing" (In Progress), preparation starts and it cannot be cancelled or refunded.</li>
                    <li><strong>Price adjustments:</strong> All prices listed are subject to change without prior notice, except for orders already confirmed.</li>
                  </ul>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-gray-900">Privacy & Data Policy</h3>
                  <p>We respect your privacy and are committed to complying with the <strong>Philippine Data Privacy Act of 2012 (Republic Act No. 10173)</strong>:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Data Minimization:</strong> We only collect your name, method of dining, and optional phone numbers strictly necessary to prepare and deliver your delicious orders.</li>
                    <li><strong>No Long-Term Tracking for Guests:</strong> Customer information submitted under guest orders is solely utilized to complete the active transaction. We do not store or sell your history.</li>
                    <li><strong>Data Security:</strong> All user information, transaction logs, and GCash payments are handled securely using encryption standards to guard against unauthorized access.</li>
                    <li><strong>Your Rights:</strong> You have the right to request access to or removal of your registered user account and profile data at any time by contacting our support team.</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 p-6 bg-gray-50 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2.5 bg-black text-white hover:bg-black/80 transition-colors text-xs font-semibold rounded-full shadow-md"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
