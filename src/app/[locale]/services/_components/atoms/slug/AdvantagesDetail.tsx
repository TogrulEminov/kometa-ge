import { sanitizeHtml } from "@/lib/domburify";
import { jsonItem, newInfoJson } from "@/services/interface/type";

export default async function AdvantagesDetail({
  advantages,
}: {
  advantages: newInfoJson;
}) {
  if (!advantages) return null;
  return (
    <div id="advantages" className="scroll-mt-8 mt-16">
      <div className="mb-8">
        {advantages.subTitle && (
          <span className="text-sm font-bold tracking-wider text-primary uppercase">
            {advantages.subTitle}
          </span>
        )}
        <h2 title={advantages.title} className="text-3xl font-bold mt-2 mb-4">
          {advantages.title}
        </h2>
        <div className="w-16 h-1 rounded-full bg-primary" />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {advantages.items.map((item: jsonItem, i: number) => (
          <div className="group bg-white rounded-2xl p-6  border border-gray-100  transition-all duration-300 flex items-start gap-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl shrink-0 transition-colors duration-300 bg-secondary">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div>
              <strong className="font-bold text-lg mb-2 transition-colors duration-300 text-secondary">
                {item.itemTitle as string}
              </strong>
              <article
                className="text-sm leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(item.itemDescription ?? ""),
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
