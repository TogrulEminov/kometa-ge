"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import CustomForm from "../CustomForm";
import {
  CreateYoutubeInput,
  createYoutubeSchema,
} from "@/actions/client/youtube/youtube.schema";
import { useForm } from "react-hook-form";
import { CustomLocales } from "@/services/interface/type";
import { createYoutube } from "@/actions/client/youtube/youtube.controller";
import { pageRoutes } from "@/app/(dashboard)/_type/constant";
import FormWrapper from "@/globalElement/form/FormWrapper";
import LanguageComponent from "@/app/(dashboard)/_components/LanguageComponent";

export default function CreateYoutube() {
  const searchParams = useSearchParams();
  const locale = searchParams?.get("locale") ?? "az";
  const router = useRouter();

  const generalForm = useForm<CreateYoutubeInput>({
    resolver: zodResolver(createYoutubeSchema),
    defaultValues: {
      title: "",
      imageId: undefined,
      url: "",
      locale: locale as CustomLocales,
    },
  });
  const { reset } = generalForm;
  const { execute, isExecuting } = useAction(createYoutube, {
    onSuccess: () => {
      reset();
      router.push(pageRoutes.youtubeMedia.root);
      router.refresh();
    },
  });
  const onSubmit = async (data: CreateYoutubeInput) => {
    execute(data);
  };

  return (
    <>
      <section className={"flex flex-col gap-4 mb-5"}>
        <LanguageComponent locale={locale} />
        <FormWrapper
          methods={generalForm}
          schema={createYoutubeSchema}
          onSubmit={onSubmit}
          className={"grid grid-cols-1 gap-5"}
        >
          <CustomForm isPending={isExecuting} isImage={true} />
        </FormWrapper>
      </section>
    </>
  );
}
