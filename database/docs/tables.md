# Dicionário de Tabelas

Este documento apresenta a especificação detalhada de todas as tabelas do sistema Almoxarifado Compartilhado,detalhando campo a campo com seus respectivos tipos,restrições e finalidade técnica no PostgreSQL.

---

## Tipos Personalizados (ENUMs)

- **`cargo_usuario_cadastrado`**: `'ROLE_USER'`, `'ROLE_ADMIN'`
- **`status_produto`**: `'Novo'`, `'Usado'`, `'Gasto'`, `'Velho'`
- **`tipo_produto`**: `'Doado'`, `'Comprado'`
- **`status_pedido_trasferencia`**: `'Aberto'`, `'Analise'`, `'Completo'`, `'Cancelado'`
- **`status_pedido_compra`**: `'Aberto'`, `'Pago'`, `'Cancelado'`


## Tabela: `secretarias`
Armazena os dados das secretarias cadastradas no sistema.

| Coluna | Tipo PostgreSQL | Restrições | Descrição |
| :--- | :--- | :--- | :--- |
| **id_secretaria** | UUID | PK, NOT NULL | Identificador único da secretaria. |
| **nome_secretaria** | VARCHAR(150) | NOT NULL | Nome da secretaria. |
| **sigla** | VARCHAR(10) | NOT NULL, UNIQUE | Sigla da secretaria (única). |
| **endereco** | VARCHAR(255) | NOT NULL | Endereço físico da secretaria. |
| **cep** | VARCHAR(8) | NOT NULL | CEP da secretaria. |
| **creadoEm** | TIMESTAMPTZ | NOT NULL | Data e hora de criação. |
| **atualizadoEm** | TIMESTAMPTZ | NOT NULL | Data e hora da última atualização. |
---

## Tabela: `usuarios`
Armazena os dados dos usuários cadastrados no sistema.

| Coluna | Tipo PostgreSQL | Restrições | Descrição |
| :--- | :--- | :--- | :--- |
| **id_usuario** | UUID | PK, NOT NULL | Chave primária do usuário. |
| **nome_usuario** | VARCHAR(100) | NOT NULL | Nome do usuário. |
| **cpf_usuario** | CHAR(11) | NOT NULL, UNIQUE | CPF contendo 11 caracteres. |
| **email_usuario** | VARCHAR(150) | NOT NULL, UNIQUE | E-mail de cadastro/login. |
| **senha** | VARCHAR(255) | NOT NULL | Hash da senha. |
| **id_secretaria** | UUID | FK, NOT NULL | Referência à tabela `secretarias`. |
| **cargo** | ENUM (`cargo_usuario_cadastrado`) | NOT NULL | Cargo do usuário (`ROLE_USER`, `ROLE_ADMIN`). |
| **creadoEm** | TIMESTAMPTZ | NOT NULL | Data e hora de criação. |
| **atualizadoEm** | TIMESTAMPTZ | NOT NULL | Data e hora da última atualização. |

---

## Tabela: `produtos`
Armazena o acervo e produtos do estoque.

| Coluna | Tipo PostgreSQL | Restrições | Descrição |
| :--- | :--- | :--- | :--- |
| **id_produto** | UUID | PK, NOT NULL | Chave primária do produto. |
| **nome_produto** | VARCHAR(150) | NOT NULL | Nome do produto. |
| **descricao** | TEXT | NOT NULL | Descrição do produto. |
| **quantidade** | NUMERIC(12,3) | NOT NULL, CHECK | Quantidade em estoque (deve ser > 0). |
| **preco** | NUMERIC(10,2) | NOT NULL, CHECK | Preço do produto (deve ser > 0). |
| **creadoEm** | TIMESTAMPTZ | NOT NULL | Data e hora de criação. |
| **atualizadoEm** | TIMESTAMPTZ | NOT NULL | Data e hora de atualização. |
| **status** | ENUM (`status_produto`) | NOT NULL | Estado do item (`Novo`, `Usado`, `Gasto`, `Velho`). |
| **tipo** | ENUM (`tipo_produto`) | NOT NULL | Tipo de aquisição (`Doado`, `Comprado`). |
| **id_usuario_cadastrado** | UUID | FK, NOT NULL | Referência ao usuário que cadastrou (`usuarios`). |
| **id_secretaria_cadastrada** | UUID | FK, NOT NULL | Referência à secretaria responsável (`secretarias`). |

