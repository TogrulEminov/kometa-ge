"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import CustomForm from "../_components/CustomForm";
import { certificates_list } from "@/app/(dashboard)/_type/query-key";
import { useAction } from "@/hooks/useServerActions";
import { CustomLocales } from "@/services/interface/type";
import { pageRoutes } from "../../../_type/constant";
import FormWrapper from "@/globalElement/form/FormWrapper";
import LanguageComponent from "@/app/(dashboard)/_components/LanguageComponent";
import { CreateCertificatesInput, createCertificatesSchema } from "@/actions/client/certificates/certificates.schema";
import { createCertificates } from "@/actions/client/certificates/certificates.controller";
 
export default function CreatePage() {
  const searchParams = useSearchParams();
  const locale = searchParams?.get("locale") ?? "az";
  const router = useRouter();
  const generalContentForm = useForm<CreateCertificatesInput>({
    resolver: zodResolver(createCertificatesSchema),
    defaultValues: {
      title: "",
      imageId: undefined,
      galleryIds: [],
      description: null,
      locale: locale as CustomLocales,
    },
  });
  const { execute, isExecuting } = useAction(createCertificates, {
    queryKey: certificates_list,
    onSuccess: (data) => {
      console.log("succes", data);
      router.push(pageRoutes.certificates.root);
      router.refresh();
      generalContentForm.reset();
    },
    onError(err) {
      console.log(err);
    },
  });
  const onSubmit = async (data: CreateCertificatesInput) => {
    await execute(data);
  };

  return (
    <>
      <section className={"flex flex-col gap-4 mb-5"}>
        <LanguageComponent locale={locale} />
        <FormWrapper
          methods={generalContentForm}
          schema={createCertificatesSchema}
          onSubmit={onSubmit}
        >
          <CustomForm isImage={true} isPending={isExecuting} />
        </FormWrapper>
      </section>
    </>
  );
}
