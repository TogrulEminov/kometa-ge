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
interface Props {
  isPending: boolean;
  title?: string | null;
  isImage?: boolean;
}

const SECTION_TYPE_OPTIONS = [
  { value: "main", label: "Main Info" },
  { value: "advantages", label: "Advantages" },
  { value: "statistics", label: "Our Statistics" },
  { value: "process", label: "Our Process" },
  { value: "related_services", label: "Related Services" },
  { value: "delivery", label: "Transport Models" },
] as const;

const SECTION_TYPE_CONFIG = {
  main: {
    showSectionDescription: true,
    richSectionDescription: true,
    showItems: false,
    showItemDescription: false,
    showSectionTitle: true,
    extraMainFields: [
      {
        fieldKey: "subTitle",
        label: "Section subTitle",
        type: "input" as const,
      },
    ],
  },
  related_services: {
    showSectionDescription: false,
    richSectionDescription: false,
    showItems: false,
    showItemDescription: false,
    showSectionTitle: true,
    extraMainFields: [
      {
        fieldKey: "subTitle",
        label: "Section subTitle",
        type: "input" as const,
      },
    ],
  },
  delivery: {
    showSectionDescription: true,
    richSectionDescription: true,
    showItems: false,
    showItemDescription: false,
    showSectionTitle: true,
    extraMainFields: [
      {
        fieldKey: "subTitle",
        label: "Section subTitle",
        type: "input" as const,
      },
    ],
  },
  faq: {
    showSectionDescription: true,
    richSectionDescription: true,
    showItems: true,
    showItemDescription: true,
    showSectionTitle: true,
    extraMainFields: [
      {
        fieldKey: "subTitle",
        label: "Section subTitle",
        type: "input" as const,
      },
    ],
  },
  statistics: {
    showSectionDescription: false,
    richSectionDescription: false,
    showItems: true,
    showItemDescription: false,
    showSectionTitle: true,
    extraMainFields: [
      {
        fieldKey: "subTitle",
        label: "Section subTitle",
        type: "input" as const,
      },
    ],
    extraItemFields: [
      {
        fieldKey: "itemSuffix",
        label: "Suffix",
        type: "input" as const,
      },
      {
        fieldKey: "itemValue",
        label: "Value",
        type: "input" as const,
      },
    ],
  },
  advantages: {
    showSectionDescription: false,
    richSectionDescription: false,
    showItems: true,
    showItemDescription: true,
    showSectionTitle: true,
    extraMainFields: [
      {
        fieldKey: "subTitle",
        label: "Section subTitle",
        type: "input" as const,
      },
    ],
  },

  process: {
    showSectionDescription: true,
    richSectionDescription: false,
    showItems: true,
    showItemDescription: true,
    showSectionTitle: true,
    extraMainFields: [
      {
        fieldKey: "subTitle",
        label: "Section subTitle",
        type: "input" as const,
      },
    ],
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
          <FormTextarea
            fieldName="description"
            label="Detailed Information"
          />
        </FieldBlock>
        <div className={"flex flex-col space-y-5"}>
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
