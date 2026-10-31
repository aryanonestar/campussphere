# Fresh New User Data Bugfix Design

## Overview

The CampusSphere Student Portal ships with a demo (mock) API layer in `frontend/src/services/mockPortalApi.js` that is enabled by default (`isEnabled()` returns `true` unless `VITE_USE_DEMO_MODE === 'false'`). In demo mode, the moment a brand-new user registers, the portal fabricates an entire academic history for them: it pre-enrolls them in a course, stamps predefined personal identity fields (avatar, department, title, phone, location, bio) onto their account, and computes non-zero learning/management statistics from a baseline formula. As a result, a fresh account looks indistinguishable from an active one — the dashboard, profile, and course catalog all "remember" activity that never happened.

This bugfix makes every per-user state tied to a new account start empty/zero. The fix is scoped entirely to the frontend demo API (`mockPortalApi.js`) plus minimal empty-state rendering tweaks in the consuming pages. The real backend (`backend/models/User.js`, `backend/controllers/authController.js`) already defaults `enrolledCourses` to `[]` and returns only real fields via `sanitizeUser`; it is the correct contract the mock API must mirror, and it stays unchanged.

The strategy is the bug-condition methodology: change behavior **only** for freshly registered users (the bug condition), and preserve **exactly** all other behavior — seeded demo accounts, real enrollments, admin operations, aggregate analytics, profile edits, and the real backend path.

### Data Flow & Component Interaction

Registration / login / profile bootstrap all funnel through one shaping function, `populateUser`, which is the single point that attaches fabricated per-user state. Understanding this flow is why the fix can be localized.

**Auth path (demo mode):**
- `RegisterPage` → `AuthContext.register(payload)` → `api.post('/auth/register')` → `demoApi.register(payload)` builds a user record, stores it in the localStorage demo DB, then returns `populateUser(user, db)`.
- `LoginPage` → `AuthContext.login` → `demoApi.login` finds the stored user → `populateUser(user, db)`.
- On every token change, `AuthContext` bootstraps via `api.get('/users/profile')` → `demoApi.getProfile(token)` → `withAuth` → `getCurrentUser` → `populateUser(user, db)`.
- `AuthContext.persistAuth` stores the resulting populated user object in React state and `localStorage` under `student-portal-user`.

**`populateUser(user, db)` (the fabrication point):**
1. Resolves `user.enrolledCourses` (stored IDs) into full course objects (`courseList`).
2. Calls `createStudentProfile(user, courseList.length)` for students, or `createAdminProfile(user, db.courses.length, studentCount)` for admins. These return identity fields (`|| 'fabricated fallback'`) and stats from a non-zero baseline formula.
3. Returns `{ _id, name, email, role, createdAt, avatar: user.avatar, enrolledCourses: courseList, ...baseProfile }`.

**Consumers of the populated user object:**
- `StudentDashboard.jsx` — reads `enrolledCourses` (count + Learning Spotlight `enrolledCourses[0]`), `completionRate`, `learningHours`, `attendance`, `department`, `avatar`, `title`, `location`.
- `AdminDashboard.jsx` — reads **aggregate** analytics from `demoApi.getAdminAnalytics` (`totalStudents`, `totalCourses`, `totalEnrollments`, `recentStudents`, `featuredCourses`); these are computed from real stored data and are unaffected. The roster renders `student.avatar`.
- `ProfilePage.jsx` — reads identity (`name`, `email`, `role`, `enrolledCourses.length`, `department`, `title`, `phone`, `location`, `avatar`) and the banner image `enrolledCourses[0]?.image || avatar`. The edit form only mutates `name`/`email`/`password` via `demoApi.updateProfile`.
- `CoursesPage.jsx` — reads `user.enrolledCourses` to build `enrolledCourseIds` (a `Set` of course IDs) so `CourseCard` can mark courses "Already enrolled"; admin tools read `demoApi.getStudents`.

