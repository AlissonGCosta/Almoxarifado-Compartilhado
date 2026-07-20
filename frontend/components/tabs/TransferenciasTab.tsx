import { DataPanel, Field, SectionHeader } from "@/components/ui";
import { formatCurrency } from "@/lib/formatters";
import { transferenciaStatusLabels, transferenciaStatuses } from "@/lib/mock-data";
import type { TransferenciaStatus } from "@/lib/types";
import type { AlmoxarifadoViewModel } from "@/lib/use-almoxarifado";

export function TransferenciasTab({ app }: { app: AlmoxarifadoViewModel }) {
  const canSubmit = app.produtos.length > 0 && app.usuarios.length > 0 && app.secretarias.length > 0;

  return (
    <section className="form-page-grid">
      <form onSubmit={app.handleCreateTransferencia} className="rounded border border-[#cbd8d0] bg-white">
        <SectionHeader
          title="Novo pedido de transferência"
          subtitle="Solicitação de movimentação de produtos entre unidades municipais"
        />
        <div className="grid gap-4 p-4 md:grid-cols-2">
          <Field label="Razão social" className="md:col-span-2">
            <textarea
              value={app.transferenciaForm.razaoSocial}
              onChange={(event) =>
                app.setTransferenciaForm((current) => ({ ...current, razaoSocial: event.target.value }))
              }
              className="form-input min-h-20 resize-y"
              minLength={40}
              placeholder="Finalidade institucional da transferência"
              required
            />
            <span className="text-xs text-[#66766f]">Mínimo de 40 caracteres</span>
          </Field>
          <Field label="Descrição do pedido" className="md:col-span-2">
            <textarea
              value={app.transferenciaForm.descricaoPedido}
              onChange={(event) =>
                app.setTransferenciaForm((current) => ({ ...current, descricaoPedido: event.target.value }))
              }
              className="form-input min-h-24 resize-y"
              minLength={40}
              placeholder="Justificativa e destino dos materiais"
              required
            />
            <span className="text-xs text-[#66766f]">Mínimo de 40 caracteres</span>
          </Field>
          <Field label="Solicitante">
            <select
              value={app.transferenciaForm.usuarioId}
              onChange={(event) =>
                app.setTransferenciaForm((current) => ({ ...current, usuarioId: event.target.value }))
              }
              className="form-input"
              disabled={!app.usuarios.length}
              required
            >
              {!app.usuarios.length && <option value="">Nenhum usuário cadastrado</option>}
              {app.usuarios.map((usuario) => (
                <option key={usuario.id} value={usuario.id}>
                  {usuario.nome} · {usuario.siglaSecretaria}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Secretaria solicitante">
            <select
              value={app.transferenciaForm.secretariaId}
              onChange={(event) =>
                app.setTransferenciaForm((current) => ({ ...current, secretariaId: event.target.value }))
              }
              className="form-input"
              disabled={!app.secretarias.length}
              required
            >
              {!app.secretarias.length && <option value="">Nenhuma secretaria cadastrada</option>}
              {app.secretarias.map((secretaria) => (
                <option key={secretaria.id} value={secretaria.id}>
                  {secretaria.sigla} - {secretaria.nome}
                </option>
              ))}
            </select>
          </Field>

          <fieldset className="grid gap-3 border-t border-[#e1e8e4] pt-4 md:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <legend className="text-sm font-bold text-[#315245]">Produtos solicitados</legend>
              <button
                onClick={app.handleAddTransferenciaItem}
                className="h-9 rounded border border-[#2d6f58] bg-white px-3 text-sm font-bold text-[#1f6b4f] hover:bg-[#eef5f1] disabled:cursor-not-allowed disabled:opacity-60"
                type="button"
                disabled={!app.produtos.length}
              >
                + Adicionar produto
              </button>
            </div>

            {app.transferenciaForm.itens.map((item, index) => (
              <div
                key={`${index}-${item.produtoId}`}
                className="grid gap-3 border-b border-[#e1e8e4] pb-3 sm:grid-cols-[minmax(0,1fr)_180px_40px]"
              >
                <Field label={`Produto ${index + 1}`}>
                  <select
                    value={item.produtoId}
                    onChange={(event) => app.handleTransferenciaItemChange(index, "produtoId", event.target.value)}
                    className="form-input"
                    disabled={!app.produtos.length}
                    required
                  >
                    {!app.produtos.length && <option value="">Nenhum produto cadastrado</option>}
                    {app.produtos.map((produto) => (
                      <option key={produto.id} value={produto.id}>
                        {produto.nome} ({produto.quantidade} un.)
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Quantidade">
                  <input
                    value={item.quantidade}
                    onChange={(event) => app.handleTransferenciaItemChange(index, "quantidade", event.target.value)}
                    className="form-input"
                    min="0.01"
                    step="0.01"
                    type="number"
                    placeholder="0"
                    required
                  />
                </Field>
                <button
                  onClick={() => app.handleRemoveTransferenciaItem(index)}
                  className="mt-auto h-10 w-10 rounded border border-[#b84a42] bg-white text-xl font-bold text-[#8d2f29] hover:bg-[#fff1ef]"
                  type="button"
                  title="Remover produto"
                  aria-label={`Remover produto ${index + 1}`}
                >
                  ×
                </button>
              </div>
            ))}
          </fieldset>

          <button
            className="h-11 rounded bg-[#1f6b4f] px-4 text-sm font-bold text-white hover:bg-[#173f35] disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2"
            type="submit"
            disabled={!canSubmit || app.pendingAction === "transferencia"}
          >
            {app.pendingAction === "transferencia" ? "Cadastrando..." : "Cadastrar transferência"}
          </button>
        </div>
      </form>

      <DataPanel
        title="Pedidos de transferência"
        subtitle={`${app.filteredTransferencias.length} registros · itens sincronizados pela API`}
      >
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={() => app.setTransferenciaStatusFilter("TODOS")}
            className={`h-9 rounded border px-3 text-sm font-semibold ${
              app.transferenciaStatusFilter === "TODOS"
                ? "border-[#173f35] bg-[#173f35] text-white"
                : "border-[#cbd8d0] bg-white text-[#27443a]"
            }`}
            type="button"
          >
            Todos
          </button>
          {transferenciaStatuses.map((status) => (
            <button
              key={status}
              onClick={() => app.setTransferenciaStatusFilter(status)}
              className={`h-9 rounded border px-3 text-sm font-semibold ${
                app.transferenciaStatusFilter === status
                  ? "border-[#173f35] bg-[#173f35] text-white"
                  : "border-[#cbd8d0] bg-white text-[#27443a]"
              }`}
              type="button"
            >
              {transferenciaStatusLabels[status]}
            </button>
          ))}
        </div>

        <div className="grid gap-3">
          {!app.filteredTransferencias.length && (
            <p className="py-8 text-center text-sm text-[#53645c]">Nenhuma transferência encontrada.</p>
          )}
          {app.filteredTransferencias.map((transferencia) => {
            const usuario = app.usuarioById.get(transferencia.usuarioId);
            const secretaria = app.secretariaById.get(transferencia.secretariaId);
            const itens = app.itensTransferenciaByPedido.get(transferencia.id) ?? [];
            const valor = itens.reduce((total, item) => {
              const produto = app.produtoById.get(item.produto);
              return total + item.quantidade * (produto?.preco ?? 0);
            }, 0);

            return (
              <article key={transferencia.id} className="rounded border border-[#dbe5df] bg-[#fbfcfb] p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <h3 className="font-bold text-[#10241e]">{transferencia.razaoSocial}</h3>
                    <p className="mt-2 text-sm text-[#53645c]">{transferencia.descricaoPedido}</p>
                    <p className="mt-3 text-xs font-semibold uppercase text-[#2d6f58]">
                      {secretaria?.sigla ?? "Sem secretaria"} · {usuario?.nome ?? "Usuário não identificado"}
                    </p>
                  </div>
                  <label className="grid shrink-0 gap-1 text-xs font-bold text-[#315245]">
                    Status
                    <select
                      value={transferencia.status}
                      onChange={(event) =>
                        void app.handleTransferenciaStatusChange(
                          transferencia.id,
                          event.target.value as TransferenciaStatus,
                        )
                      }
                      className="form-input min-w-40 bg-white"
                      disabled={app.pendingAction === `transferencia-status-${transferencia.id}`}
                    >
                      {transferenciaStatuses.map((status) => (
                        <option key={status} value={status}>
                          {transferenciaStatusLabels[status]}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="mt-4 overflow-x-auto border-t border-[#e1e8e4] pt-3">
                  <table className="w-full min-w-[520px] text-left text-sm">
                    <thead className="text-xs uppercase text-[#53645c]">
                      <tr>
                        <th className="pb-2 font-semibold">Produto</th>
                        <th className="pb-2 text-right font-semibold">Quantidade</th>
                        <th className="pb-2 text-right font-semibold">Valor estimado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itens.map((item) => {
                        const produto = app.produtoById.get(item.produto);

                        return (
                          <tr key={item.id} className="border-t border-[#e1e8e4]">
                            <td className="py-2 font-semibold text-[#10241e]">
                              {produto?.nome ?? `Produto ${item.produto}`}
                            </td>
                            <td className="py-2 text-right text-[#53645c]">{item.quantidade} un.</td>
                            <td className="py-2 text-right font-semibold text-[#173f35]">
                              {formatCurrency(item.quantidade * (produto?.preco ?? 0))}
                            </td>
                          </tr>
                        );
                      })}
                      {!itens.length && (
                        <tr>
                          <td className="py-3 text-[#53645c]" colSpan={3}>
                            Nenhum item vinculado a este pedido.
                          </td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot>
                      <tr className="border-t border-[#b9c8be]">
                        <td className="pt-3 font-bold text-[#315245]" colSpan={2}>
                          Total estimado
                        </td>
                        <td className="pt-3 text-right font-bold text-[#173f35]">{formatCurrency(valor)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {transferencia.motivoCancelamento && (
                  <p className="mt-4 border-l-4 border-[#b84a42] bg-[#fff1ef] px-3 py-2 text-sm text-[#8d2f29]">
                    {transferencia.motivoCancelamento}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      </DataPanel>
    </section>
  );
}
