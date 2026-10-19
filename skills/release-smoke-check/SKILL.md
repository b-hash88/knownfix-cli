---
name: release-smoke-check
description: Use before and after an authorized release of a website, API, or developer tool to verify its critical path.
license: CC-BY-4.0
---

# Release Smoke Check for Codex and Claude

A checklist cannot guarantee reliability. Start with the repository's actual commands and deployment process; do not substitute a guessed stack or upgrade dependencies merely to run this skill.

## Reusable prompt

Read the project instructions, current diff, runtime pins, and documented build/test/release commands. Preserve unrelated user changes. Identify one critical user journey and define success, expected rejection, and rollback conditions before changing anything. Work only on authorized targets.

Create a timestamped evidence record containing commit or dirty-tree state, runtime versions, commands, exit codes, target URLs, and raw relevant output. Redact credentials, private tickets, personal data, and payment details.

Run the narrow regression test and the documented build/type/test checks. A zero exit code is necessary but not sufficient: inspect the expected output. Do not suppress failing tests or disable security protections. If a check is unavailable, list it as not tested.

On a local or staging instance, exercise the critical journey and one expected failure. For a browser UI inspect a desktop viewport near 1440px and mobile near 390px, checking layout, keyboard focus, loading, empty and error states. Record actual screenshots when available; do not describe screenshots you did not inspect. For an API compare status and schema, not only an HTTP 200.

After an authorized deployment, read the public result twice with fresh requests and cross-check using a second method. Confirm the release marker or changed behavior, not merely a green deployment log. Readiness and mocked payment tests do not prove live settlement. Do not create a real order, charge a card, move crypto, or send notification mail without explicit authorization; prefer documented sandbox flows.

If a release gate fails, stop further rollout and use the documented reversible rollback only when authorized. Record what remains changed and unverified. Do not claim the whole system works because one route passed.

## Release receipt template

- Target / release / environment / UTC:
- Critical journey and success criteria:
- Commands, exit codes and evidence paths:
- Happy path and expected rejection results:
- Desktop / mobile / keyboard checks:
- Public attempt A / B / second method:
- Payment scope: not tested / sandbox / authorized live:
- Contradictions and untested integrations:
- Disposition: ready within tested scope / blocked / unverified
- Rollback trigger and documented recovery path:
- Next action, owner, and due date:

## Acceptance checklist

The receipt names the exact tested scope; local and production results are separate; private data is absent; public behavior matches the intended change; failed checks and untested payments remain visible. Never manufacture buyers or count declared operator tests as demand.

Source: KnownFix release-review discipline. Designed for Codex or Claude as a portable prompt, not an executable tool or automatic deployment authority.

## Synthetic example

Read [examples and acceptance criteria](references/examples.md) when practicing or validating this workflow. These fixtures are not customer evidence.
