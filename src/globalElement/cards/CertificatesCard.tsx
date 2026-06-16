import { FaAward, FaExpand } from "react-icons/fa";
import { IoMdArrowForward } from "react-icons/io";
import Link from "next/link";
import { useTranslations } from "next-intl";
import CustomImage from "../CustomImage";
import { useId } from "react";

export default function CertificateCardV5() {
  const t = useTranslations("atoms");
  const id = useId();

  const image =
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80";

  return (
    <div className="group relative rounded-2xl overflow-hidden transition-all duration-500">
      <div className="relative h-72 overflow-hidden">
        <CustomImage
          title="ISO 9001:2015 Certificate"
          loading="lazy"
          width={400}
          height={500}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          src={image}
        />

        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-colors duration-500" />

        <a
          href={image}
          data-fancybox={`certificate-${id}`}
          className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:border-primary"
        >
          <FaExpand className="w-4 h-4 text-white" />
        </a>

        <div className="absolute inset-x-4 bottom-4 bg-white/40 backdrop-blur-xl rounded-xl p-4 border border-white/20">
          <strong className="text-base font-bold text-white mb-1 block">
            ISO 9001:2015 Quality Management
          </strong>

          <p className="text-sm text-white/70 mb-3">
            International certification demonstrating compliance with quality
            management standards.
          </p>

          <a
            href={image}
            data-fancybox={`certificate-${id}`}
            className="flex items-center justify-between w-full bg-white/10 hover:bg-primary/80 rounded-lg p-2.5 transition-all duration-300 border border-white/10 hover:border-primary"
          >
            <div className="flex items-center gap-2">
              <FaAward className="w-4 h-4 text-primary-light" />

              <span className="text-xs font-semibold text-white">
                View certificate
              </span>
            </div>

            <IoMdArrowForward className="w-4 h-4 text-white/60 transition-all group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </div>
  );
}
