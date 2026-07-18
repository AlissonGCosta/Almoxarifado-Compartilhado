import type { Item, PedidoCompra, PedidoCompraStatus, Secretaria, TabItem, Usuario } from "@/lib/types";

export const tabs: TabItem[] = [
  { id: "painel", label: "Painel" },
  { id: "pedidos", label: "Pedidos" },
  { id: "itens", label: "Itens" },
  { id: "secretarias", label: "Secretarias" },
  { id: "usuarios", label: "Usuários" },
  { id: "acesso", label: "Acesso" },
  { id: "planejamento", label: "Planejamento" },
];

export const pedidoStatuses: PedidoCompraStatus[] = [
  "PENDENTE",
  "APROVADO",
  "REJEITADO",
  "EM_PROCESSAMENTO",
  "ENTREGUE",
  "CANCELADO",
];

export const statusLabels: Record<PedidoCompraStatus, string> = {
  PENDENTE: "Pendente",
  APROVADO: "Aprovado",
  REJEITADO: "Rejeitado",
  EM_PROCESSAMENTO: "Em processamento",
  ENTREGUE: "Entregue",
  CANCELADO: "Cancelado",
};

export const initialItems: Item[] = [
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
    name: "Kits de escritório",
    description: "Materiais de consumo para reposição mensal.",
    quantity: 85,
  },
];

export const initialSecretarias: Secretaria[] = [
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

export const initialUsuarios: Usuario[] = [
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

export const initialPedidos: PedidoCompra[] = [
  {
    idPedidoCompra: "local-pedido-1",
    idProduto: "local-item-2",
    nomeProduto: "Computadores administrativos",
    descricaoProduto: "Equipamentos para renovação de postos administrativos.",
    descricaoPedido: "Pedido de reposição para atendimento das unidades com maior demanda.",
    quantidade: 6,
    preco: 18500,
    status: "PENDENTE",
    idUsuario: "local-usuario-1",
    idSecretaria: "local-secretaria-1",
  },
  {
    idPedidoCompra: "local-pedido-2",
    idProduto: "local-item-3",
    nomeProduto: "Kits de escritório",
    descricaoProduto: "Materiais de consumo para expediente.",
    descricaoPedido: "Compra consolidada para reposição mensal das secretarias participantes.",
    quantidade: 40,
    preco: 3200,
    status: "APROVADO",
    idUsuario: "local-usuario-2",
    idSecretaria: "local-secretaria-2",
  },
];

export const planejamento = [
  {
    titulo: "Produtos completos",
    status: "Planejado",
    detalhe: "Preço, tipo, status, usuário responsável e secretaria vinculada.",
  },
  {
    titulo: "Pedido de compra",
    status: "Em integração",
    detalhe: "Tela já preparada para criar, listar, filtrar e remover pedidos.",
  },
  {
    titulo: "Transferências",
    status: "Aguardando API",
    detalhe: "Solicitação, análise de estoque e conclusão entre secretarias.",
  },
  {
    titulo: "Login e permissões",
    status: "Recomendado",
    detalhe: "Interface reservada; falta contrato de autenticação no back-end.",
  },
];