**Functions & fields affected (all in `mockPortalApi.js` unless noted):**
- `register()` — the `user` object literal: `enrolledCourses`, `avatar`, `department`, `title`, `phone`, `location`, `bio`.
- `createStudentProfile(user, courseCount)` — `department`, `title`, `phone`, `location`, `bio`, `learningHours`, `attendance`, `completionRate`.
- `createAdminProfile(user, courseCount, studentCount)` — `department`, `title`, `phone`, `location`, `bio`, `managedPrograms`, `activeStudents`, `satisfaction`.
- `populateUser(user, db)` — passes `avatar: user.avatar` through (now `undefined` for new users); structure otherwise unchanged.
- `seedUsers` — add an `isSeededDemo: true` marker to each fixture (the seeded/fresh discriminator).
- Frontend empty-state handling (render layer only): avatar fallback + identity placeholder text in `StudentDashboard.jsx`, `ProfilePage.jsx`, `AdminDashboard.jsx`, `CoursesPage.jsx`; neutral Learning Spotlight copy in `StudentDashboard.jsx`.

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bug — a freshly registered (non-seeded) user in demo mode receives pre-enrolled courses, fabricated non-zero per-user statistics, and predefined identity fields they never entered.
- **Property (P)**: The desired behavior for buggy inputs — a fresh account starts with zero enrolled courses, zero per-user statistics, and empty/placeholder identity, while genuine portal-wide aggregate counts still reflect real data.
- **Preservation**: Existing correct behavior that must remain unchanged — seeded demo accounts keep their seeded courses and statistics; real enrollments/admin operations/aggregate analytics/profile edits keep working; the real backend stays clean.
- **`isSeededDemo`**: A boolean marker on a user record that distinguishes seeded demo fixtures (`true`) from newly registered accounts (`false`/absent). It is the discriminator that gates the preserved demo-data path.
- **`populateUser`**: The function in `frontend/src/services/mockPortalApi.js` that resolves a stored user into the enriched object every page renders. It is the single fabrication point.
- **`createStudentProfile` / `createAdminProfile`**: Helpers in `mockPortalApi.js` that currently fabricate identity fallbacks and baseline-formula statistics for the populated user object.
- **`sanitizeUser`**: The backend function in `backend/controllers/authController.js` that returns only real fields. The mock API's fresh-user output should mirror this contract.
- **Aggregate analytics**: Portal-wide counts (`totalStudents`, `totalCourses`, `totalEnrollments`) computed by `demoApi.getAdminAnalytics` from real stored data — distinct from per-user fabricated stats and explicitly allowed to reflect real data.

## Bug Details

### Bug Condition

The bug manifests whenever a **newly registered** (non-seeded) user is materialized through `populateUser` in demo mode. `register()` seeds `enrolledCourses: role === 'admin' ? ['course-mgmt-210'] : ['course-cloud-120']` and stamps predefined identity fields onto every new user; `createStudentProfile`/`createAdminProfile` then fabricate non-zero statistics from a baseline formula (`14 + courseCount*3`, `min(98, 80 + courseCount*4)`, `min(96, 52 + courseCount*12)` for students; `max(courseCount, 3)`, `96` for admins). Even a user with zero real activity receives non-zero stats because the baselines are non-zero.

**Formal Specification:**
```
FUNCTION isSeededDemo(user)
  INPUT: user of type StoredUser
  OUTPUT: boolean
  RETURN user.isSeededDemo === true
END FUNCTION

FUNCTION isFreshlyRegistered(user)
  INPUT: user of type StoredUser
  OUTPUT: boolean
  RETURN NOT isSeededDemo(user)
         AND user was created via demoApi.register in demo mode
END FUNCTION

FUNCTION isBugCondition(result)
  INPUT: result of type PopulateUserOutput   // populateUser(user, db) for a stored user
  OUTPUT: boolean

  RETURN isFreshlyRegistered(result.sourceUser)
         AND (
           result.enrolledCourses.length > 0                                  // 1.1, 1.2, 1.6, 1.7
           OR result.learningHours > 0 OR result.attendance > 0
              OR result.completionRate > 0                                    // 1.3
           OR result.managedPrograms > 0 OR result.satisfaction > 0           // 1.4
           OR hasPredefinedIdentity(result)                                   // 1.5
         )
END FUNCTION

FUNCTION hasPredefinedIdentity(result)
  RETURN isNonEmpty(result.avatar)
         OR isNonEmpty(result.department)
         OR isNonEmpty(result.title)
         OR isNonEmpty(result.phone)
         OR isNonEmpty(result.location)
         OR isNonEmpty(result.bio)
END FUNCTION
```

### Examples

