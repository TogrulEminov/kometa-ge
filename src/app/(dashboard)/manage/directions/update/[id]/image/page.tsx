"use client";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { DirectionsType, FileType } from "@/services/interface/type";
import { useServerQueryById } from "@/hooks/useServerActions";
import {
  imageSchema,
  ImageSchemaInput,
} from "@/app/(dashboard)/_type/global.type";
import FormWrapper from "@/globalElement/form/FormWrapper";
import OneImageView from "@/app/(dashboard)/_components/imageView/single";
import FieldBlock from "@/app/(dashboard)/_components/contentBlock";
import ReactFancyBox from "@/lib/fancybox";
import SingleUploadImage from "@/app/(dashboard)/_components/upload/single";
import NavigateBtn from "@/app/(dashboard)/_components/navigateBtn";
import SubmitAdminButton from "@/app/(dashboard)/_components/submitBtn";
import {
  getDirectionsById,
  uptadeDirectionsImage,
} from "@/actions/client/directions/directions.controller";
import { directions_list } from "@/app/(dashboard)/_type/query-key";

export default function CategoriesUpdateImagePage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const getCategoryWrapper = async () => {
    const result = await getDirectionsById({
      locale: "en",
      id: id as string,
    });
    return {
      data: result as unknown as DirectionsType | undefined,
    };
  };

  const { data: existingData, refetch } = useServerQueryById<DirectionsType>(
    directions_list,
    getCategoryWrapper,
    id,
    { locale: "en" },
  );

  const generalForm = useForm<ImageSchemaInput>({
    resolver: zodResolver(imageSchema),
    values: {
      id: existingData?.id,
      imageId: existingData?.imageId || undefined,
    },
  });

  const { execute, isExecuting } = useAction(uptadeDirectionsImage, {
    onSuccess: async (data) => {
      await refetch();
      generalForm.reset();
      generalForm.setValue("imageId", null);
    },
    onError: (err) => {
      console.log(err);
    },
  });
  const onSubmit = async (data: ImageSchemaInput) => {
    await execute(data);
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
          className="space-y-10"
        >
          <OneImageView
            selectedImage={existingData?.imageUrl as unknown as FileType}
            onDeleteSuccess={refetch}
          />

          <FieldBlock title="Change Existing Image">
            <ReactFancyBox>
              <SingleUploadImage
                onRemoveSuccess={refetch}
                fieldName="imageId"
                acceptType="image/*"
              />
            </ReactFancyBox>
          </FieldBlock>

          <div className={"grid grid-cols-2 gap-5"}>
            <NavigateBtn />
            <SubmitAdminButton
              title="Change Existing Image"
              isLoading={isExecuting}
              disabled={!generalForm.formState.isDirty || isExecuting}
            />
          </div>
        </FormWrapper>
      </section>
    </>
  );
}
