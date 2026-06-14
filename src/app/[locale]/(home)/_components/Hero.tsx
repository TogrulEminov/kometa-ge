"use client";

import CustomImage from "@/globalElement/CustomImage";
import ReactFancyBox from "@/lib/fancybox";
import CustomLink from "next/link";
import { FaBox, FaPlay, FaSearch } from "react-icons/fa";
import { Link } from "@/i18n/navigation";

const ourBranches = [
  {
    href: "https://profitransport.az",
    path: "/assets/profi.svg",
  },
  {
    href: "https://kometa.kz/",
    path: "/assets/kometa-kz.svg",
  },
  ,
];

export default function HomeHeroComponent() {
  return (
    <section className="relative lg:h-200 flex flex-col justify-start items-start">
      <div className="absolute inset-0 z-0">
        <CustomImage
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
          title=""
          src="https://res.cloudinary.com/da403zlyf/image/upload/v1781109661/24177_tmmacv.jpg"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>
      <div className="relative z-10  h-full flex-1 container flex justify-start items-start">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-10 lg:gap-12 w-full pt-36 lg:pt-45 pb-16">
          {/* Left */}
          <article className="flex flex-col justify-center  max-w-2xl space-y-6">
            <span className="inline-block w-fit bg-[#B11226] text-white text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full">
              Welcome to Kometa GE
            </span>

            <h1 className="text-white text-2xl lg:text-4xl font-bold leading-tight uppercase">
              International freight transportation and logistics services
            </h1>

            <div className="flex items-center gap-4 pt-2">
              <Link
                href="/contact"
                className="flex items-center gap-2 bg-[#B11226] hover:bg-[#8f0e1e] text-white text-sm font-semibold uppercase tracking-wider px-6 py-3.5 rounded transition-colors duration-200"
              >
                Book Shipment
                <span className="text-base">›</span>
              </Link>

              <ReactFancyBox>
                <Link
                  href="https://res.cloudinary.com/da403zlyf/video/upload/v1781110386/ce1860c2-2a4d-4118-9152-25a9604df985_f648e617-ba43-4d92-b806-dc35cc7fb71c_1_gzkhk7.mp4"
                  data-fancybox="video"
                  className="w-12 h-12 rounded-full border-2 border-white/60 hover:border-white flex items-center justify-center text-white hover:bg-white/10 transition-all duration-200"
                >
                  <FaPlay size={14} className="ml-0.5" />
                </Link>
              </ReactFancyBox>
            </div>
          </article>

          {/* Right */}
          <div className="flex flex-col justify-center space-y-4">
            {/* Avatars */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {ourBranches.map((src, i) => (
                  <CustomLink
                    key={i}
                    href={src?.href || "#"}
                    target="_blank"
                    className="size-12 p-2 border-2 border-white rounded-full bg-white flex items-center justify-center"
                  >
                    <img
                      key={i}
                      src={src?.path}
                      alt=""
                      className="object-contain"
                    />
                  </CustomLink>
                ))}
                <div className="size-12 rounded-full border-2 border-white bg-[#B11226] flex items-center justify-center text-white font-bold text-lg">
                  +
                </div>
              </div>
            </div>

            <p className="text-white/80 text-sm leading-relaxed max-w-md">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut
            </p>
            <div className="lg:max-w-lg">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 md:px-2 shadow-2xl shadow-black/20">
                <form className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white">
                      <FaBox className="text-lg" />
                    </div>
                    <input
                      type="text"
                      placeholder="Enter your tracking id"
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-[15px] font-medium focus:outline-none focus:border-white/50 focus:bg-white/10 transition-all duration-300"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-8 py-4 bg-linear-to-r bg-primary text-white font-bold text-base tracking-wider capitalize rounded-xl transition-all duration-300 hover:shadow-lg  disabled:opacity-60 disabled:cursor-not-allowed  flex items-center cursor-pointer justify-center gap-3 min-w-30"
                  >
                    <FaSearch className="text-sm" />
                    Track
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
