import { Social } from "@/services/interface/type";
import { renderSocialIcon } from "@/utils/renderSocialIcon";
import { useTranslations } from "next-intl";
export default function SocialBox({ socials }: { socials: Social[] }) {
  const t = useTranslations("atoms.components.contactInfo");
  if (!socials.length) return null;
  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100">
      <div className="text-sm text-gray-400 font-medium mb-4">
        {t("follow_us_on_social_media")}
      </div>
      <div className="flex items-start flex-wrap gap-3">
        {socials.map((social, i) => (
          <a
            key={i}
            href={social.socialLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.socialName}
            className="size-12 bg-gray-50 hover:bg-primary rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300"
          >
            {renderSocialIcon({
              iconName: social.iconName,
            })}
          </a>
        ))}
      </div>
    </div>
  );
}
