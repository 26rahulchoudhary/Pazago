import { Mastra } from "@mastra/core";
import { berkshireAgent } from "./agents/berkshireAgent";

export const mastra = new Mastra({
  agents: { berkshireAgent },
  // telemetry: { ... } // optional
});