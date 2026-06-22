"use client";
import { FaPlay, FaArrowRight } from "react-icons/fa";
import CustomImage from "../CustomImage";
import { YoutubeItems } from "@/services/interface/type";
import { getForCards } from "@/utils/getFullimageUrl";
import { IoPlayCircle } from "react-icons/io5";
import { useTranslations } from "next-intl";

export default function VideoCard({ item }: { item: YoutubeItems }) {
  const itemTr = item?.translations?.[0];
  const imageUrl = getForCards(item?.imageUrl);
  const t = useTranslations("atoms");
  return (
    <a
      href={item?.url}
      data-fancybox={`video-${item.id}`}
      className="group relative ] rounded-3xl overflow-hidden bg-white shadow-[0_8px_40px_-12px_rgba(28,30,41,0.12)] hover:shadow-[0_20px_60px_-12px_rgba(177,18,38,0.18)] transition-all duration-500"
    >
      <div className="relative aspect-16/10 overflow-hidden">
        {imageUrl ? (
          <CustomImage
            src={imageUrl}
            title={itemTr?.title ?? ""}
            fill
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 rounded-xl" />
        )}
        <div className="absolute inset-0 bg-linear-to-tfrom-setext-secondary/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="absolute top-4 left-4">
          <div className="w-10 h-10 rounded-xl bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-md group-hover:bg-primary transition-colors duration-300">
            <IoPlayCircle className="w-5 h-5 text-primary group-hover:text-white transition-colors duration-300" />
          </div>
        </div>

        {/* Center play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="size-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center group-hover:bg-primatext-primary group-hover:border-primatext-primary transition-all duration-300 shadow-lg">
            <FaPlay className="w-5 h-5 text-white ml-0.5" />
          </span>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <strong className="text-secondary block font-bold text-xl leading-tight  group-hover:text-primary transition-colors duration-300">
          {itemTr?.title ?? ""}
        </strong>

        {itemTr?.description && (
          <p className="text-secondary/60 text-sm leading-relaxed  line-clamp-2">
            {itemTr?.description ?? ""}
          </p>
        )}
        <div className="w-full inline-flex items-center justify-center gap-2.5 bg-tertiary group-hover:bg-primary rounded-2xl px-6 py-3.5 text-secondary group-hover:text-white font-semibold text-sm transition-all duration-300 group/btn">
          <FaPlay className="w-4 h-4 text-primary  group-hover:text-white transition-colors duration-300" />
          <span>{t("buttons.watch_on_youtube")}</span>
          <FaArrowRight className="w-3.5 h-3.5 group:translate-x-1 transition-transform duration-300" />
        </div>
      </div>
    </a>
  );
}
