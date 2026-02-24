import { afterEach, describe, expect, it, vi } from "vitest";
import { OSMClient } from "../../src/client.js";
import { mockFetch } from "../helpers.js";

function authedClient() {
  const client = new OSMClient({ apiId: "id", token: "tok" });
  (client as any).auth = { userid: "1", secret: "s" };
  return client;
}

afterEach(() => vi.restoreAllMocks());

describe("customData.get", () => {
  it("fetches custom data for a member", async () => {
    const data = {
      status: true,
      error: null,
      data: [
        {
          group_id: 7,
          name: "Other",
          columns: [{ column_id: 34, label: "Gender" }],
        },
      ],
      meta: {},
    };
    const fetchMock = mockFetch(new Map([["customdata", { body: data }]]));

    const result = await authedClient().customData.get("100", "42");

    expect(result.data[0].name).toBe("Other");
    expect(fetchMock.mock.calls[0][1].body).toContain("associated_id=42");
    expect(fetchMock.mock.calls[0][1].body).toContain("associated_type=member");
  });
});

describe("customData.update", () => {
  it("updates custom data with nested data keys", async () => {
    const data = {
      status: true,
      error: null,
      data: { lastname: "Smith" },
      meta: {},
    };
    const fetchMock = mockFetch(new Map([["customdata", { body: data }]]));

    const result = await authedClient().customData.update("100", "42", "2", {
      firstname: "Test",
      lastname: "Smith",
    });

    expect(result.data.lastname).toBe("Smith");
    const body = fetchMock.mock.calls[0][1].body;
    expect(body).toContain("data%5Bfirstname%5D=Test");
    expect(body).toContain("data%5Blastname%5D=Smith");
  });
});

describe("email.getContacts", () => {
  it("fetches email contacts for a section", async () => {
    const data = {
      emails: {
        "1": {
          emails: ["parent@example.org"],
          firstname: "Jamie",
          member_id: 1,
        },
      },
      count: 1,
      blocks: [],
      daily_limit_reached: false,
    };
    const fetchMock = mockFetch(
      new Map([["getSelectedEmailsFromContacts", { body: data }]]),
    );

    const result = await authedClient().email.getContacts("100");

    expect(result.count).toBe(1);
    expect(fetchMock.mock.calls[0][1].body).toContain("sectionid=100");
  });
});

describe("email.sendTemplate", () => {
  it("sends an email template", async () => {
    const fetchMock = mockFetch(
      new Map([["sendTemplate", { body: { ok: true } }]]),
    );

    const result = await authedClient().email.sendTemplate(
      "100",
      "Test Subject",
      { "1": { firstname: "Jamie", emails: ["test@example.org"] } },
      { "0": { "0": { text: "<p>Hello</p>" } } },
    );

    expect(result.ok).toBe(true);
    const body = fetchMock.mock.calls[0][1].body;
    expect(body).toContain("subject=Test+Subject");
  });
});
