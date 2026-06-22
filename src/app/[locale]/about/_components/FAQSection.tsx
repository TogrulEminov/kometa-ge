import { sanitizeHtml } from "@/lib/domburify";
import { AboutMainType, newInfoJson } from "@/services/interface/type";
import { findJsonSection } from "@/utils/findJsonSection";
import { FaPlus } from "react-icons/fa6";
export default function FAQSection({
  aboutInfo,
}: {
  aboutInfo: AboutMainType;
}) {
  const aboutInfoTr = aboutInfo?.translations?.[0];
  const faq = findJsonSection<newInfoJson>(
    aboutInfoTr?.description ?? "",
    "faq",
  );
  if (!faq) return null;
  return (
    <div id="section-faq" className="reveal">
      <span className="text-sm font-medium text-primary mb-4 tracking-wide uppercase">
        {faq?.subTitle}
      </span>
      <h2 title={faq?.title} className="font-display text-4xl font-bold mb-6">
        {faq?.title}
      </h2>
      {faq?.description && (
        <article
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(faq?.description ?? ""),
          }}
          className="text-gray-500 leading-relaxed text-lg mb-10"
        />
      )}

      <div className="space-y-0">
        {faq?.items?.map((item, index) => {
          return (
            <details
              key={index}
              className={`group border-b border-gray-200 ${index === 0 ? "border-t" : ""}`}
            >
              <summary className="flex items-center justify-between py-6 cursor-pointer list-none">
                <span className="font-semibold text-secondary pr-8">
                  {item.itemTitle}
                </span>
                <FaPlus className="w-5 h-5 text-primary shrink-0 transition-transform duration-300 group-open:rotate-45" />
              </summary>
              <article
                className="text-gray-500 leading-relaxed pb-6"
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(item.itemDescription ?? ""),
                }}
              />
            </details>
          );
        })}
      </div>
    </div>
  );
}
