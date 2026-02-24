import type { OSMClient } from "../client.js";
import type { OkResponse, SelectedEmailsResponse } from "../types.js";

export class EmailResource {
  constructor(private client: OSMClient) {}

  async getContacts(sectionId: string): Promise<SelectedEmailsResponse> {
    return this.client.post<SelectedEmailsResponse>(
      "/ext/members/email/?action=getSelectedEmailsFromContacts",
      { sectionid: sectionId },
    );
  }

  async sendTemplate(
    sectionId: string,
    subject: string,
    emails: Record<string, unknown>,
    edits: Record<string, unknown>,
  ): Promise<OkResponse> {
    return this.client.post<OkResponse>(
      "/ext/members/email/?action=sendTemplate",
      {
        sectionid: sectionId,
        subject,
        emails: JSON.stringify(emails),
        edits: JSON.stringify(edits),
      },
    );
  }
}
