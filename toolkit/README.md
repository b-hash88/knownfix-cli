# KnownFix Free Toolkit

Six [Agent Skills](https://agentskills.io/specification) workflows, with two
dependency-free local Node.js commands. Skills are CC-BY-4.0, attributed to
KnownFix. Helper code uses [MIT](LICENSE). These are diagnostic
workflows, not permission to change systems, publish reports or spend money.

## Install skills

Review the files first. With the third-party [Skills CLI](https://github.com/vercel-labs/skills):

```sh
npx skills add b-hash88/knownfix --list
npx skills add b-hash88/knownfix
```

Select the skills, client and scope interactively. These commands download code
and may contact the installer provider; they are not the offline helpers below.
No account credential or KnownFix API key is needed. Alternatively, copy a
reviewed directory from `skills/` into your client's documented skill directory,
including its `scripts`, `examples` and `references` when present. Do not replace
an existing skill without reviewing it. Reload the client and confirm the skill
is discovered. Installation is not evidence that its task was completed.

## Run locally

After cloning this repository, Node.js 18+ is sufficient. No npm install is
needed for these commands:

```sh
node toolkit/cli.mjs inspect-response toolkit/examples/response.json
node toolkit/cli.mjs retry-plan toolkit/examples/retry.json
```

Use a regular UTF-8 JSON file or `-` for piped stdin, at most 200,000 bytes.
Input stays in the local process; no network, telemetry, shell execution,
automatic writes or dependency downloads. Avoid putting private JSON in command
arguments/history. Output is JSON on stdout. Exit 0 means the local envelope
check/model completed; 2 means invalid input/usage; 1 means unreadable input.

The response example returns `ok: true`, `kind: "Tool-level error flag"`:
well-formed JSON-RPC is not proof of tool success. Raw values, IDs, payloads and
error messages are omitted. Method schemas, duplicate keys and request matching
are outside the check.

The retry example returns `durationMax: 215`, `attemptsWithinBudget: 6`.
All seven fields are required; no extra keys. Units are seconds. The calculation
assumes serial unsuccessful attempts, each consuming its timeout, with no
queue/network overhead, Retry-After or provider policy. It sends no webhooks.

## Maintain and validate

`free-skills.json` and the existing browser-tool core modules are the sources.
Run `node scripts/sync-agent-toolkit.mjs`, then `node tests/agent-toolkit.mjs`.
Generated helper copies are checked for exact normalized parity. Each skill has
a synthetic task and acceptance criteria; these are not claims of completed
customer work or guaranteed model behavior.
