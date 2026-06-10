"use client";

const faqData = [
  {
    id: 1,
    question: "What types of transportation services does Kometa GE offer?",
    answer:
      "At Kometa GE, we provide international road, sea, air, rail freight, and heavy cargo transportation services. We develop customized solutions for each type of shipment and ensure the safe delivery of your cargo.",
  },
  {
    id: 2,
    question: "How can I track my shipment?",
    answer:
      "You can track your shipment by entering your tracking number in the 'Order Tracking' section on our website. You will be able to see your cargo location and delivery status in real time.",
  },
  {
    id: 3,
    question: "How long does transportation take?",
    answer:
      "Delivery time depends on the route, transportation type, and customs procedures. Typically, road transport takes 3–7 days, air freight 1–3 days, and sea freight 10–20 days.",
  },
  {
    id: 4,
    question: "Are my shipments insured?",
    answer:
      "Yes, all shipments are insured during transportation. This provides protection in case of any damage. Additional insurance options are also available.",
  },
  {
    id: 5,
    question: "Which countries do you ship to?",
    answer:
      "We provide transportation services to Asia, Europe, CIS countries, and many other destinations. We have extensive experience especially in routes such as China, Kazakhstan, Georgia, Turkey, and Russia.",
  },
  {
    id: 6,
    question: "How is pricing calculated?",
    answer:
      "Pricing is calculated based on weight, volume, transportation type, and destination. For an exact quote, you can fill out the 'Price Inquiry' form or contact us directly.",
  },
];

export default function FAQSection() {
  return (
    <section className="w-full py-10 lg:py-20 bg-[#F8FAFC]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex px-5 py-2 bg-[#C8102E]/10 text-[#C8102E] text-xs font-bold uppercase rounded-full mb-6">
            FAQ
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-4">
            Frequently Asked <span className="text-[#C8102E]">Questions</span>
          </h2>
          <p className="text-[#64748B] text-lg max-w-2xl mx-auto">
            The most commonly asked questions and their answers
          </p>
        </div>

        {/* FAQ */}
        <div className="max-w-4xl mx-auto space-y-4">
          {faqData.map((item) => (
            <details
              key={item.id}
              className="group bg-white rounded-xl border border-[#E2E8F0] overflow-hidden hover:border-[#C8102E]/30 hover:shadow-lg transition-all duration-300"
            >
              <summary className="flex items-center justify-between gap-4 p-6 cursor-pointer list-none select-none">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-lg bg-[#C8102E]/10 text-[#C8102E] flex items-center justify-center text-sm font-bold group-open:bg-[#C8102E] group-open:text-white transition">
                    {String(item.id).padStart(2, "0")}
                  </span>

                  <h3 className="text-[15px] md:text-base font-bold text-[#1E293B] group-open:text-[#C8102E] transition">
                    {item.question}
                  </h3>
                </div>

                {/* icon */}
                <span className="text-[#64748B] group-open:rotate-180 text-3xl transition-transform duration-300">
                  +
                </span>
              </summary>

              <div className="px-6 pb-6 pl-[72px] text-[#64748B] text-[15px] leading-relaxed">
                {item.answer}
              </div>
            </details>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <p className="text-[#64748B] mb-4">Still haven’t found the answer?</p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C8102E] text-white text-sm font-bold uppercase rounded-xl hover:bg-[#A00D24] transition"
          >
            Contact us
          </a>
        </div>
      </div>
    </section>
  );
}
