import { experience } from "@/lib/data";
import { BriefcaseIcon } from "./Icons";
import Reveal from "./Reveal";
import Section from "./Section";

export default function Experience() {
  return (
    <Section id="experience" index="03" title="Experience">
      <ol className="relative space-y-10 border-l border-line pl-8 sm:pl-10">
        {experience.map((job, i) => (
          <Reveal as="li" key={job.role} delay={i * 100} className="relative">
            <span className="absolute -left-[3.05rem] top-1 grid h-9 w-9 place-items-center rounded-full border border-line bg-surface text-muted sm:-left-[3.55rem]">
              <BriefcaseIcon className="h-4 w-4" />
            </span>
            <div className="card card-hover p-6">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="text-lg font-semibold">{job.role}</h3>
                  <p className="text-muted">{job.company}</p>
                </div>
                <div className="text-right text-sm text-muted">
                  <p className="font-mono">{job.period}</p>
                  <p>
                    {job.type ? `${job.type} · ` : ""}
                    {job.location}
                  </p>
                </div>
              </div>
              <ul className="mt-4 space-y-2 text-muted">
                {job.points.map((p) => (
                  <li key={p} className="flex gap-3">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
