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
import { useToggleState, useToggleStore } from "@/hooks/useToggleStore";
import {
  uiBorderlessSelectClassNames,
  uiBorderlessSelectStyles,
  uiFormColors,
  uiFormLabelClassName,
  uiSelectPopupModalClassName,
  uiSubmitButtonClassName,
} from "@/lib/ui/form";
import { shipmentModalKey } from "@/services/interface/constant-keys";
import { CustomLocales } from "@/services/interface/type";
import { COUNTRY_SELECT_OPTIONS } from "@/utils/countryOptions";
import { zodResolver } from "@hookform/resolvers/zod";
import { SendOutlined } from "@ant-design/icons";
import { message } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";

export default function ShipmentModal() {
  const t = useTranslations("atoms.components.callActionHero");
  const locale = useLocale() as CustomLocales;
  const { close } = useToggleStore();
  const isOpen = useToggleState(shipmentModalKey);
  const [mounted, setMounted] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");

  const bookingForm = useForm<CallActionInputType>({
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
        bookingForm.reset();
        setTurnstileToken("");
      },
      onError: ({ error }) => {
        message.error(error.serverError || t("form.error"));
      },
    },
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(shipmentModalKey);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close]);

  useEffect(() => {
    if (!isOpen) {
      setTurnstileToken("");
      reset();
      bookingForm.reset();
    }
  }, [isOpen, reset, bookingForm.reset]);

  useEffect(() => {
    if (!hasSucceeded || !isOpen) return;

    const timer = setTimeout(() => {
      reset();
      close(shipmentModalKey);
    }, 2500);

    return () => clearTimeout(timer);
  }, [hasSucceeded, isOpen, reset, close]);

  const handleReset = () => {
    reset();
    bookingForm.reset();
    setTurnstileToken("");
  };

  const onSubmit = async (data: CallActionInputType) => {
    if (!turnstileToken && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
      message.error(t("form.captcha_required"));
      return;
    }

    await execute({
      ...data,
      turnstileToken: turnstileToken || "dev-bypass",
      locale,
      formType: "SHIPMENT_MODAL",
    });
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="shipment-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[1300] bg-black/65 backdrop-blur-sm"
            onClick={() => close(shipmentModalKey)}
          />

          <div className="pointer-events-none fixed inset-0 z-[1301] flex items-center justify-center p-4">
            <motion.div
              key="shipment-panel"
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="pointer-events-auto relative w-full max-w-[800px] overflow-hidden rounded-2xl border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
              style={{
                backgroundColor: uiFormColors.modalBg,
                color: uiFormColors.text,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Close"
                onClick={() => close(shipmentModalKey)}
                className="absolute right-4 top-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[#94a3b8] transition-colors hover:bg-white/10 hover:text-[#f1f5f9]"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div className="shipment-form-fields p-6 sm:p-8">
                <div className="mb-5 pr-8">
                  <h2
                    className="text-3xl font-black uppercase sm:text-4xl"
                    style={{ color: uiFormColors.text }}
                  >
                    {t("title")}
                  </h2>
                  <p
                    className="mt-2 text-sm"
                    style={{ color: uiFormColors.muted }}
                  >
                    {t("description")}
                  </p>
                </div>

                <div className="mb-5 h-px w-full bg-white/10" />

                {hasSucceeded ? (
                  <FormSubmitSuccess
                    variant="modal"
                    title={t("form.success_title")}
                    description={t("form.success_description")}
                    resetLabel={t("form.success_reset")}
                    onReset={handleReset}
                  />
                ) : (
                  <FormWrapper
                    methods={bookingForm}
                    schema={callActionSchema}
                    onSubmit={onSubmit}
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6"
                  >
                    <FormSelect
                      label={t("form.pickup_location")}
                      labelClassName={uiFormLabelClassName}
                      placeholder={t("form.pickup_location")}
                      options={COUNTRY_SELECT_OPTIONS}
                      fieldName="from"
                      showSearch
                      optionFilterProp="label"
                      variant="borderless"
                      getPopupContainer={() => document.body}
                      classNames={{
                        ...uiBorderlessSelectClassNames,
                        popup: { root: uiSelectPopupModalClassName },
                      }}
                      styles={uiBorderlessSelectStyles}
                    />
                    <FormSelect
                      label={t("form.delivery_location")}
                      labelClassName={uiFormLabelClassName}
                      placeholder={t("form.delivery_location")}
                      options={COUNTRY_SELECT_OPTIONS}
                      fieldName="to"
                      showSearch
                      optionFilterProp="label"
                      variant="borderless"
                      getPopupContainer={() => document.body}
                      classNames={{
                        ...uiBorderlessSelectClassNames,
                        popup: { root: uiSelectPopupModalClassName },
                      }}
                      styles={uiBorderlessSelectStyles}
                    />
                    <FormInput
                      label={t("form.email_address")}
                      labelClassName={uiFormLabelClassName}
                      fieldName="email"
                      type="email"
                      placeholder={t("form.email_placeholder")}
                      variant="borderless"
                    />
                    <FormPhone
                      label={t("form.telephone")}
                      labelClassName={uiFormLabelClassName}
                      fieldName="telephone"
                      placeholder={t("form.telephone_placeholder")}
                      variant="borderless"
                    />
                    <FormTextarea
                      wrapperClassName="sm:col-span-2"
                      label={t("form.message")}
                      labelClassName={uiFormLabelClassName}
                      fieldName="message"
                      placeholder={t("form.message_placeholder")}
                      variant="borderless"
                      rows={3}
                    />
                    <div className="sm:col-span-2">
                      <TurnstileField
                        onVerify={setTurnstileToken}
                        onExpire={() => setTurnstileToken("")}
                        theme="dark"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <button
                        type="submit"
                        disabled={isExecuting}
                        className={`${uiSubmitButtonClassName} flex w-full items-center justify-center gap-2 text-white disabled:opacity-60`}
                      >
                        {isExecuting ? (
                          "..."
                        ) : (
                          <>
                            <SendOutlined />
                            {t("form.submit")}
                          </>
                        )}
                      </button>
                    </div>
                  </FormWrapper>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
