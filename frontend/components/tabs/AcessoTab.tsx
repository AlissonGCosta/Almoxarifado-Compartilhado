import { Field, SectionHeader } from "@/components/ui";

const authRequirements = [
  "Endpoint de login com e-mail e senha.",
  "Resposta com token, sessão ou cookie de autenticação.",
  "Endpoint para identificar usuário logado e perfil.",
  "Regras de permissão para administrador e usuário comum.",
];

export function AcessoTab() {
  return (
    <section className="form-page-grid">
      <section className="rounded border border-[#cbd8d0] bg-white">
        <SectionHeader title="Acesso ao sistema" subtitle="Tela preparada para o login futuro" />
        <div className="grid gap-4 p-4 md:grid-cols-2">
          <Field label="E-mail institucional">
            <input className="form-input" placeholder="servidor@prefeitura.gov.br" type="email" disabled />
          </Field>
          <Field label="Senha">
            <input className="form-input" placeholder="Senha cadastrada" type="password" disabled />
          </Field>
          <button className="h-11 self-end rounded bg-[#8fa59a] px-4 text-sm font-bold text-white" disabled type="button">
            Entrar
          </button>
          <p className="text-sm leading-6 text-[#53645c] md:col-span-2">
            O formulário está bloqueado até existir endpoint de autenticação no back-end.
          </p>
        </div>
      </section>

      <section className="rounded border border-[#cbd8d0] bg-white">
        <SectionHeader title="Contrato necessário" subtitle="Pontos para habilitar autenticação real" />
        <div className="grid gap-3 p-4">
          {authRequirements.map((item) => (
            <div key={item} className="rounded border border-[#dbe5df] bg-[#fbfcfb] px-4 py-3 text-sm text-[#315245]">
              {item}
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
