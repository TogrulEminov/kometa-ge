"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { offices_list } from "@/app/(dashboard)/_type/query-key";
import { useAction } from "@/hooks/useServerActions";
import { CustomLocales } from "@/services/interface/type";
import { pageRoutes } from "../../../_type/constant";
import FormWrapper from "@/globalElement/form/FormWrapper";
import LanguageComponent from "@/app/(dashboard)/_components/LanguageComponent";
import CustomForm from "../CustomForm";
import { CreateOfficeInput, createOfficeSchema } from "@/actions/client/offices/offices.schema";
import { createOffice } from "@/actions/client/offices/offices.controller";
export default function CreateCategories() {
  const searchParams = useSearchParams();
  const locale = searchParams?.get("locale") ?? "az";
  const router = useRouter();

  const generalContentForm = useForm<CreateOfficeInput>({
    resolver: zodResolver(createOfficeSchema),
    defaultValues: {
      city: "",
      address: "",
      branchId: "",
      type: "office",
      locale: locale as CustomLocales,
    },
  });

  const { execute, isExecuting } = useAction(createOffice, {
    queryKey: offices_list,
    onSuccess: (data) => {
      console.log("succes", data);
      router.push(pageRoutes.offices.root);
      router.refresh();
      generalContentForm.reset();
    },
    onError(err) {
      console.log(err);
    },
  });
  const onSubmit = async (data: CreateOfficeInput) => {
    await execute(data);
  };

  return (
    <>
      <section className={"flex flex-col gap-4 mb-5"}>
        <LanguageComponent locale={locale} />
        <FormWrapper
          methods={generalContentForm}
          schema={createOfficeSchema}
          onSubmit={onSubmit}
        >
          <CustomForm locale={locale as CustomLocales} isPending={isExecuting} />
        </FormWrapper>
      </section>
    </>
  );
}
