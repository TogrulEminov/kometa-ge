"use client";
import { useSearchParams } from "next/navigation";
import Content from "./_components/content";
import data from "@/json/language.json";
import { contact_information_list } from "../../_type/query-key";
import { getContact } from "@/actions/client/contact/contact.controller";
import { useServerQuery } from "@/hooks/useServerActions";
import { CustomLocales, IContactInformation } from "@/services/interface/type";
import { LangItem, LangTabs } from "../../_components/tabs/LangTabs";
export default function ContactPage() {
  const searchParams = useSearchParams();
  const locale = searchParams?.get("locale") ?? "en";
  const { data: existingData, refetch } = useServerQuery(
    contact_information_list,
    getContact,
    {
      params: {
        locale: locale as CustomLocales,
      },
    },
  );
  console.log(existingData);
  
  return (
    <section className={"flex flex-col gap-4 mb-4.5"}>
      <h1 className="text-3xl font-inter font-bold text-ui-1 mb-5">Contact Page</h1>
      <LangTabs defaultLang={locale} className="mb-5">
        {data?.map((item, index) => {
          return (
            <LangItem key={index} value={item?.code} label={item?.title} />
          );
        })}
      </LangTabs>
      <Content
        existingData={existingData?.data as unknown as IContactInformation}
        refetch={refetch}
      />
    </section>
  );
}
