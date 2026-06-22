import { fetchWorkProcessInfo } from "@/actions/ui/main.controller";
import CustomImage from "@/globalElement/CustomImage";
import {
  CustomLocales,
  SectionLocale,
  WorkJson,
  WorkProcessItemTranslationType,
} from "@/services/interface/type";
import { getForCards } from "@/utils/getFullimageUrl";
import { parseJSON } from "@/utils/parseJson";
 

export default async function HowItWorksScroll({ locale }: SectionLocale) {
  const works = await fetchWorkProcessInfo(locale as CustomLocales);
  const worksTr = works?.translations?.[0] as
    | WorkProcessItemTranslationType
    | undefined;
  const description = parseJSON<WorkJson>(worksTr?.description)?.data;
  const imageUrl = getForCards(works?.imageUrl);
console.log("worksTr",worksTr)
  if (!works) return null;
  return (
    <section className="relative pb-10 lg:pb-20">
      <div className="w-full container">
        {/* TOP: Full-width Image */}
        <div className="relative w-full h-[220px] md:h-[320px] rounded-2xl overflow-hidden">
          {imageUrl ? (
            <CustomImage
              src={imageUrl}
              title={worksTr?.title as string}
              className="w-full h-full object-cover"
              fill
            />
          ) : (
            <div className="w-full h-full bg-gray-100 rounded-2xl" />
          )}
          <div className="absolute inset-0 rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-secondary/10 to-secfrom-secondary/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/30 via-transparent to-transparent" />
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div className="flex lg:items-stretch lg:flex-row flex-col gap-10 relative z-10">
          {/* LEFT: Red Card */}
          <div className="bg-primary lg:ml-5  order-2 lg:order-1  rounded-2xl mx-auto  p-6 md:p-8 lg:-mt-20 flex flex-col justify-between">
            {/* Steps — scrollable */}
            <div className="flex flex-col overflow-y-auto  scrollbar-none max-h-[360px] pr-1">
              {description &&
               description?.map((step: WorkJson, i: number) => (
                <div key={i} className="flex gap-4">
                  {/* Check + Line */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2.5"
                      >
                        <polyline points="20,6 9,17 4,12" />
                      </svg>
                    </div>
                    {i < description?.length - 1 && (
                      <div
                        className="w-px bg-white/20"
                        style={{ height: 40 }}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="pb-2 flex-1">
                    <p className="text-xs md:text-sm font-bold uppercase tracking-wide mt-0.5 leading-snug text-white">
                      {step.title}
                    </p>
                    <p className="text-xs mt-1 leading-relaxed text-white/60">
                      {step?.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Badge + Title + CTA */}
          <div className="flex  order-1 lg:order-2  flex-col justify-end pt-10   pb-2">
            <span className="inline-block bg-primary text-white text-[10px] font-bold tracking-[0.15em] uppercase px-5 py-2 rounded-full w-fit">
              How It Work
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-secondary uppercase tracking-tight mt-4 leading-[1.05]">
              From Order To
              <br />
              Delivery, Simplified
            </h2>
            <button className="mt-6 inline-flex items-center gap-3 bg-primary text-white px-6 py-3.5 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-[#d43d20] transition-colors duration-200 w-fit">
              Get Started
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="9,18 15,12 9,6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
