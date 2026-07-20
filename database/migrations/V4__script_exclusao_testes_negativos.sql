-- ARQUIVO: EXCLUSÃO DE GARANTIA (TESTES NEGATIVOS)
-- Nota: Se o banco estiver correto, todos os comandos retornarão 0 linhas afetadas(erros).


-- 1. Limpar itens_pedido_compra e itens_pedido_transferencia
DELETE FROM itens_pedido_compra
WHERE id_item_pedido_compra IN (
    'i1111111-1111-1111-1111-111111111111',
    'i2222222-2222-2222-2222-222222222222'
);

DELETE FROM itens_pedido_transferencia
WHERE id_item_pedido_transferencia IN (
    'g1111111-1111-1111-1111-111111111111'
);

-- 2. Limpar pedidos_compra e pedidos_transferencia
DELETE FROM pedidos_compra
WHERE id_pedido_compra IN (
    'h1111111-1111-1111-1111-111111111111',
    'h2222222-2222-2222-2222-222222222222',
    'h3333333-3333-3333-3333-333333333333'
);

DELETE FROM pedidos_transferencia
WHERE id_pedido_transferencia IN (
    'f1111111-1111-1111-1111-111111111111',
    'f2222222-2222-2222-2222-222222222222'
);

-- 3. Limpar produtos
DELETE FROM produtos
WHERE id_produto IN (
    'e1111111-1111-1111-1111-111111111111',
    'e2222222-2222-2222-2222-222222222222'
);

-- 4. Limpar usuarios
DELETE FROM usuarios
WHERE id_usuario IN (
    'd1111111-1111-1111-1111-111111111111',
    'd2222222-2222-2222-2222-222222222222',
    'd3333333-3333-3333-3333-333333333333',
    'd4444444-4444-4444-4444-444444444444'
);

-- 5. Limpar secretarias
DELETE FROM secretarias
WHERE id_secretaria IN (
    'c1111111-1111-1111-1111-111111111111',
    'c2222222-2222-2222-2222-222222222222'
);
