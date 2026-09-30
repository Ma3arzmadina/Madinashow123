# Security Specification: Madina Trucks Dealership

## Data Invariants
1. Only authenticated dealership administrators (`/admins/{userId}` or bootstrap owner `yado14007@gmail.com` with `email_verified == true`) can create, modify, or delete truck listings.
2. Truck listings are publicly readable by any user (potential truck buyers in Kurdistan, Iraq, and abroad).
3. Trucks cannot be created with negative prices, invalid manufacturing years (< 1970 or > current year + 2), negative mileage, or missing critical fields.
4. The `createdBy` field must match `request.auth.uid` upon creation and is immutable upon update.
5. All IDs must adhere to standard alphanumerics (`isValidId`).
6. The `admins` collection can only be read or written by verified administrators or the bootstrap owner (`yado14007@gmail.com`).
7. Users cannot elevate their own role to admin unless already authorized by the owner or matching the bootstrap owner email.

## The "Dirty Dozen" Payloads
1. **Unauthenticated Truck Creation**: Anonymous user attempting to POST a truck listing to `/trucks`. Expected: `PERMISSION_DENIED`.
2. **Unauthenticated Truck Deletion**: Anonymous user attempting to DELETE a truck listing. Expected: `PERMISSION_DENIED`.
3. **Non-Admin Truck Creation**: Authenticated non-admin user trying to create a truck listing. Expected: `PERMISSION_DENIED`.
4. **Owner Spoofing on Create**: Authenticated admin trying to set `createdBy: "different_uid"`. Expected: `PERMISSION_DENIED`.
5. **Immutable Field Tampering**: Updating a truck with changed `createdBy` UID. Expected: `PERMISSION_DENIED`.
6. **Negative Price Attack**: Attempting to set `priceUSD: -5000`. Expected: `PERMISSION_DENIED`.
7. **Negative Mileage Attack**: Attempting to set `mileage: -1000`. Expected: `PERMISSION_DENIED`.
8. **Excessive String Length Injection**: Attempting to inject a 100KB string into `title` or `model`. Expected: `PERMISSION_DENIED`.
9. **Self-Promotion to Admin**: Non-admin user writing their own record into `/admins/{theirUid}`. Expected: `PERMISSION_DENIED`.
10. **Admin Record Deletion by Non-Admin**: Non-admin attempting to delete an admin record. Expected: `PERMISSION_DENIED`.
11. **Spoofed Email Admin Claim**: User registering with `yado14007@gmail.com` but `email_verified == false`. Expected: `PERMISSION_DENIED`.
12. **Malformed Document ID Attack**: Document ID with directory traversal or illegal characters (`../../bad`). Expected: `PERMISSION_DENIED`.
