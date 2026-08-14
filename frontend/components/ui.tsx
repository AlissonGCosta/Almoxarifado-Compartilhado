import { motion } from "motion/react";
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
    <motion.article 
      whileHover={{ y: -4, x: -4, boxShadow: "8px 8px 0 0 #000" }}
      transition={{ duration: 0.2 }}
      className={`min-h-32 border-2 border-black p-6 shadow-[4px_4px_0_0_#000] ${
        tone === "warn" ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <span className={`block h-1 w-12 ${tone === "warn" ? "bg-[#feb95a]" : "bg-black"}`} />
      <p className={`mt-4 text-sm font-bold ${tone === "warn" ? "text-neutral-300" : "text-neutral-600"}`}>
        {title}
      </p>
      <div className="mt-2 flex items-end justify-between gap-3">
        <strong className={`text-5xl font-bold ${tone === "warn" ? "text-[#feb95a]" : "text-black"}`}>
          {value}
        </strong>
        <span className={`max-w-28 text-right text-sm font-bold leading-5 ${tone === "warn" ? "text-neutral-300" : "text-neutral-500"}`}>
          {note}
        </span>
      </div>
    </motion.article>
  );
}

export function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="border-b-2 border-black px-6 py-6 sm:px-8">
      <h2 className="text-3xl font-bold md:text-4xl">{title}</h2>
      <p className="mt-2 text-sm font-bold text-neutral-600">{subtitle}</p>
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
    <section className="border-2 border-black bg-white text-black shadow-[8px_8px_0_0_#000]">
      <SectionHeader title={title} subtitle={subtitle} />
      <div className="p-6 sm:p-8">{children}</div>
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
      <span className="text-sm font-bold text-black uppercase tracking-wider">{label}</span>
      {children}
    </label>
  );
}
