import { tool } from "ai";
import { z } from "zod";
import { getSession, saveSession } from "@/lib/board/state";

export const getBoard = tool({
  description:
    "Get the full shared board: room context, all shortlisted items, their statuses, and every partner reaction. Call this before generating a briefing.",
  inputSchema: z.object({}),
  execute: async () => {
    const session = getSession();
    return {
      partners: {
        a: session.partnerA,
        b: session.partnerB,
      },
      roomContext: session.roomContext,
      entries: session.entries.map((e) => ({
        itemId: e.itemId,
        name: e.name,
        productUrl: e.productUrl,
        status: e.status,
        reason: e.reason,
        tags: e.tags,
        openQuestions: e.openQuestions,
        snapshot: e.snapshot,
        reactions: e.reactions,
        addedBy: e.addedBy,
      })),
      lastActiveAt: session.lastActiveAt,
    };
  },
});

export const addReaction = tool({
  description:
    "Add a reaction (love, concern, or question) from a partner to a board item.",
  inputSchema: z.object({
    itemId: z
      .string()
      .describe(
        'ID of the item to react to, e.g. "langley", "nora", "haven"',
      ),
    userId: z
      .enum(["partner_a", "partner_b"])
      .describe(
        'Who is reacting — "partner_a" for Priya, "partner_b" for Arun',
      ),
    type: z
      .enum(["love", "concern", "question"])
      .describe("Type of reaction"),
    note: z.string().max(200).describe("Short note, max 200 characters"),
  }),
  execute: async ({ itemId, userId, type, note }) => {
    const session = getSession();
    const entry = session.entries.find((e) => e.itemId === itemId);
    if (!entry) {
      return { error: `Item "${itemId}" not found on the board.` };
    }
    entry.reactions.push({ userId, type, note, at: new Date().toISOString() });
    saveSession(session);
    const partnerName =
      userId === "partner_a" ? session.partnerA.name : session.partnerB?.name ?? userId;
    return {
      success: true,
      message: `${partnerName}'s ${type} reaction added to ${entry.name}.`,
      reaction: { userId, type, note },
    };
  },
});

export const setItemStatus = tool({
  description:
    "Update the status and reason for a board item (keep, ruled_out, or unsure).",
  inputSchema: z.object({
    itemId: z.string().describe("ID of the item to update"),
    userId: z
      .enum(["partner_a", "partner_b"])
      .describe("Who is updating the status"),
    status: z.enum(["keep", "ruled_out", "unsure"]),
    reason: z.string().describe("Short reason for the status change"),
  }),
  execute: async ({ itemId, userId, status, reason }) => {
    const session = getSession();
    const entry = session.entries.find((e) => e.itemId === itemId);
    if (!entry) {
      return { error: `Item "${itemId}" not found on the board.` };
    }
    entry.status = status;
    entry.reason = reason;
    saveSession(session);
    const partnerName =
      userId === "partner_a" ? session.partnerA.name : session.partnerB?.name ?? userId;
    return {
      success: true,
      message: `${partnerName} marked ${entry.name} as "${status}".`,
      item: { itemId, status, reason },
    };
  },
});

export const boardTools = {
  getBoard,
  addReaction,
  setItemStatus,
};
