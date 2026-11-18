import "server-only";
import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { ContactInput } from "./validation";

export type Message = ContactInput & {
  id: string;
  createdAt: string; // ISO string
  read: boolean;
  ip: string | null;
};

interface MessageStore {
  create(input: ContactInput, ip: string | null): Promise<Message>;
  list(): Promise<Message[]>;
  setRead(id: string, read: boolean): Promise<boolean>;
  remove(id: string): Promise<boolean>;
}

/* ------------------------------------------------------------------ */
/* MySQL store — used when DATABASE_URL is set                          */
/* ------------------------------------------------------------------ */

function createMysqlStore(url: string): MessageStore {
  // Lazy import so the file store works without a MySQL server.
  let poolPromise: Promise<import("mysql2/promise").Pool> | null = null;

  async function pool() {
    if (!poolPromise) {
      poolPromise = (async () => {
        const mysql = await import("mysql2/promise");
        const p = mysql.createPool({ uri: url, connectionLimit: 5, timezone: "Z" });
        await p.query(`
          CREATE TABLE IF NOT EXISTS messages (
            id         CHAR(36)      NOT NULL PRIMARY KEY,
            name       VARCHAR(80)   NOT NULL,
            email      VARCHAR(254)  NOT NULL,
            subject    VARCHAR(120)  NOT NULL DEFAULT '',
            message    TEXT          NOT NULL,
            ip         VARCHAR(64)   NULL,
            is_read    TINYINT(1)    NOT NULL DEFAULT 0,
            created_at DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
            INDEX idx_created_at (created_at)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        return p;
      })().catch((err) => {
        poolPromise = null; // allow retry on next request
        throw err;
      });
    }
    return poolPromise;
  }

  type Row = {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    ip: string | null;
    is_read: number;
    created_at: Date;
  };

  const toMessage = (r: Row): Message => ({
    id: r.id,
    name: r.name,
    email: r.email,
    subject: r.subject,
    message: r.message,
    ip: r.ip,
    read: Boolean(r.is_read),
    createdAt: new Date(r.created_at).toISOString(),
  });

  return {
    async create(input, ip) {
      const msg: Message = { ...input, id: randomUUID(), createdAt: new Date().toISOString(), read: false, ip };
      await (await pool()).execute(
        "INSERT INTO messages (id, name, email, subject, message, ip, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [msg.id, msg.name, msg.email, msg.subject, msg.message, msg.ip, new Date(msg.createdAt)],
      );
      return msg;
    },
    async list() {
      const [rows] = await (await pool()).query("SELECT * FROM messages ORDER BY created_at DESC LIMIT 500");
      return (rows as Row[]).map(toMessage);
    },
    async setRead(id, read) {
      const [res] = await (await pool()).execute("UPDATE messages SET is_read = ? WHERE id = ?", [read ? 1 : 0, id]);
      return (res as { affectedRows: number }).affectedRows > 0;
    },
    async remove(id) {
      const [res] = await (await pool()).execute("DELETE FROM messages WHERE id = ?", [id]);
      return (res as { affectedRows: number }).affectedRows > 0;
    },
  };
}

/* ------------------------------------------------------------------ */
/* JSON file store — zero-setup default for local development           */
/* ------------------------------------------------------------------ */

function createFileStore(file: string): MessageStore {
  // Serialize all access so concurrent requests can't clobber each other.
  let queue: Promise<unknown> = Promise.resolve();
  const exclusive = <T>(fn: () => Promise<T>): Promise<T> => {
    const run = queue.then(fn, fn);
    queue = run.catch(() => undefined);
    return run;
  };

  async function readAll(): Promise<Message[]> {
    try {
      return JSON.parse(await fs.readFile(file, "utf8")) as Message[];
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
      throw err;
    }
  }

  async function writeAll(messages: Message[]) {
    await fs.mkdir(path.dirname(file), { recursive: true });
    const tmp = `${file}.${process.pid}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(messages, null, 2));
    await fs.rename(tmp, file); // atomic replace
  }

  return {
    create: (input, ip) =>
      exclusive(async () => {
        const msg: Message = { ...input, id: randomUUID(), createdAt: new Date().toISOString(), read: false, ip };
        const all = await readAll();
        all.unshift(msg);
        await writeAll(all);
        return msg;
      }),
    list: () => exclusive(readAll),
    setRead: (id, read) =>
      exclusive(async () => {
        const all = await readAll();
        const m = all.find((x) => x.id === id);
        if (!m) return false;
        m.read = read;
        await writeAll(all);
        return true;
      }),
    remove: (id) =>
      exclusive(async () => {
        const all = await readAll();
        const next = all.filter((x) => x.id !== id);
        if (next.length === all.length) return false;
        await writeAll(next);
        return true;
      }),
  };
}

/* ------------------------------------------------------------------ */

const globalForStore = globalThis as unknown as { __messageStore?: MessageStore };

export function getStore(): MessageStore {
  if (!globalForStore.__messageStore) {
    const url = process.env.DATABASE_URL;
    globalForStore.__messageStore = url
      ? createMysqlStore(url)
      : createFileStore(path.join(process.cwd(), "data", "messages.json"));
  }
  return globalForStore.__messageStore;
}

export const storageKind = () => (process.env.DATABASE_URL ? "mysql" : "file");
