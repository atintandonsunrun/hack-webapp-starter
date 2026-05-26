import { createAgentUIStreamResponse } from "ai";
import { chatAgent, researchAgent, boardAgent, type AgentMode } from "@/lib/agents";
import { requireSubconsciousApiKey } from "@/lib/subconscious";

export const maxDuration = 300;

export async function POST(request: Request) {
  try {
    requireSubconsciousApiKey();
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Missing Subconscious API key",
      },
      { status: 500 },
    );
  }

  const body = await request.json();
  const messages = body.messages ?? [];
  const rawMode = body.mode;
  const mode: AgentMode =
    rawMode === "agent" ? "agent" : rawMode === "board" ? "board" : "chat";
  console.log("[chat/route] mode received:", rawMode, "→ resolved:", mode);

  if (mode === "agent") {
    return createAgentUIStreamResponse({
      agent: researchAgent,
      uiMessages: messages,
    });
  }

  if (mode === "board") {
    return createAgentUIStreamResponse({
      agent: boardAgent,
      uiMessages: messages,
    });
  }

  return createAgentUIStreamResponse({
    agent: chatAgent,
    uiMessages: messages,
  });
}
