"use client";

import ReactFancyBox from "@/lib/fancybox";
import { FaPlay } from "react-icons/fa";

interface HeroVideoPlayProps {
  videoUrl: string;
  mimeType?: string | null;
}

export default function HeroVideoPlay({
  videoUrl,
  mimeType,
}: HeroVideoPlayProps) {
  return (
    <ReactFancyBox
      options={{
        Carousel: {
          Video: {
            autoplay: true,
          },
        },
      }}
    >
      <a
        href={videoUrl}
        data-fancybox="hero-video"
        data-type="html5video"
        data-html5video-format={mimeType ?? "video/mp4"}
        data-width="1280"
        data-height="720"
        aria-label="Play video"
        className="w-12 h-12 rounded-full border-2 border-white/60 hover:border-white flex items-center justify-center text-white hover:bg-white/10 transition-all duration-200"
      >
        <FaPlay size={14} className="ml-0.5" />
      </a>
    </ReactFancyBox>
  );
}
