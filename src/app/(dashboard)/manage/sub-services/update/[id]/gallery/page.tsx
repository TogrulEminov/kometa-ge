"use client";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { FileType, SubServicesType,  } from "@/services/interface/type";
import { useServerQueryById } from "@/hooks/useServerActions";
import {
  gallerySchema,
  GallerySchemaInput,
} from "@/app/(dashboard)/_type/global.type";
import FormWrapper from "@/globalElement/form/FormWrapper";
import FieldBlock from "@/app/(dashboard)/_components/contentBlock";
import ReactFancyBox from "@/lib/fancybox";
import NavigateBtn from "@/app/(dashboard)/_components/navigateBtn";
import MultiImageView from "@/app/(dashboard)/_components/imageView/multi";
import MultiUploadImage from "@/app/(dashboard)/_components/upload/multi";
import { getSubServicesById, updateSubServicesGallery } from "@/actions/client/services-sub/services-sub.controller";
import { sub_services_list } from "@/app/(dashboard)/_type/query-key";
import SubmitAdminButton from "@/app/(dashboard)/_components/submitBtn";

export default function UpdateGalleryPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const getCategoryWrapper = async () => {
    const result = await getSubServicesById({
      locale: "en",
      id: id as string,
    });
    return {
      data: result as unknown as SubServicesType | undefined,
    };
  };

  const { data: existingData, refetch } = useServerQueryById<SubServicesType>(
    sub_services_list,
    getCategoryWrapper,
    id,
    { locale: "en" },
  );

  const generalForm = useForm<GallerySchemaInput>({
    resolver: zodResolver(gallerySchema),
    values: {
      id: existingData?.id,
      galleryIds: existingData?.gallery.map((item) => Number(item.id)) || [],
    },
  });
  const { execute, isExecuting } = useAction(updateSubServicesGallery, {
    onSuccess: async (data) => {
      await refetch();
      generalForm.reset();
      generalForm.setValue("galleryIds", []);
    },  
    onError: (err) => {
      console.log(err);
    },
  });
  const onSubmit = async (data: GallerySchemaInput) => {
    await execute(data);
  };

  return (
    <>
      <section className={"flex flex-col gap-4 mb-4.5"}>
        <h1 className={"text-2xl font-medium text-[#171717] mb-8"}>
          Change Existing Gallery
        </h1>

        <FormWrapper
          methods={generalForm}
          schema={gallerySchema}
          onSubmit={onSubmit}
          className="space-y-10"
        >
          <MultiImageView
            selectedImages={existingData?.gallery as unknown as FileType[]}
            onDeleteSuccess={refetch}
          />

          <FieldBlock title="Change Existing Image">
            <ReactFancyBox>
              <MultiUploadImage
                fieldName="galleryIds"
                acceptType="image/*"
                maxCount={10}
                maxSize={10}
              />
            </ReactFancyBox>
          </FieldBlock>

          <div className={"grid grid-cols-2 gap-5"}>
            <NavigateBtn />
            <SubmitAdminButton
              title={existingData?.translations?.[0]?.title}
              isLoading={isExecuting}
              disabled={!generalForm.formState.isDirty || isExecuting}
            />
          </div>
        </FormWrapper>
      </section>
    </>
  );
}
