import { Suspense } from "react";
import { profile } from "@/lib/data";
import CurrentYear from "./CurrentYear";
import { GithubIcon, LinkedinIcon, MailIcon } from "./Icons";

export default function Footer() {
  return (
    <footer className="border-t border-line py-10">
      <div className="container-x flex flex-col items-center justify-between gap-4 text-sm text-muted sm:flex-row">
        <p>
          Designed &amp; built by {profile.name} with Next.js, React &amp; TypeScript.
        </p>
        <div className="flex items-center gap-4">
          {profile.github && (
            <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-fg">
              <GithubIcon />
            </a>
          )}
          {profile.linkedin && (
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-fg">
              <LinkedinIcon />
            </a>
          )}
          <a href={`mailto:${profile.email}`} aria-label="Email" className="hover:text-fg">
            <MailIcon />
          </a>
          <span>© <Suspense fallback={null}><CurrentYear /></Suspense></span>
        </div>
      </div>
    </footer>
  );
}
