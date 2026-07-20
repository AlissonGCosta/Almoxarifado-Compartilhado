-- ARQUIVO DE TESTES NEGATIVOS (TODOS OS INSERTS DEVEM FALHAR)

-- 1. TESTES NA TABELA: secretarias

-- Falha: Violação de UNIQUE (Tentando usar uma sigla que já existe 'SEC-TEC')
INSERT INTO secretarias (id_secretaria, nome_secretaria, sigla, endereco, cep, creadoEm, atualizadoEm)
VALUES ('c1111111-1111-1111-1111-111111111111', 'Secretaria Falsa', 'SEC-TEC', 'Rua Y', '00000000', NOW(), NOW());

-- Falha: Violação de NOT NULL (nome_secretaria não pode ser nulo)
INSERT INTO secretarias (id_secretaria, nome_secretaria, sigla, endereco, cep, creadoEm, atualizadoEm)
VALUES ('c2222222-2222-2222-2222-222222222222', NULL, 'SEC-FAL', 'Rua Y', '00000000', NOW(), NOW());


-- 2. TESTES NA TABELA: usuarios

-- Falha: Violação de UNIQUE (Tentando cadastrar um CPF já existente)
INSERT INTO usuarios (id_usuario, nome_usuario, cpf_usuario, email_usuario, senha, id_secretaria, cargo, creadoEm, atualizadoEm)
VALUES ('d1111111-1111-1111-1111-111111111111', 'Clone CPF', '11122233344', 'novo@teste.com', '123',
'11111111-1111-1111-1111-111111111111', 'ROLE_USER', NOW(), NOW());

-- Falha: Violação de UNIQUE (Tentando cadastrar um Email já existente)
INSERT INTO usuarios (id_usuario, nome_usuario, cpf_usuario, email_usuario, senha, id_secretaria, cargo, creadoEm, atualizadoEm)
VALUES ('d2222222-2222-2222-2222-222222222222', 'Clone Email', '00000000000', 'joao.silva@teste.com', '123',
'11111111-1111-1111-1111-111111111111', 'ROLE_USER', NOW(), NOW());

-- Falha: Violação de FOREIGN KEY (id_secretaria não existe na tabela secretarias)
INSERT INTO usuarios (id_usuario, nome_usuario, cpf_usuario, email_usuario, senha, id_secretaria, cargo, creadoEm, atualizadoEm)
VALUES ('d3333333-3333-3333-3333-333333333333', 'Sem Sec', '12312312312', 'semsec@teste.com', '123',
'00000000-0000-0000-0000-000000000000', 'ROLE_USER', NOW(), NOW());

-- Falha: Violação de ENUM (Tentando inserir um cargo que não existe no enum cargo_usuario_cadastrado)
INSERT INTO usuarios (id_usuario, nome_usuario, cpf_usuario, email_usuario, senha, id_secretaria, cargo, creadoEm, atualizadoEm)
VALUES ('d4444444-4444-4444-4444-444444444444', 'Cargo Invalido', '99999999999', 'cargo@teste.com', '123',
'11111111-1111-1111-1111-111111111111', 'ROLE_GERENTE', NOW(), NOW());


-- 3. TESTES NA TABELA: produtos

-- Falha: Violação de CHECK (quantidade igual a 0 ou negativa)
INSERT INTO produtos (id_produto, nome_produto, descricao, quantidade, preco, createdAt, updatedAt, status, tipo,
id_usuario_cadastrado, id_secretaria_cadastrada)
VALUES ('e1111111-1111-1111-1111-111111111111', 'Mouse', 'Mouse sem fio', 0.000, 150.00, NOW(), NOW(), 'Novo', 'Comprado',
'33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111');

-- Falha: Violação de CHECK (preco igual a 0 ou negativo)
INSERT INTO produtos (id_produto, nome_produto, descricao, quantidade, preco, createdAt, updatedAt, status, tipo,
id_usuario_cadastrado, id_secretaria_cadastrada)
VALUES ('e2222222-2222-2222-2222-222222222222', 'Teclado', 'Teclado Mecânico', 10.000, -50.00, NOW(), NOW(), 'Novo', 'Comprado',
'33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111');


