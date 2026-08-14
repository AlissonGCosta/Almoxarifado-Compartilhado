import { DataPanel, Field, SectionHeader } from "@/components/ui";
import { formatCurrency } from "@/lib/formatters";
import {
 produtoStatusLabels,
 produtoStatuses,
 produtoTypeLabels,
 produtoTypes,
} from "@/lib/constants";
import type { AlmoxarifadoViewModel } from "@/lib/use-almoxarifado";

export function ItensTab({ app }: { app: AlmoxarifadoViewModel }) {
 const canSubmit = app.usuarios.length > 0 && app.secretarias.length > 0;

 return (
 <section className="form-page-grid">
 <form onSubmit={app.handleCreateProduto} className="border-2 border-black bg-white text-black">
 <SectionHeader
 title={app.editingProdutoId ? "Editar produto" : "Cadastro de produto"}
 subtitle="Inventário operacional vinculado a responsável e secretaria"
 />
 <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
 <Field label="Nome" className="md:col-span-2">
 <input
 value={app.produtoForm.nome}
 onChange={(event) => app.setProdutoForm((current) => ({ ...current, nome: event.target.value }))}
 className="form-input"
 placeholder="Ex.: Mesa de reunião"
 required
 />
 </Field>
 <Field label="Quantidade">
 <input
 value={app.produtoForm.quantidade}
 onChange={(event) => app.setProdutoForm((current) => ({ ...current, quantidade: event.target.value }))}
 className="form-input"
 min="0.01"
 step="0.01"
 type="number"
 placeholder="0"
 required
 />
 </Field>
 <Field label="Preço unitário">
 <input
 value={app.produtoForm.preco}
 onChange={(event) => app.setProdutoForm((current) => ({ ...current, preco: event.target.value }))}
 className="form-input"
 min="0.01"
 step="0.01"
 type="number"
 placeholder="0,00"
 required
 />
 </Field>
 <Field label="Descrição" className="md:col-span-2 xl:col-span-4">
 <textarea
 value={app.produtoForm.descricao}
 onChange={(event) => app.setProdutoForm((current) => ({ ...current, descricao: event.target.value }))}
 className="form-input min-h-24 resize-y"
 placeholder="Descrição curta do produto"
 required
 />
 </Field>
 <Field label="Estado">
 <select
 value={app.produtoForm.status}
 onChange={(event) =>
 app.setProdutoForm((current) => ({
 ...current,
 status: event.target.value as typeof current.status,
 }))
 }
 className="form-input"
 >
 {produtoStatuses.map((status) => (
 <option key={status} value={status}>
 {produtoStatusLabels[status]}
 </option>
 ))}
 </select>
 </Field>
 <Field label="Origem">
 <select
 value={app.produtoForm.type}
 onChange={(event) =>
 app.setProdutoForm((current) => ({ ...current, type: event.target.value as typeof current.type }))
 }
 className="form-input"
 >
 {produtoTypes.map((type) => (
 <option key={type} value={type}>
 {produtoTypeLabels[type]}
 </option>
 ))}
 </select>
 </Field>
 <Field label="Responsável pelo cadastro">
 <select
 value={app.produtoForm.usuarioCadastrado}
 onChange={(event) =>
 app.setProdutoForm((current) => ({ ...current, usuarioCadastrado: event.target.value }))
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
 <Field label="Secretaria responsável">
 <select
 value={app.produtoForm.secretariaCadastrada}
 onChange={(event) =>
 app.setProdutoForm((current) => ({ ...current, secretariaCadastrada: event.target.value }))
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
 <div className="flex flex-col gap-2 md:col-span-2 sm:flex-row xl:col-span-4">
 <button
 className="h-11 flex-1 bg-black text-white hover:bg-neutral-800 px-4 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-60 shadow-[4px_4px_0_0_#000] transition-transform hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#000]"
 type="submit"
 disabled={!canSubmit || app.pendingAction === "produto"}
 >
 {app.pendingAction === "produto"
 ? "Salvando..."
 : app.editingProdutoId
 ? "Salvar alterações"
 : "Cadastrar produto"}
 </button>
 {app.editingProdutoId && (
 <button
 onClick={app.handleCancelProdutoEdit}
 className="h-11 border-2 border-black bg-white px-4 text-sm font-bold text-black hover:bg-neutral-100"
 type="button"
 >
 Cancelar edição
 </button>
 )}
 </div>
 </div>
 </form>

 <DataPanel title="Produtos cadastrados" subtitle={`${app.filteredProdutos.length} registros`}>
 <div className="grid gap-3">
 {!app.filteredProdutos.length && (
 <p className="py-8 text-center text-sm text-black">Nenhum produto encontrado.</p>
 )}
 {app.filteredProdutos.map((produto) => {
 const usuario = app.usuarioById.get(produto.usuarioCadastrado);
 const secretaria = app.secretariaById.get(produto.secretariaCadastrada);

 return (
 <article key={produto.id} className="border-2 border-black bg-white text-black p-4">
 <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
 <div className="min-w-0">
 <div className="flex flex-wrap items-center gap-2">
 <h3 className="font-bold text-black">{produto.nome}</h3>
 <span className="border-2 border-black bg-white px-2 py-1 text-xs font-bold text-black">
 {produtoStatusLabels[produto.status]}
 </span>
 <span className="border-2 border-black bg-white px-2 py-1 text-xs font-bold text-black">
 {produtoTypeLabels[produto.type]}
 </span>
 </div>
 <p className="mt-2 text-sm text-black">{produto.descricao}</p>
 <p className="mt-3 text-xs font-semibold uppercase text-black">
 {secretaria?.sigla ?? "Sem secretaria"} · {usuario?.nome ?? "Responsável não identificado"}
 </p>
 </div>
 <div className="flex shrink-0 flex-wrap items-center gap-2 lg:justify-end">
 <span className="border-2 border-black bg-white px-3 py-2 text-sm font-bold text-black">
 {produto.quantidade} un.
 </span>
 <span className="border-2 border-black bg-white px-3 py-2 text-sm font-bold text-black">
 {formatCurrency(produto.preco)}
 </span>
 <button
 onClick={() => app.handleEditProduto(produto)}
 className="h-9 border-2 border-black bg-white px-3 text-sm font-bold text-black hover:bg-neutral-100 shadow-[4px_4px_0_0_#000] transition-transform hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#000]"
 type="button"
 >
 Editar
 </button>
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
