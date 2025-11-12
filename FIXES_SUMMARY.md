# Database Model and Query Fixes Summary

## Overview
Fixed critical Prisma model naming and field naming issues across the entire API layer. The application was using camelCase names (e.g., `db.user`, `createdAt`) when the actual Prisma schema uses snake_case model names (e.g., `db.users`, `created_at`).

## Issues Fixed

### 1. **Model Name Mismatches**
The Prisma client aliases don't match the actual schema definitions:
- `db.user` → `db.users`
- `db.announcement` → `db.announcements`
- `db.mentorProfile` → `db.mentors`
- `db.mentorSession` → `db.mentor_sessions`

### 2. **Field Name Mismatches (camelCase → snake_case)**
- `createdAt` → `created_at`
- `createdBy` → `created_by`
- `updatedAt` → `updated_at`
- `hourlyRate` → `hourly_rate`
- `expertise` → `expertise_areas`
- `isAvailable` → `is_available`

### 3. **Relation Name Changes**
- `mentorProfile` → `mentors`
- `user` → `users`
- `mentor` → `mentors`

## Files Modified

### API Routes Fixed:

1. **`src/app/api/admin/announcements/route.ts`**
   - Fixed GET: `db.announcement` → `db.announcements`, `createdAt` → `created_at`
   - Fixed POST: `db.announcement.create()` → `db.announcements.create()`, `createdBy` → `created_by`
   - Fixed DELETE: `db.announcement` → `db.announcements`

2. **`src/app/api/admin/analytics/route.ts`**
   - Fixed all `db.user` → `db.users`
   - Fixed all `db.mentorProfile` → `db.mentors`
   - Fixed all `db.mentorSession` → `db.mentor_sessions`
   - Fixed field names: `createdAt` → `created_at`, `hourlyRate` → `hourly_rate`, `expertise` → `expertise_areas`
   - Updated includes and field mappings

3. **`src/app/api/admin/users/route.ts`**
   - Fixed GET: `db.user` → `db.users`, `createdAt` → `created_at`
   - Fixed include relations: `mentorProfile` → `mentors`
   - Fixed field names: `hourlyRate` → `hourly_rate`, `expertise` → `expertise_areas`
   - Fixed DELETE: `db.user` → `db.users`

4. **`src/app/api/student/announcements/route.ts`**
   - Fixed GET: `db.announcement` → `db.announcements`, `createdAt` → `created_at`
   - Updated field mappings for response

5. **`src/app/api/sessions/route.ts`**
   - Fixed GET: `db.mentorSession` → `db.mentor_sessions`, `createdAt` → `created_at`
   - Fixed relations: `mentor` → `mentors`, `user` → `users`

6. **`src/app/api/sessions/cancel/route.ts`**
   - Fixed all queries: `db.mentorSession` → `db.mentor_sessions`
   - Fixed relations and field names

7. **`src/app/api/mentors/route.ts`**
   - Fixed GET: `db.mentorProfile` → `db.mentors`
   - Fixed all field mappings for response transformation

8. **`src/app/api/mentors/book/route.ts`**
   - Fixed POST: `db.user` → `db.users`, `db.mentorProfile` → `db.mentors`
   - Fixed GET: `db.mentorSession` → `db.mentor_sessions`
   - Updated all field names and relations

9. **`src/app/api/auth/register/route.ts`**
   - Fixed: `db.user` → `db.users`, `password` → `password_hash`
   - Removed non-existent fields (name, branch, semester from users table)

10. **`src/app/api/auth/login/route.ts`**
    - Fixed: `db.user` → `db.users`
    - Fixed: include relations `mentorProfile` → `mentors`

11. **`src/app/api/admin/mentors/approve/route.ts`**
    - Fixed: `db.user` → `db.users`, `db.mentorProfile` → `db.mentors`
    - Fixed: `include.mentorProfile` → `include.mentors`
    - Fixed: `update where { userId }` → `where { user_id }`

12. **`src/app/api/admin/create-admin/route.ts`**
    - Fixed: `db.user` → `db.users`
    - Fixed: `password` → `password_hash`
    - Fixed: field names and removed non-existent fields

## Errors That Were Resolved

### Before:
```
TypeError: Cannot read properties of undefined (reading 'findMany')
Error: Unknown argument `createdAt`. Did you mean `created_at`?
Error: Cannot read properties of undefined (reading 'count')
```

### After:
All model references and field names now correctly match the Prisma schema definitions.

## Testing Recommendations

1. Test all admin endpoints (announcements, analytics, users management)
2. Test student flow (announcements, sessions)
3. Test mentor approval flow
4. Test booking functionality
5. Test authentication (login/register/create admin)

## Notes

- The schema uses snake_case for database field names (following PostgreSQL convention)
- The Prisma client aliases in `schema.prisma` map model names to snake_case:
  - `model user` → accessed as `db.users`
  - `model announcements` → accessed as `db.announcements`
  - `model mentors` → accessed as `db.mentors`
  - `model mentor_sessions` → accessed as `db.mentor_sessions`
