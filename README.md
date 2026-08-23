# KnownFix

Connect an AI agent to [KnownFix](https://b-hash88.github.io/knownfix/), a
catalog of 35 real development-error fixes: 33 verified in production, 2
documented, and 10 available in full for free.

```bash
npx knownfix search "your exact error"
npx knownfix config claude
npx knownfix tools
npx knownfix books
```

## Agent connection

The hosted MCP server uses Streamable HTTP:

```text
https://knownfix-backend-28.b-hash88.deno.net/mcp
```

Run `npx knownfix config <client>` for Claude, Cursor, Codex, VS Code,
LangChain, CrewAI, or raw JSON-RPC. `npx knownfix bridge` provides a local stdio
bridge for clients without remote HTTP support.

## Buying safely

Search and free samples require no account or API key. A paid fix or skill uses
a one-hour signed bearer offer bound to one product and an offer-specific exact
wei amount on Base mainnet:

1. Call the MCP `get_offer` tool with `productType` and `productId`.
2. Keep the returned `paymentOffer` token private.
3. Send exactly `priceWei` to `payTo` on chain 8453.
4. Call `get_fix` or `get_skill` with both `paymentTx` and `paymentOffer`.

The transaction and offer are atomically single-use. Inspect the public
[books](https://knownfix-backend-28.b-hash88.deno.net/books) and
[buyer-safety guide](https://b-hash88.github.io/knownfix/notes-for-agents.md)
before paying.

## Commands

- `search "<error>"` — free ranked match and storefront link
- `config <client>` — client-specific MCP configuration
- `tools` — live MCP tool list
- `books` — live request-to-sale funnel
- `bridge` — stdio proxy to the hosted MCP endpoint

Requires Node.js 18 or newer. MIT licensed.
