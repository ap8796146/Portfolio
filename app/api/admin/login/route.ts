import { cookies } from "next/headers";
import { adminEnabled, checkPassword, createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  if (!adminEnabled()) {
    return Response.json(
      { error: "Admin is disabled. Set ADMIN_PASSWORD and SESSION_SECRET in .env.local." },
      { status: 503 },
    );
  }

  const limit = rateLimit(`login:${clientIp(req) ?? "unknown"}`, 10, 15 * 60 * 1000);
  if (!limit.ok) {
    return Response.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  let password = "";
  try {
    const body = await req.json();
    password = typeof body?.password === "string" ? body.password : "";
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!checkPassword(password)) {
    return Response.json({ error: "Incorrect password." }, { status: 401 });
  }

  (await cookies()).set(SESSION_COOKIE, createSessionToken(), sessionCookieOptions);
  return Response.json({ ok: true });
}
