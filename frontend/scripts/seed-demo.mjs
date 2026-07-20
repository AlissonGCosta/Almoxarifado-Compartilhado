const backendUrl = process.env.BACKEND_URL ?? "http://127.0.0.1:8080";

const demo = {
  email: "demo@prefeitura.gov.br",
  password: "Hackathon2026",
  cpf: "52998224725",
  secretariaSigla: "SMA",
};

async function request(path, init) {
  const response = await fetch(new URL(path, backendUrl), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    signal: AbortSignal.timeout(15000),
  });
  const text = await response.text();
  const data = text ? tryJson(text) : undefined;

  if (!response.ok) {
    throw new Error(data?.message ?? text ?? `${response.status} ${response.statusText}`);
  }

  return data;
}

function tryJson(value) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

async function findOrCreate(path, items, predicate, payload) {
  const existing = items.find(predicate);
  return existing ?? request(path, { method: "POST", body: JSON.stringify(payload) });
}

async function seed() {
  console.log(`Preparando demonstração em ${backendUrl}`);

  const secretarias = await request("/v1/secretarias");
  const secretaria = await findOrCreate(
    "/v1/secretarias",
    secretarias,
    (item) => item.sigla === demo.secretariaSigla,
    {
      nome: "Secretaria Municipal de Administração",
      sigla: demo.secretariaSigla,
      endereco: "Praça Municipal, 100",
      cep: "01000000",
    },
  );

  const usuarios = await request("/v1/users");
  const usuarioExistente = usuarios.find((item) => item.email === demo.email);
  let usuario;

  if (usuarioExistente) {
    await request(`/v1/users/${usuarioExistente.id}`, {
      method: "PUT",
      body: JSON.stringify({ nome: "Demonstração", email: demo.email }),
    });
    usuario = { ...usuarioExistente, nome: "Demonstração" };
  } else {
    usuario = await request("/v1/users", {
      method: "POST",
      body: JSON.stringify({
        siglaSecretaria: demo.secretariaSigla,
        nome: "Demonstração",
        email: demo.email,
        cpf: demo.cpf,
        senha: demo.password,
      }),
    });
  }

  const produtosAtuais = await request("/v1/produtos");
  const produtosBase = [
    {
      nome: "Cadeiras escolares",
      descricao: "Lote revisado para remanejamento entre escolas municipais.",
      quantidade: 42,
      preco: 189.9,
      status: "USADO",
      type: "COMPRADO",
    },
    {
      nome: "Computadores administrativos",
      descricao: "Equipamentos destinados aos setores administrativos da prefeitura.",
      quantidade: 12,
      preco: 3083.33,
      status: "USADO",
      type: "COMPRADO",
    },
    {
      nome: "Kits de escritório",
      descricao: "Materiais de expediente para reposição das unidades participantes.",
      quantidade: 85,
      preco: 80,
      status: "NOVO",
      type: "DOADO",
    },
  ];
  const produtos = [];

  for (const produto of produtosBase) {
    produtos.push(
      await findOrCreate(
        "/v1/produtos",
        produtosAtuais,
        (item) => item.nome === produto.nome,
        {
          ...produto,
          usuarioCadastrado: usuario.id,
          secretariaCadastrada: secretaria.id,
        },
      ),
    );
  }

  const transferencias = await request("/v1/pedidos-transferencia");
  const razaoSocial = "Remanejamento de patrimônio entre unidades da administração municipal.";

  if (!transferencias.some((item) => item.razaoSocial === razaoSocial)) {
    await request("/v1/pedidos-transferencia", {
      method: "POST",
      body: JSON.stringify({
        descricaoPedido: "Transferência de cadeiras para atender às novas turmas da rede municipal.",
        razaoSocial,
        usuarioId: usuario.id,
        secretariaId: secretaria.id,
        itens: [{ produtoId: produtos[0].id, quantidade: 8 }],
      }),
    });
  }

  await request("/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: demo.email, password: demo.password }),
  });

  console.log("Dados de demonstração preparados.");
  console.log(`Login: ${demo.email}`);
  console.log(`Senha: ${demo.password}`);
}

seed().catch((error) => {
  console.error(`Não foi possível preparar a demonstração: ${error.message}`);
  process.exitCode = 1;
});
