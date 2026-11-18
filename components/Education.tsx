import { certifications, education } from "@/lib/data";
import { AwardIcon, GradIcon } from "./Icons";
import Reveal from "./Reveal";
import Section from "./Section";

export default function Education() {
  return (
    <Section id="education" index="05" title="Education & Certifications">
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-5">
          {education.map((e, i) => (
            <Reveal key={e.school} delay={i * 90} className="card card-hover flex gap-4 p-6">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-surface-2 text-muted">
                <GradIcon />
              </span>
              <div className="flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-semibold">{e.school}</h3>
                  <span className="font-mono text-xs text-muted">{e.period}</span>
                </div>
                <p>{e.degree}</p>
                <p className="text-sm text-muted">{e.location}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={150} className="card p-6">
          <h3 className="flex items-center gap-2 font-semibold">
            <AwardIcon className="text-muted" /> Certifications
          </h3>
          <ul className="mt-5 space-y-4">
            {certifications.map((c) => (
              <li key={c.name} className="rounded-xl border border-line bg-surface-2 p-4">
                <p className="font-medium">{c.name}</p>
                <p className="text-sm text-muted">{c.issuer}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
