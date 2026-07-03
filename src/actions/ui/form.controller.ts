"use server";

import { Prisma } from "@/generated/prisma/client";
import { FormType, Locales } from "@/generated/prisma/enums";
import { headers } from "next/headers";
import { actionClient } from "@/lib/safe-action/SafeAction";
import { sendFormSubmissionEmail } from "@/lib/nodemailer/sendFormSubmissionEmail";
import { db } from "@/lib/prisma";
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

async function saveAndNotify({
  type,
  locale,
  payload,
  ipAddress,
  userAgent,
}: {
  type: FormType;
  locale?: Locales | null;
  payload: Record<string, unknown>;
  ipAddress: string | null;
  userAgent: string | null;
}) {
  const submission = await db.formSubmission.create({
    data: {
      type,
      locale: locale ?? null,
      payload: payload as Prisma.InputJsonValue,
      ipAddress,
      userAgent,
    },
  });

  try {
    await sendFormSubmissionEmail({
      type,
      locale,
      payload,
      submissionId: submission.id,
      ipAddress,
    });
  } catch (error) {
    console.error("[Email] Failed to send form submission:", error);
  }

  return submission;
}

export const submitBookingForm = actionClient
  .inputSchema(submitBookingFormSchema)
  .action(async ({ parsedInput }) => {
    const { turnstileToken, locale, formType, ...payload } = parsedInput;
    const meta = await getRequestMeta();

    await verifyTurnstile(turnstileToken, meta.ipAddress);

    const submission = await saveAndNotify({
      type: formType as FormType,
      locale: (locale as Locales) ?? null,
      payload,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
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

    const submission = await saveAndNotify({
      type: FormType.CONTACT,
      locale: (locale as Locales) ?? null,
      payload,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });

    return {
      success: true,
      id: submission.id,
      message: "Form submitted successfully",
    };
  });
