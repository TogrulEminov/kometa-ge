import CustomImage from "@/globalElement/CustomImage";
import { sanitizeHtml } from "@/lib/domburify";
import {
  FileType,
  newInfoJson,
  SubServicesType,
} from "@/services/interface/type";
import { getForCards } from "@/utils/getFullimageUrl";

export default async function ServicesDetailOverview({
  servicesOverview,
  servicesInfo,
}: {
  servicesInfo: SubServicesType;
  servicesOverview: newInfoJson;
}) {
  const servicesTr = servicesInfo?.translations?.[0];

  const imageUrl = getForCards(servicesOverview?.imageUrl as FileType);
  if (!servicesInfo || !servicesOverview) return null;
  return (
    <div id="overview" className="scroll-mt-8">
      <div className="mb-6">
        {servicesOverview?.subTitle && (
          <span className="text-sm text-primary font-bold tracking-wider uppercase">
            {servicesOverview?.subTitle}
          </span>
        )}
        {servicesOverview?.title && (
          <h2
            title={servicesOverview?.title}
            className="text-3xl text-foreground font-bold mt-2 mb-4"
          >
            {servicesOverview?.title}
          </h2>
        )}
        {servicesOverview?.description && (
          <div
            className="prose prose-lg max-w-none text-muted leading-relaxed mb-8 [&_a]:text-primary"
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(servicesOverview?.description ?? ""),
            }}
          />
        )}
      </div>

      <div className="relative rounded-2xl overflow-hidden mb-8">
        {imageUrl ? (
          <CustomImage
            width={1200}
            title={servicesTr?.title as string}
            height={600}
            src={imageUrl ?? ""}
            className="w-full h-[400px] object-cover"
          />
        ) : (
          <div className="w-full h-[400px] bg-surface-elevated rounded-lg" />
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {servicesOverview.items.map((tag, i) => (
          <span
            key={i}
            className="px-4 py-2 text-foreground bg-surface border border-white/10 text-sm font-medium rounded-xl cursor-default"
          >
            {tag.itemTitle as string}
          </span>
        ))}
      </div>
    </div>
  );
}
