"use server";

import { FormType, Locales } from "@/generated/prisma/enums";
import { headers } from "next/headers";
import { db } from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action/SafeAction";
import { verifyTurnstile } from "@/lib/turnstile/verify";
import {
  submitBookingFormSchema,
  submitContactFormSchema,
} from "./form.schema";

async function getRequestMeta() {
  const headerList = await headers();
  return {
    ipAddress: headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    userAgent: headerList.get("user-agent"),
  };
}

export const submitBookingForm = actionClient
  .inputSchema(submitBookingFormSchema)
  .action(async ({ parsedInput }) => {
    const { turnstileToken, locale, formType, ...payload } = parsedInput;
    const meta = await getRequestMeta();

    await verifyTurnstile(turnstileToken, meta.ipAddress);

    const submission = await db.formSubmission.create({
      data: {
        type: formType as FormType,
        locale: (locale as Locales) ?? null,
        payload,
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
      },
    });

    return {
      success: true,
      id: submission.id,
      message: "Form submitted successfully",
    };
  });

export const submitContactForm = actionClient
  .inputSchema(submitContactFormSchema)
  .action(async ({ parsedInput }) => {
    const { turnstileToken, locale, ...payload } = parsedInput;
    const meta = await getRequestMeta();

    await verifyTurnstile(turnstileToken, meta.ipAddress);

    const submission = await db.formSubmission.create({
      data: {
        type: FormType.CONTACT,
        locale: (locale as Locales) ?? null,
        payload,
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
      },
    });

    return {
      success: true,
      id: submission.id,
      message: "Form submitted successfully",
    };
  });
