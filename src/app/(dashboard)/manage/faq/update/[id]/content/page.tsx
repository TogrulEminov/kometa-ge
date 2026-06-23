"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAction } from "@/hooks/useServerActions";
import CustomForm from "../../../CustomForm";
import { CustomLocales, FaqItem } from "@/services/interface/type";
import { useServerQueryById } from "@/hooks/useServerActions";
import LanguageComponent from "@/app/(dashboard)/_components/LanguageComponent";
import FormWrapper from "@/globalElement/form/FormWrapper";
import { pageRoutes } from "@/app/(dashboard)/_type/constant";
import { getFagById, updateFag } from "@/actions/client/fags/fags.controller";
import { faq_list } from "@/app/(dashboard)/_type/query-key";
import {
  UpdateFagInput,
  uptadeFagSchema,
} from "@/actions/client/fags/fags.schema";
export default function UptadeContent() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const searchParams = useSearchParams();
  const locale = searchParams?.get("locale") ?? "en";
  const getDataWrapper = async () => {
    const result = await getFagById({
      locale: locale as CustomLocales,
      id: id as string,
    });

    return {
      data: result as unknown as FaqItem,
    };
  };
  const { data: existingData } = useServerQueryById<FaqItem>(
    faq_list,
    getDataWrapper,
    id,
    { locale },
  );

  const translations = existingData?.translations?.[0];

  const generalForm = useForm<UpdateFagInput>({
    resolver: zodResolver(uptadeFagSchema),
    values: {
      id: existingData?.id,
      title: translations?.title || "",
      description: translations?.description || null,
      locale: locale as CustomLocales,
    },
  });
  const { execute, isExecuting } = useAction(updateFag, {
    queryKey: faq_list,
    onSuccess: () => {
      generalForm.reset();
      router.push(pageRoutes.faq.root);
      router.refresh();
    },
  });
  const onSubmit = async (data: UpdateFagInput) => {
    execute(data);
  };

  return (
    <>
      <section className={"flex flex-col gap-4 mb-2"}>
        <LanguageComponent locale={locale} />
        <FormWrapper
          methods={generalForm}
          onSubmit={onSubmit}
          schema={uptadeFagSchema}
          className={"grid grid-cols-1 gap-3"}
        >
          <CustomForm isPending={isExecuting} title={translations?.title} />
        </FormWrapper>
      </section>
    </>
  );
}