---

## Tabela: `pedidos_transferencia`
Registra os pedidos de transferência de estoque.

| Coluna | Tipo PostgreSQL | Restrições | Descrição |
| :--- | :--- | :--- | :--- |
| **id_pedido_transferencia** | UUID | PK, NOT NULL | Chave primária da transferência. |
| **descricao_pedido** | VARCHAR(255) | NOT NULL | Descrição/justificativa do pedido. |
| **razao_social** | VARCHAR(150) | NOT NULL | Razão social envolvida. |
| **status** | ENUM (`status_pedido_trasferencia`) | NOT NULL | Status do pedido (`Aberto`, `Analise`, `Completo`, `Cancelado`). |
| **id_usuario** | UUID | FK, NOT NULL | Solicitante (`usuarios`). |
| **id_secretaria** | UUID | FK, NOT NULL | Secretaria de destino (`secretarias`). |
| **motivo_cancelamento** | VARCHAR(255) | NULL, CHECK | Preenchimento obrigatório apenas se o status for `Cancelado`. |

---

## Tabela: `itens_pedido_transferencia`
Relação de itens vinculados a um pedido de transferência.

| Coluna | Tipo PostgreSQL | Restrições | Descrição |
| :--- | :--- | :--- | :--- |
| **id_item_pedido_transferencia** | UUID | PK, NOT NULL | Chave primária do item da transferência. |
| **id_pedido_transferencia** | UUID | FK, NOT NULL | Chave estrangeira para `pedidos_transferencia` (ON DELETE CASCADE). |
| **id_produto** | UUID | FK, NOT NULL | Chave estrangeira para `produtos`. |
| **quantidade** | NUMERIC(12,3) | NOT NULL, CHECK | Quantidade transferida (deve ser > 0). |

---

## Tabela: `pedidos_compra`
Registra os pedidos de aquisição/compra de materiais.

| Coluna | Tipo PostgreSQL | Restrições | Descrição |
| :--- | :--- | :--- | :--- |
| **id_pedido_compra** | UUID | PK, NOT NULL | Chave primária do pedido de compra. |
| **preco** | NUMERIC(10,2) | NOT NULL, CHECK | Valor total do pedido (deve ser > 0). |
| **status** | ENUM (`status_pedido_compra`) | NOT NULL | Status do pedido (`Aberto`, `Pago`, `Cancelado`). |
| **id_usuario** | UUID | FK, NOT NULL | Usuário solicitante (`usuarios`). |
| **id_secretaria** | UUID | FK, NOT NULL | Secretaria receptora (`secretarias`). |
| **creadoEm** | TIMESTAMPTZ | NOT NULL | Data e hora da criação do pedido. |
| **motivo_cancelamento** | VARCHAR(255) | NULL, CHECK | Preenchimento obrigatório apenas se o status for `Cancelado`. |

---

## Tabela: `itens_pedido_compra`
Relação de itens vinculados a um pedido de compra.

| Coluna | Tipo PostgreSQL | Restrições | Descrição |
| :--- | :--- | :--- | :--- |
| **id_item_pedido_compra** | UUID | PK, NOT NULL | Chave primária do item do pedido de compra. |
| **id_pedido_compra** | UUID | FK, NOT NULL | Chave estrangeira para `pedidos_compra` (ON DELETE CASCADE). |
| **id_produto** | UUID | FK, NOT NULL | Chave estrangeira para `produtos`. |
| **quantidade** | NUMERIC(12,3) | NOT NULL, CHECK | Quantidade comprada (deve ser > 0). |
| **preco** | NUMERIC(10,2) | NOT NULL, CHECK | Preço unitário praticado no item (deve ser > 0). |

