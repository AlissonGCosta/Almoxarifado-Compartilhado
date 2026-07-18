import { DataPanel, Field, SectionHeader } from "@/components/ui";
import { formatDate } from "@/lib/formatters";
import type { AlmoxarifadoViewModel } from "@/lib/use-almoxarifado";

export function UsuariosTab({ app }: { app: AlmoxarifadoViewModel }) {
  return (
    <section className="form-page-grid">
      <form onSubmit={app.handleCreateUsuario} className="rounded border border-[#cbd8d0] bg-white">
        <SectionHeader title="Cadastro de usuário" subtitle="Controle de acesso" />
        <div className="grid gap-4 p-4 md:grid-cols-2">
          <Field label="Secretaria">
            <select
              value={app.usuarioForm.siglaSecretaria}
              onChange={(event) =>
                app.setUsuarioForm((current) => ({ ...current, siglaSecretaria: event.target.value }))
              }
              className="form-input"
            >
              {app.secretarias.map((secretaria) => (
                <option key={secretaria.id} value={secretaria.sigla}>
                  {secretaria.sigla} - {secretaria.nome}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Nome">
            <input
              value={app.usuarioForm.nome}
              onChange={(event) => app.setUsuarioForm((current) => ({ ...current, nome: event.target.value }))}
              className="form-input"
              placeholder="Nome completo"
            />
          </Field>
          <Field label="E-mail">
            <input
              value={app.usuarioForm.email}
              onChange={(event) => app.setUsuarioForm((current) => ({ ...current, email: event.target.value }))}
              className="form-input"
              placeholder="servidor@prefeitura.gov.br"
              type="email"
            />
          </Field>
          <Field label="CPF">
            <input
              value={app.usuarioForm.cpf}
              onChange={(event) => app.setUsuarioForm((current) => ({ ...current, cpf: event.target.value }))}
              className="form-input"
              placeholder="00000000000"
            />
          </Field>
          <Field label="Senha">
            <input
              value={app.usuarioForm.senha}
              onChange={(event) => app.setUsuarioForm((current) => ({ ...current, senha: event.target.value }))}
              className="form-input"
              minLength={8}
              maxLength={32}
              type="password"
              placeholder="Mínimo de 8 caracteres"
            />
          </Field>
          <button
            className="h-11 self-end rounded bg-[#1f6b4f] px-4 text-sm font-bold text-white hover:bg-[#173f35]"
            type="submit"
          >
            Cadastrar usuário
          </button>
        </div>
      </form>

      <DataPanel title="Usuários cadastrados" subtitle={`${app.filteredUsuarios.length} registros`}>
        <div className="grid gap-3">
          {app.filteredUsuarios.map((usuario) => (
            <article key={usuario.id} className="rounded border border-[#dbe5df] bg-[#fbfcfb] p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-bold text-[#10241e]">{usuario.nome}</h3>
                  <p className="mt-1 text-sm text-[#53645c]">{usuario.email}</p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#2d6f58]">
                    {usuario.siglaSecretaria}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded border border-[#b9c8be] bg-white px-3 py-1 text-xs font-bold text-[#173f35]">
                    {usuario.roles}
                  </span>
                  <span className="rounded border border-[#d5b35c] bg-[#fff7db] px-3 py-1 text-xs font-bold text-[#6d5510]">
                    {formatDate(usuario.createdAt ?? usuario.creatAt)}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </DataPanel>
    </section>
  );
}
