import { profile } from "@/lib/data";
import { CheckIcon } from "./Icons";
import Reveal from "./Reveal";
import Section from "./Section";

const strengths = [
  "Reusable, well-typed component libraries",
  "REST API integration with solid loading / error / empty states",
  "Performance: lazy loading, code splitting, memoization",
  "Pixel-accurate Figma → React conversion",
  "Migrating legacy PHP modules to modern React",
  "Agile teamwork with Git, Jira and code reviews",
];

export default function About() {
  return (
    <Section id="about" index="01" title="About Me">
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <Reveal className="space-y-5 text-lg leading-relaxed text-muted">
          <p>{profile.summary}</p>
          <p>
            Currently I&apos;m a <span className="font-medium text-fg">{profile.currently}</span>
          </p>
          <p>
            I enjoy turning designs into interfaces that are fast, accessible and easy to maintain — and I like
            working across the stack, from React components down to Express APIs and MySQL schemas.
          </p>
        </Reveal>

        <Reveal delay={120} className="card p-6">
          <h3 className="font-semibold">What I bring</h3>
          <ul className="mt-4 space-y-3">
            {strengths.map((s) => (
              <li key={s} className="flex gap-3">
                <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-muted" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
