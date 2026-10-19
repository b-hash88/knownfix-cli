---
name: evidence-first-bug-report
description: Use when reproducing a suspected website or code defect and preparing a report for its maintainer.
license: CC-BY-4.0
---

# Evidence-First Bug Report

This is a reusable workflow, not a claim that any target has a defect. Use only systems you are authorized to inspect. Do not scan private endpoints, bypass access controls, or send reports automatically.

## Reusable prompt

Treat the suspected defect as a hypothesis. Inspect the current target and preserve the exact URL or file and commit, UTC timestamp, runtime/browser version, input, method, status, and relevant raw output. Redact credentials, bearer links, personal data, and payment details before saving evidence.

Reproduce with two fresh independent attempts. Cross-check with a second method: for a website compare the HTTP response with the rendered browser; for code compare a focused automated test with a direct execution of the smallest reproducer. These checks are separate observations, not claims of independent reviewers.

Search for contradictions: intentional behavior, documented constraints, stale cache, environment mismatch, missing authorization, and results on a control input. Separate observed behavior from your explanation. If it does not reproduce or the methods disagree, label it unverified and do not report it as a bug.

Prepare the report below. Do not send it without authorization. Never claim accessibility, security, lost revenue, or affected-user counts without evidence for that specific impact. Avoid destructive fixes or widening permissions.

## Report template

- Title: observed behavior, not an accusation
- Target and tested version:
- Expected behavior and its basis:
- Actual behavior:
- Minimal steps and input:
- Evidence paths and timestamps:
- Attempt A / attempt B / second-method results:
- Contradictory evidence and control result:
- Disposition: verified / unverified / not reproduced
- Observed impact and limitations:
- Proposed narrow fix, if supported:
- Regression test and rollback condition:

## Acceptance checklist

A maintainer can repeat the steps without your account or secrets; each factual claim points to a retained artifact; the report distinguishes a suggestion from a defect; the exact tested environment is named. A saved report is not proof of remote delivery. If authorized to send, read back the sent copy and record any promise or follow-up separately.

Source: KnownFix operating discipline. No guarantee of finding a defect or improving traffic.

## Synthetic example

Read [examples and acceptance criteria](references/examples.md) when practicing or validating this workflow. These fixtures are not customer evidence.
