"use client";

import { useFormContext } from "react-hook-form";
import FieldBlock from "../../_components/contentBlock";
import FormInput from "@/globalElement/form/FormInput";
import SingleUploadImage from "../../_components/upload/single";
import NavigateBtn from "../../_components/navigateBtn";
import SubmitAdminButton from "../../_components/submitBtn";

interface Props {
  isImage?: boolean;
  title?: string;
  isPending: boolean;
}
export default function CustomForm({
  isImage = false,
  isPending,
  title,
}: Props) {
  const form = useFormContext();
  const {
    formState: { isDirty },
  } = form;

  return (
    <>
      <div className={"flex flex-col space-y-5"}>
        <FieldBlock>
          <FormInput label="Title" placeholder="Title" fieldName="title" />
          <FormInput label="Video link" type={"url"} fieldName="url" />
        </FieldBlock>
      </div>
      <div className={"flex flex-col space-y-5"}>
        {isImage && (
          <FieldBlock title="Upload image">
            <SingleUploadImage
              label="Upload file by clicking or dragging"
              fieldName="imageId"
            />
          </FieldBlock>
        )}
        <div className={"grid grid-cols-2 gap-5 max-w-lg"}>
          <NavigateBtn />
          <SubmitAdminButton
            title={title}
            isLoading={isPending}
            disabled={!isDirty || isPending}
          />
        </div>
      </div>
    </>
  );
}
