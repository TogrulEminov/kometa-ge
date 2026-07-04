 
import { Link } from "@/i18n/navigation";
import { JSX } from "react";
import CustomImage from "../CustomImage";
import { FaRoute } from "react-icons/fa";
import { DirectionsType } from "@/services/interface/type";
import { getForCards } from "@/utils/getFullimageUrl";
import { useTranslations } from "next-intl";
import { directionDetailHref } from "@/i18n/href";

type HeadingTag = "strong" | "h3";

interface CardProps {
  heading?: HeadingTag;
  className?: string;
  item: DirectionsType;
}

export default function DirectionsCard({
  className,
  heading = "strong",
  item,
}: CardProps) {
  const itemTr = item?.translations?.[0];
  const imageUrl = getForCards(item?.imageUrl);
  const Tag = heading as keyof JSX.IntrinsicElements;
  const isHeading = heading !== "strong";
  const t = useTranslations("atoms");
  return (
    <Link
      href={directionDetailHref(itemTr?.slug ?? "")}
      className={`group relative block ${className}`}
    >
      <div className="relative mx-4">
        <div className="relative aspect-4/3 rounded-xl overflow-hidden shadow-lg">
          {imageUrl ? (
            <CustomImage
              width={800}
              height={600}
              src={imageUrl}
              title={itemTr?.title ?? ""}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-surface-elevated rounded-xl" />
          )}
        </div>
        <div className="absolute -bottom-5 left-4 size-12 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shadow-lg z-10">
          <FaRoute size={20} />
        </div>
      </div>

      <div className="mt-6 pt-6 pb-5 px-5 bg-surface border border-white/10 rounded-xl group-hover:border-primary group-hover:shadow-[0_16px_40px_rgba(177,18,38,0.18)] transition-all duration-300">
        <Tag
          {...(isHeading ? { title: itemTr?.title ?? "" } : {})}
          className="text-base lg:text-lg font-bold min-h-12 block text-foreground leading-snug mb-2 group-hover:text-primary transition-colors duration-300"
        >
          {itemTr?.title ?? ""}
        </Tag>

        <p className="text-xs text-muted leading-relaxed line-clamp-2 mb-4">
          {itemTr?.shortDescription ?? ""}
        </p>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted group-hover:text-primary transition-colors duration-300 tracking-wider uppercase">
            {t("buttons.read_more")}
          </span>
          <div className="h-px w-0 group-hover:w-8 bg-primary transition-all duration-500" />
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className="text-muted group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 opacity-0 group-hover:opacity-100"
          >
            <path
              d="M3 6H9M9 6L6 3M9 6L6 9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}
