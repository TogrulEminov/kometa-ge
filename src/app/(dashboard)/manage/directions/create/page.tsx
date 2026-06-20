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
  CreateDirectionsInput,
  createDirectionsSchema,
} from "@/actions/client/directions/directions.schema";
import { createDirections } from "@/actions/client/directions/directions.controller";
export default function CreatePage() {
  const searchParams = useSearchParams();
  const locale = searchParams?.get("locale") ?? "az";
  const router = useRouter();

  const generalContentForm = useForm<CreateDirectionsInput>({
    resolver: zodResolver(createDirectionsSchema),
    defaultValues: {
      title: "",
      slug: "",
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
      imageId: undefined,
      description: [],
      navTitle: "",
      shortDescription: "",
      route: {
        from: "",
        to: "",
      },
      locale: locale as CustomLocales,
    },
  });

  const { execute, isExecuting } = useAction(createDirections, {
    onSuccess: (data) => {
      console.log("succes", data);
      router.push(pageRoutes.directions.root);
      router.refresh();
      generalContentForm.reset();
    },
    onError(err) {
      console.log(err);
    },
  });
  const onSubmit = async (data: CreateDirectionsInput) => {
    await execute(data);
  };

  return (
    <>
      <section className={"flex flex-col gap-4 mb-5"}>
        <LanguageComponent locale={locale} />
        <FormWrapper
          methods={generalContentForm}
          schema={createDirectionsSchema}
          onSubmit={onSubmit}
        >
          <CustomForm isImage={true} isPending={isExecuting} />
        </FormWrapper>
      </section>
    </>
  );
}
