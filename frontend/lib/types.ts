export type TabId =
  | "painel"
  | "pedidos"
  | "transferencias"
  | "itens"
  | "secretarias"
  | "usuarios"
  | "acesso";

export type ApiMode = "verificando" | "sincronizado" | "local";

export type AuthResponse = {
  name: string;
  email: string;
  token: string;
};

export type AuthSession = {
  name: string;
  email: string;
  token: string;
  userId?: string;
  role?: string;
  expiresAt?: number;
};

export type LoginForm = {
  email: string;
  password: string;
};

export type PasswordForm = {
  senhaAtual: string;
  senhaNova: string;
  confirmarSenha: string;
};

export type PedidoCompraStatus =
  | "PENDENTE"
  | "APROVADO"
  | "REJEITADO"
  | "EM_PROCESSAMENTO"
  | "ENTREGUE"
  | "CANCELADO";

export type PedidoStatusFilter = PedidoCompraStatus | "TODOS";

export type ProdutoStatus = "NOVO" | "USADO" | "GASTO" | "VELHO";

export type ProdutoType = "DOADO" | "COMPRADO";

export type TransferenciaStatus = "ABERTO" | "ANALISE" | "COMPLETO" | "CANCELADO";

export type TransferenciaStatusFilter = TransferenciaStatus | "TODOS";

export type TabItem = {
  id: TabId;
  label: string;
};

export type Produto = {
  id: string;
  nome: string;
  descricao: string;
  quantidade: number;
  preco: number;
  status: ProdutoStatus;
  type: ProdutoType;
  usuarioCadastrado: string;
  secretariaCadastrada: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Secretaria = {
  id: string;
  nome: string;
  sigla: string;
  endereco: string;
  cep: string;
  createAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Usuario = {
  id: string;
  siglaSecretaria: string;
  nome: string;
  email: string;
  creatAt?: string;
  createdAt?: string;
  roles: string;
};

export type PedidoCompra = {
  idPedidoCompra: string;
  idProduto: string;
  nomeProduto: string;
  descricaoProduto?: string;
  descricaoPedido?: string;
  quantidade: number;
  preco: number;
  status: PedidoCompraStatus;
  idUsuario: string;
  idSecretaria: string;
  motivoCancelamento?: string;
};

export type ItemPedidoTransferencia = {
  id: string;
  pedidoTransferencia: string;
  produto: string;
  quantidade: number;
};

export type PedidoTransferencia = {
  id: string;
  descricaoPedido: string;
  razaoSocial: string;
  status: TransferenciaStatus;
  motivoCancelamento?: string | null;
  usuarioId: string;
  secretariaId: string;
  itens: ItemPedidoTransferencia[];
};

export type ProdutoForm = {
  nome: string;
  descricao: string;
  quantidade: string;
  preco: string;
  status: ProdutoStatus;
  type: ProdutoType;
  usuarioCadastrado: string;
  secretariaCadastrada: string;
};

export type SecretariaForm = {
  nome: string;
  sigla: string;
  endereco: string;
  cep: string;
};

export type UsuarioForm = {
  siglaSecretaria: string;
  nome: string;
  email: string;
  cpf: string;
  senha: string;
};

export type PedidoCompraForm = {
  idProduto: string;
  nomeProduto: string;
  descricaoProduto: string;
  descricaoPedido: string;
  quantidade: string;
  preco: string;
  idUsuario: string;
  idSecretaria: string;
};

export type ItemTransferenciaForm = {
  produtoId: string;
  quantidade: string;
};

export type PedidoTransferenciaForm = {
  descricaoPedido: string;
  razaoSocial: string;
  usuarioId: string;
  secretariaId: string;
  itens: ItemTransferenciaForm[];
};
