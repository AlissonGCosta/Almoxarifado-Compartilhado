"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { backendRequest } from "@/lib/api";
import { createLocalId } from "@/lib/formatters";
import {
  initialItensTransferencia,
  initialPedidos,
  initialProdutos,
  initialSecretarias,
  initialTransferencias,
  initialUsuarios,
} from "@/lib/mock-data";
import type {
  ApiMode,
  ItemPedidoTransferencia,
  ItemTransferenciaForm,
  PedidoCompra,
  PedidoCompraForm,
  PedidoCompraStatus,
  PedidoStatusFilter,
  PedidoTransferencia,
  PedidoTransferenciaForm,
  Produto,
  ProdutoForm,
  Secretaria,
  SecretariaForm,
  TabId,
  TransferenciaStatus,
  TransferenciaStatusFilter,
  Usuario,
  UsuarioForm,
} from "@/lib/types";

function createProdutoForm(usuarioId = "", secretariaId = ""): ProdutoForm {
  return {
    nome: "",
    descricao: "",
    quantidade: "",
    preco: "",
    status: "NOVO",
    type: "COMPRADO",
    usuarioCadastrado: usuarioId,
    secretariaCadastrada: secretariaId,
  };
}

function createTransferenciaItem(produtoId = ""): ItemTransferenciaForm {
  return { produtoId, quantidade: "" };
}

