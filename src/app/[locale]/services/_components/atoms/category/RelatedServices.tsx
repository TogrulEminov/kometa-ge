import { Link } from "@/i18n/navigation";
import { jsonItem, newInfoJson, ServicesType } from "@/services/interface/type";
import { DynamicIcon } from "@/utils/DynamicIcon";

export default async function RelatedServices({
  servicesRelated,
  servicesSection,
}: {
  servicesRelated: ServicesType[] | undefined;
  servicesSection: newInfoJson;
}) {
  if (!servicesRelated?.length || !servicesSection) return null;
  return (
    <div id="related" className="scroll-mt-8 mt-16">
      <div className="mb-8">
        {(servicesSection?.subTitle as string) && (
          <span className="text-primary text-sm font-bold tracking-wider uppercase">
            {servicesSection?.subTitle as string}
          </span>
        )}
        {(servicesSection?.title as string) && (
          <h2
            title={servicesSection?.title as string}
            className="text-secondary text-3xl font-bold mt-2 mb-4"
          >
            {servicesSection?.title}
          </h2>
        )}
        <div className="w-16 h-1 bg-primary rounded-full" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {servicesRelated.map((service, i) => {
          const serviceTr = service.translations?.[0];
          return (
            <Link
              key={service.id}
              href={`/servies/${serviceTr?.slug}`}
              className="group bg-white rounded-2xl p-5  border border-gray-100 hover:border-primary/20  transition-all duration-300 flex items-start gap-4"
            >
              <div className="size-12 p-3 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shrink-0">
                <DynamicIcon iconName={service.iconUrl} />
              </div>
              <div>
                <h3 className="text-secondary font-bold text-base mb-1 group-hover:text-primary transition-colors duration-300">
                  {serviceTr?.title}
                </h3>
                {serviceTr?.shortDescription && (
                  <p className="text-secondary/50 text-sm leading-relaxed">
                    {serviceTr?.shortDescription}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
