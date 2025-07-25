import { Workflow } from "@mastra/core/workflows";
import { berkshireAgent } from "../agents/berkshireAgent";
import { Memory } from "@mastra/memory";

// Assume memory is already initialized as in your snippet
// import and initialize memory as shown in your code

export const berkshireWorkflow = new Workflow({
  name: "Berkshire Q&A Workflow",
  steps: [
    {
      id: "maybe-calculate",
      // This step checks if the input contains a math expression and uses the calculator tool if needed
      agent: berkshireAgent,
      tool: "calculate",
      // Only run this step if the input contains a math expression (simple regex check)
      condition: (context) => /\d+[\+\-\*\/]\d+/.test(context.input.question),
      input: (context) => ({
        expression: context.input.question,
      }),
    },
    {
      id: "ask-berkshire",
      agent: berkshireAgent,
      input: (context) => {
        // Pass the original question and, if available, the calculator result
        const calcResult = context.steps["maybe-calculate"]?.output;
        return {
          question: context.input.question,
          calcResult,
          memory: context.memory, // Optionally pass memory context
        };
      },
    },
    {
      id: "store-in-memory",
      // This step stores the conversation in memory
      run: async (context) => {
        await Memory.store({
          userInput: context.input.question,
          agentResponse: context.steps["ask-berkshire"].output,
        });
        return { status: "stored" };
      },
    },
  ],
});