# CTEC AI writing feedback: final connection steps

## Current configuration (26 November 2026)

- GitHub repository: `Tristos12/nyeemstudyguide`.
- Vercel project: `babonneau-ctec-writing-feedback`.
- Production URL: `https://babonneau-ctec-writing-feedback.vercel.app`.
- Server AI provider: Vercel AI Gateway with OIDC, configured by `AI_PROVIDER=vercel-gateway`.
- Feedback model: `openai/gpt-5.4-mini`, configured by `AI_GATEWAY_MODEL`.
- `ASSESSMENT_ENABLED=false` remains in place.
- Public website `assessment-config.js` retains `enabled:false` and contains no credentials.
- Automated synthetic tests and live health/disabled-state checks exist in GitHub Actions.

## External account setup still required

These steps need an authorised person to configure the service in their own provider's dashboard. **Do not paste credentials into GitHub, chat or the public website.**

### 1. AI Gateway account

1. Open the Vercel dashboard and select the team owning `babonneau-ctec-writing-feedback`.
2. Open AI Gateway, confirm its activation and available credits/payment method.
3. Create a **project-scoped monthly budget**, initially no more than **US$5**, and set spend alerts. This is a proposed trial limit; obtain school approval for expenditure.
4. Confirm that OIDC identity is enabled for the Vercel project. Do not create a provider API key if using OIDC.
5. Leave `ASSESSMENT_ENABLED=false`.

The connected Vercel app could read model listings and configure plain environment variables, but could **not** read or change AI Gateway spending budgets (403 permission error).

### 2. Cloudflare Turnstile

1. In [Cloudflare Turnstile](https://dash.cloudflare.com/), create a Turnstile widget for the hostname `tristos12.github.io`.
2. Configure and copy the **public site key** into the public file `assessment-config.js` as `turnstileSiteKey`. This key is designed to be public.
3. In the Vercel project's Environment Variables, add the **secret key** as encrypted `TURNSTILE_SECRET_KEY`, for Production and Preview as appropriate.
4. The server verifies both Turnstile's outcome and that the reported hostname is `tristos12.github.io`.

### 3. Persistent rate limiter

1. Create a dedicated Upstash Redis database for school CTEC feedback (not the Sigma database or general-knowledge game database) using [Upstash Console](https://console.upstash.com/).
2. Copy its REST URL and REST token into **encrypted Vercel Environment Variables** `KV_REST_API_URL` and `KV_REST_API_TOKEN`.
3. Add `RATE_LIMIT_SALT` as another encrypted Vercel variable with a newly generated strong random value (not a student name or password). Set it privately in Vercel.
4. The service permits a maximum of **10 verified feedback requests per hashed IP address per hour** and refuses submissions if the limiter is unavailable.

### 4. School data-handling approval

Before any real student response is processed, confirm notice and consent procedures, access restrictions, approved usage purpose, data retention/deletion arrangements, escalation for problematic feedback, spending authority and teacher oversight. No sensitive personal material or identifiable student details should be included. The current regex-based contact filter is only a supplemental defence and cannot identify every name or personal fact.

### 5. Supervised fictional trial

Use `ctec-teacher-trial.html`, the eight fictional samples, two independent teacher ratings and the proposed benchmark. Verify feedback quality and the response contract. Never treat passing the synthetic API tests as proof of AI quality.

### 6. Activation sequence

1. Configure all the settings above and redeploy the backend.
2. Confirm `GET https://babonneau-ctec-writing-feedback.vercel.app/api/health` reports the service online with assessment disabled.
3. Run the automated synthetic tests and live disabled-state check.
4. Complete a controlled teacher trial using fictional text and real verification.
5. Once the school approves, enable the **server** (`ASSESSMENT_ENABLED=true`), redeploy, and verify authenticated/rate-limited requests. **This immediately exposes the backend endpoint** to callers with valid Turnstile tokens, so do not take this step without approval and spending controls.
6. Set the **public client** `assessment-config.js` `endpoint` to `https://babonneau-ctec-writing-feedback.vercel.app/api/assess`, set `turnstileSiteKey` to the public site key, and set `enabled:true` only when ready for student-facing supervised access.
7. Monitor errors and spend. To immediately stop processing, switch server `ASSESSMENT_ENABLED` back to `false` and redeploy; also disable the public client as appropriate.

## Security observations

- GitHub Pages cannot securely store a secret.
- The draft is processed only if the public and private feature flags are activated, the user consents and the server's verification and rate limits succeed.
- The site is public and lacks robust student identity verification. Do not use this as an official grading or private records system.
- The AI service does not issue final grades. Teachers remain responsible for assessment decisions.
- If a required service is not configured or fails, the API fails closed and the existing local self-review remains available.
