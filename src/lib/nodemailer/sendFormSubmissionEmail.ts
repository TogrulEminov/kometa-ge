import { readFile } from "fs/promises";
import path from "path";
import ejs from "ejs";
import { FormType } from "@/generated/prisma/enums";
import transporter from "./index";

const TYPE_LABELS: Record<FormType, string> = {
  CONTACT: "Contact Form",
  HERO_BOOKING: "Hero Booking",
  SHIPMENT_MODAL: "Shipment Modal",
};

const FIELD_LABELS: Record<string, string> = {
  name: "First name",
  surname: "Last name",
  email: "Email",
  phone: "Phone",
  telephone: "Telephone",
  from: "Pickup location",
  to: "Delivery location",
  message: "Message",
};

type SendFormSubmissionEmailParams = {
  type: FormType;
  locale?: string | null;
  payload: Record<string, unknown>;
  submissionId: string;
  ipAddress?: string | null;
};

function formatPayloadFields(payload: Record<string, unknown>) {
  return Object.entries(payload)
    .filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== "")
    .map(([key, value]) => ({
      label: FIELD_LABELS[key] ?? key,
      value: String(value),
    }));
}

export async function sendFormSubmissionEmail({
  type,
  locale,
  payload,
  submissionId,
  ipAddress,
}: SendFormSubmissionEmailParams) {
  const receiver = process.env.SMTP_RECEIVER;
  const from = process.env.SMTP_FROM;

  if (!receiver || !from) {
    console.warn("[Email] SMTP_RECEIVER or SMTP_FROM missing — skipping email");
    return;
  }

  const fields = formatPayloadFields(payload);
  const typeLabel = TYPE_LABELS[type];
  const contact =
    (payload.email as string | undefined) ||
    (payload.name as string | undefined) ||
    (payload.telephone as string | undefined) ||
    (payload.phone as string | undefined) ||
    "New submission";

  const subject = `[Kometa GE] ${typeLabel} — ${contact}`;
  const templatePath = path.join(
    process.cwd(),
    "src/lib/nodemailer/templates/form-submission.ejs",
  );
  const template = await readFile(templatePath, "utf-8");
  const html = ejs.render(template, {
    subject,
    typeLabel,
    fields,
    submissionId,
    locale,
    ipAddress,
    createdAt: new Date().toLocaleString("en-GB", { hour12: false }),
  });

  await transporter.sendMail({
    from,
    to: receiver,
    subject,
    html,
    replyTo: typeof payload.email === "string" ? payload.email : undefined,
  });
}
