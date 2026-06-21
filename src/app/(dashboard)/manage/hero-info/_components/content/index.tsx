"use client";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomLocales, HeroInfo } from "@/services/interface/type";
import {
  UpsertHeroInfoInput,
  upsertHeroInfoSchema,
} from "@/actions/client/hero/hero.schema";
import { useAction } from "next-safe-action/hooks";
import { upsertHeroInfo } from "@/actions/client/hero/hero.controller";
import FormWrapper from "@/globalElement/form/FormWrapper";
import FieldBlock from "@/app/(dashboard)/_components/contentBlock";
import FormInput from "@/globalElement/form/FormInput";
import FormTextarea from "@/globalElement/form/FormTextarea";
import NavigateBtn from "@/app/(dashboard)/_components/navigateBtn";
import SubmitAdminButton from "@/app/(dashboard)/_components/submitBtn";
import { useServerQuery } from "@/hooks/useServerActions";
import { services_main_list } from "@/app/(dashboard)/_type/query-key";
import { getServices } from "@/actions/client/services/services.controller";
import { useDropdownOptions } from "@/hooks/useDropdownOptions";
import FormSelect from "@/globalElement/form/FormSelect";
interface Props {
  existingData: HeroInfo | undefined;
  refetch: () => void;
}
export default function Content({ existingData, refetch }: Props) {
  const searchParams = useSearchParams();
  const locale = searchParams?.get("locale") ?? "en";
  const existingTr = existingData?.translations?.[0];
  const generalFormInput = useForm<UpsertHeroInfoInput>({
    resolver: zodResolver(upsertHeroInfoSchema),
    mode: "onChange",
    values: {
      title: existingTr?.title || "",
      description: existingTr?.description,
      subTitle: existingTr?.subTitle,
      locale: locale as CustomLocales,
      serviceId:
        existingData?.serviceId ?? existingData?.service?.id ?? null,
    },
  });

  const { formState } = generalFormInput;
  const { isDirty } = formState;

  const { execute, isExecuting } = useAction(upsertHeroInfo, {
    onSuccess: (data) => {
      console.log(data);
      refetch();
    },
  });
  const onSubmit = async (data: UpsertHeroInfoInput) => {
    await execute(data);
  };
  const { data: servicesData, isLoading: servicesLoading } = useServerQuery(
    services_main_list,
    getServices,
    {
      params: {
        page: 1,
        pageSize: 100,
        locale: locale as CustomLocales,
      },
    },
  );
  const enumServicesOptions = useDropdownOptions(
    servicesData?.data?.map((item) => ({
      value: item.id,
      label: item.translations[0]?.title ?? "Untitled",
    })) ?? [],
    "value",
    "label",
  );
  return (
    <section className="flex flex-col gap-4 mb-2">
      <FormWrapper
        methods={generalFormInput}
        onSubmit={onSubmit}
        schema={upsertHeroInfoSchema}
        className="grid grid-cols-1 gap-3"
      >
        <div className="flex flex-col space-y-4">
          <FieldBlock>
            <FormInput label="Başlıq" placeholder="Başlıq" fieldName="title" />
            <FormInput fieldName="subTitle" label="Sub Title" />
            <FormSelect
              fieldName="serviceId"
              label="Service"
              placeholder="Select Service"
              options={enumServicesOptions}
              loading={servicesLoading}
              allowClear
            />
            <FormTextarea fieldName="description" label="Short description" />
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
