"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAction } from "next-safe-action/hooks";
import CustomForm from "../../../_components/CustomForm";
import { CustomLocales, ServicesType } from "@/services/interface/type";
import { useServerQueryById } from "@/hooks/useServerActions";
import { pageRoutes } from "@/app/(dashboard)/_type/constant";
import FormWrapper from "@/globalElement/form/FormWrapper";
import LanguageComponent from "@/app/(dashboard)/_components/LanguageComponent";
import {
  getServicesById,
  uptadeServices,
} from "@/actions/client/services/services.controller";
import { services_main_list } from "@/app/(dashboard)/_type/query-key";
import {
  UpdateServiceInput,
  uptadeServiceSchema,
} from "@/actions/client/services/service.schema";
import { parseJSON } from "@/utils/parseJson";
import { NewInfoJson } from "@/app/(dashboard)/_type/global.type";
export default function CategriesUptadeContent() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = searchParams?.get("locale") ?? "en";
  const getCategoryWrapper = async () => {
    const result = await getServicesById({
      locale: locale as CustomLocales,
      id: id as string,
    });

    return {
      data: result as unknown as ServicesType,
    };
  };

  const { data: existingData } = useServerQueryById<ServicesType>(
    services_main_list,
    getCategoryWrapper,
    id,
    { locale },
  );

  const translation = existingData?.translations?.[0];
  const seo = translation?.seo;

  const generalContentForm = useForm<UpdateServiceInput>({
    mode: "onChange",
    resolver: zodResolver(uptadeServiceSchema),
    values: {
      id: existingData?.id,
      title: translation?.title || "",
      description: parseJSON<NewInfoJson>(translation?.description)?.data,
      slug: translation?.slug || "",
      metaTitle: seo?.metaTitle || "",
      metaDescription: seo?.metaDescription || "",
      metaKeywords: seo?.metaKeywords || "",
      locale: locale as CustomLocales,
    },
  });
  const { execute, isExecuting } = useAction(uptadeServices, {
    onSuccess: (data) => {
      router.push(pageRoutes.servicesMain.root);
      router.refresh();
      generalContentForm.reset();
    },
    onError: (err) => {
      console.log(err);
    },
  });
  const onSubmit = async (data: UpdateServiceInput) => {
    await execute(data);
  };

  return (
    <>
      <section className={"flex flex-col gap-4 mb-2"}>
        <LanguageComponent locale={locale} />

        <FormWrapper
          methods={generalContentForm}
          schema={uptadeServiceSchema}
          onSubmit={onSubmit}
        >
          <CustomForm isPending={isExecuting} title={translation?.title} />
        </FormWrapper>
      </section>
    </>
  );
}
