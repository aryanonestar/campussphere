# Course YouTube Playlists Requirements

## Introduction

CampusSphere's course catalog lists courses as descriptive cards (title, description, instructor, duration, category, level, rating), but the courses contain no actual learning content — they are empty shells. There is also no course detail view at all: a student can enroll in a course from the catalog, but there is nowhere to open a course and consume its material. This makes it hard to demonstrate that the portal hosts "real" courses.

This feature adds a YouTube playlist to every course, surfaced as an embedded YouTube playlist player on a new course detail view. Administrators can paste a YouTube playlist link when creating or editing a course. The six existing seeded demo courses are enriched with real, relevant YouTube playlists (sourced via search) so the portal demonstrates genuine learning content out of the box with no manual setup. The change spans the backend data model and API, the frontend mock/demo API, the admin course form, a new course detail experience, and navigation from the course card.

## Goals

- Every course carries an optional YouTube playlist link (`playlistUrl`) that resolves to a real, watchable playlist.
- Students can open a course and watch its embedded YouTube playlist in place, without leaving the portal.
- Admins can set or update a course's YouTube playlist link from the existing course create/edit form.
- The six seeded demo courses ship with relevant real YouTube playlists so the portal demonstrates real content immediately.
- The feature works in both demo (mock) mode and real backend mode.

## Out of Scope

- Uploading or hosting video files directly; content comes from YouTube playlists only.
- Tracking per-video watch progress, completion, or bookmarks.
- Replacing the existing course card or catalog; the card gains a link to a detail view but keeps its current design.
- Auto-generating playlists; admins provide a link, and seeded courses use hand-selected real playlists.
- Comments, notes, or social features around the playlist.

## User Stories

### 1. Student watches a course

As a student, I want to open a course from the catalog and watch its YouTube playlist in an embedded player, so that I can actually learn from the course material without leaving the portal.

Acceptance Criteria:

- 1.1 The system SHALL render an embedded YouTube playlist player on the course detail view when the course has a `playlistUrl`.
- 1.2 The system SHALL show an empty/placeholder state on the course detail view when the course has no `playlistUrl` (no broken player).
- 1.3 The embedded player SHALL be a responsive 16:9 iframe that allows fullscreen playback.
- 1.4 The embedded player SHALL provide a descriptive `title` attribute for accessibility.
- 1.5 The student SHALL be able to return to the catalog from the course detail view.

### 2. Admin adds a YouTube playlist when creating a course

As an admin, I want to paste a YouTube playlist link in the course create/edit form, so that the course has watchable content.

Acceptance Criteria:

- 2.1 The course create/edit form SHALL include a "YouTube playlist URL" input field.
- 2.2 The system SHALL save the course with the provided `playlistUrl` when the URL is a valid YouTube playlist reference.
- 2.3 The system SHALL reject an invalid or non-YouTube URL with a clear validation message and SHALL NOT save the course.
- 2.4 The playlist field SHALL be optional; a course can be created without a playlist and edited later to add one.

### 3. Seeded demo courses have real playlists

As a demonstrator, I want the six seeded courses to already have relevant YouTube playlists, so that the portal shows real content without any manual setup.

Acceptance Criteria:

- 3.1 Each of the six seeded demo courses SHALL have a relevant, real, publicly available YouTube playlist link matching its subject.
- 3.2 The embedded players for seeded courses SHALL play real playlists.
- 3.3 Resetting demo data SHALL restore the seeded courses with their playlists intact.

### 4. Run locally to verify

As a developer, I want to run the app locally and open the localhost URL, so that I can verify courses, embedded playlists, and admin playlist entry end to end.

Acceptance Criteria:

- 4.1 The frontend dev server SHALL start and print a localhost URL.
- 4.2 Opening the URL SHALL let a user log in, browse courses, open a course, and watch the embedded playlist.
- 4.3 An admin SHALL be able to create or edit a course with a YouTube playlist link and see it embed correctly.

## Functional Requirements

### Course data model

- 5.1 The Course resource SHALL include an optional `playlistUrl` field that stores a YouTube playlist reference (URL or playlist ID).
- 5.2 The backend Course model (`backend/models/Course.js`) SHALL store `playlistUrl` as an optional string field.
- 5.3 The backend course create endpoint SHALL accept and persist `playlistUrl`.
- 5.4 The backend course update endpoint SHALL accept and persist `playlistUrl`.
- 5.5 The backend course list and course responses SHALL include `playlistUrl` when present.
- 5.6 The frontend mock API (`frontend/src/services/mockPortalApi.js`) SHALL include `playlistUrl` on each seeded course and SHALL accept and persist it in create/update operations.

### YouTube URL handling

- 6.1 The system SHALL accept YouTube playlist references in the following forms: a full playlist URL (`https://www.youtube.com/playlist?list=PL...`), a watch URL containing a list parameter (`https://www.youtube.com/watch?v=...&list=PL...`), and a bare playlist ID (`PL...`).
- 6.2 The system SHALL derive the embeddable form (`https://www.youtube.com/embed/videoseries?list=<playlistId>`) from any accepted reference.
- 6.3 An invalid or non-YouTube reference SHALL be rejected at the admin form with a clear validation message, and rendered as an empty state on the student view rather than a broken embed.

### Course detail view

- 7.1 The system SHALL provide a course detail view that renders the embedded YouTube playlist player when `playlistUrl` is present.
- 7.2 The course detail view SHALL display the course title, description, and metadata consistent with the course card.
- 7.3 The course detail view SHALL be reachable for both students and admins.

### Navigation

- 8.1 The course card SHALL provide an affordance to open the course detail view (for example a "Watch course" action, or the card title/image acting as a link).
- 8.2 Navigation to the course detail view SHALL NOT change existing enrollment, edit, or delete actions on the card.
- 8.3 The catalog SHALL continue to function unchanged except for the added navigation affordance.

### Admin form

- 9.1 The course create/edit form SHALL include a YouTube playlist URL input.
- 9.2 Submitting the form with an invalid YouTube URL SHALL show an inline validation error and SHALL NOT save the course.

## Non-Functional Requirements

- 10.1 The embedded player SHALL load from YouTube's official embed domain; no third-party video scripts.
- 10.2 The change SHALL NOT regress existing flows: enrollment, admin CRUD, catalog search, and seeded demo accounts.
- 10.3 The application SHALL build and run locally on the development machine (frontend Vite dev server) without errors.