-- 4. TESTES NA TABELA: pedidos_transferencia

-- Falha: Violação de CHECK (Status 'Cancelado' OBRIGA a ter motivo_cancelamento, mas enviamos NULL)
INSERT INTO pedidos_transferencia (id_pedido_transferencia, descricao_pedido, razao_social, status, id_usuario, id_secretaria,
motivo_cancelamento)
VALUES ('f1111111-1111-1111-1111-111111111111', 'Pedido 1', 'Empresa 1', 'Cancelado', '33333333-3333-3333-3333-333333333333',
'11111111-1111-1111-1111-111111111111', NULL);

-- Falha: Violação de CHECK (Status diferente de 'Cancelado' PROÍBE ter motivo_cancelamento, mas enviamos um texto)
INSERT INTO pedidos_transferencia (id_pedido_transferencia, descricao_pedido, razao_social, status, id_usuario, id_secretaria,
motivo_cancelamento)
VALUES ('f2222222-2222-2222-2222-222222222222', 'Pedido 2', 'Empresa 2', 'Aberto', '33333333-3333-3333-3333-333333333333',
'11111111-1111-1111-1111-111111111111', 'Erro: não deveria ter motivo');


-- 5. TESTES NA TABELA: itens_pedido_transferencia

-- Falha: Violação de CHECK (quantidade <= 0)
INSERT INTO itens_pedido_transferencia (id_item_pedido_transferencia, id_pedido_transferencia, id_produto, quantidade)
VALUES ('g1111111-1111-1111-1111-111111111111', '77777777-7777-7777-7777-777777777777', '55555555-5555-5555-5555-555555555555', 0);


-- 6. TESTES NA TABELA: pedidos_compra

-- Falha: Violação de CHECK (preco <= 0)
INSERT INTO pedidos_compra (id_pedido_compra, preco, status, id_usuario, id_secretaria, creadoEm, motivo_cancelamento)
VALUES ('h1111111-1111-1111-1111-111111111111', 0.00, 'Aberto', '33333333-3333-3333-3333-333333333333',
'11111111-1111-1111-1111-111111111111',NOW(), NULL);

-- Falha: Violação de CHECK (Status 'Cancelado' OBRIGA a ter motivo_cancelamento, mas enviamos NULL)
INSERT INTO pedidos_compra (id_pedido_compra, preco, status, id_usuario, id_secretaria, creadoEm, motivo_cancelamento)
VALUES ('h2222222-2222-2222-2222-222222222222', 100.00, 'Cancelado', '33333333-3333-3333-3333-333333333333',
'11111111-1111-1111-1111-111111111111', NOW(), NULL);

-- Falha: Violação de CHECK (Status diferente de 'Cancelado' PROÍBE ter motivo_cancelamento)
INSERT INTO pedidos_compra (id_pedido_compra, preco, status, id_usuario, id_secretaria, creadoEm, motivo_cancelamento)
VALUES ('h3333333-3333-3333-3333-333333333333', 100.00, 'Pago', '33333333-3333-3333-3333-333333333333',
'11111111-1111-1111-1111-111111111111',NOW(), 'Não deveria ter motivo aqui');


-- 7. TESTES NA TABELA: itens_pedido_compra

-- Falha: Violação de CHECK (quantidade <= 0)
INSERT INTO itens_pedido_compra (id_item_pedido_compra, id_pedido_compra, id_produto, quantidade, preco)
VALUES ('i1111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555',
0, 100.00);

-- Falha: Violação de CHECK (preco <= 0)
INSERT INTO itens_pedido_compra (id_item_pedido_compra, id_pedido_compra, id_produto, quantidade, preco)
VALUES ('i2222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555',
10.000, 0.00);
