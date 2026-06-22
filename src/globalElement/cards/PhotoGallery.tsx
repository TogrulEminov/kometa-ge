import { IoImages, IoExpand } from "react-icons/io5";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import CustomImage from "../CustomImage";
import { PhotoGalleryType } from "@/services/interface/type";
import { getForCards } from "@/utils/getFullimageUrl";

export default function GalleryCardV2EB({ item }: { item: PhotoGalleryType }) {
  const itemTr = item?.translations?.[0];
  const imageUrl = getForCards(item?.imageUrl);
  const galleryGroup = `photo-gallery-${item.id}`;
  const galleryCount = (item?.gallery?.length ?? 0) + 1;

  return (
    <article className="group relative rounded-2xl overflow-hidden bg-slate-900 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
      <a
        href={imageUrl}
        data-fancybox={galleryGroup}
        className="relative block aspect-4/3 overflow-hidden"
      >
        {imageUrl ? (
          <CustomImage
            title={itemTr?.title ?? ""}
            loading="lazy"
            width={600}
            height={450}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            src={imageUrl ?? ""}
          />
        ) : (
          <div className="w-full h-full bg-gray-100 rounded-2xl" />
        )}
        {/* Dark overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500" />

        {/* Floating bottom panel - appears with gap */}
        <div className="absolute inset-x-4 bottom-4 bg-slate-900/80 backdrop-blur-xl rounded-xl p-4 translate-y-[calc(100%+1rem)] group-hover:translate-y-0 transition-transform duration-500 ease-out">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <IoImages className="w-3.5 h-3.5 text-primary" />
                <span className="text-white text-xs font-bold"></span>
              </div>
              <strong className="text-sm block font-bold text-white leading-snug line-clamp-1">
                {itemTr?.title ?? ""}
              </strong>
            </div>

            <span className="shrink-0 w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30 hover:scale-110 transition-transform">
              <FaArrowUpRightFromSquare className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Top expand - clean */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <span className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary transition-colors">
            <IoExpand className="w-5 h-5" />
          </span>
        </div>

        {/* Top left count - minimal */}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center gap-1.5 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs font-medium">
            <IoImages className="w-3 h-3" />
            {galleryCount}
          </span>
        </div>
      </a>

      {/* Extra gallery images for Fancybox carousel */}
      {item.gallery?.map((img, index) => {
        const galleryImageUrl = getForCards(img);
        if (!galleryImageUrl) return null;

        return (
          <a
            key={img.id ?? index}
            href={galleryImageUrl}
            data-fancybox={galleryGroup}
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
          >
            Şəkil {index + 2}
          </a>
        );
      })}
    </article>
  );
}
