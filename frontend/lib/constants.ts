import type { PedidoCompraStatus, ProdutoStatus, ProdutoType, TabId, TransferenciaStatus } from "./types";

export const tabs: { id: TabId; label: string }[] = [
  { id: "painel", label: "Painel" },
  { id: "pedidos", label: "Pedidos" },
  { id: "transferencias", label: "Transferências" },
  { id: "itens", label: "Estoque" },
  { id: "secretarias", label: "Secretarias" },
  { id: "usuarios", label: "Usuários" },
  { id: "acesso", label: "Conta" },
];

export const pedidoStatuses: PedidoCompraStatus[] = ["PENDENTE", "APROVADO", "REJEITADO", "EM_PROCESSAMENTO", "ENTREGUE", "CANCELADO"];

export const statusLabels: Record<PedidoCompraStatus, string> = {
  PENDENTE: "Pendente",
  APROVADO: "Aprovado",
  REJEITADO: "Rejeitado",
  EM_PROCESSAMENTO: "Em processamento",
  ENTREGUE: "Entregue",
  CANCELADO: "Cancelado",
};

export const transferenciaStatuses: TransferenciaStatus[] = [
  "ABERTO",
  "ANALISE",
  "COMPLETO",
  "CANCELADO",
];

export const transferenciaStatusLabels: Record<TransferenciaStatus, string> = {
  ABERTO: "Aberto",
  ANALISE: "Em análise",
  COMPLETO: "Completo",
  CANCELADO: "Cancelado",
};

export const categoriasList = [
  "Material de Limpeza",
  "Material de Escritório",
  "Material de Informática",
  "Equipamentos",
  "Móveis",
];

export const unidadesMedidaList = [
  "UNIDADE",
  "CAIXA",
  "PACOTE",
  "GALÃO",
  "LITRO",
  "QUILO",
];

export const produtoStatuses: ProdutoStatus[] = ["NOVO", "USADO", "GASTO", "VELHO"];

export const produtoStatusLabels: Record<ProdutoStatus, string> = {
  NOVO: "Novo",
  USADO: "Usado",
  GASTO: "Gasto",
  VELHO: "Velho",
};

export const produtoTypes: ProdutoType[] = ["COMPRADO", "DOADO"];

export const produtoTypeLabels: Record<ProdutoType, string> = {
  COMPRADO: "Comprado",
  DOADO: "Doado",
};
