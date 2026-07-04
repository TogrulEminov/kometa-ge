"use client";
import ServiceCard from "@/globalElement/cards/ServicesCard";
import MySwiper from "@/lib/swiper";
import { ServicesType } from "@/services/interface/type";
import { Autoplay } from "@fancyapps/ui";

interface Props {
  data: ServicesType[];
}
export default function ServicesSlider({ data }: Props) {
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
        items={data as unknown as ServicesType[]}
        renderItem={(item: ServicesType) => (
          <ServiceCard key={item.id} item={item as ServicesType} />
        )}
      />
    </div>
  );
}
