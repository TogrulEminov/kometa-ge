"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAction } from "@/hooks/useServerActions";
import { BranchItem, CustomLocales, Office } from "@/services/interface/type";
import { useServerQueryById } from "@/hooks/useServerActions";

import { pageRoutes } from "@/app/(dashboard)/_type/constant";
import FormWrapper from "@/globalElement/form/FormWrapper";
import LanguageComponent from "@/app/(dashboard)/_components/LanguageComponent";
import {
  getBranchById,
  updateBranch,
} from "@/actions/client/branches/branches.controller";
import { branches_list } from "@/app/(dashboard)/_type/query-key";
import {
  UpdateBranchInput,
  updateBranchSchema,
} from "@/actions/client/branches/branches.schema";
import CustomForm from "../../../CustomForm";
export default function CategriesUptadeContent() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = searchParams?.get("locale") ?? "en";
  const getCategoryWrapper = async () => {
    const result = await getBranchById({
      locale: locale as CustomLocales,
      id: id as string,
    });

    return {
      data: result.data as unknown as BranchItem | undefined,
    };
  };

  const { data: existingData } = useServerQueryById<BranchItem>(
    branches_list,
    getCategoryWrapper,
    id,
    { locale },
  );
  console.log(existingData);

  const translation = existingData?.translations?.[0];

  const generalContentForm = useForm<UpdateBranchInput>({
    mode: "onChange",
    resolver: zodResolver(updateBranchSchema),
    values: {
      id: existingData?.id,
      countryName: translation?.countryName || "",
      isoCode: existingData?.isoCode || "",
      status: existingData?.status || "ACTIVE",
      locale: locale as CustomLocales,
    },
  });
  const { execute, isExecuting } = useAction(updateBranch, {
    queryKey: branches_list,
    onSuccess: (data) => {
      router.push(pageRoutes.branches.root);
      router.refresh();
      generalContentForm.reset();
    },
    onError: (err) => {
      console.log(err);
    },
  });
  const onSubmit = async (data: UpdateBranchInput) => {
    await execute(data);
  };

  return (
    <>
      <section className={"flex flex-col gap-4 mb-2"}>
        <LanguageComponent locale={locale} />

        <FormWrapper
          methods={generalContentForm}
          schema={updateBranchSchema}
          onSubmit={onSubmit}
        >
          <CustomForm
            isPending={isExecuting}
            title={translation?.countryName}
          />
        </FormWrapper>
      </section>
    </>
  );
}
