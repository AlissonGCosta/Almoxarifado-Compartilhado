import { DataPanel, Metric, SectionHeader } from "@/components/ui";
import { formatCurrency } from "@/lib/formatters";
import { transferenciaStatusLabels } from "@/lib/mock-data";
import type { AlmoxarifadoViewModel } from "@/lib/use-almoxarifado";

export function DashboardTab({ app }: { app: AlmoxarifadoViewModel }) {
  return (
    <section className="grid gap-6">
      <section className="app-panel rounded-lg border border-[#30323d] bg-[#21222d] p-4 sm:p-5">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <Metric title="Produtos cadastrados" value={app.produtos.length.toString()} note={`${app.totalItems} unidades`} />
          <Metric
            title="Transferências"
            value={app.transferencias.length.toString()}
            note={`${app.activeTransferencias} em andamento`}
          />
          <Metric title="Secretarias" value={app.secretarias.length.toString()} note="Órgãos participantes" />
          <Metric title="Usuários" value={app.usuarios.length.toString()} note="Acessos operacionais" />
          <Metric title="Estoque baixo" value={app.lowStock.toString()} note="Até 15 unidades" tone="warn" />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <section className="app-panel rounded-lg border border-[#30323d] bg-[#21222d]">
          <SectionHeader title="Movimento do almoxarifado" subtitle="Resumo dos produtos em acompanhamento" />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead className="bg-[#1b1c25] text-[#9a9ba4]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Produto</th>
                  <th className="px-4 py-3 font-semibold">Descrição</th>
                  <th className="px-4 py-3 text-right font-semibold">Quantidade</th>
                </tr>
              </thead>
              <tbody>
                {app.filteredProdutos.slice(0, 5).map((produto) => (
                  <tr key={produto.id} className="border-t border-[#30323d] transition-colors hover:bg-[#252630]">
                    <td className="px-4 py-3 font-semibold text-white">{produto.nome}</td>
                    <td className="px-4 py-3 text-[#9a9ba4]">{produto.descricao}</td>
                    <td className="px-4 py-3 text-right font-bold text-[#a9dfd8]">{produto.quantidade}</td>
                  </tr>
                ))}
                {!app.filteredProdutos.length && (
                  <tr>
                    <td className="px-4 py-8 text-center text-[#9a9ba4]" colSpan={3}>
                      Nenhum produto encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <DataPanel
          title="Transferências recentes"
          subtitle={`${formatCurrency(app.totalTransferenciaValue)} em materiais`}
        >
          <div className="divide-y divide-[#30323d]">
            {app.transferencias.slice(0, 4).map((transferencia) => {
              const itens = app.itensTransferenciaByPedido.get(transferencia.id) ?? [];
              const primeiroProduto = app.produtoById.get(itens[0]?.produto);

              return (
                <div key={transferencia.id} className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white">
                      {primeiroProduto?.nome ?? "Pedido de transferência"}
                    </p>
                    <p className="text-sm text-[#9a9ba4]">
                      {app.secretariaById.get(transferencia.secretariaId)?.sigla ?? "Secretaria"} · {itens.length}{" "}
                      {itens.length === 1 ? "produto" : "produtos"}
                    </p>
                  </div>
                  <span className="shrink-0 rounded border border-[#feb95a]/40 bg-[#feb95a]/10 px-2 py-1 text-xs font-bold text-[#feb95a]">
                    {transferenciaStatusLabels[transferencia.status]}
                  </span>
                </div>
              );
            })}
            {!app.transferencias.length && (
              <p className="py-8 text-center text-sm text-[#9a9ba4]">Nenhuma transferência cadastrada.</p>
            )}
          </div>
        </DataPanel>
      </div>
    </section>
  );
}
