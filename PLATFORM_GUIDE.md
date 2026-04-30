# BeautifyBaltics — Platform Guide

A reference for all platform functionality, role-based restrictions, and API endpoints.

---

## Roles

| Role | Description |
|------|-------------|
| **Client** | Books beauty services, leaves ratings |
| **Master** | Provides beauty services, manages schedule |
| **Admin** | Platform operator — manages categories, services, users |

A user account can hold multiple roles. When a Master registers, the system automatically also creates a linked Client account with the same email so the Master can also book services.

---

## Authentication

All endpoints require a valid session cookie unless marked `[public]`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new account. Role must be `Client` or `Master`. Returns 409 if email already exists for that role. Returns 400 if phone number is already taken. |
| POST | `/auth/login` | Log in. Returns session cookie. |
| POST | `/auth/logout` | Log out (requires auth). |
| GET | `/auth/verify-email?token=` | Email verification link. Redirects to app. |
| POST | `/auth/forgot-password` | Send password reset email. |
| POST | `/auth/reset-password` | Reset password using token from email. |

**Email verification** is required after registration. Until verified, the user can log in but the email is marked unverified.

---

## Master

### Overview

Masters are beauty professionals who offer services on the platform. Before being discoverable by clients, a master must:

1. Complete **KYC identity verification** (via Didit)
2. Create at least one **service (job)** and activate it

### KYC (Identity Verification)

KYC status controls what a master can do and whether clients can find them.

| Status | Meaning |
|--------|---------|
| `NotSubmitted` | No verification started |
| `Pending` | Verification session started, awaiting submission |
| `Approved` | Identity verified — master is visible to clients |
| `Rejected` | Verification failed — master must retry |
| `Abandoned` | Session was not completed — master must retry |
| `Expired` | Session expired — master must retry |

**Business rules:**
- Only `Approved` masters appear in public search results and explore pages.
- Only `Approved` masters can be viewed by clients via direct profile link.
- A master must have at least `Pending` KYC status (i.e. verification submitted) to create services or upload service images.
- A master must have `Approved` KYC status to activate a service (make it visible to clients).
- Admin can approve or reject KYC from the admin panel.

**KYC flow:**
1. Master goes to `/master/kyc` and clicks "Start Verification".
2. Backend calls Didit to create a session → returns a hosted verification URL.
3. Master completes the flow in the Didit window.
4. Didit calls our webhook (`POST /webhooks/didit`) with the result.
5. Master can also manually trigger a sync from the KYC page if the webhook hasn't fired yet.

### Services (Jobs)

Each service a master offers is called a **job**. It has a name, price, duration, and optional images.

**Job statuses:**

| Status | Meaning |
|--------|---------|
| `Draft` | Created but not yet active. Not visible to clients. |
| `Active` | Visible to clients and bookable. |

`PendingReview` exists in the data model but is not reachable in the current flow — jobs are activated immediately upon submission.

**Business rules:**
- Master must have at least `Pending` KYC to create a job.
- Master must have `Approved` KYC to activate (submit) a job.
- A job must be in `Draft` to be activated.
- A master can delete a job at any status.
- A master can update a job at any status.
- Job images can be uploaded once KYC is at least `Pending`.
- One image can be set as the featured image (shown as the service thumbnail).

### Availability

Masters define when they are available using time slots.

| Slot type | Meaning |
|-----------|---------|
| `Available` | Master is open for bookings during this window |
| `Break` | Master is unavailable (lunch break, blocked time, etc.) |

**Business rules:**
- A booking can only be created inside an `Available` window.
- `Break` slots cannot overlap with a booking.
- Masters can configure a **buffer time** (in minutes) that is added before and after each booking to prevent back-to-back scheduling.

### Dashboard

Masters have access to earnings and booking statistics:
- Total bookings, total earnings, average rating
- Earnings chart by period (weekly / monthly / yearly)
- List of pending (unconfirmed) booking requests

### Booking management

Masters receive booking requests and must confirm or decline them.

**Business rules:**
- Only the master of a booking can confirm it.
- Either the master or client can cancel, but only if the booking is at least 24 hours away.
- A completed booking cannot be cancelled.

### Settings

Masters can update their profile (name, contacts, bio, location, profile image) and scheduling preferences (buffer time, availability slots) at any time regardless of KYC status.

Profile changes take effect immediately — there is no approval step.

