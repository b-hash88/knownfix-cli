---
name: mcp-connection-triage
description: Use when an MCP client cannot connect to a server or discover its tools; diagnose without invoking business tools or widening access.
license: CC-BY-4.0
---

# MCP Connection Triage

Diagnose a failed connection on a server you are authorized to inspect. Do not treat a directory health badge or an HTTP 200 as proof that MCP works. This workflow does not authorize changing credentials, installing software, exposing a local server, or calling tools that write data.

## Reusable prompt

Read the server's actual configuration and current official connection instructions. Record the client and server versions, declared transport, exact redacted endpoint or local launch command, UTC timestamp, expected authentication scheme, and a short description of the failure. Redact credentials, session identifiers, private URLs and personal data from all retained output. Never paste a token into a report, shell history, query string or unrelated domain.

For a local stdio server, distinguish process launch failure from protocol failure. Check the configured executable, working directory, runtime and required environment-variable names without printing their values. Capture exit status and redacted stderr; logs belong on stderr, not the protocol stream. Do not assume the command installed globally is the command the client launches.

For a remote server, distinguish DNS/TLS or transport failure, HTTP rejection, authentication failure, MCP initialization rejection, and tools/list failure. Use the documented MCP client or inspector for the declared transport and protocol version. Follow its negotiated initialization and session lifecycle; do not invent headers, assume all servers use SSE, disable TLS validation, or retry with broader scopes. Do not send an existing credential across an unverified redirect.

Make two fresh connections with bounded timeouts. After successful initialization, list tools only and record the declared names and schemas. Do not execute a business tool merely to test discovery. Use a second method such as another documented client or a server-side redacted log correlated by timestamp. A bare HTTP probe is useful for reachability only, not a substitute for an MCP handshake. Close each client and transport after the check.

Review contradictions: wrong transport, stale URL or configuration, mismatched environment, proxy behavior, advertised authentication requirements, and a client-specific failure. If anonymous discovery is rejected but documented authenticated discovery works, report that distinction rather than calling the server offline. If results disagree, label the diagnosis unverified and retain both observations. Stop on repeated failures instead of looping, generating credential grants, or opening more sessions.

## Connection receipt

- Target / transport / client and server versions / UTC:
- Expected authentication, with no secret values:
- Failure stage and exact redacted status or error:
- Attempt A / B: initialization and tools/list results:
- Second-method evidence and contradictions:
- Tool names observed, not tools executed:
- Disposition: reproduced / client-specific / unverified:
- Smallest supported next check and remaining limitation:

## Acceptance checklist

The receipt separates reachability from protocol readiness and discovery from successful tool execution. No credentials are retained, no write tools are called, and no new access is granted. Any proposed configuration change is reviewed within the user's original scope. A maintainer can repeat the safe checks without receiving your token.

Source: KnownFix evidence-first workflow. Consult the server's current official instructions for its specific transport and authentication contract; no universal compatibility guarantee.

## Synthetic example

Read [examples and acceptance criteria](references/examples.md) when practicing or validating this workflow. These fixtures are not customer evidence.
