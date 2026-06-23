"use client";
import { useSearchParams } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CustomLocales,
  HeroInfo,
  WorkJson,
  WorkProcessItem,
} from "@/services/interface/type";
import { work_process_list } from "@/app/(dashboard)/_type/query-key";
import { useAction } from "@/hooks/useServerActions";
import FormWrapper from "@/globalElement/form/FormWrapper";
import FieldBlock from "@/app/(dashboard)/_components/contentBlock";
import FormInput from "@/globalElement/form/FormInput";
import FormTextarea from "@/globalElement/form/FormTextarea";
import NavigateBtn from "@/app/(dashboard)/_components/navigateBtn";
import SubmitAdminButton from "@/app/(dashboard)/_components/submitBtn";
import {
  UpsertProcessInfoInput,
  upsertProcessInfoSchema,
} from "@/actions/client/process/process.schema";
import { parseJSON } from "@/utils/parseJson";
import { upsertProcessInfo } from "@/actions/client/process/process.controller";
import { BiPlus } from "react-icons/bi";
import JsonSingleBlock from "@/app/(dashboard)/_components/JsonSingle";
import { JsonSectionList } from "@/app/(dashboard)/_components/JsonSectionBlock";
interface Props {
  existingData: WorkProcessItem | undefined;
  refetch: () => void;
}
export default function Content({ existingData, refetch }: Props) {
  const searchParams = useSearchParams();
  const locale = searchParams?.get("locale") ?? "en";
  const existingTr = existingData?.translations?.[0];
  const generalFormInput = useForm<UpsertProcessInfoInput>({
    resolver: zodResolver(upsertProcessInfoSchema),
    mode: "onChange",
    values: {
      title: existingTr?.title || "",
      description: parseJSON<WorkJson>(existingTr?.description)?.data,
      subTitle: existingTr?.subTitle,
      locale: locale as CustomLocales,
    },
  });

  const { formState, control } = generalFormInput;
  const { isDirty } = formState;

  const { execute, isExecuting } = useAction(upsertProcessInfo, {
    queryKey: work_process_list,
    onSuccess: (data) => {
      console.log(data);
      refetch();
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "description",
  });
  const onSubmit = async (data: UpsertProcessInfoInput) => {
    await execute(data);
  };

  return (
    <section className="flex flex-col gap-4 mb-2">
      <FormWrapper
        methods={generalFormInput}
        onSubmit={onSubmit}
        schema={upsertProcessInfoSchema}
        className="grid grid-cols-1 gap-3"
      >
        <div className="flex flex-col space-y-4">
          <FieldBlock>
            <FormInput label="Title" fieldName="title" />
            <FormInput label="Sub Title" fieldName="subTitle" />
            <JsonSingleBlock
              fieldName="description"
              addLabel="Add New Section"
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
