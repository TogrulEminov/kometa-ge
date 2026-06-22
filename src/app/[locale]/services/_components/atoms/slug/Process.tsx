import { sanitizeHtml } from "@/lib/domburify";
import { jsonItem, newInfoJson } from "@/services/interface/type";

export default async function ProcessDetail({
  process,
}: {
  process: newInfoJson;
}) {
  if (!process) return null;
  return (
    <div id="process" className="mt-16">
      <div className="mb-8">
        {process.subTitle && (
          <span className="text-sm text-primary font-bold tracking-wider uppercase">
            {process.subTitle}
          </span>
        )}
        <h2
          title={process.title}
          className="text-3xl font-bold text-secondary mt-2 mb-4"
        >
          {process.title}
        </h2>
        <div className="w-16 h-1 bg-primary rounded-full mb-4" />
        <article
          className="leading-relaxed text-secondary/90"
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(process.description ?? ""),
          }}
        />
      </div>

      <div className="relative">
        {/* Vertical connecting line */}
        <div
          className="absolute left-7 top-0 bottom-0 w-0.5"
          style={{
            background: `linear-gradient(to bottom, #b11226, #b112264D, transparent)`,
          }}
        />

        <div className="space-y-8">
          {process.items.map((step: jsonItem, i: number) => (
            <div className="relative flex gap-6 pl-2" key={i}>
              <div className="w-12 h-12  bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 z-10 shadow-lg">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="bg-white rounded-2xl p-6  border border-gray-100 flex-1 transition-colors duration-300">
                <strong className="font-bold text-lg mb-2 text-secondary">
                  {step.itemTitle as string}
                </strong>
                <article
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(step.itemDescription ?? ""),
                  }}
                  className="text-sm leading-relaxed text-secondary/90"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
