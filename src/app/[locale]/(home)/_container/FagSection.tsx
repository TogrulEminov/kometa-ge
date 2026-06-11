// app/sections/FAQSplitServer.jsx
// NO "use client" - Pure Server Component

import SectionContentComponent from "@/components/SectionContent";
import { Link } from "@/i18n/navigation";
import { FaQuestion } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";

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

export default function FAQSplitServer() {
  return (
    <section className="w-full py-10 border-b border-b-gray-200 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* LEFT: Sticky Header */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <SectionContentComponent
                description={
                  "Find answers to the most common questions about our logistics services."
                }
                title="Frequently Asked Questions"
                type="vertical"
                highlightWord={"Questions"}
                subTitle={"FAQ"}
              />
              <div className="animate-fade-in-up delay-400 mt-8">
                <p className="text-gray-400 text-sm mb-4">
                  Still have questions?
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-primary text-white font-bold text-sm uppercase tracking-wider px-6 py-3 rounded-lg shadow-md hover:bg-[#8f0e1f] transition-all duration-300 hover:gap-3"
                >
                  Contact us
                  <FaArrowRightLong className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT: FAQ Items */}
          <div className="lg:col-span-7 space-y-4">
            {faqData.map((item) => (
              <details key={item.id} className="faq-item group">
                <summary className="faq-card cursor-pointer rounded-2xl border border-gray-100 bg-tertiary">
                  <div className="flex items-center justify-between gap-4 p-6 md:p-7">
                    <div className="flex items-center gap-4">
                      {/* Question Icon */}
                      <FaQuestion className="text-primary group-open:text-white transition-colors duration-300" />

                      <h3 className="faq-question text-base md:text-lg font-bold text-secondary">
                        {item.question}
                      </h3>
                    </div>

                    <div className="chevron-container shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <svg
                        className="chevron-icon w-3 h-3 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Answer */}
                  <div className="faq-answer">
                    <div className="faq-answer-inner">
                      <div className="px-6 md:px-7 pb-6 md:pb-7 pl-14 md:pl-14">
                        <div className="faq-divider h-px w-full bg-white/20 mb-4" />
                        <p className="faq-answer-text text-[15px] leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </summary>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
