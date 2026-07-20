--2.Criar os enuns

-- cria o enum para os cargos de usuario
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'cargo_usuario_cadastrado') THEN
        CREATE TYPE cargo_usuario_cadastrado AS ENUM('ROLE_USER', 'ROLE_ADMIN');
    END IF;
END $$;

-- cria o enum para os status de produto
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_produto') THEN
        CREATE TYPE status_produto AS ENUM('Novo', 'Usado', 'Gasto', 'Velho');
    END IF;
END $$;

-- cria o enum para os tipos de produto
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_produto') THEN
        CREATE TYPE tipo_produto AS ENUM('Doado', 'Comprado');
    END IF;
END $$;

-- cria o enum para os status de transferencia
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_pedido_transferencia') THEN
        CREATE TYPE status_pedido_trasferencia AS ENUM('Aberto', 'Analise', 'Completo', 'Cancelado');
    END IF;
END $$;

--cria o enum para os status de compra
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_pedido_compra') THEN
        CREATE TYPE status_pedido_compra AS ENUM('Aberto', 'Pago', 'Cancelado');
    END IF;
END $$;


-- 4.Criar as demais tabelas dependentes de FK

-- cria a tabela usuarios
CREATE TABLE IF NOT EXISTS usuarios(
    id_usuario UUID NOT NULL,
	nome_usuario VARCHAR(100) NOT NULL,
	cpf_usuario CHAR(11) NOT NULL UNIQUE,
	email_usuario VARCHAR(150) NOT NULL UNIQUE,
	senha VARCHAR(255) NOT NULL,
	id_secretaria UUID NOT NULL,
	cargo cargo_usuario_cadastrado NOT NULL,
	creadoEm TIMESTAMPTZ NOT NULL,
	atualizadoEm TIMESTAMPTZ NOT NULL,

	--cria a chave primária para a tabela usuarios
	CONSTRAINT pk_usuarios PRIMARY KEY(id_usuario),

	--cria a chave estrangeira para a tabela secretarias e define a ação de deleção
	CONSTRAINT fk_usuarios_secretarias FOREIGN KEY(id_secretaria) REFERENCES secretarias(id_secretaria)
	ON DELETE RESTRICT

);


-- cria a tabela produtos

CREATE TABLE IF NOT EXISTS produtos(
	id_produto UUID NOT NULL,
	nome_produto VARCHAR(150) NOT NULL,
	descricao TEXT NOT NULL,
	quantidade NUMERIC(12,3) NOT NULL,
	preco NUMERIC(10,2) NOT NULL,
	createdAt TIMESTAMPTZ NOT NULL,
	updatedAt TIMESTAMPTZ NOT NULL,
	status status_produto NOT NULL,
	tipo tipo_produto NOT NULL,
	id_usuario_cadastrado UUID NOT NULL,
	id_secretaria_cadastrada UUID NOT NULL,

	--cria a chave primária para a tabela produtos
	CONSTRAINT pk_produtos PRIMARY KEY(id_produto),

	--cria a chave estrangeira para a tabela secretarias e define a ação de deleção
	CONSTRAINT fk_produtos_secretarias FOREIGN KEY(id_secretaria_cadastrada) REFERENCES secretarias(id_secretaria)
	ON DELETE RESTRICT,

	--cria a chave estrangeira para a tabela usuarios e define a ação de deleção
	CONSTRAINT fk_produtos_usuarios FOREIGN KEY(id_usuario_cadastrado) REFERENCES usuarios(id_usuario)
	ON DELETE RESTRICT,

	--cria check para o campo quantidade
	CONSTRAINT ck_produtos_quantidade CHECK(quantidade > 0),

	--cria check para o campo preco
	CONSTRAINT ck_produtos_preco CHECK(preco > 0)
);


-- cria a tabela pedidos_transferencia

CREATE TABLE IF NOT EXISTS pedidos_transferencia(
	id_pedido_transferencia UUID NOT NULL,
	descricao_pedido VARCHAR(255) NOT NULL,
	razao_social VARCHAR(150) NOT NULL,
	status status_pedido_transferencia NOT NULL,
	id_usuario UUID NOT NULL,
	id_secretaria UUID NOT NULL,
	motivo_cancelamento VARCHAR(255),

	--cria a chave primária para a tabela pedidos_transferencia
	CONSTRAINT pk_pedidos_transferencia PRIMARY KEY(id_pedido_transferencia),

	--cria a chave estrangeira para a tabela secretarias e define a ação de deleção
	CONSTRAINT fk_pedidos_transferencia_secretarias FOREIGN KEY(id_secretaria) REFERENCES secretarias(id_secretaria)
	ON DELETE RESTRICT,

	--cria a chave estrangeira para a tabela usuarios e define a ação de deleção
	CONSTRAINT fk_pedidos_transferencia_usuarios FOREIGN KEY(id_usuario) REFERENCES usuarios(id_usuario)
	ON DELETE RESTRICT,

	--cria check para motivo_cancelamento
	CONSTRAINT ck_pedidos_transferencia_motivo_cancelamento_obrigatorio
    CHECK (
        (status = 'Cancelado' AND motivo_cancelamento IS NOT NULL) OR
        (status <> 'Cancelado' AND motivo_cancelamento IS NULL)
    )
);


