"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HeroInfo } from "@/services/interface/type";
import {
  imageSchema,
  ImageSchemaInput,
} from "@/app/(dashboard)/_type/global.type";
import { useAction } from "next-safe-action/hooks";
import { uptadeHeroImage } from "@/actions/client/hero/hero.controller";
import OneImageView from "@/app/(dashboard)/_components/imageView/single";
import FieldBlock from "@/app/(dashboard)/_components/contentBlock";
import SingleUploadImage from "@/app/(dashboard)/_components/upload/single";
import NavigateBtn from "@/app/(dashboard)/_components/navigateBtn";
import SubmitAdminButton from "@/app/(dashboard)/_components/submitBtn";
import FormWrapper from "@/globalElement/form/FormWrapper";

interface Props {
  existingData: HeroInfo | undefined;
  refetch: () => void;
}
export default function UpdateImageComponent({ existingData, refetch }: Props) {
  const generalForm = useForm<ImageSchemaInput>({
    resolver: zodResolver(imageSchema),
    defaultValues: {
      imageId: undefined,
    },
  });
  const { execute, isExecuting } = useAction(uptadeHeroImage, {
    onSuccess: async () => {
      await refetch();
      generalForm.reset({ imageId: undefined });
    },
  });
  const onSubmit = async (data: ImageSchemaInput) => {
    await execute(data);
  };
  return (
    <>
      <section className={"flex flex-col gap-4 mb-4.5"}>
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

          <FieldBlock title="Şəkili daxil et">
            <SingleUploadImage
              label="Yükləmək üçün faylı vurun və ya sürükləyin"
              fieldName="imageId"
              onRemoveSuccess={refetch}
            />
          </FieldBlock>

          <div className={"grid grid-cols-2 gap-5 max-w-lg"}>
            <NavigateBtn />
            <SubmitAdminButton
              title={"true"}
              isLoading={isExecuting}
              disabled={!generalForm.formState.isDirty || isExecuting}
            />
          </div>
        </FormWrapper>
      </section>
    </>
  );
}
