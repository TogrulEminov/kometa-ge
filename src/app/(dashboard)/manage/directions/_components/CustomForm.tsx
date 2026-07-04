import FieldBlock from "../../../_components/contentBlock";
import SingleUploadImage from "../../../_components/upload/single";
import NavigateBtn from "../../../_components/navigateBtn";
import { useFormContext } from "react-hook-form";
import SubmitAdminButton from "../../../_components/submitBtn";
import FormInput from "@/globalElement/form/FormInput";
import SeoContent from "@/app/(dashboard)/_components/SeoContent";
import MultiUploadImage from "@/app/(dashboard)/_components/upload/multi";
import { JsonSectionList } from "@/app/(dashboard)/_components/JsonSectionBlock";
import FormTextarea from "@/globalElement/form/FormTextarea";
import FormSelect from "@/globalElement/form/FormSelect";
import { COUNTRY_SELECT_OPTIONS } from "@/utils/countryOptions";
interface Props {
  isPending: boolean;
  title?: string | null;
  isImage?: boolean;
}

const SECTION_TYPE_OPTIONS = [
  { value: "main", label: "Main Info" },
  { value: "cta", label: "Cta" },
  { value: "features", label: "Features" },
  { value: "advantages", label: "Advantages" },
  { value: "faq", label: "FAQ" },
] as const;

const SECTION_TYPE_CONFIG = {
  main: {
    showSectionDescription: true,
    richSectionDescription: true,
    showItems: false,
    showItemDescription: false,
    showSectionTitle: true,
  },
  cta: {
    showSectionDescription: true,
    richSectionDescription: false,
    showItems: false,
    showItemDescription: false,
    showSectionTitle: true,
  },
  features: {
    showSectionDescription: false,
    richSectionDescription: false,
    showItems: true,
    showItemDescription: false,
    showSectionTitle: true,
  },
  faq: {
    showSectionDescription: false,
    richSectionDescription: false,
    showItems: true,
    showItemDescription: true,
    showSectionTitle: true,
  },
  advantages: {
    showSectionDescription: false,
    richSectionDescription: false,
    showItems: true,
    showItemDescription: true,
    showSectionTitle: true,
  },
};

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
          <FormInput
            label="Nav Title"
            placeholder="Enter nav title"
            fieldName="navTitle"
          />
          <FormInput label="Slug" placeholder="Enter slug" fieldName="slug" />
          <FormTextarea
            label="Short Description"
            placeholder="Enter short description"
            fieldName="shortDescription"
          />
          <JsonSectionList
            fieldName="description"
            typeOptions={[...SECTION_TYPE_OPTIONS]}
            typeConfig={SECTION_TYPE_CONFIG}
          />
        </FieldBlock>
        <FieldBlock title="Route">
          <FormSelect
            label="From"
            placeholder="Select country"
            fieldName="route.from"
            options={COUNTRY_SELECT_OPTIONS}
            showSearch
            optionFilterProp="label"
          />
          <FormSelect
            label="To"
            placeholder="Select country"
            fieldName="route.to"
            options={COUNTRY_SELECT_OPTIONS}
            showSearch
            optionFilterProp="label"
          />
        </FieldBlock>
        <div className={"flex flex-col space-y-5"}>
          <SeoContent />
          {isImage && (
            <FieldBlock title="Main image">
              <SingleUploadImage fieldName="imageId" />
            </FieldBlock>
          )}
          {isImage && (
            <FieldBlock title="Gallery images">
              <MultiUploadImage
                fieldName="galleryIds"
                maxCount={10}
                maxSize={10}
                acceptType="image/*"
              />
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
