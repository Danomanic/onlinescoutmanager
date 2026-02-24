import type { OSMClient } from "../client.js";
import type { DashboardResponse } from "../types.js";

export class DashboardResource {
  constructor(private client: OSMClient) {}

  async getNextThings(
    sectionId: string,
    termId: string,
    section: string,
  ): Promise<DashboardResponse> {
    return this.client.post<DashboardResponse>(
      "/ext/dashboard/?action=getNextThings",
      { sectionid: sectionId, termid: termId, section },
    );
  }
}
