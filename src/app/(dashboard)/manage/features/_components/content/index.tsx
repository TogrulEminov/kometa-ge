"use client";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomLocales, FeaturesType } from "@/services/interface/type";
import { features_list } from "@/app/(dashboard)/_type/query-key";
import { useAction } from "@/hooks/useServerActions";
import FormWrapper from "@/globalElement/form/FormWrapper";
import FieldBlock from "@/app/(dashboard)/_components/contentBlock";
import FormInput from "@/globalElement/form/FormInput";
import NavigateBtn from "@/app/(dashboard)/_components/navigateBtn";
import SubmitAdminButton from "@/app/(dashboard)/_components/submitBtn";
import { parseJSON } from "@/utils/parseJson";
import { NewInfoJson } from "@/app/(dashboard)/_type/global.type";
import { JsonSectionList } from "@/app/(dashboard)/_components/JsonSectionBlock";
import {
  UpsertFeaturesInfoInput,
  upsertFeaturesInfoSchema,
} from "@/actions/client/features/features.schema";
import { upsertFeaturesInfo } from "@/actions/client/features/features.controller";
interface Props {
  existingData: FeaturesType | undefined;
  refetch: () => void;
}

const FEATURES_TYPE_OPTIONS = [
  { value: "benefits", label: "Benefits" },
  { value: "main", label: "Main Info" },
  { value: "reliable_delivery_desc", label: "Reliable delivery" },
];

const FEATURES_TYPE_CONFIG = {
  benefits: {
    showSectionDescription: false,
    richSectionDescription: false,
    showItems: true,
    showItemDescription: true,
    showSectionTitle: false,
  },
  reliable_delivery_desc: {
    showSectionDescription: false,
    richSectionDescription: false,
    showItems: true,
    showItemDescription: true,
    showSectionTitle: false,
  },
  main: {
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
};

export default function Content({ existingData, refetch }: Props) {
  const searchParams = useSearchParams();
  const locale = searchParams?.get("locale") ?? "en";
  const existingTr = existingData?.translations?.[0];
  const generalFormInput = useForm<UpsertFeaturesInfoInput>({
    resolver: zodResolver(upsertFeaturesInfoSchema),
    mode: "onChange",
    values: {
      title: existingTr?.title || "",
      description: parseJSON<NewInfoJson>(existingTr?.description)?.data,
      subTitle: existingTr?.subTitle,
      locale: locale as CustomLocales,
    },
  });

  const { formState } = generalFormInput;
  const { isDirty } = formState;

  const { execute, isExecuting } = useAction(upsertFeaturesInfo, {
    queryKey: features_list,
    onSuccess: (data) => {
      refetch();
    },
  });
  const onSubmit = async (data: UpsertFeaturesInfoInput) => {
    await execute(data);
  };

  return (
    <section className="flex flex-col gap-4 mb-2">
      <FormWrapper
        methods={generalFormInput}
        onSubmit={onSubmit}
        schema={upsertFeaturesInfoSchema}
        className="grid grid-cols-1 gap-3"
      >
        <div className="flex flex-col space-y-4">
          <FieldBlock>
            <FormInput label="Title" fieldName="title" />
            <FormInput label="Sub Title" fieldName="subTitle" />
            <JsonSectionList
              fieldName="description"
              typeOptions={FEATURES_TYPE_OPTIONS}
              typeConfig={FEATURES_TYPE_CONFIG}
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
