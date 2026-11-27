# CTEC writing feedback backend (deployment preparation)

This directory contains a **separate, disabled-by-default** Vercel Node.js service for formative feedback on CTEC English writing. It is not attached to the General Knowledge multiplayer API, Sigma, or existing school records.

## Status
- Source code is prepared in `api/assess.js`.
- **Deployed but disabled.** The dedicated Vercel project is `babonneau-ctec-writing-feedback` at `https://babonneau-ctec-writing-feedback.vercel.app`. The deployment's health and disabled-state smoke tests have passed. No AI secret has been placed in this repository.
- No student data is sent anywhere until a dedicated backend is deployed and configured.
- The browser's existing local draft feedback remains the fallback.

## Deploy safely
1. Create a separate Vercel project using this GitHub repository, with **Root Directory** `assessment-backend`; do not point the existing multiplayer project at this folder.
2. Add server-only environment variables in Vercel, never GitHub or client JS: `OPENAI_API_KEY`, `OPENAI_MODEL`, `TURNSTILE_SECRET_KEY`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `RATE_LIMIT_SALT`. Use a supported model capable of Responses API structured JSON.
3. Configure a dedicated Cloudflare Turnstile widget for `tristos12.github.io`, and configure the Redis REST credentials for persistent request limits. This implementation allows at most **10 valid requests per hashed IP per hour**, and refuses requests if the limiter fails.
4. Keep `ASSESSMENT_ENABLED` unset while validating accessibility, privacy requirements and request handling. Set it to `true` only after a supervised test.
5. Configure the public endpoint URL and public Turnstile site key in the separate client configuration when ready. No secret values belong there.
6. Confirm CORS behavior, unauthorized origins, missing/malformed requests, invalid Turnstile token, rate limit and outage handling before students use it.
7. Obtain school approval and appropriate parent/student notices before sending writing from minors to an external AI processor. Use no student names or identifying details in writing tasks; avoid requesting sensitive personal content. Establish a retention policy and a way for students to opt out.
8. Teacher review remains required before awarding formal grades, and no school-wide dashboard or record storage is included in this service.

## Pre-activation test results

GitHub Actions runs `assessment.test.cjs` and `feedback-pipeline.test.cjs` using fictional responses and mock network calls. They cover consent, forbidden origins, Turnstile rejection, rate limiting, provider errors, malformed AI outputs and the no-grade requirement. The workflow also checks production `/api/health` and rejection of `/api/assess` while disabled. This does not demonstrate real AI feedback quality or readiness for minors.

## Request/response

POST `/api/assess` with JSON fields `task`, `rubric`, `answer`, `consent: true`, and a valid `turnstileToken`.

Response includes `feedback.overview`, `feedback.strengths`, `feedback.improvements`, `feedback.revisionPrompt`, `feedback.teacherReviewRequired = true`, `feedback.grade = null`.

The endpoint accepts a restricted origin and validates the request, but **origin checking alone is not authentication**. Turnstile and Redis rate limits reduce abuse; before wider use consider authenticated student sessions, tighter per-session quotas, spending caps and safety review. Do not treat Turnstile as proof of a student's identity.

## Limitations

- OpenAI feedback is fallible, including possible invented claims or incorrect criticism.
- Final official marks require a teacher.
- Written work is not stored by this backend, but it is transmitted to the external AI provider when the feature is activated.
- A secure teacher records system is a separate implementation with access controls, audit and data-retention requirements.
