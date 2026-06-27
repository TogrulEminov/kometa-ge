"use client";

import { SendOutlined } from "@ant-design/icons";
import { Form, Input, Select } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useToggleState, useToggleStore } from "@/hooks/useToggleStore";
import { shipmentModalKey } from "@/services/interface/constant-keys";
import { COUNTRY_SELECT_OPTIONS } from "@/utils/countryOptions";
import {
  uiFormColors,
  uiFormLabelClassName,
  uiInputClassName,
  uiInputStyles,
  uiSelectClassNames,
  uiSelectPopupClassName,
  uiSelectStyles,
  uiSubmitButtonClassName,
  uiTextareaClassName,
  uiTextareaStyles,
} from "@/lib/ui/form";

export default function ShipmentModal() {
  const t = useTranslations("atoms.components.callActionHero");
  const { close } = useToggleStore();
  const isOpen = useToggleState(shipmentModalKey);
  const [form] = Form.useForm();
  const [submitted, setSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);

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

  const handleSubmit = async (values: unknown) => {
    console.log(values);
    setSubmitted(true);
    form.resetFields();

    setTimeout(() => {
      setSubmitted(false);
      close(shipmentModalKey);
    }, 1500);
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
                          variant="outlined"
                          classNames={{
                            ...uiSelectClassNames,
                            popup: { root: uiSelectPopupClassName },
                          }}
                          styles={uiSelectStyles}
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
                          variant="outlined"
                          classNames={{
                            ...uiSelectClassNames,
                            popup: { root: uiSelectPopupClassName },
                          }}
                          styles={uiSelectStyles}
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

                    <Form.Item className="mb-0! sm:col-span-2">
                      <button
                        type="submit"
                        className={`${uiSubmitButtonClassName} flex w-full items-center justify-center gap-2 text-white ${
                          submitted ? "bg-green-600!" : ""
                        }`}
                      >
                        {submitted ? (
                          "Submitted ✓"
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
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
