"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAction } from "@/hooks/useServerActions";
import CustomForm from "../../../CustomForm";
import {
  getYoutubeById,
  updateYoutube,
} from "@/actions/client/youtube/youtube.controller";
import { CustomLocales, YoutubeItems } from "@/services/interface/type";
import { useServerQueryById } from "@/hooks/useServerActions";
import { youtube_media_list } from "@/app/(dashboard)/_type/query-key";
import {
  UpdateYoutubeInput,
  uptadeYoutubeSchema,
} from "@/actions/client/youtube/youtube.schema";
import { pageRoutes } from "@/app/(dashboard)/_type/constant";
import FormWrapper from "@/globalElement/form/FormWrapper";
import LanguageComponent from "@/app/(dashboard)/_components/LanguageComponent";

export default function UpdateContent() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = searchParams?.get("locale") ?? "en";
  const getCategoryWrapper = async () => {
    const result = await getYoutubeById({
      locale: locale as CustomLocales,
      id: id as string,
    });

    return {
      data: result?.data as unknown as YoutubeItems | undefined,
    };
  };
  const { data: existingData } = useServerQueryById<YoutubeItems>(
    `${youtube_media_list}/${locale}`,
    getCategoryWrapper,
    id,
    { locale },
  );

  const generalForm = useForm<UpdateYoutubeInput>({
    resolver: zodResolver(uptadeYoutubeSchema),
    values: {
      id: existingData?.id,
      url: existingData?.url || "",
      title: existingData?.translations?.[0]?.title || "",
      locale: locale as CustomLocales,
    },
  });
  const { reset } = generalForm;
  const { execute, isExecuting } = useAction(updateYoutube, {
    queryKey: youtube_media_list,
    onSuccess: () => {
      reset();
      router.push(pageRoutes.youtubeMedia.root);
      router.refresh();
    },
  });
  const onSubmit = async (data: UpdateYoutubeInput) => {
    execute(data);
  };

  return (
    <>
      <section className={"flex flex-col gap-4 mb-2"}>
        <LanguageComponent locale={locale} />
        <FormWrapper
          methods={generalForm}
          schema={uptadeYoutubeSchema}
          onSubmit={onSubmit}
          className={"grid grid-cols-1 gap-3"}
        >
          <CustomForm
            isPending={isExecuting}
            title={existingData?.translations?.[0]?.title}
          />
        </FormWrapper>
      </section>
    </>
  );
}
