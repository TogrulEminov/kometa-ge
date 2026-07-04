import { sanitizeHtml } from "@/lib/domburify";
import { AboutMainType, newInfoJson } from "@/services/interface/type";
import { findJsonSection } from "@/utils/findJsonSection";

export default function ServicesList({
  aboutInfo,
}: {
  aboutInfo: AboutMainType;
}) {
  const aboutInfoTr = aboutInfo?.translations?.[0];
  const services = findJsonSection<newInfoJson>(
    aboutInfoTr?.description ?? "",
    "services",
  );
  if (!services) return null;
  return (
    <div id={`section-${services?.type}`} className="reveal">
      <span className="text-sm font-medium block text-primary mb-4 tracking-wide uppercase">
        {services?.subTitle}
      </span>
      <h2
        title={services?.title}
        className="font-display text-4xl font-bold mb-6 text-foreground"
      >
        {services?.title}
      </h2>
      {services?.description && (
        <article
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(services?.description ?? ""),
          }}
          className="text-muted leading-relaxed text-lg mb-10 prose"
        />
      )}

      <div className="space-y-0">
        {services?.items?.map((service, index) => {
          if (!service?.itemTitle) return null;
          return (
            <div
              key={index}
              className={`group border-t border-white/10 py-8 ${
                index === services?.items?.length - 1 ? "border-b border-white/10" : ""
              }`}
            >
              <div className="grid grid-cols-12 gap-6 items-start">
                <div className="col-span-12 lg:col-span-1">
                  <span className="font-display text-2xl font-bold text-muted group-hover:text-primary transition-colors">
                    {index + 1}.
                  </span>
                </div>
                <div className="col-span-12 lg:col-span-3">
                  <h3
                    title={service.itemTitle}
                    className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors"
                  >
                    {service.itemTitle}
                  </h3>
                </div>
                <div className="col-span-12 lg:col-span-6">
                  {service.itemDescription && (
                    <article
                      className="text-muted leading-relaxed prose"
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(service.itemDescription ?? ""),
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
