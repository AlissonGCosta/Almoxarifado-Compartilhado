CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE pedido_compra (
    id_pedido_compra UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_produto UUID NOT NULL,
    nome_produto VARCHAR(255) NOT NULL,
    descricao_produto TEXT,
    descricao_pedido TEXT,
    quantidade NUMERIC(19, 2) NOT NULL CHECK (quantidade > 0),
    preco NUMERIC(19, 2) NOT NULL CHECK (preco >= 0),
    status VARCHAR(30) NOT NULL CHECK (status IN ('PENDENTE', 'APROVADO', 'REJEITADO', 'EM_PROCESSAMENTO', 'ENTREGUE', 'CANCELADO')),
    id_usuario UUID NOT NULL,
    id_secretaria UUID NOT NULL,
    motivo_cancelamento TEXT,
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pedido_compra_produto FOREIGN KEY (id_produto) REFERENCES item (id),
    CONSTRAINT fk_pedido_compra_usuario FOREIGN KEY (id_usuario) REFERENCES users (id),
    CONSTRAINT fk_pedido_compra_secretaria FOREIGN KEY (id_secretaria) REFERENCES secretarias (id),
    CONSTRAINT ck_pedido_compra_cancelamento CHECK (
        (status = 'CANCELADO' AND motivo_cancelamento IS NOT NULL)
        OR (status <> 'CANCELADO' AND motivo_cancelamento IS NULL)
    )
);

CREATE INDEX idx_pedido_compra_status ON pedido_compra (status);
CREATE INDEX idx_pedido_compra_id_usuario ON pedido_compra (id_usuario);
CREATE INDEX idx_pedido_compra_id_secretaria ON pedido_compra (id_secretaria);
