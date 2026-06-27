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
import { uiHeroFormLabelClassName } from "@/lib/ui/form";
import { COUNTRY_SELECT_OPTIONS } from "@/utils/countryOptions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

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
    <div className="hero-booking-form min-h-100 rounded-2xl bg-[#B11226] p-7 text-white lg:-mt-68">
      <strong className="mb-1 block text-2xl font-bold uppercase">
        {t("title")}
      </strong>
      <p className="mb-4 text-sm text-white/70">{t("description")}</p>
      <hr className="mb-5 border-white/20" />
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
        <div className="col-span-2 flex items-end">
          <button
            type="submit"
            className="w-full cursor-pointer rounded-lg bg-white py-3 text-sm font-semibold uppercase tracking-wider text-[#B11226] transition-colors duration-200 hover:bg-white/90"
          >
            {t("form.submit")}
          </button>
        </div>
      </FormWrapper>
    </div>
  );
}
