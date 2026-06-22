"use client";
import { jsonItem } from "@/services/interface/type";
import React, { useState } from "react";
import { FaGlobe } from "react-icons/fa6";

export default function Accordion({ items }: { items: jsonItem[] }) {
  const [openAccordion, setOpenAccordion] = useState<number>(1);

  const toggleAccordion = (id: number) => {
    setOpenAccordion(openAccordion === id ? 0 : id);
  };
  return (
    <>
      {items.map((item, index) => {
        const isOpen = openAccordion === item.id;
        if (!item?.itemTitle || !item?.itemDescription) return null;
        return (
          <div
            key={item.itemTitle ?? index}
            className={`rounded-xl transition-all duration-500 overflow-hidden ${
              isOpen ? "bg-tertiary" : "bg-tertiary/90"
            }`}
          >
            {/* Accordion Header */}
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full cursor-pointer flex items-center gap-4 p-5 md:p-6 text-left"
            >
              <div
                className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 ${
                  isOpen
                    ? "bg-primary text-white"
                    : "bg-primary/10 text-primary"
                }`}
              >
                <FaGlobe />
              </div>
              <span
                className={`text-base md:text-lg font-bold tracking-wide transition-colors duration-300 ${
                  isOpen ? "text-secondary" : "text-[#475569]"
                }`}
              >
                {item?.itemTitle}
              </span>
            </button>

            {/* Accordion Content */}
            <div
              className={`transition-all duration-500 ease-in-out ${
                isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-5 md:px-6 pb-5 md:pb-6 pl-16 md:pl-18">
                {item?.itemDescription && (
                  <p className="text-[#64748B] text-[15px] leading-relaxed">
                    {item?.itemDescription}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
