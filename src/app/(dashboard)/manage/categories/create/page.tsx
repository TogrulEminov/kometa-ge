"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import CustomForm from "../_components/CustomForm";
import { useAction } from "next-safe-action/hooks";
import {
  CreateCategoryInput,
  createCategorySchema,
} from "@/actions/client/categories/category.schema";
import { CustomLocales } from "@/services/interface/type";
import { createCategory } from "@/actions/client/categories/category.controller";
import { pageRoutes } from "../../../_type/constant";
import FormWrapper from "@/globalElement/form/FormWrapper";
export default function CreateCategories() {
  const searchParams = useSearchParams();
  const locale = searchParams?.get("locale") ?? "az";
  const router = useRouter();

  const generalContentForm = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      title: "",
      slug: "",
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
      imageId: undefined,
      description: null,
      locale: locale as CustomLocales,
    },
  });

  const { execute, isExecuting } = useAction(createCategory, {
    onSuccess: (data) => {
      console.log("succes", data);
      router.push(pageRoutes.categories.root);
      router.refresh();
      generalContentForm.reset();
    },
    onError(err) {
      console.log(err);
    },
  });
  const onSubmit = async (data: CreateCategoryInput) => {
    await execute(data);
  };

  return (
    <>
      <section className={"flex flex-col gap-4 mb-5"}>
        <h1 className="font-medium text-[#171717] text-3xl mb-8">
          {locale === "az"
            ? "Azərbaycan dilində daxil  et"
            : locale === "en"
              ? "İngilis dilində daxil et"
              : "Rus dilində daxil et"}
        </h1>
        <FormWrapper
          methods={generalContentForm}
          schema={createCategorySchema}
          onSubmit={onSubmit}
        >
          <CustomForm isImage={true} isPending={isExecuting} />
        </FormWrapper>
      </section>
    </>
  );
}
