import { fetchFag, fetchSectionByKeys } from "@/actions/ui/main.controller";
import SectionContentComponent from "@/components/SectionContent";
import { Link } from "@/i18n/navigation";
import { CustomLocales, SectionLocale } from "@/services/interface/type";
import { FaQuestion } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import { getTranslations } from "next-intl/server";
import { sanitizeHtml } from "@/lib/domburify";

export default async function FAQSplitServer({ locale }: SectionLocale) {
  const faqData = await fetchFag({ locale });
  const t = await getTranslations("atoms.components.fag");
  const sectionContent = await fetchSectionByKeys({
    key: "faq",
    locale: locale as CustomLocales,
  });
  const sectionContentTr = sectionContent?.translations?.[0];
  if (!faqData?.length || !sectionContentTr) return null;
  return (
    <section className="w-full py-10 border-b border-b-gray-200 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* LEFT: Sticky Header */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <SectionContentComponent
                description={sectionContentTr?.description ?? ""}
                title={sectionContentTr?.title ?? ""}
                type="vertical"
                highlightWord={sectionContentTr?.highlightWord ?? ""}
                subTitle={sectionContentTr?.subTitle ?? ""}
              />
              <div className="animate-fade-in-up delay-400 mt-8">
                <p className="text-gray-400 text-sm mb-4">
                  {t("still_have_questions")}
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-primary text-white font-bold text-sm uppercase tracking-wider px-6 py-3 rounded-lg shadow-md hover:bg-[#8f0e1f] transition-all duration-300 hover:gap-3"
                >
                  {t("contact_us")}
                  <FaArrowRightLong className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT: FAQ Items */}
          <div className="lg:col-span-7 space-y-4">
            {faqData.map((item) => {
              const itemTr = item?.translations?.[0];
              if (!itemTr?.description) return null;
              return (
                <details key={item.id} className="faq-item group">
                  <summary className="faq-card cursor-pointer rounded-2xl border border-gray-100 bg-tertiary">
                    <div className="flex items-center justify-between gap-4 p-6 md:p-7">
                      <div className="flex items-center gap-4">
                        {/* Question Icon */}
                        <FaQuestion className="text-primary group-open:text-white transition-colors duration-300" />

                        <strong className="faq-question text-base md:text-lg font-bold text-secondary">
                          {itemTr?.title ?? ""}
                        </strong>
                      </div>

                      <div className="chevron-container shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <svg
                          className="chevron-icon w-3 h-3 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Answer */}
                    <div className="faq-answer">
                      <div className="faq-answer-inner">
                        <div className="px-6 md:px-7 pb-6 md:pb-7 pl-14 md:pl-14">
                          <div className="faq-divider h-px w-full bg-white/20 mb-4" />
                          <article
                            className="faq-answer-text text-[15px] leading-relaxed"
                            dangerouslySetInnerHTML={{
                              __html: sanitizeHtml(itemTr?.description),
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </summary>
                </details>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
