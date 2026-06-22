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
      <span className="text-sm font-medium text-primary mb-4 tracking-wide uppercase">
        {services?.subTitle}
      </span>
      <h2
        title={services?.title}
        className="font-display text-4xl font-bold mb-6"
      >
        {services?.title}
      </h2>
      {services?.description && (
        <article
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(services?.description ?? ""),
          }}
          className="text-gray-500 leading-relaxed text-lg mb-10"
        />
      )}

      <div className="space-y-0">
        {services?.items?.map((service, index) => {
          if (!service?.itemTitle) return null;
          return (
            <div
              key={service.itemTitle}
              className={`group border-t border-gray-200 py-8 ${
                index === services?.items?.length - 1 ? "border-b" : ""
              }`}
            >
              <div className="grid grid-cols-12 gap-6 items-start">
                <div className="col-span-12 lg:col-span-1">
                  <span className="font-display text-2xl font-bold text-gray-300 group-hover:text-primary transition-colors">
                    {index + 1}.
                  </span>
                </div>
                <div className="col-span-12 lg:col-span-3">
                  <h3
                    title={service.itemTitle}
                    className="font-display text-xl font-bold group-hover:text-primary transition-colors"
                  >
                    {service.itemTitle}
                  </h3>
                </div>
                <div className="col-span-12 lg:col-span-6">
                  <p className="text-gray-500 leading-relaxed">
                    {service.itemDescription && (
                      <article
                        className="text-gray-500 leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: sanitizeHtml(service.itemDescription ?? ""),
                        }}
                      />
                    )}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
