import type { OSMClient } from "../client.js";
import type {
  CensusResponse,
  DeletableMembersResponse,
  FlexiRecordsResponse,
  MemberDetail,
  MemberTransfersResponse,
  MembersList,
  PatrolsResponse,
} from "../types.js";

export class MembersResource {
  constructor(private client: OSMClient) {}

  async list(sectionId: string, termId: string): Promise<MembersList> {
    return this.client.post<MembersList>(
      "/ext/members/contact/?action=getListOfMembers",
      { sectionid: sectionId, termid: termId },
    );
  }

  async get(sectionId: string, scoutId: string): Promise<MemberDetail> {
    return this.client.post<MemberDetail>(
      "/ext/members/contact/?action=getIndividual",
      {
        sectionid: sectionId,
        scoutid: scoutId,
        context: "members",
      },
    );
  }

  async getTransfers(sectionId: string): Promise<MemberTransfersResponse> {
    return this.client.post<MemberTransfersResponse>(
      "/ext/members/contact/?action=getMemberTransfers",
      { sectionid: sectionId },
    );
  }

  async getPatrols(
    sectionId: string,
    termId: string,
  ): Promise<PatrolsResponse> {
    return this.client.post<PatrolsResponse>(
      "/ext/members/patrols/?action=getPatrolsWithPeople",
      { sectionid: sectionId, termid: termId },
    );
  }

  async getCensus(sectionId: string, termId: string): Promise<CensusResponse> {
    return this.client.post<CensusResponse>(
      "/ext/members/census/?action=getDetails",
      { sectionid: sectionId, termid: termId },
    );
  }

  async getFlexiRecords(
    sectionId: string,
    archived = false,
  ): Promise<FlexiRecordsResponse> {
    return this.client.post<FlexiRecordsResponse>(
      "/ext/members/flexirecords/?action=getPatrolsWithPeople",
      { sectionid: sectionId, archived: archived ? "y" : "n" },
    );
  }

  async getDeletable(sectionId: string): Promise<DeletableMembersResponse> {
    return this.client.get<DeletableMembersResponse>(
      `/v3/members/review/deletion/${sectionId}`,
    );
  }
}
