import type { OSMClient } from "../client.js";
import type {
  AttendanceBadgeRequirement,
  AttendanceResponse,
  OkResponse,
  UpdateAttendanceParams,
} from "../types.js";

export class AttendanceResource {
  constructor(private client: OSMClient) {}

  async get(
    sectionId: string,
    termId: string,
    section: string,
  ): Promise<AttendanceResponse> {
    return this.client.post<AttendanceResponse>(
      "/ext/members/attendance/?action=get",
      { sectionid: sectionId, termid: termId, section },
    );
  }

  async getBadgeRequirements(
    sectionId: string,
    section: string,
    date: string,
  ): Promise<AttendanceBadgeRequirement[]> {
    return this.client.post<AttendanceBadgeRequirement[]>(
      "/ext/members/attendance/?action=getAttendanceBadgeRequirements",
      { sectionid: sectionId, section, date },
    );
  }

  async update(params: UpdateAttendanceParams): Promise<OkResponse> {
    return this.client.post<OkResponse>(
      `/ext/members/attendance/?action=update&sectionid=${params.sectionId}&termid=${params.termId}`,
      {
        scouts: JSON.stringify(params.scoutIds),
        selectedDate: params.selectedDate,
        present: params.present,
        section: params.section,
        sectionid: params.sectionId,
        completedBadges: JSON.stringify(params.completedBadges ?? []),
        customData: JSON.stringify(params.customData ?? []),
      },
    );
  }
}
