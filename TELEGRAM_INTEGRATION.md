# Integração com Telegram

Este documento descreve como configurar a automação do Telegram para criar relatos anônimos via API.

## Como funciona

```
Telegram (Bot 1) → Activepieces → POST /posts/telegram → Relato "Anônimo"
Telegram (Bot 2) → Activepieces (Gerador) → POST /posts/activepieces → Relato "Anônimo"
Webhook Externo → POST /posts/webhook → Relato "Anônimo"
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

### `POST /posts/telegram`, `POST /posts/activepieces` e `POST /posts/webhook`

**Header obrigatório:**
```
x-api-key: <TELEGRAM_API_KEY>
```

**Body (JSON):**
```json
{
  "conteudo": "Texto do relato ou gerado pela automação",
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

## Configuração no Activepieces

A automação é composta por 4 steps, executados em sequência quando o bot recebe uma mensagem no Telegram.

### Fluxo dos steps

| Step | Tipo | O que faz |
|---|---|---|
| 1. Nova mensagem | Telegram Bot (Trigger) | Dispara quando o usuário envia uma mensagem ao bot |
| 2. Resposta do bot | Telegram Bot | Envia uma mensagem de resposta ao usuario (ex: "Aqui seu post maninho:") |
| 3. Enviar solicitação HTTP | HTTP | Faz POST para a API criando o relato |
| 4. Enviar mensagem final | Telegram Bot | Confirma ao usuário que o post foi criado |

---

### Step 3 - Configuracao do HTTP

**Metodo:** POST

**URL:**
```
https://sua-api.vercel.app/posts/telegram
(ou /posts/activepieces para o segundo bot)
(ou /posts/webhook para automações de sistema)
```

**Cabecalhos:**

| Chave | Valor |
|---|---|
| `x-api-key` | valor do `TELEGRAM_API_KEY` no seu `.env` |
| `Content-Type` | `application/json` |

**Tipo de Corpo:** JSON

**JSON Body:**
```json
{
  "conteudo": "{{trigger.message.text}}",
  "tipoRelatoId": 1
}
```

A variavel `{{trigger.message.text}}` referencia o texto enviado pelo usuario no step 1 (trigger). O Activepieces resolve essa referencia automaticamente antes de enviar a requisicao.

> O campo `tipoRelatoId` esta fixo em `1` (Tecnologia). Para permitir que o usuario escolha a categoria, seria necessario adicionar um step de selecao antes do HTTP.

---

## Teste local

```bash
curl -X POST http://localhost:3000/posts/telegram \
  -H "Content-Type: application/json" \
  -H "x-api-key: coloque-sua-chave-aqui" \
  -d '{"conteudo": "Teste via Telegram", "tipoRelatoId": 1}'
```
