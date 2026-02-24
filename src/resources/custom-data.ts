import type { OSMClient } from "../client.js";
import type { CustomDataResponse, CustomDataUpdateResponse } from "../types.js";

export class CustomDataResource {
  constructor(private client: OSMClient) {}

  async get(sectionId: string, memberId: string): Promise<CustomDataResponse> {
    return this.client.post<CustomDataResponse>(
      "/ext/customdata/?action=getData",
      {
        section_id: sectionId,
        associated_id: memberId,
        associated_type: "member",
        context: "members",
        group_order: "section",
      },
    );
  }

  async update(
    sectionId: string,
    memberId: string,
    groupId: string,
    data: Record<string, string>,
  ): Promise<CustomDataUpdateResponse> {
    const body: Record<string, string> = {
      section_id: sectionId,
      associated_id: memberId,
      associated_type: "member",
      group_id: groupId,
      context: "members",
    };

    for (const [key, value] of Object.entries(data)) {
      body[`data[${key}]`] = value;
    }

    return this.client.post<CustomDataUpdateResponse>(
      "/ext/customdata/?action=update",
      body,
    );
  }
}
