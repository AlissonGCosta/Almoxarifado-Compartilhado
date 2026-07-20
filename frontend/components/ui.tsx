import type { ReactNode } from "react";

export function Metric({
  title,
  value,
  note,
  tone = "default",
}: {
  title: string;
  value: string;
  note: string;
  tone?: "default" | "warn";
}) {
  return (
    <article className="min-h-32 rounded-lg border border-[#30323d] bg-[#171821] p-4">
      <span className={`block h-1 w-8 rounded-full ${tone === "warn" ? "bg-[#feb95a]" : "bg-[#a9dfd8]"}`} />
      <p className="mt-4 text-xs font-semibold text-[#9a9ba4]">{title}</p>
      <div className="mt-2 flex items-end justify-between gap-3">
        <strong className={`text-3xl font-black ${tone === "warn" ? "text-[#feb95a]" : "text-white"}`}>
          {value}
        </strong>
        <span className="max-w-28 text-right text-xs font-semibold leading-5 text-[#a9dfd8]">{note}</span>
      </div>
    </article>
  );
}

export function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="border-b border-[#30323d] px-4 py-4 sm:px-5">
      <h2 className="text-base font-bold text-white">{title}</h2>
      <p className="mt-1 text-xs text-[#9a9ba4]">{subtitle}</p>
    </header>
  );
}

export function DataPanel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <section className="app-panel rounded-lg border border-[#30323d] bg-[#21222d]">
      <SectionHeader title={title} subtitle={subtitle} />
      <div className="p-4">{children}</div>
    </section>
  );
}

export function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`grid gap-2 ${className}`.trim()}>
      <span className="text-xs font-bold text-[#c9c9cf]">{label}</span>
      {children}
    </label>
  );
}
