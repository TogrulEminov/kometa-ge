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
        className="font-display text-4xl font-bold mb-6 text-foreground"
      >
        {geography?.title}
      </h2>
      <article
        dangerouslySetInnerHTML={{
          __html: sanitizeHtml(geography?.description ?? ""),
        }}
        className="text-muted leading-relaxed text-lg mb-8 prose"
      />
      {geography?.items && (
        <div className="grid md:grid-cols-2 gap-4">
          {geography.items.map((item: jsonItem) => (
            <div
              key={item.itemTitle}
              className="surface-card p-8 lg:p-10 reveal"
            >
              <div className="flex items-start justify-between mb-6">
                <h3 className="font-display text-2xl font-bold text-foreground">
                  {item.itemTitle}
                </h3>
                {typeof item.badge === "string" && (
                  <span className="text-xs font-medium text-muted border border-white/10 px-3 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
              {item.itemDescription && (
                <article
                  className="text-muted leading-relaxed prose"
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
