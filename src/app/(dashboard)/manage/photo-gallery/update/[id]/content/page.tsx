"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAction } from "@/hooks/useServerActions";
import CustomForm from "../../../_components/CustomForm";
import {
  CustomLocales,
  PhotoGalleryType,
  ServicesType,
} from "@/services/interface/type";
import { useServerQueryById } from "@/hooks/useServerActions";
import { pageRoutes } from "@/app/(dashboard)/_type/constant";
import FormWrapper from "@/globalElement/form/FormWrapper";
import LanguageComponent from "@/app/(dashboard)/_components/LanguageComponent";

import { parseJSON } from "@/utils/parseJson";
import { NewInfoJson } from "@/app/(dashboard)/_type/global.type";
import {
  getPhotoGalleryById,
  uptadePhotoGallery,
} from "@/actions/client/photoGallery/photoGallery.controller";
import { photo_gallery_list } from "@/app/(dashboard)/_type/query-key";
import {
  UpdatePhotoGalleryInput,
  uptadePhotoGallerySchema,
} from "@/actions/client/photoGallery/photoGallery.schema";
export default function CategriesUptadeContent() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = searchParams?.get("locale") ?? "en";
  const getCategoryWrapper = async () => {
    const result = await getPhotoGalleryById({
      locale: locale as CustomLocales,
      id: id as string,
    });

    return {
      data: result as unknown as PhotoGalleryType,
    };
  };

  const { data: existingData } = useServerQueryById<PhotoGalleryType>(
    photo_gallery_list,
    getCategoryWrapper,
    id,
    { locale },
  );

  const translation = existingData?.translations?.[0];

  const generalContentForm = useForm<UpdatePhotoGalleryInput>({
    mode: "onChange",
    resolver: zodResolver(uptadePhotoGallerySchema),
    values: {
      id: existingData?.id,
      title: translation?.title || "",
      description: translation?.description || null,
      locale: locale as CustomLocales,
    },
  });
  const { execute, isExecuting } = useAction(uptadePhotoGallery, {
    queryKey: photo_gallery_list,
    onSuccess: (data) => {
      router.push(pageRoutes.photoGallery.root);
      router.refresh();
      generalContentForm.reset();
    },
    onError: (err) => {
      console.log(err);
    },
  });
  const onSubmit = async (data: UpdatePhotoGalleryInput) => {
    await execute(data);
  };

  return (
    <>
      <section className={"flex flex-col gap-4 mb-2"}>
        <LanguageComponent locale={locale} />

        <FormWrapper
          methods={generalContentForm}
          schema={uptadePhotoGallerySchema}
          onSubmit={onSubmit}
        >
          <CustomForm isPending={isExecuting} title={translation?.title} />
        </FormWrapper>
      </section>
    </>
  );
}
