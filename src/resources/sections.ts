import type { OSMClient } from "../client.js";
import type { SectionsResponse } from "../types.js";

export class SectionsResource {
  constructor(private client: OSMClient) {}

  async list(): Promise<SectionsResponse> {
    return this.client.post<SectionsResponse>(
      "/ext/members/sectionplanning/?action=listSections",
    );
  }

  async getTerms(): Promise<unknown> {
    return this.client.post("/api.php?action=getTerms");
  }
}
