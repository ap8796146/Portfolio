import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import type { Message } from "./db";

let transporter: Transporter | null = null;

export function mailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function getTransporter(): Transporter {
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT || 465);
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return transporter;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Notify the site owner about a new message. Reply-To is the visitor. */
export async function sendNotification(msg: Message) {
  const to = process.env.CONTACT_TO_EMAIL || process.env.SMTP_USER!;
  const from = process.env.SMTP_FROM || `Portfolio <${process.env.SMTP_USER}>`;
  const subject = msg.subject ? `Portfolio: ${msg.subject}` : `Portfolio: new message from ${msg.name}`;

  await getTransporter().sendMail({
    to,
    from,
    replyTo: { name: msg.name, address: msg.email },
    subject,
    text: `From: ${msg.name} <${msg.email}>\nSubject: ${msg.subject || "(none)"}\n\n${msg.message}`,
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:560px">
        <h2 style="margin:0 0 12px">New portfolio message</h2>
        <p style="margin:0"><strong>${escapeHtml(msg.name)}</strong> &lt;${escapeHtml(msg.email)}&gt;</p>
        <p style="margin:4px 0 16px;color:#555">${escapeHtml(msg.subject || "(no subject)")}</p>
        <div style="white-space:pre-wrap;border-left:3px solid #61dafb;padding-left:12px">${escapeHtml(msg.message)}</div>
      </div>`,
  });
}

/** Optional confirmation email to the visitor (SEND_AUTO_REPLY=true). */
export async function sendAutoReply(msg: Message) {
  if (process.env.SEND_AUTO_REPLY !== "true") return;
  const from = process.env.SMTP_FROM || `Aryan Pathak <${process.env.SMTP_USER}>`;
  await getTransporter().sendMail({
    to: msg.email,
    from,
    subject: "Thanks for reaching out!",
    text: `Hi ${msg.name},\n\nThanks for your message — I've received it and will get back to you soon.\n\nAryan Pathak`,
  });
}
