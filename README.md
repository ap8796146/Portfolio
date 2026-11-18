# Aryan Pathak — Portfolio

Full-stack developer portfolio built with **Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS v4**.

- **Frontend:** animated hero with typewriter + code card, about, skills, experience timeline, projects, education & certifications, contact form. Dark/light theme, responsive, accessible, scroll-reveal animations.
- **Component Playground (`/playground`):** live, interactive demos of reusable components built without a UI library: a generic `DataTable<T>` fed by a REST endpoint (debounced server-side search, sorting, pagination, loading/error/empty states, network simulation), an accessible `<dialog>` modal, and a schema-driven **dynamic form builder** with live label editing.
- **SEO:** generated social share image (`/opengraph-image`), sitemap, robots.txt, web manifest, canonical URLs, Twitter cards and `Person` JSON-LD structured data.
- **Backend (Next.js Route Handlers):** contact API with validation, honeypot spam protection and rate limiting; messages stored in **MySQL** or a local JSON file; **email notifications** via SMTP (Nodemailer); password-protected **admin inbox** at `/admin`.

## Quick start

```bash
npm install
cp .env.example .env.local   # optional, fill in what you need
npm run dev                  # http://localhost:3000
```

Without any env vars the site works and messages are saved to `data/messages.json`.

## Editing content

All text lives in [`lib/data.ts`](lib/data.ts): profile, skills, experience, projects, education. Add your LinkedIn/GitHub and project repo/demo URLs there; empty links are hidden automatically. Replace `public/Aryan-Pathak-Resume.pdf` to update the downloadable resume.

## Environment variables

See [`.env.example`](.env.example).

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public site URL (e.g. `https://aryanpathak.dev`) used for canonical links, sitemap and share images. Auto-detected on Vercel |
| `ADMIN_PASSWORD`, `SESSION_SECRET` | Enable `/admin` login (both required) |
| `DATABASE_URL` | `mysql://user:pass@host:3306/db`; the table is created automatically. If unset, a JSON file is used |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | Send an email for every new message (Gmail: use an App Password) |
| `CONTACT_TO_EMAIL` | Where notifications go (defaults to `SMTP_USER`) |
| `SEND_AUTO_REPLY` | `true` to send visitors a confirmation email |

## API

| Method | Route | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/api/contact` | — | `{ name, email, subject?, message }` → `201`. `400` with `fields` on validation errors, `429` when rate-limited (5 per 10 min per IP) |
| `GET` | `/api/demo/employees` | — | Demo data for the playground. `?q=&dept=&delay=ms&fail=1` |
| `GET` | `/api/health` | — | Status, storage type, whether email is configured |
| `POST` | `/api/admin/login` | — | `{ password }` → sets an httpOnly session cookie |
| `POST` | `/api/admin/logout` | cookie | Clears the session |
| `GET` | `/api/admin/messages` | cookie | List messages |
| `PATCH` | `/api/admin/messages/:id` | cookie | `{ read: boolean }` |
| `DELETE` | `/api/admin/messages/:id` | cookie | Delete a message |

## Project structure

```
app/
  page.tsx               # portfolio (one page)
  playground/            # live component demos
  opengraph-image.tsx    # social share card
  sitemap.ts, robots.ts, manifest.ts, icon.svg
  admin/                 # inbox + login pages
  api/                   # route handlers (backend)
components/              # UI sections + admin components
  playground/            # DataTable, Modal, DynamicForm, hooks (useFetch, useDebounce)
lib/
  data.ts                # ← all site content
  db.ts                  # MySQL / JSON-file message store
  mailer.ts              # SMTP notifications
  auth.ts                # signed-cookie admin session
  validation.ts          # shared client/server validation
  rate-limit.ts
```

## Deploying

- **Vercel:** the filesystem is read-only, so set `DATABASE_URL` (e.g. a hosted MySQL such as Aiven, PlanetScale or Railway) and/or the SMTP variables. The in-memory rate limiter is best-effort on serverless.
- **VPS / Docker / Render:** `npm run build && npm start`. The JSON file store works if the disk is persistent.