export function useAlmoxarifado() {
  const [activeTab, setActiveTab] = useState<TabId>("painel");
  const [produtos, setProdutos] = useState<Produto[]>(initialProdutos);
  const [secretarias, setSecretarias] = useState<Secretaria[]>(initialSecretarias);
  const [usuarios, setUsuarios] = useState<Usuario[]>(initialUsuarios);
  const [pedidos, setPedidos] = useState<PedidoCompra[]>(initialPedidos);
  const [transferencias, setTransferencias] = useState<PedidoTransferencia[]>(initialTransferencias);
  const [itensTransferencia, setItensTransferencia] =
    useState<ItemPedidoTransferencia[]>(initialItensTransferencia);
  const [apiMode, setApiMode] = useState<ApiMode>("verificando");
  const [notice, setNotice] = useState("Conectando aos serviços do almoxarifado.");
  const [query, setQuery] = useState("");
  const [pedidoStatusFilter, setPedidoStatusFilter] = useState<PedidoStatusFilter>("TODOS");
  const [transferenciaStatusFilter, setTransferenciaStatusFilter] =
    useState<TransferenciaStatusFilter>("TODOS");
  const [editingProdutoId, setEditingProdutoId] = useState<string | null>(null);
  const [editingSecretariaId, setEditingSecretariaId] = useState<string | null>(null);
  const [editingUsuarioId, setEditingUsuarioId] = useState<string | null>(null);

  const [produtoForm, setProdutoForm] = useState<ProdutoForm>(
    createProdutoForm(initialUsuarios[0]?.id, initialSecretarias[0]?.id),
  );

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

  const [pedidoForm, setPedidoForm] = useState<PedidoCompraForm>({
    idProduto: initialProdutos[0]?.id ?? "",
    nomeProduto: initialProdutos[0]?.nome ?? "",
    descricaoProduto: initialProdutos[0]?.descricao ?? "",
    descricaoPedido: "",
    quantidade: "",
    preco: "",
    idUsuario: initialUsuarios[0]?.id ?? "",
    idSecretaria: initialSecretarias[0]?.id ?? "",
  });

  const [transferenciaForm, setTransferenciaForm] = useState<PedidoTransferenciaForm>({
    descricaoPedido: "",
    razaoSocial: "",
    usuarioId: initialUsuarios[0]?.id ?? "",
    secretariaId: initialSecretarias[0]?.id ?? "",
    itens: [createTransferenciaItem(initialProdutos[0]?.id)],
  });

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      const [
        produtosResult,
        secretariasResult,
        usuariosResult,
        pedidosResult,
        transferenciasResult,
        itensTransferenciaResult,
      ] = await Promise.allSettled([
        backendRequest<Produto[]>("/v1/produtos"),
        backendRequest<Secretaria[]>("/v1/secretarias"),
        backendRequest<Usuario[]>("/v1/users"),
        backendRequest<PedidoCompra[]>("/api/pedidos-compra"),
        backendRequest<PedidoTransferencia[]>("/v1/pedidos-transferencia"),
        backendRequest<ItemPedidoTransferencia[]>("/v1/itens-pedido-transferencia"),
      ]);

      if (ignore) {
        return;
      }

      const results = [
        produtosResult,
        secretariasResult,
        usuariosResult,
        pedidosResult,
        transferenciasResult,
        itensTransferenciaResult,
      ];
      const loadedSomething = results.some((result) => result.status === "fulfilled");
      const failedSomething = results.some((result) => result.status === "rejected");

      if (produtosResult.status === "fulfilled") {
        setProdutos(produtosResult.value);
        const primeiroProduto = produtosResult.value[0];

        setPedidoForm((current) => {
          const selected = produtosResult.value.find((produto) => produto.id === current.idProduto) ?? primeiroProduto;

          return {
            ...current,
            idProduto: selected?.id ?? "",
            nomeProduto: selected?.nome ?? "",
            descricaoProduto: selected?.descricao ?? "",
          };
        });

        setTransferenciaForm((current) => ({
          ...current,
          itens: current.itens.map((item) => ({
            ...item,
            produtoId:
              produtosResult.value.find((produto) => produto.id === item.produtoId)?.id ?? primeiroProduto?.id ?? "",
          })),
        }));
      }

      if (secretariasResult.status === "fulfilled") {
        setSecretarias(secretariasResult.value);
        const primeiraSecretaria = secretariasResult.value[0];

        setUsuarioForm((current) => ({
          ...current,
          siglaSecretaria:
            secretariasResult.value.find((secretaria) => secretaria.sigla === current.siglaSecretaria)?.sigla ??
            primeiraSecretaria?.sigla ??
            "",
        }));
        setProdutoForm((current) => ({
          ...current,
          secretariaCadastrada:
            secretariasResult.value.find((secretaria) => secretaria.id === current.secretariaCadastrada)?.id ??
            primeiraSecretaria?.id ??
            "",
        }));
        setPedidoForm((current) => ({
          ...current,
          idSecretaria:
            secretariasResult.value.find((secretaria) => secretaria.id === current.idSecretaria)?.id ??
            primeiraSecretaria?.id ??
            "",
        }));
        setTransferenciaForm((current) => ({
          ...current,
          secretariaId:
            secretariasResult.value.find((secretaria) => secretaria.id === current.secretariaId)?.id ??
            primeiraSecretaria?.id ??
            "",
        }));
      }

      if (usuariosResult.status === "fulfilled") {
        setUsuarios(usuariosResult.value);
        const primeiroUsuario = usuariosResult.value[0];

        setProdutoForm((current) => ({
          ...current,
          usuarioCadastrado:
            usuariosResult.value.find((usuario) => usuario.id === current.usuarioCadastrado)?.id ??
            primeiroUsuario?.id ??
            "",
        }));
        setPedidoForm((current) => ({
          ...current,
          idUsuario:
            usuariosResult.value.find((usuario) => usuario.id === current.idUsuario)?.id ?? primeiroUsuario?.id ?? "",
        }));
        setTransferenciaForm((current) => ({
          ...current,
          usuarioId:
            usuariosResult.value.find((usuario) => usuario.id === current.usuarioId)?.id ?? primeiroUsuario?.id ?? "",
        }));
      }

      if (pedidosResult.status === "fulfilled") {
        setPedidos(pedidosResult.value);
      }

      if (transferenciasResult.status === "fulfilled") {
        setTransferencias(transferenciasResult.value);
      }

      if (itensTransferenciaResult.status === "fulfilled") {
        setItensTransferencia(itensTransferenciaResult.value);
      }

      setApiMode(loadedSomething ? "sincronizado" : "local");
      setNotice(
        loadedSomething
          ? failedSomething
            ? "Parte dos dados foi sincronizada; as rotas indisponíveis usam dados locais."
            : "Dados sincronizados com as APIs disponíveis."
          : "API indisponível; interface operando com dados locais.",
      );
    }

    void loadData();

    return () => {
      ignore = true;
    };
  }, []);

  const filteredProdutos = useMemo(() => {
    const value = query.trim().toLowerCase();

    if (!value) {
      return produtos;
    }

    return produtos.filter((produto) =>
      `${produto.nome} ${produto.descricao} ${produto.status} ${produto.type}`.toLowerCase().includes(value),
    );
  }, [produtos, query]);

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

  const produtoById = useMemo(() => new Map(produtos.map((produto) => [produto.id, produto])), [produtos]);
  const usuarioById = useMemo(() => new Map(usuarios.map((usuario) => [usuario.id, usuario])), [usuarios]);
  const secretariaById = useMemo(
    () => new Map(secretarias.map((secretaria) => [secretaria.id, secretaria])),
    [secretarias],
  );

  const itensTransferenciaByPedido = useMemo(() => {
    const result = new Map<string, ItemPedidoTransferencia[]>();

    for (const item of itensTransferencia) {
      result.set(item.pedidoTransferencia, [...(result.get(item.pedidoTransferencia) ?? []), item]);
    }

    for (const transferencia of transferencias) {
      const existing = result.get(transferencia.id) ?? [];
      const existingIds = new Set(existing.map((item) => item.id));
      const embedded = transferencia.itens.filter((item) => !existingIds.has(item.id));
      result.set(transferencia.id, [...existing, ...embedded]);
    }

    return result;
  }, [itensTransferencia, transferencias]);

  const filteredPedidos = useMemo(() => {
    const value = query.trim().toLowerCase();

    return pedidos.filter((pedido) => {
      const usuario = usuarioById.get(pedido.idUsuario);
      const secretaria = secretariaById.get(pedido.idSecretaria);
      const matchesStatus = pedidoStatusFilter === "TODOS" || pedido.status === pedidoStatusFilter;
      const matchesQuery =
        !value ||
        `${pedido.nomeProduto} ${pedido.descricaoProduto ?? ""} ${pedido.descricaoPedido ?? ""} ${
          usuario?.nome ?? ""
        } ${secretaria?.nome ?? ""} ${secretaria?.sigla ?? ""}`
          .toLowerCase()
          .includes(value);

      return matchesStatus && matchesQuery;
    });
  }, [pedidos, pedidoStatusFilter, query, secretariaById, usuarioById]);

  const filteredTransferencias = useMemo(() => {
    const value = query.trim().toLowerCase();

    return transferencias.filter((transferencia) => {
      const usuario = usuarioById.get(transferencia.usuarioId);
      const secretaria = secretariaById.get(transferencia.secretariaId);
      const nomesProdutos = (itensTransferenciaByPedido.get(transferencia.id) ?? [])
        .map((item) => produtoById.get(item.produto)?.nome ?? "")
        .join(" ");
      const matchesStatus =
        transferenciaStatusFilter === "TODOS" || transferencia.status === transferenciaStatusFilter;
      const matchesQuery =
        !value ||
        `${transferencia.descricaoPedido} ${transferencia.razaoSocial} ${nomesProdutos} ${usuario?.nome ?? ""} ${
          secretaria?.nome ?? ""
        } ${secretaria?.sigla ?? ""}`
          .toLowerCase()
          .includes(value);

      return matchesStatus && matchesQuery;
    });
  }, [
    itensTransferenciaByPedido,
    produtoById,
    query,
    secretariaById,
    transferenciaStatusFilter,
    transferencias,
    usuarioById,
  ]);

  const totalItems = produtos.reduce((acc, produto) => acc + produto.quantidade, 0);
  const lowStock = produtos.filter((produto) => produto.quantidade <= 15).length;
  const pendingPedidos = pedidos.filter((pedido) => pedido.status === "PENDENTE").length;
  const activeTransferencias = transferencias.filter(
    (transferencia) => transferencia.status === "ABERTO" || transferencia.status === "ANALISE",
  ).length;
  const totalPedidoValue = pedidos.reduce((acc, pedido) => acc + pedido.preco, 0);
  const totalTransferenciaValue = transferencias.reduce((total, transferencia) => {
    const itens = itensTransferenciaByPedido.get(transferencia.id) ?? [];

    return (
      total +
      itens.reduce((subtotal, item) => {
        const produto = produtoById.get(item.produto);
        return subtotal + item.quantidade * (produto?.preco ?? 0);
      }, 0)
    );
  }, 0);
  const apiStatusLabel = {
    verificando: "Verificando API",
    sincronizado: "API conectada",
    local: "Modo local",
  }[apiMode];

  async function handleCreateProduto(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload = {
      nome: produtoForm.nome.trim(),
      descricao: produtoForm.descricao.trim(),
      quantidade: Number(produtoForm.quantidade),
      preco: Number(produtoForm.preco),
      status: produtoForm.status,
      type: produtoForm.type,
      usuarioCadastrado: produtoForm.usuarioCadastrado,
      secretariaCadastrada: produtoForm.secretariaCadastrada,
    };

    if (
      !payload.nome ||
      !payload.descricao ||
      !payload.usuarioCadastrado ||
      !payload.secretariaCadastrada ||
      !Number.isFinite(payload.quantidade) ||
      payload.quantidade <= 0 ||
      !Number.isFinite(payload.preco) ||
      payload.preco <= 0
    ) {
      setNotice("Preencha todos os dados do produto com quantidade e preço maiores que zero.");
      return;
    }

    if (editingProdutoId) {
      try {
        const updated = await backendRequest<Produto>(`/v1/produtos/${editingProdutoId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });

        setProdutos((current) =>
          current.map((produto) => (produto.id === editingProdutoId ? updated : produto)),
        );
        setApiMode("sincronizado");
        setNotice("Produto atualizado na API.");
      } catch (error) {
        setProdutos((current) =>
          current.map((produto) =>
            produto.id === editingProdutoId
              ? { ...produto, ...payload, updatedAt: new Date().toISOString().slice(0, 10) }
              : produto,
          ),
        );
        setApiMode("local");
        setNotice(
          error instanceof Error ? `${error.message} Produto atualizado localmente.` : "Produto atualizado localmente.",
        );
      }

      setEditingProdutoId(null);
      setProdutoForm(createProdutoForm(usuarios[0]?.id, secretarias[0]?.id));
      return;
    }

    try {
      const created = await backendRequest<Produto>("/v1/produtos", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setProdutos((current) => [created, ...current]);
      setApiMode("sincronizado");
      setNotice("Produto cadastrado na API.");
    } catch (error) {
      setProdutos((current) => [
        {
          id: createLocalId("produto"),
          ...payload,
          createdAt: new Date().toISOString().slice(0, 10),
        },
        ...current,
      ]);
      setApiMode("local");
      setNotice(
        error instanceof Error ? `${error.message} Produto mantido localmente.` : "Produto mantido localmente.",
      );
    }

    setProdutoForm(createProdutoForm(payload.usuarioCadastrado, payload.secretariaCadastrada));
  }

  function handleEditProduto(produto: Produto) {
    setEditingProdutoId(produto.id);
    setProdutoForm({
      nome: produto.nome,
      descricao: produto.descricao,
      quantidade: produto.quantidade.toString(),
      preco: produto.preco.toString(),
      status: produto.status,
      type: produto.type,
      usuarioCadastrado: produto.usuarioCadastrado,
      secretariaCadastrada: produto.secretariaCadastrada,
    });
    setNotice("Editando o produto selecionado.");
  }

  function handleCancelProdutoEdit() {
    setEditingProdutoId(null);
    setProdutoForm(createProdutoForm(usuarios[0]?.id, secretarias[0]?.id));
    setNotice("Edição de produto cancelada.");
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

    if (editingSecretariaId) {
      const previousSecretaria = secretarias.find((secretaria) => secretaria.id === editingSecretariaId);
      const updatedSecretaria = {
        ...previousSecretaria,
        ...payload,
        id: editingSecretariaId,
        updatedAt: new Date().toISOString().slice(0, 10),
      };

      try {
        await backendRequest<void>(`/v1/secretarias/${editingSecretariaId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });

        setApiMode("sincronizado");
        setNotice("Secretaria atualizada na API.");
      } catch (error) {
        setApiMode("local");
        setNotice(
          error instanceof Error
            ? `${error.message} Secretaria atualizada localmente.`
            : "Secretaria atualizada localmente.",
        );
      }

      setSecretarias((current) =>
        current.map((secretaria) => (secretaria.id === editingSecretariaId ? updatedSecretaria : secretaria)),
      );

      if (previousSecretaria?.sigla && previousSecretaria.sigla !== payload.sigla) {
        setUsuarios((current) =>
          current.map((usuario) =>
            usuario.siglaSecretaria === previousSecretaria.sigla
              ? { ...usuario, siglaSecretaria: payload.sigla }
              : usuario,
          ),
        );
        setUsuarioForm((current) => ({
          ...current,
          siglaSecretaria:
            current.siglaSecretaria === previousSecretaria.sigla ? payload.sigla : current.siglaSecretaria,
        }));
      }

      setEditingSecretariaId(null);
      setSecretariaForm({ nome: "", sigla: "", endereco: "", cep: "" });
      return;
    }

    try {
      const created = await backendRequest<Secretaria>("/v1/secretarias", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setSecretarias((current) => [created, ...current]);
      setUsuarioForm((current) => ({ ...current, siglaSecretaria: current.siglaSecretaria || payload.sigla }));
      setProdutoForm((current) => ({
        ...current,
        secretariaCadastrada: current.secretariaCadastrada || created.id,
      }));
      setApiMode("sincronizado");
      setNotice("Secretaria cadastrada na API.");
    } catch (error) {
      const localId = createLocalId("secretaria");
      setSecretarias((current) => [
        { id: localId, ...payload, createdAt: new Date().toISOString().slice(0, 10) },
        ...current,
      ]);
      setUsuarioForm((current) => ({ ...current, siglaSecretaria: current.siglaSecretaria || payload.sigla }));
      setProdutoForm((current) => ({ ...current, secretariaCadastrada: current.secretariaCadastrada || localId }));
      setApiMode("local");
      setNotice(
        error instanceof Error ? `${error.message} Secretaria mantida localmente.` : "Secretaria mantida localmente.",
      );
    }

    setSecretariaForm({ nome: "", sigla: "", endereco: "", cep: "" });
  }

  function handleEditSecretaria(secretaria: Secretaria) {
    setEditingSecretariaId(secretaria.id);
    setSecretariaForm({
      nome: secretaria.nome,
      sigla: secretaria.sigla,
      endereco: secretaria.endereco,
      cep: secretaria.cep,
    });
    setNotice("Editando a secretaria selecionada.");
  }

  function handleCancelSecretariaEdit() {
    setEditingSecretariaId(null);
    setSecretariaForm({ nome: "", sigla: "", endereco: "", cep: "" });
    setNotice("Edição de secretaria cancelada.");
  }

  async function handleCreateUsuario(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (editingUsuarioId) {
      const payload = {
        nome: usuarioForm.nome.trim(),
        email: usuarioForm.email.trim(),
      };

      if (!payload.nome || !payload.email) {
        setNotice("Preencha nome e e-mail do usuário.");
        return;
      }

      try {
        await backendRequest<{ nome: string; email: string }>(`/v1/users/${editingUsuarioId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });

        setApiMode("sincronizado");
        setNotice("Usuário atualizado na API.");
      } catch (error) {
        setApiMode("local");
        setNotice(
          error instanceof Error ? `${error.message} Usuário atualizado localmente.` : "Usuário atualizado localmente.",
        );
      }

      setUsuarios((current) =>
        current.map((usuario) => (usuario.id === editingUsuarioId ? { ...usuario, ...payload } : usuario)),
      );
      setEditingUsuarioId(null);
      setUsuarioForm({
        siglaSecretaria: secretarias[0]?.sigla ?? "",
        nome: "",
        email: "",
        cpf: "",
        senha: "",
      });
      return;
    }

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
      setProdutoForm((current) => ({ ...current, usuarioCadastrado: current.usuarioCadastrado || created.id }));
      setApiMode("sincronizado");
      setNotice("Usuário cadastrado na API.");
    } catch (error) {
      const localId = createLocalId("usuario");
      setUsuarios((current) => [
        {
          id: localId,
          siglaSecretaria: payload.siglaSecretaria,
          nome: payload.nome,
          email: payload.email,
          roles: "ROLE_USER",
          createdAt: new Date().toISOString().slice(0, 10),
        },
        ...current,
      ]);
      setProdutoForm((current) => ({ ...current, usuarioCadastrado: current.usuarioCadastrado || localId }));
      setApiMode("local");
      setNotice(
        error instanceof Error ? `${error.message} Usuário mantido localmente.` : "Usuário mantido localmente.",
      );
    }

    setUsuarioForm({
      siglaSecretaria: payload.siglaSecretaria,
      nome: "",
      email: "",
      cpf: "",
      senha: "",
    });
  }

  function handleEditUsuario(usuario: Usuario) {
    setEditingUsuarioId(usuario.id);
    setUsuarioForm({
      siglaSecretaria: usuario.siglaSecretaria,
      nome: usuario.nome,
      email: usuario.email,
      cpf: "",
      senha: "",
    });
    setNotice("Editando o usuário selecionado. O back-end permite alterar apenas nome e e-mail.");
  }

  function handleCancelUsuarioEdit() {
    setEditingUsuarioId(null);
    setUsuarioForm({
      siglaSecretaria: secretarias[0]?.sigla ?? "",
      nome: "",
      email: "",
      cpf: "",
      senha: "",
    });
    setNotice("Edição de usuário cancelada.");
  }

  function handlePedidoProdutoChange(idProduto: string) {
    const produto = produtoById.get(idProduto);

    setPedidoForm((current) => ({
      ...current,
      idProduto,
      nomeProduto: produto?.nome ?? current.nomeProduto,
      descricaoProduto: produto?.descricao ?? current.descricaoProduto,
    }));
  }

  async function handleCreatePedido(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload = {
      idProduto: pedidoForm.idProduto,
      nomeProduto: pedidoForm.nomeProduto.trim(),
      descricaoProduto: pedidoForm.descricaoProduto.trim(),
      descricaoPedido: pedidoForm.descricaoPedido.trim(),
      quantidade: Number(pedidoForm.quantidade),
      preco: Number(pedidoForm.preco),
      status: "PENDENTE" as PedidoCompraStatus,
      idUsuario: pedidoForm.idUsuario,
      idSecretaria: pedidoForm.idSecretaria,
      motivoCancelamento: "",
    };

    if (
      !payload.idProduto ||
      !payload.nomeProduto ||
      !payload.idUsuario ||
      !payload.idSecretaria ||
      !Number.isFinite(payload.quantidade) ||
      payload.quantidade <= 0 ||
      !Number.isFinite(payload.preco) ||
      payload.preco < 0
    ) {
      setNotice("Preencha produto, solicitante, secretaria, quantidade e preço do pedido.");
      return;
    }

    try {
      const created = await backendRequest<PedidoCompra>("/api/pedidos-compra", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setPedidos((current) => [created, ...current]);
      setApiMode("sincronizado");
      setNotice("Pedido de compra cadastrado na API.");
    } catch (error) {
      setPedidos((current) => [{ ...payload, idPedidoCompra: createLocalId("pedido") }, ...current]);
      setApiMode("local");
      setNotice(error instanceof Error ? `${error.message} Pedido mantido localmente.` : "Pedido mantido localmente.");
    }

    setPedidoForm((current) => ({ ...current, descricaoPedido: "", quantidade: "", preco: "" }));
  }

  async function handleDeletePedido(idPedidoCompra: string) {
    try {
      await backendRequest<void>(`/api/pedidos-compra/${idPedidoCompra}`, { method: "DELETE" });

      setPedidos((current) => current.filter((pedido) => pedido.idPedidoCompra !== idPedidoCompra));
      setApiMode("sincronizado");
      setNotice("Pedido removido da API.");
    } catch (error) {
      setPedidos((current) => current.filter((pedido) => pedido.idPedidoCompra !== idPedidoCompra));
      setApiMode("local");
      setNotice(error instanceof Error ? `${error.message} Pedido removido localmente.` : "Pedido removido localmente.");
    }
  }

  function handleAddTransferenciaItem() {
    const selectedIds = new Set(transferenciaForm.itens.map((item) => item.produtoId));
    const nextProduto = produtos.find((produto) => !selectedIds.has(produto.id)) ?? produtos[0];

    setTransferenciaForm((current) => ({
      ...current,
      itens: [...current.itens, createTransferenciaItem(nextProduto?.id)],
    }));
  }

  function handleTransferenciaItemChange(
    index: number,
    field: keyof ItemTransferenciaForm,
    value: string,
  ) {
    setTransferenciaForm((current) => ({
      ...current,
      itens: current.itens.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)),
    }));
  }

  function handleRemoveTransferenciaItem(index: number) {
    setTransferenciaForm((current) => ({
      ...current,
      itens:
        current.itens.length === 1
          ? [createTransferenciaItem(produtos[0]?.id)]
          : current.itens.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  async function handleCreateTransferencia(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const itens = transferenciaForm.itens.map((item) => ({
      produtoId: item.produtoId,
      quantidade: Number(item.quantidade),
    }));
    const payload = {
      descricaoPedido: transferenciaForm.descricaoPedido.trim(),
      razaoSocial: transferenciaForm.razaoSocial.trim(),
      usuarioId: transferenciaForm.usuarioId,
      secretariaId: transferenciaForm.secretariaId,
      itens,
    };
    const produtosUnicos = new Set(itens.map((item) => item.produtoId));

    if (payload.descricaoPedido.length < 40 || payload.razaoSocial.length < 40) {
      setNotice("A descrição e a razão social devem ter pelo menos 40 caracteres.");
      return;
    }

    if (
      !payload.usuarioId ||
      !payload.secretariaId ||
      itens.length === 0 ||
      itens.some((item) => !item.produtoId || !Number.isFinite(item.quantidade) || item.quantidade <= 0)
    ) {
      setNotice("Preencha o solicitante, a secretaria e os produtos da transferência.");
      return;
    }

    if (produtosUnicos.size !== itens.length) {
      setNotice("Cada produto deve aparecer apenas uma vez no pedido de transferência.");
      return;
    }

    try {
      const created = await backendRequest<PedidoTransferencia>("/v1/pedidos-transferencia", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setTransferencias((current) => [created, ...current]);
      setItensTransferencia((current) => [...created.itens, ...current]);
      setApiMode("sincronizado");
      setNotice(
        created.status === "CANCELADO"
          ? created.motivoCancelamento || "Transferência cancelada pela API."
          : "Pedido de transferência cadastrado na API.",
      );
    } catch (error) {
      const transferenciaId = createLocalId("transferencia");
      const estoqueInsuficiente = itens.some(
        (item) => (produtoById.get(item.produtoId)?.quantidade ?? 0) < item.quantidade,
      );
      const localItens = itens.map<ItemPedidoTransferencia>((item) => ({
        id: createLocalId("item-transferencia"),
        pedidoTransferencia: transferenciaId,
        produto: item.produtoId,
        quantidade: item.quantidade,
      }));
      const localTransferencia: PedidoTransferencia = {
        id: transferenciaId,
        ...payload,
        status: estoqueInsuficiente ? "CANCELADO" : "ABERTO",
        motivoCancelamento: estoqueInsuficiente ? "Estoque local insuficiente para um ou mais produtos." : null,
        itens: localItens,
      };

      setTransferencias((current) => [localTransferencia, ...current]);
      setItensTransferencia((current) => [...localItens, ...current]);
      setApiMode("local");
      setNotice(
        error instanceof Error
          ? `${error.message} Transferência mantida localmente.`
          : "Transferência mantida localmente.",
      );
    }

    setTransferenciaForm((current) => ({
      ...current,
      descricaoPedido: "",
      razaoSocial: "",
      itens: [createTransferenciaItem(produtos[0]?.id)],
    }));
  }

  async function handleTransferenciaStatusChange(id: string, status: TransferenciaStatus) {
    try {
      const updated = await backendRequest<PedidoTransferencia>(`/v1/pedidos-transferencia/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });

      setTransferencias((current) =>
        current.map((transferencia) => (transferencia.id === id ? updated : transferencia)),
      );
      setApiMode("sincronizado");
      setNotice("Status da transferência atualizado na API.");
    } catch (error) {
      setTransferencias((current) =>
        current.map((transferencia) => (transferencia.id === id ? { ...transferencia, status } : transferencia)),
      );
      setApiMode("local");
      setNotice(
        error instanceof Error
          ? `${error.message} Status atualizado localmente.`
          : "Status atualizado localmente.",
      );
    }
  }

  return {
    activeTab,
    activeTransferencias,
    apiStatusLabel,
    editingProdutoId,
    editingSecretariaId,
    editingUsuarioId,
    filteredPedidos,
    filteredProdutos,
    filteredSecretarias,
    filteredTransferencias,
    filteredUsuarios,
    handleAddTransferenciaItem,
    handleCancelProdutoEdit,
    handleCancelSecretariaEdit,
    handleCancelUsuarioEdit,
    handleCreatePedido,
    handleCreateProduto,
    handleCreateSecretaria,
    handleCreateTransferencia,
    handleCreateUsuario,
    handleDeletePedido,
    handleEditProduto,
    handleEditSecretaria,
    handleEditUsuario,
    handlePedidoProdutoChange,
    handleRemoveTransferenciaItem,
    handleTransferenciaItemChange,
    handleTransferenciaStatusChange,
    itensTransferencia,
    itensTransferenciaByPedido,
    lowStock,
    notice,
    pedidoForm,
    pedidoStatusFilter,
    pedidos,
    pendingPedidos,
    produtoById,
    produtoForm,
    produtos,
    query,
    secretariaById,
    secretariaForm,
    secretarias,
    setActiveTab,
    setPedidoForm,
    setPedidoStatusFilter,
    setProdutoForm,
    setQuery,
    setSecretariaForm,
    setTransferenciaForm,
    setTransferenciaStatusFilter,
    setUsuarioForm,
    totalItems,
    totalPedidoValue,
    totalTransferenciaValue,
    transferenciaForm,
    transferenciaStatusFilter,
    transferencias,
    usuarioById,
    usuarioForm,
    usuarios,
  };
}

export type AlmoxarifadoViewModel = ReturnType<typeof useAlmoxarifado>;