### Master API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/masters` | Required | Create master profile |
| GET | `/masters/{id}` | Public | Get master profile (404 if not KYC-approved, unless requesting own profile) |
| PUT | `/masters/{id}` | Required | Update master profile |
| POST | `/masters/{id}/profile-image` | Required | Upload profile image (replaces existing) |
| GET | `/masters/{id}/profile-image` | Public | Get profile image file |
| POST | `/masters/{id}/kyc/initiate` | Required | Start Didit KYC session, returns verification URL |
| POST | `/masters/{id}/kyc/sync-status` | Required | Pull latest KYC status from Didit |
| GET | `/masters` | Public | Search masters (KYC-approved only) |
| POST | `/masters/{id}/jobs` | Required | Create a service (draft) |
| PUT | `/masters/{id}/jobs/{jobId}` | Required | Update a service |
| DELETE | `/masters/{id}/jobs/{jobId}` | Required | Delete a service |
| POST | `/masters/{id}/jobs/{jobId}/submit` | Required | Activate a service (requires Approved KYC) |
| GET | `/masters/{id}/jobs` | Public | List master's services |
| POST | `/masters/{masterId}/jobs/{jobId}/images` | Required | Upload images to a service |
| DELETE | `/masters/{masterId}/jobs/{jobId}/images/{imageId}` | Required | Delete a service image |
| PUT | `/masters/{masterId}/jobs/{jobId}/featured-image` | Required | Set featured image |
| DELETE | `/masters/{masterId}/jobs/{jobId}/featured-image` | Required | Unset featured image |
| GET | `/masters/{id}/images` | Public | List all service images for a master |
| GET | `/masters/{masterId}/jobs/{jobId}/images/{imageId}` | Public | Get a service image file |
| POST | `/masters/{id}/availability` | Required | Create availability slot |
| PUT | `/masters/{id}/availability/{slotId}` | Required | Update availability slot |
| DELETE | `/masters/{id}/availability/{slotId}` | Required | Delete availability slot |
| GET | `/masters/{id}/availability` | Public | List availability slots |
| GET | `/masters/{id}/availability/{slotId}` | Public | Get a single availability slot |
| GET | `/masters/{id}/available-slots` | Public | Get bookable time slots for a given date |
| PUT | `/masters/{id}/buffer-time` | Required | Update buffer time between bookings |
| GET | `/masters/{id}/dashboard/stats` | Required | Booking/earnings/rating summary |
| GET | `/masters/{id}/dashboard/earnings` | Required | Earnings chart data (weekly/monthly/yearly) |
| GET | `/masters/{id}/dashboard/pending-requests` | Required | Pending booking requests list |

---

## Client

### Overview

Clients browse masters, book services, and leave ratings after completed appointments.

### Browsing

- Clients can browse masters on the explore page (map or list view).
- Only KYC-approved masters are shown.
- Masters can be filtered by location, service type, etc.
- Viewing a master's full profile (services, images, availability) is public.

### Booking

Clients create bookings by selecting a master, a service, and a time slot.

**Business rules:**
- The requested time must fall within one of the master's `Available` windows.
- The requested time cannot overlap any of the master's `Break` slots.
- The requested time cannot overlap another confirmed/requested booking for the same master (including buffer time).
- The client cannot have another non-cancelled booking that overlaps the same time window.
- The booking starts in `Requested` state and waits for the master to confirm.
- Either party can cancel at least 24 hours before the appointment. Cancellation within 24 hours is not allowed.

**Booking status flow:**

```
Requested → Confirmed → Completed
     ↘         ↘
    Cancelled  Cancelled
```

- `Requested` → `Confirmed`: master confirms
- `Confirmed` → `Completed`: automatic (time-based) or forced (dev only)
- `Requested` or `Confirmed` → `Cancelled`: master or client cancels (24 h notice required)

### Ratings

After a booking is completed, the client can leave a rating for the master.

**Business rules:**
- Only the client of a booking can rate it.
- The booking must be in `Completed` status.
- Only one rating per booking.
- Ratings update the master's running average rating.

### Profile

Clients can update their name, contact details, and profile image at any time.

### Client API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/clients` | Required | Create client profile |
| GET | `/clients/{id}` | Required | Get client profile |
| PUT | `/clients/{id}` | Required | Update client profile |
| POST | `/clients/{id}/profile-image` | Required | Upload profile image |
| GET | `/clients` | Required | List clients |
| POST | `/bookings` | Required | Create a booking |
| GET | `/bookings` | Required | List own bookings |
| GET | `/bookings/{id}` | Required | Get booking details |
| POST | `/bookings/{id}/cancel` | Required | Cancel a booking (24 h notice required) |
| POST | `/bookings/{id}/reschedule` | Required | Reschedule a booking |
| POST | `/ratings` | Required | Submit a rating for a completed booking |
| GET | `/ratings` | Public | List ratings |
| GET | `/ratings/master/{masterId}` | Public | Get ratings for a specific master |
| GET | `/jobs` | Public | Browse available service types |
| GET | `/jobs/categories` | Public | Browse service categories |
| GET | `/jobs/{id}` | Public | Get a service type |
| GET | `/users` | Required | Get current user info |

