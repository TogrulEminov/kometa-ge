import { sanitizeHtml } from "@/lib/domburify";
import { jsonItem, newInfoJson } from "@/services/interface/type";
import React from "react";
import { FaChevronDown } from "react-icons/fa6";

export default function FagDetail({ faq }: { faq: newInfoJson }) {
  if (!faq) return null;
  return (
    <div id="faq" className="scroll-mt-8 mt-16">
      <div className="mb-8">
        {faq.subTitle && (
          <span className="text-sm text-primary font-bold tracking-wider uppercase">
            Suallar
          </span>
        )}
        <h2
          title={faq.title}
          className="text-3xl font-bold mt-2 mb-4 text-secondary"
        >
          {faq.subTitle}
        </h2>
        <div className="w-16 h-1 rounded-full bg-primary" />
      </div>

      <div className="space-y-3">
        {faq.items.map((item: jsonItem, i: number) => (
          <details
            key={i}
            className="bg-white rounded-2xl border border-gray-100   duration-300 group overflow-hidden"
          >
            <summary className="flex items-center justify-between p-6 cursor-pointer list-none select-none">
              <span className="font-bold text-secondary text-base pr-4">
                {item.itemTitle as string}
              </span>
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-open:text-white">
                <span
                  className={`faq-icon-${i} bg-tertiary text-secondary w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300`}
                >
                  <FaChevronDown className="w-4 h-4 transition-transform duration-300" />
                </span>
              </div>
            </summary>
            <div className="px-6 pb-6 pt-0">
              <div className="border-t border-gray-100 pt-4">
                <article
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(item.itemDescription ?? ""),
                  }}
                  className="text-sm leading-relaxed text-secondary/90"
                />
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
