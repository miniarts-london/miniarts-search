-- Enable pgvector and create the documents table.
-- Run against your existing PostgreSQL instance, e.g.:
--   psql -d miniarts_search -f sql/schema.sql

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    embedding VECTOR(1536)
);
