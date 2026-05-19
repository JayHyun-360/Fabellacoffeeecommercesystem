import { useState } from 'react';
import { ChevronDown, ShieldCheck, HelpCircle, Terminal } from 'lucide-react';

interface FAQItem { q: string; a: string; }

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

export function StaffGuideSection() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Staff Operational Guide</h2>
            <p className="text-xs text-gray-400">Common workflows and operational FAQs for staff members</p>
          </div>
        </div>
        <div className="w-full h-px bg-gray-100 mb-6" />
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-gray-50/50 rounded-2xl border border-gray-100/80 overflow-hidden">
              <button
                onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left font-semibold text-gray-800 hover:text-black transition-colors"
              >
                <span className="text-sm pr-4">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-300 ${openFAQ === idx ? 'rotate-180 text-black' : ''}`} />
              </button>
              <div className={`transition-all duration-300 overflow-hidden ${openFAQ === idx ? 'max-h-48 border-t border-gray-100' : 'max-h-0'}`}>
                <p className="p-5 text-sm text-gray-600 leading-relaxed bg-gray-50/20">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gray-900 flex items-center justify-center">
            <Terminal className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Code of Conduct</h2>
            <p className="text-xs text-gray-400">Service standards and operational protocols</p>
          </div>
        </div>
        <div className="w-full h-px bg-gray-100 mb-6" />
        <div className="text-sm text-gray-600 leading-relaxed space-y-4">
          <p>As a staff member of Fabella Coffee, you represent our brand. Follow these core service standards:</p>
          <ul className="list-disc pl-5 space-y-3">
            <li><strong>Order Efficiency:</strong> Review new pending checkouts within 3 minutes. Update order statuses promptly so customer screens refresh accurately.</li>
            <li><strong>Preparation Accuracy:</strong> Carefully examine combo set recipes or custom regular sizes to guarantee top-tier service.</li>
            <li><strong>Professional GCash Handling:</strong> When validating a GCash payment, match the transaction reference and total cost exactly before serving.</li>
            <li><strong>Account Security:</strong> Never share your staff portal passwords. Lock your terminal screen when leaving the service counter.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export function StaffPrivacySection() {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Data Privacy &amp; Compliance</h2>
          <p className="text-xs text-gray-400">Philippine Data Privacy Act obligations for all staff</p>
        </div>
      </div>
      <div className="w-full h-px bg-gray-100 mb-6" />
      <div className="text-sm text-gray-600 leading-relaxed space-y-4">
        <p>In accordance with the <strong>Philippine Data Privacy Act of 2012 (R.A. No. 10173)</strong>, all staff are strictly obligated to preserve customer confidentiality:</p>
        <ul className="list-disc pl-5 space-y-3">
          <li><strong>Strict Purpose Limitation:</strong> Customer names and phone numbers must ONLY be used for verifying order collection or coordinating deliveries.</li>
          <li><strong>Zero Personal Storage:</strong> You are prohibited from copying, screen-recording, writing down, or saving customer contact details on personal devices.</li>
          <li><strong>Communication Rules:</strong> Never contact a customer post-delivery or post-checkout for any personal or promotional matters.</li>
          <li><strong>Immediate Escalation:</strong> If you suspect a customer data leak or unauthorized backend database access, report it to the Admin immediately.</li>
        </ul>
        <div className="mt-6 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
          <p className="text-xs text-emerald-700 font-semibold">Violations of these obligations may result in disciplinary action and/or legal liability under R.A. No. 10173.</p>
        </div>
      </div>
    </div>
  );
}
