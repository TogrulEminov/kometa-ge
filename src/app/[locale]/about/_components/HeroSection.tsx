import CustomImage from "@/globalElement/CustomImage";
import { highlightActiveWord } from "@/utils/highlight";
import StatCard from "./atoms/StatCard";
import {
  AboutMainType,
  FileType,
  jsonItem,
  newInfoJson,
} from "@/services/interface/type";
import { findJsonSection } from "@/utils/findJsonSection";
import { sanitizeHtml } from "@/lib/domburify";
import { getForCards } from "@/utils/getFullimageUrl";
export default function HeroSection({
  aboutInfo,
}: {
  aboutInfo: AboutMainType;
}) {
  const aboutInfoTr = aboutInfo?.translations?.[0];
  const statistics = findJsonSection<newInfoJson>(
    aboutInfoTr?.description,
    "statistics",
  );

  const imageUrl = getForCards(aboutInfo?.imageUrl as FileType);
  return (
    <section className="relative bg-white overflow-hidden py-10 lg:py-20 border-b border-b-tertiary">
      <div className="container ">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-9 space-y-5">
            {aboutInfoTr?.subTitle && (
              <span className="text-sm block w-fit font-medium bg-primary text-white px-4 rounded-full py-2 tracking-wide">
                {aboutInfoTr?.subTitle}
              </span>
            )}
            <h1 className="text-secondary text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1]  max-w-4xl">
              {highlightActiveWord({
                activeWord: aboutInfoTr?.hightlight ?? "",
                activeWordClassName: "text-primary relative",
                text: aboutInfoTr?.title,
              })}
            </h1>
            {aboutInfoTr?.shortDescription && (
              <div
                className="border-l-[3px] border-secondary pl-6  max-w-3xl prose"
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(aboutInfoTr?.shortDescription),
                }}
              />
            )}
          </div>

          <div className="col-span-12 lg:col-span-3 flex flex-row flex-wrap lg:flex-col gap-4 lg:gap-6 lg:pt-20">
            {statistics?.items.map((stat: jsonItem, i) => {
              if (!stat.itemValue || !stat.itemTitle || !stat.itemSuffix)
                return null;
              return (
                <StatCard
                  value={Number(stat.itemValue)}
                  label={stat.itemTitle}
                  key={i}
                  suffix={stat.itemSuffix as string}
                />
              );
            })}
          </div>
        </div>

        <figure className="relative rounded-2xl overflow-hidden mt-8">
          {imageUrl ? (
            <CustomImage
              src={imageUrl}
              title={aboutInfoTr?.title as string}
              width={1400}
              height={600}
              className="w-full h-75 sm:h-100 lg:h-125 object-cover"
              priority
            />
          ) : (
            <div className="w-full h-75 sm:h-100 lg:h-125 bg-gray-100 rounded-2xl" />
          )}
        </figure>
      </div>
    </section>
  );
}
