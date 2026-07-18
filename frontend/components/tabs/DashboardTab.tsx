import { DataPanel, Metric, SectionHeader } from "@/components/ui";
import { formatCurrency } from "@/lib/formatters";
import { statusLabels } from "@/lib/mock-data";
import type { AlmoxarifadoViewModel } from "@/lib/use-almoxarifado";

export function DashboardTab({ app }: { app: AlmoxarifadoViewModel }) {
  return (
    <section className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Metric title="Itens cadastrados" value={app.items.length.toString()} note={`${app.totalItems} unidades`} />
        <Metric title="Pedidos" value={app.pedidos.length.toString()} note={`${app.pendingPedidos} pendentes`} />
        <Metric title="Secretarias" value={app.secretarias.length.toString()} note="Órgãos participantes" />
        <Metric title="Usuários" value={app.usuarios.length.toString()} note="Acessos operacionais" />
        <Metric title="Estoque baixo" value={app.lowStock.toString()} note="Até 15 unidades" tone="warn" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <section className="rounded border border-[#cbd8d0] bg-white">
          <SectionHeader title="Movimento do almoxarifado" subtitle="Resumo dos itens em acompanhamento" />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead className="bg-[#eef5f1] text-[#315245]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Item</th>
                  <th className="px-4 py-3 font-semibold">Descrição</th>
                  <th className="px-4 py-3 text-right font-semibold">Quantidade</th>
                </tr>
              </thead>
              <tbody>
                {app.filteredItems.slice(0, 5).map((item) => (
                  <tr key={item.id} className="border-t border-[#e1e8e4]">
                    <td className="px-4 py-3 font-semibold text-[#10241e]">{item.name}</td>
                    <td className="px-4 py-3 text-[#53645c]">{item.description}</td>
                    <td className="px-4 py-3 text-right font-bold text-[#173f35]">{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <DataPanel title="Pedidos recentes" subtitle={`${formatCurrency(app.totalPedidoValue)} em solicitações`}>
          <div className="divide-y divide-[#e1e8e4]">
            {app.pedidos.slice(0, 4).map((pedido) => (
              <div key={pedido.idPedidoCompra} className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0">
                <div>
                  <p className="font-semibold text-[#10241e]">{pedido.nomeProduto}</p>
                  <p className="text-sm text-[#53645c]">
                    {app.secretariaById.get(pedido.idSecretaria)?.sigla ?? "Secretaria"} ·{" "}
                    {formatCurrency(pedido.preco)}
                  </p>
                </div>
                <span className="rounded border border-[#d5b35c] bg-[#fff7db] px-2 py-1 text-xs font-bold text-[#6d5510]">
                  {statusLabels[pedido.status]}
                </span>
              </div>
            ))}
          </div>
        </DataPanel>
      </div>
    </section>
  );
}
