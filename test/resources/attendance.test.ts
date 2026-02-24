import { afterEach, describe, expect, it, vi } from "vitest";
import { OSMClient } from "../../src/client.js";
import { mockFetch } from "../helpers.js";

function authedClient() {
  const client = new OSMClient({ apiId: "id", token: "tok" });
  (client as any).auth = { userid: "1", secret: "s" };
  return client;
}

afterEach(() => vi.restoreAllMocks());

describe("attendance.get", () => {
  it("fetches attendance records", async () => {
    const data = {
      identifier: "scoutid",
      label: "name",
      items: [{ scoutid: 1, "2026-01-07": "Yes", total: 2 }],
      meetings: { "2026-01-07": "Welcome Back!" },
    };
    const fetchMock = mockFetch(new Map([["action=get", { body: data }]]));

    const result = await authedClient().attendance.get("100", "200", "cubs");

    expect(result.items).toHaveLength(1);
    expect(result.meetings["2026-01-07"]).toBe("Welcome Back!");
    expect(fetchMock.mock.calls[0][1].body).toContain("section=cubs");
  });
});

describe("attendance.getBadgeRequirements", () => {
  it("fetches badge requirements for a date", async () => {
    const data = [{ badge_id: "1593", badgeName: "Communicator", name: "Code" }];
    const fetchMock = mockFetch(new Map([["getAttendanceBadgeRequirements", { body: data }]]));

    const result = await authedClient().attendance.getBadgeRequirements("100", "cubs", "2026-01-14");

    expect(result[0].badgeName).toBe("Communicator");
    expect(fetchMock.mock.calls[0][1].body).toContain("date=2026-01-14");
  });
});

describe("attendance.update", () => {
  it("updates attendance for scouts", async () => {
    const fetchMock = mockFetch(new Map([["action=update", { body: { ok: true } }]]));

    const result = await authedClient().attendance.update({
      sectionId: "100",
      termId: "200",
      scoutIds: [3008213],
      selectedDate: "2026-01-14",
      present: "Yes",
      section: "cubs",
    });

    expect(result.ok).toBe(true);
    const body = fetchMock.mock.calls[0][1].body;
    expect(body).toContain("scouts=%5B3008213%5D");
    expect(body).toContain("present=Yes");
  });
});
