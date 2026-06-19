import FieldBlock from "../../../_components/contentBlock";
import SingleUploadImage from "../../../_components/upload/single";
import NavigateBtn from "../../../_components/navigateBtn";
import CreateButton from "../../../_components/createButton";
import { useFormContext } from "react-hook-form";
import SubmitAdminButton from "../../../_components/submitBtn";
import FormInput from "@/globalElement/form/FormInput";
import FormSelect from "@/globalElement/form/FormSelect";
import { categories } from "@/json/pageData.json";
import SeoContent from "@/app/(dashboard)/_components/SeoContent";
import FormRichEditor from "@/globalElement/form/FormRichEditor";
interface Props {
  isPending: boolean;
  title?: string | null;
  isImage?: boolean;
}
export default function CustomForm({
  isPending,
  title,
  isImage = false,
}: Props) {
  const generalContentForm = useFormContext();

  return (
    <>
      <div className={"flex flex-col space-y-5"}>
        <FieldBlock>
          <FormInput
            label="Title"
            placeholder="Enter title"
            fieldName="title"
            styles={{
              input: {
                height: "40px",
              },
            }}
          />
          <FormSelect
            label="Select Page"
            placeholder="Select Page"
            fieldName="slug"
            options={categories}
          />
          <FormRichEditor
            fieldName="description"
            label="Detailed Information"
          />
        </FieldBlock>
        <div className={"flex flex-col space-y-5"}>
          <SeoContent />
          {isImage && (
            <FieldBlock title="Əsas şəkili daxil et">
              <SingleUploadImage fieldName="imageId" />
            </FieldBlock>
          )}
          <div className={"grid grid-cols-2 gap-5"}>
            <NavigateBtn />
            <SubmitAdminButton
              title={title}
              isLoading={isPending}
              disabled={!generalContentForm.formState.isDirty || isPending}
            />
          </div>
        </div>
      </div>
    </>
  );
}
