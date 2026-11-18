import type { ReactNode } from "react";
import Reveal from "./Reveal";

type Props = {
  id: string;
  index: string; // e.g. "01"
  title: string;
  children: ReactNode;
};

export default function Section({ id, index, title, children }: Props) {
  return (
    <section id={id} className="border-b border-line py-20 sm:py-24">
      <div className="container-x">
        <Reveal className="mb-10 flex items-baseline gap-4">
          <span className="font-mono text-sm text-muted">{index}</span>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
        </Reveal>
        {children}
      </div>
    </section>
  );
}
