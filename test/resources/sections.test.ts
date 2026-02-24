import { afterEach, describe, expect, it, vi } from "vitest";
import { OSMClient } from "../../src/client.js";
import { mockFetch } from "../helpers.js";

function authedClient() {
  const client = new OSMClient({ apiId: "id", token: "tok" });
  (client as any).auth = { userid: "1", secret: "s" };
  return client;
}

afterEach(() => vi.restoreAllMocks());

describe("sections.list", () => {
  it("fetches section list", async () => {
    const data = { "1": { sectionid: "1", sectionname: "Cubs" } };
    mockFetch(new Map([["listSections", { body: data }]]));

    const result = await authedClient().sections.list();
    expect(result).toHaveProperty("1");
  });
});

describe("sections.getTerms", () => {
  it("fetches terms", async () => {
    const data = { "1": [{ termid: "100", name: "Spring 2026" }] };
    mockFetch(new Map([["getTerms", { body: data }]]));

    const result = await authedClient().sections.getTerms();
    expect(result).toHaveProperty("1");
  });
});

describe("badges.getTagCloud", () => {
  it("fetches badge tag cloud", async () => {
    const data = { tags: { community: 1 }, tag_count: 1, badges: {} };
    const fetchMock = mockFetch(new Map([["getBadgeTagCloud", { body: data }]]));

    const result = await authedClient().badges.getTagCloud("100", "200", "cubs");

    expect(result.tag_count).toBe(1);
    expect(fetchMock.mock.calls[0][1].body).toContain("section=cubs");
  });
});

describe("dashboard.getNextThings", () => {
  it("fetches dashboard data", async () => {
    const data = {
      conf: {},
      is_full_admin: true,
      permissions: {},
      patrols: [],
      birthdays: [{ member_id: 1, firstname: "Casey" }],
      programme: [],
      events: [],
      outstandingpayments: [],
      notepad: { raw: "0", html: "" },
    };
    const fetchMock = mockFetch(new Map([["getNextThings", { body: data }]]));

    const result = await authedClient().dashboard.getNextThings("100", "200", "cubs");

    expect(result.birthdays).toHaveLength(1);
    expect(fetchMock.mock.calls[0][1].body).toContain("section=cubs");
  });
});
