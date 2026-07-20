import { Field, SectionHeader } from "@/components/ui";
import type { AlmoxarifadoViewModel } from "@/lib/use-almoxarifado";

function roleLabel(role?: string) {
  return role === "ROLE_ADMIN" ? "Administrador" : role === "ROLE_USER" ? "Usuário" : "Perfil operacional";
}

export function AcessoTab({ app }: { app: AlmoxarifadoViewModel }) {
  if (!app.authReady) {
    return <p className="py-12 text-center text-sm text-[#53645c]">Verificando sessão...</p>;
  }

  if (!app.authSession) {
    return (
      <section className="mx-auto w-full max-w-2xl">
        <form onSubmit={app.handleLogin} className="rounded border border-[#cbd8d0] bg-white">
          <SectionHeader title="Acesso ao sistema" subtitle="Identificação do servidor municipal" />
          <div className="grid gap-4 p-5">
            <Field label="E-mail institucional">
              <input
                value={app.loginForm.email}
                onChange={(event) => app.setLoginForm((current) => ({ ...current, email: event.target.value }))}
                className="form-input"
                autoComplete="email"
                placeholder="servidor@prefeitura.gov.br"
                type="email"
                required
              />
            </Field>
            <Field label="Senha">
              <input
                value={app.loginForm.password}
                onChange={(event) => app.setLoginForm((current) => ({ ...current, password: event.target.value }))}
                className="form-input"
                autoComplete="current-password"
                minLength={8}
                placeholder="Senha cadastrada"
                type="password"
                required
              />
            </Field>
            <button
              className="h-11 rounded bg-[#1f6b4f] px-4 text-sm font-bold text-white hover:bg-[#173f35] disabled:cursor-wait disabled:opacity-60"
              disabled={app.pendingAction === "login"}
              type="submit"
            >
              {app.pendingAction === "login" ? "Entrando..." : "Entrar"}
            </button>
          </div>
        </form>
      </section>
    );
  }

  return (
    <section className="form-page-grid">
      <section className="rounded border border-[#cbd8d0] bg-white">
        <SectionHeader title="Minha conta" subtitle="Dados da sessão atual" />
        <dl className="grid gap-4 p-5 sm:grid-cols-3">
          <div>
            <dt className="text-xs font-bold uppercase text-[#53645c]">Nome</dt>
            <dd className="mt-1 font-semibold text-[#10241e]">{app.authSession.name}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase text-[#53645c]">E-mail</dt>
            <dd className="mt-1 break-all font-semibold text-[#10241e]">{app.authSession.email}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase text-[#53645c]">Perfil</dt>
            <dd className="mt-1 font-semibold text-[#10241e]">{roleLabel(app.authSession.role)}</dd>
          </div>
        </dl>
      </section>

      <form onSubmit={app.handleChangePassword} className="rounded border border-[#cbd8d0] bg-white">
        <SectionHeader title="Alterar senha" subtitle="Atualização das credenciais de acesso" />
        <div className="grid gap-4 p-5 md:grid-cols-3">
          <Field label="Senha atual">
            <input
              value={app.passwordForm.senhaAtual}
              onChange={(event) =>
                app.setPasswordForm((current) => ({ ...current, senhaAtual: event.target.value }))
              }
              className="form-input"
              autoComplete="current-password"
              type="password"
              required
            />
          </Field>
          <Field label="Nova senha">
            <input
              value={app.passwordForm.senhaNova}
              onChange={(event) => app.setPasswordForm((current) => ({ ...current, senhaNova: event.target.value }))}
              className="form-input"
              autoComplete="new-password"
              minLength={8}
              maxLength={32}
              type="password"
              required
            />
          </Field>
          <Field label="Confirmar nova senha">
            <input
              value={app.passwordForm.confirmarSenha}
              onChange={(event) =>
                app.setPasswordForm((current) => ({ ...current, confirmarSenha: event.target.value }))
              }
              className="form-input"
              autoComplete="new-password"
              minLength={8}
              maxLength={32}
              type="password"
              required
            />
          </Field>
          <div className="flex flex-col gap-2 md:col-span-3 sm:flex-row">
            <button
              className="h-11 flex-1 rounded bg-[#1f6b4f] px-4 text-sm font-bold text-white hover:bg-[#173f35] disabled:cursor-wait disabled:opacity-60"
              disabled={app.pendingAction === "senha" || !app.authSession.userId}
              type="submit"
            >
              {app.pendingAction === "senha" ? "Atualizando..." : "Atualizar senha"}
            </button>
            <button
              onClick={app.handleLogout}
              className="h-11 rounded border border-[#b84a42] bg-white px-4 text-sm font-bold text-[#8d2f29] hover:bg-[#fff1ef]"
              type="button"
            >
              Sair do sistema
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
