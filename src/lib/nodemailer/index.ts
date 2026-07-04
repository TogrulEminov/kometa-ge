import nodemailer, { type Transporter } from "nodemailer";

const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
const isDev = process.env.NODE_ENV === "development";

const requiredEnvVars = [
  "SMTP_HOST",
  "SMTP_USER",
  "SMTP_PASSWORD",
  "SMTP_PORT",
  "SMTP_FROM",
  "SMTP_RECEIVER",
];

const missingEnvVars = requiredEnvVars.filter(
  (varName) => !process.env[varName],
);

if (missingEnvVars.length > 0) {
  console.warn(
    "[Email] Missing environment variables:",
    missingEnvVars.join(", "),
  );
}

const transporter: Transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  logger: isDev,
  debug: isDev,
});

export default transporter;
