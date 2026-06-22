import InnerBanner from "@/components/InnerBanner";
import {
  CategoryKey,
  CustomLocales,
  IContactInformation,
  ServicesType,
  Social,
  SubServicesType,
} from "@/services/interface/type";
import {
  fetchCategoriesByKey,
  fetchContactInformation,
  fetchRelatedSubServices,
  fetchServices,
  fetchServicesDetailMain,
  fetchSocials,
  fetchSubServices,
} from "@/actions/ui/main.controller";
import { notFound } from "next/navigation";
import ServicesSlugDetail from "../../_components/detail/ServicesSlugDetail";
import { Suspense } from "react";
interface PageProps {
  params: Promise<{ locale: string; category: string; slug: string }>;
}
export default async function ServicesPage({ params }: PageProps) {
  const { locale, category, slug } = await params;
  const servicesCategoryData = await fetchServicesDetailMain({
    locale: locale as CustomLocales,
    slug: slug,
  });
  const categoryData = await fetchCategoriesByKey({
    locale: locale as CustomLocales,
    key: CategoryKey.services,
  });
  const categoryTr = categoryData?.translations?.[0];
  const servicesSubData = await fetchSubServices({
    slug: slug,
    category: category,
    locale: locale as CustomLocales,
  });
  const servicesSubTr = servicesSubData?.translations?.[0];
  if (!servicesSubTr) return notFound();
  return (
    <>
      <InnerBanner
        title={servicesSubTr?.title ?? ""}
        subtitle={servicesSubTr?.shortDescription ?? ""}
        breadcrumbs={[
          {
            label: categoryTr?.title ?? "",
            href: `/services`,
          },
          {
            label: servicesCategoryData?.translations?.[0]?.title ?? "",
            href: `/services/${category}`,
          },
          { label: servicesSubTr?.title ?? "" },
        ]}
        variant="dark"
      />
      <Suspense fallback={null}>
        <Content
          servicesSubData={servicesSubData as unknown as SubServicesType}
          locale={locale as CustomLocales}
          category={category}
          slug={slug}
        />
      </Suspense>
    </>
  );
}
async function Content({
  servicesSubData,
  locale,
  category,
  slug,
}: {
  servicesSubData: SubServicesType;
  locale: CustomLocales;
  category: string;
  slug: string;
}) {
  const relatedSubServices = await fetchRelatedSubServices({
    slug: slug,
    category: category,
    locale: locale as CustomLocales,
  });
  const services = await fetchServices({
    locale: locale as CustomLocales,
    pageNumber: 1,
  });
  const contactInfo = await fetchContactInformation(locale as CustomLocales);
  const socials = await fetchSocials();

  return (
    <ServicesSlugDetail
      servicesDetail={servicesSubData as unknown as SubServicesType}
      relatedSubServices={relatedSubServices as unknown as SubServicesType[]}
      services={services?.data as unknown as ServicesType[]}
      contactInfo={contactInfo as unknown as IContactInformation}
      socials={socials as unknown as Social[]}
    />
  );
}
