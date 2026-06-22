import { fetchAboutHomeInfo } from "@/actions/ui/main.controller";
import CustomImage from "@/globalElement/CustomImage";
import { Link } from "@/i18n/navigation";
import {
  FileType,
  jsonItem,
  newInfoJson,
  SectionLocale,
} from "@/services/interface/type";
import { findJsonSection } from "@/utils/findJsonSection";
import { getForCards } from "@/utils/getFullimageUrl";
import { FaCheck } from "react-icons/fa";
import StatCountUp from "./atoms/StatCountUp";

export default async function HomeAboutComponent({ locale }: SectionLocale) {
  const aboutInfo = await fetchAboutHomeInfo({ locale });
  const aboutTr = aboutInfo?.translations?.[0] ?? null;
  const imageUrl = getForCards(aboutInfo?.imageUrl as FileType);

  const features = findJsonSection<newInfoJson>(
    aboutTr?.features as unknown,
    "advantages",
  );
  const statictis = findJsonSection<newInfoJson>(
    aboutTr?.features as unknown,
    "statistics",
  );

  if (!aboutTr) return null;
  return (
    <section className="pt-0 pb-20">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left — image + core values overlay */}
          <div className="relative rounded-2xl overflow-hidden">
            {imageUrl ? (
              <CustomImage
                width={700}
                height={500}
                src={imageUrl ?? ""}
                title={aboutTr?.title ?? ""}
                className="w-full h-[480px] object-cover"
              />
            ) : (
              <div className="w-full h-[480px] bg-gray-100 rounded-2xl" />
            )}
            {features?.title && (
              <div className="absolute bottom-4  left-4 w-fit  max-w-sm rounded-sm bg-[#B11226] px-7 py-6">
                <h3 className="text-white font-bold uppercase text-lg mb-4">
                  {features?.title ?? ""}
                </h3>
                {features?.items.length > 0 && (
                  <ul className="space-y-2">
                    {features?.items?.map((val: jsonItem) => (
                      <li
                        key={val.itemTitle}
                        className="flex items-center gap-3 text-white text-sm font-semibold uppercase tracking-wider"
                      >
                        <FaCheck size={13} className="shrink-0" />
                        {val.itemTitle ?? ""}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Right — text + stats */}
          <div className="flex flex-col space-y-6">
            {aboutTr?.subTitle && (
              <span className="inline-block w-fit bg-[#B11226] text-white text-xs font-semibold uppercase tracking-widest px-5 py-2 rounded-full">
                {aboutTr?.subTitle}
              </span>
            )}
            <h2 className="text-[#1C1E29] text-4xl lg:text-5xl font-bold uppercase leading-tight">
              Delivering Trust, One Route at a Time
            </h2>

            <p className="text-gray-500 text-sm leading-relaxed max-w-lg">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
              tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
            </p>

            <hr className="border-gray-200" />

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {statictis?.items?.slice(0, 3).map((stat: jsonItem) => (
                <div key={stat?.itemTitle} className="flex flex-col space-y-1">
                  <StatCountUp
                    value={stat.itemValue as string}
                    suffix={(stat.itemSuffix as string) ?? ""}
                    className="text-[#B11226] text-4xl font-bold"
                  />
                  <span className="text-[#1C1E29] text-xs font-semibold uppercase tracking-wider">
                    {stat.itemTitle}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 bg-[#1C1E29] hover:bg-[#B11226] text-white text-sm font-semibold uppercase tracking-wider px-6 py-3.5 rounded transition-colors duration-200"
              >
                Learn More <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
