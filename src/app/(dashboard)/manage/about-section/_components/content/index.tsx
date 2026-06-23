"use client";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AboutHomeType, CustomLocales } from "@/services/interface/type";
import { about_section_list } from "@/app/(dashboard)/_type/query-key";
import { useAction } from "@/hooks/useServerActions";
import FormWrapper from "@/globalElement/form/FormWrapper";
import FieldBlock from "@/app/(dashboard)/_components/contentBlock";
import FormInput from "@/globalElement/form/FormInput";
import NavigateBtn from "@/app/(dashboard)/_components/navigateBtn";
import SubmitAdminButton from "@/app/(dashboard)/_components/submitBtn";
import { parseJSON } from "@/utils/parseJson";
import { BiHash } from "react-icons/bi";
import {
  UpsertAboutSectionInfoInput,
  upsertAboutSectionInfoSchema,
} from "@/actions/client/aboutSection/aboutSection.schema";
import { NewInfoJson } from "@/app/(dashboard)/_type/global.type";
import { upsertAboutSectionInfo } from "@/actions/client/aboutSection/aboutSection.controller";
import { JsonSectionList } from "@/app/(dashboard)/_components/JsonSectionBlock";
import FormRichEditor from "@/globalElement/form/FormRichEditor";
interface Props {
  existingData: AboutHomeType | undefined;
  refetch: () => void;
}

const ABOUT_SECTION_TYPE_OPTIONS = [
  { value: "advantages", label: "Advantages" },
  { value: "statistics", label: "Statistics" },
];

const ABOUT_SECTION_TYPE_CONFIG = {
  advantages: {
    showSectionDescription: false,
    richSectionDescription: false,
    showItems: true,
    showItemDescription: false,
  },
  statistics: {
    showSectionDescription: false,
    showItems: true,
    showItemDescription: false,
    showSectionTitle: false,
    extraItemFields: [
      {
        fieldKey: "itemValue",
        label: "Value",
        placeholder: "e.g. 500+",
        type: "input" as const,
        icon: <BiHash className="w-3 h-3" />,
      },
      {
        fieldKey: "itemSuffix",
        label: "Suffix",
        placeholder: "e.g. + , K+",
        type: "input" as const,
      },
    ],
  },
};

export default function Content({ existingData, refetch }: Props) {
  const searchParams = useSearchParams();
  const locale = searchParams?.get("locale") ?? "en";
  const existingTr = existingData?.translations?.[0];
  const generalFormInput = useForm<UpsertAboutSectionInfoInput>({
    resolver: zodResolver(upsertAboutSectionInfoSchema),
    mode: "onChange",
    values: {
      title: existingTr?.title || "",
      description: existingTr?.description,
      features: parseJSON<NewInfoJson>(existingTr?.features)?.data,
      subTitle: existingTr?.subTitle,
      locale: locale as CustomLocales,
    },
  });

  const { formState } = generalFormInput;
  const { isDirty } = formState;

  const { execute, isExecuting } = useAction(upsertAboutSectionInfo, {
    queryKey: about_section_list,
    onSuccess: (data) => {
      console.log(data);
      refetch();
    },
  });
  const onSubmit = async (data: UpsertAboutSectionInfoInput) => {
    await execute(data);
  };

  return (
    <section className="flex flex-col gap-4 mb-2">
      <FormWrapper
        methods={generalFormInput}
        onSubmit={onSubmit}
        schema={upsertAboutSectionInfoSchema}
        className="grid grid-cols-1 gap-3"
      >
        <div className="flex flex-col space-y-4">
          <FieldBlock>
            <FormInput label="Title" fieldName="title" />
            <FormInput label="Sub Title" fieldName="subTitle" />
            <FormRichEditor label="Description" fieldName="description" />
            <JsonSectionList
              fieldName="features"
              typeOptions={ABOUT_SECTION_TYPE_OPTIONS}
              typeConfig={ABOUT_SECTION_TYPE_CONFIG}
              maxSections={6}
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
