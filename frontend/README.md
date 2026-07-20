# Front-end - Almoxarifado Compartilhado

Interface web do sistema de gestão municipal de bens e materiais.

O front-end usa Next.js com App Router, TypeScript, Tailwind CSS, Lucide Icons e ESLint.

## Funcionalidades

- Login com JWT e sessão mantida enquanto a aba do navegador estiver aberta.
- Tela de autenticação exclusiva, sem a navegação do ambiente interno.
- Envio automático do Bearer token nas chamadas para a API.
- Perfil do usuário e alteração de senha.
- Interface administrativa responsiva com navegação lateral.
- Painel com indicadores gerais do almoxarifado.
- Cadastro, listagem e edição de produtos.
- Cadastro e acompanhamento de pedidos de transferência com vários produtos.
- Cadastro, listagem e edição de secretarias e usuários.
- Cadastro, listagem e filtro de pedidos de compra.
- Busca geral e fallback local por recurso quando uma rota não responde.

## Requisitos

- Node.js 24.18
- npm 11.16
- Back-end disponível em `http://127.0.0.1:8080`

## Integração com a API

As chamadas do navegador passam pelo proxy interno do Next em `/api/backend/*`. Por padrão, ele encaminha para:

```text
http://127.0.0.1:8080
```

Para usar outro endereço, crie `frontend/.env.local`:

```env
BACKEND_URL=http://127.0.0.1:8080
```

## Como rodar

Instale as dependências:

```powershell
cd frontend
npm ci
```

Em outro terminal, inicie o back-end com uma chave JWT local. Esta chave é apenas para desenvolvimento:

```powershell
cd backend
$env:JWT_SECRET="aGFja2F0aG9uLWFsbW94YXJpZmFkby1qd3Qta2V5LTIwMjY="
.\mvnw.cmd "-Dmaven.test.skip=true" spring-boot:run
```

Com o back-end iniciado, prepare os dados da demonstração:

```powershell
cd frontend
npm run seed:demo
```

Credenciais criadas pelo script:

```text
E-mail: demo@prefeitura.gov.br
Senha: Hackathon2026
```

Inicie o front-end:

```powershell
npm run dev
```

Acesse `http://localhost:3000`.

## Scripts

```powershell
npm run dev
npm run build
npm run start
npm run lint
npm run seed:demo
```

## Limitações conhecidas

- O back-end ainda não aplica permissões por perfil nas rotas principais.
- Exclusões em `/v1/**` não estão disponíveis sem autorização no back-end e, por isso, não aparecem na interface.
- Pedidos de compra ainda dependem do modelo antigo de itens no back-end; quando esse vínculo falha, o front preserva o pedido apenas localmente.
- O banco ativo usa H2 com `create-drop`, portanto os dados precisam ser recriados após reiniciar o back-end.
- O login não possui refresh token nem recuperação de senha, itens dispensáveis para a demonstração do hackathon.
