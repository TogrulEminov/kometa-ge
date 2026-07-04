import { sanitizeHtml } from "@/lib/domburify";
import { jsonItem, newInfoJson } from "@/services/interface/type";

export default async function Process({ process }: { process: newInfoJson }) {
  if (!process) return null;
  return (
    <div id="process" className="scroll-mt-8 mt-16">
      <div className="mb-8">
        {process.subTitle && (
          <span className="text-primary text-sm font-bold tracking-wider uppercase">
            {process.subTitle}
          </span>
        )}
        <h2
          title={process.title}
          className="text-foreground text-3xl font-bold mt-2 mb-4"
        >
          {process.title}
        </h2>
        <div className="w-16 h-1 bg-primary rounded-full" />
      </div>

      <div className="space-y-6">
        {process.items.map((step: jsonItem, i: number) => (
          <div key={i} className="flex gap-6 group">
            <div className="flex flex-col items-center">
              <div className="size-14 rounded-2xl bg-primary flex items-center justify-center text-white font-bold text-lg  shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                {i + 1}
              </div>
              {i < process.items.length - 1 && (
                <div className="w-0.5 flex-1 bg-linear-to-b from-primary/30 to-transparent mt-4" />
              )}
            </div>
            <div className="flex-1 pb-8">
              <strong className="text-foreground block font-bold text-xl mb-2 group-hover:text-primary transition-colors duration-300">
                {step.itemTitle as string}
              </strong>
              <article
                className="text-muted text-sm leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(step.itemDescription ?? ""),
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
