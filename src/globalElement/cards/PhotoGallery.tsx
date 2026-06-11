import { IoImages, IoExpand } from "react-icons/io5";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import CustomImage from "../CustomImage";
import { useId } from "react";

export default function GalleryCardV2EB() {
  const items = [
    "https://i.pinimg.com/1200x/3c/b5/1d/3cb51dfd375a28c107f269b1d500a650.jpg",
    "https://i.pinimg.com/1200x/b7/00/69/b700691f6d7959b58a007207a1712ac7.jpg",
    "https://i.pinimg.com/1200x/c5/ee/66/c5ee665dd62bba8dc4c32ee642f9c5b5.jpg",
  ];
  const id = useId();
  return (
    <article className="group relative rounded-2xl overflow-hidden bg-slate-900 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
      <a href={""} className="relative block aspect-4/3 overflow-hidden">
        <CustomImage
          title={""}
          loading="lazy"
          width={600}
          height={450}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          src={
            "https://i.pinimg.com/736x/38/59/30/38593081598d640c22f8ca34b6739e11.jpg"
          }
        />

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
              <h3 className="text-sm font-bold text-white leading-snug line-clamp-1">
                Lorem ipsum dolor sit amet.
              </h3>
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
            <IoImages className="w-3 h-3" />5
          </span>
        </div>
      </a>

      {/* Hidden Images */}
      <div className="hidden" aria-hidden="true">
        {items.map((img, index) => (
          <a key={index} href={img} data-fancybox={id} tabIndex={-1}>
            <span className="sr-only">Şəkil {index + 2}</span>
          </a>
        ))}
      </div>
    </article>
  );
}