- **New student registers (unfixed):** `enrolledCourses = ['course-cloud-120']` (count 1), `learningHours = 14 + 0*3 = 14`, `attendance = min(98, 80) = 80`, `completionRate = min(96, 52) = 52`, `department = 'Emerging Technology'`, `title = 'New Portal Member'`, `avatar = <unsplash url>`. Learning Spotlight shows the seeded Cloud Operations Lab; the catalog marks it "Already enrolled". **Expected (fixed):** `enrolledCourses = []`, all stats `0`, identity empty/placeholder, Spotlight empty, all courses enrollable.

- **New admin registers (unfixed):** `enrolledCourses = ['course-mgmt-210']` (count 1), `managedPrograms = max(6, 3) = 6`, `satisfaction = 96`, `department = 'Academic Operations'`, `title = 'Assistant Program Lead'`. **Expected (fixed):** `enrolledCourses = []`, `managedPrograms = 0`, `satisfaction = 0`, identity empty/placeholder.

- **Seeded demo student logs in (both unfixed and fixed):** `enrolledCourses = [Product Design Studio, Applied AI Foundations, Business Intelligence]` (count 3), `learningHours = 14 + 3*3 = 23`, `attendance = min(98, 92) = 92`, `completionRate = min(96, 88) = 88`, identity = the seeded values. **Expected:** unchanged — this is a seeded demo account.

- **New student views Learning Spotlight (unfixed):** displays the seeded Cloud Operations Lab image, title, and description. **Expected (fixed):** empty/placeholder state, no featured course.

- **New student browses catalog (unfixed):** Cloud Operations Lab shows "Already enrolled". **Expected (fixed):** every course shows "Enroll now".

- **Edge — pre-existing localStorage user created under old code:** A user registered before this fix already has a seeded course and identity in localStorage but no `isSeededDemo` marker. After the fix they are treated as non-seeded (fresh), so their stats resolve to zero while their stored enrolled course and identity remain (the fix changes the registration path going forward, not retroactively stored state). Resetting demo data (`demoApi.resetDemoData`) restores the clean seeded fixtures.

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Seeded demo accounts (student or admin) continue to display their seeded enrolled courses and their seeded statistics on login.
- Real enrollments by any student still record and reflect the updated enrolled-courses count on the dashboard, profile, and catalog.
- Admin create/edit/delete/assign course operations still work and update related counts and rosters.
- The Admin Dashboard's aggregate analytics (`totalStudents`, `totalCourses`, `totalEnrollments`) still compute from real stored data.
- Profile edits (`name`, `email`, `password`) still persist and display.
- The real backend (non-demo mode) still registers new users with an empty `enrolledCourses` array and no fabricated statistics.

**Scope:**
All inputs that are NOT a freshly registered user should be completely unaffected by this fix. This includes:
- Seeded demo accounts (any role) logging in.
- Real enrollments and admin course operations.
- Aggregate analytics computation.
- Profile updates.
- The real backend registration path.

**Note:** The actual expected correct behavior for fresh accounts is defined in the Correctness Properties section (Property 1). This section focuses on what must NOT change.

## Hypothesized Root Cause

Based on the bug description and confirmed by reading the code, the causes are concentrated in `mockPortalApi.js`:

1. **`register()` seeds a pre-enrolled course and predefined identity:** The `user` literal hard-codes `enrolledCourses: role === 'admin' ? ['course-mgmt-210'] : ['course-cloud-120']` and sets `avatar`, `department`, `title`, `phone`, `location`, `bio` for every new account. This drives 1.1, 1.2, 1.5, 1.6, 1.7.

2. **`createStudentProfile` uses a non-zero baseline formula:** `learningHours = 14 + courseCount*3`, `attendance = min(98, 80 + courseCount*4)`, `completionRate = min(96, 52 + courseCount*12)`. With `courseCount = 0` for a fresh student the values are still 14 / 80 / 52 — never zero. This drives 1.3.

3. **`createAdminProfile` uses a non-zero baseline / constant:** `managedPrograms = max(courseCount, 3)` and `satisfaction = 96`. A fresh admin gets 3 / 96. This drives 1.4.

4. **Identity fallbacks default to fabricated prose:** `user.department || 'Student Success'`, `user.title || 'New Student'`, etc. Because `register()` already sets these fields, the fallbacks are masked for new users today — but the root defect is that `register()` sets them at all, and the fallbacks would re-fabricate if any field were ever absent. This drives 1.5.

