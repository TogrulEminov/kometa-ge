"use client";
import FieldBlock from "../../_components/contentBlock";
import NavigateBtn from "../../_components/navigateBtn";
import { sectionsContent } from "@/json/pageData.json";
import { useFormContext } from "react-hook-form";
import SubmitAdminButton from "../../_components/submitBtn";
import FormInput from "@/globalElement/form/FormInput";
import FormSelect from "@/globalElement/form/FormSelect";
import FormTextarea from "@/globalElement/form/FormTextarea";
import FormRichEditor from "@/globalElement/form/FormRichEditor";
interface Props {
  title?: string;
  isPending: boolean;
}

export default function CustomForm({ isPending, title }: Props) {
  const form = useFormContext();
  const {
    formState: { isDirty },
  } = form;

  return (
    <>
      <div className={"flex flex-col space-y-5"}>
        <FieldBlock>
          <FormInput
            label="Title"
            placeholder="Enter title"
            fieldName="title"
          />

          <FormInput
            label="Highlight Word"
            placeholder="Enter highlight word"
            fieldName="highlightWord"
          />

          <FormInput
            label="Subtitle"
            placeholder="Enter subtitle"
            fieldName="subTitle"
          />

          <FormSelect
            label="Select Keyword"
            placeholder="Select"
            options={sectionsContent}
            fieldName="key"
          />

          <FormRichEditor
            label="Description"
            fieldName="description"
          />
        </FieldBlock>
      </div>
      <div className={"flex flex-col space-y-5"}>
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
