import { DataPanel, Field, SectionHeader } from "@/components/ui";
import type { AlmoxarifadoViewModel } from "@/lib/use-almoxarifado";

export function ItensTab({ app }: { app: AlmoxarifadoViewModel }) {
  return (
    <section className="form-page-grid">
      <form onSubmit={app.handleCreateItem} className="rounded border border-[#cbd8d0] bg-white">
        <SectionHeader title="Cadastro de item" subtitle="Inventário operacional" />
        <div className="grid gap-4 p-4 md:grid-cols-[minmax(0,1fr)_180px]">
          <Field label="Nome">
            <input
              value={app.itemForm.name}
              onChange={(event) => app.setItemForm((current) => ({ ...current, name: event.target.value }))}
              className="form-input"
              placeholder="Ex.: Mesa de reunião"
            />
          </Field>
          <Field label="Quantidade">
            <input
              value={app.itemForm.quantity}
              onChange={(event) => app.setItemForm((current) => ({ ...current, quantity: event.target.value }))}
              className="form-input"
              min="0"
              type="number"
              placeholder="0"
            />
          </Field>
          <Field label="Descrição" className="md:col-span-2">
            <textarea
              value={app.itemForm.description}
              onChange={(event) => app.setItemForm((current) => ({ ...current, description: event.target.value }))}
              className="form-input min-h-24 resize-y"
              placeholder="Descrição curta do item"
            />
          </Field>
          <button
            className="h-11 rounded bg-[#1f6b4f] px-4 text-sm font-bold text-white hover:bg-[#173f35] md:col-span-2"
            type="submit"
          >
            Cadastrar item
          </button>
        </div>
      </form>

      <DataPanel title="Itens cadastrados" subtitle={`${app.filteredItems.length} registros`}>
        <div className="grid gap-3">
          {app.filteredItems.map((item) => (
            <article key={item.id} className="rounded border border-[#dbe5df] bg-[#fbfcfb] p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-bold text-[#10241e]">{item.name}</h3>
                  <p className="mt-1 text-sm text-[#53645c]">{item.description}</p>
                </div>
                <span className="w-fit rounded border border-[#b9c8be] bg-white px-3 py-1 text-sm font-bold text-[#173f35]">
                  {item.quantity} un.
                </span>
              </div>
            </article>
          ))}
        </div>
      </DataPanel>
    </section>
  );
}
