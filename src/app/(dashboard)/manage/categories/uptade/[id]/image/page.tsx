"use client";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAction } from "next-safe-action/hooks";
import {
  getCategoriesById,
  uptadeCategoryImage,
} from "@/actions/client/categories/category.controller";
import { Category, FileType } from "@/services/interface/type";
import { useServerQueryById } from "@/hooks/useServerActions";
import { categories_content_list } from "@/app/(dashboard)/_type/query-key";
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

export default function CategoriesUpdateImagePage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const getCategoryWrapper = async () => {
    const result = await getCategoriesById({
      locale: "en",
      id: id as string,
    });
    return {
      data: result.data as Category | undefined,
      message: result.message,
      code: result.code,
    };
  };

  const { data: existingData, refetch } = useServerQueryById<Category>(
    categories_content_list,
    getCategoryWrapper,
    id,
    { locale: "az" },
  );

  const generalForm = useForm<ImageSchemaInput>({
    resolver: zodResolver(imageSchema),
    values: {
      id: existingData?.id,
      imageId: existingData?.imageUrl?.id || undefined,
    },
  });

  const { execute, isExecuting } = useAction(uptadeCategoryImage, {
    onSuccess: (data) => {
      generalForm.reset();
      generalForm.setValue("imageId", null);
    },
    onError: (err) => {
      console.log(err);
    },
  });
  console.log(generalForm.formState.errors);
  const onSubmit = async (data: ImageSchemaInput) => {
    await execute(data);
  };

  return (
    <>
      <section className={"flex flex-col gap-4 mb-4.5"}>
        <h1 className={"text-2xl font-medium text-[#171717] mb-8"}>
          Şəkili dəyişin
        </h1>

        <FormWrapper
          methods={generalForm}
          schema={imageSchema}
          onSubmit={onSubmit}
        >
          <OneImageView
            selectedImage={existingData?.imageUrl as unknown as FileType}
            onDeleteSuccess={refetch}
          />

          <FieldBlock title="Şəkili daxil et">
            <ReactFancyBox>
              <SingleUploadImage
                fieldName="imageId"
                label="Şəkil yüklə"
                acceptType="image/*"
              />
            </ReactFancyBox>
          </FieldBlock>

          <div className={"grid grid-cols-2 gap-5"}>
            <NavigateBtn />
            <SubmitAdminButton
              title="Şəkili dəyiş"
              isLoading={isExecuting}
              disabled={!generalForm.formState.isDirty || isExecuting}
            />
          </div>
        </FormWrapper>
      </section>
    </>
  );
}