-- cria a tabela itens_pedido_transferencia

CREATE TABLE IF NOT EXISTS itens_pedido_transferencia(
	id_item_pedido_transferencia UUID NOT NULL,
	id_pedido_transferencia UUID NOT NULL,
	id_produto UUID NOT NULL,
	quantidade NUMERIC(12,3) NOT NULL,

	--cria a chave primária para a tabela itens_pedido_transferencia
	CONSTRAINT pk_itens_pedido_transferencia PRIMARY KEY(id_item_pedido_transferencia),

	--cria a chave estrangeira para a tabela pedidos_transferencia
	CONSTRAINT fk_itens_pedido_transferencia_pedidos_transferencia FOREIGN KEY(id_pedido_transferencia)
	REFERENCES pedidos_transferencia(id_pedido_transferencia) ON DELETE CASCADE,

	--cria a chave estrangeira para a tabela produtos e define a ação de deleção
	CONSTRAINT fk_itens_pedido_transferencia_produtos FOREIGN KEY(id_produto) REFERENCES produtos(id_produto)
	ON DELETE RESTRICT,

	--cria check para o campo quantidade
	CONSTRAINT ck_itens_pedido_transferencia_quantidade CHECK(quantidade > 0)
);


-- cria a tabela pedidos_compra

CREATE TABLE IF NOT EXISTS pedidos_compra(
	id_pedido_compra UUID NOT NULL,
	preco NUMERIC(10,2) NOT NULL,
	status status_pedido_compra NOT NULL,
	id_usuario UUID NOT NULL,
	id_secretaria UUID NOT NULL,
	creadoEm TIMESTAMPTZ,
	motivo_cancelamento VARCHAR(255),

	--cria a chave primária para a tabela pedidos_compra
	CONSTRAINT pk_pedidos_compra PRIMARY KEY(id_pedido_compra),

	--cria a chave estrangeira para a tabela secretarias e define a ação de deleção
	CONSTRAINT fk_pedidos_compra_secretarias FOREIGN KEY(id_secretaria) REFERENCES secretarias(id_secretaria)
	ON DELETE RESTRICT,

	--cria a chave estrangeira para a tabela usuarios e define a ação de deleção
	CONSTRAINT fk_pedidos_compra_usuarios FOREIGN KEY(id_usuario) REFERENCES usuarios(id_usuario)
    ON DELETE RESTRICT,

	--cria check para o campo preco
	CONSTRAINT ck_pedidos_compra_preco CHECK(preco > 0),

	--cria check para o campo motivo_cancelamento
	CONSTRAINT ck_pedidos_compra_motivo_cancelamento_obrigatorio
    CHECK (
        (status = 'Cancelado' AND motivo_cancelamento IS NOT NULL) OR
        (status <> 'Cancelado' AND motivo_cancelamento IS NULL)
    )
);


-- cria a tabela itens_pedido_compra

CREATE TABLE IF NOT EXISTS itens_pedido_compra(
	id_item_pedido_compra UUID NOT NULL,
	id_pedido_compra UUID NOT NULL,
	id_produto UUID NOT NULL,
	quantidade NUMERIC(12,3) NOT NULL,
	preco NUMERIC(10,2) NOT NULL,

	--cria a chave primária para a tabela itens_pedido_compra
	CONSTRAINT pk_itens_pedido_compra PRIMARY KEY(id_item_pedido_compra),

	--cria a chave estrangeira para a tabela pedidos_compra e define a ação de deleção
	CONSTRAINT fk_itens_pedido_compra_pedidos_compra FOREIGN KEY(id_pedido_compra)
	REFERENCES pedidos_compra(id_pedido_compra) ON DELETE CASCADE,

	--cria a chave estrangeira para a tabela produtos e define a ação de deleção
	CONSTRAINT fk_itens_pedido_compra_produtos FOREIGN KEY(id_produto) REFERENCES produtos(id_produto)
	ON DELETE RESTRICT,

	--cria check para o campo quantidade
	CONSTRAINT ck_itens_pedido_compra_quantidade CHECK(quantidade > 0),

	--cria check para o campo preco
	CONSTRAINT ck_itens_pedido_compra_preco CHECK(preco > 0)

);
