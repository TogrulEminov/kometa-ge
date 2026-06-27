import { sanitizeHtml } from "@/lib/domburify";
import { jsonItem, newInfoJson } from "@/services/interface/type";
import { FaCheckCircle } from "react-icons/fa";

export default async function Advantages({
  advantages,
}: {
  advantages: newInfoJson;
}) {
  if (!advantages) return null;
  return (
    <div id="advantages" className="scroll-mt-8 mt-16">
      <div className="mb-8">
        {advantages.subTitle && (
          <span className="text-primary text-sm font-bold tracking-wider uppercase">
            {advantages.subTitle}
          </span>
        )}
        <h2
          title={advantages.title}
          className="text-foreground text-3xl font-bold mt-2 mb-4"
        >
          {advantages.title}
        </h2>
        <div className="w-16 h-1 bg-primary rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {advantages.items.map((item: jsonItem, i) => (
          <div
            key={i}
            className="surface-card rounded-2xl p-6 transition-all duration-300 group"
          >
            <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 mb-4">
              <FaCheckCircle className="w-6 h-6" />
            </div>
            <strong className="text-foreground block font-bold text-lg mb-2 group-hover:text-primary transition-colors duration-300">
              {item.itemTitle}
            </strong>
            <article
              className="text-muted text-sm leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(item.itemDescription ?? ""),
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
