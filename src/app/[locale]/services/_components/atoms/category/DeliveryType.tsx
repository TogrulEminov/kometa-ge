import { Link } from "@/i18n/navigation";
import { newInfoJson, SubServicesType } from "@/services/interface/type";
import { cn } from "@/utils/cn";
import { DynamicIcon } from "@/utils/DynamicIcon";

export default async function DeliveryType({
  delivery,
  category,
  subServices,
}: {
  delivery: newInfoJson;
  category: string;
  subServices: SubServicesType[];
}) {
  if (!delivery || !category || !subServices) return null;
  return (
    <div id="ftl-ltl" className="scroll-mt-8 mt-16 mb-16">
      <div className="mb-8">
        {(delivery?.subTitle as string) && (
          <span className="text-primary text-sm font-bold tracking-wider uppercase">
            {delivery?.subTitle as string}
          </span>
        )}
        {(delivery?.title as string) && (
          <h2 className="text-secondary text-3xl font-bold mt-2 mb-4">
            {delivery?.title as string}
          </h2>
        )}
      </div>

      <div className="space-y-6">
        {subServices?.map((item) => {
          const itemTr = item.translations?.[0];
          if (!itemTr) return null;
          return (
            <Link
              key={item.id}
              href={`/services/${category}/${itemTr.slug}`}
              className="bg-white block rounded-2xl p-6  border border-gray-100 hover:border-primary/20 transition-all duration-300"
            >
              <div
                className={cn(
                  "flex  gap-4",
                  itemTr.shortDescription
                    ? "flex-col items-start"
                    : "flex-row items-center",
                )}
              >
                <div className="size-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                  <DynamicIcon iconName={item.iconsUrl} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-secondary font-bold text-xl">
                    {itemTr.title}
                  </h3>
                  {itemTr.shortDescription && (
                    <p className="text-secondary/60 text-sm leading-relaxed">
                      {itemTr.shortDescription}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
