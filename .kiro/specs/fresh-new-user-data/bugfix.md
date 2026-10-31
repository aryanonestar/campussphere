# Bugfix Requirements Document

## Introduction

On the CampusSphere Student Portal, a brand-new account is not actually "fresh." The moment a user registers and logs in, their dashboard, profile, and course catalog already show predefined/static data: a pre-enrolled course, a non-zero enrolled-courses count, fabricated learning statistics (learning hours, attendance, completion rate for students; managed programs and satisfaction for admins), and predefined personal identity fields (department, title, phone, location, bio) the user never entered. This happens in the default demo (mock) mode, where `mockPortalApi.js` seeds per-user state at registration time instead of leaving it empty. The impact is that new users cannot tell their real activity apart from fabricated placeholder data, and the portal appears to "remember" activity that never occurred.

This bugfix requires that every per-user state tied to a new account starts empty/zero, while all existing correct behavior (seeded demo accounts, real enrollments, admin operations, aggregate analytics, profile edits, and the real backend registration path) continues to work unchanged.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN a new user registers with the student role THEN the system seeds the account with a pre-enrolled course so the Student Dashboard and Profile show a non-zero enrolled-courses count.

1.2 WHEN a new user registers with the admin role THEN the system seeds the account with a pre-enrolled course so the admin's Profile shows a non-zero enrolled-courses count.

1.3 WHEN a newly registered student views the Student Dashboard THEN the system displays fabricated learning statistics (learning hours, attendance %, completion rate %) computed from a non-zero baseline formula even though the student has no real activity.

1.4 WHEN a newly registered admin views the Admin Profile THEN the system displays fabricated management statistics (managed programs, satisfaction) computed from a non-zero baseline even though the admin has no real activity.

1.5 WHEN a newly registered user views the Profile page THEN the system displays predefined personal identity fields (department, title, phone, location, bio, avatar) that the user never entered.

1.6 WHEN a newly registered student views the Student Dashboard "Learning Spotlight" THEN the system displays the seeded course as a featured course with its image, title, and description.

1.7 WHEN a newly registered student browses the Courses catalog THEN the system marks the seeded course as already enrolled.

### Expected Behavior (Correct)

2.1 WHEN a new user registers with the student role THEN the system SHALL create the account with zero enrolled courses.

2.2 WHEN a new user registers with the admin role THEN the system SHALL create the account with zero enrolled courses.

2.3 WHEN a newly registered student views the Student Dashboard THEN the system SHALL display zero learning hours, zero attendance, and zero completion rate (all per-user statistics fresh/empty).

2.4 WHEN a newly registered admin views the Admin Profile THEN the system SHALL display fresh (zero) per-user management statistics, while only genuine portal-wide aggregate counts (such as total students and total courses) reflect real data.

2.5 WHEN a newly registered user views the Profile page THEN the system SHALL display no predefined personal identity data (department, title, phone, location, bio) that the user did not enter, presenting empty/placeholder fields instead.

2.6 WHEN a newly registered student views the Student Dashboard "Learning Spotlight" THEN the system SHALL display an empty/placeholder state with no seeded featured course.

2.7 WHEN a newly registered student browses the Courses catalog THEN the system SHALL mark every course as available to enroll (none shown as already enrolled).

### Unchanged Behavior (Regression Prevention)

3.1 WHEN an existing seeded demo account (student or admin) logs in THEN the system SHALL CONTINUE TO display that account's seeded enrolled courses and statistics.

3.2 WHEN a student enrolls in a course after registering THEN the system SHALL CONTINUE TO record the enrollment and reflect the updated count on the dashboard, profile, and catalog.

3.3 WHEN an admin creates, edits, deletes, or assigns a course THEN the system SHALL CONTINUE TO perform the operation and update related counts and rosters accordingly.

3.4 WHEN the Admin Dashboard loads aggregate analytics THEN the system SHALL CONTINUE TO compute total students, total courses, and total enrollments from real stored data.

3.5 WHEN a user updates their profile (name, email, password) THEN the system SHALL CONTINUE TO persist and display those changes.

3.6 WHEN the application runs against the real backend (non-demo mode) THEN the system SHALL CONTINUE TO register new users with an empty enrolledCourses array and no fabricated statistics (backend behavior is already correct and must remain so).
