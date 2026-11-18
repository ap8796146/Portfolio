import { storageKind } from "@/lib/db";
import { mailConfigured } from "@/lib/mailer";

export async function GET() {
  return Response.json({
    status: "ok",
    storage: storageKind(),
    email: mailConfigured() ? "configured" : "not configured",
    time: new Date().toISOString(),
  });
}
