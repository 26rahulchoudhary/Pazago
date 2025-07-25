import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import * as mathjs from "mathjs";

const inputSchema = z.object({ expression: z.string() });

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
});