import { isAdmin } from "@/lib/auth";
import { getStore } from "@/lib/db";

export async function PATCH(req: Request, ctx: RouteContext<"/api/admin/messages/[id]">) {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;

  let read: unknown;
  try {
    read = (await req.json())?.read;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (typeof read !== "boolean") return Response.json({ error: "`read` must be a boolean." }, { status: 400 });

  const ok = await getStore().setRead(id, read);
  return ok ? Response.json({ ok: true }) : Response.json({ error: "Not found" }, { status: 404 });
}

export async function DELETE(_req: Request, ctx: RouteContext<"/api/admin/messages/[id]">) {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const ok = await getStore().remove(id);
  return ok ? Response.json({ ok: true }) : Response.json({ error: "Not found" }, { status: 404 });
}
