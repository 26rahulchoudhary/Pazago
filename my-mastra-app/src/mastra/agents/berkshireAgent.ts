import "dotenv/config";
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { PgVector, PostgresStore } from "@mastra/pg";
import { Memory } from "@mastra/memory";
import * as mathjs from "mathjs";

// Schema for calculator tool
const inputSchema = z.object({ expression: z.string() });

// Environment variables
const {
  POSTGRES_CONNECTION_STRING,
  PG_HOST = "localhost",
  PG_PORT = "5432",
  PG_USER = "postgres",
  PG_PASSWORD = "password",
  PG_DATABASE = "postgres",
} = process.env;

const connectionString = POSTGRES_CONNECTION_STRING ||
  `postgresql://${PG_USER}:${PG_PASSWORD}@${PG_HOST}:${PG_PORT}/${PG_DATABASE}`;

// Vector store and memory
const vectorStore = new PgVector({ connectionString });
const memory = new Memory({
  storage: new PostgresStore({ connectionString }),
  vector: vectorStore,
  embedder: openai.embedding("text-embedding-3-small"),
  options: { 
    lastMessages: 10,
    threads: {
      generateTitle: {
        model: openai.chat("gpt-3.5-turbo"),
        instructions: "Generate a concise Q&A style title based on the user's first question. Limit to 30 characters.",
      },
    },
    workingMemory: {
      enabled: true,
      template: `
# User Financial Profile

- Monthly Budget: 
- Savings Goals: 
- Last Plan Discussed: 
- Preferences: 
      `,
    },
    semanticRecall: {
      topK: 3,
      messageRange: { before: 2, after: 1 },
    },
  },
});

// Agent definition
export const berkshireAgent = new Agent({
  name: "BerkshireBuffettAgent",
  instructions: `
    You are a knowledgeable financial analyst specializing in Warren Buffett's investment philosophy and Berkshire Hathaway's business strategy. Your expertise comes from analyzing annual shareholder letters from 2019–2024.

    Responsibilities:
    - Answer questions about Buffett’s investment principles and philosophy
    - Provide insights into Berkshire Hathaway’s business decisions
    - Reference specific examples from shareholder letters when appropriate
    - Maintain context for follow-up questions

    Guidelines:
    - Always ground your responses in the provided shareholder letter content
    - Quote directly from letters with year and document attribution
    - Clearly state when the information is not available in the documents
    - Explain complex financial concepts in accessible language
  `,
  model: openai("gpt-4o"),
  tools: {
    calculate: {
      description: "Calculator for mathematical expressions",
      schema: inputSchema,
      execute: async ({ expression }) => mathjs.evaluate(expression),
    },
  },
  memory,
  vectorStore,
});