"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import CustomForm from "../CustomForm";
import {
  CreateSectionContentInput,
  createSectionContentSchema,
} from "@/actions/client/section/section.schema";
import { CustomLocales } from "@/services/interface/type";
import { useAction } from "next-safe-action/hooks";
import { createSectionContent } from "@/actions/client/section/section.controller";
import { pageRoutes } from "@/app/(dashboard)/_type/constant";
import LanguageComponent from "@/app/(dashboard)/_components/LanguageComponent";
import FormWrapper from "@/globalElement/form/FormWrapper";

export default function CreateSectionContent() {
  const searchParams = useSearchParams();
  const locale = searchParams?.get("locale") ?? "az";
  const router = useRouter();
  const generalForm = useForm<CreateSectionContentInput>({
    mode: "onChange",
    resolver: zodResolver(createSectionContentSchema),
    defaultValues: {
      title: "",
      subTitle: "",
      highlightWord: "",
      description: "",
      key: "",
      locale: locale as CustomLocales,
    },
  });
  const { execute, isExecuting } = useAction(createSectionContent, {
    onSuccess: () => {
      generalForm.reset();
      router.push(pageRoutes.sectionContent.root);
      router.refresh();
    },
  });
  const onSubmit = async (data: CreateSectionContentInput) => {
    execute(data);
  };

  return (
    <>
      <section className={"flex flex-col gap-4 mb-5"}>
        <LanguageComponent locale={locale} />
        <FormWrapper
          methods={generalForm}
          schema={createSectionContentSchema}
          onSubmit={onSubmit}
          className={"grid grid-cols-1 gap-5"}
        >
          <CustomForm isPending={isExecuting} />
        </FormWrapper>
      </section>
    </>
  );
}
