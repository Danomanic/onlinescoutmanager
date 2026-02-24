export interface ClientOptions {
  apiId: string;
  token: string;
  baseUrl?: string;
}

export interface AuthCredentials {
  userid: string;
  secret: string;
}

export interface AuthResponse {
  userid: string;
  secret: string;
}

// Members
export interface MemberListItem {
  scoutid: number;
  firstname: string;
  lastname: string;
  full_name: string;
  photo_guid: string;
  patrolid: number;
  patrol: string;
  sectionid: number;
  enddate: string | null;
  age: string;
  patrol_role_level_label: string;
  active: boolean;
}

export interface MembersList {
  identifier: string;
  photos: boolean;
  items: MemberListItem[];
}

export interface MemberDetail {
  ok: boolean;
  read_only: string[];
  data: Record<string, unknown>;
  meta: Record<string, unknown>[];
}

export interface MemberTransfer {
  direction: string;
  member_id: number;
  firstname: string;
  lastname: string;
  photo_guid: string;
  type: string;
  date: string;
  section_id: number;
  section_name: { group: string; section: string };
  section_long: string;
  mode: string;
  id: string;
}

export interface MemberTransfersResponse {
  status: boolean;
  error: string | null;
  data: MemberTransfer[];
  meta: unknown[];
}

export interface PatrolMember {
  firstname: string;
  lastname: string;
  scout_id: number;
  scoutid: number;
  photo_guid: string;
  patrolid: number;
  patrolleader: string;
  patrol: string;
  sectionid: number;
  enddate: string | null;
  age: string;
  patrol_role_level_label: string;
  active: number;
  editable: boolean;
}

export interface Patrol {
  patrolid: string;
  sectionid: string;
  name: string;
  active: string;
  points: string;
  census_costs: boolean;
  members: PatrolMember[];
}

export type PatrolsResponse = Record<string, Patrol>;

export interface CensusItem {
  scoutid: string;
  firstname: string;
  lastname: string;
  joined: string;
  photo_guid: string | null;
  sex: string;
  ethnicity: string;
  disabilities: string;
  myscout: string;
  raw_disabilities: string[];
  _filterString: string;
}

export interface CensusResponse {
  identifier: string;
  items: CensusItem[];
}

export interface FlexiRecordItem {
  extraid: string;
  name: string;
}

export interface FlexiRecordsResponse {
  identifier: string;
  label: string;
  items: FlexiRecordItem[];
}

// Attendance
export interface AttendanceItem {
  firstname: string;
  lastname: string;
  patrolid: number;
  active: boolean;
  scoutid: number;
  total: number;
  [date: string]: unknown;
}

export interface AttendanceResponse {
  identifier: string;
  label: string;
  items: AttendanceItem[];
  meetings: Record<string, string>;
}

export interface AttendanceBadgeRequirement {
  badge_id: string;
  badgeName: string;
  column_id: string;
  name: string;
  meetingdate: string;
  section: string;
  sectionid: number;
}

export interface UpdateAttendanceParams {
  sectionId: string;
  termId: string;
  scoutIds: number[];
  selectedDate: string;
  present: string;
  section: string;
  completedBadges?: unknown[];
  customData?: unknown[];
}

// Programme
export interface ProgrammeSummaryItem {
  eveningid: string;
  sectionid: string;
  title: string;
  notesforparents: string;
  parentsrequired: string;
  meetingdate: string;
  starttime: string;
  endtime: string;
  soft_deleted: string;
}

export interface ProgrammeSummaryResponse {
  items: ProgrammeSummaryItem[];
}

export interface ProgrammeDetailItem {
  eveningid: string;
  sectionid: string;
  title: string;
  meetingdate: string;
  starttime: string;
  endtime: string;
  help: { scoutid: string; scout: string }[];
}

export interface ProgrammeDetailsResponse {
  items: ProgrammeDetailItem[];
  badgelinks: Record<string, unknown>;
}

export interface ParentRotaMember {
  scoutid: string;
  firstname: string;
  lastname: string;
  photo_guid: string;
  patrol_id: number;
}

export interface ParentRotaResponse {
  status: boolean;
  error: string | null;
  data: ParentRotaMember[];
  meta: unknown[];
}

// Badges
export interface BadgeTagCloudResponse {
  tags: Record<string, number>;
  tag_count: number;
  badges: Record<string, number>;
}

// Dashboard
export interface DashboardResponse {
  conf: Record<string, number>;
  is_full_admin: boolean;
  permissions: Record<string, unknown>;
  patrols: Record<string, unknown>[];
  birthdays: Record<string, unknown>[];
  programme: Record<string, unknown>[];
  events: Record<string, unknown>[];
  outstandingpayments: Record<string, unknown>[];
  notepad: { raw: string; html: string };
  [key: string]: unknown;
}

// Custom Data
export interface CustomDataColumn {
  column_id: number;
  type: string;
  varname: string;
  label: string;
  value: string | null;
}

export interface CustomDataGroup {
  group_id: number;
  group_type: string;
  identifier: string;
  name: string;
  columns: CustomDataColumn[];
}

export interface CustomDataResponse {
  status: boolean;
  error: string | null;
  data: CustomDataGroup[];
  meta: Record<string, unknown>;
}

export interface CustomDataUpdateResponse {
  status: boolean;
  error: string | null;
  data: Record<string, unknown>;
  meta: Record<string, unknown>;
}

// Email
export interface EmailContact {
  emails: string[];
  firstname: string;
  lastname: string;
  photo_guid: string;
  member_id: number;
}

export interface SelectedEmailsResponse {
  emails: Record<string, EmailContact>;
  count: number;
  blocks: unknown[];
  daily_limit_reached: boolean;
}

// Sections
export interface SectionsResponse {
  [key: string]: unknown;
}

// Risk Assessments
export interface RiskAssessmentCategoriesResponse {
  status: boolean;
  error: string | null;
  data: { name: string }[];
  meta: Record<string, unknown>;
}

// Deletable Members
export interface DeletableMembersResponse {
  status: boolean;
  error: string | null;
  data: {
    firstname: string;
    lastname: string;
    date_deleted: string;
    id: number;
  }[];
  meta: unknown[];
}

// Generic OK response
export interface OkResponse {
  ok: boolean;
}
