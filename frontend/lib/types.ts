export type TabId = "painel" | "pedidos" | "itens" | "secretarias" | "usuarios" | "acesso" | "planejamento";

export type ApiMode = "verificando" | "sincronizado" | "local";

export type PedidoCompraStatus =
  | "PENDENTE"
  | "APROVADO"
  | "REJEITADO"
  | "EM_PROCESSAMENTO"
  | "ENTREGUE"
  | "CANCELADO";

export type PedidoStatusFilter = PedidoCompraStatus | "TODOS";

export type TabItem = {
  id: TabId;
  label: string;
};

export type Item = {
  id: string;
  name: string;
  description: string;
  quantity: number;
};

export type Secretaria = {
  id: string;
  nome: string;
  sigla: string;
  endereco: string;
  cep: string;
  createAt?: string;
  createdAt?: string;
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

export type ItemForm = {
  name: string;
  description: string;
  quantity: string;
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
