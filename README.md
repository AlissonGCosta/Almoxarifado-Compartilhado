# Almoxarifado Compartilhado

Monorepo da aplicação **Almoxarifado Compartilhado**, organizado para reunir o
front-end e o back-end em um único repositório.

## Estrutura do projeto

```text
.
├── frontend/   # Aplicação web
└── backend/    # API (a ser adicionada)
```

## Front-end

O front-end está localizado em [`frontend/`](./frontend) e utiliza o App Router
do Next.js, TypeScript, Tailwind CSS e ESLint.

### Tecnologias e versões

| Tecnologia | Versão |
| --- | --- |
| Next.js | 16.2.9 |
| React | 19.2.4 |
| React DOM | 19.2.4 |
| TypeScript | 5.x |
| Tailwind CSS | 4.x |
| ESLint | 9.x |
| Node.js | 20.20.2 |
| npm | 10.8.2 |

As versões de Node.js e npm acima correspondem ao ambiente usado no setup
inicial. As versões exatas das dependências estão registradas em
[`frontend/package-lock.json`](./frontend/package-lock.json).

### Executando localmente

Pré-requisitos:

- Node.js 20.x
- npm 10.x

Instale as dependências:

```bash
cd frontend
npm ci
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

A aplicação ficará disponível em
[`http://localhost:3000`](http://localhost:3000).

### Scripts disponíveis

Execute os comandos dentro de `frontend/`.

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o ambiente de desenvolvimento |
| `npm run build` | Gera o build de produção |
| `npm run start` | Executa o build de produção |
| `npm run lint` | Verifica o código com ESLint |

## Back-end

O back-end ainda será adicionado ao monorepo. Sua documentação específica
deverá ficar dentro do respectivo diretório.
