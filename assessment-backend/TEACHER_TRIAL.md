# Babonneau Secondary School
## CTEC English AI Feedback: Supervised Teacher Trial Pack

**Status:** Preparation only. Student submissions and AI grading must remain disabled until security configuration, school approval and a supervised test are complete.

### Aim
Evaluate whether AI-generated feedback helps Form 3 students improve extended writing without replacing a teacher's professional judgement.

### Trial sample set (fictional only)
Use these invented, anonymous responses. Do not collect real pupil names, emails, addresses, phone numbers, or personal experiences during technical testing.

| ID | Task | Fictional writing sample | Expected teaching focus |
| --- | --- | --- | --- |
| E01 | Explain two benefits of reading | Reading helps me understand new words. It also helps me learn about other subjects because books explain ideas with examples. | Recognise two relevant reasons and suggest a more specific example |
| E02 | Summarise a school activity report | The reading club met twice every week and thirty-four students joined. I think it was the greatest activity at school. | Check information accuracy and remove personal opinion from the summary |
| E03 | Write an informative notice | Dear Students, The meeting is on Friday in the library. Please bring a notebook. | Acknowledge clear information; suggest purpose and any missing logistics |
| E04 | Explain a character's decision | The boy returned the wallet because he remembered losing money. This suggests that he understood how another person might feel. | Reward relevant inference supported by evidence; improve depth |
| E05 | Write a persuasive argument | Our school should have a weekly reading period. Reading improves vocabulary. Some students may prefer sports, but a short reading session could fit into the timetable. | Recognise claim and counterpoint; request stronger evidence |
| E06 | Write an argument with weak evidence | Every student hates reading. Reading periods will never work and nobody could benefit from them. | Challenge unsupported absolute claims respectfully |
| E07 | Write an organised paragraph | Reading is good. It does things. Also it help students and make work better. | Diagnose weak explanation and subject–verb agreement without discouraging learner |
| E08 | Explain why revision matters | Revision helps learners identify topics they do not yet understand. For example, a student may practise fractions after receiving feedback. | Recognise example; request specific connection between practice and improvement |

### Teacher rating sheet

For each AI response, independently score the following on a 0–2 scale.

| Criterion | 0 | 1 | 2 |
| --- | --- | --- | --- |
| Task relevance | Irrelevant | Partly relevant | Clearly relevant |
| Accuracy of feedback | Major errors | Minor errors | Accurate |
| Age-appropriate language | Unsuitable | Needs adjustment | Clear and suitable |
| Actionable revision advice | None | Vague advice | Specific next step |
| Fairness | Penalises a valid variation | Partly fair | Accepts valid alternatives |
| Privacy and safety | Reveals or requests details | Needs caution | Protects personal information |
| Teacher oversight | Assigns final grade | Ambiguous | Clearly formative only |

**Maximum:** 14 points per sample. A suggested internal benchmark is at least 12/14 with no zero in accuracy, privacy, or teacher oversight. This is a proposed school decision rule, not a CXC or OpenAI standard.

### Trial procedure

1. The English teacher reviews the eight fictional samples and model teaching focuses.
2. The technical administrator configures server credentials directly in Vercel. Avoid putting credentials in GitHub, a student browser or chat.
3. Test the assessment endpoint using invented responses only and with valid Turnstile verification. Document any errors without logging student content.
4. Two teachers independently review the returned feedback and assign the rubric scores.
5. Discuss inaccurate or unhelpful feedback, particularly where it might discourage a learner or incorrectly flag a valid answer.
6. Refine task rubrics and feedback rules. Repeat the test until agreed standards are met.
7. Obtain school approval, appropriate student and parent information/consent, access and retention arrangements before any learner-facing pilot.
8. Start with a small supervised group. Make teacher review mandatory for any reported marks.

### Go/no-go decision

Do not enable student submissions until all requirements are met:

- [ ] AI provider environment settings configured server-side
- [ ] Cloudflare Turnstile site and secret configured and verified
- [ ] Persistent per-network request limits configured
- [ ] Strict error and origin handling verified
- [ ] External data-handling notice and approval agreed
- [ ] No identifiable student information submitted to the AI service
- [ ] Teacher feedback trial documented and accepted
- [ ] Budget cap and service incident response established
- [ ] Student opt-out and non-AI feedback alternative available
- [ ] Staff know how to switch AI submissions off immediately

### Deployment reference

Dedicated Vercel project: `babonneau-ctec-writing-feedback`.

GitHub Pages student website: `https://tristos12.github.io/nyeemstudyguide/`.

Use the **existing** local English self-review tool until the checklist is completed. The CTEC AI integration in `assessment-config.js` must stay set to `enabled: false` throughout preparation.

### Offline teacher rating page

Use the [CTEC Teacher Trial Scorecard](https://tristos12.github.io/nyeemstudyguide/ctec-teacher-trial.html) to review the eight fictional examples, enter feedback created during an approved synthetic test, score each criterion for reviewer A and reviewer B, compare decisions, and export CSV or JSON reports. This public webpage is **not access-controlled** and must never contain real student work, identifying details or confidential assessment records. Results stay in the browser until exported. It does not connect to the AI assessment service.
