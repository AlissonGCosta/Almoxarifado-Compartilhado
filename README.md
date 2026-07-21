# Almoxarifado Compartilhado

Monorepo da aplicação **Almoxarifado Compartilhado**, organizado para reunir o
front-end e o back-end em um único repositório.

## Estrutura do projeto

```text
.
├── frontend/   # Aplicação web
└── backend/    # API (a ser adicionada)
└── database/   
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
| Node.js | 24.18.0 LTS |
| npm | 11.16.0 |

A versão do Node.js é padronizada pelo arquivo [`.nvmrc`](./.nvmrc). As versões
exatas das dependências estão registradas em
[`frontend/package-lock.json`](./frontend/package-lock.json).

### Executando localmente

Pré-requisitos:

- Node.js 24.18.0
- npm 11.16.0

Com o NVM instalado, ative a versão definida pelo projeto:

```bash
nvm use 24.18.0
```

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

O back-end está localizado em [`backend/`](./backend) e foi desenvolvido com
Spring Boot, seguindo uma arquitetura em camadas para gerenciamento dos itens
do almoxarifado.

### Tecnologias e versões

| Tecnologia | Versão |
| --- | --- |
| Java | 21 |
| Spring Boot | 3.5.16 |
| Spring Data JPA | 3.5.16 |
| Spring Validation | 3.5.16 |
| Spring Security | 3.5.16 |
| PostgreSQL | Runtime |
| H2 Database | Runtime |
| Lombok | Última estável |
| Swagger / OpenAPI (Springdoc) | 2.8.9 |
| Maven | 3.x |

### Executando localmente

Pré-requisitos:

- Java 21
- Maven 3.x
- Docker
- Docker Compose

Suba o PostgreSQL local:

```bash
docker compose up -d
```

Se o Docker Compose estiver instalado como binário legado:

```bash
docker-compose up -d
```

Valores padrão de desenvolvimento:

| Variável | Valor |
| --- | --- |
| `POSTGRES_DB` | `almoxarifado` |
| `POSTGRES_USER` | `almoxarifado` |
| `POSTGRES_PASSWORD` | `almoxarifado` |
| `POSTGRES_PORT` | `5432` |

Instale as dependências e execute a aplicação:

```bash
cd backend
mvn spring-boot:run
```

A API ficará disponível em:

- http://localhost:8080

A documentação da API (Swagger) poderá ser acessada em:

- http://localhost:8080/swagger-ui/index.html

### Funcionalidades implementadas

- Cadastro de itens
- Listagem de itens
- Busca de item por ID
- Atualização de itens
- Exclusão de itens
- Validação de dados com Bean Validation
- Tratamento global de exceções
- Documentação automática da API com Swagger/OpenAPI

### Scripts disponíveis

Execute os comandos dentro de `backend/`.

| Comando | Descrição |
| --- | --- |
| `mvn spring-boot:run` | Inicia a aplicação |
| `mvn test` | Executa os testes |
| `mvn clean` | Remove os arquivos gerados |
| `mvn clean install` | Compila e instala as dependências |


## Banco de Dados

Este diretório é dedicado à arquitetura, modelagem e documentação do banco de dados do sistema de almoxarifado. Ele está localizada em [`database/`](./database).

## Tecnologias e Ferramentas

| Tecnologia / Ferramenta | Descrição / Uso |
| :--- | :--- |
| **PostgreSQL** | SGBD Relacional principal da aplicação. |
| **Docker & Compose** | Utilizado para provisionamento do ambiente local. |
| **Flyway** | Ferramenta de versionamento e migração de dados (Migrations). |
| **Spring Data JPA** | ORM utilizado no back-end para mapeamento (Java/Spring Boot). |
| **DBeaver** | Cliente SQL recomendado para administração e testes locais. |

## Executando localmente

### Pré-requisitos:
* Docker
* Docker Compose
* DBeaver (ou outro cliente SQL de sua preferência)

### Suba o PostgreSQL local:
Para iniciar o banco de dados via container, navegue até o diretório onde se encontra o arquivo `docker-compose.yml` e execute:

```bash
docker compose up -d
```

Se o Docker Compose estiver instalado como binário legado:

```bash
docker-compose up -d
```

### Credenciais de Conexão Local

Configure seu DBeaver com os seguintes parâmetros padrão de desenvolvimento para acessar o banco recém-criado:

| Parâmetro (DBeaver) | Valor |
| :--- | :--- |
| **Host** | `localhost` |
| **Porta (POSTGRES_PORT)** | `5432` |
| **Database (POSTGRES_DB)** | `almoxarifado` |
| **Username (POSTGRES_USER)**| `almoxarifado` |
| **Password (POSTGRES_PASSWORD)** | `almoxarifado` |

<!-- ## Integração com Back-end (Flyway & ORM)

Embora a documentação e os scripts de modelagem residam nesta pasta, a gestão automatizada do banco é feita pelo back-end (Spring Boot):

* **JPA/Hibernate:** Responsável por mapear as entidades Java para as tabelas documentadas aqui.
* **Flyway:** O Spring Boot executará automaticamente as migrations (scripts SQL) na inicialização da aplicação para garantir que o banco de dados `almoxarifado` esteja sempre na versão correta. As migrations oficiais geralmente ficam em `backend/src/main/resources/db/migration/`.-->
