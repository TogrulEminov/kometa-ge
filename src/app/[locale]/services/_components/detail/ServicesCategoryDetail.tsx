import {
  IContactInformation,
  newInfoJson,
  ServicesType,
  Social,
  SubServicesType,
} from "@/services/interface/type";
import StickyBar from "../atoms/category/StickyBar";
import ServiceOverview from "../atoms/category/ServiceOverview";
import { findJsonSection } from "@/utils/findJsonSection";
import Advantages from "../atoms/category/Advantages";
import Statistics from "../atoms/category/Statistics";
import Process from "../atoms/category/Process";
import FaqComponent from "../atoms/category/Fag";
import RelatedServices from "../atoms/category/RelatedServices";
import DeliveryType from "../atoms/category/DeliveryType";
import { Suspense } from "react";

export default async function ServicesCategoryDetail({
  servicesDetail,
  services,
  contactInfo,
  socials,
  servicesRelated,
}: {
  servicesDetail: ServicesType;
  services: ServicesType[];
  contactInfo: IContactInformation;
  socials: Social[];
  servicesRelated: ServicesType[] | undefined;
}) {
  const servicesTr = servicesDetail?.translations?.[0];
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
  const delivery = findJsonSection<newInfoJson>(
    servicesTr?.description ?? "",
    "delivery",
  );
  return (
    <div className="lg:py-20 py-10 bg-tertiary">
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-[30%] shrink-0 lg:order-1 order-2">
            <Suspense fallback={null}>
              <StickyBar
                services={services}
                socials={socials as unknown as Social[]}
                category={servicesTr?.slug ?? ""}
                contactInfo={contactInfo as unknown as IContactInformation}
              />
            </Suspense>
          </aside>
          <div className="lg:w-[70%] lg:min-w-0 lg:order-2 order-1">
            <ServiceOverview
              servicesOverview={servicesDetail as unknown as ServicesType}
            />
            <Suspense fallback={null}>
              <Advantages advantages={advantages as unknown as newInfoJson} />
            </Suspense>
            <Suspense fallback={null}>
              <Statistics statistics={statistics as unknown as newInfoJson} />
            </Suspense>
            <Suspense fallback={null}>
              <Process process={process as unknown as newInfoJson} />
            </Suspense>
            <Suspense fallback={null}>
              <FaqComponent faq={faq as unknown as newInfoJson} />
            </Suspense>
            <Suspense fallback={null}>
              <RelatedServices
                servicesRelated={
                  servicesRelated as unknown as ServicesType[] | undefined
                }
                servicesSection={relatedServices as unknown as newInfoJson}
              />
            </Suspense>
            <Suspense fallback={null}>
              <DeliveryType
                delivery={delivery as unknown as newInfoJson}
                category={servicesTr?.slug ?? ""}
                subServices={
                  servicesDetail.subServices as unknown as SubServicesType[]
                }
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
