"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { profile } from "@/lib/data";
import { LIMITS, normalizeContact, validateContact, type ContactInput, type FieldErrors } from "@/lib/validation";
import { CheckIcon, GithubIcon, LinkedinIcon, MailIcon, MapPinIcon, SendIcon } from "./Icons";
import Reveal from "./Reveal";
import Section from "./Section";

type Status = "idle" | "sending" | "sent" | "error";
const EMPTY: ContactInput = { name: "", email: "", subject: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState<ContactInput>(EMPTY);
  const [company, setCompany] = useState(""); // honeypot
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name as keyof ContactInput]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError("");

    const clientErrors = validateContact(normalizeContact(form));
    if (Object.keys(clientErrors).length) {
      setErrors(clientErrors);
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, company }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.fields) setErrors(data.fields);
        setServerError(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("sent");
      setForm(EMPTY);
      setErrors({});
    } catch {
      setServerError("Network error — please check your connection and try again.");
      setStatus("error");
    }
  }

  const field = (name: keyof ContactInput) => ({
    id: `contact-${name}`,
    name,
    value: form[name],
    onChange,
    className: "input",
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `contact-${name}-error` : undefined,
  });

  const errorText = (name: keyof ContactInput) =>
    errors[name] ? (
      <p id={`contact-${name}-error`} className="mt-1.5 text-sm text-red-500">
        {errors[name]}
      </p>
    ) : null;

  return (
    <Section id="contact" index="06" title="Get In Touch">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        <Reveal className="space-y-6">
          <p className="text-lg leading-relaxed text-muted">
            Have a role, a project, or just want to say hi? My inbox is always open. Send a message and I&apos;ll get
            back to you as soon as I can.
          </p>

          <ul className="space-y-3">
            <li>
              <a href={`mailto:${profile.email}`} className="card card-hover flex items-center gap-4 p-4">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-surface-2 text-muted">
                  <MailIcon />
                </span>
                <span>
                  <span className="block text-xs text-muted">Email</span>
                  <span className="break-all">{profile.email}</span>
                </span>
              </a>
            </li>
            <li className="card flex items-center gap-4 p-4">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-surface-2 text-muted">
                <MapPinIcon />
              </span>
              <span>
                <span className="block text-xs text-muted">Location</span>
                {profile.location}
              </span>
            </li>
            {profile.linkedin && (
              <li>
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="card card-hover flex items-center gap-4 p-4">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-surface-2 text-muted">
                    <LinkedinIcon />
                  </span>
                  LinkedIn
                </a>
              </li>
            )}
            {profile.github && (
              <li>
                <a href={profile.github} target="_blank" rel="noopener noreferrer" className="card card-hover flex items-center gap-4 p-4">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-surface-2 text-muted">
                    <GithubIcon />
                  </span>
                  GitHub
                </a>
              </li>
            )}
          </ul>
        </Reveal>

        <Reveal delay={120} className="card p-6 sm:p-8">
          {status === "sent" ? (
            <div className="flex min-h-80 flex-col items-center justify-center text-center" role="status">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-emerald-500/15 text-emerald-500">
                <CheckIcon className="h-8 w-8" />
              </span>
              <h3 className="mt-5 text-2xl font-semibold">Message sent!</h3>
              <p className="mt-2 max-w-sm text-muted">Thanks for reaching out — I&apos;ll reply to your email soon.</p>
              <button type="button" className="btn btn-ghost mt-6" onClick={() => setStatus("idle")}>
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium">
                    Name <span className="text-muted">*</span>
                  </label>
                  <input {...field("name")} autoComplete="name" maxLength={LIMITS.name.max} placeholder="Jane Doe" />
                  {errorText("name")}
                </div>
                <div>
                  <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium">
                    Email <span className="text-muted">*</span>
                  </label>
                  <input {...field("email")} type="email" autoComplete="email" maxLength={LIMITS.email.max} placeholder="jane@company.com" />
                  {errorText("email")}
                </div>
              </div>

              <div>
                <label htmlFor="contact-subject" className="mb-1.5 block text-sm font-medium">
                  Subject
                </label>
                <input {...field("subject")} maxLength={LIMITS.subject.max} placeholder="Frontend role at ..." />
                {errorText("subject")}
              </div>

              <div>
                <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium">
                  Message <span className="text-muted">*</span>
                </label>
                <textarea {...field("message")} rows={6} maxLength={LIMITS.message.max} placeholder="Tell me a bit about what you have in mind..." className="input resize-y" />
                <div className="flex justify-between">
                  {errorText("message")}
                  <span className="mt-1.5 ml-auto font-mono text-xs text-muted">
                    {form.message.length}/{LIMITS.message.max}
                  </span>
                </div>
              </div>

              {/* Honeypot — hidden from humans and screen readers */}
              <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
                <label htmlFor="contact-company">Company</label>
                <input id="contact-company" name="company" tabIndex={-1} autoComplete="off" value={company} onChange={(e) => setCompany(e.target.value)} />
              </div>

              {serverError && (
                <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                  {serverError}
                </p>
              )}

              <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={status === "sending"}>
                {status === "sending" ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send message <SendIcon className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </Section>
  );
}
