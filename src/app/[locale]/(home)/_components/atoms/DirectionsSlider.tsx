"use client";
import DirectionsCard from "@/globalElement/cards/DirectionsCard";
import MySwiper from "@/lib/swiper";
import { DirectionsType } from "@/services/interface/type";
import { Autoplay } from "@fancyapps/ui";

interface Props {
  data: DirectionsType[];
}
export default function DirectionsSlider({ data }: Props) {
  const breakpoints = {
    0: { slidesPerView: 1 },
    768: { slidesPerView: 2 },
    1024: { slidesPerView: 3 },
  };
  const autoplayOptions = {
    delay: 3500,
    disableOnInteraction: false,
  };
  const keyboard = {
    enabled: true,
    onlyInViewport: false,
  };

  return (
    <div className="relative">
      <MySwiper
        modules={[Autoplay]}
        breakpoints={breakpoints}
        spaceBetween={24}
        slideToClickedSlide={false}
        watchSlidesProgress={false}
        centeredSlides={false}
        slidesPerView={3}
        autoplay={autoplayOptions}
        roundLengths={true}
        keyboard={keyboard}
        loop={true}
        slideClassName="h-full"
        items={data as unknown as DirectionsType[]}
        renderItem={(item: DirectionsType) => (
          <DirectionsCard key={item.id} item={item as DirectionsType} />
        )}
      />
    </div>
  );
}
