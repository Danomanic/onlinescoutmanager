export class OSMError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = "OSMError";
    this.status = status;
    this.body = body;
  }
}

export class OSMAuthError extends OSMError {
  constructor(message = "Not authorized — call client.authorize() first") {
    super(message, 401);
    this.name = "OSMAuthError";
  }
}
