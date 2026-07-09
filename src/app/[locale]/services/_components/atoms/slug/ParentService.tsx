import { Link } from "@/i18n/navigation";
import { newInfoJson, ServicesType } from "@/services/interface/type";
import { DynamicIcon } from "@/utils/DynamicIcon";
import { FaArrowRight } from "react-icons/fa6";
import { serviceMainHref } from "@/i18n/href";

export default function ParentService({
  sectionData,
  parentService,
}: {
  sectionData: newInfoJson;
  parentService?: ServicesType | null;
}) {
  if (!sectionData || !parentService) return null;

  const parentServiceTr = parentService.translations?.[0];
  if (!parentServiceTr?.slug) return null;

  return (
    <div id="parent-service" className="scroll-mt-8 mt-16 mb-16">
      <div className="mb-8">
        {sectionData.subTitle && (
          <span className="text-sm text-primary font-bold tracking-wider uppercase">
            {sectionData.subTitle}
          </span>
        )}
        <h2
          title={sectionData.title ?? parentServiceTr.title}
          className="text-3xl font-bold mt-2 mb-4 text-foreground"
        >
          {sectionData.title ?? parentServiceTr.title}
        </h2>
        <div className="w-16 h-1 rounded-full mb-4 bg-primary" />
      </div>

      <Link
        href={serviceMainHref(parentServiceTr.slug)}
        className="group block bg-secondary rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {parentService.iconUrl && (
              <div className="size-20 rounded-2xl flex items-center text-primary bg-surface-elevated justify-center transition-all duration-300">
                <DynamicIcon iconName={parentService.iconUrl} size={40} />
              </div>
            )}
            <div>
              <h3 className="text-white font-bold text-2xl mb-2">
                {parentServiceTr.title}
              </h3>
              {parentServiceTr.shortDescription && (
                <p className="text-sm max-w-lg text-white/70">
                  {parentServiceTr.shortDescription}
                </p>
              )}
            </div>
          </div>
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-white transition-all duration-300 flex-shrink-0 bg-white/10">
            <FaArrowRight className="w-6 h-6" />
          </div>
        </div>
      </Link>
    </div>
  );
}