5. **No seeded/fresh discriminator exists:** `populateUser` treats every user identically, so there is no way to keep demo accounts populated while letting new accounts start empty. Seeded fixtures and registered accounts are indistinguishable to the shaping logic.

## Correctness Properties

Property 1: Bug Condition - Fresh Accounts Start Empty

_For any_ input that is a freshly registered user (non-seeded, created via `demoApi.register` in demo mode), the fixed `populateUser` SHALL produce zero enrolled courses, zero per-user statistics (`learningHours`, `attendance`, `completionRate` for students; `managedPrograms`, `satisfaction` for admins), and empty/placeholder identity fields (`department`, `title`, `phone`, `location`, `bio`, `avatar`) with no predefined values the user did not enter, while genuine portal-wide aggregate counts continue to reflect real data.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7**

Property 2: Preservation - Non-Fresh Inputs Unchanged

_For any_ input where the bug condition does NOT hold (seeded demo accounts, real enrollments, admin course operations, aggregate analytics, profile edits, and the real backend registration path), the fixed function SHALL produce the same result as the original function, preserving seeded courses and statistics for demo accounts, real enrollment counts, admin operations and rosters, aggregate analytics computed from real data, profile edit persistence, and the clean backend registration contract.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6**

## Fix Implementation

### Discriminator: Seeded vs Fresh

Add an `isSeededDemo: true` marker to every entry in `seedUsers`. New users created by `register()` do **not** receive this marker, so it is absent (`false`/`undefined`) for fresh accounts. This flag is the single, explicit discriminator that gates the preserved demo-data path.

This coincides naturally with the "absence of seeded identity fields" intuition in the bug summary: seeded fixtures carry explicit `avatar`/`department`/`title`/`phone`/`location`/`bio`, while fresh accounts carry none (and the UI offers no way to add them — `updateProfile` only touches `name`/`email`/`password`). The flag makes that intuition explicit and testable rather than implicit.

### Changes Required

Assuming the root cause analysis is correct, all changes are in `frontend/src/services/mockPortalApi.js` unless noted.

**File**: `frontend/src/services/mockPortalApi.js`

**1. `register()` — construct a minimal fresh user**

Remove all seeding and identity fabrication. The new user object contains only the fields the backend contract (`sanitizeUser`) returns plus the stored credential:
- `_id`, `name`, `email`, `password`, `role` (default `'student'`), `createdAt`, and `enrolledCourses: []`.
- Do **not** set `avatar`, `department`, `title`, `phone`, `location`, or `bio`.
- Do **not** set `isSeededDemo` (fresh accounts must be distinguishable from fixtures).

This satisfies 2.1, 2.2 (zero enrolled courses), 2.7 (no course pre-marked enrolled), and removes the source of 1.5/1.6.

**2. `createStudentProfile(user, courseCount)` — zero stats for fresh, preserved for seeded**

- Identity fields use `user.<field> || ''` (empty placeholder), not fabricated prose. Seeded users keep their values because they have them; fresh users get `''`.
- Stats are gated by `isSeededDemo`: seeded users keep the existing formula (exact preservation, including dynamic recomputation as their course count changes); fresh users get `learningHours = 0`, `attendance = 0`, `completionRate = 0`.
- Rationale: the formula is retained **only** as the seeded-demo data generator (preservation, 3.1). The fresh path computes from "actual user activity," and because the mock tracks no real per-course learning activity, a fresh user with no activity gets zero — never a non-zero baseline.

This satisfies 2.3 and 1.3; preserves 3.1.

**3. `createAdminProfile(user, courseCount, studentCount)` — zero per-admin stats for fresh, preserved for seeded**

- Identity fields use `user.<field> || ''`.
- `managedPrograms` and `satisfaction` are gated by `isSeededDemo`: seeded admins keep `Math.max(courseCount, 3)` and `96`; fresh admins get `managedPrograms = 0`, `satisfaction = 0`.
- `activeStudents` remains `studentCount` for everyone — it is a genuine portal-wide aggregate count (total students), which 2.4 explicitly allows to reflect real data. It is not a fabricated per-admin value.

This satisfies 2.4 and 1.4; preserves 3.1.

**4. `populateUser(user, db)` — unchanged structure**

Keep the current shape (`avatar: user.avatar`, `enrolledCourses: courseList`, `...baseProfile`). For fresh users `user.avatar` is `undefined`, which the render layer handles via a placeholder (below). No logic changes here — the fix lives in the two `create*Profile` helpers and `register()`.

