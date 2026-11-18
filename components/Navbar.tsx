"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navLinks, profile } from "@/lib/data";
import { CloseIcon, MenuIcon } from "./Icons";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const onPlayground = usePathname() === "/playground";

  // Shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: highlight the section currently in view
  useEffect(() => {
    const sections = navLinks
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => Boolean(el));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Close the mobile menu with Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open ? "border-b border-line bg-bg/90 backdrop-blur" : "border-b border-transparent"
      }`}
    >
      <nav className="container-x flex h-16 items-center justify-between" aria-label="Main">
        <Link href="/#top" className="text-[15px] font-semibold tracking-tight">
          {profile.name}
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <li key={l.id}>
              <a
                href={`/#${l.id}`}
                className={`rounded-lg px-3 py-2 text-sm transition-colors hover:text-fg ${
                  active === l.id ? "text-fg" : "text-muted"
                }`}
                aria-current={active === l.id ? "true" : undefined}
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <Link
              href="/playground"
              aria-current={onPlayground ? "page" : undefined}
              className={`rounded-lg px-3 py-2 text-sm transition-colors hover:text-fg ${onPlayground ? "text-fg" : "text-muted"}`}
            >
              Playground
            </Link>
          </li>
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a href={profile.resumeUrl} target="_blank" rel="noopener" className="btn btn-primary hidden py-2! text-sm sm:inline-flex">
            Resume
          </a>
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-surface md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-line md:hidden">
          <ul className="container-x flex flex-col py-3">
            {navLinks.map((l) => (
              <li key={l.id}>
                <a
                  href={`/#${l.id}`}
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg px-3 py-3 ${active === l.id ? "font-medium" : ""}`}
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <Link href="/playground" onClick={() => setOpen(false)} className={`block rounded-lg px-3 py-3 ${onPlayground ? "font-medium" : ""}`}>
                Playground
              </Link>
            </li>
            <li>
              <a href={profile.resumeUrl} target="_blank" rel="noopener" className="btn btn-primary mt-2 w-full">
                Download Resume
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
