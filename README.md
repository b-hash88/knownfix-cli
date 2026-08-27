# KnownFix

Connect an AI agent to [KnownFix](https://knownfix-backend-28.b-hash88.deno.net/),
a catalog of 36 real development-error fixes: 33 verified in production, 3
documented, and 11 available in full for free.

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

Search and free samples require no account or API key. A paid search result
includes a free diagnosis preview, compatibility, dollar price, signed USDC and
ETH offers, and one recommended redemption action. For direct checkout:

1. Call `get_offer` with `productType`, `productId`, and `currency` (`USDC` or
   `ETH`), or use the offer already returned by `search_fixes`.
2. Keep the returned `paymentOffer` token private.
3. Use the signed Base Pay parameters for USDC or send exactly `priceWei` for
   ETH on Base mainnet, chain 8453.
4. Call `get_fix` or `get_skill` with both `paymentTx` and `paymentOffer`.

The transaction and offer are atomically single-use. Inspect the public
[books](https://knownfix-backend-28.b-hash88.deno.net/books) and
[agent-readable store guide](https://knownfix-backend-28.b-hash88.deno.net/llms.txt)
before paying. The **npm Publishing Recovery Pack** bundles five fixes plus a
current decision tree for $4 USDC. The **GitHub Actions Failure Pack** adds a
failed-phase decision tree and seven workflow, permission, cache, runtime, and
verification recoveries for $5 USDC.

## Commands

- `search "<error>"` — ranked match and purchase-ready checkout summary
- `config <client>` — client-specific MCP configuration
- `tools` — live MCP tool list
- `books` — live request-to-sale funnel
- `bridge` — stdio proxy to the hosted MCP endpoint

Requires Node.js 18 or newer. MIT licensed.