---

## Admin

### Overview

Admins manage the platform: they define the service catalogue (job types and categories), handle KYC approvals, and manage user accounts. Admin access is all-or-nothing — there is no sub-role.

A user can be promoted to Admin by another Admin from the users page.

### Service Catalogue

The admin defines the global list of service categories and job types that masters can use when creating their services. Masters cannot create custom job types — they must choose from the admin-defined catalogue.

**Business rules:**
- A job category cannot be deleted if it has associated job types.
- A job type cannot be deleted if it is referenced by any master service.

### KYC Review

Admins can review submitted KYC documents for masters and approve or reject them.

**Business rules:**
- Approving a KYC sets the master's status to `Approved` and makes the master discoverable.
- Rejecting a KYC requires a rejection reason, which is shown to the master.
- After rejection the master can retry verification.

### User Management

Admins can view all users (both masters and clients), see their KYC status, booking counts, earnings, and ratings, and take the following actions:

- **Promote to Admin** — grants full admin access to a user.
- **Delete account** — permanently removes the user and all associated data.

### Statistics & Dashboard

Admins have access to platform-wide statistics:
- Total users, masters, clients
- Total bookings, booking statuses
- Revenue and earnings
- Service and category usage

### Projection Rebuild

For event-sourced projections that may fall out of sync, admins can trigger a rebuild:

```
POST /admin/projections/{projectionName}/rebuild
```

Use this after significant data migrations or when a projection is known to be stale.

### Webhooks

The platform integrates with **Didit** for KYC identity verification. Didit sends results via webhook:

```
POST /webhooks/didit
```

The endpoint validates the `X-Signature-Simple` header and updates the master's KYC status for terminal results (Approved, Rejected, Abandoned, Expired). This is the primary path for KYC status updates — the manual sync endpoint is a fallback.

### Admin API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/dashboard` | Platform summary (users, bookings, revenue) |
| GET | `/admin/stats/users` | User count statistics |
| GET | `/admin/stats/masters` | Master statistics |
| GET | `/admin/stats/clients` | Client statistics |
| GET | `/admin/stats/bookings` | Booking statistics |
| GET | `/admin/stats/services` | Service statistics |
| GET | `/admin/users` | Paged user list with KYC status, bookings, earnings |
| GET | `/admin/users/{id}/detail` | Full user detail panel |
| PUT | `/admin/users/{id}/role` | Change user role (e.g. promote to Admin) |
| DELETE | `/admin/users/{id}` | Delete user account |
| POST | `/admin/job-categories` | Create a service category |
| PUT | `/admin/job-categories/{id}` | Update a service category |
| DELETE | `/admin/job-categories/{id}` | Delete a service category |
| POST | `/admin/jobs` | Create a job type |
| PUT | `/admin/jobs/{id}` | Update a job type |
| POST | `/admin/projections/{name}/rebuild` | Rebuild an event-sourced projection |

KYC approval/rejection is handled via the Masters endpoints (same auth, admin role required in handler):

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/masters/{id}/kyc/approve` | Approve a master's KYC |
| POST | `/masters/{id}/kyc/reject` | Reject a master's KYC (reason required) |

---

## Cross-Role Restrictions Summary

| Action | Client | Master | Admin |
|--------|--------|--------|-------|
| Browse KYC-approved masters | ✅ | ✅ | ✅ |
| View own unverified master profile | — | ✅ | ✅ |
| Create / manage services | — | ✅ (KYC ≥ Pending) | — |
| Activate a service | — | ✅ (KYC = Approved) | — |
| Book a service | ✅ | ✅ (linked client account) | — |
| Confirm a booking | — | ✅ (own bookings) | — |
| Cancel a booking | ✅ (24 h notice) | ✅ (24 h notice) | — |
| Rate a master | ✅ (completed booking) | — | — |
| Manage service catalogue | — | — | ✅ |
| Approve / reject KYC | — | — | ✅ |
| Delete user accounts | — | — | ✅ |
| Promote users to Admin | — | — | ✅ |
| View platform-wide stats | — | — | ✅ |

---

## File Upload Limits

All image upload endpoints accept multipart form data with a **50 MB** per-request limit.

Supported contexts:
- Master profile image (`/masters/{id}/profile-image`) — replaces the existing image.
- Master service images (`/masters/{masterId}/jobs/{jobId}/images`) — multiple files per request.
- Client profile image (`/clients/{id}/profile-image`).
