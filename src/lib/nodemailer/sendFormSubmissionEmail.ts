import { readFile } from "fs/promises";
import path from "path";
import ejs from "ejs";
import { FormType } from "@/generated/prisma/enums";
import { getCountryNameByIso } from "@/utils/countryOptions";
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
  phone: "Tel",
  telephone: "Tel",
  from: "Pickup location",
  to: "Delivery location",
  message: "Message",
};

const PHONE_FIELDS = new Set(["phone", "telephone"]);
const COUNTRY_FIELDS = new Set(["from", "to"]);

type SendFormSubmissionEmailParams = {
  type: FormType;
  locale?: string | null;
  payload: Record<string, unknown>;
  submissionId: string;
  ipAddress?: string | null;
};

function formatFieldValue(key: string, value: unknown): string {
  const raw = String(value).trim();
  if (!COUNTRY_FIELDS.has(key)) return raw;

  const countryName = getCountryNameByIso(raw);
  return countryName ? `${countryName} (${raw})` : raw;
}

function formatPayloadFields(payload: Record<string, unknown>) {
  return Object.entries(payload)
    .filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== "")
    .map(([key, value]) => ({
      key,
      label: FIELD_LABELS[key] ?? key,
      value: formatFieldValue(key, value),
      isPhone: PHONE_FIELDS.has(key),
      isEmail: key === "email",
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
