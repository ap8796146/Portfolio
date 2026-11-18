import { isAdmin } from "@/lib/auth";
import { getStore } from "@/lib/db";

export async function GET() {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const messages = await getStore().list();
  return Response.json({ messages });
}
