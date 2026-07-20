import type {
  ItemPedidoTransferencia,
  PedidoCompra,
  PedidoCompraStatus,
  PedidoTransferencia,
  Produto,
  ProdutoStatus,
  ProdutoType,
  Secretaria,
  TabItem,
  TransferenciaStatus,
  Usuario,
} from "@/lib/types";

export const tabs: TabItem[] = [
  { id: "painel", label: "Painel" },
  { id: "pedidos", label: "Compras" },
  { id: "transferencias", label: "Transferências" },
  { id: "itens", label: "Produtos" },
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

export const transferenciaStatuses: TransferenciaStatus[] = ["ABERTO", "ANALISE", "COMPLETO", "CANCELADO"];

export const transferenciaStatusLabels: Record<TransferenciaStatus, string> = {
  ABERTO: "Aberto",
  ANALISE: "Em análise",
  COMPLETO: "Concluído",
  CANCELADO: "Cancelado",
};

export const initialProdutos: Produto[] = [
  {
    id: "local-produto-1",
    nome: "Cadeiras escolares",
    descricao: "Lote disponível para realocação entre unidades municipais.",
    quantidade: 42,
    preco: 189.9,
    status: "USADO",
    type: "COMPRADO",
    usuarioCadastrado: "local-usuario-1",
    secretariaCadastrada: "local-secretaria-1",
  },
  {
    id: "local-produto-2",
    nome: "Computadores administrativos",
    descricao: "Equipamentos revisados para atendimento interno.",
    quantidade: 12,
    preco: 3083.33,
    status: "USADO",
    type: "COMPRADO",
    usuarioCadastrado: "local-usuario-1",
    secretariaCadastrada: "local-secretaria-1",
  },
  {
    id: "local-produto-3",
    nome: "Kits de escritório",
    descricao: "Materiais de consumo para reposição mensal.",
    quantidade: 85,
    preco: 80,
    status: "NOVO",
    type: "DOADO",
    usuarioCadastrado: "local-usuario-2",
    secretariaCadastrada: "local-secretaria-2",
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
    idProduto: "local-produto-2",
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
    idProduto: "local-produto-3",
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

export const initialItensTransferencia: ItemPedidoTransferencia[] = [
  {
    id: "local-item-transferencia-1",
    pedidoTransferencia: "local-transferencia-1",
    produto: "local-produto-1",
    quantidade: 8,
  },
];

export const initialTransferencias: PedidoTransferencia[] = [
  {
    id: "local-transferencia-1",
    descricaoPedido: "Transferência de cadeiras para atender às novas turmas da rede municipal.",
    razaoSocial: "Remanejamento de patrimônio entre unidades da administração municipal.",
    status: "ABERTO",
    motivoCancelamento: null,
    usuarioId: "local-usuario-1",
    secretariaId: "local-secretaria-2",
    itens: initialItensTransferencia,
  },
];

export const planejamento = [
  {
    titulo: "Produtos",
    status: "Integrado",
    detalhe: "Cadastro, listagem e edição conectados às rotas de produtos.",
  },
  {
    titulo: "Pedidos de compra",
    status: "Em integração",
    detalhe: "Tela preparada para criar, listar, filtrar e remover pedidos de compra.",
  },
  {
    titulo: "Transferências",
    status: "Integrado",
    detalhe: "Cadastro, listagem de itens e atualização de status conectados à API.",
  },
  {
    titulo: "Login e permissões",
    status: "Aguardando API",
    detalhe: "Interface reservada; falta o contrato de autenticação no back-end.",
  },
];
