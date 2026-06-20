"use client";
import { useSearchParams } from "next/navigation";
import { useServerQuery } from "@/hooks/useServerActions";
import Content from "./_components/content";
import { about_page_list, features_list } from "../../_type/query-key";
import { AboutMainType, CustomLocales, FeaturesType } from "@/services/interface/type";
import {
  QueryTabs,
  TabsBody,
  TabsList,
  TabsTitle,
} from "../../_components/tabs/QueryTabs";
import UpdateImageComponent from "./_components/image";
import LanguageComponent from "../../_components/LanguageComponent";
import { getAboutMainInfo } from "@/actions/client/aboutMain/aboutMain.controller";
import GalleryUpdateImage from "./_components/gallery";
export default function MainPage() {
  const searchParams = useSearchParams();
  const locale = searchParams?.get("locale") ?? "en";
  const { data: existingData, refetch } = useServerQuery(
    about_page_list,
    getAboutMainInfo,
    {
      params: {
        locale: locale as CustomLocales,
      },
    },
  );

  return (
    <section className={"flex flex-col gap-4 mb-4.5"}>
      <h1 className="text-3xl font-inter font-bold text-ui-1 mb-5">
        About Page Information
      </h1>
      <QueryTabs defaultTab="info" queryParam="type">
        <TabsList variant="pills" className="mb-6">
          <TabsTitle value="info">Information</TabsTitle>
          <TabsTitle value="file">Image</TabsTitle>
          <TabsTitle value="files">Gallery</TabsTitle>
        </TabsList>
        <div>
          <TabsBody value="info">
            <LanguageComponent locale={locale} className="mb-5 space-y-5" />
            <Content
              existingData={existingData as unknown as AboutMainType}
              refetch={refetch}
            />
          </TabsBody>
          <TabsBody value="file">
            <UpdateImageComponent
              existingData={existingData as unknown as AboutMainType}
              refetch={refetch} 
            />
          </TabsBody>
          <TabsBody value="files">
            <GalleryUpdateImage
              existingData={existingData as unknown as AboutMainType}
              refetch={refetch}
            />
          </TabsBody>
        </div>
      </QueryTabs>
    </section>
  );
}
