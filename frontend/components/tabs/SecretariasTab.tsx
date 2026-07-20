import { DataPanel, Field, SectionHeader } from "@/components/ui";
import { formatDate } from "@/lib/formatters";
import type { AlmoxarifadoViewModel } from "@/lib/use-almoxarifado";

export function SecretariasTab({ app }: { app: AlmoxarifadoViewModel }) {
  return (
    <section className="form-page-grid">
      <form onSubmit={app.handleCreateSecretaria} className="rounded border border-[#cbd8d0] bg-white">
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
              className="h-11 rounded bg-[#1f6b4f] px-4 text-sm font-bold text-white hover:bg-[#173f35] disabled:cursor-wait disabled:opacity-60"
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
                className="h-11 rounded border border-[#b9c8be] bg-white px-4 text-sm font-bold text-[#27443a] hover:bg-[#f1f5f2]"
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
            <thead className="bg-[#eef5f1] text-[#315245]">
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
                  <td className="px-4 py-8 text-center text-[#53645c]" colSpan={5}>
                    Nenhuma secretaria encontrada.
                  </td>
                </tr>
              )}
              {app.filteredSecretarias.map((secretaria) => (
                <tr key={secretaria.id} className="border-t border-[#e1e8e4]">
                  <td className="px-4 py-3 font-bold text-[#173f35]">{secretaria.sigla}</td>
                  <td className="px-4 py-3">{secretaria.nome}</td>
                  <td className="px-4 py-3 text-[#53645c]">{secretaria.endereco}</td>
                  <td className="px-4 py-3 text-[#53645c]">{formatDate(secretaria.createdAt ?? secretaria.createAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => app.handleEditSecretaria(secretaria)}
                      className="h-9 rounded border border-[#b9c8be] bg-white px-3 text-sm font-bold text-[#173f35] hover:bg-[#f1f5f2]"
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
