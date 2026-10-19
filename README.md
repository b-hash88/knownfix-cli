# KnownFix

Developer fixes, six free workflow skills, three browser-local tools and ten
scoped technical services. The [live overview](https://knownfix-backend-28.b-hash88.deno.net/overview)
is the current inventory; search/free workflows need no account or API key.

## Connect

Remote Streamable HTTP: `https://knownfix-backend-28.b-hash88.deno.net/mcp`

```sh
npx knownfix@0.4.0 config claude-code
npx knownfix@0.4.0 config codex
npx knownfix@0.4.0 config cursor
npx knownfix@0.4.0 config vscode
npx knownfix@0.4.0 config claude-desktop
```

These print configuration only; they never install a client or change its files.
Claude Code uses its HTTP CLI command, Codex uses TOML, Cursor/VS Code use their
own JSON formats, and the Claude Desktop example uses a version-pinned stdio
bridge. Merge entries without replacing existing settings. `bridge` starts a
local MCP tools proxy to the remote endpoint; Node.js 18+ and the package's MCP
SDK dependency are required. Review downloaded packages before running them.

The [connection kit](https://b-hash88.github.io/knownfix/mcp-connect.html) includes
client references, supported install links and first-use checks. Configuration
saved, tools discovered and successful tool use are different states. After
discovery, ask the client to call `get_free_skill` with
`{"id":"api-response-triage"}`. Confirm a non-error result with the full workflow
and acceptance checklist. Do not buy, create orders or send private input as a
connection test. Use `get_overview` for the complete public catalog.

## Offline commands

After installing this package, these commands make no network calls:

```sh
knownfix inspect-response response.json
knownfix retry-plan retry.json
```

Use a regular UTF-8 JSON file or `-` for piped stdin, maximum 200,000 bytes.
JSON output goes to stdout: exit 0 = local check/model completed, 2 = invalid
input/usage, 1 = unreadable input. No telemetry, input execution or automatic
file writes. The response inspector omits payloads, IDs and server error text;
valid envelope structure is not proof of tool success. Retry output contains
validated settings and a serial failed-attempt model, never a webhook request.
See [toolkit examples and limits](https://github.com/b-hash88/knownfix/tree/main/toolkit).
Running through `npx` may download the package before execution; use an installed
copy or the dependency-free repository commands for offline processing.

## Install the six free skills

Standard `skills/<name>/SKILL.md` directories include the full workflows,
synthetic exercises, acceptance criteria and standalone helpers where relevant.
They are CC-BY-4.0, attributed to KnownFix; helper code is MIT. To review and
install with the third-party [Skills CLI](https://github.com/vercel-labs/skills):

```sh
npx skills add b-hash88/knownfix --list
npx skills add b-hash88/knownfix
```

Choose client/scope interactively, or copy reviewed skill directories into your
client's documented location. This installer downloads content and has its own
network/privacy behavior. The local helper commands themselves have no telemetry.

## Search and paid services

```sh
npx knownfix@0.4.0 tools
npx knownfix@0.4.0 search "your exact error"
```

`search --json` returns the complete result, including private signed offers
when applicable. Keep that output private. Search does not purchase anything.
Payment/redemption requires the owner's explicit authorization; never infer it
from installation or an agent's discovery request.

The [ten-service catalog](https://b-hash88.github.io/knownfix/services.html)
includes Verified Repo Fix ($149 USDC / 3 business days, payment only on verified
delivery), Webhook Reliability Review ($179 / 3 days), SaaS Security Exposure
Review ($299 / 5 days, written target/method/window authorization before testing),
and Microsite Launch ($299 / 5 days, scope/content/assets approval and manual
payment before work). Read the exact scope and delivery-clock conditions on each
service page. Manual-approval services do not use automated checkout. No
guarantee of findings, traffic, ranking or revenue.

Books is owner-only, not public sales proof. `knownfix books` explains this
without requesting statistics. Never put an owner credential in MCP settings.

## Development

`npm test` runs CLI contracts against local fixtures. The storefront's
`scripts/export-cli-toolkit.mjs` exports generated skills, helper modules and
client formats into this checkout, keeping them aligned with the browser tools.
No npm install/publish hooks execute input or collect telemetry.
