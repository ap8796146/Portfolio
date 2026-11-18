import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import LoginForm from "@/components/admin/LoginForm";
import { adminEnabled, isAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Admin login", robots: { index: false, follow: false } };

async function LoginBody() {
  if (await isAdmin()) redirect("/admin");

  return adminEnabled() ? (
    <LoginForm />
  ) : (
    <p className="mt-4 text-sm text-muted">
      Admin is disabled. Set <code className="font-mono">ADMIN_PASSWORD</code> and{" "}
      <code className="font-mono">SESSION_SECRET</code> in <code className="font-mono">.env.local</code>, then restart
      the server.
    </p>
  );
}

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center px-5">
      <div className="card w-full max-w-sm p-8">
        <p className="text-sm font-medium text-muted">Admin</p>
        <h1 className="mt-1 text-2xl font-bold">Portfolio inbox</h1>
        <Suspense fallback={<div className="mt-6 h-32" />}>
          <LoginBody />
        </Suspense>
      </div>
    </main>
  );
}
