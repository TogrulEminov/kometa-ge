"use client";
import { Modal } from "antd";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import {
  CallActionInputType,
  callActionSchema,
} from "@/actions/ui/form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import FormWrapper from "@/globalElement/form/FormWrapper";
import type { CSSProperties } from "react";
import FormSelect from "@/globalElement/form/FormSelect";
import { COUNTRY_SELECT_OPTIONS } from "@/utils/countryOptions";
import FormInput from "@/globalElement/form/FormInput";
import FormPhone from "@/globalElement/form/FormPhone";
import FormTextarea from "@/globalElement/form/FormTextarea";
import { useToggleState, useToggleStore } from "@/hooks/useToggleStore";
import { shipmentModalKey } from "@/services/interface/constant-keys";

const noFocusStyle: CSSProperties = {
  outline: "none",
  boxShadow: "none",
};

const fieldBaseStyle: CSSProperties = {
  backgroundColor: "#f3f4f6",
  border: "none",
  borderRadius: "12px",
  ...noFocusStyle,
};

const selectStyles = {
  root: {
    ...fieldBaseStyle,
    height: "48px",
    color: "#1c1e29",
  },
  placeholder: {
    color: "#9ca3af",
  },
};

const inputStyles = {
  root: {
    ...fieldBaseStyle,
  },
  input: {
    ...fieldBaseStyle,
    color: "#1c1e29",
    fontSize: "14px",
    fontWeight: 400,
    padding: "12px 16px",
    height: "48px",
    width: "100%",
  },
};

const inputClassNames = {
  input: "[&::placeholder]:text-gray-400!",
};

const textareaStyles = {
  root: {
    ...fieldBaseStyle,
  },
  textarea: {
    ...fieldBaseStyle,
    color: "#1c1e29",
    fontSize: "14px",
    fontWeight: 400,
    padding: "12px 16px",
    width: "100%",
    minHeight: "100px",
    resize: "none" as const,
  },
};

const textareaClassNames = {
  textarea: "[&::placeholder]:text-gray-400!",
};

export default function ShipmentModal() {
  const t = useTranslations("atoms.components.callActionHero");

  const { close } = useToggleStore();
  const isOpen = useToggleState(shipmentModalKey);
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

  const onSubmit = async (data: CallActionInputType) => {
    console.log(data);
  };

  return (
    <Modal
      open={isOpen}
      onCancel={() => close(shipmentModalKey)}
      footer={null}
      centered
      width={800}
      destroyOnHidden
      zIndex={1300}
      style={{ top: 0 }}
      styles={{
        mask: {
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 1300,
        },
        wrapper: {
          zIndex: 1300,
        },
      }}
    >
      <div className="mb-5">
        <strong className="text-3xl sm:text-4xl font-black uppercase text-[#1c1e29]">
          {t("title")}
        </strong>
        <p className="mt-2 text-sm text-gray-500">{t("description")}</p>
      </div>

      <div className="h-px w-full bg-gray-200 mb-5" />

      <FormWrapper
        methods={generalForm}
        schema={callActionSchema}
        onSubmit={onSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-x-6 gap-y-4"
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
          wrapperClassName="md:col-span-2!"
          label={t("form.message")}
          fieldName="message"
          placeholder="Additional details..."
          variant="borderless"
          styles={textareaStyles}
          classNames={textareaClassNames}
        />
        <div className="flex items-end md:col-span-2">
          <button
            type="submit"
            className="w-full cursor-pointer bg-[#B11226] hover:bg-[#8f0e1e] text-white font-semibold uppercase tracking-wider text-sm py-3 rounded-xl transition-colors duration-200"
          >
            {t("form.submit")}
          </button>
        </div>
      </FormWrapper>
    </Modal>
  );
}
