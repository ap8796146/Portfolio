import { projects } from "@/lib/data";
import Link from "next/link";
import { ArrowRightIcon, ExternalIcon, GithubIcon } from "./Icons";
import Reveal from "./Reveal";
import Section from "./Section";

export default function Projects() {
  return (
    <Section id="projects" index="04" title="Featured Projects">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <Reveal key={p.name} delay={i * 90} className="card card-hover group flex flex-col overflow-hidden">
            <div className="flex flex-1 flex-col p-6">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium uppercase tracking-wider text-muted">{p.kind}</span>
                <span className="font-mono text-xs text-muted">{p.period}</span>
              </div>
              <h3 className="mt-3 text-lg font-semibold">{p.name}</h3>

              <ul className="mt-4 flex-1 space-y-2 text-sm text-muted">
                {p.points.map((pt) => (
                  <li key={pt} className="flex gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>

              <ul className="mt-5 flex flex-wrap gap-2">
                {p.stack.map((s) => (
                  <li key={s} className="chip text-xs!">
                    {s}
                  </li>
                ))}
              </ul>

              {(p.github || p.demo) && (
                <div className="mt-5 flex gap-3 border-t border-line pt-4 text-sm">
                  {p.github && (
                    <a href={p.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-fg">
                      <GithubIcon className="h-4 w-4" /> Code
                    </a>
                  )}
                  {p.demo && (
                    <a href={p.demo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-fg">
                      <ExternalIcon className="h-4 w-4" /> Live demo
                    </a>
                  )}
                </div>
              )}
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-8">
        <Link
          href="/playground"
          className="card card-hover group flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center"
        >
          <div>
            <p className="text-lg font-semibold">Want proof? Try my components live.</p>
            <p className="mt-1 text-sm text-muted">
              Data table with API integration, accessible modal and a schema-driven dynamic form builder. All interactive.
            </p>
          </div>
          <span className="btn btn-primary shrink-0">
            Open playground <ArrowRightIcon className="h-4 w-4" />
          </span>
        </Link>
      </Reveal>
    </Section>
  );
}
