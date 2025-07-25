import dotenv from "dotenv";
import { Mastra } from "@mastra/core";
import { PgVector } from "@mastra/pg";
import { berkshireAgent } from "./agents/berkshireAgent";

// Load environment variables
dotenv.config();

const {
  PG_HOST = "localhost",
  PG_PORT = "5432",
  PG_USER = "postgres",
  PG_PASSWORD = "rahul2610",
  PG_DATABASE = "postgres",
  DATABASE_URL
} = process.env;

const connectionString = DATABASE_URL ||
  `postgresql://${PG_USER}:${PG_PASSWORD}@${PG_HOST}:${parseInt(PG_PORT)}/${PG_DATABASE}`;

// Initialize vector store
const vectorStore = new PgVector({ connectionString });

// Create Mastra instance
const mastra = new Mastra({
  agents: { berkshireAgent },
  vectors: { vectorStore }
});

// Get agent
const agent = mastra.getAgent("berkshireAgent");

export { mastra, berkshireAgent, agent };