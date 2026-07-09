import StickyBarDetail from "../atoms/slug/StickyBar";
import AdvantagesDetail from "../atoms/slug/AdvantagesDetail";
import ServicesDetailOverview from "../atoms/slug/ServicesDetailOverview";
import {
  IContactInformation,
  newInfoJson,
  ServicesType,
  Social,
  SubServicesType,
} from "@/services/interface/type";
import { findJsonSection } from "@/utils/findJsonSection";
import StatisticsDetail from "../atoms/slug/StatisticsDetail";
import ProcessDetail from "../atoms/slug/Process";
import FagDetail from "../atoms/slug/FagDetail";
import RelatedServices from "../atoms/slug/RelatedServices";
import ParentService from "../atoms/slug/ParentService";

export default function ServicesSlugDetail({
  servicesDetail,
  services,
  contactInfo,
  socials,
  relatedSubServices,
  parentServiceData,
  category,
}: {
  servicesDetail: SubServicesType;
  services: ServicesType[];
  contactInfo: IContactInformation;
  socials: Social[];
  relatedSubServices: SubServicesType[];
  parentServiceData: ServicesType;
  category: string;
}) {
  const servicesTr = servicesDetail?.translations?.[0];
  const servicesOverview = findJsonSection<newInfoJson>(
    servicesTr?.description ?? "",
    "main",
  );
  const advantages = findJsonSection<newInfoJson>(
    servicesTr?.description ?? "",
    "advantages",
  );
  const statistics = findJsonSection<newInfoJson>(
    servicesTr?.description ?? "",
    "statistics",
  );
  const process = findJsonSection<newInfoJson>(
    servicesTr?.description ?? "",
    "process",
  );
  const faq = findJsonSection<newInfoJson>(
    servicesTr?.description ?? "",
    "faq",
  );
  const relatedServices = findJsonSection<newInfoJson>(
    servicesTr?.description ?? "",
    "related_services",
  );
  const parentServiceSection = findJsonSection<newInfoJson>(
    servicesTr?.description ?? "",
    "main_service",
  );
  return (
    <section className="bg-background lg:py-20 py-10">
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - 30% */}
          <aside className="lg:w-[30%]   hrink-0 lg:order-1 order-2">
            <StickyBarDetail
              services={services}
              category={category}
              contactInfo={contactInfo as unknown as IContactInformation}
              socials={socials as unknown as Social[]}
            />
          </aside>

          {/* Right Content - 70% */}
          <div className="lg:w-[70%] min-w-0 lg:order-2 order-1">
            <ServicesDetailOverview
              servicesInfo={servicesDetail}
              servicesOverview={servicesOverview as unknown as newInfoJson}
            />
            <AdvantagesDetail
              advantages={advantages as unknown as newInfoJson}
            />
            <StatisticsDetail
              statistics={statistics as unknown as newInfoJson}
            />
            <ProcessDetail process={process as unknown as newInfoJson} />
            <FagDetail faq={faq as unknown as newInfoJson} />
            <RelatedServices
              sectionData={relatedServices as unknown as newInfoJson}
              relatedServices={
                relatedSubServices as unknown as SubServicesType[]
              }
              currentSlug={servicesTr?.slug ?? ""}
            />
            <ParentService
              sectionData={parentServiceSection as unknown as newInfoJson}
              parentService={parentServiceData}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
