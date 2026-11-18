"use client";

import { useState, type FormEvent } from "react";

export type FieldType = "text" | "email" | "number" | "tel" | "date" | "textarea" | "select" | "checkbox";

export type FieldSchema = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  min?: number;
  max?: number;
  minLength?: number;
  helpText?: string;
};

export type FormValues = Record<string, string | boolean>;
type Errors = Record<string, string>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9\s-]{7,15}$/;

export function validateField(field: FieldSchema, value: string | boolean | undefined): string {
  if (field.type === "checkbox") return field.required && !value ? `${field.label} is required.` : "";
  const v = typeof value === "string" ? value.trim() : "";
  if (!v) return field.required ? `${field.label} is required.` : "";
  if (field.type === "email" && !EMAIL_RE.test(v)) return "Enter a valid email address.";
  if (field.type === "tel" && !PHONE_RE.test(v)) return "Enter a valid phone number.";
  if (field.type === "number") {
    const n = Number(v);
    if (Number.isNaN(n)) return "Enter a number.";
    if (field.min !== undefined && n < field.min) return `Must be at least ${field.min}.`;
    if (field.max !== undefined && n > field.max) return `Must be at most ${field.max}.`;
  }
  if (field.minLength && v.length < field.minLength) return `Use at least ${field.minLength} characters.`;
  return "";
}

const initialValues = (fields: FieldSchema[]): FormValues =>
  Object.fromEntries(fields.map((f) => [f.name, f.type === "checkbox" ? false : ""]));

type Props = {
  fields: FieldSchema[];
  submitLabel?: string;
  onSubmit: (values: FormValues) => void;
};

/** Renders any form from a JSON schema, with per-field validation. */
export default function DynamicForm({ fields, submitLabel = "Submit", onSubmit }: Props) {
  const [values, setValues] = useState<FormValues>(() => initialValues(fields));
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Keep values in sync when fields are added/removed (schema changes).
  const [prevFields, setPrevFields] = useState(fields);
  if (fields !== prevFields) {
    setPrevFields(fields);
    setValues((v) => ({ ...initialValues(fields), ...Object.fromEntries(Object.entries(v).filter(([k]) => fields.some((f) => f.name === k))) }));
    setErrors({});
    setTouched({});
  }

  const setValue = (field: FieldSchema, value: string | boolean) => {
    setValues((v) => ({ ...v, [field.name]: value }));
    if (touched[field.name]) setErrors((e) => ({ ...e, [field.name]: validateField(field, value) }));
  };

  const onBlur = (field: FieldSchema) => {
    setTouched((t) => ({ ...t, [field.name]: true }));
    setErrors((e) => ({ ...e, [field.name]: validateField(field, values[field.name]) }));
  };

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const next: Errors = {};
    for (const f of fields) {
      const msg = validateField(f, values[f.name]);
      if (msg) next[f.name] = msg;
    }
    setErrors(next);
    setTouched(Object.fromEntries(fields.map((f) => [f.name, true])));
    if (Object.keys(next).length === 0) {
      onSubmit(values);
      setValues(initialValues(fields));
      setTouched({});
    } else {
      document.getElementById(`df-${Object.keys(next)[0]}`)?.focus();
    }
  }

  if (fields.length === 0) {
    return <p className="py-10 text-center text-muted">No fields yet — add one from the schema editor.</p>;
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
      {fields.map((f) => {
        const id = `df-${f.name}`;
        const err = errors[f.name];
        const wide = f.type === "textarea" || f.type === "checkbox";
        const common = {
          id,
          name: f.name,
          onBlur: () => onBlur(f),
          "aria-invalid": err ? true : undefined,
          "aria-describedby": err ? `${id}-err` : f.helpText ? `${id}-help` : undefined,
        };
        const label = (
          <>
            {f.label || <em className="text-muted">Untitled field</em>}
            {f.required && <span className="text-muted"> *</span>}
          </>
        );

        return (
          <div key={f.name} className={wide ? "sm:col-span-2" : ""}>
            {f.type === "checkbox" ? (
              <label htmlFor={id} className="flex items-center gap-3 text-sm">
                <input
                  {...common}
                  type="checkbox"
                  checked={Boolean(values[f.name])}
                  onChange={(e) => setValue(f, e.target.checked)}
                  className="h-4 w-4 accent-(--accent)"
                />
                <span>{label}</span>
              </label>
            ) : (
              <>
                <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
                  {label}
                </label>
                {f.type === "textarea" ? (
                  <textarea {...common} rows={3} className="input resize-y" placeholder={f.placeholder} value={String(values[f.name] ?? "")} onChange={(e) => setValue(f, e.target.value)} />
                ) : f.type === "select" ? (
                  <select {...common} className="input" value={String(values[f.name] ?? "")} onChange={(e) => setValue(f, e.target.value)}>
                    <option value="">{f.placeholder || "Select..."}</option>
                    {(f.options ?? []).map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    {...common}
                    type={f.type}
                    className="input"
                    placeholder={f.placeholder}
                    min={f.min}
                    max={f.max}
                    value={String(values[f.name] ?? "")}
                    onChange={(e) => setValue(f, e.target.value)}
                  />
                )}
              </>
            )}
            {err ? (
              <p id={`${id}-err`} className="mt-1.5 text-sm text-red-500">
                {err}
              </p>
            ) : (
              f.helpText && (
                <p id={`${id}-help`} className="mt-1.5 text-xs text-muted">
                  {f.helpText}
                </p>
              )
            )}
          </div>
        );
      })}
      <div className="sm:col-span-2">
        <button type="submit" className="btn btn-primary">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
