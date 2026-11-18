"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { Message } from "@/lib/db";
import ThemeToggle from "../ThemeToggle";

type Filter = "all" | "unread" | "read";

type Props = {
  initial: Message[];
  loadError: string;
  storage: "mysql" | "file";
  email: boolean;
};

const fmt = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

export default function MessagesTable({ initial, loadError, storage, email }: Props) {
  const router = useRouter();
  const [messages, setMessages] = useState(initial);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState(loadError);

  // Re-sync when the server sends fresh data (router.refresh()).
  const [prevInitial, setPrevInitial] = useState(initial);
  if (initial !== prevInitial) {
    setPrevInitial(initial);
    setMessages(initial);
    setError(loadError);
  }

  const unread = messages.filter((m) => !m.read).length;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return messages.filter((m) => {
      if (filter === "unread" && m.read) return false;
      if (filter === "read" && !m.read) return false;
      if (!q) return true;
      return [m.name, m.email, m.subject, m.message].some((v) => v.toLowerCase().includes(q));
    });
  }, [messages, filter, query]);

  async function call(url: string, init: RequestInit) {
    const res = await fetch(url, { ...init, headers: { "Content-Type": "application/json" } });
    if (res.status === 401) {
      router.replace("/admin/login");
      throw new Error("Session expired.");
    }
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Request failed.");
  }

  async function setRead(id: string, read: boolean) {
    setBusy(id);
    setError("");
    try {
      await call(`/api/admin/messages/${id}`, { method: "PATCH", body: JSON.stringify({ read }) });
      setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, read } : m)));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(null);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this message permanently?")) return;
    setBusy(id);
    setError("");
    try {
      await call(`/api/admin/messages/${id}`, { method: "DELETE" });
      setMessages((ms) => ms.filter((m) => m.id !== id));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(null);
    }
  }

  function toggleOpen(m: Message) {
    const next = openId === m.id ? null : m.id;
    setOpenId(next);
    if (next && !m.read) void setRead(m.id, true);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div>
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted">Admin</p>
          <h1 className="text-3xl font-bold">
            Messages{" "}
            <span className="text-lg font-normal text-muted">
              ({messages.length} total, {unread} unread)
            </span>
          </h1>
          <p className="mt-1 text-sm text-muted">
            Storage: <span className="font-mono">{storage}</span> · Email notifications:{" "}
            <span className={email ? "text-emerald-500" : "text-amber-500"}>{email ? "on" : "off"}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/" className="btn btn-ghost py-2! text-sm">
            View site
          </Link>
          <button type="button" onClick={() => router.refresh()} className="btn btn-ghost py-2! text-sm">
            Refresh
          </button>
          <ThemeToggle />
          <button type="button" onClick={logout} className="btn btn-primary py-2! text-sm">
            Log out
          </button>
        </div>
      </header>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <div className="flex rounded-xl border border-line bg-surface p-1" role="tablist" aria-label="Filter messages">
          {(["all", "unread", "read"] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-4 py-1.5 text-sm capitalize transition ${
                filter === f ? "bg-fg text-bg" : "text-muted hover:text-fg"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, email, text..."
          className="input max-w-xs py-2!"
          aria-label="Search messages"
        />
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          {error}
        </p>
      )}

      <ul className="mt-6 space-y-3">
        {visible.length === 0 && (
          <li className="card p-10 text-center text-muted">
            {messages.length === 0 ? "No messages yet. They'll show up here when someone uses the contact form." : "No messages match."}
          </li>
        )}
        {visible.map((m) => {
          const open = openId === m.id;
          return (
            <li key={m.id} className={`card overflow-hidden ${!m.read ? "border-l-4 border-l-fg!" : ""}`}>
              <button
                type="button"
                onClick={() => toggleOpen(m)}
                aria-expanded={open}
                className="flex w-full flex-wrap items-start justify-between gap-2 p-4 text-left hover:bg-surface-2"
              >
                <div className="min-w-0 flex-1">
                  <p className={`truncate ${!m.read ? "font-semibold" : ""}`}>
                    {m.name} <span className="font-normal text-muted">&lt;{m.email}&gt;</span>
                  </p>
                  <p className="truncate text-sm text-muted">
                    <span className="text-fg">{m.subject || "(no subject)"}</span> — {m.message}
                  </p>
                </div>
                <time className="shrink-0 font-mono text-xs text-muted" dateTime={m.createdAt}>
                  {fmt(m.createdAt)}
                </time>
              </button>

              {open && (
                <div className="border-t border-line p-4">
                  <p className="whitespace-pre-wrap leading-relaxed">{m.message}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <a
                      href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject || "your message"}`)}`}
                      className="btn btn-primary py-1.5! text-sm"
                    >
                      Reply
                    </a>
                    <button type="button" disabled={busy === m.id} onClick={() => setRead(m.id, !m.read)} className="btn btn-ghost py-1.5! text-sm">
                      Mark as {m.read ? "unread" : "read"}
                    </button>
                    <button
                      type="button"
                      disabled={busy === m.id}
                      onClick={() => remove(m.id)}
                      className="btn btn-ghost py-1.5! text-sm text-red-500 hover:border-red-500!"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
