"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAction } from "@/hooks/useServerActions";
import { CustomLocales, Office } from "@/services/interface/type";
import { useServerQueryById } from "@/hooks/useServerActions";
import { pageRoutes } from "@/app/(dashboard)/_type/constant";
import FormWrapper from "@/globalElement/form/FormWrapper";
import LanguageComponent from "@/app/(dashboard)/_components/LanguageComponent";
import { getOfficeById, updateOffice } from "@/actions/client/offices/offices.controller";
import { offices_list } from "@/app/(dashboard)/_type/query-key";
import {
  UpdateOfficeInput,
  updateOfficeSchema,
} from "@/actions/client/offices/offices.schema";
import CustomForm from "../../../CustomForm";
export default function UptadeContent() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = searchParams?.get("locale") ?? "en";
  const getCategoryWrapper = async () => {
    const result = await getOfficeById({
      locale: locale as CustomLocales,
      id: id as string,
    });

    return {
      data: result as unknown as Office | undefined,
    };
  };

  const { data: existingData } = useServerQueryById<Office>(
    offices_list,
    getCategoryWrapper,
    id,
    { locale },
  );
  console.log(existingData);

  const translation = existingData?.translations?.[0];

  const generalContentForm = useForm<UpdateOfficeInput>({
    mode: "onChange",
    resolver: zodResolver(updateOfficeSchema),
    values: {
      id: existingData?.id,
      city: translation?.city || "",
      address: translation?.address,
      locale: locale as CustomLocales,
      branchId: existingData?.branchId || "",
      type: existingData?.type || "office",
    },
  });
  const { execute, isExecuting } = useAction(updateOffice, {
    queryKey: offices_list,
    onSuccess: (data) => {
      router.push(pageRoutes.offices.root);
      router.refresh();
      generalContentForm.reset();
    },
    onError: (err) => {
      console.log(err);
    },
  });
  const onSubmit = async (data: UpdateOfficeInput) => {
    await execute(data);
  };

  return (
    <>
      <section className={"flex flex-col gap-4 mb-2"}>
        <LanguageComponent locale={locale} />

        <FormWrapper
          methods={generalContentForm}
          schema={updateOfficeSchema}
          onSubmit={onSubmit}
        >
          <CustomForm locale={locale as CustomLocales} isPending={isExecuting} title={translation?.city} />
        </FormWrapper>
      </section>
    </>
  );
}
