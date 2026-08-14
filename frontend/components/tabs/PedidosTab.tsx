import { DataPanel, Field, SectionHeader } from "@/components/ui";
import { formatCurrency } from "@/lib/formatters";
import { pedidoStatuses, statusLabels } from "@/lib/constants";
import type { AlmoxarifadoViewModel } from "@/lib/use-almoxarifado";

export function PedidosTab({ app }: { app: AlmoxarifadoViewModel }) {
 return (
 <section className="form-page-grid">
 <form onSubmit={app.handleCreatePedido} className="border-2 border-black bg-white text-black">
 <SectionHeader title="Novo pedido de compra" subtitle="Solicitação vinculada a produto, usuário e secretaria" />
 <div className="grid gap-4 p-4 md:grid-cols-2">
 <Field label="Produto">
 <select
 value={app.pedidoForm.idProduto}
 onChange={(event) => app.handlePedidoProdutoChange(event.target.value)}
 className="form-input"
 disabled={!app.produtos.length}
 required
 >
 {!app.produtos.length && <option value="">Nenhum produto cadastrado</option>}
 {app.produtos.map((produto) => (
 <option key={produto.id} value={produto.id}>
 {produto.nome}
 </option>
 ))}
 </select>
 </Field>
 <Field label="Nome do produto">
 <input
 value={app.pedidoForm.nomeProduto}
 onChange={(event) => app.setPedidoForm((current) => ({ ...current, nomeProduto: event.target.value }))}
 className="form-input"
 placeholder="Produto solicitado"
 required
 />
 </Field>
 <Field label="Descrição do produto" className="md:col-span-2">
 <textarea
 value={app.pedidoForm.descricaoProduto}
 onChange={(event) =>
 app.setPedidoForm((current) => ({ ...current, descricaoProduto: event.target.value }))
 }
 className="form-input min-h-20 resize-y"
 placeholder="Detalhes do produto"
 />
 </Field>
 <Field label="Justificativa do pedido" className="md:col-span-2">
 <textarea
 value={app.pedidoForm.descricaoPedido}
 onChange={(event) =>
 app.setPedidoForm((current) => ({ ...current, descricaoPedido: event.target.value }))
 }
 className="form-input min-h-24 resize-y"
 placeholder="Motivo da solicitação"
 />
 </Field>
 <div className="grid gap-4 sm:grid-cols-2 md:col-span-2">
 <Field label="Quantidade">
 <input
 value={app.pedidoForm.quantidade}
 onChange={(event) => app.setPedidoForm((current) => ({ ...current, quantidade: event.target.value }))}
 className="form-input"
 min="0.01"
 step="0.01"
 type="number"
 placeholder="0"
 required
 />
 </Field>
 <Field label="Preço estimado">
 <input
 value={app.pedidoForm.preco}
 onChange={(event) => app.setPedidoForm((current) => ({ ...current, preco: event.target.value }))}
 className="form-input"
 min="0"
 step="0.01"
 type="number"
 placeholder="0,00"
 required
 />
 </Field>
 </div>
 <Field label="Solicitante">
 <select
 value={app.pedidoForm.idUsuario}
 onChange={(event) => app.setPedidoForm((current) => ({ ...current, idUsuario: event.target.value }))}
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
 <Field label="Secretaria">
 <select
 value={app.pedidoForm.idSecretaria}
 onChange={(event) => app.setPedidoForm((current) => ({ ...current, idSecretaria: event.target.value }))}
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
 <button
 className="h-11 bg-black text-white hover:bg-neutral-800 px-4 text-sm font-bold disabled:cursor-wait disabled:opacity-60 md:col-span-2 shadow-[4px_4px_0_0_#000] transition-transform hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#000]"
 disabled={
 app.pendingAction === "pedido" ||
 !app.produtos.length ||
 !app.usuarios.length ||
 !app.secretarias.length
 }
 type="submit"
 >
 {app.pendingAction === "pedido" ? "Cadastrando..." : "Cadastrar pedido"}
 </button>
 </div>
 </form>

 <DataPanel title="Pedidos de compra" subtitle={`${app.filteredPedidos.length} registros`}>
 <div className="mb-4 flex flex-wrap gap-2">
 <button
 onClick={() => app.setPedidoStatusFilter("TODOS")}
 className={`h-9 border-2 px-3 text-sm font-semibold ${
 app.pedidoStatusFilter === "TODOS"
 ? "border-black bg-black text-white"
 : "border-black bg-white text-black"
 }`}
 type="button"
 >
 Todos
 </button>
 {pedidoStatuses.map((status) => (
 <button
 key={status}
 onClick={() => app.setPedidoStatusFilter(status)}
 className={`h-9 border-2 px-3 text-sm font-semibold ${
 app.pedidoStatusFilter === status
 ? "border-black bg-black text-white"
 : "border-black bg-white text-black"
 }`}
 type="button"
 >
 {statusLabels[status]}
 </button>
 ))}
 </div>

 <div className="grid gap-3">
 {!app.filteredPedidos.length && (
 <p className="py-8 text-center text-sm text-black">Nenhum pedido de compra encontrado.</p>
 )}
 {app.filteredPedidos.map((pedido) => {
 const usuario = app.usuarioById.get(pedido.idUsuario);
 const secretaria = app.secretariaById.get(pedido.idSecretaria);

 return (
 <article key={pedido.idPedidoCompra} className="border-2 border-black bg-white text-black p-4">
 <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
 <div>
 <div className="flex flex-wrap items-center gap-2">
 <h3 className="font-bold text-black">{pedido.nomeProduto}</h3>
 <span className="border-2 border-black bg-white px-2 py-1 text-xs font-bold text-black">
 {statusLabels[pedido.status]}
 </span>
 </div>
 <p className="mt-2 text-sm text-black">
 {pedido.descricaoPedido || pedido.descricaoProduto || "Sem descrição informada."}
 </p>
 <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-black">
 {secretaria?.sigla ?? "SEM SECRETARIA"} · {usuario?.nome ?? "Usuário não identificado"}
 </p>
 </div>
 <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col lg:items-end">
 <div className="border-2 border-black bg-white px-3 py-2 text-sm font-bold text-black">
 {pedido.quantidade} un. · {formatCurrency(pedido.preco)}
 </div>
 </div>
 </div>
 </article>
 );
 })}
 </div>
 </DataPanel>
 </section>
 );
}
