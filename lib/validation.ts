// Shared by the contact form (client) and the /api/contact route (server).

export type ContactInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type FieldErrors = Partial<Record<keyof ContactInput, string>>;

export const LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 254 },
  subject: { max: 120 },
  message: { min: 10, max: 5000 },
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Strip control characters (keep newlines/tabs in the message body).
function clean(value: unknown, multiline = false): string {
  if (typeof value !== "string") return "";
  const re = multiline ? /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g;
  return value.replace(re, "").trim();
}

export function normalizeContact(raw: Record<string, unknown>): ContactInput {
  return {
    name: clean(raw.name),
    email: clean(raw.email).toLowerCase(),
    subject: clean(raw.subject),
    message: clean(raw.message, true),
  };
}

export function validateContact(input: ContactInput): FieldErrors {
  const errors: FieldErrors = {};

  if (input.name.length < LIMITS.name.min) errors.name = "Please enter your name.";
  else if (input.name.length > LIMITS.name.max) errors.name = `Name must be under ${LIMITS.name.max} characters.`;

  if (!input.email) errors.email = "Please enter your email.";
  else if (input.email.length > LIMITS.email.max || !EMAIL_RE.test(input.email))
    errors.email = "Please enter a valid email address.";

  if (input.subject.length > LIMITS.subject.max)
    errors.subject = `Subject must be under ${LIMITS.subject.max} characters.`;

  if (input.message.length < LIMITS.message.min)
    errors.message = `Message should be at least ${LIMITS.message.min} characters.`;
  else if (input.message.length > LIMITS.message.max)
    errors.message = `Message must be under ${LIMITS.message.max} characters.`;

  return errors;
}
