# Wayfair Partner Research Agent — Cursor Build Prompt

## What we're building

A shared furniture decision workspace for couples. Both partners log reactions to products
asynchronously. When either returns, an AI briefing surfaces their agreements, tensions,
and open questions — so they can make a joint decision without a joint session.

---

## Data model

Define these TypeScript types. 

```typescript
type Status = "keep" | "ruled_out" | "unsure";

type Reaction = {
  userId: string;           // "partner_a" | "partner_b"
  type: "love" | "concern" | "question";
  note: string;             // free text, max 200 chars
  at: string;               // ISO timestamp
};

type DecisionEntry = {
  itemId: string;
  name: string;
  imageUrl: string;
  productUrl: string;
  status: Status;           // set by the partner who added it
  reason: string;           // raw free text from the user
  tags: string[];           // LLM-extracted, e.g. ["fabric", "price"]
  openQuestions: string[];  // LLM-extracted unresolved questions
  snapshot: {
    price: number;
    rating: number;
    reviewCount: number;
    capturedAt: string;     // ISO timestamp
  };
  reactions: Reaction[];    // both partners add to this array
  addedBy: string;          // userId of who added this item
  addedAt: string;          // ISO timestamp
};

type RoomContext = {
  dimensions?: string;      // e.g. "14ft x 18ft"
  style?: string;           // e.g. "mid-century modern"
  constraints: string[];    // e.g. ["cats", "apartment", "no overhead assembly"]
  budgetMax?: number;
  category: string;         // e.g. "sofa"
};

type PartnerSession = {
  sessionToken: string;     // 6-char alphanumeric, used as URL param and Redis key suffix
  partnerA: { userId: string; name: string; };
  partnerB: { userId: string; name: string; } | null; // null until partner joins
  roomContext: RoomContext;
  entries: DecisionEntry[];
  createdAt: string;
  lastActiveAt: string;
};
```


---



## Demo script (for the hackathon presentation)

1. Open the app. Create a session as "Priya". Set room context: living room, 14x18ft,
   cats, mid-century modern, budget $1200.
2. Browse products. Mark Langley as "Not sure" — reason: "love the look, worried about
   fabric with cats". Mark Nora as "Keep" — reason: "washable covers, perfect".
   Mark Haven as "Rule out" — reason: "too bulky".
3. Copy the share link. Open in a second browser window as "Arun".
4. Arun reacts: ❤️ Love on Langley, ⚠️ Concern on Nora ("too plain for the space").
5. Switch back to Priya's window. Open shortlist. Show the joint briefing:
   *"Priya and Arun, you're closest on the Langley — Priya loves the look and Arun
   agrees, though the fabric with cats is still unresolved. The Nora has washable
   covers but Arun finds it too plain. The key question: is the Langley fabric
   performance-grade? That's worth checking before deciding."*
6. Point at the price change badge on the Langley: dropped $60 since Priya first looked.

That's the pitch. Two people, two devices, one shared decision — 90 seconds.
