# Staff authentication integration for the Babonneau Learning Hub

**Branch:** `feature/teacher-staff-auth-20261124`. **Not active in production.**
Do not merge, promote or advertise teacher login until the school approves the identity provider, the database migration is applied in a controlled environment, and the tests pass.

## What is implemented
- `multiplayer/lib/staff-auth.js` validates cryptographically signed OIDC JWTs via remote JWKS, issuer, audience, expiry, and a trusted MFA assertion.
- Staff identity-provider subjects are cross-checked against `gk_staff_accounts` in the separate multiplayer database. Client-supplied roles are ignored.
- Authorization fails closed on missing configuration and enforces action, school and class permissions.
- `GET /api/staff-me` returns only role, school ID and explicitly disabled feature flags to authenticated active staff. It never returns student records.
- Student multiplayer endpoints have **not been modified**.

## Before testing the staff endpoint
1. Choose an approved school identity provider with strong staff identity verification and MFA. The provider must issue signed JWTs with the expected issuer, audience, subject, `exp`, `iat`, `kid`, and `amr` including `mfa`. Not all providers use this MFA claim; adapt only after verifying the provider's official contract.
2. On a **separate test deployment** of the Vercel multiplayer root `multiplayer/`, set server-only `STAFF_OIDC_ISSUER`, `STAFF_OIDC_AUDIENCE`, `STAFF_OIDC_JWKS_URL`, and `STAFF_SCHOOL_ID`. Keep `DATABASE_URL`, `ROOM_RATE_SECRET`, and any other backend values server-only. Do not expose these values in GitHub Pages.
3. Apply `multiplayer/staff-schema.sql` to the **dedicated test Neon database**, never to the Sigma learning platform database. Use a restricted migration role.
4. Create staff records through a restricted administrator-approved database process, using verified provider subject IDs and the correct school ID. The table defaults to `active=false`; activate only explicitly approved people. Do not create a self-registration endpoint.
5. Run `npm install` and `npm test` in `multiplayer/` on the test branch. No automated tests have been executed by the assistant against production.
6. Check a missing token, invalid token, expired token, issuer/audience mismatch, missing MFA, disabled user, wrong school/class, and teacher attempting safeguarding actions. Confirm nothing sensitive leaks in responses or logs.
7. Before adding staff moderation actions, add database-level ownership validation, an audit trail and a school-approved incident response and deletion policy.

## Authentication endpoint
`GET /api/staff-me` with `Authorization: Bearer <verified staff identity JWT>` on the test deployment.
- 503 if staff auth is not configured.
- 401 if session is absent or invalid.
- 403 if staff role, school or status is not approved.
- 200 with role, school and disabled feature flags if approved.

A successful 200 response does **not** enable access to student or incident records. There are no student-data or moderation routes yet.

## Frontend
`teacher-admin.html` remains disabled by design. It has no password input and no browser-trusted teacher role. Build a redirect-based OAuth/OIDC PKCE sign-in flow and secure session handling only after the school selects the provider and tests its supported claims.

## Staff audit trail (development branch)

A second migration, `multiplayer/staff-audit-schema.sql`, defines a restricted audit table, separate from existing student room and chat tables. Each entry records only the staff identity-provider subject, authorised school, staff role, fixed action type, resource reference where appropriate, outcome and timestamp. It must not contain message bodies, child identifiers, room access tokens or credentials.

The `GET /api/staff-me` development endpoint now requires a successful audit insertion before returning an authenticated staff response. **Both** the staff accounts migration and audit migration must be applied in an isolated test database before any provider is configured. In production, preserve this deny-by-default behaviour if the audit store is unavailable.

The database app role should have only INSERT access to the audit table. Audit deletion and retention must follow a school-approved policy and use a separate restricted maintenance role. Audit insertion and privileged state changes should be committed in one transaction where possible. No live moderation commands or incident review endpoints have been activated.
