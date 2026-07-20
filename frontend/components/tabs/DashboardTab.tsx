import { DataPanel, Metric, SectionHeader } from "@/components/ui";
import { formatCurrency } from "@/lib/formatters";
import { transferenciaStatusLabels } from "@/lib/mock-data";
import type { AlmoxarifadoViewModel } from "@/lib/use-almoxarifado";

export function DashboardTab({ app }: { app: AlmoxarifadoViewModel }) {
  return (
    <section className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
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

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <section className="rounded border border-[#cbd8d0] bg-white">
          <SectionHeader title="Movimento do almoxarifado" subtitle="Resumo dos produtos em acompanhamento" />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead className="bg-[#eef5f1] text-[#315245]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Produto</th>
                  <th className="px-4 py-3 font-semibold">Descrição</th>
                  <th className="px-4 py-3 text-right font-semibold">Quantidade</th>
                </tr>
              </thead>
              <tbody>
                {app.filteredProdutos.slice(0, 5).map((produto) => (
                  <tr key={produto.id} className="border-t border-[#e1e8e4]">
                    <td className="px-4 py-3 font-semibold text-[#10241e]">{produto.nome}</td>
                    <td className="px-4 py-3 text-[#53645c]">{produto.descricao}</td>
                    <td className="px-4 py-3 text-right font-bold text-[#173f35]">{produto.quantidade}</td>
                  </tr>
                ))}
                {!app.filteredProdutos.length && (
                  <tr>
                    <td className="px-4 py-8 text-center text-[#53645c]" colSpan={3}>
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
          <div className="divide-y divide-[#e1e8e4]">
            {app.transferencias.slice(0, 4).map((transferencia) => {
              const itens = app.itensTransferenciaByPedido.get(transferencia.id) ?? [];
              const primeiroProduto = app.produtoById.get(itens[0]?.produto);

              return (
                <div key={transferencia.id} className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[#10241e]">
                      {primeiroProduto?.nome ?? "Pedido de transferência"}
                    </p>
                    <p className="text-sm text-[#53645c]">
                      {app.secretariaById.get(transferencia.secretariaId)?.sigla ?? "Secretaria"} · {itens.length}{" "}
                      {itens.length === 1 ? "produto" : "produtos"}
                    </p>
                  </div>
                  <span className="shrink-0 rounded border border-[#d5b35c] bg-[#fff7db] px-2 py-1 text-xs font-bold text-[#6d5510]">
                    {transferenciaStatusLabels[transferencia.status]}
                  </span>
                </div>
              );
            })}
            {!app.transferencias.length && (
              <p className="py-8 text-center text-sm text-[#53645c]">Nenhuma transferência cadastrada.</p>
            )}
          </div>
        </DataPanel>
      </div>
    </section>
  );
}
