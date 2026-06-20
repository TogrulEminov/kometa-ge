"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import CustomForm from "../_components/CustomForm";
import { useAction } from "next-safe-action/hooks";
import { CustomLocales } from "@/services/interface/type";
import { pageRoutes } from "../../../_type/constant";
import FormWrapper from "@/globalElement/form/FormWrapper";
import LanguageComponent from "@/app/(dashboard)/_components/LanguageComponent";
import {
  CreateSubServiceInput,
  createSubServiceSchema,
} from "@/actions/client/services-sub/services-sub.schema";
import { createSubServices } from "@/actions/client/services-sub/services-sub.controller";
export default function CreatePage() {
  const searchParams = useSearchParams();
  const locale = searchParams?.get("locale") ?? "az";
  const router = useRouter();

  const generalContentForm = useForm<CreateSubServiceInput>({
    resolver: zodResolver(createSubServiceSchema),
    defaultValues: {
      title: "",
      slug: "",
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
      imageId: undefined,
      galleryIds: [],
      iconsUrl: null,
      servicesId: null,
      description: [],
      locale: locale as CustomLocales,
    },
  });

  const { execute, isExecuting } = useAction(createSubServices, {
    onSuccess: (data) => {
      console.log("succes", data);
      router.push(pageRoutes.subServices.root);
      router.refresh();
      generalContentForm.reset();
    },
    onError(err) {
      console.log(err);
    },
  });
  const onSubmit = async (data: CreateSubServiceInput) => {
    await execute(data);
  };

  console.log(generalContentForm.formState.errors);
  
  return (
    <>
      <section className={"flex flex-col gap-4 mb-5"}>
        <LanguageComponent locale={locale} />
        <FormWrapper
          methods={generalContentForm}
          schema={createSubServiceSchema}
          onSubmit={onSubmit}
        >
          <CustomForm
            isImage={true}
            isPending={isExecuting}
            locale={locale as CustomLocales}
          />
        </FormWrapper>
      </section>
    </>
  );
}
