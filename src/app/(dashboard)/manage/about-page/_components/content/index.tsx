"use client";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AboutMainType, CustomLocales } from "@/services/interface/type";
import { useAction } from "next-safe-action/hooks";
import FormWrapper from "@/globalElement/form/FormWrapper";
import FieldBlock from "@/app/(dashboard)/_components/contentBlock";
import FormInput from "@/globalElement/form/FormInput";
import NavigateBtn from "@/app/(dashboard)/_components/navigateBtn";
import SubmitAdminButton from "@/app/(dashboard)/_components/submitBtn";
import { parseJSON } from "@/utils/parseJson";
import { NewInfoJson } from "@/app/(dashboard)/_type/global.type";
import { JsonSectionList } from "@/app/(dashboard)/_components/JsonSectionBlock";
import {
  UpsertAboutMainInfoInput,
  upsertAboutMainInfoSchema,
} from "@/actions/client/aboutMain/aboutMain.schema";
import FormRichEditor from "@/globalElement/form/FormRichEditor";
import { upsetAbouMainInfo } from "@/actions/client/aboutMain/aboutMain.controller";
import { getBranches } from "@/actions/client/branches/branches.controller";
import { branches_list } from "@/app/(dashboard)/_type/query-key";
import { useServerQuery } from "@/hooks/useServerActions";
import { useDropdownOptions } from "@/hooks/useDropdownOptions";
import FormSelect from "@/globalElement/form/FormSelect";
interface Props {
  existingData: AboutMainType | undefined;
  refetch: () => void;
}

const SECTION_TYPE_OPTIONS = [
  { value: "faq", label: "FAG" },
  { value: "main", label: "Main Info" },
  { value: "benefits", label: "Who we are" },
  { value: "activity", label: "Activity Regions" },
  { value: "branches", label: "International Branches" },
  { value: "services", label: "Our Services" },
  { value: "statistics", label: "Our Statistics" },
] as const;

const SECTION_TYPE_CONFIG = {
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
    showSectionTitle: false,
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
  activity: {
    showSectionDescription: true,
    richSectionDescription: true,
    showItems: true,
    showItemDescription: true,
    showSectionTitle: true,
    extraItemFields: [
      {
        fieldKey: "badge",
        label: "Item Badge",
        type: "input" as const,
      },
    ],
    extraMainFields: [
      {
        fieldKey: "subTitle",
        label: "Section subTitle",
        type: "input" as const,
      },
    ],
  },
  services: {
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
  branches: {
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
  benefits: {
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
};

export default function Content({ existingData, refetch }: Props) {
  const searchParams = useSearchParams();
  const locale = searchParams?.get("locale") ?? "en";
  const existingTr = existingData?.translations?.[0];
  const generalFormInput = useForm<UpsertAboutMainInfoInput>({
    resolver: zodResolver(upsertAboutMainInfoSchema),
    mode: "onChange",
    values: {
      title: existingTr?.title || "",
      subTitle: existingTr?.subTitle,
      description: parseJSON<NewInfoJson>(existingTr?.description)?.data,
      hightlight: existingTr?.hightlight,
      shortDescription: existingTr?.shortDescription,
      locale: locale as CustomLocales,
      branches: existingData?.branches?.map((branch) => branch.id) || [],
    },
  });

  const { formState } = generalFormInput;
  const { isDirty } = formState;
  const { execute, isExecuting } = useAction(upsetAbouMainInfo, {
    onSuccess: (data) => {
      refetch();
    },
  });
  const onSubmit = async (data: UpsertAboutMainInfoInput) => {
    await execute(data);
  };
  const { data, isLoading } = useServerQuery(branches_list, getBranches, {
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
        label: tr.countryName,
      })),
    ) || [],
    "value",
    "label",
  );

  return (
    <section className="flex flex-col gap-4 mb-2">
      <FormWrapper
        methods={generalFormInput}
        onSubmit={onSubmit}
        schema={upsertAboutMainInfoSchema}
        className="grid grid-cols-1 gap-3"
      >
        <div className="flex flex-col space-y-4">
          <FieldBlock>
            <FormInput label="Title" fieldName="title" />
            <FormInput label="Sub Title" fieldName="subTitle" />
            <FormInput label="Hightlight" fieldName="hightlight" />
            <FormSelect
              fieldName="branches"
              label="Branches"
              placeholder="Select Branches"
              options={enumOptions}
              loading={isLoading}
              mode="multiple"
            />
            <FormRichEditor
              label="Short description"
              fieldName="shortDescription"
            />
            <JsonSectionList
              fieldName="description"
              typeOptions={[...SECTION_TYPE_OPTIONS]}
              typeConfig={SECTION_TYPE_CONFIG}
            />
          </FieldBlock>
        </div>

        <div className="flex flex-col space-y-4">
          <div className="grid grid-cols-2 gap-4 mt-auto max-w-lg">
            <NavigateBtn />
            <SubmitAdminButton
              title={existingTr?.title}
              isLoading={isExecuting}
              disabled={!isDirty || isExecuting}
            />
          </div>
        </div>
      </FormWrapper>
    </section>
  );
}
