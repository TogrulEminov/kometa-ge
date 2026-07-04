import CustomImage from "@/globalElement/CustomImage";
import { Link } from "@/i18n/navigation";
import { ServicesType } from "@/services/interface/type";
import { getForCards } from "@/utils/getFullimageUrl";
import { getTranslations } from "next-intl/server";
import { serviceMainHref } from "@/i18n/href";

export default async function HeroService({
  services,
}: {
  services?: ServicesType | null;
}) {
  const translations = services?.translations?.[0];
  const imageUrl = getForCards(services?.imageUrl);

  const t = await getTranslations("atoms");
  if (!services) return <div></div>;
  return (
    <div className="surface-card rounded-2xl p-6 lg:mt-10 flex lg:items-stretch flex-col lg:flex-row gap-5">
      <div className="w-full relative lg:w-40 h-50 shrink-0 rounded-xl overflow-hidden">
        {imageUrl ? (
          <CustomImage
            src={imageUrl}
            title={translations?.title as string}
            fill
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-surface-elevated rounded-xl" />
        )}
      </div>
      <div className="flex flex-col justify-center space-y-3">
        <h3 className="text-foreground text-lg font-bold uppercase leading-snug">
          {translations?.title}
        </h3>
        {translations?.shortDescription && (
          <p className="text-muted text-sm line-clamp-2">
            {translations?.shortDescription}
          </p>
        )}
        {translations?.slug ? (
          <Link
            href={serviceMainHref(translations.slug)}
            className="inline-flex items-center gap-2 border border-white/20 text-foreground hover:bg-primary hover:text-white hover:border-primary text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded transition-colors duration-200 w-fit"
          >
            {t("buttons.read_more")} <span>→</span>
          </Link>
        ) : null}
      </div>
    </div>
  );
}
