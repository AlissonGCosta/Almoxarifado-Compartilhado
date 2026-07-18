import { DataPanel, Field, SectionHeader } from "@/components/ui";
import { formatDate } from "@/lib/formatters";
import type { AlmoxarifadoViewModel } from "@/lib/use-almoxarifado";

export function SecretariasTab({ app }: { app: AlmoxarifadoViewModel }) {
  return (
    <section className="form-page-grid">
      <form onSubmit={app.handleCreateSecretaria} className="rounded border border-[#cbd8d0] bg-white">
        <SectionHeader title="Cadastro de secretaria" subtitle="Cadastro municipal" />
        <div className="grid gap-4 p-4 md:grid-cols-[minmax(0,1fr)_180px]">
          <Field label="Nome">
            <input
              value={app.secretariaForm.nome}
              onChange={(event) => app.setSecretariaForm((current) => ({ ...current, nome: event.target.value }))}
              className="form-input"
              placeholder="Secretaria Municipal de..."
            />
          </Field>
          <Field label="Sigla">
            <input
              value={app.secretariaForm.sigla}
              onChange={(event) => app.setSecretariaForm((current) => ({ ...current, sigla: event.target.value }))}
              className="form-input uppercase"
              placeholder="SME"
              maxLength={12}
            />
          </Field>
          <Field label="Endereço">
            <input
              value={app.secretariaForm.endereco}
              onChange={(event) => app.setSecretariaForm((current) => ({ ...current, endereco: event.target.value }))}
              className="form-input"
              placeholder="Rua, número"
            />
          </Field>
          <Field label="CEP">
            <input
              value={app.secretariaForm.cep}
              onChange={(event) => app.setSecretariaForm((current) => ({ ...current, cep: event.target.value }))}
              className="form-input"
              placeholder="00000-000"
            />
          </Field>
          <button
            className="h-11 rounded bg-[#1f6b4f] px-4 text-sm font-bold text-white hover:bg-[#173f35] md:col-span-2"
            type="submit"
          >
            Cadastrar secretaria
          </button>
        </div>
      </form>

      <DataPanel title="Secretarias cadastradas" subtitle={`${app.filteredSecretarias.length} registros`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead className="bg-[#eef5f1] text-[#315245]">
              <tr>
                <th className="px-4 py-3 font-semibold">Sigla</th>
                <th className="px-4 py-3 font-semibold">Nome</th>
                <th className="px-4 py-3 font-semibold">Endereço</th>
                <th className="px-4 py-3 font-semibold">Cadastro</th>
              </tr>
            </thead>
            <tbody>
              {app.filteredSecretarias.map((secretaria) => (
                <tr key={secretaria.id} className="border-t border-[#e1e8e4]">
                  <td className="px-4 py-3 font-bold text-[#173f35]">{secretaria.sigla}</td>
                  <td className="px-4 py-3">{secretaria.nome}</td>
                  <td className="px-4 py-3 text-[#53645c]">{secretaria.endereco}</td>
                  <td className="px-4 py-3 text-[#53645c]">{formatDate(secretaria.createdAt ?? secretaria.createAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DataPanel>
    </section>
  );
}
