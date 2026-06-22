import { fetchDirections, fetchSectionByKeys } from "@/actions/ui/main.controller";
import SectionContentComponent from "@/components/SectionContent";
import DirectionsCard from "@/globalElement/cards/DirectionsCard";
import { DirectionsType, SectionLocale } from "@/services/interface/type";

export default async function HomeDirectionsSection({ locale }: SectionLocale) {
  const directions = await fetchDirections({ pageNumber: 1, locale });
  const sectionInfo = await fetchSectionByKeys({ key: "directions", locale });
  const sectionTr = sectionInfo?.translations?.[0];
  if (!directions?.data?.length || !sectionInfo?.translations?.length) return null;
 console.log(directions);
  return (
    <section className="pt-0 pb-20">
      <div className="container">
        <SectionContentComponent
          title={sectionTr?.title ?? ""}
          type="vertical"
          rootClass="[&_article]:max-w-4xl!"
          subTitle={sectionTr?.subTitle}
          description={sectionTr?.description ?? ""}
        />

        <div className="grid lg:grid-cols-3 gap-5">
          {directions?.data?.map((item, i) => {
            return <DirectionsCard key={i}  item={item as DirectionsType} />;
          })}
        </div>
      </div>
    </section>
  );
}
