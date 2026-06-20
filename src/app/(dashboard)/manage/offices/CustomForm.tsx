"use client";
import FieldBlock from "../../_components/contentBlock";
import NavigateBtn from "../../_components/navigateBtn";
import { useFormContext } from "react-hook-form";
import SubmitAdminButton from "../../_components/submitBtn";
import FormSelect from "@/globalElement/form/FormSelect";
import FormInput from "@/globalElement/form/FormInput";
import { useDropdownOptions } from "@/hooks/useDropdownOptions";
import { useServerQuery } from "@/hooks/useServerActions";
import { branches_list } from "../../_type/query-key";
import { getBranches } from "@/actions/client/branches/branches.controller";
import { CustomLocales } from "@/services/interface/type";
interface Props {
  title?: string;
  isPending: boolean;
  locale: CustomLocales;
}

export default function CustomForm({ isPending, title, locale }: Props) {
  const form = useFormContext();
  const {
    formState: { isDirty },
  } = form;
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
        label: tr.countryName
      })),
    ) || [],
    "value",
    "label",
  );

  console.log(form.formState.errors);
  return (
    <div className={"flex flex-col space-y-5"}>
      <div className={"flex flex-col space-y-5"}>
        <FieldBlock>
          <FormInput
            label="Address"
            placeholder="Address"
            fieldName="address"
          />
          <FormInput label="City" placeholder="City" fieldName="city" />
          <FormSelect
            fieldName="branchId"
            label="Country"
            placeholder="Select Country"
            options={enumOptions}
            loading={isLoading}
          />
          <FormSelect
            label="Type"
            placeholder="Select Type"
            fieldName="type"
            options={[
              { value: "office", label: "Office" },
              { value: "warehouse", label: "Warehouse" },
            ]}
          />
        </FieldBlock>
      </div>

      <div className={"flex flex-col space-y-5"}>
        <div className={"grid grid-cols-2 gap-5 max-w-lg"}>
          <NavigateBtn />
          <SubmitAdminButton
            title={title}
            isLoading={isPending}
            disabled={!isDirty || isPending}
          />
        </div>
      </div>
    </div>
  );
}
