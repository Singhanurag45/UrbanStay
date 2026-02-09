import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle, MessageCircle } from "lucide-react";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Default first one open

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-slate-950 py-20 px-6 border-t border-slate-900 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/20">
            <HelpCircle size={14} /> Support
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Frequently Asked <span className="text-emerald-400">Questions</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Everything you need to know about booking, cancellations, and payments with UrbanStay.
          </p>
        </div>

        {/* Accordion Grid */}
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className={`border rounded-2xl transition-all duration-300 ${
                openIndex === index
                  ? "bg-slate-900/50 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                  : "bg-slate-900/20 border-slate-800 hover:border-slate-700"
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
              >
                <span className={`text-lg font-medium transition-colors ${
                  openIndex === index ? "text-emerald-400" : "text-white"
                }`}>
                  {faq.question}
                </span>
                <div className={`p-2 rounded-full transition-colors ${
                    openIndex === index ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-400"
                }`}>
                  {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="p-6 pt-0 text-slate-400 leading-relaxed border-t border-slate-800/50 mt-2">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center bg-slate-900 rounded-2xl p-8 border border-slate-800">
          <h4 className="text-white font-bold text-lg mb-2">Still have questions?</h4>
          <p className="text-slate-400 mb-6">Can't find the answer you're looking for? Please chat to our friendly team.</p>
          <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 mx-auto">
             <MessageCircle size={18} /> Get in touch
          </button>
        </div>
      </div>
    </section>
  );
};

// --- DATA ---
const faqData = [
  {
    question: "What happens if my travel plans change after booking?",
    answer: "If your travel plans change, you can manage your reservation from the 'My Bookings' section. Depending on the hotel’s policy, you may be eligible for free cancellation, date changes, or partial refunds."
  },
  {
    question: "Is my payment information secure?",
    answer: "Absolutely. We use industry-standard encryption (SSL) and partner with Stripe to process payments. We do not store your credit card details on our servers."
  },
  {
    question: "Do I need to show ID upon check-in?",
    answer: "Yes, a valid government-issued photo ID (Passport, Driver's License, or Aadhar Card) is required for all guests at the time of check-in for security purposes."
  },
  {
    question: "Are there any hidden taxes or fees?",
    answer: "Transparency is our priority. The price you see at the checkout includes all applicable taxes and service fees. No surprises at the hotel desk."
  },
  {
    question: "How do I contact customer support?",
    answer: "Our support team is available 24/7. You can reach us via the 'Contact' page, email us at support@urbanstay.com, or call our toll-free number listed in the footer."
  }
];

export default FAQ;