import { FaArrowRight, FaMapMarkerAlt } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { IContactInformation } from "@/services/interface/type";

export default function MapInfo({ contactInfo }: { contactInfo: IContactInformation }) {
  const t = useTranslations("atoms.components.contactInfo");
  const latitude = contactInfo?.latitude ? parseFloat(contactInfo?.latitude) : 0;
  const longitude = contactInfo?.longitude ? parseFloat(contactInfo?.longitude) : 0;
  return (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-primary shrink-0">
        <FaMapMarkerAlt className="w-4 h-4" />
      </div>
      <div>
        <div className="font-semibold text-secondary text-sm">{t("head_office")}</div>
        <div className="text-gray-400 text-sm mt-0.5">
          {contactInfo?.translations?.[0]?.adress}
        </div>
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-primary text-sm font-medium mt-2 hover:underline"
        >
          {t("get_directions")}
          <FaArrowRight className="w-3 h-3 ml-1" />
        </a>
      </div>
    </div>
  );
}
