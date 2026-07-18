import { planejamento } from "@/lib/mock-data";

export function PlanejamentoTab() {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      {planejamento.map((item) => (
        <article key={item.titulo} className="rounded border border-[#cbd8d0] bg-white p-5">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-lg font-bold text-[#10241e]">{item.titulo}</h2>
            <span className="rounded border border-[#b9c8be] bg-[#f8faf8] px-2 py-1 text-xs font-bold text-[#315245]">
              {item.status}
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-[#53645c]">{item.detalhe}</p>
        </article>
      ))}
    </section>
  );
}
