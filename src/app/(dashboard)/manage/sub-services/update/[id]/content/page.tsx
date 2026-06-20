"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAction } from "next-safe-action/hooks";
import CustomForm from "../../../_components/CustomForm";
import { CustomLocales, ServicesType, SubServicesType } from "@/services/interface/type";
import { useServerQueryById } from "@/hooks/useServerActions";
import { pageRoutes } from "@/app/(dashboard)/_type/constant";
import FormWrapper from "@/globalElement/form/FormWrapper";
import LanguageComponent from "@/app/(dashboard)/_components/LanguageComponent";
import { parseJSON } from "@/utils/parseJson";
import { NewInfoJson } from "@/app/(dashboard)/_type/global.type";
import { getSubServicesById, uptadeSubServices } from "@/actions/client/services-sub/services-sub.controller";
import { sub_services_list } from "@/app/(dashboard)/_type/query-key";
import { UpdateSubServiceInput, uptadeSubServiceSchema } from "@/actions/client/services-sub/services-sub.schema";
export default function CategriesUptadeContent() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = searchParams?.get("locale") ?? "en";
  const getCategoryWrapper = async () => {
    const result = await getSubServicesById({
      locale: locale as CustomLocales,
      id: id as string,
    });

    return {
      data: result as unknown as SubServicesType,
    };
  };

  const { data: existingData } = useServerQueryById<SubServicesType>(
    sub_services_list,
    getCategoryWrapper,
    id,
    { locale },
  );

  const translation = existingData?.translations?.[0];
  const seo = translation?.seo;

  const generalContentForm = useForm<UpdateSubServiceInput>({
    mode: "onChange",
    resolver: zodResolver(uptadeSubServiceSchema),
    values: {
      id: existingData?.id,
      title: translation?.title || "",
      description: parseJSON<NewInfoJson>(translation?.description)?.data,
      slug: translation?.slug || "",
      metaTitle: seo?.metaTitle || "",
      metaDescription: seo?.metaDescription || "",
      metaKeywords: seo?.metaKeywords || "",
      iconsUrl: existingData?.iconsUrl || null,
      servicesId: existingData?.servicesId || null,
      locale: locale as CustomLocales,
    },
  });
  const { execute, isExecuting } = useAction(uptadeSubServices, {
    onSuccess: (data) => {
      router.push(pageRoutes.subServices.root);
      router.refresh();
      generalContentForm.reset();
    },
    onError: (err) => {
      console.log(err);
    },
  });
  const onSubmit = async (data: UpdateSubServiceInput) => {
    await execute(data);
  };

  return (
    <>
      <section className={"flex flex-col gap-4 mb-2"}>
        <LanguageComponent locale={locale} />

        <FormWrapper
          methods={generalContentForm}
          schema={uptadeSubServiceSchema}
          onSubmit={onSubmit}
        >
          <CustomForm locale={locale as CustomLocales} isPending={isExecuting} title={translation?.title} />
        </FormWrapper>
      </section>
    </>
  );
}
