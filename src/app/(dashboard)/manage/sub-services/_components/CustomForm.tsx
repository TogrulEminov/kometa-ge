import FieldBlock from "../../../_components/contentBlock";
import SingleUploadImage from "../../../_components/upload/single";
import NavigateBtn from "../../../_components/navigateBtn";
import { useFormContext, useWatch } from "react-hook-form";
import SubmitAdminButton from "../../../_components/submitBtn";
import FormInput from "@/globalElement/form/FormInput";
import SeoContent from "@/app/(dashboard)/_components/SeoContent";
import MultiUploadImage from "@/app/(dashboard)/_components/upload/multi";
import { JsonSectionList } from "@/app/(dashboard)/_components/JsonSectionBlock";
import { useServerQuery } from "@/hooks/useServerActions";
import { services_main_list } from "@/app/(dashboard)/_type/query-key";
import { getServices } from "@/actions/client/services/services.controller";
import { CustomLocales } from "@/services/interface/type";
import { useDropdownOptions } from "@/hooks/useDropdownOptions";
import FormSelect from "@/globalElement/form/FormSelect";
import { DynamicIcon } from "@/utils/DynamicIcon";
interface Props {
  isPending: boolean;
  title?: string | null;
  isImage?: boolean;
  locale: CustomLocales;
}

const SECTION_TYPE_OPTIONS = [
  { value: "main", label: "Main Info" },
  { value: "advantages", label: "Advantages" },
  { value: "statistics", label: "Our Statistics" },
  { value: "process", label: "Our Process" },
  { value: "related_services", label: "Related Services" },
  { value: "main_service", label: "Main Service" },
] as const;

const SECTION_TYPE_CONFIG = {
  main: {
    showSectionDescription: true,
    richSectionDescription: true,
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
  main_service: {
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
  locale,
}: Props) {
  const generalContentForm = useFormContext();
  const { control } = generalContentForm;

  const { data } = useServerQuery(services_main_list, getServices, {
    params: {
      page: 1,
      pageSize: 100,
      locale: locale as CustomLocales,
    },
  });

  const enumOptions = useDropdownOptions(
    data?.data?.flatMap((item) =>
      item.translations.map((tr) => ({
        ...tr,
        value: item.id,
        label: tr.title,
      })),
    ) || [],
    "value",
    "label",
  );

  const watchedServicesId = useWatch({ control, name: "iconsUrl" });

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
            label="Select Service"
            placeholder="Select"
            options={enumOptions}
            fieldName="servicesId"
          />
          <FormInput
            label="Icons URL"
            placeholder="Enter icons URL (react icons format)"
            fieldName="iconsUrl"
          />
          {watchedServicesId && (
            <div className="flex items-center justify-center gap-2 size-20 bg-blue-500 text-white rounded-sm">
              <DynamicIcon iconName={watchedServicesId} className="size-10" />
            </div>
          )}
          <FormInput label="Slug" placeholder="Enter slug" fieldName="slug" />
          <JsonSectionList
            fieldName="description"
            typeOptions={[...SECTION_TYPE_OPTIONS]}
            typeConfig={SECTION_TYPE_CONFIG}
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
