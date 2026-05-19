import { useState } from 'react';
import { ChevronDown, ShieldCheck, FileText, HelpCircle, ShieldAlert } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

export function AdminSystemManual() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

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
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 lg:p-8 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center">
          <HelpCircle className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">System Manual & FAQ</h2>
          <p className="text-xs text-gray-400">Complete operations guidebook for administrative staff</p>
        </div>
      </div>

      <div className="w-full h-px bg-gray-100 mb-8" />

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="bg-gray-50/50 rounded-2xl border border-gray-100/80 overflow-hidden transition-all duration-300"
          >
            <button
              onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
              className="w-full flex items-center justify-between p-5 text-left font-semibold text-gray-800 hover:text-black transition-colors"
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
                openFAQ === idx ? 'max-h-40 border-t border-gray-100 bg-white' : 'max-h-0'
              }`}
            >
              <p className="p-5 text-sm text-gray-600 leading-relaxed bg-gray-50/20">{faq.a}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminDataGovernance() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 animate-in fade-in duration-300">
      {/* Security Policies */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 lg:p-8 flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Security Standards</h2>
            <p className="text-xs text-gray-400">Strict system-level policies & protocols</p>
          </div>
        </div>

        <div className="w-full h-px bg-gray-100 mb-6" />

        <div className="space-y-4 flex-1 text-sm text-gray-600 leading-relaxed">
          <p>As the ultimate system administrator, you are tasked with protecting the integrity and runtime health of Fabella Coffee:</p>
          <ul className="list-disc pl-5 space-y-3">
            <li>
              <strong>Credential Protection:</strong> Enforce strong passwords for admin portals. Never use shared logins or broadcast API secrets under any circumstances.
            </li>
            <li>
              <strong>Recursive Policy Protection (Circuit Breaker):</strong> When updating RLS policies, never write policies that check user roles from public tables directly. Always use the secure JWT app_metadata attributes.
            </li>
            <li>
              <strong>Careful Schema Modifiers:</strong> Execute SQL migrations strictly through tracked migration files in order to prevent database schema conflicts in production.
            </li>
          </ul>
        </div>
      </div>

      {/* Data Governance */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 lg:p-8 flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Data Governance</h2>
            <p className="text-xs text-gray-400">Compliance & customer privacy practices</p>
          </div>
        </div>

        <div className="w-full h-px bg-gray-100 mb-6" />

        <div className="space-y-4 flex-1 text-sm text-gray-600 leading-relaxed">
          <p>As data controllers under the <strong>Philippine Data Privacy Act (R.A. No. 10173)</strong>, admins have extensive governance requirements:</p>
          <ul className="list-disc pl-5 space-y-3">
            <li>
              <strong>Restricted Exports:</strong> Do not export transaction logs or customer profiles unless explicitly necessary for legal audits, and ensure all files are securely encrypted.
            </li>
            <li>
              <strong>Operational Audits:</strong> Periodically review active database logs to verify staff members are complying with customer confidentiality regulations.
            </li>
            <li>
              <strong>Data Minimization Controls:</strong> Maintain the optional guest contact policy. Only store essential attributes to limit liabilities from data exposures.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
