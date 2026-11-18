import { profile, stats } from "@/lib/data";
import { ArrowRightIcon, DownloadIcon, GithubIcon, LinkedinIcon, MailIcon, MapPinIcon } from "./Icons";

// Syntax-highlight helpers for the code card: keyword, string, identifier.
const K = ({ children }: { children: string }) => <span style={{ color: "var(--code-key)" }}>{children}</span>;
const S = ({ children }: { children: string }) => <span style={{ color: "var(--code-str)" }}>{children}</span>;
const F = ({ children }: { children: string }) => <span style={{ color: "var(--code-fn)", fontWeight: 600 }}>{children}</span>;

function CodeCard() {
  return (
    <div className="card w-full max-w-md overflow-hidden">
      <div className="flex items-center gap-2 border-b border-line bg-surface-2 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="ml-2 font-mono text-xs text-muted">developer.ts</span>
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-6 text-muted">
        <code>
          <K>const</K> <F>developer</F> = {"{"}
          {"\n"}  name: <S>{`"${profile.name}"`}</S>,
          {"\n"}  role: <S>{`"${profile.title}"`}</S>,
          {"\n"}  location: <S>{`"${profile.location}"`}</S>,
          {"\n"}  stack: [<S>{`"React"`}</S>, <S>{`"TypeScript"`}</S>,
          {"\n"}          <S>{`"Node.js"`}</S>, <S>{`"MySQL"`}</S>],
          {"\n"}  openToWork: <K>true</K>,
          {"\n"}{"}"};
        </code>
      </pre>
    </div>
  );
}

export default function Hero() {
  return (
    <section id="top" className="border-b border-line pt-32 pb-20 sm:pt-40 sm:pb-24">
      <div className="container-x grid items-center gap-14 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="mb-6 inline-flex items-center gap-2 text-sm text-muted">
            <span className="h-2 w-2 rounded-full bg-emerald-600 dark:bg-emerald-500" aria-hidden />
            Open to new opportunities
          </p>

          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">{profile.name}</h1>
          <p className="mt-3 text-xl text-muted sm:text-2xl">Frontend Developer · React &amp; TypeScript</p>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            I build fast, responsive, production-ready web applications with React, TypeScript and Node.js, with a
            focus on reusable components, clean API integrations and interfaces that are easy to use.
          </p>

          <p className="mt-4 flex items-center gap-2 text-sm text-muted">
            <MapPinIcon className="h-4 w-4" /> {profile.location}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#contact" className="btn btn-primary">
              Get in touch <ArrowRightIcon className="h-4 w-4" />
            </a>
            <a href="#projects" className="btn btn-ghost">
              View projects
            </a>
            <a href={profile.resumeUrl} download className="btn btn-ghost">
              <DownloadIcon className="h-4 w-4" /> Resume
            </a>
          </div>

          <div className="mt-8 flex items-center gap-4">
            {profile.github && (
              <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-muted transition hover:text-fg">
                <GithubIcon className="h-5 w-5" />
              </a>
            )}
            {profile.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-muted transition hover:text-fg">
                <LinkedinIcon className="h-5 w-5" />
              </a>
            )}
            <a href={`mailto:${profile.email}`} className="flex items-center gap-2 text-sm text-muted transition hover:text-fg">
              <MailIcon className="h-5 w-5" /> {profile.email}
            </a>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <CodeCard />
        </div>
      </div>

      <div className="container-x mt-16">
        <dl className="grid grid-cols-3 divide-x divide-line rounded-xl border border-line bg-surface">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col px-4 py-5 text-center sm:py-6">
              <dt className="order-2 mt-1 text-xs text-muted sm:text-sm">{s.label}</dt>
              <dd className="text-2xl font-semibold sm:text-3xl">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
