import { Link } from "@/i18n/navigation";
import { newInfoJson, SubServicesType } from "@/services/interface/type";
import { FaArrowRight } from "react-icons/fa";
export default async function RelatedServices({
  sectionData,
  relatedServices,
}: {
  sectionData: newInfoJson;
  relatedServices: SubServicesType[];
}) {
  if (!sectionData || !relatedServices?.length) return null;
  return (
    <div id="other-service" className="scroll-mt-8 mt-16">
      <div className="mb-8">
        {sectionData.subTitle && (
          <span className="text-sm text-primary font-bold tracking-wider uppercase">
            {sectionData.subTitle}
          </span>
        )}
        {sectionData.title && (
          <h2
            title={sectionData.title}
            className="text-3xl font-bold mt-2 mb-4 text-secondary"
          >
            {sectionData.title}
          </h2>
        )}
        <div className="w-16 h-1 rounded-full mb-4 bg-primary" />
      </div>

      {relatedServices.map((service) => {
        const servicesCategorySlug = service.services?.translations?.[0];
        const serviceTr = service.translations?.[0];
        if (!serviceTr) return null;
        return (
          <Link
            key={service.id}
            href={`/services/${servicesCategorySlug?.slug}/${serviceTr.slug}`}
            className="group block relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500"
          >
            <div className="absolute inset-0 bg-secondary/80" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3
                    title={serviceTr.title}
                    className="text-white font-bold text-2xl mb-2 transition-colors duration-300 group-hover:text-primary"
                  >
                    {serviceTr.title}
                  </h3>
                  {serviceTr.shortDescription && (
                    <p className="text-white/70 text-sm max-w-xl line-clamp-2">
                      {serviceTr.shortDescription}
                    </p>
                  )}
                </div>
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-white transition-all duration-300 flex-shrink-0 backdrop-blur-sm">
                  <FaArrowRight className="w-6 h-6" />
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
