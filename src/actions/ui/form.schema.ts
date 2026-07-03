import z from "zod";

const localeField = z.enum(["en", "ka"]).optional();

export const callActionSchema = z.object({
  from: z.string().min(1, "Pickup location is required"),
  to: z.string().min(1, "Delivery location is required"),
  email: z.string().email("Valid email is required"),
  telephone: z.string().min(3, "Telephone is required"),
  message: z.string().optional(),
});

export const contactFormSchema = z.object({
  name: z.string().min(1, "First name is required"),
  surname: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(3, "Phone is required"),
  message: z.string().min(1, "Message is required"),
});

export const submitBookingFormSchema = callActionSchema.extend({
  turnstileToken: z.string().min(1, "Captcha verification required"),
  locale: localeField,
  formType: z.enum(["HERO_BOOKING", "SHIPMENT_MODAL"]),
});

export const submitContactFormSchema = contactFormSchema.extend({
  turnstileToken: z.string().min(1, "Captcha verification required"),
  locale: localeField,
});

export type CallActionInputType = z.infer<typeof callActionSchema>;
export type ContactFormInputType = z.infer<typeof contactFormSchema>;
export type SubmitBookingFormInput = z.infer<typeof submitBookingFormSchema>;
export type SubmitContactFormInput = z.infer<typeof submitContactFormSchema>;
