"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import CustomForm from "../_components/CustomForm";
import { services_main_list } from "@/app/(dashboard)/_type/query-key";
import { useAction } from "@/hooks/useServerActions";
import { CustomLocales } from "@/services/interface/type";
import { pageRoutes } from "../../../_type/constant";
import FormWrapper from "@/globalElement/form/FormWrapper";
import LanguageComponent from "@/app/(dashboard)/_components/LanguageComponent";
import {
  CreateServiceInput,
  createServiceSchema,
} from "@/actions/client/services/service.schema";
import { createServices } from "@/actions/client/services/services.controller";
export default function CreatePage() {
  const searchParams = useSearchParams();
  const locale = searchParams?.get("locale") ?? "az";
  const router = useRouter();

  const generalContentForm = useForm<CreateServiceInput>({
    resolver: zodResolver(createServiceSchema),
    defaultValues: {
      title: "",
      slug: "",
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
      imageId: undefined,
      galleryIds: [],
      description: [],
      iconUrl: null,
      locale: locale as CustomLocales,
      shortDescription: null,
    },
  });

  const { execute, isExecuting } = useAction(createServices, {
    queryKey: services_main_list,
    onSuccess: () => {
      router.push(pageRoutes.servicesMain.root);
      router.refresh();
      generalContentForm.reset();
    },
    onError(err) {
      console.log(err);
    },
  });
  const onSubmit = async (data: CreateServiceInput) => {
    await execute(data);
  };

  return (
    <>
      <section className={"flex flex-col gap-4 mb-5"}>
        <LanguageComponent locale={locale} />
        <FormWrapper
          methods={generalContentForm}
          schema={createServiceSchema}
          onSubmit={onSubmit}
        >
          <CustomForm isImage={true} isPending={isExecuting} />
        </FormWrapper>
      </section>
    </>
  );
}
