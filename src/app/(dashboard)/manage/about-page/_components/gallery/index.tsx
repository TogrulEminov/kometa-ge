"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AboutMainType } from "@/services/interface/type";
import {
  gallerySchema,
  GallerySchemaInput,
} from "@/app/(dashboard)/_type/global.type";
import { about_page_list } from "@/app/(dashboard)/_type/query-key";
import { useAction } from "@/hooks/useServerActions";
import { upsertAboutMainGallery } from "@/actions/client/aboutMain/aboutMain.controller";
import FieldBlock from "@/app/(dashboard)/_components/contentBlock";
import MultiImageView from "@/app/(dashboard)/_components/imageView/multi";
import MultiUploadImage from "@/app/(dashboard)/_components/upload/multi";
import NavigateBtn from "@/app/(dashboard)/_components/navigateBtn";
import SubmitAdminButton from "@/app/(dashboard)/_components/submitBtn";
import FormWrapper from "@/globalElement/form/FormWrapper";
interface Props {
  existingData: AboutMainType | undefined;
  refetch: () => void;
}
export default function GalleryUpdateImage({ existingData, refetch }: Props) {
  const router = useRouter();

  const generalForm = useForm<GallerySchemaInput>({
    resolver: zodResolver(gallerySchema),
    values: {
      galleryIds: existingData?.gallery?.map((item) => Number(item.id)) || [],
    },
  });

  const { execute, isExecuting } = useAction(upsertAboutMainGallery, {
    queryKey: about_page_list,
    onSuccess: async () => {
      await refetch();
      router.refresh();
    },
  });
  const onSubmit = async (data: GallerySchemaInput) => {
    execute(data);
  };

  return (
    <section className="flex flex-col gap-4 mb-4.5">
      <h1 className="text-2xl font-medium text-[#171717] mb-4">
        Change your gallery images
      </h1>

      <FormWrapper
        methods={generalForm}
        schema={gallerySchema}
        onSubmit={onSubmit}
        className="grid grid-cols-1 gap-5"
      >
        <FieldBlock>
          <MultiImageView
            selectedImages={existingData?.gallery || []}
            onDeleteSuccess={refetch}
          />
          <div className="mt-4">
            <MultiUploadImage
              maxCount={2}
              fieldName="galleryIds"
              maxSize={2}
              acceptType="image/*"
            />
          </div>
        </FieldBlock>

        <div className="grid grid-cols-2 gap-5 max-w-lg">
          <NavigateBtn />
          <SubmitAdminButton
            title={existingData?.translations?.[0]?.title}
            isLoading={isExecuting}
            disabled={!generalForm.formState.isDirty || isExecuting}
          />
        </div>
      </FormWrapper>
    </section>
  );
}
