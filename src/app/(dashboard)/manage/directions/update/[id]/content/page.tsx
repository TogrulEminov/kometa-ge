"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAction } from "next-safe-action/hooks";
import CustomForm from "../../../_components/CustomForm";
import { CustomLocales, DirectionsType } from "@/services/interface/type";
import { useServerQueryById } from "@/hooks/useServerActions";
import { pageRoutes } from "@/app/(dashboard)/_type/constant";
import FormWrapper from "@/globalElement/form/FormWrapper";
import LanguageComponent from "@/app/(dashboard)/_components/LanguageComponent";
import { parseJSON, parseRoute } from "@/utils/parseJson";
import { NewInfoJson } from "@/app/(dashboard)/_type/global.type";
import {
  getDirectionsById,
  uptadeDirections,
} from "@/actions/client/directions/directions.controller";
import { directions_list } from "@/app/(dashboard)/_type/query-key";
import {
  UpdateDirectionsInput,
  uptadeDirectionsSchema,
} from "@/actions/client/directions/directions.schema";
export default function CategriesUptadeContent() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = searchParams?.get("locale") ?? "en";
  const getCategoryWrapper = async () => {
    const result = await getDirectionsById({
      locale: locale as CustomLocales,
      id: id as string,
    });

    return {
      data: result as unknown as DirectionsType,
    };
  };

  const { data: existingData } = useServerQueryById<DirectionsType>(
    directions_list,
    getCategoryWrapper,
    id,
    { locale },
  );

  const translation = existingData?.translations?.[0];
  const seo = translation?.seo;

  const generalContentForm = useForm<UpdateDirectionsInput>({
    mode: "onChange",
    resolver: zodResolver(uptadeDirectionsSchema),
    values: {
      id: existingData?.id,
      title: translation?.title || "",
      navTitle: translation?.navTitle || "",
      slug: translation?.slug || "",
      route: parseRoute(existingData?.route),
      shortDescription: translation?.shortDescription || "",
      description: parseJSON<NewInfoJson>(translation?.description)?.data,
      metaTitle: seo?.metaTitle || "",
      metaDescription: seo?.metaDescription || "",
      metaKeywords: seo?.metaKeywords || "",
      locale: locale as CustomLocales,
    },
  });

  const { execute, isExecuting } = useAction(uptadeDirections, {
    onSuccess: (data) => {
      router.push(pageRoutes.directions.root);
      router.refresh();
      generalContentForm.reset();
    },
    onError: (err) => {
      console.log(err);
    },
  });
  const onSubmit = async (data: UpdateDirectionsInput) => {
    await execute(data);
  };

  return (
    <>
      <section className={"flex flex-col gap-4 mb-2"}>
        <LanguageComponent locale={locale} />

        <FormWrapper
          methods={generalContentForm}
          schema={uptadeDirectionsSchema}
          onSubmit={onSubmit}
        >
          <CustomForm isPending={isExecuting} title={translation?.title} />
        </FormWrapper>
      </section>
    </>
  );
}
