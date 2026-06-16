"use client";
import FormInput from "@/globalElement/form/FormInput";
import FormWrapper from "@/globalElement/form/FormWrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import FormPhone from "@/globalElement/form/FormPhone";
import FormTextarea from "@/globalElement/form/FormTextarea";
const formSchema = z.object({
  name: z.string().nullish(),
  surname: z.string().nullish(),
  email: z.string().nullish(),
  phone: z.string().nullish(),
  message: z.string().optional(),
  services: z.string().nullish(),
});

type SchemaInput = z.infer<typeof formSchema>;
export default function ContactForm() {
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
        <FormInput
          placeholder="First name"
          fieldName="name"
          classNames={{
            input:
              "w-full bg-gray-50 h-12 border-0 outline-none shadow-none ring-0 rounded-xl px-5 py-4 text-secondary text-sm placeholder-gray-400",
          }}
        />

        <FormInput
          placeholder="Last name"
          fieldName="surname"
          classNames={{
            input:
              "w-full bg-gray-50 h-12 border-0 outline-none shadow-none ring-0 rounded-xl px-5 py-4 text-secondary text-sm placeholder-gray-400",
          }}
        />
        <FormInput
          placeholder="Email Address"
          fieldName="email"
          wrapperClassName="sm:col-span-2!"
          classNames={{
            input:
              "w-full bg-gray-50 h-12 border-0 outline-none shadow-none ring-0 rounded-xl px-5 py-4 text-secondary text-sm placeholder-gray-400",
          }}
        />
        <FormPhone
          fieldName="phone"
          wrapperClassName="sm:col-span-2!"
          classNames={{
            input:
              "w-full bg-gray-50 h-12 border-0 outline-none shadow-none ring-0 rounded-xl px-5 py-4 text-secondary text-sm placeholder-gray-400",
          }}
        />
        <FormTextarea
          fieldName="message"
          rows={4}
          placeholder="Your Message..."
          wrapperClassName="sm:col-span-2!"
          classNames={{
            textarea:
              "w-full bg-gray-50 border-0 outline-none shadow-none ring-0 rounded-xl px-5 py-4 text-secondary text-sm placeholder-gray-400 resize-none",
          }}
        />

        <button
          type="submit"
          className="w-full sm:col-span-2 bg-secondary hover:bg-primary text-white font-semibold py-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
        >
          Send Message
        </button>
      </div>
    </FormWrapper>
  );
}
