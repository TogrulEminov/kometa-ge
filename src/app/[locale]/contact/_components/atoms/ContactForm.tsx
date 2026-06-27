"use client";

import { Form, Input } from "antd";
import { useTranslations } from "next-intl";
import {
  uiFormLabelClassName,
  uiInputClassName,
  uiSubmitButtonClassName,
  uiTextareaClassName,
} from "@/lib/ui/form";

export default function ContactForm() {
  const t = useTranslations("atoms.components.contactInfo");
  const [form] = Form.useForm();

  const handleSubmit = (values: unknown) => {
    console.log(values);
    form.resetFields();
  };

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical" requiredMark={false}>
      <div className="contact-form-fields grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5">
        <div>
          <label className={uiFormLabelClassName}>{t("form.first_name")}</label>
          <Form.Item name="name" className="mb-0!">
            <Input
              placeholder={t("form.first_name")}
              variant="outlined"
              classNames={{ input: uiInputClassName }}
            />
          </Form.Item>
        </div>

        <div>
          <label className={uiFormLabelClassName}>{t("form.last_name")}</label>
          <Form.Item name="surname" className="mb-0!">
            <Input
              placeholder={t("form.last_name")}
              variant="outlined"
              classNames={{ input: uiInputClassName }}
            />
          </Form.Item>
        </div>

        <div className="sm:col-span-2">
          <label className={uiFormLabelClassName}>{t("form.email")}</label>
          <Form.Item
            name="email"
            rules={[{ type: "email" }]}
            className="mb-0!"
          >
            <Input
              type="email"
              placeholder={t("form.email")}
              variant="outlined"
              classNames={{ input: uiInputClassName }}
            />
          </Form.Item>
        </div>

        <div className="sm:col-span-2">
          <label className={uiFormLabelClassName}>{t("form.phone")}</label>
          <Form.Item name="phone" className="mb-0!">
            <Input
              placeholder={t("form.phone")}
              variant="outlined"
              classNames={{ input: uiInputClassName }}
            />
          </Form.Item>
        </div>

        <div className="sm:col-span-2">
          <label className={uiFormLabelClassName}>{t("form.message")}</label>
          <Form.Item name="message" className="mb-0!">
            <Input.TextArea
              rows={4}
              placeholder={t("form.message")}
              variant="outlined"
              classNames={{ textarea: uiTextareaClassName }}
            />
          </Form.Item>
        </div>

        <Form.Item className="mb-0! sm:col-span-2">
          <button type="submit" className={`${uiSubmitButtonClassName} w-full text-white`}>
            {t("form.submit")}
          </button>
        </Form.Item>
      </div>
    </Form>
  );
}
