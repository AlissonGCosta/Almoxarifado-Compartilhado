import { DataPanel, Field, SectionHeader } from "@/components/ui";
import { formatDate } from "@/lib/formatters";
import type { AlmoxarifadoViewModel } from "@/lib/use-almoxarifado";

export function SecretariasTab({ app }: { app: AlmoxarifadoViewModel }) {
 return (
 <section className="form-page-grid">
 <form onSubmit={app.handleCreateSecretaria} className="border-2 border-black bg-white text-black">
 <SectionHeader
 title={app.editingSecretariaId ? "Editar secretaria" : "Cadastro de secretaria"}
 subtitle={app.editingSecretariaId ? "Atualização do cadastro municipal" : "Cadastro municipal"}
 />
 <div className="grid gap-4 p-4 md:grid-cols-[minmax(0,1fr)_180px]">
 <Field label="Nome">
 <input
 value={app.secretariaForm.nome}
 onChange={(event) => app.setSecretariaForm((current) => ({ ...current, nome: event.target.value }))}
 className="form-input"
 placeholder="Secretaria Municipal de..."
 required
 />
 </Field>
 <Field label="Sigla">
 <input
 value={app.secretariaForm.sigla}
 onChange={(event) => app.setSecretariaForm((current) => ({ ...current, sigla: event.target.value }))}
 className="form-input uppercase"
 placeholder="SME"
 maxLength={12}
 required
 />
 </Field>
 <Field label="Endereço">
 <input
 value={app.secretariaForm.endereco}
 onChange={(event) => app.setSecretariaForm((current) => ({ ...current, endereco: event.target.value }))}
 className="form-input"
 placeholder="Rua, número"
 required
 />
 </Field>
 <Field label="CEP">
 <input
 value={app.secretariaForm.cep}
 onChange={(event) => app.setSecretariaForm((current) => ({ ...current, cep: event.target.value }))}
 className="form-input"
 placeholder="00000-000"
 inputMode="numeric"
 pattern="[0-9]{5}-?[0-9]{3}"
 required
 />
 </Field>
 <div className="grid gap-3 md:col-span-2 sm:grid-cols-[1fr_auto]">
 <button
 className="h-11 bg-black text-white hover:bg-neutral-800 px-4 text-sm font-bold disabled:cursor-wait disabled:opacity-60 shadow-[4px_4px_0_0_#000] transition-transform hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#000]"
 disabled={app.pendingAction === "secretaria"}
 type="submit"
 >
 {app.pendingAction === "secretaria"
 ? "Salvando..."
 : app.editingSecretariaId
 ? "Salvar alterações"
 : "Cadastrar secretaria"}
 </button>
 {app.editingSecretariaId && (
 <button
 onClick={app.handleCancelSecretariaEdit}
 className="h-11 border-2 border-black bg-white px-4 text-sm font-bold text-black hover:bg-neutral-100"
 type="button"
 >
 Cancelar
 </button>
 )}
 </div>
 </div>
 </form>

 <DataPanel title="Secretarias cadastradas" subtitle={`${app.filteredSecretarias.length} registros`}>
 <div className="overflow-x-auto">
 <table className="w-full min-w-[840px] border-collapse text-left text-sm">
 <thead className="bg-neutral-100 text-black">
 <tr>
 <th className="px-4 py-3 font-semibold">Sigla</th>
 <th className="px-4 py-3 font-semibold">Nome</th>
 <th className="px-4 py-3 font-semibold">Endereço</th>
 <th className="px-4 py-3 font-semibold">Cadastro</th>
 <th className="px-4 py-3 text-right font-semibold">Ações</th>
 </tr>
 </thead>
 <tbody>
 {!app.filteredSecretarias.length && (
 <tr>
 <td className="px-4 py-8 text-center text-black" colSpan={5}>
 Nenhuma secretaria encontrada.
 </td>
 </tr>
 )}
 {app.filteredSecretarias.map((secretaria) => (
 <tr key={secretaria.id} className="border-t-2 border-black">
 <td className="px-4 py-3 font-bold text-black">{secretaria.sigla}</td>
 <td className="px-4 py-3">{secretaria.nome}</td>
 <td className="px-4 py-3 text-black">{secretaria.endereco}</td>
 <td className="px-4 py-3 text-black">{formatDate(secretaria.createdAt ?? secretaria.createAt)}</td>
 <td className="px-4 py-3 text-right">
 <button
 onClick={() => app.handleEditSecretaria(secretaria)}
 className="h-9 border-2 border-black bg-white px-3 text-sm font-bold text-black hover:bg-neutral-100"
 type="button"
 >
 Editar
 </button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </DataPanel>
 </section>
 );
}
