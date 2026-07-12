"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type TabId = "painel" | "itens" | "secretarias" | "usuarios" | "planejamento";
type ApiMode = "verificando" | "sincronizado" | "local";

type Item = {
  id: string;
  name: string;
  description: string;
  quantity: number;
};

type Secretaria = {
  id: string;
  nome: string;
  sigla: string;
  endereco: string;
  cep: string;
  createAt?: string;
  createdAt?: string;
};

type Usuario = {
  id: string;
  siglaSecretaria: string;
  nome: string;
  email: string;
  creatAt?: string;
  createdAt?: string;
  roles: string;
};

type ItemForm = {
  name: string;
  description: string;
  quantity: string;
};

type SecretariaForm = {
  nome: string;
  sigla: string;
  endereco: string;
  cep: string;
};

type UsuarioForm = {
  siglaSecretaria: string;
  nome: string;
  email: string;
  cpf: string;
  senha: string;
};

const tabs: Array<{ id: TabId; label: string }> = [
  { id: "painel", label: "Painel" },
  { id: "itens", label: "Itens" },
  { id: "secretarias", label: "Secretarias" },
  { id: "usuarios", label: "Usuários" },
  { id: "planejamento", label: "Planejamento" },
];

const initialItems: Item[] = [
  {
    id: "local-item-1",
    name: "Cadeiras escolares",
    description: "Lote disponível para realocação entre unidades municipais.",
    quantity: 42,
  },
  {
    id: "local-item-2",
    name: "Computadores administrativos",
    description: "Equipamentos revisados para atendimento interno.",
    quantity: 12,
  },
  {
    id: "local-item-3",
    name: "Kits de escritorio",
    description: "Materiais de consumo para reposição mensal.",
    quantity: 85,
  },
];

const initialSecretarias: Secretaria[] = [
  {
    id: "local-secretaria-1",
    nome: "Secretaria Municipal de Educação",
    sigla: "SME",
    endereco: "Rua das Palmeiras, 120",
    cep: "01000-000",
    createdAt: "2026-07-01",
  },
  {
    id: "local-secretaria-2",
    nome: "Secretaria Municipal de Saúde",
    sigla: "SMS",
    endereco: "Avenida Central, 480",
    cep: "01010-100",
    createdAt: "2026-07-02",
  },
];

const initialUsuarios: Usuario[] = [
  {
    id: "local-usuario-1",
    siglaSecretaria: "SME",
    nome: "Ana Martins",
    email: "ana.martins@prefeitura.gov.br",
    createdAt: "2026-07-03",
    roles: "ROLE_USER",
  },
  {
    id: "local-usuario-2",
    siglaSecretaria: "SMS",
    nome: "Carlos Lima",
    email: "carlos.lima@prefeitura.gov.br",
    createdAt: "2026-07-04",
    roles: "ROLE_USER",
  },
];

const planejamento = [
  {
    titulo: "Produtos completos",
    status: "Planejado",
    detalhe: "Preço, tipo, status, usuário responsável e secretaria vinculada.",
  },
  {
    titulo: "Pedido de compra",
    status: "Aguardando API",
    detalhe: "Fluxo com ABERTO, PAGO, CANCELADO e motivo de cancelamento.",
  },
  {
    titulo: "Transferências",
    status: "Aguardando API",
    detalhe: "Solicitação, análise de estoque e conclusão entre secretarias.",
  },
  {
    titulo: "Histórico e auditoria",
    status: "Recomendado",
    detalhe: "Registro de entradas, saídas, ajustes e usuários envolvidos.",
  },
];

