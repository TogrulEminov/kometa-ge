// import { Link } from "@/i18n/navigation";
// import Image from "next/image";
// import { FaArrowRight } from "react-icons/fa";

// export default function DirectionsCard() {
//   return (
//     <Link
//       href={""}
//       className="group relative bg-white overflow-hidden border border-gray-100"
//     >
//       <div className="relative aspect-[16/10] overflow-hidden">
//         <Image
//           src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=500&fit=crop"
//           alt="Blog Post"
//           fill
//           className={`object-cover scale-100  group-hover:scale-110 transition-transform duration-700 ease-out `}
//           sizes="(max-width: 768px) 100vw, 50vw"
//         />
//         {/* Hover Overlay */}
//         <div
//           className={`absolute inset-0 group-hover:opacity-100 opacity-0 bg-primary/20 transition-opacity duration-500 `}
//         />
//       </div>

//       {/* Title Bar - Overlapping Image */}
//       <div
//         className={`relative mx-4 -mt-16 bg-white translate-y-0 group-hover:bg-primary group-hover:translate-y-0 p-6 transition-all duration-500 z-10`}
//       >
//         <h3
//           className={`text-base group-hover:text-white text-pribg-primary md:text-xl font-bold leading-tight transition-colors duration-500 `}
//         >
//           The Future of Freight: Trends to Watch
//         </h3>
//       </div>

//       {/* Description */}
//       <div className="px-6 py-4">
//         <p className="text-[#64748B] text-[15px] leading-relaxed line-clamp-4 min-h-20">
//           Discover how technology and automation are shaping the future of
//           freight transportation and boosting efficiency across industries.
//         </p>
//       </div>

//       {/* Button */}
//       <div className="px-6 pb-6">
//         <span
//           className={`inline-flex bg-secondary text-white group-hover:bg-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-pribg-primary/25 items-center gap-3 px-8 py-3.5 text-sm font-bold tracking-wider uppercase transition-all duration-500`}
//         >
//           Learn More
//           <FaArrowRight
//             className={`text-xs transition-transform group-hover:translate-x-1 duration-300 `}
//           />
//         </span>
//       </div>
//     </Link>
//   );
// }
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { JSX } from "react";
import CustomImage from "../CustomImage";
import { FaRoute } from "react-icons/fa";

type HeadingTag = "strong" | "h3";

interface CardProps {
  heading?: HeadingTag;
  className?: string;
}

export default function DirectionsCard({
  className,
  heading = "strong",
}: CardProps) {
  const Tag = heading as keyof JSX.IntrinsicElements;
  const isHeading = heading !== "strong";


  return (
    <Link href={""} className={`group relative block ${className}`}>
      <div className="relative mx-4">
        <div className="relative aspect-4/3 rounded-xl overflow-hidden shadow-lg">
          <CustomImage
            width={800}
            height={600}
            src={"https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=500&fit=crop"}
            title={""}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
          />
        </div>
        <div className="absolute -bottom-5 left-4 size-12 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shadow-lg z-10">
          <FaRoute size={20}/>
          </div>
      </div>

      <div className="mt-6 pt-6 pb-5 px-5 bg-white border border-gray-200 rounded-xl group-hover:border-primary group-hover:shadow-lg transition-all duration-300">
        <Tag
          {...(isHeading ? { title: "Lorem ipsum dolor sit." } : {})}
          className="text-base lg:text-lg  font-bold min-h-12 block text-secondary leading-snug mb-2 group-hover:text-primary transition-colors duration-300"
        >
          Lorem ipsum dolor sit.
        </Tag>

        <p className="text-xs text-accent-hover leading-relaxed line-clamp-2 mb-4">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis
          hic cum officia!
        </p>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#9CA3AF] group-hover:text-primary transition-colors duration-300 tracking-wider uppercase">
            Read More
          </span>
          <div className="h-px w-0 group-hover:w-8 bg-primary transition-all duration-500" />
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className="text-[#9CA3AF] group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 opacity-0 group-hover:opacity-100"
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
