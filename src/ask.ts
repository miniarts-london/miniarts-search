import { embed, openai, pool, CHAT_MODEL } from "./db.js";

type SearchResult = {
  content: string;
  similarity: number;
};

async function search(query: string, limit = 3): Promise<SearchResult[]> {
  const embedding = await embed(query);

  const result = await pool.query<SearchResult>(
    `
    SELECT
      content,
      1 - (embedding <=> $1::vector) AS similarity
    FROM documents
    ORDER BY embedding <=> $1::vector
    LIMIT $2
    `,
    [JSON.stringify(embedding), limit],
  );

  return result.rows;
}

async function answerQuestion(question: string): Promise<string> {
  const results = await search(question);

  console.log("\nRetrieved chunks:");
  for (const row of results) {
    console.log(
      `  ${(row.similarity * 100).toFixed(1)}%  ${row.content}`,
    );
  }

  const context = results.map((result) => result.content).join("\n");

  const response = await openai.chat.completions.create({
    model: CHAT_MODEL,
    messages: [
      {
        role: "system",
        content:
          "Answer the user's question using only the provided context. If the answer isn't contained in the context, say you don't know.",
      },
      {
        role: "user",
        content: `Context:\n${context}\n\nQuestion:\n${question}`,
      },
    ],
  });

  return response.choices[0]?.message?.content?.trim() ?? "No answer.";
}

async function main() {
  const question =
    process.argv.slice(2).join(" ") || "How much holiday do I get?";

  console.log(`Question: ${question}`);
  const answer = await answerQuestion(question);
  console.log(`\nAnswer:\n${answer}`);
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
