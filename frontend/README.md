# Front-end - Almoxarifado Compartilhado

Interface web do sistema de gestão municipal de bens e materiais.

O front-end usa Next.js com App Router, TypeScript, Tailwind CSS e ESLint.

## Funcionalidades atuais

- Painel com indicadores gerais do almoxarifado.
- Cadastro, listagem e edição de produtos, incluindo preço, estado, origem, responsável e secretaria.
- Cadastro e listagem de pedidos de transferência com um ou mais produtos.
- Filtro e atualização de status dos pedidos de transferência.
- Listagem dos itens vinculados aos pedidos de transferência.
- Cadastro, listagem e edição de secretarias.
- Cadastro, listagem e edição parcial de usuários.
- Cadastro, listagem, filtro por status e remoção de pedidos de compra.
- Tela de acesso preparada para autenticação futura.
- Fallback local por recurso quando uma rota da API não responde.

## Integração com a API

As chamadas do navegador passam pelo proxy interno do Next:

```text
/api/backend/*
```

Por padrão, esse proxy aponta para:

```text
http://localhost:8080
```

Para alterar o destino da API, defina a variável:

```env
BACKEND_URL=http://localhost:8080
```

Rotas utilizadas pelas funcionalidades mais recentes:

```text
/v1/produtos
/v1/pedidos-transferencia
/v1/itens-pedido-transferencia
```

## Limitações conhecidas

- O login real ainda depende da API de autenticação.
- A exclusão de produtos e transferências não aparece na interface porque `DELETE /v1/**` ainda exige autenticação.
- A edição de usuários altera apenas `nome` e `email`, conforme o contrato atual da API.
- Quando a API usa H2 com `ddl-auto: create-drop`, os dados são apagados ao reiniciar o back-end.

## Requisitos

- Node.js 24.18
- npm 11.16

As versões exatas das dependências ficam registradas em `package-lock.json`.

## Como rodar

Instale as dependências:

```bash
npm ci
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse:

```text
http://localhost:3000
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Estrutura principal

```text
app/
  api/backend/[...path]/route.ts
  page.tsx
components/
  tabs/
  AppHeader.tsx
  AppFooter.tsx
  NoticeBar.tsx
  ui.tsx
lib/
  api.ts
  formatters.ts
  mock-data.ts
  types.ts
  use-almoxarifado.ts
```
