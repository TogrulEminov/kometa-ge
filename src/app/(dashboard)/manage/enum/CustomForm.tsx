"use client";
import FieldBlock from "../../_components/contentBlock";
import NavigateBtn from "../../_components/navigateBtn";
import { useFormContext } from "react-hook-form";
import SubmitAdminButton from "../../_components/submitBtn";
import FormInput from "@/globalElement/form/FormInput";
import FormSelect from "@/globalElement/form/FormSelect";
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

          <FormSelect
            label="Select Keyword"
            placeholder="Select"
            options={[
              {
                value: "contact",
                label: "Contact",
              },
            ]}
            fieldName="key"
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
