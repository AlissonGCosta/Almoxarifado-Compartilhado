# Front-end - Almoxarifado Compartilhado

Interface web do sistema de gestão municipal de bens e materiais.

O front-end usa Next.js com App Router, TypeScript, Tailwind CSS e ESLint.

## Funcionalidades atuais

- Painel com indicadores gerais do almoxarifado.
- Cadastro e listagem de itens.
- Cadastro, listagem e edição de secretarias.
- Cadastro, listagem e edição parcial de usuários.
- Cadastro, listagem, filtro por status e remoção de pedidos de compra.
- Tela de acesso preparada para autenticação futura.
- Tela de planejamento com pontos pendentes de integração.
- Fallback local quando a API não responde ou alguma rota ainda está indisponível.

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

## Limitações conhecidas

- Login real ainda depende da API de autenticação.
- Itens ainda podem cair em modo local se a rota `/items` estiver bloqueada.
- Edição de usuários altera apenas `nome` e `email`, conforme o contrato atual da API.
- Algumas regras de negócio de pedidos ainda dependem da definição final do back-end.

## Requisitos

- Node.js
- npm

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
