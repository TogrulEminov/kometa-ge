"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HeroInfo } from "@/services/interface/type";
import { hero_info_list } from "@/app/(dashboard)/_type/query-key";
import { useAction } from "@/hooks/useServerActions";
import { uptadeHeroVideo } from "@/actions/client/hero/hero.controller";
import OneImageView from "@/app/(dashboard)/_components/imageView/single";
import FieldBlock from "@/app/(dashboard)/_components/contentBlock";
import SingleUploadImage from "@/app/(dashboard)/_components/upload/single";
import NavigateBtn from "@/app/(dashboard)/_components/navigateBtn";
import SubmitAdminButton from "@/app/(dashboard)/_components/submitBtn";
import FormWrapper from "@/globalElement/form/FormWrapper";
import {
  UpdateVideoInput,
  videoSchema,
} from "@/actions/client/hero/hero.schema";

interface Props {
  existingData: HeroInfo | undefined;
  refetch: () => void;
}
export default function UpdateVideoComponent({ existingData, refetch }: Props) {
  const generalForm = useForm<UpdateVideoInput>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      videoId: undefined,
    },
  });
  const { execute, isExecuting } = useAction(uptadeHeroVideo, {
    queryKey: hero_info_list,
    onSuccess: async () => {
      await refetch();
      generalForm.reset({ videoId: undefined });
    },
  });
  const onSubmit = async (data: UpdateVideoInput) => {
    await execute(data);
  };
  return (
    <>
      <section className={"flex flex-col gap-4 mb-4.5"}>
        <FormWrapper
          methods={generalForm}
          schema={videoSchema}
          onSubmit={onSubmit}
          className={"grid grid-cols-1 gap-2"}
        >
          <OneImageView
            selectedImage={existingData?.videoUrl || null}
            onDeleteSuccess={refetch}
          />

          <FieldBlock>
            <SingleUploadImage
              fieldName="videoId"
              acceptType="video/*"
              label="Upload video"
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
