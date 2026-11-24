# Babonneau Secondary School General Knowledge Multiplayer

This is a **separate, optional** service for the free Form 1 Learning Hub.
It is not part of Sigma Caribbean Virtual Academy. Do not connect it to
Sigma's production database, accounts or payment infrastructure.

## Status as of 24 November 2026

**The separate Vercel service is deployed and the dedicated Neon database is connected.** The database
project is `neon-carmine-lantern` (Neon ID `crimson-dew-83625355`), separate from Sigma's
`educares-postgres`. Both `gk_rooms` and `gk_players` tables have been created and verified
in that database. `DATABASE_URL`, `ROOM_RATE_SECRET`, and `ALLOWED_ORIGIN` exist in
the Vercel multiplayer project.

**Live room gameplay has not yet been independently verified.** Do not claim production readiness
or publish online rooms to students until the full two-player technical test passes.

A dedicated static connection and test page is available at
`/multiplayer/diagnostics.html`. It tests the health endpoint first, then can create
one room with two artificial nicknames, verify identical questions, submit answers,
check duplicate protection, check the shared scoreboard, and verify rejection of
unauthorised requests. Test rooms expire after 24 hours.

The student room page at `/multiplayer/room.html` is deliberately disabled by the
empty public `config.js` value, and the existing computer and share-link games remain unchanged.

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

## Activation checklist

1. Database separation and schema creation: **complete**.
2. Vercel GitHub-connected project and server environment configuration: **complete**.
3. Verify `GET /api/health` from a browser at
   `https://tristos12.github.io/nyeemstudyguide/multiplayer/diagnostics.html`.
4. On the same diagnostic page, click **Run two-player technical test** and verify that
   room creation, joining, server scoring, duplicate rejection, and the scoreboard pass.
5. Test manually from two separate student devices with a supervised trial, including
   timed and untimed modes and a complete 60-round game.
6. Review data retention, accessibility, service protection, and Vercel/Neon usage.
7. After testing only, configure `multiplayer/config.js` with the public Vercel
   API hostname (never a database URL or private key), and add a student-facing link.
8. Retain the existing browser-only friend challenges as an offline-compatible fallback.

### Security limitations

A private room invitation is a shared secret: anyone possessing it may claim the second
seat. Room tokens remain session-scoped. This is **not** a school identity system.
The quiz content is public for educational revision, so scores are not verified exams.
The rate limit is approximate and may not prevent concerted abuse. Teacher oversight
is recommended for all student pilots.

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


## Challenge Centre (24 November 2026)

The learner-facing page is `/challenge-centre.html`. A notification banner is
loaded near the top of the main Learning Hub and General Knowledge page.
This is an **opt-in private inbox**, not an account system or school student
directory. The school four-digit learner code is deliberately not used for
online authentication.

Each learner generates a random 10-character address (Challenge Code) and
a 32-byte secret. Only the SHA-256 hash of that secret is stored in Neon. The
browser keeps its secret in profile-specific local storage; it is **never**
put into links or shared with classmates. The Challenge Code may be shared
with a friend. A friend can enter this code while creating a live room or
independent challenge to deliver one invitation to the recipient's inbox.

The recipient can see invitations, open the challenge, or dismiss them.
In-page notifications refresh approximately every 20–25 seconds while a
relevant page is open. No browser push notifications, email, phone alerts,
identity verification, or teacher moderation service are provided.
Sender nicknames are unverified.

Server rate limits are 5 inbox creations per network per 24 hours, 15
sent invitations per network per hour, and 20 invitations to one inbox per
24 hours. Invitations are valid for 24 hours; inboxes expire after 30 days.
Expired records are cleaned on service traffic, not by a guaranteed timed job.
A learner may delete their inbox and its invitations. Deleting local browser
data may strand a still-valid inbox until expiry. This is an educational pilot
and not a secure school login.

The separate backend uses `GET /api/inbox?code=...` with a private Bearer key,
`POST /api/inbox` for create/accept/dismiss/delete, and `POST /api/send-invite`
for sending validated in-domain live/shared links. Invitation URLs are
validated to be from the Learning Hub on GitHub Pages. The existing Sigma
database remains untouched.

Before a school rollout, test invite delivery between two different learner
profiles, expiry, dismissal, quota enforcement, and account switching on
shared devices. Review the school's student safeguarding and privacy policy.
