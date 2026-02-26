## Performance tests (k6)

### Pré-requisitos
- Docker Desktop
- Node.js / npm
- k6 (Grafana)

### Subir banco e API
```bash
npm run docker:db
npm install --legacy-peer-deps
npm run prisma:generate
npm run db:init
npm run start