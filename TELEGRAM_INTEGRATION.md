# Integração com Telegram

Este documento descreve como configurar a automação do Telegram para criar relatos anônimos via API.

## Como funciona

```
Telegram → n8n/automação → POST /posts/telegram → Relato criado como "Anônimo"
```

A rota `POST /posts/telegram` não exige login (JWT). Em vez disso, ela valida uma **API Key secreta** passada no header `x-api-key`. O post é atribuído automaticamente a um usuário anônimo fixo no banco de dados.

---

## Configuração

### 1. Criar o usuário anônimo no banco

Execute no Supabase (SQL Editor) ou via qualquer cliente PostgreSQL:

```sql
INSERT INTO users (nome, email, senha)
VALUES ('Anônimo', 'anonimo@relatos.app', 'senha-invalida-nao-usada');
```

Anote o `id` gerado (ex: `5`).

### 2. Variáveis de ambiente

Adicione ao `.env` local e nas **Environment Variables do Vercel**:

```env
TELEGRAM_API_KEY=coloque-uma-chave-secreta-forte-aqui
ANON_USER_ID=5  # o id do usuário anônimo criado acima
```

> Use uma chave aleatória e longa para `TELEGRAM_API_KEY`. Ex: gere com `openssl rand -hex 32`.

---

## Endpoint

### `POST /posts/telegram`

**Header obrigatório:**
```
x-api-key: <TELEGRAM_API_KEY>
```

**Body (JSON):**
```json
{
  "conteudo": "Texto do relato",
  "tipoRelatoId": 1
}
```

**Resposta de sucesso (201):**
```json
{
  "id": 42,
  "conteudo": "Texto do relato",
  "quantidadeVts": 0,
  "createdAt": "2026-02-23T21:00:00.000Z",
  "tipoRelato": { "id": 1, "nome": "Geral" },
  "user": { "nome": "Anônimo" }
}
```

**Resposta sem API Key (401):**
```json
{ "statusCode": 401, "message": "API Key inválida" }
```

---

## Configuração do n8n

No nó **"Enviar solicitação HTTP"**, configure:

| Campo | Valor |
|---|---|
| Method | `POST` |
| URL | `https://sua-api.vercel.app/posts/telegram` |
| Header | `x-api-key` → `{{TELEGRAM_API_KEY}}` |
| Body | JSON (ver abaixo) |

**Body JSON:**
```json
{
  "conteudo": "={{ $json.message.text }}",
  "tipoRelatoId": 1
}
```

> `$json.message.text` é o campo que contém o texto da mensagem recebida pelo Telegram Bot no n8n. Ajuste conforme o output do seu nó de trigger.

---

## Teste local

```bash
curl -X POST http://localhost:3000/posts/telegram \
  -H "Content-Type: application/json" \
  -H "x-api-key: coloque-sua-chave-aqui" \
  -d '{"conteudo": "Teste via Telegram", "tipoRelatoId": 1}'
```
