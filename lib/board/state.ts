export type Status = "keep" | "ruled_out" | "unsure";

export type Reaction = {
  userId: string;
  type: "love" | "concern" | "question";
  note: string;
  at: string;
};

export type DecisionEntry = {
  itemId: string;
  name: string;
  imageUrl: string;
  productUrl: string;
  status: Status;
  reason: string;
  tags: string[];
  openQuestions: string[];
  snapshot: {
    price: number;
    rating: number;
    reviewCount: number;
    capturedAt: string;
  };
  reactions: Reaction[];
  addedBy: string;
  addedAt: string;
};

export type RoomContext = {
  dimensions?: string;
  style?: string;
  constraints: string[];
  budgetMax?: number;
  category: string;
};

export type PartnerSession = {
  sessionToken: string;
  partnerA: { userId: string; name: string };
  partnerB: { userId: string; name: string } | null;
  roomContext: RoomContext;
  entries: DecisionEntry[];
  createdAt: string;
  lastActiveAt: string;
};

const store = new Map<string, PartnerSession>();

const DEMO_TOKEN = "DEMO01";

function buildDemoSession(): PartnerSession {
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

  return {
    sessionToken: DEMO_TOKEN,
    partnerA: { userId: "partner_a", name: "Priya" },
    partnerB: { userId: "partner_b", name: "Arun" },
    roomContext: {
      dimensions: "14ft x 18ft",
      style: "mid-century modern",
      constraints: ["cats", "apartment", "no overhead assembly"],
      budgetMax: 1200,
      category: "sofa",
    },
    createdAt: yesterday.toISOString(),
    lastActiveAt: twoHoursAgo.toISOString(),
    entries: [
      {
        itemId: "langley",
        name: "Langley Sofa",
        imageUrl:
          "https://assets.wfcdn.com/im/langley-sofa.jpg",
        productUrl: "https://www.wayfair.com/furniture/pdp/langley-sofa",
        status: "unsure",
        reason: "love the look, worried about fabric with cats",
        tags: ["fabric", "mid-century", "price"],
        openQuestions: ["Is the fabric performance-grade for cats?"],
        snapshot: {
          price: 849,
          rating: 4.6,
          reviewCount: 312,
          capturedAt: yesterday.toISOString(),
        },
        reactions: [
          {
            userId: "partner_b",
            type: "love",
            note: "Great silhouette, fits the mid-century vibe perfectly",
            at: twoHoursAgo.toISOString(),
          },
        ],
        addedBy: "partner_a",
        addedAt: yesterday.toISOString(),
      },
      {
        itemId: "nora",
        name: "Nora Sofa",
        imageUrl:
          "https://assets.wfcdn.com/im/nora-sofa.jpg",
        productUrl: "https://www.wayfair.com/furniture/pdp/nora-sofa",
        status: "keep",
        reason: "washable covers, perfect",
        tags: ["washable", "practical", "cats"],
        openQuestions: [],
        snapshot: {
          price: 699,
          rating: 4.4,
          reviewCount: 187,
          capturedAt: yesterday.toISOString(),
        },
        reactions: [
          {
            userId: "partner_b",
            type: "concern",
            note: "too plain for the space",
            at: twoHoursAgo.toISOString(),
          },
        ],
        addedBy: "partner_a",
        addedAt: yesterday.toISOString(),
      },
      {
        itemId: "haven",
        name: "Haven Sectional",
        imageUrl:
          "https://assets.wfcdn.com/im/haven-sectional.jpg",
        productUrl: "https://www.wayfair.com/furniture/pdp/haven-sectional",
        status: "ruled_out",
        reason: "too bulky",
        tags: ["sectional", "large", "bulky"],
        openQuestions: [],
        snapshot: {
          price: 1150,
          rating: 4.2,
          reviewCount: 94,
          capturedAt: yesterday.toISOString(),
        },
        reactions: [],
        addedBy: "partner_a",
        addedAt: yesterday.toISOString(),
      },
    ],
  };
}

export function getSession(token = DEMO_TOKEN): PartnerSession {
  if (!store.has(token)) {
    store.set(token, buildDemoSession());
  }
  return store.get(token)!;
}

export function saveSession(session: PartnerSession): void {
  session.lastActiveAt = new Date().toISOString();
  store.set(session.sessionToken, session);
}
