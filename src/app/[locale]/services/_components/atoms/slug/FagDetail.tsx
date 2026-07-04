import { sanitizeHtml } from "@/lib/domburify";
import { jsonItem, newInfoJson } from "@/services/interface/type";
import { FaChevronDown } from "react-icons/fa6";

export default function FagDetail({ faq }: { faq: newInfoJson }) {
  if (!faq) return null;
  return (
    <div id="faq" className="scroll-mt-8 mt-16">
      <div className="mb-8">
        {faq.subTitle && (
          <span className="text-sm text-primary font-bold tracking-wider uppercase">
            {faq.subTitle}
          </span>
        )}
        <h2
          title={faq.title}
          className="text-3xl font-bold mt-2 mb-4 text-foreground"
        >
          {faq.title}
        </h2>
        <div className="w-16 h-1 rounded-full bg-primary" />
      </div>

      <div className="space-y-3">
        {faq.items.map((item: jsonItem, i: number) => (
          <details
            key={i}
            className="surface-card group overflow-hidden"
          >
            <summary className="flex items-center justify-between p-6 cursor-pointer list-none select-none">
              <span className="font-bold text-foreground text-base pr-4">
                {item.itemTitle as string}
              </span>
              <div className="w-8 h-8 rounded-full bg-surface-elevated flex items-center justify-center text-muted group-open:bg-primary group-open:text-white transition-all duration-300 shrink-0">
                <FaChevronDown className="w-4 h-4 transition-transform duration-300 group-open:rotate-180" />
              </div>
            </summary>
            <div className="px-6 pb-6 pt-0">
              <div className="border-t border-white/10 pt-4">
                <article
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(item.itemDescription ?? ""),
                  }}
                  className="text-sm leading-relaxed text-muted"
                />
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
