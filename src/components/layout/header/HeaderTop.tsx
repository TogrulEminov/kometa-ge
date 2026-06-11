import { cn } from "@/utils/cn";
import { availableIcons, renderSocialIcon } from "@/utils/renderSocialIcon";
import Link from "next/link";
import React, { Dispatch, SetStateAction } from "react";
import { FaEnvelope, FaMap, FaPhoneAlt } from "react-icons/fa";

export default function HeaderTop({
  isSticky,

}: {
  isSticky: boolean;

}) {
  return (
    <div
      className={cn(
        "bg-[#B11226] py-3 lg:block hidden duration-300 transition-all",
        isSticky && "max-h-0 py-0 overflow-hidden opacity-0 invisible",
      )}
    >
      <div className="container flex items-center justify-between">
        <ul className="flex items-center gap-4 text-white text-sm">
          <li className="flex items-center gap-1.5">
            <FaPhoneAlt size={16} />
            <a href="tel:+994552624037" className="hover:underline">
              +994 55 262 40 37
            </a>
          </li>
          <li className="hidden sm:flex items-center gap-1.5">
            <FaEnvelope size={16} />
            <a
              href="mailto:togruleminov3@gmail.com"
              className="hover:underline"
            >
              togruleminov3@gmail.com
            </a>
          </li>
          <li className="hidden md:flex items-center gap-1.5">
            <FaMap size={16} />
            <span>Georgia</span>
          </li>
        </ul>

        <ul className="flex items-center gap-3 text-white">
          {availableIcons?.slice(0, 4).map((item) => (
            <li key={item.label}>
              <Link
                href=""
                target="_blank"
                className="hover:text-white/70 transition-colors duration-200"
              >
                {renderSocialIcon({
                  iconName: item.value,
                  fill: "currentColor",
                })}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
