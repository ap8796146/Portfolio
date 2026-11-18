"use client";

// Rendered on the client so the static page never shows a stale year.
export default function CurrentYear() {
  return <>{new Date().getFullYear()}</>;
}
