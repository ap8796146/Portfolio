import type { NextRequest } from "next/server";
import { EMPLOYEES } from "@/lib/demo-data";

// Demo REST endpoint for the /playground employee directory.
// Query: ?q=search&dept=Engineering&delay=ms&fail=1
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const q = (params.get("q") ?? "").trim().toLowerCase().slice(0, 100);
  const dept = params.get("dept") ?? "";
  const delay = Math.min(Math.max(Number(params.get("delay")) || 0, 0), 3000);

  if (delay) await new Promise((r) => setTimeout(r, delay));

  if (params.get("fail") === "1") {
    return Response.json({ error: "Simulated server error (500). Try again." }, { status: 500 });
  }

  const data = EMPLOYEES.filter(
    (e) =>
      (!dept || e.department === dept) &&
      (!q || [e.name, e.email, e.role, e.location, e.id].some((v) => v.toLowerCase().includes(q))),
  );

  return Response.json({ data, total: data.length });
}
