import { clearPhoneRegex } from "@/lib/domburify";
import { IContactInformation, Social } from "@/services/interface/type";
import { cn } from "@/utils/cn";
import { renderSocialIcon } from "@/utils/renderSocialIcon";
import { FaEnvelope, FaMap, FaPhoneAlt } from "react-icons/fa";

export default function HeaderTop({
  isSticky,
  contactInfo,
  socials,
}: {
  isSticky: boolean;
  contactInfo: IContactInformation;
  socials: Social[];
}) {
  return (
    <div
      className={cn(
        "bg-[#B11226] h-12 py-3 lg:block hidden duration-300 transition-all",
        isSticky && "max-h-0 py-0 overflow-hidden opacity-0 invisible",
      )}
    >
      <div className="container flex items-center justify-between">
        <ul className="flex items-center gap-4 text-white text-sm">
          {contactInfo?.phone && (
            <li className="flex items-center gap-1.5">
              <FaPhoneAlt size={16} />
              <a
                href={clearPhoneRegex(contactInfo?.phone)}
                className="hover:underline"
              >
                {contactInfo?.phone}
              </a>
            </li>
          )}
          {contactInfo?.email && (
            <li className="hidden sm:flex items-center gap-1.5">
              <FaEnvelope size={16} />
              <a
                href={`mailto:${contactInfo?.email}`}
                className="hover:underline"
              >
                {contactInfo?.email}
              </a>
            </li>
          )}
          {contactInfo?.translations?.[0]?.adress && (
            <li className="hidden md:flex items-center gap-1.5">
              <FaMap size={16} />

              {contactInfo?.adressLink ? (
                <a href={contactInfo?.adressLink} className="hover:underline">
                  {contactInfo?.translations?.[0]?.adress}
                </a>
              ) : (
                <address>{contactInfo?.translations?.[0]?.adress}</address>
              )}
            </li>
          )}
        </ul>

        <ul className="flex items-center gap-3 text-white">
          {socials?.map((item) => (
            <li key={item.id}>
              <a
                href={item?.socialLink || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/70 transition-colors duration-200"
              >
                {renderSocialIcon({
                  iconName: item?.iconName,
                  fill: "currentColor",
                })}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
