import { CustomLocales } from "@/services/interface/type";

const localeLabels: Record<CustomLocales, string> = {
  en: "English",
  ka: "Georgian",
};

export default function FormBadge({ locale }: { locale: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-600">
        Enter content in:
      </span>

      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-50 text-blue-600 border border-blue-200">
        {localeLabels[locale as CustomLocales]}
      </span>
    </div>
  );
}