**5. `seedUsers` — mark fixtures**

Add `isSeededDemo: true` to each of the four seeded entries. Keep their existing identity fields and `enrolledCourses` unchanged. `resetDemoData()` already re-seeds from this array, so the markers are restored on demo reset.

**6. Frontend empty-state handling (render layer only)**

The mock now emits empty/zero/`undefined` for fresh accounts; the pages must render that gracefully without breaking. Changes are minimal and use existing `||` patterns already present in the code:

- **Shared avatar placeholder**: introduce a single placeholder avatar (an inline SVG data-URI silhouette is preferred to avoid a network dependency). Use `user?.avatar || PLACEHOLDER_AVATAR` (and `student.avatar || PLACEHOLDER_AVATAR`) at every `<img>` avatar site: `StudentDashboard` (profile highlights), `ProfilePage` (banner + avatar), `AdminDashboard` (roster rows), `CoursesPage` (admin student list).
- **Identity placeholder text**: where identity fields render, display a neutral placeholder when empty (e.g., `value || 'Not provided'`): `StudentDashboard` snapshot Department, profile highlights Location/Department; `ProfilePage` title, Department, Phone, Location. Seeded users have non-empty values, so the placeholder only shows for fresh accounts.
- **Learning Spotlight neutral copy (`StudentDashboard`)**: when `featuredCourse` is undefined (no enrolled courses), the structural fallback already exists; update the fallback title/description to neutral copy that does not imply seeded content (e.g., "Your learning spotlight is ready" / "Enroll in a course to feature it here"). The first chip `featuredCourse?.category || user?.department` should fall back to a neutral label (e.g., "Get started") when both are empty.
- **No change needed** for: stat `StatCard`s (already use `|| 0`, so they show `0%`/`0h` correctly), the "No courses enrolled yet" block (already handles `enrolledCourses.length === 0`), and `CoursesPage` enrollment detection (`enrolledCourseIds` is an empty `Set` for fresh users, so all courses show "Enroll now").

These render-layer changes only activate when a field is empty/`undefined`; seeded accounts have real values and render exactly as before, preserving 3.1.

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bug on unfixed code, then verify the fix produces fresh/empty output for fresh accounts and identical output for everything else. The mock API is plain JavaScript with a localStorage-backed DB, so the core logic is unit-testable without a DOM; the frontend empty-state handling is verified with a React testing library.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix. Confirm or refute the root cause analysis. If we refute, re-hypothesize.

**Test Plan**: Exercise `demoApi.register` and `populateUser` against the unfixed code for both roles and assert the bug-condition predicates. Run on the UNFIXED code to observe failures.

**Test Cases**:
1. **Fresh Student Registration**: call `register({ name, email, password, role: 'student' })`; assert `enrolledCourses.length > 0`, `learningHours > 0`, `attendance > 0`, `completionRate > 0`, and non-empty `department`/`title`/`avatar`. (Will fail-on-fixed / pass-on-unfixed, surfacing the bug.)
2. **Fresh Admin Registration**: call `register({ ..., role: 'admin' })`; assert `enrolledCourses.length > 0`, `managedPrograms > 0`, `satisfaction > 0`, and non-empty identity.
3. **Learning Spotlight Leakage**: with a freshly registered student, confirm `populateUser` output's `enrolledCourses[0]` is a seeded course (the catalog would mark it enrolled).
4. **Zero-Activity Non-Zero Stats Edge**: with a fresh student forced to `courseCount = 0`, assert the baseline still yields non-zero stats (confirms the non-zero baseline is the cause, not course count).

**Expected Counterexamples**:
- Fresh accounts return non-empty `enrolledCourses`, non-zero stats, and predefined identity.
- Possible causes: `register()` seeding, `createStudentProfile`/`createAdminProfile` baselines, identity fallbacks, missing seeded/fresh discriminator.

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed function produces fresh/empty output.

