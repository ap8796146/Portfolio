"use client";

import { useState } from "react";
import DynamicForm, { type FieldSchema, type FieldType, type FormValues } from "./DynamicForm";
import Modal from "./Modal";

const PRESETS: Record<string, { submit: string; fields: FieldSchema[] }> = {
  "Job application": {
    submit: "Apply now",
    fields: [
      { name: "fullName", label: "Full name", type: "text", required: true, placeholder: "Jane Doe" },
      { name: "email", label: "Email", type: "email", required: true, placeholder: "jane@company.com" },
      { name: "experience", label: "Years of experience", type: "number", min: 0, max: 40, required: true },
      { name: "role", label: "Position", type: "select", required: true, options: ["React Developer", "Full-Stack Developer", "UI Engineer"] },
      { name: "about", label: "Why do you want to join?", type: "textarea", minLength: 20, helpText: "At least 20 characters." },
      { name: "terms", label: "I agree to the privacy policy", type: "checkbox", required: true },
    ],
  },
  "Client onboarding": {
    submit: "Create client",
    fields: [
      { name: "company", label: "Company name", type: "text", required: true },
      { name: "contact", label: "Contact person", type: "text", required: true },
      { name: "phone", label: "Phone", type: "tel", required: true, placeholder: "+91 98765 43210" },
      { name: "plan", label: "Plan", type: "select", options: ["Starter", "Business", "Enterprise"], required: true },
      { name: "start", label: "Start date", type: "date" },
    ],
  },
  "Event RSVP": {
    submit: "RSVP",
    fields: [
      { name: "name", label: "Your name", type: "text", required: true },
      { name: "guests", label: "Number of guests", type: "number", min: 1, max: 5, required: true },
      { name: "meal", label: "Meal preference", type: "select", options: ["Veg", "Non-veg", "Vegan"] },
      { name: "updates", label: "Send me event updates", type: "checkbox" },
    ],
  },
};

const TYPES: FieldType[] = ["text", "email", "number", "tel", "date", "textarea", "select", "checkbox"];

export default function FormBuilder() {
  const [preset, setPreset] = useState("Job application");
  const [fields, setFields] = useState<FieldSchema[]>(PRESETS[preset].fields);
  const [view, setView] = useState<"editor" | "json">("editor");
  const [submitted, setSubmitted] = useState<FormValues | null>(null);
  const [counter, setCounter] = useState(1);

  const loadPreset = (name: string) => {
    setPreset(name);
    setFields(PRESETS[name].fields);
  };

  const update = (index: number, patch: Partial<FieldSchema>) =>
    setFields((fs) => fs.map((f, i) => (i === index ? { ...f, ...patch } : f)));

  const addField = () => {
    setFields((fs) => [...fs, { name: `custom${counter}`, label: `New field ${counter}`, type: "text" }]);
    setCounter((c) => c + 1);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Form presets">
        {Object.keys(PRESETS).map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => loadPreset(name)}
            aria-pressed={preset === name}
            className={`chip cursor-pointer ${preset === name ? "border-fg! bg-fg! text-bg!" : ""}`}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Schema editor */}
        <div className="rounded-xl border border-line bg-surface-2/40 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold">Schema</h3>
            <div className="flex gap-1 text-xs">
              {(["editor", "json"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setView(v)}
                  aria-pressed={view === v}
                  className={`rounded-md px-2.5 py-1 font-mono uppercase ${view === v ? "bg-fg text-bg" : "text-muted hover:text-fg"}`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {view === "json" ? (
            <pre className="max-h-[28rem] overflow-auto rounded-lg bg-surface p-4 font-mono text-xs leading-5">{JSON.stringify(fields, null, 2)}</pre>
          ) : (
            <ul className="max-h-[28rem] space-y-2 overflow-y-auto pr-1">
              {fields.map((f, i) => (
                <li key={f.name} className="flex flex-wrap items-center gap-2 rounded-lg border border-line bg-surface p-2">
                  <input
                    aria-label={`Label for ${f.name}`}
                    className="input min-w-0 flex-1 px-2.5! py-1.5! text-sm"
                    value={f.label}
                    onChange={(e) => update(i, { label: e.target.value })}
                  />
                  <select
                    aria-label={`Type for ${f.name}`}
                    className="input w-auto! px-2! py-1.5! text-sm"
                    value={f.type}
                    onChange={(e) => {
                      const type = e.target.value as FieldType;
                      update(i, { type, options: type === "select" ? (f.options ?? ["Option A", "Option B"]) : f.options });
                    }}
                  >
                    {TYPES.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                  <label className="flex items-center gap-1.5 text-xs text-muted">
                    <input type="checkbox" className="accent-(--accent)" checked={Boolean(f.required)} onChange={(e) => update(i, { required: e.target.checked })} />
                    req
                  </label>
                  <button
                    type="button"
                    onClick={() => setFields((fs) => fs.filter((_, j) => j !== i))}
                    className="rounded-md px-2 py-1 text-xs text-muted hover:bg-red-500/10 hover:text-red-500"
                    aria-label={`Remove ${f.label || f.name}`}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button type="button" onClick={addField} className="btn btn-ghost mt-3 w-full py-2! text-sm">
            + Add field
          </button>
        </div>

        {/* Live rendered form */}
        <div className="rounded-xl border border-line p-4 sm:p-5">
          <h3 className="mb-4 font-semibold">
            Live form <span className="text-sm font-normal text-muted">— edit a label on the left and watch it update</span>
          </h3>
          <DynamicForm fields={fields} submitLabel={PRESETS[preset].submit} onSubmit={setSubmitted} />
        </div>
      </div>

      <Modal
        open={submitted !== null}
        onClose={() => setSubmitted(null)}
        title="Form submitted ✓"
        size="sm"
        footer={
          <button type="button" className="btn btn-primary py-2! text-sm" onClick={() => setSubmitted(null)}>
            Close
          </button>
        }
      >
        <p className="mb-3 text-sm text-muted">This is the payload that would be POSTed to the API:</p>
        <pre className="overflow-x-auto rounded-lg bg-surface-2 p-4 font-mono text-xs leading-5">{JSON.stringify(submitted, null, 2)}</pre>
      </Modal>
    </div>
  );
}
