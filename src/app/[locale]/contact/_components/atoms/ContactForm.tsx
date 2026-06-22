"use client";
import FormInput from "@/globalElement/form/FormInput";
import FormWrapper from "@/globalElement/form/FormWrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import FormPhone from "@/globalElement/form/FormPhone";
import FormTextarea from "@/globalElement/form/FormTextarea";
import { useTranslations } from "next-intl";
const formSchema = z.object({
  name: z.string().nullish(),
  surname: z.string().nullish(),
  email: z.string().nullish(),
  phone: z.string().nullish(),
  message: z.string().optional(),
  services: z.string().nullish(),
});

type SchemaInput = z.infer<typeof formSchema>;

const contactInputClassName =
  "w-full bg-gray-50 h-12 border border-transparent outline-none shadow-none ring-0 rounded-xl px-5 py-4 text-secondary text-sm placeholder-gray-400 transition-colors hover:!border-primary focus:!border-primary focus:ring-0! focus:ring-offset-0!";

const contactTextareaClassName =
  "w-full bg-gray-50 border border-transparent outline-none shadow-none ring-0 rounded-xl px-5 py-4 text-secondary text-sm placeholder-gray-400 resize-none transition-colors hover:!border-primary focus:!border-primary focus:ring-0! focus:ring-offset-0!";

export default function ContactForm() {
  const t=useTranslations("atoms.components.contactInfo");
  const generalForm = useForm<SchemaInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      message: "",
      name: "",
      phone: "",
      services: "",
      surname: "",
    },
  });
  const onSubmit = (data: SchemaInput) => {
    console.log(data);
  };
  return (
    <FormWrapper methods={generalForm} schema={formSchema} onSubmit={onSubmit}>
      <div className="contact-form-fields grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
        <FormInput
          placeholder={t("form.first_name")}
          fieldName="name"
          className={contactInputClassName}
        />

        <FormInput
          placeholder={t("form.last_name")}
          fieldName="surname"
          className={contactInputClassName}
        />
        <FormInput
          placeholder={t("form.email")}
          fieldName="email"
          wrapperClassName="sm:col-span-2!"
          className={contactInputClassName}
        />
        <FormPhone
          fieldName="phone"
          wrapperClassName="sm:col-span-2!"
          className={contactInputClassName}
        />
        <FormTextarea
          fieldName="message"
          rows={4}
          placeholder={t("form.message")}
          wrapperClassName="sm:col-span-2!"
          className={contactTextareaClassName}
        />

        <button
          type="submit"
          className="w-full sm:col-span-2 bg-secondary hover:bg-primary text-white font-semibold py-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
        >
          {t("form.submit")}
        </button>
      </div>
    </FormWrapper>
  );
}
