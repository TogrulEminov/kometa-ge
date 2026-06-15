"use client";

import { FaPlay, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import CustomImage from "../CustomImage";
import Link from "next/link";

export default function VideoCard() {
  return (
    <Link
      href={
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=640&h=400&fit=crop"
      }
      data-fancybox="gallery"
      className="group relative ] rounded-3xl overflow-hidden bg-white shadow-[0_8px_40px_-12px_rgba(28,30,41,0.12)] hover:shadow-[0_20px_60px_-12px_rgba(177,18,38,0.18)] transition-all duration-500"
    >
      <div className="relative aspect-16/10 overflow-hidden">
        <CustomImage
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=640&h=400&fit=crop"
          title="Video thumbnail"
          fill
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-linear-to-tfrom-setext-secondary/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="absolute top-4 left-4">
          <div className="w-10 h-10 rounded-xl bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-md group-hover:bg-primary transition-colors duration-300">
            <svg
              className="w-5 h-5 text-primary group-hover:text-white transition-colors duration-300"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </div>
        </div>

        {/* Center play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="size-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center group-hover:bg-primatext-primary group-hover:border-primatext-primary transition-all duration-300 shadow-lg">
            <FaPlay className="w-5 h-5 text-white ml-0.5" />
          </span>
        </div>
      </div>

      <div className="p-6">
        <strong className="text-secondary block font-bold text-xl leading-tight mb-3 group-hover:text-primary transition-colors duration-300">
          High-Performance Summer Tires
        </strong>

        <p className="text-secondary/60 text-sm leading-relaxed mb-5 line-clamp-2">
          Premium təkərlərin idman avtomobillərində yol tutuşu və təhlükəsizlik
          testləri.
        </p>

        <div className="w-full inline-flex items-center justify-center gap-2.5 bg-tertiary group-hover:bg-primary rounded-2xl px-6 py-3.5 text-secondary group-hover:text-white font-semibold text-sm transition-all duration-300 group/btn">
          <FaPlay className="w-4 h-4 text-primary  group:text-white transition-colors duration-300" />
          <span>YouTube-da İzlə</span>
          <FaArrowRight className="w-3.5 h-3.5 group:translate-x-1 transition-transform duration-300" />
        </div>
      </div>
    </Link>
  );
}
