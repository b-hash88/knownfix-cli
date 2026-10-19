---
name: webhook-delivery-triage
description: Use when diagnosing a missing, failed or duplicate webhook delivery on an authorized integration; not for replaying events or changing signing keys.
license: CC-BY-4.0
---

# Webhook Delivery Triage

## Reusable prompt

Define the expected event, provider, endpoint and environment. Read the integration's current official delivery, signature and retry documentation rather than assuming another provider's rules. This workflow authorizes diagnosis only, not a live replay, signing-key rotation or a business-state change.

Preserve UTC timestamps, application version, delivery-attempt status, redacted response and a minimal timeline. Redact credentials, signing secrets, signatures, bearer links, customer data and payment details before retaining evidence. Keep raw payloads only in an approved private evidence location when needed; do not paste them into public tools or reports.

Separate event creation, provider dispatch, endpoint receipt, signature verification, acceptance or durable enqueue, processing and the final business effect. An HTTP success or a provider's delivered badge does not by itself prove processing completed. Correlate authorized provider records with endpoint and worker logs using an opaque event reference kept private; do not infer a customer or payment from a delivery count.

Compare two fresh read-only observations of the recorded attempt and current processing state. Cross-check with a second method such as authorized provider delivery history versus receiver logs. A refreshed historical record is not a new webhook attempt. If a sandbox reproduction is authorized, use documented fixtures and one isolated test destination, not a real payment or order. Record separately what was inspected and what was reproduced.

For duplicates, inspect the actual deduplication boundary and atomicity of the business effect. For missing events, check subscriptions, environment, destination, failure status, queue retention and documented retry timing. Verify signatures using the provider's supported verifier and required original body representation. Do not disable verification, log secrets, broaden subscriptions or acknowledge an event before the integration's documented acceptance condition merely to make the test pass.

Review contradictions: test versus live mode, multiple destinations, reordered events, delayed retries, wrong event type, expired logs, proxy responses and processing after an earlier timeout. If records disagree or logs are missing, label the diagnosis unverified. Distinguish missing evidence from a confirmed lost event. Stop after bounded checks; do not replay a production event until authorization, idempotency and the possible business effects are established.

## Delivery receipt

- Provider / destination / environment / version / UTC:
- Expected event and documented delivery contract:
- Dispatch / receipt / verification / queue / processing observations:
- Attempt record A / B / second method and redacted evidence:
- Sandbox reproduction, if authorized, versus historical inspection:
- Duplicate-handling boundary and possible replay effect:
- Contradictions, missing logs and disposition:
- Narrow next action, authorization needed and stop condition:

## Acceptance checklist

The report names the last evidenced stage without calling acceptance a completed business action. Each claim points to retained redacted evidence. No live event was replayed, verification weakened or key rotated under diagnosis-only authority. Inconsistent results stay unverified; any proposed repair needs its own regression test and separately authorized release.

Source: KnownFix evidence-first workflow. Provider-specific delivery guarantees and retry schedules must be checked against current official documentation.

## Synthetic example

Read [examples and acceptance criteria](references/examples.md) when practicing or validating this workflow. These fixtures are not customer evidence.

## Optional local helper

Requires Node.js 18 or newer. From this skill directory:

```sh
node scripts/cli.mjs retry-plan examples/retry.json
```

Pass a regular UTF-8 JSON file or `-` for stdin, maximum 200,000 bytes. No network calls, telemetry, input execution or automatic file writes. JSON goes to stdout; exit 0 means the local check/model completed, 2 means invalid input, 1 means unreadable input. The response inspector checks envelope structure only, not request correlation or tool success. The retry planner returns only validated numeric settings and the model; it sends no webhooks. Do not install software or retain private input without authorization.
