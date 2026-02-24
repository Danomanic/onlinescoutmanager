import { vi } from "vitest";

interface MockResponseInit {
  status?: number;
  statusText?: string;
  headers?: Record<string, string>;
}

export function mockFetch(responses: Map<string, { body: unknown; init?: MockResponseInit }>) {
  const fn = vi.fn(async (input: string | URL | Request) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    for (const [pattern, { body, init }] of responses) {
      if (url.includes(pattern)) {
        return new Response(JSON.stringify(body), {
          status: init?.status ?? 200,
          statusText: init?.statusText ?? "OK",
          headers: { "Content-Type": "application/json", ...init?.headers },
        });
      }
    }
    return new Response("Not Found", { status: 404 });
  });
  vi.stubGlobal("fetch", fn);
  return fn;
}

export function createAuthorizedClient() {
  const { OSMClient } = require("../src/client.js");
  const client = new OSMClient({ apiId: "test-id", token: "test-token" });
  // Manually set auth state to skip authorize() call in tests
  (client as any).auth = { userid: "123", secret: "abc123def456abc123def456abc123de" };
  return client;
}
