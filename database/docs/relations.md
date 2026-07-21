# Mapeamento de Relações e Junções (JOINs)

Este documento detalha como as tabelas do sistema se comunicam através de chaves estrangeiras (Foreign Keys) e fornece exemplos práticos de consultas SQL (snippets) baseados na estrutura do banco.

---

## 1. Usuários e Secretarias (Lotação)
Todo usuário no sistema pertence obrigatoriamente a uma secretaria (Relação 1:N).
*   **Chave Estrangeira:** `usuarios.id_secretaria` aponta para `secretarias.id_secretaria`.
*   **Regra SQL:** `ON DELETE RESTRICT` (Não é possível apagar uma secretaria se existirem usuários nela).

### Snippet de Exemplo: Buscar usuários com informações da sua secretaria
```sql
SELECT 
    u.id_usuario, 
    u.nome_usuario, 
    u.email_usuario, 
    s.nome_secretaria, 
    s.sigla 
FROM usuarios u 
INNER JOIN secretarias s ON u.id_secretaria = s.id_secretaria;
```

---

## 2. Catálogo de Produtos vs. Responsáveis
Um produto sempre registra quem foi o usuário que o cadastrou e qual secretaria é responsável pelo lote (Relação 1:N).
*   **Chaves Estrangeiras:**
    *   `produtos.id_usuario_cadastrado` aponta para `usuarios.id_usuario`.
    *   `produtos.id_secretaria_cadastrada` aponta para `secretarias.id_secretaria`.

### Snippet de Exemplo: Consultar o estoque com o responsável pelo cadastro e a secretaria dona
```sql
SELECT 
    p.id_produto,
    p.nome_produto,
    p.quantidade,
    p.preco,
    p.status,
    u.nome_usuario AS cadastrado_por,
    s.sigla AS secretaria_gestora
FROM produtos p
INNER JOIN usuarios u ON p.id_usuario_cadastrado = u.id_usuario
INNER JOIN secretarias s ON p.id_secretaria_cadastrada = s.id_secretaria;
```

---

## 3. Fluxo de Pedidos de Compra
Um pedido de compra conecta o cabeçalho (`pedidos_compra`) aos seus múltiplos itens (`itens_pedido_compra`), além de identificar quem comprou e para onde vai o material.
*   **Chaves Estrangeiras em `pedidos_compra`:** 
    *   `id_usuario` -> `usuarios.id_usuario`
    *   `id_secretaria` -> `secretarias.id_secretaria`
*   **Chaves Estrangeiras em `itens_pedido_compra`:** 
    *   `id_pedido_compra` -> `pedidos_compra.id_pedido_compra` (`ON DELETE CASCADE`)
    *   `id_produto` -> `produtos.id_produto`

### Snippet de Exemplo: Detalhamento completo de um pedido de compra com itens associados
```sql
SELECT 
    pc.id_pedido_compra,
    pc.status,
    pc.preco AS total_pedido,
    u.nome_usuario AS solicitante,
    s.nome_secretaria AS secretaria_destino,
    pr.nome_produto,
    ipc.quantidade,
    ipc.preco AS preco_unitario_compra
FROM pedidos_compra pc
INNER JOIN usuarios u ON pc.id_usuario = u.id_usuario
INNER JOIN secretarias s ON pc.id_secretaria = s.id_secretaria
INNER JOIN itens_pedido_compra ipc ON pc.id_pedido_compra = ipc.id_pedido_compra
INNER JOIN produtos pr ON ipc.id_produto = pr.id_produto
WHERE pc.id_pedido_compra = 'insira-o-uuid-aqui';
```

---

## 4. Fluxo de Pedidos de Transferência
Um pedido de transferência vincula a logística de estoque entre a origem/destino aos materiais em trânsito.
*   **Chaves Estrangeiras em `pedidos_transferencia`:** 
    *   `id_usuario` -> `usuarios.id_usuario`
    *   `id_secretaria` -> `secretarias.id_secretaria`
*   **Chaves Estrangeiras em `itens_pedido_transferencia`:** 
    *   `id_pedido_transferencia` -> `pedidos_transferencia.id_pedido_transferencia` (`ON DELETE CASCADE`)
    *   `id_produto` -> `produtos.id_produto`

### Snippet de Exemplo: Listar transferências ativas e os materiais movimentados
```sql
SELECT 
    pt.id_pedido_transferencia,
    pt.status,
    s.nome_secretaria AS destino,
    pr.nome_produto,
    ipt.quantidade AS qtde_transferida
FROM pedidos_transferencia pt
INNER JOIN secretarias s ON pt.id_secretaria = s.id_secretaria
INNER JOIN itens_pedido_transferencia ipt ON pt.id_pedido_transferencia = ipt.id_pedido_transferencia
INNER JOIN produtos pr ON ipt.id_produto = pr.id_produto
WHERE pt.status IN ('Aberto', 'Analise');
```
