import CustomImage from "@/globalElement/CustomImage";
import { sanitizeHtml } from "@/lib/domburify";
import { FileType, newInfoJson, ServicesType } from "@/services/interface/type";
import { findJsonSection } from "@/utils/findJsonSection";
import { getForCards } from "@/utils/getFullimageUrl";

export default function ServiceOverview({
  servicesOverview,
}: {
  servicesOverview: ServicesType;
}) {
  const servicesTr = servicesOverview?.translations?.[0];
  const servicesOverviewTr = findJsonSection<newInfoJson>(
    servicesTr?.description ?? "",
    "main",
  );
  const imageUrl = getForCards(servicesOverview?.imageUrl as FileType);
  if (!servicesOverviewTr) return null;
  return (
    <div id="overview" className="scroll-mt-8">
      <div className="mb-8">
        {servicesOverviewTr?.subTitle && (
          <span className="text-primary text-sm font-bold tracking-wider uppercase">
            {servicesOverviewTr?.subTitle}
          </span>
        )}
        <h2
          title={servicesOverviewTr?.title}
          className="text-foreground text-3xl font-bold mt-2 mb-4"
        >
          {servicesOverviewTr?.title}
        </h2>
        <div className="w-16 h-1 bg-primary rounded-full" />
      </div>
      {servicesOverviewTr?.description && (
        <div
          className="prose prose-lg max-w-none text-muted leading-relaxed mb-8 [&_a]:text-primary"
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(servicesOverviewTr?.description ?? ""),
          }}
        />
      )}

      {imageUrl ? (
        <CustomImage
          width={1200}
          title=""
          height={600}
          className="max-w-full lg:h-100 object-cover rounded-lg"
          src={imageUrl ?? ""}
        />
      ) : (
        <div className="w-full h-full bg-surface-elevated rounded-lg" />
      )}
    </div>
  );
}
