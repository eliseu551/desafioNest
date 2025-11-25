# Desafio Técnico — API de Gestão de Pets (NestJS + Prisma + MySQL)

API REST para gerenciar usuários, pets e agendamentos de serviços veterinários com autenticação JWT, documentação via Swagger e banco MySQL com Prisma.

## Tecnologias
- NestJS (TypeScript) + Swagger
- Prisma ORM + MySQL (Docker)
- JWT + class-validator/class-transformer
- Jest para testes

## Como rodar
1) Instale dependências:
```bash
npm install
```

2) Crie o arquivo `.env` com base no `.env.example`:
```env
DATABASE_URL="mysql://root:root@localhost:3306/petcare"
PORT=3000
JWT_SECRET="supersecretjwt"
JWT_EXPIRES_IN="1d"
WEBHOOK_URL="http://localhost:4000/webhooks/appointment" # opcional
```

### Rodando com Docker (recomendado)
```bash
docker-compose up --build
```
- A API sobe em `http://localhost:3000` (endpoints em `/api/*`).
- Swagger: `http://localhost:3000/docs`.
- Banco MySQL exposto em `localhost:3306` (user `petuser`, senha `petpass`, DB `petcare`).
- Caso as apis não estejam funcionando rode o comando "npx prisma migrate dev --name init" em um novo terminal.



### Rodando localmente (sem Docker)
1) Suba um MySQL local (ou use Docker apenas para o banco) e ajuste `DATABASE_URL`.
2) Gere o client Prisma e crie tabelas:
```bash
pnpm prisma:generate
pnpm prisma:dev       # cria migration init e aplica no banco
pnpm prisma:seed      # popula dados de exemplo
npx prisma migrate dev --name init
```
3) Rode a API:
```bash
pnpm start:dev  # modo watch
# ou
pnpm start:prod # após pnpm build
```

## Seeds
`pnpm seed` cria:
- Usuário: `demo@pets.com` / senha `password123`
- Pets: Bella (Dog) e Max (Cat)
- Agendamentos: Vacina (Bella) e Grooming (Max)

## Scripts úteis
- `pnpm prisma:dev` — cria migration inicial e aplica (dev)
- `pnpm prisma:migrate` — roda migrations em produção
- `pnpm prisma:seed` / `pnpm seed` — popula dados iniciais
- `pnpm test` — testes unitários
- `pnpm test:e2e` — testes E2E (usa mock de Prisma)

## Endpoints principais
- Autenticação: `POST /auth/register`, `POST /auth/login`, `GET /auth/me`
- Pets: CRUD em `/pets` (por usuário autenticado)
- Agendamentos: CRUD em `/appointments` com filtros `date`, `service` e `status`
- Health check: `GET /api/health`

## Extras implementados
- Interceptor de auditoria nos agendamentos (log de requisições com usuário)
- Webhook opcional (`WEBHOOK_URL`) disparado ao mudar status de agendamento
- Swagger configurado em `/docs` com exemplos de DTOs
