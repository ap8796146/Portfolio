"use client";

import { useState, type ReactNode } from "react";
import Reveal from "../Reveal";

type Props = {
  id: string;
  index: string;
  title: string;
  description: string;
  concepts: string[];
  code: string;
  children: ReactNode;
};

/** Frame for each playground demo with a Preview / Code switch. */
export default function DemoCard({ id, index, title, description, concepts, code, children }: Props) {
  const [tab, setTab] = useState<"preview" | "code">("preview");

  return (
    <Reveal as="section" className="scroll-mt-24">
      <div id={id} className="card overflow-hidden">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-line p-6">
          <div className="max-w-2xl">
            <p className="font-mono text-sm text-muted">{index}</p>
            <h2 className="mt-1 text-xl font-semibold">{title}</h2>
            <p className="mt-2 text-muted">{description}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {concepts.map((c) => (
                <li key={c} className="chip text-xs!">
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex rounded-xl border border-line bg-surface-2 p-1" role="tablist" aria-label={`${title} view`}>
            {(["preview", "code"] as const).map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={`rounded-lg px-4 py-1.5 text-sm capitalize transition ${tab === t ? "bg-fg text-bg" : "text-muted hover:text-fg"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </header>
        <div className="p-4 sm:p-6">
          {/* Keep the preview mounted so its state survives switching tabs */}
          <div hidden={tab !== "preview"}>{children}</div>
          {tab === "code" && (
            <pre className="overflow-x-auto rounded-xl border border-line bg-surface-2 p-5 font-mono text-[13px] leading-6">
              <code>{code.trim()}</code>
            </pre>
          )}
        </div>
      </div>
    </Reveal>
  );
}
