-- ARQUIVO 2: INSERÇÃO DE DADOS POPULACIONAIS DE TESTES NAS TABELAS DEPENDENTES (COM FK)


-- 1. Inserir Usuários (Depende de secretarias)
INSERT INTO usuarios (id_usuario, nome_usuario, cpf_usuario, email_usuario, senha, id_secretaria, cargo, creadoEm,
atualizadoEm)
VALUES

--Criação de Usuários com cargo ROLE_ADMIN
    ('33333333-3333-3333-3333-333333333333', 'João Silva', '11122233344', 'joao.silva@teste.com', 'senha_hash_123',
    '11111111-1111-1111-1111-111111111111', 'ROLE_ADMIN', NOW(), NOW()),

--Criação de Usuários com cargo ROLE_USER
    ('44444444-4444-4444-4444-444444444444', 'Maria Oliveira', '55566677788', 'maria.oliveira@teste.com',
    'senha_hash_456', '22222222-2222-2222-2222-222222222222', 'ROLE_USER', NOW(), NOW());


-- 2. Inserir Produtos (Depende de secretarias e usuarios)
INSERT INTO produtos (id_produto, nome_produto, descricao, quantidade, preco, createdAt, updatedAt, status,
tipo, id_usuario_cadastrado, id_secretaria_cadastrada)
VALUES

--Criação de Produtos com status 'Comprado'
    ('55555555-5555-5555-5555-555555555555', 'Monitor Dell 24', 'Monitor IPS Full HD', 15.000, 1200.50,
    NOW(), NOW(), 'Novo', 'Comprado', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111'),

--Criação de Produtos com status 'Usado' e tipo 'Doado'
    ('66666666-6666-6666-6666-666666666666', 'Cadeira de Escritório', 'Cadeira ergonômica ajustável', 5.000, 850.00,
    NOW(), NOW(), 'Usado', 'Doado', '44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222');


-- 3. Inserir Pedidos de Transferência (Depende de secretarias e usuarios)
INSERT INTO pedidos_transferencia (id_pedido_transferencia, descricao_pedido, razao_social, status, id_usuario,
id_secretaria, motivo_cancelamento)
VALUES

    -- Status Aberto (motivo_cancelamento DEVE ser NULL)
    ('77777777-7777-7777-7777-777777777777', 'Transferência de Monitores', 'Logística Rápida LTDA', 'Aberto',
    '33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', NULL),

    -- Status Cancelado (motivo_cancelamento DEVE ser preenchido)
    ('88888888-8888-8888-8888-888888888888', 'Transferência de Cadeiras', 'Transportes Nacionais LTDA', 'Cancelado',
    '44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'Falta de estoque no momento');


-- 4. Inserir Itens do Pedido de Transferência (Depende de pedidos_transferencia e produtos)
INSERT INTO itens_pedido_transferencia (id_item_pedido_transferencia, id_pedido_transferencia, id_produto, quantidade)
VALUES
    ('99999999-9999-9999-9999-999999999999', '77777777-7777-7777-7777-777777777777', '55555555-5555-5555-5555-555555555555',
    2.000);


-- 5. Inserir Pedidos de Compra (Depende de secretarias e usuarios)
INSERT INTO pedidos_compra (id_pedido_compra, preco, status, id_usuario, id_secretaria, creadoEm, motivo_cancelamento)
VALUES
    -- Status Pago (motivo_cancelamento DEVE ser NULL)
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 2401.00, 'Pago', '33333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111', NOW(), NULL);


-- 6. Inserir Itens do Pedido de Compra (Depende de pedidos_compra e produtos)
INSERT INTO itens_pedido_compra (id_item_pedido_compra, id_pedido_compra, id_produto, quantidade, preco)
VALUES
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555',
    2.000, 1200.50);
