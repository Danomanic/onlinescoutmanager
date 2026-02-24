import type { OSMClient } from "../client.js";
import type { BadgeTagCloudResponse } from "../types.js";

export class BadgesResource {
  constructor(private client: OSMClient) {}

  async getTagCloud(
    sectionId: string,
    termId: string,
    section: string,
  ): Promise<BadgeTagCloudResponse> {
    return this.client.post<BadgeTagCloudResponse>(
      "/ext/programme/clouds/?action=getBadgeTagCloud",
      { sectionid: sectionId, termid: termId, section },
    );
  }
}
