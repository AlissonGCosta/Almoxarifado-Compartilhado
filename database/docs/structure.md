# Arquitetura e Domínios do Banco de Dados

O ecossistema do banco de dados do Almoxarifado Compartilhado é estruturado sob o conceito de domínios organizacionais (estilo DDD - Domain-Driven Design). As regras descritas abaixo refletem as constraints, relacionamentos e enums aplicados fisicamente no SQL do projeto.

---

## 1. Domínio de Acesso e Gestão Institucional
- **Composição:** Tabelas `secretarias` e `usuarios`.
- **Propósito:** Gerenciar a identidade dos atores do sistema e o organograma das secretarias.
- **Regras Críticas (SQL):**
  - **Identidade Única:** Proteção via constraint `UNIQUE` nos campos `cpf_usuario` e `email_usuario`.
  - **Autorização Nativas:** Utilização do ENUM `cargo_usuario_cadastrado` (`ROLE_USER`, `ROLE_ADMIN`) para restringir os privilégios dentro do banco.
  - **Pertencimento Institucional:** Integridade referencial obrigatória onde todo usuário precisa estar atrelado a uma chave de `secretarias`.

---

## 2. Domínio de Estoque e Catálogo (Core Domain)
- **Composição:** Tabela `produtos`.
- **Propósito:** O coração do projeto. Mantém o inventário e as características dos materiais físicos.
- **Regras Críticas (SQL):**
  - **Consistência de Valores:** Constraints `CHECK(quantidade > 0)` e `CHECK(preco > 0)` bloqueiam inserções de estoque ilógico (valores zerados ou negativos).
  - **Rastreabilidade e Origem:** Tipificação forte controlada pelos ENUMs `status_produto` (`Novo`, `Usado`, `Gasto`, `Velho`) e `tipo_produto` (`Doado`, `Comprado`).
  - **Auditoria de Cadastro:** Relacionamento obrigatório indicando o usuário criador e a secretaria detentora.

---

## 3. Domínio de Movimentação e Logística
- **Composição:** Tabelas `pedidos_transferencia` e `itens_pedido_transferencia`.
- **Propósito:** Controlar o fluxo interno de distribuição de materiais entre secretarias.
- **Regras Críticas (SQL):**
  - **Ciclo de Vida Fechado:** Os estados do pedido são validados exclusivamente pelo ENUM `status_pedido_trasferencia` (`Aberto`, `Analise`, `Completo`, `Cancelado`).
  - **Cancelamento Condicional:** Regra de negócio gravada via `CHECK`. O campo `motivo_cancelamento` só aceita dados se o status for `'Cancelado'`, sendo obrigatoriamente `NULL` nos outros estados.
  - **Deleção em Cascata:** Relacionamento `ON DELETE CASCADE` garante que itens órfãos não existam caso o pedido principal seja excluído.

---

## 4. Domínio de Aquisições e Compras
- **Composição:** Tabelas `pedidos_compra` e `itens_pedido_compra`.
- **Propósito:** Governa a requisição e pagamento de insumos novos.
- **Regras Críticas (SQL):**
  - **Proteção Financeira:** Restrições de `CHECK` em cabeçalho e itens garantindo preços maiores que zero.
  - **Deleção em Cascata:** Preservação da integridade estrutural excluindo os itens caso a requisição de compra caia (`ON DELETE CASCADE`).
  - **Cancelamento Condicional:** Mesmo mecanismo aplicado às transferências. Um `CHECK` valida a sintonia entre o status (`Aberto`, `Pago`, `Cancelado`) e a presença do `motivo_cancelamento`.
