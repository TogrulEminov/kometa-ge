import InnerBanner from "@/components/InnerBanner";
import ServicesCategoryDetail from "../_components/detail/ServicesCategoryDetail";
import {
  fetchCategoriesByKey,
  fetchContactInformation,
  fetchServices,
  fetchServicesDetailMain,
  fetchServicesRelated,
  fetchSocials,
} from "@/actions/ui/main.controller";
import {
  CategoryKey,
  CustomLocales,
  IContactInformation,
  ServicesType,
  Social,
} from "@/services/interface/type";
import { notFound } from "next/navigation";
import { Suspense } from "react";
interface PageProps {
  params: Promise<{ locale: string; category: string }>;
}
export default async function ServicesCategory({ params }: PageProps) {
  const { category, locale } = await params;
  const categoryData = await fetchCategoriesByKey({
    locale: locale as CustomLocales,
    key: CategoryKey.services,
  });
  const categoryTr = categoryData?.translations?.[0];

  const servicesCategoryData = await fetchServicesDetailMain({
    locale: locale as CustomLocales,
    slug: category,
  });

  const servicesTr = servicesCategoryData?.translations?.[0];

  if (!servicesTr) return notFound();
  return (
    <>
      <InnerBanner
        title={servicesTr?.title ?? ""}
        subtitle={servicesTr?.shortDescription ?? ""}
        breadcrumbs={[
          { label: categoryTr?.title ?? "", href: "/services" },
          { label: servicesTr?.title ?? "" },
        ]}
        variant="dark"
      />
      <Suspense fallback={null}>
        <Content
          servicesCategoryData={servicesCategoryData as unknown as ServicesType}
          locale={locale as CustomLocales}
          category={category}
        />
      </Suspense>
    </>
  );
}

async function Content({
  servicesCategoryData,
  locale,
  category,
}: {
  servicesCategoryData: ServicesType;
  locale: CustomLocales;
  category: string;
}) {
  const socials = await fetchSocials();
  const contactInfo = await fetchContactInformation(locale as CustomLocales);
  const servicesRelated = await fetchServicesRelated({
    category: category,
    locale: locale as CustomLocales,
  });
  const services = await fetchServices({
    locale: locale as CustomLocales,
    pageNumber: 1,
  });


  console.log(servicesCategoryData);
  return (
    <ServicesCategoryDetail
      socials={socials as unknown as Social[]}
      contactInfo={contactInfo as unknown as IContactInformation}
      services={services?.data as unknown as ServicesType[]}
      servicesDetail={servicesCategoryData as unknown as ServicesType}
      servicesRelated={servicesRelated as unknown as ServicesType[] | undefined}
    />
  );
}
