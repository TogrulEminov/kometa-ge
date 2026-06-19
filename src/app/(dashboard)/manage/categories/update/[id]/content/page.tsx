"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useAction } from "next-safe-action/hooks";
import CustomForm from "../../../_components/CustomForm";
import {
  getCategoriesById,
  uptadeCategory,
} from "@/actions/client/categories/category.controller";
import { Category, CustomLocales } from "@/services/interface/type";
import { useServerQueryById } from "@/hooks/useServerActions";
import { categories_content_list } from "@/app/(dashboard)/_type/query-key";
import {
  UpdateCategoryInput,
  uptadeCategorySchema,
} from "@/actions/client/categories/category.schema";
import { pageRoutes } from "@/app/(dashboard)/_type/constant";
import FormWrapper from "@/globalElement/form/FormWrapper";
import LanguageComponent from "@/app/(dashboard)/_components/LanguageComponent";
export default function CategriesUptadeContent() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = searchParams?.get("locale") ?? "en";
  const getCategoryWrapper = async () => {
    const result = await getCategoriesById({
      locale: locale as CustomLocales,
      id: id as string,
    });

    return {
      data: result.data as Category | undefined,
      message: result.message,
      code: result.code,
    };
  };

  const { data: existingData } = useServerQueryById<Category>(
    categories_content_list,
    getCategoryWrapper,
    id,
    { locale },
  );
  console.log(existingData);

  const translation = existingData?.translations?.[0];
  const seo = translation?.seo;

  const generalContentForm = useForm<UpdateCategoryInput>({
    mode: "onChange",
    resolver: zodResolver(uptadeCategorySchema),
    values: {
      id: existingData?.id,
      title: translation?.title || "",
      description: translation?.description,
      slug: existingData?.slug || "",
      metaTitle: seo?.metaTitle || "",
      metaDescription: seo?.metaDescription || "",
      metaKeywords: seo?.metaKeywords || "",
      locale: locale as CustomLocales,
    },
  });
  const { execute, isExecuting } = useAction(uptadeCategory, {
    onSuccess: (data) => {
      router.push(pageRoutes.categories.root);
      router.refresh();
      generalContentForm.reset();
    },
    onError: (err) => {
      console.log(err);
    },
  });
  const onSubmit = async (data: UpdateCategoryInput) => {
    await execute(data);
  };

  return (
    <>
      <section className={"flex flex-col gap-4 mb-2"}>
        <LanguageComponent locale={locale} />

        <FormWrapper
          methods={generalContentForm}
          schema={uptadeCategorySchema}
          onSubmit={onSubmit}
        >
          <CustomForm isPending={isExecuting} title={translation?.title} />
        </FormWrapper>
      </section>
    </>
  );
}
