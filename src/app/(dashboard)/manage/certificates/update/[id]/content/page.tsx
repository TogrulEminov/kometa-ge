"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAction } from "@/hooks/useServerActions";
import CustomForm from "../../../_components/CustomForm";
import {
  CertificatesType,
  CustomLocales,
} from "@/services/interface/type";
import { useServerQueryById } from "@/hooks/useServerActions";
import { pageRoutes } from "@/app/(dashboard)/_type/constant";
import FormWrapper from "@/globalElement/form/FormWrapper";
import LanguageComponent from "@/app/(dashboard)/_components/LanguageComponent";
import { getCertificatesById, uptadeCertificates } from "@/actions/client/certificates/certificates.controller";
import { certificates_list } from "@/app/(dashboard)/_type/query-key";
import { UpdateCertificatesInput, uptadeCertificatesSchema } from "@/actions/client/certificates/certificates.schema";
  
export default function CategriesUptadeContent() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = searchParams?.get("locale") ?? "en";
  const getCategoryWrapper = async () => {
    const result = await getCertificatesById({
      locale: locale as CustomLocales,
      id: id as string,
    });

    return {
      data: result as unknown as CertificatesType,
    };
  };

  const { data: existingData } = useServerQueryById<CertificatesType>(
    certificates_list,
    getCategoryWrapper,
    id,
    { locale },
  );

  const translation = existingData?.translations?.[0];

  const generalContentForm = useForm<UpdateCertificatesInput>({
    mode: "onChange",
    resolver: zodResolver(uptadeCertificatesSchema),
    values: {
      id: existingData?.id,
      title: translation?.title || "",
      description: translation?.description || null,
      locale: locale as CustomLocales,
    },
  });
  const { execute, isExecuting } = useAction(uptadeCertificates, {
    queryKey: certificates_list,
    onSuccess: (data) => {
      router.push(pageRoutes.certificates.root);
      router.refresh();
      generalContentForm.reset();
    },
    onError: (err) => {
      console.log(err);
    },
  });
  const onSubmit = async (data: UpdateCertificatesInput) => {
    await execute(data);
  };

  return (
    <>
      <section className={"flex flex-col gap-4 mb-2"}>
        <LanguageComponent locale={locale} />

        <FormWrapper
          methods={generalContentForm}
          schema={uptadeCertificatesSchema}
          onSubmit={onSubmit}
        >
          <CustomForm isPending={isExecuting} title={translation?.title} />
        </FormWrapper>
      </section>
    </>
  );
}
