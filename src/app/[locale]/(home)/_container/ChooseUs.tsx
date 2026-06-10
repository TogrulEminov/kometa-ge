"use client";

import { useState } from "react";
import { FaArrowRight, FaHeadset, FaPaperPlane, FaCogs } from "react-icons/fa";
import CustomImage from "@/globalElement/CustomImage";

const features = [
  {
    icon: <FaCogs className="text-xl" />,
    title: "RELIABLE DELIVERY",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis,",
  },
  {
    icon: <FaPaperPlane className="text-xl" />,
    title: "INTERNATIONAL COVERAGE",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis,",
  },
  {
    icon: <FaHeadset className="text-xl" />,
    title: "24/7 CUSTOMER SUPPORT",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis,",
  },
];

const accordionItems = [
  {
    id: 1,
    icon: <FaCogs className="text-lg" />,
    badge: "SAFETY YOU CAN COUNT",
    title: "CUSTOMER-CENTRIC SOLUTIONS",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
    isOpen: true,
  },
  {
    id: 2,
    icon: <FaCogs className="text-lg" />,
    title: "SPEED MEETS PRECISION",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
    isOpen: false,
  },
  {
    id: 3,
    icon: <FaCogs className="text-lg" />,
    title: "SMART ROUTE OPTIMIZATION",
    badge: "SAFETY YOU CAN COUNT",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",

    isOpen: false,
  },
  {
    id: 4,
    icon: <FaCogs className="text-lg" />,
    title: "SAFETY YOU CAN COUNT ON",
    badge: "SAFETY YOU CAN COUNT",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",

    isOpen: false,
  },
];

export default function WhyChooseUs() {
  const [openAccordion, setOpenAccordion] = useState<number>(1);

  const toggleAccordion = (id: number) => {
    setOpenAccordion(openAccordion === id ? 0 : id);
  };

  return (
    <section className="w-full pt-5 pb-20 bg-white">
      <div className="container space-y-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <span className="inline-flex items-center px-5 py-2 bg-primary text-white text-xs font-bold tracking-[2px] uppercase rounded-full mb-6">
              WHY CHOOSE US
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-secondary leading-[1.1] tracking-tight">
              FOR YOUR LOGISTIC &amp;
              <br />
              TRANSPORTATION NEEDS
            </h2>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white text-sm font-bold tracking-wider uppercase rounded-lg hover:bg-[#A00D24] transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 flex-shrink-0 self-start md:self-auto"
          >
            GET STARTED
            <FaArrowRight className="text-xs" />
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div key={i} className="group">
              {/* Icon */}
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/30">
                <span className="text-white">{feature.icon}</span>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-secondary tracking-wide mb-4">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-[#64748B] text-[15px] leading-relaxed mb-6">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="relative">
            <div className="relative lg:h-full h-100 rounded-2xl overflow-hidden">
              <CustomImage
                src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&h=1000&fit=crop"
                title="Logistics Operations"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Floating Card */}
            <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-auto bg-white rounded-xl p-6 md:p-8 shadow-2xl max-w-sm">
              <span className="inline-flex items-center px-4 py-1.5 bg-primary text-white text-[11px] font-bold tracking-[2px] uppercase rounded-full mb-4">
                SAFETY YOU CAN COUNT
              </span>
              <h4 className="text-xl font-bold text-secondary">
                CUSTOMER-CENTRIC SOLUTIONS
              </h4>
            </div>
          </div>

          {/* Right: Accordion */}
          <div className="flex flex-col gap-4">
            {accordionItems.map((item, index) => {
              const isOpen = openAccordion === item.id;
              return (
                <div
                  key={item.id}
                  className={`rounded-xl transition-all duration-500 overflow-hidden ${
                    isOpen
                      ? "bg-[#F1F5F9] shadow-lg"
                      : "bg-[#F8FAFC] hover:bg-[#F1F5F9]"
                  }`}
                >
                  {/* Accordion Header */}
                  <button
                    onClick={() => toggleAccordion(item.id)}
                    className="w-full cursor-pointer flex items-center gap-4 p-5 md:p-6 text-left"
                  >
                    <div
                      className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 ${
                        isOpen
                          ? "bg-primary text-white"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span
                      className={`text-base md:text-lg font-bold tracking-wide transition-colors duration-300 ${
                        isOpen ? "text-secondary" : "text-[#475569]"
                      }`}
                    >
                      {item.title}
                    </span>
                  </button>

                  {/* Accordion Content */}
                  <div
                    className={`transition-all duration-500 ease-in-out ${
                      isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-5 md:px-6 pb-5 md:pb-6 pl-16 md:pl-18">
                      {item.badge && (
                        <span className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold tracking-[1px] uppercase rounded-full mb-3">
                          {item.badge}
                        </span>
                      )}
                      {item.description && (
                        <p className="text-[#64748B] text-[15px] leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
