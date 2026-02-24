# osm-api

Modern TypeScript client for the [Online Scout Manager](https://www.onlinescoutmanager.co.uk) (OSM) API.

- **TypeScript-first** — full type definitions for all API responses
- **Zero dependencies** — uses native `fetch` (Node 18+)
- **Instance-based** — no global state, supports multiple clients
- **ESM + CJS** — works everywhere

## Install

```bash
npm install osm-api
```

## Quick Start

```ts
import { OSMClient } from "osm-api";

const osm = new OSMClient({
  apiId: "your-api-id", // Obtain from OSM Support
  token: "your-api-token",
});

// Authorize with your OSM credentials
await osm.authorize("you@example.com", "your-password");

// Now use any resource
const members = await osm.members.list("sectionId", "termId");
```

## API Reference

### `new OSMClient(options)`

| Option    | Type     | Required | Description                          |
| --------- | -------- | -------- | ------------------------------------ |
| `apiId`   | `string` | ✅       | Your OSM API ID                      |
| `token`   | `string` | ✅       | Your OSM API token                   |
| `baseUrl` | `string` | —        | Override the API base URL (advanced)  |

### `osm.authorize(email, password)`

Authenticates with OSM. **Must be called before any other API method.**

```ts
await osm.authorize("leader@scouts.org.uk", "password");
console.log(osm.isAuthorized); // true
```

### Members

```ts
// List all members in a section/term
const members = await osm.members.list(sectionId, termId);

// Get individual member details
const member = await osm.members.get(sectionId, scoutId);

// Get member transfers
const transfers = await osm.members.getTransfers(sectionId);

// Get patrols with members
const patrols = await osm.members.getPatrols(sectionId, termId);

// Get census details
const census = await osm.members.getCensus(sectionId, termId);

// Get flexi-records (pass true for archived)
const records = await osm.members.getFlexiRecords(sectionId);

// Get deletable members
const deletable = await osm.members.getDeletable(sectionId);
```

### Attendance

```ts
// Get attendance records
const attendance = await osm.attendance.get(sectionId, termId, "cubs");

// Get badge requirements for a meeting date
const badges = await osm.attendance.getBadgeRequirements(sectionId, "cubs", "2026-01-14");

// Update attendance
await osm.attendance.update({
  sectionId: "100",
  termId: "200",
  scoutIds: [3008213],
  selectedDate: "2026-01-14",
  present: "Yes",
  section: "cubs",
});
```

### Programme

```ts
// Get programme summary for a term
const summary = await osm.programme.getSummary(sectionId, termId);

// Get detailed programme for a meeting
const details = await osm.programme.getDetails(sectionId, eveningId);

// Get parent rota members
const rota = await osm.programme.getParentRotaMembers(sectionId, eveningId);

// Get programme attachments
const attachments = await osm.programme.getAttachments(sectionId, eveningId);

// Update a meeting
await osm.programme.updateMeeting(sectionId, eveningId, { title: "New Title" });
```

### Sections & Terms

```ts
const sections = await osm.sections.list();
const terms = await osm.sections.getTerms();
```

### Badges

```ts
const cloud = await osm.badges.getTagCloud(sectionId, termId, "cubs");
```

### Dashboard

```ts
const dashboard = await osm.dashboard.getNextThings(sectionId, termId, "cubs");
```

### Custom Data

```ts
// Get custom data for a member
const data = await osm.customData.get(sectionId, memberId);

// Update custom data
await osm.customData.update(sectionId, memberId, groupId, {
  firstname: "Updated",
});
```

### Email

```ts
// Get email contacts
const contacts = await osm.email.getContacts(sectionId);

// Send an email template
await osm.email.sendTemplate(sectionId, "Subject", emailsObj, editsObj);
```

## Error Handling

```ts
import { OSMError, OSMAuthError } from "osm-api";

try {
  await osm.members.list("1", "2");
} catch (err) {
  if (err instanceof OSMAuthError) {
    // Not authorized — call osm.authorize() first
  }
  if (err instanceof OSMError) {
    console.error(err.status); // HTTP status code
    console.error(err.body); // Raw response body
  }
}
```

## Requirements

- Node.js 18+

## License

ISC © Daniel J. Pomfret