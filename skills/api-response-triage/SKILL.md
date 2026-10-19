---
name: api-response-triage
description: Use to diagnose a failed HTTP API or MCP JSON-RPC response, separating transport, protocol and tool-result failures without retrying writes.
license: CC-BY-4.0
---

# API Response Triage

## Reusable prompt

Inspect only the API interaction the user authorized. Preserve the exact target, UTC timestamp, client/runtime version, HTTP status and content type, negotiated protocol, and minimal relevant response. Redact credentials, session identifiers, private URLs, personal data, prompts and payment details before saving evidence. A response can contain secrets even when it is an error.

Separate layers before proposing a fix: transport/DNS/TLS, HTTP status, JSON parsing, JSON-RPC envelope, request-id correlation, method-specific schema, and business/tool outcome. HTTP 200 is not proof that a tool succeeded. A JSON-RPC error differs from an MCP tool result with isError: true. Do not disable TLS checks, broaden permissions or follow credential-bearing redirects.

Use the provider's current official schema and negotiated version. For JSON-RPC inspect jsonrpc, id, and exactly one of result or error. Match the id to the initiating request; a null id can indicate that the server could not recover the request identifier. Validate method results separately. A local envelope check is not proof of protocol conformance, authentication or delivery. Treat duplicate keys and numeric precision as parser limitations when relevant.

For an authorized read-only operation, reproduce twice with fresh bounded requests and cross-check using a second method, such as the documented SDK or redacted server logs. Do not automatically retry writes, payments, order creation or notifications: establish idempotency and obtain the required authorization first. Respect rate limits and documented retry delays; stop after the bounded checks rather than looping.

Review contradictions: proxy HTML instead of JSON, SSE framing, wrong content type, stale versions, missing auth, mismatched request IDs, and a successful envelope containing a business failure. Preserve disagreement as unverified. Do not infer provider identity, human activity, country or lost revenue from response structure.

## Triage receipt

- Target, method, version, UTC and authorized scope:
- HTTP / parse / JSON-RPC / method / business outcome:
- Redacted evidence for attempt A, attempt B and second method:
- Request-id correlation: matched / mismatched / not checked:
- Contradictions and missing evidence:
- Disposition: verified observation / unverified / not reproduced:
- Narrow next check, retry safety and stop condition:

## Acceptance checklist

Every conclusion names its layer and evidence. No live write was repeated merely to reproduce an error. No credential or private response body is retained in a shareable report. A successful parse or envelope is not described as a successful MCP tool call. Any external report requires separate authorization and a sent-copy read-back.

References: JSON-RPC 2.0 specification (https://www.jsonrpc.org/specification) and the target server's current MCP method schema. KnownFix's browser-local MCP Response Inspector checks envelope structure only.

## Synthetic example

Read [examples and acceptance criteria](references/examples.md) when practicing or validating this workflow. These fixtures are not customer evidence.

## Optional local helper

Requires Node.js 18 or newer. From this skill directory:

```sh
node scripts/cli.mjs inspect-response examples/response.json
```

Pass a regular UTF-8 JSON file or `-` for stdin, maximum 200,000 bytes. No network calls, telemetry, input execution or automatic file writes. JSON goes to stdout; exit 0 means the local check/model completed, 2 means invalid input, 1 means unreadable input. The response inspector checks envelope structure only, not request correlation or tool success. The retry planner returns only validated numeric settings and the model; it sends no webhooks. Do not install software or retain private input without authorization.
