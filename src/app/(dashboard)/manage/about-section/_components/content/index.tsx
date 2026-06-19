"use client";
import { useSearchParams } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AboutHomeType, CustomLocales } from "@/services/interface/type";
import { useAction } from "next-safe-action/hooks";
import FormWrapper from "@/globalElement/form/FormWrapper";
import FieldBlock from "@/app/(dashboard)/_components/contentBlock";
import FormInput from "@/globalElement/form/FormInput";
import NavigateBtn from "@/app/(dashboard)/_components/navigateBtn";
import SubmitAdminButton from "@/app/(dashboard)/_components/submitBtn";
import { parseJSON } from "@/utils/parseJson";
import { BiHash, BiPlus } from "react-icons/bi";
import {
  UpsertAboutSectionInfoInput,
  upsertAboutSectionInfoSchema,
} from "@/actions/client/aboutSection/aboutSection.schema";
import { NewInfoJson } from "@/app/(dashboard)/_type/global.type";
import { upsertAboutSectionInfo } from "@/actions/client/aboutSection/aboutSection.controller";
import JsonSectionBlock from "@/app/(dashboard)/_components/JsonSectionBlock";
import FormRichEditor from "@/globalElement/form/FormRichEditor";
interface Props {
  existingData: AboutHomeType | undefined;
  refetch: () => void;
}
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

  const { formState, control } = generalFormInput;
  const { isDirty } = formState;

  const { execute, isExecuting } = useAction(upsertAboutSectionInfo, {
    onSuccess: (data) => {
      console.log(data);
      refetch();
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "features",
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
            {fields.map((field, index) => (
              <JsonSectionBlock
                key={field.id}
                fieldName="features"
                sectionIndex={index}
                onRemove={() => remove(index)}
                typeOptions={[
                  {
                    value: "advantages",
                    label: "Advantages",
                  },
                  {
                    value: "statistics",
                    label: "Statistics",
                  },
                ]}
                typeConfig={{
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
                    showSectionTitle:false,
                    extraItemFields: [
                      {
                        fieldKey: "itemValue",
                        label: "Value",
                        placeholder: "e.g. 500+",
                        type: "input",
                        icon: <BiHash className="w-3 h-3" />,
                      },
                      {
                        fieldKey: "itemSuffix",
                        label: "Suffix",
                        placeholder: "e.g. + , K+",
                        type: "input",
                      },
                    ],
                  },
                }}
              />
            ))}

            {fields.length < 6 && (
              <button
                type="button"
                onClick={() =>
                  append({ title: "", description: "", items: [], type: "" })
                }
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-500 text-white cursor-pointer hover:bg-blue-600 transition-all text-sm font-semibold"
              >
                <BiPlus className="w-4 h-4" />
                Add New Section
              </button>
            )}
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
