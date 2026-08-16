# miniarts-search
# miniarts-search

Small TypeScript RAG demo: OpenAI embeddings + PostgreSQL/pgvector + LLM answers.

## Architecture

```
YOUR DOCUMENTS
     │
     ▼
Generate embeddings
     │
     ▼
PostgreSQL / pgvector
     ▲
     │
USER → Embedding → Vector search → Top chunks → LLM → Answer
```

## Prerequisites

- Node.js 20+
- PostgreSQL with the [pgvector](https://github.com/pgvector/pgvector) extension
- An OpenAI API key

Create a database (example):

```sql
CREATE DATABASE miniarts_search;
```

## Setup

```bash
cd ~/Projects/miniarts-search
npm install
cp .env.example .env
# Edit .env with your OPENAI_API_KEY and DATABASE_URL
```

Apply schema (either way works):

```bash
npm run setup-db
# or: psql -d miniarts_search -f sql/schema.sql
```

Ingest sample HR policy snippets:

```bash
npm run ingest
```

Ask a question:

```bash
npm run ask -- "How much holiday do I get?"
npm run ask -- "Can I work from home?"
```

## Notes

- Embeddings use `text-embedding-3-small` (1536 dimensions).
- Answers default to `gpt-4o-mini`; override with `CHAT_MODEL` in `.env`.
- This demo stores one sentence per row. Production RAG usually adds parsing + chunking (and often reranking) before embedding.
