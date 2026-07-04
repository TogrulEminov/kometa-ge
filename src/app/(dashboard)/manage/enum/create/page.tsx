"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import CustomForm from "../CustomForm";
import { CustomLocales, EnumKey } from "@/services/interface/type";
import { enum_list } from "@/app/(dashboard)/_type/query-key";
import { useAction } from "@/hooks/useServerActions";
import { pageRoutes } from "@/app/(dashboard)/_type/constant";
import LanguageComponent from "@/app/(dashboard)/_components/LanguageComponent";
import FormWrapper from "@/globalElement/form/FormWrapper";
import {
  CreateEnumInput,
  createEnumSchema,
} from "@/actions/client/enum/enum.schema";
import { createEnum } from "@/actions/client/enum/enum.controller";

export default function CreateContent() {
  const searchParams = useSearchParams();
  const locale = searchParams?.get("locale") ?? "az";
  const router = useRouter();
  const generalForm = useForm<CreateEnumInput>({
    mode: "onChange",
    resolver: zodResolver(createEnumSchema),
    defaultValues: {
      title: "",
      key: EnumKey.contact,
      locale: locale as CustomLocales,
    },
  });
  const { execute, isExecuting } = useAction(createEnum, {
    queryKey: enum_list,
    onSuccess: () => {
      generalForm.reset();
      router.push(pageRoutes.enum.root);
      router.refresh();
    },
  });
  const onSubmit = async (data: CreateEnumInput) => {
    execute(data);
  };

  return (
    <>
      <section className={"flex flex-col gap-4 mb-5"}>
        <LanguageComponent locale={locale} />
        <FormWrapper
          methods={generalForm}
          schema={createEnumSchema}
          onSubmit={onSubmit}
          className={"grid grid-cols-1 gap-5"}
        >
          <CustomForm isPending={isExecuting} />
        </FormWrapper>
      </section>
    </>
  );
}
