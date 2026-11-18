"use client";

import { memo, useMemo, useState, type ReactNode } from "react";

export type Column<T> = {
  key: keyof T & string;
  header: string;
  sortable?: boolean;
  render?: (row: T) => ReactNode;
  className?: string;
  hideOnMobile?: boolean;
};

type Props<T> = {
  caption: string;
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  pageSize?: number;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
};

type Sort = { key: string; dir: "asc" | "desc" } | null;

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

function compare(a: unknown, b: unknown) {
  if (typeof a === "number" && typeof b === "number") return a - b;
  return collator.compare(String(a ?? ""), String(b ?? ""));
}

/* Memoized row: only re-renders when its own data or columns change. */
function RowImpl<T>({ row, columns, onRowClick }: { row: T; columns: Column<T>[]; onRowClick?: (row: T) => void }) {
  return (
    <tr
      onClick={onRowClick ? () => onRowClick(row) : undefined}
      onKeyDown={
        onRowClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onRowClick(row);
              }
            }
          : undefined
      }
      tabIndex={onRowClick ? 0 : undefined}
      className={`border-t border-line transition-colors ${onRowClick ? "cursor-pointer hover:bg-surface-2 focus-visible:bg-surface-2" : ""}`}
    >
      {columns.map((c) => (
        <td key={c.key} className={`px-4 py-3 ${c.hideOnMobile ? "hidden md:table-cell" : ""} ${c.className ?? ""}`}>
          {c.render ? c.render(row) : String(row[c.key] ?? "")}
        </td>
      ))}
    </tr>
  );
}
const Row = memo(RowImpl) as typeof RowImpl;

/** Generic, reusable table: sorting, pagination, loading / error / empty states. */
export default function DataTable<T>({
  caption,
  columns,
  rows,
  rowKey,
  pageSize = 8,
  loading = false,
  error = null,
  onRetry,
  emptyMessage = "No records found.",
  onRowClick,
}: Props<T>) {
  const [sort, setSort] = useState<Sort>(null);
  const [page, setPage] = useState(1);

  // Back to page 1 whenever the data set changes.
  const [prevRows, setPrevRows] = useState(rows);
  if (rows !== prevRows) {
    setPrevRows(rows);
    setPage(1);
  }

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const k = sort.key as keyof T;
    const out = [...rows].sort((a, b) => compare(a[k], b[k]));
    return sort.dir === "desc" ? out.reverse() : out;
  }, [rows, sort]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const current = Math.min(page, pageCount);
  const visible = sorted.slice((current - 1) * pageSize, current * pageSize);

  const toggleSort = (key: string) =>
    setSort((s) => (s?.key !== key ? { key, dir: "asc" } : s.dir === "asc" ? { key, dir: "desc" } : null));

  const colSpan = columns.length;

  return (
    <div className="overflow-hidden rounded-xl border border-line">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm" aria-busy={loading}>
          <caption className="sr-only">{caption}</caption>
          <thead className="bg-surface-2 text-xs uppercase tracking-wide text-muted">
            <tr>
              {columns.map((c) => {
                const active = sort?.key === c.key;
                return (
                  <th
                    key={c.key}
                    scope="col"
                    aria-sort={active ? (sort!.dir === "asc" ? "ascending" : "descending") : undefined}
                    className={`px-4 py-3 font-medium ${c.hideOnMobile ? "hidden md:table-cell" : ""}`}
                  >
                    {c.sortable ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(c.key)}
                        className={`inline-flex items-center gap-1 uppercase hover:text-fg ${active ? "text-fg" : ""}`}
                      >
                        {c.header}
                        <span aria-hidden className="font-mono">
                          {active ? (sort!.dir === "asc" ? "↑" : "↓") : "↕"}
                        </span>
                      </button>
                    ) : (
                      c.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: Math.min(pageSize, 5) }, (_, i) => (
                <tr key={i} className="border-t border-line">
                  {columns.map((c) => (
                    <td key={c.key} className={`px-4 py-4 ${c.hideOnMobile ? "hidden md:table-cell" : ""}`}>
                      <div className="h-3 animate-pulse rounded bg-surface-2" style={{ width: `${50 + ((i * 17) % 40)}%` }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan={colSpan} className="px-4 py-12 text-center">
                  <p role="alert" className="text-red-500">
                    {error}
                  </p>
                  {onRetry && (
                    <button type="button" onClick={onRetry} className="btn btn-ghost mt-4 py-1.5! text-sm">
                      Retry
                    </button>
                  )}
                </td>
              </tr>
            ) : visible.length === 0 ? (
              <tr>
                <td colSpan={colSpan} className="px-4 py-12 text-center text-muted">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              visible.map((row) => <Row key={rowKey(row)} row={row} columns={columns} onRowClick={onRowClick} />)
            )}
          </tbody>
        </table>
      </div>

      {!loading && !error && sorted.length > 0 && (
        <nav className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-surface-2/50 px-4 py-3 text-sm" aria-label="Pagination">
          <span className="text-muted">
            {(current - 1) * pageSize + 1}–{Math.min(current * pageSize, sorted.length)} of {sorted.length}
          </span>
          <div className="flex items-center gap-1">
            <button type="button" className="btn btn-ghost px-3! py-1! text-sm" disabled={current === 1} onClick={() => setPage(current - 1)}>
              Prev
            </button>
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                aria-current={n === current ? "page" : undefined}
                className={`h-8 min-w-8 rounded-lg px-2 font-mono text-xs transition ${
                  n === current ? "bg-fg text-bg" : "text-muted hover:bg-surface hover:text-fg"
                }`}
              >
                {n}
              </button>
            ))}
            <button type="button" className="btn btn-ghost px-3! py-1! text-sm" disabled={current === pageCount} onClick={() => setPage(current + 1)}>
              Next
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
