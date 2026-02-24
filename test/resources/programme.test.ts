import { afterEach, describe, expect, it, vi } from "vitest";
import { OSMClient } from "../../src/client.js";
import { mockFetch } from "../helpers.js";

function authedClient() {
  const client = new OSMClient({ apiId: "id", token: "tok" });
  (client as any).auth = { userid: "1", secret: "s" };
  return client;
}

afterEach(() => vi.restoreAllMocks());

describe("programme.getSummary", () => {
  it("fetches programme summary", async () => {
    const data = { items: [{ eveningid: "1", title: "Camp Skills Night" }] };
    const fetchMock = mockFetch(
      new Map([["getProgrammeSummary", { body: data }]]),
    );

    const result = await authedClient().programme.getSummary("100", "200");

    expect(result.items[0].title).toBe("Camp Skills Night");
    expect(fetchMock.mock.calls[0][1].body).toContain("sectionid=100");
  });
});

describe("programme.getDetails", () => {
  it("fetches programme details for a meeting", async () => {
    const data = {
      items: [{ eveningid: "1", title: "Camp Skills Night" }],
      badgelinks: {},
    };
    mockFetch(new Map([["getProgramme", { body: data }]]));

    const result = await authedClient().programme.getDetails("100", "1");
    expect(result.badgelinks).toEqual({});
  });
});

describe("programme.getParentRotaMembers", () => {
  it("fetches parent rota members", async () => {
    const data = {
      status: true,
      error: null,
      data: [{ scoutid: "1", firstname: "Robert" }],
      meta: [],
    };
    mockFetch(new Map([["getMembersForParentRota", { body: data }]]));

    const result = await authedClient().programme.getParentRotaMembers(
      "100",
      "1",
    );
    expect(result.data[0].firstname).toBe("Robert");
  });
});

describe("programme.getAttachments", () => {
  it("fetches programme attachments", async () => {
    mockFetch(
      new Map([["programmeAttachmentsManifest", { body: { files: [] } }]]),
    );

    const result = await authedClient().programme.getAttachments("100", "1");
    expect(result).toEqual({ files: [] });
  });
});

describe("programme.updateMeeting", () => {
  it("updates meeting parts", async () => {
    const data = {
      items: [{ eveningid: "1", title: "Astronomy Night 2" }],
      badgelinks: [],
    };
    const fetchMock = mockFetch(
      new Map([["editEveningParts", { body: data }]]),
    );

    const result = await authedClient().programme.updateMeeting("100", "1", {
      title: "Astronomy Night 2",
    });

    expect(result.items[0].title).toBe("Astronomy Night 2");
    expect(fetchMock.mock.calls[0][1].body).toContain("parts=");
  });
});
