import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";

export default function DirectionsCard() {
  return (
    <Link
      href={""}
      className="group relative bg-white overflow-hidden border border-gray-100"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=500&fit=crop"
          alt="Blog Post"
          fill
          className={`object-cover scale-100  group-hover:scale-110 transition-transform duration-700 ease-out `}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {/* Hover Overlay */}
        <div
          className={`absolute inset-0 group-hover:opacity-100 opacity-0 bg-primary/20 transition-opacity duration-500 `}
        />
      </div>

      {/* Title Bar - Overlapping Image */}
      <div
        className={`relative mx-4 -mt-16 bg-white translate-y-0 group-hover:bg-primary group-hover:translate-y-0 p-6 transition-all duration-500 z-10`}
      >
        <h3
          className={`text-base group-hover:text-white text-pribg-primary md:text-xl font-bold leading-tight transition-colors duration-500 `}
        >
          The Future of Freight: Trends to Watch
        </h3>
      </div>

      {/* Description */}
      <div className="px-6 py-4">
        <p className="text-[#64748B] text-[15px] leading-relaxed line-clamp-4 min-h-20">
          Discover how technology and automation are shaping the future of
          freight transportation and boosting efficiency across industries.
        </p>
      </div>

      {/* Button */}
      <div className="px-6 pb-6">
        <span
          className={`inline-flex bg-secondary text-white group-hover:bg-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-pribg-primary/25 items-center gap-3 px-8 py-3.5 text-sm font-bold tracking-wider uppercase transition-all duration-500`}
        >
          Learn More
          <FaArrowRight
            className={`text-xs transition-transform group-hover:translate-x-1 duration-300 `}
          />
        </span>
      </div>
    </Link>
  );
}
