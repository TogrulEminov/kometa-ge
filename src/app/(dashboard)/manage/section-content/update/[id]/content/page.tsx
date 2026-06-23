"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAction } from "@/hooks/useServerActions";
import CustomForm from "../../../CustomForm";
import {
  getSectionContentById,
  uptadeSectionContent,
} from "@/actions/client/section/section.controller";
import { CustomLocales, SectionContent } from "@/services/interface/type";
import { useServerQueryById } from "@/hooks/useServerActions";
import { section_content_list } from "@/app/(dashboard)/_type/query-key";
import {
  UpdateSectionContentInput,
  uptadeSectionContentSchema,
} from "@/actions/client/section/section.schema";
import LanguageComponent from "@/app/(dashboard)/_components/LanguageComponent";
import FormWrapper from "@/globalElement/form/FormWrapper";
import { pageRoutes } from "@/app/(dashboard)/_type/constant";

export default function SectionUptadeContent() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const searchParams = useSearchParams();
  const locale = searchParams?.get("locale") ?? "en";
  const getDataWrapper = async () => {
    const result = await getSectionContentById({
      locale: locale as CustomLocales,
      id: id as string,
    });

    return {
      data: result as SectionContent | undefined,
    };
  };
  const { data: existingData } = useServerQueryById<SectionContent>(
    `${section_content_list}/${locale}`,
    getDataWrapper,
    id,
    { locale },
  );

  
  const translations = existingData?.translations?.[0];
  
  const sectionContentForm = useForm<UpdateSectionContentInput>({
    resolver: zodResolver(uptadeSectionContentSchema),
    values: {
      id: existingData?.id,
      title: translations?.title || "",
      description: translations?.description || "",
      highlightWord: translations?.highlightWord || "",
      subTitle: translations?.subTitle || "",
      key: existingData?.key || null,
      locale: locale as CustomLocales,
    },
  });
  const { execute, isExecuting } = useAction(uptadeSectionContent, {
    queryKey: section_content_list,
    onSuccess: () => {
      sectionContentForm.reset();
      router.push(pageRoutes.sectionContent.root);
      router.refresh();
    },
  });
  const onSubmit = async (data: UpdateSectionContentInput) => {
    execute(data);
  };

  return (
    <>
      <section className={"flex flex-col gap-4 mb-2"}>
        <LanguageComponent locale={locale} />
        <FormWrapper
          methods={sectionContentForm}
          onSubmit={onSubmit}
          schema={uptadeSectionContentSchema}
          className={"grid grid-cols-1 gap-3"}
        >
          <CustomForm isPending={isExecuting} title={translations?.title} />
        </FormWrapper>
      </section>
    </>
  );
}