async function backendRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/backend${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    let message = "Não foi possível sincronizar com a API.";

    try {
      const error = (await response.json()) as { message?: string };
      message = error.message || message;
    } catch {
      message = response.statusText || message;
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

function formatDate(value?: string) {
  if (!value) {
    return "-";
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("pt-BR").format(date);
}

function createLocalId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.round(Math.random() * 1000)}`;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("painel");
  const [items, setItems] = useState<Item[]>(initialItems);
  const [secretarias, setSecretarias] = useState<Secretaria[]>(initialSecretarias);
  const [usuarios, setUsuarios] = useState<Usuario[]>(initialUsuarios);
  const [apiMode, setApiMode] = useState<ApiMode>("verificando");
  const [notice, setNotice] = useState("Conectando aos serviços do almoxarifado.");
  const [query, setQuery] = useState("");

  const [itemForm, setItemForm] = useState<ItemForm>({
    name: "",
    description: "",
    quantity: "",
  });

  const [secretariaForm, setSecretariaForm] = useState<SecretariaForm>({
    nome: "",
    sigla: "",
    endereco: "",
    cep: "",
  });

  const [usuarioForm, setUsuarioForm] = useState<UsuarioForm>({
    siglaSecretaria: initialSecretarias[0]?.sigla ?? "",
    nome: "",
    email: "",
    cpf: "",
    senha: "",
  });

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      const [itemsResult, secretariasResult, usuariosResult] = await Promise.allSettled([
        backendRequest<Item[]>("/items"),
        backendRequest<Secretaria[]>("/v1/secretarias"),
        backendRequest<Usuario[]>("/v1/users"),
      ]);

      if (ignore) {
        return;
      }

      const loadedSomething =
        itemsResult.status === "fulfilled" ||
        secretariasResult.status === "fulfilled" ||
        usuariosResult.status === "fulfilled";

      if (itemsResult.status === "fulfilled") {
        setItems(itemsResult.value);
      }

      if (secretariasResult.status === "fulfilled") {
        setSecretarias(secretariasResult.value);
        setUsuarioForm((current) => ({
          ...current,
          siglaSecretaria: current.siglaSecretaria || secretariasResult.value[0]?.sigla || "",
        }));
      }

      if (usuariosResult.status === "fulfilled") {
        setUsuarios(usuariosResult.value);
      }

      setApiMode(loadedSomething ? "sincronizado" : "local");
      setNotice(
        loadedSomething
          ? "Dados sincronizados com a API disponível."
          : "API indisponível; interface operando com dados locais.",
      );
    }

    loadData();

    return () => {
      ignore = true;
    };
  }, []);

  const filteredItems = useMemo(() => {
    const value = query.trim().toLowerCase();

    if (!value) {
      return items;
    }

    return items.filter((item) =>
      `${item.name} ${item.description}`.toLowerCase().includes(value),
    );
  }, [items, query]);

  const filteredSecretarias = useMemo(() => {
    const value = query.trim().toLowerCase();

    if (!value) {
      return secretarias;
    }

    return secretarias.filter((secretaria) =>
      `${secretaria.nome} ${secretaria.sigla} ${secretaria.endereco}`.toLowerCase().includes(value),
    );
  }, [secretarias, query]);

  const filteredUsuarios = useMemo(() => {
    const value = query.trim().toLowerCase();

    if (!value) {
      return usuarios;
    }

    return usuarios.filter((usuario) =>
      `${usuario.nome} ${usuario.email} ${usuario.siglaSecretaria}`.toLowerCase().includes(value),
    );
  }, [usuarios, query]);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const lowStock = items.filter((item) => item.quantity <= 15).length;
  const apiStatusLabel = {
    verificando: "Verificando API",
    sincronizado: "API conectada",
    local: "Modo local",
  }[apiMode];

  async function handleCreateItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload = {
      name: itemForm.name.trim(),
      description: itemForm.description.trim(),
      quantity: Number(itemForm.quantity),
    };

    if (!payload.name || !payload.description || Number.isNaN(payload.quantity)) {
      setNotice("Preencha nome, descrição e quantidade do item.");
      return;
    }

    try {
      const created = await backendRequest<Item>("/items", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setItems((current) => [created, ...current]);
      setApiMode("sincronizado");
      setNotice("Item cadastrado na API.");
    } catch (error) {
      setItems((current) => [{ id: createLocalId("item"), ...payload }, ...current]);
      setApiMode("local");
      setNotice(error instanceof Error ? `${error.message} Registro mantido localmente.` : "Registro mantido localmente.");
    }

    setItemForm({ name: "", description: "", quantity: "" });
  }

  async function handleCreateSecretaria(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload = {
      nome: secretariaForm.nome.trim(),
      sigla: secretariaForm.sigla.trim().toUpperCase(),
      endereco: secretariaForm.endereco.trim(),
      cep: secretariaForm.cep.trim(),
    };

    if (!payload.nome || !payload.sigla || !payload.endereco || !payload.cep) {
      setNotice("Preencha todos os dados da secretaria.");
      return;
    }

    try {
      const created = await backendRequest<Secretaria>("/v1/secretarias", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setSecretarias((current) => [created, ...current]);
      setUsuarioForm((current) => ({ ...current, siglaSecretaria: current.siglaSecretaria || payload.sigla }));
      setApiMode("sincronizado");
      setNotice("Secretaria cadastrada na API.");
    } catch (error) {
      setSecretarias((current) => [
        { id: createLocalId("secretaria"), ...payload, createdAt: new Date().toISOString().slice(0, 10) },
        ...current,
      ]);
      setUsuarioForm((current) => ({ ...current, siglaSecretaria: current.siglaSecretaria || payload.sigla }));
      setApiMode("local");
      setNotice(error instanceof Error ? `${error.message} Secretaria mantida localmente.` : "Secretaria mantida localmente.");
    }

    setSecretariaForm({ nome: "", sigla: "", endereco: "", cep: "" });
  }

  async function handleCreateUsuario(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload = {
      siglaSecretaria: usuarioForm.siglaSecretaria,
      nome: usuarioForm.nome.trim(),
      email: usuarioForm.email.trim(),
      cpf: usuarioForm.cpf.trim(),
      senha: usuarioForm.senha,
    };

    if (!payload.siglaSecretaria || !payload.nome || !payload.email || !payload.cpf || !payload.senha) {
      setNotice("Preencha todos os dados do usuário.");
      return;
    }

    try {
      const created = await backendRequest<Usuario>("/v1/users", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setUsuarios((current) => [created, ...current]);
      setApiMode("sincronizado");
      setNotice("Usuário cadastrado na API.");
    } catch (error) {
      setUsuarios((current) => [
        {
          id: createLocalId("usuario"),
          siglaSecretaria: payload.siglaSecretaria,
          nome: payload.nome,
          email: payload.email,
          roles: "ROLE_USER",
          createdAt: new Date().toISOString().slice(0, 10),
        },
        ...current,
      ]);
      setApiMode("local");
      setNotice(error instanceof Error ? `${error.message} Usuário mantido localmente.` : "Usuário mantido localmente.");
    }

    setUsuarioForm({
      siglaSecretaria: payload.siglaSecretaria,
      nome: "",
      email: "",
      cpf: "",
      senha: "",
    });
  }

  return (
    <main className="min-h-screen bg-[#eef2ef] text-[#17231f]">
      <header className="border-b border-[#cbd8d0] bg-white">
        <div className="bg-[#173f35] text-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-sm sm:px-6 lg:px-8">
            <span>Prefeitura Municipal</span>
            <span className="font-medium">{apiStatusLabel}</span>
          </div>
        </div>

        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2d6f58]">
                  Almoxarifado compartilhado
                </p>
                <h1 className="text-2xl font-bold text-[#10241e] sm:text-3xl">
                  Gestão municipal de bens e materiais
                </h1>
              </div>
            </div>

            <label className="flex w-full max-w-xl items-center gap-3 rounded border border-[#b9c8be] bg-[#f8faf8] px-3 py-2">
              <span className="text-sm font-semibold text-[#315245]">Busca</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#73827b]"
                placeholder="Item, secretaria, usuário"
                type="search"
              />
            </label>
          </div>

          <nav className="flex gap-2 overflow-x-auto" aria-label="Navegação principal">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`h-10 rounded border px-4 text-sm font-semibold transition ${
                  activeTab === tab.id
                    ? "border-[#173f35] bg-[#173f35] text-white"
                    : "border-[#cbd8d0] bg-white text-[#27443a] hover:border-[#2d6f58]"
                }`}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <section className="border-b border-[#cbd8d0] bg-[#f8faf8]">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 text-sm text-[#315245] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span>{notice}</span>
          <span className="font-semibold">Base: {secretarias.length} secretarias cadastradas</span>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        {activeTab === "painel" && (
          <section className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Metric title="Itens cadastrados" value={items.length.toString()} note={`${totalItems} unidades`} />
              <Metric title="Secretarias" value={secretarias.length.toString()} note="Órgãos participantes" />
              <Metric title="Usuários" value={usuarios.length.toString()} note="Acessos operacionais" />
              <Metric title="Estoque baixo" value={lowStock.toString()} note="Até 15 unidades" tone="warn" />
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
              <section className="rounded border border-[#cbd8d0] bg-white">
                <SectionHeader title="Movimento do almoxarifado" subtitle="Resumo dos itens em acompanhamento" />
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                    <thead className="bg-[#eef5f1] text-[#315245]">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Item</th>
                        <th className="px-4 py-3 font-semibold">Descrição</th>
                        <th className="px-4 py-3 text-right font-semibold">Quantidade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredItems.slice(0, 5).map((item) => (
                        <tr key={item.id} className="border-t border-[#e1e8e4]">
                          <td className="px-4 py-3 font-semibold text-[#10241e]">{item.name}</td>
                          <td className="px-4 py-3 text-[#53645c]">{item.description}</td>
                          <td className="px-4 py-3 text-right font-bold text-[#173f35]">{item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="rounded border border-[#cbd8d0] bg-white">
                <SectionHeader title="Secretarias ativas" subtitle="Unidades integradas ao compartilhamento" />
                <div className="divide-y divide-[#e1e8e4]">
                  {secretarias.slice(0, 4).map((secretaria) => (
                    <div key={secretaria.id} className="flex items-start justify-between gap-4 px-4 py-4">
                      <div>
                        <p className="font-semibold text-[#10241e]">{secretaria.nome}</p>
                        <p className="text-sm text-[#53645c]">{secretaria.endereco}</p>
                      </div>
                      <span className="rounded border border-[#d5b35c] bg-[#fff7db] px-2 py-1 text-xs font-bold text-[#6d5510]">
                        {secretaria.sigla}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </section>
        )}

        {activeTab === "itens" && (
          <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
            <form onSubmit={handleCreateItem} className="rounded border border-[#cbd8d0] bg-white">
              <SectionHeader title="Cadastro de item" subtitle="Inventário operacional" />
              <div className="grid gap-4 p-4">
                <Field label="Nome">
                  <input
                    value={itemForm.name}
                    onChange={(event) => setItemForm((current) => ({ ...current, name: event.target.value }))}
                    className="form-input"
                    placeholder="Ex.: Mesa de reunião"
                  />
                </Field>
                <Field label="Descrição">
                  <textarea
                    value={itemForm.description}
                    onChange={(event) => setItemForm((current) => ({ ...current, description: event.target.value }))}
                    className="form-input min-h-24 resize-y"
                    placeholder="Descrição curta do item"
                  />
                </Field>
                <Field label="Quantidade">
                  <input
                    value={itemForm.quantity}
                    onChange={(event) => setItemForm((current) => ({ ...current, quantity: event.target.value }))}
                    className="form-input"
                    min="0"
                    type="number"
                    placeholder="0"
                  />
                </Field>
                <button className="h-11 rounded bg-[#1f6b4f] px-4 text-sm font-bold text-white hover:bg-[#173f35]" type="submit">
                  Cadastrar item
                </button>
              </div>
            </form>

            <DataPanel title="Itens cadastrados" subtitle={`${filteredItems.length} registros`}>
              <div className="grid gap-3">
                {filteredItems.map((item) => (
                  <article key={item.id} className="rounded border border-[#dbe5df] bg-[#fbfcfb] p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="font-bold text-[#10241e]">{item.name}</h3>
                        <p className="mt-1 text-sm text-[#53645c]">{item.description}</p>
                      </div>
                      <span className="w-fit rounded border border-[#b9c8be] bg-white px-3 py-1 text-sm font-bold text-[#173f35]">
                        {item.quantity} un.
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </DataPanel>
          </section>
        )}

        {activeTab === "secretarias" && (
          <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
            <form onSubmit={handleCreateSecretaria} className="rounded border border-[#cbd8d0] bg-white">
              <SectionHeader title="Cadastro de secretaria" subtitle="Cadastro municipal" />
              <div className="grid gap-4 p-4">
                <Field label="Nome">
                  <input
                    value={secretariaForm.nome}
                    onChange={(event) => setSecretariaForm((current) => ({ ...current, nome: event.target.value }))}
                    className="form-input"
                    placeholder="Secretaria Municipal de..."
                  />
                </Field>
                <Field label="Sigla">
                  <input
                    value={secretariaForm.sigla}
                    onChange={(event) => setSecretariaForm((current) => ({ ...current, sigla: event.target.value }))}
                    className="form-input uppercase"
                    placeholder="SME"
                    maxLength={12}
                  />
                </Field>
                <Field label="Endereço">
                  <input
                    value={secretariaForm.endereco}
                    onChange={(event) => setSecretariaForm((current) => ({ ...current, endereco: event.target.value }))}
                    className="form-input"
                    placeholder="Rua, número"
                  />
                </Field>
                <Field label="CEP">
                  <input
                    value={secretariaForm.cep}
                    onChange={(event) => setSecretariaForm((current) => ({ ...current, cep: event.target.value }))}
                    className="form-input"
                    placeholder="00000-000"
                  />
                </Field>
                <button className="h-11 rounded bg-[#1f6b4f] px-4 text-sm font-bold text-white hover:bg-[#173f35]" type="submit">
                  Cadastrar secretaria
                </button>
              </div>
            </form>

            <DataPanel title="Secretarias cadastradas" subtitle={`${filteredSecretarias.length} registros`}>
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
                    {filteredSecretarias.map((secretaria) => (
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
        )}

        {activeTab === "usuarios" && (
          <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
            <form onSubmit={handleCreateUsuario} className="rounded border border-[#cbd8d0] bg-white">
              <SectionHeader title="Cadastro de usuário" subtitle="Controle de acesso" />
              <div className="grid gap-4 p-4">
                <Field label="Secretaria">
                  <select
                    value={usuarioForm.siglaSecretaria}
                    onChange={(event) =>
                      setUsuarioForm((current) => ({ ...current, siglaSecretaria: event.target.value }))
                    }
                    className="form-input"
                  >
                    {secretarias.map((secretaria) => (
                      <option key={secretaria.id} value={secretaria.sigla}>
                        {secretaria.sigla} - {secretaria.nome}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Nome">
                  <input
                    value={usuarioForm.nome}
                    onChange={(event) => setUsuarioForm((current) => ({ ...current, nome: event.target.value }))}
                    className="form-input"
                    placeholder="Nome completo"
                  />
                </Field>
                <Field label="E-mail">
                  <input
                    value={usuarioForm.email}
                    onChange={(event) => setUsuarioForm((current) => ({ ...current, email: event.target.value }))}
                    className="form-input"
                    placeholder="servidor@prefeitura.gov.br"
                    type="email"
                  />
                </Field>
                <Field label="CPF">
                  <input
                    value={usuarioForm.cpf}
                    onChange={(event) => setUsuarioForm((current) => ({ ...current, cpf: event.target.value }))}
                    className="form-input"
                    placeholder="00000000000"
                  />
                </Field>
                <Field label="Senha">
                  <input
                    value={usuarioForm.senha}
                    onChange={(event) => setUsuarioForm((current) => ({ ...current, senha: event.target.value }))}
                    className="form-input"
                    minLength={8}
                    maxLength={32}
                    type="password"
                    placeholder="Mínimo de 8 caracteres"
                  />
                </Field>
                <button className="h-11 rounded bg-[#1f6b4f] px-4 text-sm font-bold text-white hover:bg-[#173f35]" type="submit">
                  Cadastrar usuário
                </button>
              </div>
            </form>

            <DataPanel title="Usuários cadastrados" subtitle={`${filteredUsuarios.length} registros`}>
              <div className="grid gap-3">
                {filteredUsuarios.map((usuario) => (
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
        )}

        {activeTab === "planejamento" && (
          <section className="grid gap-4 md:grid-cols-2">
            {planejamento.map((item) => (
              <article key={item.titulo} className="rounded border border-[#cbd8d0] bg-white p-5">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-lg font-bold text-[#10241e]">{item.titulo}</h2>
                  <span className="rounded border border-[#b9c8be] bg-[#f8faf8] px-2 py-1 text-xs font-bold text-[#315245]">
                    {item.status}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-[#53645c]">{item.detalhe}</p>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

function Metric({
  title,
  value,
  note,
  tone = "default",
}: {
  title: string;
  value: string;
  note: string;
  tone?: "default" | "warn";
}) {
  return (
    <article className="rounded border border-[#cbd8d0] bg-white p-5">
      <p className="text-sm font-semibold text-[#53645c]">{title}</p>
      <div className="mt-3 flex items-end justify-between gap-4">
        <strong className={`text-4xl font-black ${tone === "warn" ? "text-[#986b00]" : "text-[#173f35]"}`}>
          {value}
        </strong>
        <span className="text-right text-sm font-semibold text-[#315245]">{note}</span>
      </div>
    </article>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="border-b border-[#e1e8e4] px-4 py-4">
      <h2 className="text-lg font-bold text-[#10241e]">{title}</h2>
      <p className="mt-1 text-sm text-[#53645c]">{subtitle}</p>
    </header>
  );
}

function DataPanel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded border border-[#cbd8d0] bg-white">
      <SectionHeader title={title} subtitle={subtitle} />
      <div className="p-4">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-[#315245]">{label}</span>
      {children}
    </label>
  );
}
