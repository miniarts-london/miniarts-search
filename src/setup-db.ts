import { pool } from "./db.js";

async function setupDb() {
  await pool.query(`CREATE EXTENSION IF NOT EXISTS vector`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS documents (
      id SERIAL PRIMARY KEY,
      content TEXT NOT NULL,
      embedding VECTOR(1536)
    )
  `);

  console.log("Database ready: documents table + pgvector extension.");
  await pool.end();
}

setupDb().catch((err) => {
  console.error(err);
  process.exit(1);
});
