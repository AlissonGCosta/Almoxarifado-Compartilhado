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
    <article className="rounded border border-[#cbd8d0] bg-white p-5">
      <p className="text-sm font-semibold text-[#53645c]">{title}</p>
      <div className="mt-3 flex items-end justify-between gap-4">
        <strong className={`text-4xl font-black ${tone === "warn" ? "text-[#986b00]" : "text-[#173f35]"}`}>
          {value}
        </strong>
        <span className="text-right text-sm font-semibold text-[#315245]">{note}</span>
      </div>
    </article>
  );
}

export function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="border-b border-[#e1e8e4] px-4 py-4">
      <h2 className="text-lg font-bold text-[#10241e]">{title}</h2>
      <p className="mt-1 text-sm text-[#53645c]">{subtitle}</p>
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
    <section className="rounded border border-[#cbd8d0] bg-white">
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
      <span className="text-sm font-bold text-[#315245]">{label}</span>
      {children}
    </label>
  );
}
