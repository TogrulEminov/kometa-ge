"use client";
import { useSearchParams } from "next/navigation";
import { useServerQuery } from "@/hooks/useServerActions";
import Content from "./_components/content";
import { hero_info_list } from "../../_type/query-key";
import { getHeroInfo } from "@/actions/client/hero/hero.controller";
import { CustomLocales, HeroInfo } from "@/services/interface/type";
import {
  QueryTabs,
  TabsBody,
  TabsList,
  TabsTitle,
} from "../../_components/tabs/QueryTabs";
import UpdateImageComponent from "./_components/image";
import LanguageComponent from "../../_components/LanguageComponent";
import UpdateVideoComponent from "./_components/video";
export default function AboutPage() {
  const searchParams = useSearchParams();
  const locale = searchParams?.get("locale") ?? "en";
  const { data: existingData, refetch } = useServerQuery(
    hero_info_list,
    getHeroInfo,
    {
      params: {
        locale: locale as CustomLocales,
      },
    },
  );

  return (
    <section className={"flex flex-col gap-4 mb-4.5"}>
      <h1 className="text-3xl font-inter font-bold text-ui-1 mb-5">
        Banner info
      </h1>
      <QueryTabs defaultTab="info" queryParam="type">
        <TabsList variant="pills" className="mb-6">
          <TabsTitle value="info">Information</TabsTitle>
          <TabsTitle value="files">Image</TabsTitle>
          <TabsTitle value="video">Video</TabsTitle>
        </TabsList>
        <div>
          <TabsBody value="info">
            <LanguageComponent locale={locale} className="mb-5 space-y-5" />
            <Content
              existingData={existingData as HeroInfo}
              refetch={refetch}
            />
          </TabsBody>
          <TabsBody value="files">
            <UpdateImageComponent
              existingData={existingData as HeroInfo}
              refetch={refetch}
            />
          </TabsBody>
          <TabsBody value="video">
            <UpdateVideoComponent
              existingData={existingData as HeroInfo}
              refetch={refetch}
            />
          </TabsBody>
        </div>
      </QueryTabs>
    </section>
  );
}
