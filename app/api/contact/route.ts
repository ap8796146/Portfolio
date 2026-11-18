import { getStore } from "@/lib/db";
import { mailConfigured, sendAutoReply, sendNotification } from "@/lib/mailer";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { normalizeContact, validateContact } from "@/lib/validation";

const MAX_BODY_BYTES = 20_000;

export async function POST(req: Request) {
  // Body size guard
  const length = Number(req.headers.get("content-length") || 0);
  if (length > MAX_BODY_BYTES) {
    return Response.json({ error: "Message is too large." }, { status: 413 });
  }

  let raw: Record<string, unknown>;
  try {
    raw = await req.json();
    if (!raw || typeof raw !== "object") throw new Error("not an object");
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot: real users never fill the hidden "company" field.
  // Pretend success so bots don't learn to adapt.
  if (typeof raw.company === "string" && raw.company.trim() !== "") {
    return Response.json({ ok: true }, { status: 201 });
  }

  const ip = clientIp(req);
  const limit = rateLimit(`contact:${ip ?? "unknown"}`, 5, 10 * 60 * 1000);
  if (!limit.ok) {
    return Response.json(
      { error: "Too many messages. Please try again in a few minutes." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  const input = normalizeContact(raw);
  const errors = validateContact(input);
  if (Object.keys(errors).length > 0) {
    return Response.json({ error: "Please fix the highlighted fields.", fields: errors }, { status: 400 });
  }

  // 1) Persist. 2) Email. The message counts as delivered if either succeeds.
  let saved = null;
  try {
    saved = await getStore().create(input, ip);
  } catch (err) {
    console.error("[contact] failed to store message:", err);
  }

  let emailed = false;
  if (mailConfigured()) {
    const msg = saved ?? { ...input, id: "unsaved", createdAt: new Date().toISOString(), read: false, ip };
    try {
      await sendNotification(msg);
      emailed = true;
      await sendAutoReply(msg).catch((err) => console.error("[contact] auto-reply failed:", err));
    } catch (err) {
      console.error("[contact] failed to send notification:", err);
    }
  }

  if (!saved && !emailed) {
    return Response.json(
      { error: "Sorry, your message couldn't be delivered right now. Please email me directly." },
      { status: 500 },
    );
  }

  return Response.json({ ok: true }, { status: 201 });
}
