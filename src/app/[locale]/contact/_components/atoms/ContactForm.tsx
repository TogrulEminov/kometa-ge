"use client";

import { Form, Input, message } from "antd";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { submitContactForm } from "@/actions/ui/form.controller";
import { contactFormSchema } from "@/actions/ui/form.schema";
import FormSubmitSuccess from "@/components/form/FormSubmitSuccess";
import TurnstileField from "@/components/TurnstileField";
import {
  uiFormLabelClassName,
  uiInputClassName,
  uiSubmitButtonClassName,
  uiTextareaClassName,
} from "@/lib/ui/form";
import { CustomLocales } from "@/services/interface/type";

export default function ContactForm() {
  const t = useTranslations("atoms.components.contactInfo");
  const locale = useLocale() as CustomLocales;
  const [form] = Form.useForm();
  const [turnstileToken, setTurnstileToken] = useState("");

  const { execute, isExecuting, hasSucceeded, reset } = useAction(
    submitContactForm,
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

  const handleReset = () => {
    reset();
    form.resetFields();
    setTurnstileToken("");
  };

  const handleSubmit = async (values: unknown) => {
    const parsed = contactFormSchema.safeParse(values);
    if (!parsed.success) {
      message.error("Please fill all required fields");
      return;
    }

    if (!turnstileToken && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
      message.error("Please complete the captcha");
      return;
    }

    await execute({
      ...parsed.data,
      turnstileToken: turnstileToken || "dev-bypass",
      locale,
    });
  };

  if (hasSucceeded) {
    return (
      <FormSubmitSuccess
        variant="default"
        title={t("form.success_title")}
        description={t("form.success_description")}
        resetLabel={t("form.success_reset")}
        onReset={handleReset}
      />
    );
  }

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical" requiredMark={false}>
      <div className="contact-form-fields grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5">
        <div>
          <label className={uiFormLabelClassName}>{t("form.first_name")} *</label>
          <Form.Item
            name="name"
            rules={[{ required: true, message: t("form.first_name") }]}
            className="mb-0!"
          >
            <Input
              placeholder={t("form.first_name")}
              variant="outlined"
              classNames={{ input: uiInputClassName }}
            />
          </Form.Item>
        </div>

        <div>
          <label className={uiFormLabelClassName}>{t("form.last_name")} *</label>
          <Form.Item
            name="surname"
            rules={[{ required: true, message: t("form.last_name") }]}
            className="mb-0!"
          >
            <Input
              placeholder={t("form.last_name")}
              variant="outlined"
              classNames={{ input: uiInputClassName }}
            />
          </Form.Item>
        </div>

        <div className="sm:col-span-2">
          <label className={uiFormLabelClassName}>{t("form.email")} *</label>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: t("form.email") },
              { type: "email", message: t("form.email") },
            ]}
            className="mb-0!"
          >
            <Input
              type="email"
              placeholder={t("form.email_placeholder")}
              variant="outlined"
              classNames={{ input: uiInputClassName }}
            />
          </Form.Item>
        </div>

        <div className="sm:col-span-2">
          <label className={uiFormLabelClassName}>{t("form.phone")} *</label>
          <Form.Item
            name="phone"
            rules={[{ required: true, message: t("form.phone") }]}
            className="mb-0!"
          >
            <Input
              placeholder={t("form.phone")}
              variant="outlined"
              classNames={{ input: uiInputClassName }}
            />
          </Form.Item>
        </div>

        <div className="sm:col-span-2">
          <label className={uiFormLabelClassName}>{t("form.message")} *</label>
          <Form.Item
            name="message"
            rules={[{ required: true, message: t("form.message") }]}
            className="mb-0!"
          >
            <Input.TextArea
              rows={4}
              placeholder={t("form.message_placeholder")}
              variant="outlined"
              classNames={{ textarea: uiTextareaClassName }}
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
            className={`${uiSubmitButtonClassName} w-full text-white disabled:opacity-60`}
          >
            {isExecuting ? "..." : t("form.submit")}
          </button>
        </Form.Item>
      </div>
    </Form>
  );
}
