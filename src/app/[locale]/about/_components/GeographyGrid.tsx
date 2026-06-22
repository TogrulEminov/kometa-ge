import {
  AboutMainType,
  jsonItem,
  newInfoJson,
} from "@/services/interface/type";
import { findJsonSection } from "@/utils/findJsonSection";
import { sanitizeHtml } from "@/lib/domburify";

export default function GeographyGrid({
  aboutInfo,
}: {
  aboutInfo: AboutMainType;
}) {
  const aboutInfoTr = aboutInfo?.translations?.[0];
  const geography = findJsonSection<newInfoJson>(
    aboutInfoTr?.description ?? "",
    "activity",
  );
  if (!geography) return null;
  return (
    <div id={`section-${geography?.type}`} className="reveal">
      <span className="text-sm font-medium block text-primary mb-4 tracking-wide uppercase">
        {geography?.subTitle}
      </span>
      <h2
        title={geography?.title}
        className="font-display text-4xl font-bold mb-6"
      >
        {geography?.title}
      </h2>
      <article
        dangerouslySetInnerHTML={{
          __html: sanitizeHtml(geography?.description ?? ""),
        }}
        className="text-gray-500 leading-relaxed text-lg mb-8"
      />
      {geography?.items && (
        <div className="grid md:grid-cols-2 gap-px bg-gray-300">
          {geography.items.map((item: jsonItem) => (
            <div
              key={item.itemTitle}
              className="bg-tertiary p-8 lg:p-10 reveal"
            >
              <div className="flex items-start justify-between mb-6">
                <h3 className="font-display text-2xl font-bold">
                  {item.itemTitle}
                </h3>
                {typeof item.badge === "string" && (
                  <span className="text-xs font-medium text-gray-400 border border-gray-300 px-3 py-1">
                    {item.badge}
                  </span>
                )}
              </div>
              {item.itemDescription && (
                <article
                  className="text-gray-500 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(item.itemDescription ?? ""),
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