**Pseudocode:**
```
FOR ALL user WHERE isFreshlyRegistered(user) DO
  result := populateUser_fixed(user, db)
  ASSERT result.enrolledCourses.length == 0
  ASSERT result.learningHours == 0 AND result.attendance == 0 AND result.completionRate == 0
  ASSERT result.managedPrograms == 0 AND result.satisfaction == 0
  ASSERT isEmpty(result.department) AND isEmpty(result.title)
  ASSERT isEmpty(result.phone) AND isEmpty(result.location) AND isEmpty(result.bio)
  ASSERT isEmpty(result.avatar) OR result.avatar is placeholder
  ASSERT every course in db.courses is enrollable (none pre-marked enrolled)
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed function produces the same result as the original function.

**Pseudocode:**
```
FOR ALL user WHERE NOT isFreshlyRegistered(user) DO
  ASSERT populateUser_original(user, db) deep-equals populateUser_fixed(user, db)
END FOR
```
This covers seeded demo students, seeded demo admins (including their statistics, which the `isSeededDemo`-gated formula preserves exactly), and any operation that does not originate from a fresh registration.

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many seeded/fresh/role combinations automatically across the input domain.
- It catches edge cases (seeded user who later enrolls, admin after course CRUD) that manual unit tests might miss.
- It provides strong guarantees that behavior is unchanged for all non-fresh inputs — seeded stats stay identical because the formula path is untouched for `isSeededDemo` users.

**Test Plan**: Observe behavior on UNFIXED code for seeded accounts and real operations, then write property-based tests capturing that behavior and assert equality after the fix.

**Test Cases**:
1. **Seeded Student Preservation**: `populateUser_fixed(seedStudentDemo)` deep-equals `populateUser_original(seedStudentDemo)` (enrolled courses, `learningHours`, `attendance`, `completionRate`, identity all identical).
2. **Seeded Admin Preservation**: `populateUser_fixed(seedAdminDemo)` deep-equals `populateUser_original(seedAdminDemo)` (`managedPrograms`, `satisfaction`, `activeStudents`, identity identical).
3. **Real Enrollment Preservation**: after a seeded student enrolls in a new course, `populateUser_fixed` equals `populateUser_original` (course count and stats track identically via the gated formula).
4. **Aggregate Analytics Preservation**: `getAdminAnalytics_fixed` deep-equals `getAdminAnalytics_original` (totals and rosters from real data unchanged).
5. **Profile Edit Preservation**: `updateProfile` still mutates only `name`/`email`/`password` and returns the same populated shape.
6. **Backend Cleanliness**: confirm `backend/controllers/authController.js` and `backend/models/User.js` are unchanged and still default `enrolledCourses` to `[]`.

### Unit Tests

- `register()` with `role: 'student'` and `role: 'admin'` yields `enrolledCourses: []`, no identity fields, no `isSeededDemo`.
- `createStudentProfile` for a fresh user (`isSeededDemo` absent) returns all-zero stats and `''` identity; for a seeded user returns the formula values and seeded identity.
- `createAdminProfile` for a fresh user returns zero `managedPrograms`/`satisfaction`, `activeStudents = studentCount`; for a seeded admin returns preserved values.
- `populateUser` for a fresh user produces an empty `enrolledCourses` array and `undefined` avatar.
- `getCourses` marks no course as enrolled for a fresh student's `enrolledCourseIds`.
- Frontend: avatar placeholder renders when `user.avatar` is `undefined`; identity placeholder text renders when a field is empty; Learning Spotlight shows neutral copy when `enrolledCourses` is empty.

### Property-Based Tests

- Generate random fresh registrations (random name/email/role) and assert the bug-condition fix properties (zero enrollments, zero stats, empty identity) hold for all of them.
- Generate random seeded users and random course/enrollment mutations, then assert `populateUser_fixed` deep-equals `populateUser_original` for every seeded case (preservation).
- Generate random admin operations (create/update/delete/assign) over a seeded admin and assert analytics and populated outputs remain identical to the original.

### Integration Tests

- Full flow: register a fresh student → land on `StudentDashboard` → assert zero stats, empty Learning Spotlight, all courses enrollable; enroll in a course → assert the count updates to 1 and the catalog reflects it (3.2), while stats remain honest.
- Full flow: register a fresh admin → land on `AdminDashboard` → assert aggregate totals are real (non-zero only because real data exists) and per-admin `managedPrograms`/`satisfaction` are zero; profile shows empty identity.
- Login as each seeded demo account → assert dashboard/profile display the seeded courses and statistics unchanged.
- Update profile (name/email/password) → assert changes persist across a re-fetch (`getProfile`).
- Toggle to real backend mode (`VITE_USE_DEMO_MODE=false`) → assert registration returns an empty `enrolledCourses` array with no fabricated stats (backend contract intact).
