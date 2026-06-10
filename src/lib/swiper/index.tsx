"use client";
import React, { forwardRef } from "react";
import "swiper/swiper-bundle.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";

import { SwiperProps as SwiperCoreProps, SwiperRef } from "swiper/react";
import { Swiper, SwiperSlide } from "swiper/react";

interface MySwiperProps<T> extends SwiperCoreProps {
  items?: T[];
  renderItem?: (item: T, index: number) => React.ReactNode;
  slideClassName?: string;
}

function MySwiperInner<T>(
  { children, items, renderItem, slideClassName, ...props }: MySwiperProps<T>,
  ref: React.ForwardedRef<SwiperRef>,
) {
  return (
    <Swiper
      ref={ref}
      observer={false} // ← reflow azaldır
      observeParents={false} // ← reflow azaldır
      resizeObserver={true} // ← offsetWidth əvəzinə ResizeObserver istifadə edir
      {...props}
    >
      {items && renderItem
        ? items.map((item, index) => (
            <SwiperSlide key={index} className={slideClassName}>
              {renderItem(item, index)}
            </SwiperSlide>
          ))
        : children}
    </Swiper>
  );
}

const MySwiper = forwardRef(MySwiperInner) as <T>(
  props: MySwiperProps<T> & { ref?: React.ForwardedRef<SwiperRef> },
) => React.ReactElement;

export default MySwiper;
