"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAction } from "next-safe-action/hooks";
import { CustomLocales } from "@/services/interface/type";
import { pageRoutes } from "../../../_type/constant";
import FormWrapper from "@/globalElement/form/FormWrapper";
import LanguageComponent from "@/app/(dashboard)/_components/LanguageComponent";
import { CreateBranchInput, createBranchSchema } from "@/actions/client/branches/branches.schema";
import { createBranch } from "@/actions/client/branches/branches.controller";
import CustomForm from "../CustomForm";
export default function CreateCategories() {
  const searchParams = useSearchParams();
  const locale = searchParams?.get("locale") ?? "az";
  const router = useRouter();

  const generalContentForm = useForm<CreateBranchInput>({
    resolver: zodResolver(createBranchSchema),
    defaultValues: {
      isoCode: "",
      countryName: "",
      status: "ACTIVE",
      locale: locale as CustomLocales,
    },
  });

  const { execute, isExecuting } = useAction(createBranch, {
    onSuccess: (data) => {
      console.log("succes", data);
      router.push(pageRoutes.branches.root);
      router.refresh();
      generalContentForm.reset();
    },
    onError(err) {
      console.log(err);
    },
  });
  const onSubmit = async (data: CreateBranchInput) => {
    await execute(data);
  };

  return (
    <>
      <section className={"flex flex-col gap-4 mb-5"}>
        <LanguageComponent locale={locale} />
        <FormWrapper
          methods={generalContentForm}
          schema={createBranchSchema}
          onSubmit={onSubmit}
        >
          <CustomForm isPending={isExecuting} />
        </FormWrapper>
      </section>
    </>
  );
}
