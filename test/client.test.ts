import { afterEach, describe, expect, it, vi } from "vitest";
import { OSMClient } from "../src/client.js";
import { OSMAuthError, OSMError } from "../src/errors.js";
import { mockFetch } from "./helpers.js";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("OSMClient", () => {
  it("creates with required options", () => {
    const client = new OSMClient({ apiId: "id", token: "tok" });
    expect(client.apiId).toBe("id");
    expect(client.token).toBe("tok");
    expect(client.baseUrl).toBe("https://www.onlinescoutmanager.co.uk");
    expect(client.isAuthorized).toBe(false);
  });

  it("accepts a custom base URL and strips trailing slashes", () => {
    const client = new OSMClient({
      apiId: "id",
      token: "tok",
      baseUrl: "https://custom.example.com/",
    });
    expect(client.baseUrl).toBe("https://custom.example.com");
  });

  it("has all resource namespaces", () => {
    const client = new OSMClient({ apiId: "id", token: "tok" });
    expect(client.members).toBeDefined();
    expect(client.attendance).toBeDefined();
    expect(client.programme).toBeDefined();
    expect(client.sections).toBeDefined();
    expect(client.badges).toBeDefined();
    expect(client.dashboard).toBeDefined();
    expect(client.customData).toBeDefined();
    expect(client.email).toBeDefined();
  });
});

describe("authorize", () => {
  it("sets auth credentials on success", async () => {
    const fetchMock = mockFetch(
      new Map([
        ["action=authorise", { body: { userid: "42", secret: "s3cret" } }],
      ]),
    );

    const client = new OSMClient({ apiId: "id", token: "tok" });
    await client.authorize("user@example.com", "pass");

    expect(client.isAuthorized).toBe(true);
    expect(fetchMock).toHaveBeenCalledOnce();

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain("/users.php?action=authorise");
    expect(init.method).toBe("POST");
    expect(init.body).toContain("email=user%40example.com");
    expect(init.body).toContain("password=pass");
    expect(init.body).toContain("apiid=id");
    expect(init.body).toContain("token=tok");
  });
});

describe("post (authenticated)", () => {
  it("throws OSMAuthError when not authorized", async () => {
    const client = new OSMClient({ apiId: "id", token: "tok" });
    await expect(client.post("/some/path")).rejects.toThrow(OSMAuthError);
  });

  it("includes userid and secret in authenticated requests", async () => {
    const fetchMock = mockFetch(
      new Map([
        ["action=authorise", { body: { userid: "42", secret: "s3cret" } }],
        ["/ext/test", { body: { ok: true } }],
      ]),
    );

    const client = new OSMClient({ apiId: "id", token: "tok" });
    await client.authorize("u@e.com", "p");
    await client.post("/ext/test", { foo: "bar" });

    const [, init] = fetchMock.mock.calls[1];
    expect(init.body).toContain("userid=42");
    expect(init.body).toContain("secret=s3cret");
    expect(init.body).toContain("foo=bar");
  });

  it("throws OSMError on non-2xx response", async () => {
    mockFetch(
      new Map([
        ["action=authorise", { body: { userid: "42", secret: "s3cret" } }],
        [
          "/ext/fail",
          { body: "Forbidden", init: { status: 403, statusText: "Forbidden" } },
        ],
      ]),
    );

    const client = new OSMClient({ apiId: "id", token: "tok" });
    await client.authorize("u@e.com", "p");

    await expect(client.post("/ext/fail")).rejects.toThrow(OSMError);
    try {
      await client.post("/ext/fail");
    } catch (e) {
      expect((e as OSMError).status).toBe(403);
    }
  });
});

describe("get (authenticated)", () => {
  it("throws OSMAuthError when not authorized", async () => {
    const client = new OSMClient({ apiId: "id", token: "tok" });
    await expect(client.get("/v3/test")).rejects.toThrow(OSMAuthError);
  });

  it("sends GET with Authorization header", async () => {
    const fetchMock = mockFetch(
      new Map([
        ["action=authorise", { body: { userid: "42", secret: "s3cret" } }],
        ["/v3/test", { body: { status: true } }],
      ]),
    );

    const client = new OSMClient({ apiId: "id", token: "tok" });
    await client.authorize("u@e.com", "p");
    await client.get("/v3/test", { sectionid: "1" });

    const [url, init] = fetchMock.mock.calls[1];
    expect(init.method).toBe("GET");
    expect(url).toContain("sectionid=1");
    expect(init.headers.Authorization).toBe("42:s3cret");
  });
});

describe("multiple instances", () => {
  it("maintains separate auth state", async () => {
    mockFetch(
      new Map([
        ["action=authorise", { body: { userid: "99", secret: "xyz" } }],
      ]),
    );

    const a = new OSMClient({ apiId: "a", token: "a" });
    const b = new OSMClient({ apiId: "b", token: "b" });

    await a.authorize("a@test.com", "pw");
    expect(a.isAuthorized).toBe(true);
    expect(b.isAuthorized).toBe(false);
  });
});
