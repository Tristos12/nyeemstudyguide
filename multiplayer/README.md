# Babonneau Secondary School General Knowledge Multiplayer

This is a **separate, optional** service for the free Form 1 Learning Hub.
It is not part of Sigma Caribbean Virtual Academy. Do not connect it to
Sigma's production database, accounts or payment infrastructure.

## Status

**Vercel project created and build completed, but multiplayer is not activated.** The dedicated database is not attached. GitHub Pages cannot run the server functions.
The working computer and link-based challenge games remain unchanged.
The student room page at \`/multiplayer/room.html\` shows an honest
"not available yet" message until an HTTPS API base URL is configured.

## Features prepared

- Exactly two participants per room. The creator can share a one-time
  invitation secret through a private URL fragment, rather than a query string.
- Random access token for each player. Only token hashes are stored in the DB.
- Nickname-only identity, no full school record or family details.
- 60 questions across three difficulty levels, selected from the local
  306-question reference bank.
- Questions arrive one at a time. Server checks the submitted answer, awards
  zero or ten points and rejects duplicate submissions.
- Room scoreboard updates by polling every three seconds.
- A 24-hour expiry, per-network room creation limit, and locked second seat.
- Existing teacher-approved leaderboard is NOT automatically populated by
  online room scores. Teacher approval is still required.

**Educational limitation:** Source questions and answers are visible elsewhere
in the public revision game. These are practice scores, **not independently
proctored or tamper-proof examination results**. No automated child identity
verification or teacher authentication exists.

## Deployment requirements

1. Create a **dedicated database**, separate from any existing Sigma or other
   production project. Review hosting cost and data-processing policy first.
2. Run \`schema.sql\` against the new database.
3. The separate Vercel project \`babonneau-form1-multiplayer\` has already been created from the \`multiplayer\` subdirectory and its build reached READY. It must still be tested against a dedicated database before student use.
4. Add secret environment variables through Vercel settings ONLY:
   - \`DATABASE_URL\` = server-only connection string for the dedicated database
   - \`ROOM_RATE_SECRET\` = random, long server-only rate limiting secret
   - \`ALLOWED_ORIGIN\` = \`https://tristos12.github.io\`
5. Test with two browsers using the preview API, including a 30-second timer,
   incorrect answers, duplicate submissions, expired invitations and
   room creation rate limits.
6. **Only after review**, set the public static file \`multiplayer/config.js\`
   to \`window.GK_MULTIPLAYER_API='https://YOUR-APP.vercel.app';\`.
   Do not insert a database string or private token in the public config.
7. Run a complete teacher-supervised pilot before linking the room page
   from the main General Knowledge game. Keep the existing sharing challenges
   active until online rooms are ready.

## Database connection status (24 November 2026)

The Vercel project has \`ALLOWED_ORIGIN\` and \`ROOM_RATE_SECRET\` configured but no \`DATABASE_URL\`. The attached Neon organisation is Vercel-managed, and direct project creation was rejected. The Vercel integration listing was also denied. A school administrator must provision a **new free-tier database** through Vercel Storage/Marketplace and attach it to \`babonneau-form1-multiplayer\`. Do not share database credentials in chat or copy Sigma's credentials. A health probe is available at \`GET /api/health\`: it returns HTTP 503 until the database is configured and queryable.

## API contracts

The four public endpoints are flat Vercel Function routes. Nested handlers are internal implementation files. The student client calls the flat endpoints so Vercel does not need framework-specific dynamic route detection. Answers are graded on the server, and the student page automatically skips an unanswered timed question at expiration.


- \`POST /api/create\`: nickname, mode, secondsPerQuestion.
  Returns code, invitation secret and private host token.
- \`POST /api/join?code=:code\`: nickname and invitation secret.
  Returns a private guest token. The second seat is then locked.
- \`GET /api/state?code=:code\`: Bearer token required. Returns the current question,
  deadlines and both scores. Does not include future question answers.
- \`POST /api/answer?code=:code\`: Bearer token required, index and option
  index (0..3), or null for a skipped question. Returns grading feedback.
  Only the server awards points; duplicate submissions are rejected.

The student client stores its room token in tab-scoped sessionStorage and
does not put player tokens in invitation links. Shared invitation secrets are
still sensitive and should not be posted to public groups.

## Maintenance and safeguarding

- Add a recurring server cleanup for expired rooms and players:
  \`DELETE FROM gk_rooms WHERE expires_at < now();\`.
  Cascading deletion removes players.
- Avoid advertising rooms outside supervised learner groups. Nicknames can
  still identify children when chosen poorly; discuss naming rules.
- Review rate limits, logs, error reporting, data retention and staff policies
  before inviting students. API access is via bearer tokens, not a teacher login.
- If student accounts or an institution-wide live leaderboard are desired,
  build proper school-approved consent, role-based access controls and auditing
  before enabling either.
- Do not use the existing browser-only class leaderboard as a verified record
  of live multiplayer performance.

## Tests

Run \`npm test\` in \`multiplayer\` to check deterministic questions and
server scoring. This is not a replacement for browser, database, CORS,
load, and end-to-end deployment testing.
