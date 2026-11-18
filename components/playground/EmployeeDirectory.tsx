"use client";

import { useCallback, useMemo, useState } from "react";
import { DEPARTMENTS, type Employee } from "@/lib/demo-data";
import DataTable, { type Column } from "./DataTable";
import { useDebounce, useFetch } from "./hooks";
import Modal from "./Modal";

const STATUS_STYLE: Record<Employee["status"], string> = {
  Active: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  Remote: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  "On Leave": "bg-amber-500/15 text-amber-600 dark:text-amber-400",
};

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const fmtDate = (d: string) => new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", { dateStyle: "medium" });

function Avatar({ name }: { name: string }) {
  const initials = name.split(" ").map((p) => p[0]).join("").slice(0, 2);
  return (
    <span
      className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line bg-surface-2 text-xs font-semibold text-muted"
      aria-hidden
    >
      {initials}
    </span>
  );
}

// Defined once at module level so the memoized rows never see a new columns array.
const COLUMNS: Column<Employee>[] = [
  {
    key: "name",
    header: "Employee",
    sortable: true,
    render: (e) => (
      <span className="flex items-center gap-3">
        <Avatar name={e.name} />
        <span className="min-w-0">
          <span className="block font-medium">{e.name}</span>
          <span className="block truncate text-xs text-muted">{e.role}</span>
        </span>
      </span>
    ),
  },
  { key: "department", header: "Department", sortable: true, hideOnMobile: true },
  { key: "location", header: "Location", sortable: true, hideOnMobile: true },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (e) => <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLE[e.status]}`}>{e.status}</span>,
  },
  { key: "joined", header: "Joined", sortable: true, hideOnMobile: true, render: (e) => <span className="font-mono text-xs">{fmtDate(e.joined)}</span> },
];

export default function EmployeeDirectory() {
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("");
  const [slow, setSlow] = useState(false);
  const [fail, setFail] = useState(false);
  const [selected, setSelected] = useState<Employee | null>(null);
  const [copied, setCopied] = useState(false);

  const q = useDebounce(search, 300);

  const url = useMemo(() => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (dept) p.set("dept", dept);
    if (slow) p.set("delay", "1500");
    if (fail) p.set("fail", "1");
    return `/api/demo/employees?${p}`;
  }, [q, dept, slow, fail]);

  const { data, loading, error, refetch } = useFetch<{ data: Employee[]; total: number }>(url);
  const rows = useMemo(() => data?.data ?? [], [data]);

  // Stable callback → memoized rows don't re-render when the parent does.
  const openEmployee = useCallback((e: Employee) => {
    setCopied(false);
    setSelected(e);
  }, []);

  const copyEmail = async () => {
    if (!selected) return;
    try {
      await navigator.clipboard.writeText(selected.email);
      setCopied(true);
    } catch {
      /* clipboard blocked */
    }
  };

  const isFiltered = search || dept || slow || fail;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-48 flex-1">
          <label htmlFor="emp-search" className="mb-1.5 block text-xs font-medium text-muted">
            Search (debounced, server-side)
          </label>
          <input id="emp-search" type="search" className="input py-2!" placeholder="Name, role, city, ID..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div>
          <label htmlFor="emp-dept" className="mb-1.5 block text-xs font-medium text-muted">
            Department
          </label>
          <select id="emp-dept" className="input py-2!" value={dept} onChange={(e) => setDept(e.target.value)}>
            <option value="">All departments</option>
            {DEPARTMENTS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
        <fieldset className="flex flex-wrap items-center gap-2">
          <legend className="sr-only">Simulate network conditions</legend>
          <label className={`chip cursor-pointer select-none ${slow ? "border-fg! bg-fg! text-bg!" : ""}`}>
            <input type="checkbox" className="sr-only" checked={slow} onChange={(e) => setSlow(e.target.checked)} />
            Slow network
          </label>
          <label className={`chip cursor-pointer select-none ${fail ? "border-fg! bg-fg! text-bg!" : ""}`}>
            <input type="checkbox" className="sr-only" checked={fail} onChange={(e) => setFail(e.target.checked)} />
            Force error
          </label>
          {isFiltered && (
            <button
              type="button"
              className="text-sm text-muted underline-offset-4 hover:text-fg hover:underline"
              onClick={() => {
                setSearch("");
                setDept("");
                setSlow(false);
                setFail(false);
              }}
            >
              Reset
            </button>
          )}
        </fieldset>
      </div>

      <p className="font-mono text-xs text-muted" aria-live="polite">
        GET {url} → {loading ? "loading..." : error ? "error" : `${rows.length} results`}
      </p>

      <DataTable
        caption="Employee directory"
        columns={COLUMNS}
        rows={rows}
        rowKey={(e) => e.id}
        loading={loading}
        error={error}
        onRetry={() => {
          setFail(false);
          refetch();
        }}
        emptyMessage="No employees match your filters."
        onRowClick={openEmployee}
      />

      <Modal
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected?.name ?? ""}
        footer={
          <>
            <button type="button" className="btn btn-ghost py-2! text-sm" onClick={copyEmail}>
              {copied ? "Copied ✓" : "Copy email"}
            </button>
            <button type="button" className="btn btn-primary py-2! text-sm" onClick={() => setSelected(null)}>
              Done
            </button>
          </>
        }
      >
        {selected && (
          <div>
            <div className="flex items-center gap-4">
              <Avatar name={selected.name} />
              <div>
                <p className="font-medium">{selected.role}</p>
                <p className="text-sm text-muted">{selected.id}</p>
              </div>
              <span className={`ml-auto rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLE[selected.status]}`}>{selected.status}</span>
            </div>
            <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
              {[
                ["Email", selected.email],
                ["Department", selected.department],
                ["Location", selected.location],
                ["Joined", fmtDate(selected.joined)],
                ["Salary (CTC)", inr.format(selected.salary)],
              ].map(([k, v]) => (
                <div key={k} className={k === "Email" ? "col-span-2" : ""}>
                  <dt className="text-xs text-muted">{k}</dt>
                  <dd className="mt-0.5 break-all">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </Modal>
    </div>
  );
}
