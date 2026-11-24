# Babonneau Teacher Administration: secure backend integration

**Status:** server-side policy scaffold only. Not integrated, deployed, or a working teacher sign-in. Keep all protected teacher functions disabled until the checks below pass.

The current GitHub Pages student website is public. The live Vercel multiplayer project is linked to `Tristos12/nyeemstudyguide`, but its live API entry points and database implementation have not been identified through the available repository file access. Do not assume that adding this folder protects any existing route.

## How to integrate

1. Find the actual deployed multiplayer API server source and its Vercel project root directory, then make a separate development deployment.
2. Choose and configure a school-approved staff identity provider that verifies signed tokens, issuer, audience, token lifetime, session revocation and MFA. Never accept teacher roles from a user-editable token or client-side form.
3. Create a **server-side** staff directory with verified identity-provider subject, active flag, exact school ID, role and authorised classes. Restrict write access to trusted school administrators.
4. Wrap **every** staff data read/mutation with `authoriseStaff({request,action,schoolId,classId,verifyIdentity,findStaffBySubject})`. The provider adapter MUST return `{subject,verified:true,mfaSatisfied:true}` only after full cryptographic verification. The directory adapter must return the record from a trusted database. A verified session alone never grants staff access.
5. For room pause, chat disable, incident review and changes, validate the requested room or incident belongs to the authorised school/class **in the database**, not just from request parameters. Store an append-only audit record of sensitive actions. Check object ownership again at the point of mutation to prevent time-of-check/time-of-use races.
6. Agree a school incident retention schedule and safeguarding response. No automatic preservation or teacher notification is implemented here.
7. Create a staff-only UI only after the authenticated API is verified. Do not store service credentials, staff tokens or student data in GitHub Pages code.

## Verification

Run `node --test staff-backend/staff-authorization.test.cjs` in a development environment with Node 20+. Add integration tests against the real API and database to check expired/revoked tokens, non-staff accounts, cross-school/class access, changes of role, impersonation, incident access, concurrent updates, audit logs and CORS. Never test with real student data before approval.

The front-end admin page intentionally remains locked until end-to-end server enforcement is deployed and independently tested.
