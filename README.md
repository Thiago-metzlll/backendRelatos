# Backend - Relatos (Projeto Academico)

Este repositorio contem o backend da aplicacao Relatos, desenvolvido para fins academicos. O sistema gerencia postagens, comentarios e integracoes com ferramentas de automacao.

## Tecnologias Utilizadas

- **Framework**: NestJS (TypeScript)
- **Banco de Dados Relacional**: PostgreSQL (via Supabase e Prisma ORM)
- **Banco de Dados NoSQL**: Firestore (Firebase Admin SDK) para comentarios e chat
- **Autenticacao**: JWT com persistencia via Cookies (cookie-parser)
- **Automacao**: Integracao direta com Activepieces e Bots de Telegram

## Funcionalidades Principais

- **Autenticacao**: Registro e login de usuarios com senhas criptografadas (bcrypt).
- **Postagens**: Criacao, listagem por categorias e sistema de votos (upvotes).
- **Comentarios**: Armazenamento no Firestore com retorno via HTTP convencional.
- **Integracoes Externas**: Endpoints preparados para receber disparos de bots e ferramentas de automacao sem necessidade de autenticacao JWT (validacao via API Key).

## Endpoints de Integracao

Para facilitar o uso acadêmico e automações, o sistema disponibiliza rotas especificas:

- `POST /posts/telegram`: Integracao com bot principal.
- `POST /posts/activepieces`: Integracao com bot secundario (gerador de relatos).
- `POST /posts/webhook`: Recebimento de dados via webhooks externos.

> Todos os endpoints acima exigem o header `x-api-key` e salvam o conteudo no usuario "Anônimo".

## Configuracao

1. Clone o repositorio.
2. Instale as dependencias: `npm install`.
3. Configure o arquivo `.env` com as credenciais do Supabase, Firebase e as chaves de API secretas.
4. Execute as migracoes do Prisma: `npx prisma migrate dev`.
5. Inicie o servidor: `npm run dev`.

---

Documentacao produzida para fins academicos.
