import { LockKeyhole, LogIn, Mail } from "lucide-react";
import { Field, SectionHeader } from "@/components/ui";
import type { AlmoxarifadoViewModel } from "@/lib/use-almoxarifado";

function roleLabel(role?: string) {
  return role === "ROLE_ADMIN" ? "Administrador" : role === "ROLE_USER" ? "Usuário" : "Perfil operacional";
}

export function AcessoTab({ app }: { app: AlmoxarifadoViewModel }) {
  if (!app.authReady) {
    return (
      <div className="grid min-h-screen place-items-center px-6">
        <p className="text-sm font-semibold text-[#9a9ba4]">Verificando sessão...</p>
      </div>
    );
  }

  if (!app.authSession) {
    return (
      <section className="grid min-h-screen w-full place-items-center px-5 py-10 sm:px-8">
        <form
          onSubmit={app.handleLogin}
          className="w-full max-w-xl rounded-lg border border-[#30323d] bg-[#21222d] p-6 sm:p-9"
        >
          <div className="mb-7">
            <span className="grid size-10 place-items-center rounded-md bg-[#a9dfd8] text-[#171821]">
              <LogIn aria-hidden="true" className="size-5" strokeWidth={2} />
            </span>
            <h2 className="mt-5 text-xl font-bold text-white">Acesso ao sistema</h2>
            <p className="mt-1 text-sm text-[#9a9ba4]">Identificação do servidor municipal</p>
          </div>

          <div className="grid gap-5">
            <Field label="E-mail institucional">
              <div className="flex items-center gap-3 rounded-md border border-[#31333f] bg-[#191a23] px-3 focus-within:border-[#a9dfd8]">
                <Mail aria-hidden="true" className="size-[18px] shrink-0 text-[#777984]" strokeWidth={1.8} />
                <input
                  value={app.loginForm.email}
                  onChange={(event) => app.setLoginForm((current) => ({ ...current, email: event.target.value }))}
                  className="h-11 min-w-0 flex-1 border-0 bg-transparent text-sm text-white outline-none ring-0 placeholder:text-[#6f707a] focus:border-0 focus:outline-none focus:ring-0 focus-visible:outline-none"
                  autoComplete="email"
                  placeholder="servidor@prefeitura.gov.br"
                  type="email"
                  required
                />
              </div>
            </Field>
            <Field label="Senha">
              <div className="flex items-center gap-3 rounded-md border border-[#31333f] bg-[#191a23] px-3 focus-within:border-[#a9dfd8]">
                <LockKeyhole aria-hidden="true" className="size-[18px] shrink-0 text-[#777984]" strokeWidth={1.8} />
                <input
                  value={app.loginForm.password}
                  onChange={(event) => app.setLoginForm((current) => ({ ...current, password: event.target.value }))}
                  className="h-11 min-w-0 flex-1 border-0 bg-transparent text-sm text-white outline-none ring-0 placeholder:text-[#6f707a] focus:border-0 focus:outline-none focus:ring-0 focus-visible:outline-none"
                  autoComplete="current-password"
                  minLength={8}
                  placeholder="Senha cadastrada"
                  type="password"
                  required
                />
              </div>
            </Field>
            <button
              className="mt-1 flex h-11 items-center justify-center gap-2 rounded-md bg-[#a9dfd8] px-4 text-sm font-bold text-[#171821] transition-colors hover:bg-[#77c8be] disabled:cursor-wait disabled:opacity-60"
              disabled={app.pendingAction === "login"}
              type="submit"
            >
              <LogIn aria-hidden="true" className="size-[18px]" strokeWidth={2} />
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
