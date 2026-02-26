# M28 - Demo Store Server (EBAC)

API (NestJS + Prisma + Postgres) usada no exercício do módulo 28, com **testes de performance (k6)** para os endpoints de **Produtos** e **Clientes**.

---

## Requisitos
- Docker Desktop
- Node.js / npm

---

## Como rodar o projeto (local)

### 1) Subir o banco (Postgres) com Docker
```bash
npm run docker:db
```

### 2) Instalar dependências
> Obs.: este projeto pode ter conflito de peer dependencies no npm, por isso usamos `--legacy-peer-deps`.

```bash
npm install --legacy-peer-deps
```

### 3) Gerar Prisma Client e preparar o banco (migrations + seed)
```bash
npm run prisma:generate
npm run db:init
```

### 4) Subir a API
```bash
npm run start
```

A API sobe em `http://localhost:3000` e os endpoints ficam sob `/api/*` (ex.: `/api/products`, `/api/customers`).

---

## Performance tests (k6)

### Pré-requisitos
- k6 (Grafana)

### 1) Subir banco e API (local)
**Terminal 1 (API):**
```bash
npm run docker:db
npm install
npm run prisma:generate
npm run db:init
npm run start
```

### 2) Rodar testes de performance
**Terminal 2 (k6):**
```bash
# Produtos
npm run perf:products

# Clientes
npm run perf:customers
