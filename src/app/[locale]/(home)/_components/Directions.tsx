import {
  fetchDirections,
  fetchSectionByKeys,
} from "@/actions/ui/main.controller";
import SectionContentComponent from "@/components/SectionContent";
import { DirectionsType, SectionLocale } from "@/services/interface/type";
import DirectionsSlider from "./atoms/DirectionsSlider";
import DirectionsSliderFallback from "./fallbacks/DirectionsSliderFallback";
import { Suspense } from "react";

export default async function HomeDirectionsSection({ locale }: SectionLocale) {
  const directions = await fetchDirections({ pageNumber: 1, locale });
  const sectionInfo = await fetchSectionByKeys({ key: "directions", locale });
  const sectionTr = sectionInfo?.translations?.[0];
  if (!directions?.data?.length || !sectionInfo?.translations?.length)
    return null;

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

        <Suspense fallback={<DirectionsSliderFallback />}>
          <DirectionsSlider
            data={directions?.data as unknown as DirectionsType[]}
          />
        </Suspense>
      </div>
    </section>
  );
}
