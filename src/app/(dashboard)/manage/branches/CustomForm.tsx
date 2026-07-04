"use client";
import FieldBlock from "../../_components/contentBlock";
import NavigateBtn from "../../_components/navigateBtn";
import CreateButton from "../../_components/createButton";
import { useFormContext, useWatch } from "react-hook-form";
import SubmitAdminButton from "../../_components/submitBtn";
import FormSelect from "@/globalElement/form/FormSelect";
import {
  COUNTRY_SELECT_OPTIONS,
  getCountryNameByIso,
} from "@/utils/countryOptions";
import FormInput from "@/globalElement/form/FormInput";

interface Props {
  title?: string;
  isPending: boolean;
}

export default function CustomForm({ isPending, title }: Props) {
  const form = useFormContext();
  const {
    control,
    setValue,
    formState: { isDirty },
  } = form;

  const statusValue = useWatch({
    name: "status",
    control,
  });

  const handleIsoChange = (isoCode: string) => {
    setValue("isoCode", isoCode, {
      shouldDirty: true,
      shouldValidate: true,
    });

    const countryName = getCountryNameByIso(isoCode);
    if (countryName) {
      setValue("countryName", countryName, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  return (
    <div className={"flex flex-col space-y-5"}>
      <div className={"flex flex-col space-y-5"}>
        <FieldBlock>
          <FormSelect
            fieldName="isoCode"
            label="ISO Code"
            placeholder="Select Country"
            options={COUNTRY_SELECT_OPTIONS}
            showSearch
            optionFilterProp="label"
            disabled={Boolean(title)}
            onChange={handleIsoChange}
          />
          <FormInput
            label="Country Name"
            placeholder="Country Name"
            fieldName="countryName"
          />
          <FormSelect
            label="Status"
            placeholder="Status seçin"
            value={statusValue}
            fieldName="status"
            options={[
              { value: "ACTIVE", label: "Active" },
              { value: "PLANNED", label: "Planned" },
            ]}
          />
        </FieldBlock>
      </div>

      <div className={"flex flex-col space-y-5"}>
        <div className={"grid grid-cols-2 gap-5 max-w-lg"}>
          <NavigateBtn />
          {title ? (
            <SubmitAdminButton
              title={title}
              isLoading={isPending}
              disabled={!isDirty || isPending}
            />
          ) : (
            <CreateButton
              isLoading={isPending}
              disabled={!isDirty || isPending}
            />
          )}
        </div>
      </div>
    </div>
  );
}
