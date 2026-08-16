import { embed, pool } from "./db.js";

const documents = [
  "Employees receive 25 days of annual leave per year.",
  "Employees must request annual leave at least two weeks in advance.",
  "Employees can work from home up to three days per week.",
  "Sick leave must be reported to your manager before 9am.",
];

async function ingest() {
  // Clear previous sample data so re-runs stay idempotent for this demo.
  await pool.query(`DELETE FROM documents`);

  for (const content of documents) {
    const embedding = await embed(content);

    await pool.query(
      `
      INSERT INTO documents (content, embedding)
      VALUES ($1, $2)
      `,
      [content, JSON.stringify(embedding)],
    );

    console.log(`Ingested: ${content}`);
  }

  console.log(`Done. Inserted ${documents.length} documents.`);
  await pool.end();
}

ingest().catch((err) => {
  console.error(err);
  process.exit(1);
});
