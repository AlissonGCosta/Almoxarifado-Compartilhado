-- ARQUIVO 1: INSERÇÃO DADOS POPULACIONAIS TESTES  NA TABELA BASE SECRETARIAS(SEM FK)

INSERT INTO secretarias (id_secretaria, nome_secretaria, sigla, endereco, cep, creadoEm, atualizadoEm)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'Secretaria de Tecnologia', 'SEC-TEC', 'Rua dos Servidores, 100',
    '12345678', NOW(), NOW()),

    ('22222222-2222-2222-2222-222222222222', 'Secretaria de Saúde', 'SEC-SAU', 'Avenida Central, 500',
    '87654321', NOW(), NOW());
333
