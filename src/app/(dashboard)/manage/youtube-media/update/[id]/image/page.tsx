"use client";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import {
  getYoutubeById,
  updateYoutubeImage,
} from "@/actions/client/youtube/youtube.controller";
import { YoutubeItems } from "@/services/interface/type";
import { useServerQueryById } from "@/hooks/useServerActions";
import { youtube_media_list } from "@/app/(dashboard)/_type/query-key";
import {
  imageSchema,
  ImageSchemaInput,
} from "@/app/(dashboard)/_type/global.type";
import OneImageView from "@/app/(dashboard)/_components/imageView/single";
import FieldBlock from "@/app/(dashboard)/_components/contentBlock";
import SingleUploadImage from "@/app/(dashboard)/_components/upload/single";
import NavigateBtn from "@/app/(dashboard)/_components/navigateBtn";
import SubmitAdminButton from "@/app/(dashboard)/_components/submitBtn";
import FormWrapper from "@/globalElement/form/FormWrapper";

export default function YoutubesUpdateImagePage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const getCategoryWrapper = async () => {
    const result = await getYoutubeById({
      locale: "en",
      id: id as string,
    });

    return {
      data: result.data as unknown as YoutubeItems | undefined,
    };
  };

  const { data: existingData, refetch } = useServerQueryById<YoutubeItems>(
    youtube_media_list,
    getCategoryWrapper,
    id,
    { locale: "en" },
  );

  const generalForm = useForm<ImageSchemaInput>({
    resolver: zodResolver(imageSchema),
    values: {
      id: existingData?.id,
      imageId: Number(existingData?.imageUrl?.id || undefined),
    },
  });
  const {
    handleSubmit,
    formState: { isDirty },
  } = generalForm;
  const { execute, isExecuting } = useAction(updateYoutubeImage, {
    onSuccess: async () => {
      await refetch();
    },
  });
  const onSubmit = async (data: ImageSchemaInput) => {
    execute(data);
  };

  return (
    <>
      <section className={"flex flex-col gap-4 mb-4.5"}>
        <h1 className={"text-2xl font-medium text-[#171717] mb-8"}>
         Change Existing Image
        </h1>

        <FormWrapper
          methods={generalForm}
          schema={imageSchema}
          onSubmit={onSubmit}
          className={"grid grid-cols-1 gap-2"}
        >
          <OneImageView
            selectedImage={existingData?.imageUrl || null}
            onDeleteSuccess={refetch}
          />

          <FieldBlock title="Change Existing Image">
            <SingleUploadImage
              label="Click or drag and drop to upload"
              fieldName="imageId"
              onRemoveSuccess={refetch}
            />
          </FieldBlock>

          <div className={"grid grid-cols-2 gap-5 max-w-lg"}>
            <NavigateBtn />
            <SubmitAdminButton
              title={"Change Existing Image"}
              isLoading={isExecuting}
              disabled={!isDirty || isExecuting}
            />
          </div>
        </FormWrapper>
      </section>
    </>
  );
}
