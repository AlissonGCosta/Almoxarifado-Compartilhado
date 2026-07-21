--1.Criar tabela independente de FK

--cria a tabela secretarias
CREATE TABLE IF NOT EXISTS secretarias(
	id_secretaria UUID NOT NULL,
	nome_secretaria VARCHAR(150) NOT NULL,
	sigla VARCHAR(10) NOT NULL UNIQUE,
	endereco VARCHAR(255) NOT NULL,
	cep VARCHAR(8) NOT NULL,
	creadoEm TIMESTAMPTZ NOT NULL,
	atualizadoEm TIMESTAMPTZ NOT NULL,

    --cria a chave primária para a tabela secretarias
	CONSTRAINT pk_secretarias PRIMARY KEY(id_secretaria)
);
