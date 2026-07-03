"use client";

import { SendOutlined } from "@ant-design/icons";
import { Form, Input, message, Select } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAction } from "next-safe-action/hooks";
import { submitBookingForm } from "@/actions/ui/form.controller";
import FormSubmitSuccess from "@/components/form/FormSubmitSuccess";
import TurnstileField from "@/components/TurnstileField";
import { useToggleState, useToggleStore } from "@/hooks/useToggleStore";
import { shipmentModalKey } from "@/services/interface/constant-keys";
import { CustomLocales } from "@/services/interface/type";
import { COUNTRY_SELECT_OPTIONS } from "@/utils/countryOptions";
import {
  uiFormColors,
  uiFormLabelClassName,
  uiBorderlessSelectClassNames,
  uiBorderlessSelectStyles,
  uiInputClassName,
  uiInputStyles,
  uiSelectPopupClassName,
  uiSubmitButtonClassName,
  uiTextareaClassName,
  uiTextareaStyles,
} from "@/lib/ui/form";

export default function ShipmentModal() {
  const t = useTranslations("atoms.components.callActionHero");
  const locale = useLocale() as CustomLocales;
  const { close } = useToggleStore();
  const isOpen = useToggleState(shipmentModalKey);
  const [form] = Form.useForm();
  const [mounted, setMounted] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");

  const { execute, isExecuting, hasSucceeded, reset } = useAction(
    submitBookingForm,
    {
      onSuccess: () => {
        form.resetFields();
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
    }
  }, [isOpen, reset]);

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
    form.resetFields();
    setTurnstileToken("");
  };

  const handleSubmit = async (values: {
    from: string;
    to: string;
    email: string;
    telephone: string;
    message?: string;
  }) => {
    if (!turnstileToken && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
      message.error("Please complete the captcha");
      return;
    }

    await execute({
      ...values,
      message: values.message ?? "",
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
                  <p className="mt-2 text-sm" style={{ color: uiFormColors.muted }}>
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
                <Form
                  form={form}
                  onFinish={handleSubmit}
                  layout="vertical"
                  requiredMark={false}
                >
                  <div className="grid gap-4 sm:grid-cols-2 lg:gap-6">
                    <div>
                      <label className={uiFormLabelClassName}>
                        {t("form.pickup_location")} *
                      </label>
                      <Form.Item
                        name="from"
                        rules={[
                          { required: true, message: t("form.pickup_location") },
                        ]}
                        className="mb-0!"
                      >
                        <Select
                          showSearch
                          optionFilterProp="label"
                          placeholder={t("form.pickup_location")}
                          options={COUNTRY_SELECT_OPTIONS}
                          variant="borderless"
                          classNames={{
                            ...uiBorderlessSelectClassNames,
                            popup: { root: uiSelectPopupClassName },
                          }}
                          styles={uiBorderlessSelectStyles}
                        />
                      </Form.Item>
                    </div>

                    <div>
                      <label className={uiFormLabelClassName}>
                        {t("form.delivery_location")} *
                      </label>
                      <Form.Item
                        name="to"
                        rules={[
                          { required: true, message: t("form.delivery_location") },
                        ]}
                        className="mb-0!"
                      >
                        <Select
                          showSearch
                          optionFilterProp="label"
                          placeholder={t("form.delivery_location")}
                          options={COUNTRY_SELECT_OPTIONS}
                          variant="borderless"
                          classNames={{
                            ...uiBorderlessSelectClassNames,
                            popup: { root: uiSelectPopupClassName },
                          }}
                          styles={uiBorderlessSelectStyles}
                        />
                      </Form.Item>
                    </div>

                    <div>
                      <label className={uiFormLabelClassName}>
                        {t("form.email_address")} *
                      </label>
                      <Form.Item
                        name="email"
                        rules={[
                          { required: true, message: t("form.email_address") },
                          { type: "email", message: t("form.email_address") },
                        ]}
                        className="mb-0!"
                      >
                        <Input
                          type="email"
                          placeholder="Example: User@Website.Com"
                          variant="outlined"
                          classNames={{ root: uiInputClassName, input: uiInputClassName }}
                          styles={uiInputStyles}
                        />
                      </Form.Item>
                    </div>

                    <div>
                      <label className={uiFormLabelClassName}>
                        {t("form.telephone")} *
                      </label>
                      <Form.Item
                        name="telephone"
                        rules={[
                          { required: true, message: t("form.telephone") },
                        ]}
                        className="mb-0!"
                      >
                        <Input
                          placeholder="+(602) 448 763 22"
                          variant="outlined"
                          classNames={{ root: uiInputClassName, input: uiInputClassName }}
                          styles={uiInputStyles}
                        />
                      </Form.Item>
                    </div>

                    <div className="sm:col-span-2">
                      <label className={uiFormLabelClassName}>
                        {t("form.message")}
                      </label>
                      <Form.Item name="message" className="mb-0!">
                        <Input.TextArea
                          rows={3}
                          placeholder="Additional details..."
                          variant="outlined"
                          classNames={{ textarea: uiTextareaClassName }}
                          styles={uiTextareaStyles}
                        />
                      </Form.Item>
                    </div>

                    <div className="sm:col-span-2">
                      <TurnstileField
                        onVerify={setTurnstileToken}
                        onExpire={() => setTurnstileToken("")}
                        theme="dark"
                      />
                    </div>

                    <Form.Item className="mb-0! sm:col-span-2">
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
                    </Form.Item>
                  </div>
                </Form>
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
