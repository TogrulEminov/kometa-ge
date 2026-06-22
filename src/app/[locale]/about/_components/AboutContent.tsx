import { sanitizeHtml } from "@/lib/domburify";
import { AboutMainType, newInfoJson } from "@/services/interface/type";
import { findJsonSection } from "@/utils/findJsonSection";
import { getForCards } from "@/utils/getFullimageUrl";
import Image from "next/image";

export default function AboutContent({
  aboutInfo,
}: {
  aboutInfo: AboutMainType;
}) {
  const aboutInfoTr = aboutInfo?.translations?.[0];
  const mainDescription = findJsonSection<newInfoJson>(
    aboutInfoTr?.description ?? "",
    "main",
  );
  const benefits = findJsonSection<newInfoJson>(
    aboutInfoTr?.description ?? "",
    "benefits",
  );
  return (
    <div className="space-y-20">
      <div id={`section-${mainDescription?.type}`} className="reveal">
        {aboutInfo?.gallery && aboutInfo?.gallery?.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {aboutInfo?.gallery?.map((item) => {
              const imageUrl = getForCards(item);
              if (!imageUrl) return null;
              return (
                <div
                  className="image-reveal rounded-lg overflow-hidden"
                  key={item.id}
                >
                  <Image
                    src={imageUrl}
                    alt={aboutInfoTr?.title ?? ""}
                    width={500}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>
              );
            })}
          </div>
        )}
        {mainDescription?.subTitle && (
          <span className="text-sm font-medium text-primary mb-4 tracking-wide uppercase">
            {mainDescription?.subTitle}
          </span>
        )}
        {mainDescription?.title && (
          <h2
            title={mainDescription?.title}
            className="font-display text-4xl font-bold mb-6"
          >
            {mainDescription?.title}
          </h2>
        )}
        {mainDescription?.description && (
          <article
            className="text-gray-500 leading-relaxed text-lg mb-4"
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(mainDescription?.description),
            }}
          />
        )}
      </div>
      {benefits && (
        <div id={`section-${benefits?.type}`} className="reveal">
          {benefits?.subTitle && (
            <span className="text-sm font-medium text-primary mb-4 tracking-wide uppercase">
              {benefits?.subTitle}
            </span>
          )}
          <h2
            title={benefits?.title}
            className="font-display text-4xl font-bold mb-6"
          >
            {benefits?.title}
          </h2>
          {benefits?.description && (
            <article
              className="text-gray-500 leading-relaxed text-lg mb-4"
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(benefits?.description),
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
