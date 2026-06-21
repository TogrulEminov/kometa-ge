"use client";
import { FaChevronRight, FaTruck } from "react-icons/fa";
import CustomImage from "../CustomImage";
import { Link } from "@/i18n/navigation";
import { ServicesType } from "@/services/interface/type";
import { getForCards } from "@/utils/getFullimageUrl";
import { useTranslations } from "next-intl";

export default function ServiceCard({ item }: { item: ServicesType }) {
  const imageUrl = getForCards(item?.imageUrl);
  const transations = item.translations?.[0];
  const t = useTranslations("atoms");
  return (
    <Link
      href={`/services/${transations?.slug}`}
      className="group relative bg-white border border-gray-100 rounded-none overflow-hidden"
    >
      {/* Image Container */}
      <div className="relative aspect-4/3 overflow-hidden">
        <CustomImage
          src={imageUrl}
          title={"International Road Freight Transportation"}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-linear-to-t from-primary/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Icon Box - Overlapping Image */}
      <div className="relative -mt-10 mx-auto size-20 rounded-lg bg-white border-2  border-primary flex items-center justify-center transition-all duration-500 group-hover:border-solid group-hover:bg-[#C8102E] group-hover:scale-110 z-10">
        <span className="text-primary transition-colors duration-500 group-hover:text-white">
          <FaTruck size={40} />
        </span>
      </div>

      {/* Content */}
      <div className="px-6 pb-8 pt-4 text-center relative overflow-hidden">
        {/* Title - Always visible */}
        <h3 className="text-xl font-bold text-[#1E293B] mb-4 transition-transform duration-500 group-hover:-translate-y-1">
          {transations?.title}
        </h3>

        <div className="h-14! overflow-hidden">
          <p
            className={`text-[#64748B] opacity-100 line-clamp-2 translate-y-0 max-h-40 group-hover:opacity-0 group-hover:translate-y-4 group-hover:max-h-0 text-[15px] leading-relaxed transition-all duration-500`}
          >
            {transations?.shortDescription}
          </p>
          <div
            className={`transition-all opacity-0 translate-y-4 max-h-0 overflow-hidden duration-500 group-hover:opacity-100 group-hover:translate-y-0 group-hover:max-h-20 group-hover:mt-2`}
          >
            <span className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C8102E] text-white text-sm font-bold tracking-wider uppercase hover:bg-[#A00D24] transition-colors duration-300">
              {t("buttons.read_more")}
              <FaChevronRight className="text-xs" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
