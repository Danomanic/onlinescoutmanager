import { afterEach, describe, expect, it, vi } from "vitest";
import { OSMClient } from "../../src/client.js";
import { mockFetch } from "../helpers.js";

function authedClient() {
  const client = new OSMClient({ apiId: "id", token: "tok" });
  (client as any).auth = { userid: "1", secret: "s" };
  return client;
}

afterEach(() => vi.restoreAllMocks());

describe("members.list", () => {
  it("fetches member list for a section and term", async () => {
    const data = { identifier: "scoutid", photos: true, items: [{ scoutid: 1, firstname: "Jamie" }] };
    const fetchMock = mockFetch(new Map([["getListOfMembers", { body: data }]]));

    const result = await authedClient().members.list("100", "200");

    expect(result).toEqual(data);
    expect(fetchMock.mock.calls[0][1].body).toContain("sectionid=100");
    expect(fetchMock.mock.calls[0][1].body).toContain("termid=200");
  });
});

describe("members.get", () => {
  it("fetches individual member details", async () => {
    const data = { ok: true, read_only: [], data: { scoutid: "42", firstname: "Jamie" }, meta: [] };
    const fetchMock = mockFetch(new Map([["getIndividual", { body: data }]]));

    const result = await authedClient().members.get("100", "42");

    expect(result).toEqual(data);
    expect(fetchMock.mock.calls[0][1].body).toContain("scoutid=42");
    expect(fetchMock.mock.calls[0][1].body).toContain("context=members");
  });
});

describe("members.getTransfers", () => {
  it("fetches member transfers", async () => {
    const data = { status: true, error: null, data: [{ member_id: 1 }], meta: [] };
    mockFetch(new Map([["getMemberTransfers", { body: data }]]));

    const result = await authedClient().members.getTransfers("100");
    expect(result.status).toBe(true);
    expect(result.data).toHaveLength(1);
  });
});

describe("members.getPatrols", () => {
  it("fetches patrols with members", async () => {
    const data = { "12001": { patrolid: "12001", name: "Blue", members: [] } };
    const fetchMock = mockFetch(new Map([["getPatrolsWithPeople", { body: data }]]));

    const result = await authedClient().members.getPatrols("100", "200");

    expect(result["12001"].name).toBe("Blue");
    expect(fetchMock.mock.calls[0][1].body).toContain("sectionid=100");
  });
});

describe("members.getCensus", () => {
  it("fetches census details", async () => {
    const data = { identifier: "scoutid", items: [{ scoutid: "1", firstname: "Sam" }] };
    mockFetch(new Map([["getDetails", { body: data }]]));

    const result = await authedClient().members.getCensus("100", "200");
    expect(result.items[0].firstname).toBe("Sam");
  });
});

describe("members.getFlexiRecords", () => {
  it("fetches flexi-records with archived flag", async () => {
    const data = { identifier: "extraid", label: "name", items: [{ extraid: "1", name: "Log" }] };
    const fetchMock = mockFetch(new Map([["flexirecords", { body: data }]]));

    await authedClient().members.getFlexiRecords("100", true);
    expect(fetchMock.mock.calls[0][1].body).toContain("archived=y");
  });
});

describe("members.getDeletable", () => {
  it("fetches deletable members via GET", async () => {
    const data = { status: true, error: null, data: [{ id: 1, firstname: "Pat" }], meta: [] };
    const fetchMock = mockFetch(new Map([["deletion", { body: data }]]));

    const result = await authedClient().members.getDeletable("100");
    expect(result.data[0].firstname).toBe("Pat");
    expect(fetchMock.mock.calls[0][1].method).toBe("GET");
  });
});
