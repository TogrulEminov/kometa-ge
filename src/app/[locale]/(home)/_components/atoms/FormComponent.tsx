"use client";

import {
  CallActionInputType,
  callActionSchema,
} from "@/actions/ui/form.schema";
import { submitBookingForm } from "@/actions/ui/form.controller";
import FormSubmitSuccess from "@/components/form/FormSubmitSuccess";
import TurnstileField from "@/components/TurnstileField";
import FormInput from "@/globalElement/form/FormInput";
import FormPhone from "@/globalElement/form/FormPhone";
import FormSelect from "@/globalElement/form/FormSelect";
import FormTextarea from "@/globalElement/form/FormTextarea";
import FormWrapper from "@/globalElement/form/FormWrapper";
import { uiHeroFormLabelClassName } from "@/lib/ui/form";
import { CustomLocales } from "@/services/interface/type";
import { COUNTRY_SELECT_OPTIONS } from "@/utils/countryOptions";
import { zodResolver } from "@hookform/resolvers/zod";
import { message } from "antd";
import { useLocale, useTranslations } from "next-intl";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function FormComponent() {
  const t = useTranslations("atoms.components.callActionHero");
  const locale = useLocale() as CustomLocales;
  const [turnstileToken, setTurnstileToken] = useState("");

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

  const { execute, isExecuting, hasSucceeded, reset } = useAction(
    submitBookingForm,
    {
      onSuccess: () => {
        generalForm.reset();
        setTurnstileToken("");
      },
      onError: ({ error }) => {
        message.error(error.serverError || t("form.error"));
      },
    },
  );

  const handleReset = () => {
    reset();
    generalForm.reset();
    setTurnstileToken("");
  };

  const onSubmit = async (data: CallActionInputType) => {
    if (!turnstileToken && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
      message.error("Please complete the captcha");
      return;
    }

    await execute({
      ...data,
      turnstileToken: turnstileToken || "dev-bypass",
      locale,
      formType: "HERO_BOOKING",
    });
  };

  return (
    <div className="hero-booking-form min-h-100 rounded-2xl bg-[#B11226] p-7 text-white lg:-mt-68">
      <strong className="mb-1 block text-2xl font-bold uppercase">
        {t("title")}
      </strong>
      <p className="mb-4 text-sm text-white/70">{t("description")}</p>
      <hr className="mb-5 border-white/20" />

      {hasSucceeded ? (
        <FormSubmitSuccess
          variant="hero"
          title={t("form.success_title")}
          description={t("form.success_description")}
          resetLabel={t("form.success_reset")}
          onReset={handleReset}
        />
      ) : (
        <FormWrapper
          methods={generalForm}
          schema={callActionSchema}
          onSubmit={onSubmit}
          className="grid grid-cols-2 gap-x-6 gap-y-4"
        >
          <FormSelect
            label={t("form.pickup_location")}
            labelClassName={uiHeroFormLabelClassName}
            options={COUNTRY_SELECT_OPTIONS}
            fieldName="from"
            showSearch
            optionFilterProp="label"
            variant="borderless"
          />
          <FormSelect
            label={t("form.delivery_location")}
            labelClassName={uiHeroFormLabelClassName}
            options={COUNTRY_SELECT_OPTIONS}
            fieldName="to"
            showSearch
            optionFilterProp="label"
            variant="borderless"
          />
          <FormInput
            label={t("form.email_address")}
            labelClassName={uiHeroFormLabelClassName}
            fieldName="email"
            type="email"
            placeholder="Example: User@Website.Com"
            variant="borderless"
          />
          <FormPhone
            label={t("form.telephone")}
            labelClassName={uiHeroFormLabelClassName}
            fieldName="telephone"
            placeholder="+(602) 448 763 22"
            variant="borderless"
          />
          <FormTextarea
            wrapperClassName="lg:col-span-2!"
            label={t("form.message")}
            labelClassName={uiHeroFormLabelClassName}
            fieldName="message"
            placeholder="Additional details..."
            variant="borderless"
          />
          <div className="col-span-2">
            <TurnstileField
              onVerify={setTurnstileToken}
              onExpire={() => setTurnstileToken("")}
              theme="dark"
            />
          </div>
          <div className="col-span-2 flex items-end">
            <button
              type="submit"
              disabled={isExecuting}
              className="w-full cursor-pointer rounded-lg bg-white py-3 text-sm font-semibold uppercase tracking-wider text-[#B11226] transition-colors duration-200 hover:bg-white/90 disabled:opacity-60"
            >
              {isExecuting ? "..." : t("form.submit")}
            </button>
          </div>
        </FormWrapper>
      )}
    </div>
  );
}
