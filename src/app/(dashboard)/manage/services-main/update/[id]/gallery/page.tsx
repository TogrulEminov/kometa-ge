"use client";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "@/hooks/useServerActions";
import { FileType, ServicesType } from "@/services/interface/type";
import { useServerQueryById } from "@/hooks/useServerActions";
import {
  gallerySchema,
  GallerySchemaInput,
} from "@/app/(dashboard)/_type/global.type";
import FormWrapper from "@/globalElement/form/FormWrapper";
import FieldBlock from "@/app/(dashboard)/_components/contentBlock";
import ReactFancyBox from "@/lib/fancybox";
import NavigateBtn from "@/app/(dashboard)/_components/navigateBtn";
import SubmitAdminButton from "@/app/(dashboard)/_components/submitBtn";
import {
  getServicesById,
  updateServicesGallery,
} from "@/actions/client/services/services.controller";
import { services_main_list } from "@/app/(dashboard)/_type/query-key";
import MultiImageView from "@/app/(dashboard)/_components/imageView/multi";
import MultiUploadImage from "@/app/(dashboard)/_components/upload/multi";

export default function UpdateGalleryPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const getCategoryWrapper = async () => {
    const result = await getServicesById({
      locale: "en",
      id: id as string,
    });
    return {
      data: result as unknown as ServicesType | undefined,
    };
  };

  const { data: existingData, refetch } = useServerQueryById<ServicesType>(
    services_main_list,
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
  const { execute, isExecuting } = useAction(updateServicesGallery, {
    queryKey: services_main_list,
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
