-- ARQUIVO 3: EXCLUSÃO DE DADOS DE TODAS AS TABELAS (ORDEM INVERSA PARA EVITAR DEPENDENCIAS DE RELACIONAMENTOS)

-- 1. Limpar as tabelas de itens (dependentes dos pedidos e produtos)
DELETE FROM itens_pedido_compra;
DELETE FROM itens_pedido_transferencia;


-- 2. Limpar os pedidos (dependentes de usuários e secretarias)
DELETE FROM pedidos_compra;
DELETE FROM pedidos_transferencia;


-- 3. Limpar produtos (dependente de usuários e secretarias)
DELETE FROM produtos;


-- 4. Limpar usuários (dependente de secretarias)
DELETE FROM usuarios;


-- 5. Limpar a tabela base
DELETE FROM secretarias;
