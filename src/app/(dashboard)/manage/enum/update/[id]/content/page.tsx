"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAction } from "@/hooks/useServerActions";
import CustomForm from "../../../CustomForm";
import { CustomLocales, Enum } from "@/services/interface/type";
import { useServerQueryById } from "@/hooks/useServerActions";
import LanguageComponent from "@/app/(dashboard)/_components/LanguageComponent";
import FormWrapper from "@/globalElement/form/FormWrapper";
import { enum_list } from "@/app/(dashboard)/_type/query-key";
import { getEnumById, updateEnum } from "@/actions/client/enum/enum.controller";
import {
  UpdateEnumInput,
  uptadeEnumSchema,
} from "@/actions/client/enum/enum.schema";
import { pageRoutes } from "@/app/(dashboard)/_type/constant";
export default function UptadeContent() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const searchParams = useSearchParams();
  const locale = searchParams?.get("locale") ?? "en";
  const getDataWrapper = async () => {
    const result = await getEnumById({
      locale: locale as CustomLocales,
      id: id as string,
    });

    return {
      data: result as unknown as Enum,
    };
  };
  const { data: existingData } = useServerQueryById<Enum>(
    `${enum_list}/${locale}`,
    getDataWrapper,
    id,
    { locale },
  );

  const translations = existingData?.translations?.[0];

  const enumForm = useForm<UpdateEnumInput>({
    resolver: zodResolver(uptadeEnumSchema),
    values: {
      id: existingData?.id,
      title: translations?.title || "",
      key: existingData?.key || null,
      locale: locale as CustomLocales,
    },
  });
  const { execute, isExecuting } = useAction(updateEnum, {
    queryKey: enum_list,
    onSuccess: () => {
      enumForm.reset();
      router.push(pageRoutes.enum.root);
      router.refresh();
    },
  });
  const onSubmit = async (data: UpdateEnumInput) => {
    execute(data);
  };

  return (
    <>
      <section className={"flex flex-col gap-4 mb-2"}>
        <LanguageComponent locale={locale} />
        <FormWrapper
          methods={enumForm}
          onSubmit={onSubmit}
          schema={uptadeEnumSchema}
          className={"grid grid-cols-1 gap-3"}
        >
          <CustomForm isPending={isExecuting} title={translations?.title} />
        </FormWrapper>
      </section>
    </>
  );
}
