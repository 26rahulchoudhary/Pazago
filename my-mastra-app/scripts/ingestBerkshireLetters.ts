import "dotenv/config";
// Ingest Berkshire Hathaway annual letters into Mastra vector DB
// Run: npx ts-node scripts/ingestBerkshireLetters.ts

import { embedMany } from "ai";
import { openai } from "@ai-sdk/openai";
import { PgVector } from "@mastra/pg";
import { MDocument } from "@mastra/rag";
import fs from "fs";
import path from "path";

import pdf from "pdf-parse"; // If using ESM, otherwise use require only if not using import

// Remove EMBEDDING_PROVIDER and cohere logic

const PDF_DIR = 'data/Berkshire_Hathaway_Shareholder_Letters';
const pdfFiles = fs.readdirSync(PDF_DIR).filter(f => f.endsWith('.pdf'));

(async () => {
  for (const file of pdfFiles) {
    const dataBuffer = fs.readFileSync(path.join(PDF_DIR, file));
    const data = await pdf(dataBuffer);
    const text = data.text;

    const doc = MDocument.fromText(text);
    const chunks = await doc.chunk({
      strategy: "recursive",
      size: 256,
      overlap: 50,
      separator: "\n",
    });

    const { embeddings } = await embedMany({
      model: openai.embedding("text-embedding-3-small"),
      values: chunks.map((chunk) => chunk.text),
    });

    const connectionString = process.env.POSTGRES_CONNECTION_STRING;
    if (!connectionString) {
      throw new Error("POSTGRES_CONNECTION_STRING is not set in the environment.");
    }
    const pgVector = new PgVector({ connectionString });

    try {
      console.log("Embeddings to upsert:", embeddings);
      await pgVector.upsert({
        indexName: "embeddings",
        vectors: embeddings,
      });
      console.log(`Upserted embeddings for: ${file}`);
    } catch (err) {
      console.error(`Failed to upsert embeddings for ${file}:`, err);
    }
  }
  console.log("All PDFs processed!");
})();

async function ingestPlainText(text: string) {
  const doc = MDocument.fromText(text);

  const chunks = await doc.chunk({
    strategy: "recursive",
    size: 512,
    overlap: 50,
    separator: "\n",
  });

  const { embeddings } = await embedMany({
    model: openai.embedding("text-embedding-3-small"),
    values: chunks.map((chunk) => chunk.text),
  });

  const connectionString = process.env.POSTGRES_CONNECTION_STRING;
  if (!connectionString) {
    throw new Error("POSTGRES_CONNECTION_STRING is not set in the environment.");
  }
  const pgVector = new PgVector({ connectionString });

  try {
    console.log("Embeddings to upsert:", embeddings);
    await pgVector.upsert({
      indexName: "embeddings",
      vectors: embeddings,
    });
    console.log("Upserted embeddings!");
  } catch (err) {
    console.error("Failed to upsert embeddings:", err);
  }

  console.log("Plain text ingestion complete!");
}

async function ingestDocument(filePath: string, metadata: any) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdf(dataBuffer);
  const text = data.text;
  await ingestPlainText(text);
} 