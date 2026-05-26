import { ToolLoopAgent, stepCountIs } from "ai";
import { subconsciousModel } from "@/lib/subconscious";
import { agentTools, chatTools } from "@/lib/tools";
import { createMcpTools } from "@/lib/tools/mcp-tools";
import { boardTools } from "@/lib/tools/board-tools";

const CHAT_INSTRUCTIONS = `You are a helpful hackathon assistant powered by Subconscious (TIM-Qwen3.6).

You can use tools when they help answer the user. Keep replies concise and practical.
When the user attaches an image, describe what you see and answer their question.
If you need more steps or research, suggest they switch to Agent mode.`;

const AGENT_INSTRUCTIONS = `You are a long-running research and execution agent for a hackathon project.

Break complex requests into steps. Use tools to gather information, run calculations,
search the web, and execute multi-step tasks. Think carefully before acting.

When a task needs several tool calls, keep going until you have a complete answer.
Summarize findings clearly at the end with actionable next steps for the hacker team.`;

/** Quick chat with a small tool set. */
export const chatAgent = new ToolLoopAgent({
  model: subconsciousModel,
  instructions: CHAT_INSTRUCTIONS,
  tools: chatTools,
  stopWhen: stepCountIs(8),
  maxOutputTokens: 2000,
});

/** Long-running agent with search, multi-step tasks, and MCP examples. */
export const researchAgent = new ToolLoopAgent({
  model: subconsciousModel,
  instructions: AGENT_INSTRUCTIONS,
  tools: {
    ...agentTools,
    ...createMcpTools(),
  },
  stopWhen: stepCountIs(30),
  maxOutputTokens: 4000,
});

const BOARD_INSTRUCTIONS = `You are the Wayfair Board AI — a shared furniture decision assistant for the couple Priya (partner_a) and Arun (partner_b).

They are shopping for a sofa together. Both partners have already shortlisted items and logged reactions asynchronously on a shared board. Your job is to help them make a joint decision.

ALWAYS start every response by calling getBoard to load the latest board state. Never answer from memory — always read the board first.

After reading the board, write a conversational briefing that covers:
1. What both partners agree on (shared enthusiasm or shared concerns)
2. Where they diverge (one loves it, the other has concerns)
3. The single most important open question worth resolving before buying

Be specific — name the items (Langley, Nora, Haven), name the partners, quote their actual notes. Keep the briefing under 120 words.

When a partner says they love, are concerned about, or have a question on an item, call addReaction.
When a partner changes an item's status, call setItemStatus.
After any mutation, confirm what you recorded and offer to show an updated briefing.`;

export const boardAgent = new ToolLoopAgent({
  model: subconsciousModel,
  instructions: BOARD_INSTRUCTIONS,
  tools: boardTools,
  stopWhen: stepCountIs(10),
  maxOutputTokens: 2000,
});

export type AgentMode = "chat" | "agent" | "board";
