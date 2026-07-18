"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { backendRequest } from "@/lib/api";
import { createLocalId } from "@/lib/formatters";
import { initialItems, initialPedidos, initialSecretarias, initialUsuarios } from "@/lib/mock-data";
import type {
  ApiMode,
  Item,
  ItemForm,
  PedidoCompra,
  PedidoCompraForm,
  PedidoCompraStatus,
  PedidoStatusFilter,
  Secretaria,
  SecretariaForm,
  TabId,
  Usuario,
  UsuarioForm,
} from "@/lib/types";

export function useAlmoxarifado() {
  const [activeTab, setActiveTab] = useState<TabId>("painel");
  const [items, setItems] = useState<Item[]>(initialItems);
  const [secretarias, setSecretarias] = useState<Secretaria[]>(initialSecretarias);
  const [usuarios, setUsuarios] = useState<Usuario[]>(initialUsuarios);
  const [pedidos, setPedidos] = useState<PedidoCompra[]>(initialPedidos);
  const [apiMode, setApiMode] = useState<ApiMode>("verificando");
  const [notice, setNotice] = useState("Conectando aos serviços do almoxarifado.");
  const [query, setQuery] = useState("");
  const [pedidoStatusFilter, setPedidoStatusFilter] = useState<PedidoStatusFilter>("TODOS");

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

  const [pedidoForm, setPedidoForm] = useState<PedidoCompraForm>({
    idProduto: initialItems[0]?.id ?? "",
    nomeProduto: initialItems[0]?.name ?? "",
    descricaoProduto: initialItems[0]?.description ?? "",
    descricaoPedido: "",
    quantidade: "",
    preco: "",
    idUsuario: initialUsuarios[0]?.id ?? "",
    idSecretaria: initialSecretarias[0]?.id ?? "",
  });

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      const [itemsResult, secretariasResult, usuariosResult, pedidosResult] = await Promise.allSettled([
        backendRequest<Item[]>("/items"),
        backendRequest<Secretaria[]>("/v1/secretarias"),
        backendRequest<Usuario[]>("/v1/users"),
        backendRequest<PedidoCompra[]>("/api/pedidos-compra"),
      ]);

      if (ignore) {
        return;
      }

      const loadedSomething =
        itemsResult.status === "fulfilled" ||
        secretariasResult.status === "fulfilled" ||
        usuariosResult.status === "fulfilled" ||
        pedidosResult.status === "fulfilled";

      if (itemsResult.status === "fulfilled") {
        setItems(itemsResult.value);
        setPedidoForm((current) => {
          const selected = itemsResult.value.find((item) => item.id === current.idProduto) ?? itemsResult.value[0];

          return selected
            ? {
                ...current,
                idProduto: selected.id,
                nomeProduto: selected.name,
                descricaoProduto: selected.description,
              }
            : current;
        });
      }

      if (secretariasResult.status === "fulfilled") {
        setSecretarias(secretariasResult.value);
        setUsuarioForm((current) => ({
          ...current,
          siglaSecretaria: current.siglaSecretaria || secretariasResult.value[0]?.sigla || "",
        }));
        setPedidoForm((current) => ({
          ...current,
          idSecretaria:
            secretariasResult.value.find((secretaria) => secretaria.id === current.idSecretaria)?.id ||
            secretariasResult.value[0]?.id ||
            "",
        }));
      }

      if (usuariosResult.status === "fulfilled") {
        setUsuarios(usuariosResult.value);
        setPedidoForm((current) => ({
          ...current,
          idUsuario:
            usuariosResult.value.find((usuario) => usuario.id === current.idUsuario)?.id ||
            usuariosResult.value[0]?.id ||
            "",
        }));
      }

      if (pedidosResult.status === "fulfilled") {
        setPedidos(pedidosResult.value);
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

    return items.filter((item) => `${item.name} ${item.description}`.toLowerCase().includes(value));
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

  const itemById = useMemo(() => new Map(items.map((item) => [item.id, item])), [items]);
  const usuarioById = useMemo(() => new Map(usuarios.map((usuario) => [usuario.id, usuario])), [usuarios]);
  const secretariaById = useMemo(
    () => new Map(secretarias.map((secretaria) => [secretaria.id, secretaria])),
    [secretarias],
  );

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

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const lowStock = items.filter((item) => item.quantity <= 15).length;
  const pendingPedidos = pedidos.filter((pedido) => pedido.status === "PENDENTE").length;
  const totalPedidoValue = pedidos.reduce((acc, pedido) => acc + pedido.preco, 0);
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
      setNotice(
        error instanceof Error ? `${error.message} Registro mantido localmente.` : "Registro mantido localmente.",
      );
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
      setNotice(
        error instanceof Error ? `${error.message} Secretaria mantida localmente.` : "Secretaria mantida localmente.",
      );
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

  function handlePedidoProdutoChange(idProduto: string) {
    const item = itemById.get(idProduto);

    setPedidoForm((current) => ({
      ...current,
      idProduto,
      nomeProduto: item?.name ?? current.nomeProduto,
      descricaoProduto: item?.description ?? current.descricaoProduto,
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
      Number.isNaN(payload.quantidade) ||
      payload.quantidade <= 0 ||
      Number.isNaN(payload.preco) ||
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
      setPedidos((current) => [
        {
          ...payload,
          idPedidoCompra: createLocalId("pedido"),
        },
        ...current,
      ]);
      setApiMode("local");
      setNotice(error instanceof Error ? `${error.message} Pedido mantido localmente.` : "Pedido mantido localmente.");
    }

    setPedidoForm((current) => ({
      ...current,
      descricaoPedido: "",
      quantidade: "",
      preco: "",
    }));
  }

  async function handleDeletePedido(idPedidoCompra: string) {
    try {
      await backendRequest<void>(`/api/pedidos-compra/${idPedidoCompra}`, {
        method: "DELETE",
      });

      setPedidos((current) => current.filter((pedido) => pedido.idPedidoCompra !== idPedidoCompra));
      setApiMode("sincronizado");
      setNotice("Pedido removido da API.");
    } catch (error) {
      setPedidos((current) => current.filter((pedido) => pedido.idPedidoCompra !== idPedidoCompra));
      setApiMode("local");
      setNotice(error instanceof Error ? `${error.message} Pedido removido localmente.` : "Pedido removido localmente.");
    }
  }

  return {
    activeTab,
    apiStatusLabel,
    filteredItems,
    filteredPedidos,
    filteredSecretarias,
    filteredUsuarios,
    handleCreateItem,
    handleCreatePedido,
    handleCreateSecretaria,
    handleCreateUsuario,
    handleDeletePedido,
    handlePedidoProdutoChange,
    itemForm,
    items,
    lowStock,
    notice,
    pedidoForm,
    pedidoStatusFilter,
    pedidos,
    pendingPedidos,
    query,
    secretariaById,
    secretariaForm,
    secretarias,
    setActiveTab,
    setItemForm,
    setPedidoForm,
    setPedidoStatusFilter,
    setQuery,
    setSecretariaForm,
    setUsuarioForm,
    totalItems,
    totalPedidoValue,
    usuarioById,
    usuarioForm,
    usuarios,
  };
}

export type AlmoxarifadoViewModel = ReturnType<typeof useAlmoxarifado>;
