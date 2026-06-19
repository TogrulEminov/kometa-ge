"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import CustomForm from "../CustomForm";
import { CustomLocales } from "@/services/interface/type";
import { useAction } from "next-safe-action/hooks";
import { pageRoutes } from "@/app/(dashboard)/_type/constant";
import LanguageComponent from "@/app/(dashboard)/_components/LanguageComponent";
import FormWrapper from "@/globalElement/form/FormWrapper";
import {
  CreateFagInput,
  createFagSchema,
} from "@/actions/client/fags/fags.schema";
import { createFag } from "@/actions/client/fags/fags.controller";

export default function CreateContent() {
  const searchParams = useSearchParams();
  const locale = searchParams?.get("locale") ?? "az";
  const router = useRouter();
  const generalForm = useForm<CreateFagInput>({
    mode: "onChange",
    resolver: zodResolver(createFagSchema),
    defaultValues: {
      title: "",
      description: null,
      locale: locale as CustomLocales,
    },
  });
  const { execute, isExecuting } = useAction(createFag, {
    onSuccess: () => {
      generalForm.reset();
      router.push(pageRoutes.faq.root);
      router.refresh();
    },
  });
  const onSubmit = async (data: CreateFagInput) => {
    execute(data);
  };

  return (
    <>
      <section className={"flex flex-col gap-4 mb-5"}>
        <LanguageComponent locale={locale} />
        <FormWrapper
          methods={generalForm}
          schema={createFagSchema}
          onSubmit={onSubmit}
          className={"grid grid-cols-1 gap-5"}
        >
          <CustomForm isPending={isExecuting} />
        </FormWrapper>
      </section>
    </>
  );
}
