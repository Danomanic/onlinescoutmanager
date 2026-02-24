import { OSMAuthError, OSMError } from "./errors.js";
import type { AuthCredentials, AuthResponse, ClientOptions } from "./types.js";

import { AttendanceResource } from "./resources/attendance.js";
import { BadgesResource } from "./resources/badges.js";
import { CustomDataResource } from "./resources/custom-data.js";
import { DashboardResource } from "./resources/dashboard.js";
import { EmailResource } from "./resources/email.js";
import { MembersResource } from "./resources/members.js";
import { ProgrammeResource } from "./resources/programme.js";
import { SectionsResource } from "./resources/sections.js";

const DEFAULT_BASE_URL = "https://www.onlinescoutmanager.co.uk";

export class OSMClient {
  readonly apiId: string;
  readonly token: string;
  readonly baseUrl: string;

  private auth: AuthCredentials | null = null;

  readonly members: MembersResource;
  readonly attendance: AttendanceResource;
  readonly programme: ProgrammeResource;
  readonly sections: SectionsResource;
  readonly badges: BadgesResource;
  readonly dashboard: DashboardResource;
  readonly customData: CustomDataResource;
  readonly email: EmailResource;

  constructor(options: ClientOptions) {
    this.apiId = options.apiId;
    this.token = options.token;
    this.baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, "");

    this.members = new MembersResource(this);
    this.attendance = new AttendanceResource(this);
    this.programme = new ProgrammeResource(this);
    this.sections = new SectionsResource(this);
    this.badges = new BadgesResource(this);
    this.dashboard = new DashboardResource(this);
    this.customData = new CustomDataResource(this);
    this.email = new EmailResource(this);
  }

  get isAuthorized(): boolean {
    return this.auth !== null;
  }

  async authorize(email: string, password: string): Promise<void> {
    const data = await this.post<AuthResponse>(
      "/users.php?action=authorise",
      { email, password },
      true,
    );
    this.auth = { userid: data.userid, secret: data.secret };
  }

  async post<T>(
    path: string,
    body: Record<string, string> = {},
    skipAuth = false,
  ): Promise<T> {
    const params = new URLSearchParams({
      apiid: this.apiId,
      token: this.token,
      ...body,
    });

    if (!skipAuth) {
      if (!this.auth) throw new OSMAuthError();
      params.set("userid", this.auth.userid);
      params.set("secret", this.auth.secret);
    }

    const url = `${this.baseUrl}${path}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new OSMError(
        `OSM API error: ${response.status} ${response.statusText}`,
        response.status,
        text,
      );
    }

    return response.json() as Promise<T>;
  }

  async get<T>(path: string, query: Record<string, string> = {}): Promise<T> {
    if (!this.auth) throw new OSMAuthError();

    const params = new URLSearchParams(query);
    const url = `${this.baseUrl}${path}?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `${this.auth.userid}:${this.auth.secret}`,
      },
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new OSMError(
        `OSM API error: ${response.status} ${response.statusText}`,
        response.status,
        text,
      );
    }

    return response.json() as Promise<T>;
  }
}
