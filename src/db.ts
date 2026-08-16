import "dotenv/config";
import OpenAI from "openai";
import pg from "pg";

const { Pool } = pg;

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY in .env");
}

if (!process.env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL in .env");
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const EMBEDDING_MODEL = "text-embedding-3-small";
export const CHAT_MODEL = process.env.CHAT_MODEL ?? "gpt-4o-mini";

export async function embed(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text,
  });

  return response.data[0].embedding;
}
