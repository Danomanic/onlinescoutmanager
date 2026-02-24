import type { OSMClient } from "../client.js";
import type {
  ParentRotaResponse,
  ProgrammeDetailsResponse,
  ProgrammeSummaryResponse,
} from "../types.js";

export class ProgrammeResource {
  constructor(private client: OSMClient) {}

  async getSummary(
    sectionId: string,
    termId: string,
  ): Promise<ProgrammeSummaryResponse> {
    return this.client.post<ProgrammeSummaryResponse>(
      "/ext/programme/?action=getProgrammeSummary",
      { sectionid: sectionId, termid: termId },
    );
  }

  async getDetails(
    sectionId: string,
    eveningId: string,
  ): Promise<ProgrammeDetailsResponse> {
    return this.client.post<ProgrammeDetailsResponse>(
      "/ext/programme/?action=getProgramme",
      { sectionid: sectionId, eveningid: eveningId },
    );
  }

  async getParentRotaMembers(
    sectionId: string,
    eveningId: string,
  ): Promise<ParentRotaResponse> {
    return this.client.post<ParentRotaResponse>(
      "/ext/programme/?action=getMembersForParentRota",
      { sectionid: sectionId, eveningid: eveningId },
    );
  }

  async getAttachments(sectionId: string, eveningId: string): Promise<unknown> {
    return this.client.post(
      "/ext/programme/?action=programmeAttachmentsManifest",
      { sectionid: sectionId, eveningid: eveningId },
    );
  }

  async updateMeeting(
    sectionId: string,
    eveningId: string,
    parts: Record<string, unknown>,
  ): Promise<ProgrammeDetailsResponse> {
    return this.client.post<ProgrammeDetailsResponse>(
      "/ext/programme/?action=editEveningParts",
      {
        sectionid: sectionId,
        eveningid: eveningId,
        parts: JSON.stringify(parts),
      },
    );
  }
}
