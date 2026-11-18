import type { Metadata } from "next";
import Footer from "@/components/Footer";
import { ArrowRightIcon } from "@/components/Icons";
import Navbar from "@/components/Navbar";
import DemoCard from "@/components/playground/DemoCard";
import EmployeeDirectory from "@/components/playground/EmployeeDirectory";
import FormBuilder from "@/components/playground/FormBuilder";

export const metadata: Metadata = {
  title: "Component Playground",
  description:
    "Live, interactive React components by Aryan Pathak: a reusable data table with API integration, an accessible modal, and a schema-driven dynamic form builder.",
  alternates: { canonical: "/playground" },
};

const TABLE_CODE = `
const { data, loading, error, refetch } = useFetch<Res>(url); // aborts stale requests
const q = useDebounce(search, 300);

<DataTable<Employee>
  caption="Employee directory"
  columns={COLUMNS}            // sortable, custom render, responsive
  rows={data?.data ?? []}
  rowKey={(e) => e.id}
  loading={loading}            // skeleton rows
  error={error}                // error state + retry
  onRetry={refetch}
  emptyMessage="No employees match your filters."
  onRowClick={openEmployee}    // useCallback → memoized rows skip re-renders
/>

<Modal open={!!selected} onClose={close} title={selected.name} footer={...}>
  {/* native <dialog>: focus trap, Esc, inert background, focus restore */}
</Modal>
`;

const FORM_CODE = `
const fields: FieldSchema[] = [
  { name: "fullName", label: "Full name", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "experience", label: "Years of experience", type: "number", min: 0, max: 40 },
  { name: "role", label: "Position", type: "select", options: ["React Developer", "UI Engineer"] },
  { name: "terms", label: "I agree to the privacy policy", type: "checkbox", required: true },
];

// One component renders any form — labels, types and rules all come from config.
<DynamicForm fields={fields} submitLabel="Apply now" onSubmit={(values) => api.post("/apply", values)} />
`;

export default function PlaygroundPage() {
  return (
    <>
      <Navbar />
      <main className="container-x pt-28 pb-20 sm:pt-36">
        <header className="max-w-3xl">
          <p className="text-sm font-medium text-muted">Component Playground</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">
            Don&apos;t take my word for it — try the components.
          </h1>
          <p className="mt-5 text-lg text-muted">
            These are the kinds of reusable building blocks I build at work: data tables, modals and config-driven forms,
            written in React + TypeScript with no UI library. Everything here is live, so click around, break things, and
            switch to the <span className="font-mono text-fg">Code</span> tab to see how they&apos;re used.
          </p>
          <nav className="mt-6 flex flex-wrap gap-3" aria-label="Demos">
            <a href="#directory" className="btn btn-ghost text-sm">
              Data table + API <ArrowRightIcon className="h-4 w-4" />
            </a>
            <a href="#form-builder" className="btn btn-ghost text-sm">
              Dynamic form builder <ArrowRightIcon className="h-4 w-4" />
            </a>
          </nav>
        </header>

        <div className="mt-14 space-y-10">
          <DemoCard
            id="directory"
            index="01"
            title="Employee Directory"
            description="A generic DataTable fed by a real REST endpoint (/api/demo/employees). Search is debounced and runs on the server; sorting and pagination run on the client. Toggle the network conditions to see the loading, error and empty states, and click a row to open the modal."
            concepts={["DataTable<T>", "useFetch + AbortController", "useDebounce", "React.memo", "useCallback", "<dialog> modal", "a11y"]}
            code={TABLE_CODE}
          >
            <EmployeeDirectory />
          </DemoCard>

          <DemoCard
            id="form-builder"
            index="02"
            title="Dynamic Form Builder"
            description="Dynamic labels and forms: the whole form is rendered from a JSON schema. Rename labels, change field types, toggle required, or add and remove fields, and the live form re-renders instantly with matching validation."
            concepts={["Schema-driven UI", "Dynamic labels", "Controlled inputs", "Field validation", "Derived state"]}
            code={FORM_CODE}
          >
            <FormBuilder />
          </DemoCard>
        </div>
      </main>
      <Footer />
    </>
  );
}
