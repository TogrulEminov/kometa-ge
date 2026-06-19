import React from "react";
import lang from "@/json/language.json";
import { LangItem, LangTabs } from "./tabs/LangTabs";
import FormBadge from "./FormBadege";
import { cn } from "@/utils/cn";
export default function LanguageComponent({
  locale,
  className,
}: {
  locale: string;
  className?: string;
}) {
  return (
    <div className={cn(className,"space-y-5")}>
      <FormBadge locale={locale} />
      <LangTabs defaultLang={locale}>
        {lang?.map((item, index) => {
          return (
            <LangItem key={index} value={item?.code} label={item?.title} />
          );
        })}
      </LangTabs>
    </div>
  );
}
