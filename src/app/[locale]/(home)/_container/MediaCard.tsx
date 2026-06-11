"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FaPlay, FaExpand, FaImage, FaVideo } from "react-icons/fa";
import SectionContentComponent from "@/components/SectionContent";
import ReactFancyBox from "@/lib/fancybox";
import Link from "next/link";
import GalleryCardV2EB from "@/globalElement/cards/PhotoGallery";

export function PhotoCard() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={
        "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&h=450&fit=crop"
      }
      data-fancybox="gallery"
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg shadow-black/5 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&h=450&fit=crop"
          alt="Gallery Photo"
          fill
          className={`object-cover transition-all duration-700 ease-out ${
            isHovered ? "scale-110" : "scale-100"
          }`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-[#0F172A]/20 to-transparent transition-opacity duration-500 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Type Badge */}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-[#1E3A5F] text-xs font-bold tracking-wider uppercase rounded-lg">
            <FaImage className="text-[10px]" />
            Photo
          </span>
        </div>

        {/* Expand Icon - Center */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`w-16 h-16 rounded-full bg-[#C8102E] flex items-center justify-center transition-all duration-500 ${
              isHovered ? "scale-100 rotate-0" : "scale-0 rotate-45"
            }`}
          >
            <FaExpand className="text-white text-lg" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-[#0F172A] group-hover:text-[#C8102E] transition-colors duration-300 mb-2 line-clamp-1">
          Port Terminal Operations
        </h3>
        <p className="text-[#64748B] text-sm leading-relaxed line-clamp-2">
          International freight terminal with modern container handling
          equipment and logistics infrastructure.
        </p>
      </div>
    </Link>
  );
}

// ===== MEDIA SECTION (Full) =====
export default function MediaSection() {
  return (
    <section className="w-full pb-10  pt-10 lg:pt-20 border-t border-t-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <SectionContentComponent
          title="Photo & Video Gallery"
          description="Images showcasing Kometa GE’s operations, projects, and logistics activities."
          subTitle={"Media"}
          type="vertical"
        />
        <ReactFancyBox className="grid gap-5 grid-cols-3">
          <GalleryCardV2EB />
          <GalleryCardV2EB />
          <GalleryCardV2EB />
        </ReactFancyBox>
      </div>
    </section>
  );
}
