"use client";
import {
  CallActionInputType,
  callActionSchema,
} from "@/actions/ui/form.schema";
import FormInput from "@/globalElement/form/FormInput";
import FormPhone from "@/globalElement/form/FormPhone";
import FormSelect from "@/globalElement/form/FormSelect";
import FormTextarea from "@/globalElement/form/FormTextarea";
import FormWrapper from "@/globalElement/form/FormWrapper";
import { COUNTRY_SELECT_OPTIONS } from "@/utils/countryOptions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import type { CSSProperties } from "react";

const noFocusStyle: CSSProperties = {
  outline: "none",
  boxShadow: "none",
};

const selectStyles = {
  root: {
    backgroundColor: "transparent",
    border: "none",
    borderBottom: "1px solid white",
    borderRadius: 0,
    color: "white",
    ...noFocusStyle,
  },
  placeholder: {
    color: "rgba(255, 255, 255, 0.5)",
  },
};

const inputStyles = {
  root: {
    backgroundColor: "transparent",
    border: "none",
    borderBottom: "1px solid white",
    borderRadius: 0,
    ...noFocusStyle,
  },
  input: {
    backgroundColor: "transparent",
    border: "none",
    color: "white",
    fontSize: "14px",
    fontWeight: 400,
    padding: "0 0 10px 0",
    width: "100%",
    ...noFocusStyle,
  },
};

const inputClassNames = {
  input: "[&::placeholder]:text-white/50!",
};

const textareaStyles = {
  root: {
    backgroundColor: "transparent",
    border: "none",
    borderBottom: "1px solid white",
    borderRadius: 0,
    ...noFocusStyle,
  },
  textarea: {
    backgroundColor: "transparent",
    border: "none",
    color: "white",
    fontSize: "14px",
    fontWeight: 400,
    padding: "0 0 10px 0",
    width: "100%",
    minHeight: "100px",
    resize: "none" as const,
    ...noFocusStyle,
  },
};

const textareaClassNames = {
  textarea: "[&::placeholder]:text-white/50!",
};

export default function FormComponent() {
  const t = useTranslations("atoms.components.callActionHero");

  const generalForm = useForm<CallActionInputType>({
    resolver: zodResolver(callActionSchema),
    defaultValues: {
      from: "",
      to: "",
      email: "",
      telephone: "",
      message: "",
    },
  });

  const onSubmit = (data: CallActionInputType) => {
    console.log(data);
  };
  return (
    <div className="bg-[#B11226] rounded-2xl  min-h-100 p-7 lg:-mt-68 text-white">
      <strong className="text-2xl block font-bold uppercase mb-1">
        {t("title")}
      </strong>
      <p className="text-white/70 text-sm mb-4">{t("description")}</p>
      <hr className="border-white/20 mb-5" />
      <FormWrapper
        methods={generalForm}
        schema={callActionSchema}
        onSubmit={onSubmit}
        className="grid grid-cols-2 gap-x-6 gap-y-4"
      >
        <FormSelect
          label={t("form.pickup_location")}
          options={COUNTRY_SELECT_OPTIONS}
          fieldName="from"
          showSearch
          optionFilterProp="label"
          variant="borderless"
          styles={selectStyles}
        />
        <FormSelect
          label={t("form.delivery_location")}
          options={COUNTRY_SELECT_OPTIONS}
          fieldName="to"
          showSearch
          optionFilterProp="label"
          variant="borderless"
          styles={selectStyles}
        />
        <FormInput
          label={t("form.email_address")}
          fieldName="email"
          type="email"
          placeholder="Example: User@Website.Com"
          variant="borderless"
          styles={inputStyles}
          classNames={inputClassNames}
        />
        <FormPhone
          label={t("form.telephone")}
          fieldName="telephone"
          placeholder="+(602) 448 763 22"
          variant="borderless"
          styles={inputStyles}
          classNames={inputClassNames}
        />
        <FormTextarea
          wrapperClassName="lg:col-span-2!"
          label={t("form.message")}
          fieldName="message"
          placeholder="Additional details..."
          variant="borderless"
          styles={textareaStyles}
          classNames={textareaClassNames}
        />
        <div className="flex items-end col-span-2">
          <button
            type="submit"
            className="w-full cursor-pointer bg-white text-[#B11226] hover:bg-gray-100 font-semibold uppercase tracking-wider text-sm py-3 rounded-lg transition-colors duration-200"
          >
            {t("form.submit")}
          </button>
        </div>
      </FormWrapper>
    </div>
  );
}
