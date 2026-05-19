import { useState } from 'react';
import { ChevronDown, ShieldCheck, FileText, HelpCircle, X, Terminal } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

export function StaffLegalFAQ() {
  const [activeTab, setActiveTab] = useState<'faq' | 'terms' | 'privacy'>('faq');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const faqs: FAQItem[] = [
    {
      q: 'How do I handle new pending orders?',
      a: 'New orders appear in the Pending queue. Review the items, checking if they are single products or combo sets. When you are ready to prepare them, click "Accept" to move the order to the In Progress (Ongoing) queue.',
    },
    {
      q: 'What should I do for incorrect or unpaid GCash orders?',
      a: 'Always verify GCash transactions. If the payment is missing or incorrect, do not proceed with preparation. You should call the customer immediately using their optional phone number or mark the order as "Cancelled".',
    },
    {
      q: 'Are queue numbers automatically managed?',
      a: 'Yes, queue numbers are assigned automatically by the database for each active order. The numbering runs consecutively to keep orders synchronized for checkout queues.',
    },
    {
      q: 'Is customer data privacy strictly enforced?',
      a: 'Yes. Under the Philippine Data Privacy Act, you must never share, save, or write down any customer names or phone numbers. This data is strictly to complete orders and must remain inside the system.',
    },
    {
      q: 'What happens when an order is completed?',
      a: 'Mark the order as "Received" once the customer picks up their items or the delivery rider departs. This archives the order details from the main dashboard screen to keep operations clean.',
    },
  ];

  return (
    <>
      {/* Modern floating helper button for the Staff Dashboard */}
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl shadow-lg transition-all text-xs font-semibold"
      >
        <Terminal className="w-4 h-4 text-emerald-400" /> Staff Operational Guide & FAQ
      </button>

      {/* Modern Pop-up Modal for Staff Guidelines & FAQ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Glassmorphic Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowModal(false)} />

          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden border border-gray-100 flex flex-col max-h-[85vh] animate-in fade-in zoom-in duration-300 text-gray-700">
            {/* Modal Header Tabs */}
            <div className="flex border-b border-gray-100 bg-gray-50/80 px-6 pt-6 gap-2">
              <button
                onClick={() => setActiveTab('faq')}
                className={`pb-4 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab === 'faq' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                <HelpCircle className="w-4 h-4 text-blue-500" /> Operational FAQ
              </button>
              <button
                onClick={() => setActiveTab('terms')}
                className={`pb-4 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab === 'terms' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                <FileText className="w-4 h-4 text-purple-500" /> Code of Conduct
              </button>
              <button
                onClick={() => setActiveTab('privacy')}
                className={`pb-4 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab === 'privacy' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Data Privacy Act
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
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Operational FAQ</h3>
                  <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                      <div key={idx} className="border-b border-gray-50 pb-4">
                        <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                          <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-600">Q</span>
                          {faq.q}
                        </h4>
                        <p className="text-gray-600 pl-6">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'terms' && (
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-gray-900">Staff Code of Conduct & Guidelines</h3>
                  <p>As a staff member of Fabella Coffee, you represent our brand. Follow these core service standards:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Order Efficiency:</strong> Review new pending checkouts within 3 minutes. Update order statuses promptly so customer screens refresh accurately.</li>
                    <li><strong>Preparation Accuracy:</strong> Carefully examine combo set recipes or custom regular sizes to guarantee top-tier service.</li>
                    <li><strong>Professional GCash Handling:</strong> When validating a GCash payment, match the transaction reference and total cost exactly before serving.</li>
                    <li><strong>Account Security:</strong> Never share your staff portal passwords. Lock your terminal screen when leaving the service counter.</li>
                  </ul>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-gray-900">Data Privacy & Compliance Obligations</h3>
                  <p>In accordance with the <strong>Philippine Data Privacy Act of 2012</strong>, all staff are strictly obligated to preserve customer confidentiality:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Strict Purpose Limitation:</strong> Customer names and phone numbers must ONLY be used for verifying order collection or coordinating deliveries.</li>
                    <li><strong>Zero Personal Storage:</strong> You are prohibited from copying, screen-recording, writing down, or saving customer contact details on personal devices.</li>
                    <li><strong>Communication Rules:</strong> Never contact a customer post-delivery or post-checkout for any personal or promotional matters.</li>
                    <li><strong>Immediate Escalation:</strong> If you suspect a customer data leak or unauthorized backend database access, report it to the Admin immediately.</li>
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
                Close Operational Window
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
