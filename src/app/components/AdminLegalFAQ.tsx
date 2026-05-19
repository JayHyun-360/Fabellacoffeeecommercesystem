import { useState } from 'react';
import { ChevronDown, ShieldCheck, FileText, HelpCircle, X, ShieldAlert } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

export function AdminLegalFAQ() {
  const [activeTab, setActiveTab] = useState<'faq' | 'terms' | 'privacy'>('faq');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const faqs: FAQItem[] = [
    {
      q: 'How do I add a new promo or hybrid combo set?',
      a: 'Navigate to the Products tab. Click "Add Product". Choose whether the product is structurally a "Single Product" or a "Set / Combo Bundle" (where you can list sub-items). You can then independently toggle the "Promo" and "Featured Spot" marketing badges and assign a discounted promo price.',
    },
    {
      q: 'How do I manage GCash payments and QR codes?',
      a: 'GCash configurations are located in the Store Settings tab. Update the active GCash phone number and upload the fresh QR Code image so customers can scan it during checkout.',
    },
    {
      q: 'What is the role of RLS in our Supabase security?',
      a: 'Row Level Security (RLS) is active on all tables. Role check policies strictly read auth.jwt() metadata (using the JWT pattern) to prevent recursion loops, protecting sensitive customer transactions.',
    },
    {
      q: 'How do I add or disable Staff accounts?',
      a: 'Managing roles is handled in your Supabase Auth dashboard or by assigning staff metadata attributes. Be sure to deactivate staff credentials immediately upon employee offboarding.',
    },
    {
      q: 'How does store settings configuration work?',
      a: 'You can update store hours, email, phone, custom hero slides, and the global announcement banner in real-time. Changes sync instantly via Supabase replication to all customer screens.',
    },
  ];

  return (
    <>
      {/* Modern floating helper button for the Admin Panel */}
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-2.5 bg-red-950/20 border border-red-200/30 text-red-700 hover:bg-red-50 rounded-xl transition-all text-xs font-semibold"
      >
        <ShieldAlert className="w-4 h-4 text-red-600" /> Admin System Manual & Safety FAQ
      </button>

      {/* Modern Pop-up Modal for Admin Guidelines & FAQ */}
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
                <HelpCircle className="w-4 h-4 text-amber-500" /> System Manual & FAQ
              </button>
              <button
                onClick={() => setActiveTab('terms')}
                className={`pb-4 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab === 'terms' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                <FileText className="w-4 h-4 text-red-500" /> Security Standards
              </button>
              <button
                onClick={() => setActiveTab('privacy')}
                className={`pb-4 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab === 'privacy' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Data Governance
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
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Admin System FAQ</h3>
                  <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                      <div key={idx} className="border-b border-gray-50 pb-4">
                        <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                          <span className="text-xs px-2 py-0.5 rounded bg-amber-50 text-amber-600">Q</span>
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
                  <h3 className="text-base font-semibold text-gray-900">Admin Security Standards & Policies</h3>
                  <p>As the ultimate system administrator, you are tasked with protecting the integrity and runtime health of Fabella Coffee:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Credential Protection:</strong> Enforce strong passwords for admin portals. Never use shared logins or broadcast api secrets.</li>
                    <li><strong>Recursive Policy Protection (Circuit Breaker):</strong> When updating RLS policies, never write policies that check user roles from public tables directly. Always use the secure JWT metadata attributes.</li>
                    <li><strong>Careful Schema Modifiers:</strong> Execute SQL migrations through tracked migration files (`src/lib/supabase/migrations/`) to prevent conflicts in Vercel production deployments.</li>
                  </ul>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-gray-900">Data Governance & Compliance Responsibilities</h3>
                  <p>As data controllers under the <strong>Philippine Data Privacy Act</strong>, admins have extensive governance requirements:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Restricted Exports:</strong> Do not export transaction logs or customer profiles unless explicitly necessary for legal audits, and ensure files are encrypted.</li>
                    <li><strong>Operational Audits:</strong> Periodically review active database logs to verify staff members are complying with customer confidentiality regulations.</li>
                    <li><strong>Data Minimization Controls:</strong> Maintain the optional guest contact policy. Only store essential attributes to limit liabilities from data exposures.</li>
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
                Close System Manual
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
