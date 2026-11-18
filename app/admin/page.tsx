import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import MessagesTable from "@/components/admin/MessagesTable";
import { isAdmin } from "@/lib/auth";
import { getStore, storageKind } from "@/lib/db";
import { mailConfigured } from "@/lib/mailer";

export const metadata: Metadata = { title: "Inbox", robots: { index: false, follow: false } };

async function Inbox() {
  if (!(await isAdmin())) redirect("/admin/login");

  let messages = null;
  let loadError = "";
  try {
    messages = await getStore().list();
  } catch (err) {
    console.error("[admin] failed to load messages:", err);
    loadError = "Couldn't load messages. Check the database connection.";
  }

  return (
    <MessagesTable initial={messages ?? []} loadError={loadError} storage={storageKind()} email={mailConfigured()} />
  );
}

export default function AdminPage() {
  return (
    <main className="container-x py-10">
      <Suspense fallback={<p className="py-20 text-center font-mono text-muted">Loading inbox...</p>}>
        <Inbox />
      </Suspense>
    </main>
  );
}
