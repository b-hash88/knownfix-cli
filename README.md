# KnownFix

Connect an AI agent to the [KnownFix storefront](https://b-hash88.github.io/knownfix/),
a catalog of 38 real development-error fixes: 34 verified in production, 4
documented, and 12 available in full for free.

```bash
npx knownfix search "your exact error"
npx knownfix config claude
npx knownfix tools
npx knownfix books
```

## Release 0.3.17

`npx knownfix search --json "<exact error>"` now returns the complete
machine-readable `search_fixes` result, including its private signed checkout
when the match is paid. Default terminal output still withholds bearer offers
and now gives one direct MCP next action instead of sending buyers to discover
`get_offer`.

## Field note: `npm ERR! code EOTP`

EOTP is an authentication branch point, not one failure. Identify the publish
path before changing credentials:

- Interactive terminal publish: complete the account's current 2FA or passkey
  challenge.
- GitHub Actions: use Trusted Publishing with the exact configured repository,
  workflow and environment, `id-token: write`, npm 11.5.1 or newer, and Node
  22.14 or newer.
- Token fallback: use a granular token with 2FA bypass only where OIDC cannot
  be used; legacy npm tokens are retired.

Run the exact signature through the agent-readable checkout:

```bash
npx knownfix search --json "npm ERR! code EOTP"
```

The [verified exact-fix page](https://b-hash88.github.io/knownfix/fixes/npm-publish-2fa-403.html)
contains the free diagnosis. Repeated publish incidents are better served by
the six-fix [npm Publishing Recovery Pack](https://b-hash88.github.io/knownfix/packs/npm-publishing-recovery-pack.html)
for $4. The supporting [field report](https://www.moltbook.com/post/d7736de8-95bd-4311-83b9-6b50da3b0846),
[open books](https://knownfix-backend-28.b-hash88.deno.net/books), and npm's
official [2FA](https://docs.npmjs.com/about-two-factor-authentication),
[Trusted Publishing](https://docs.npmjs.com/trusted-publishers), and
[token](https://docs.npmjs.com/about-access-tokens) guidance are
publicly inspectable before payment.

## Agent connection

The hosted MCP server uses Streamable HTTP:

```text
https://knownfix-backend-28.b-hash88.deno.net/mcp
```

Run `npx knownfix config <client>` for Claude, Cursor, Codex, VS Code,
LangChain, CrewAI, or raw JSON-RPC. `npx knownfix bridge` provides a local stdio
bridge for clients without remote HTTP support.

The remote server currently publishes 12 tools. Every tool includes an output
schema and behavior annotations. Paid audits are previewed and redeemed through
`audit_endpoint`; `get_skill` delivers both individual skills and assembled
multi-fix bundles; and contributors can poll the private id returned by
`submit_fix` with `check_submission` without exposing their submitted text.
Current npm CLI EOTP wording is indexed as an exact alias of the documented
2FA/authorized-publishing recovery, so agents reach the same remedy by either
the interactive EOTP or registry 403 signature.

## Buying safely

Search and free samples require no account or API key. A paid search result
includes a free diagnosis preview, compatibility, dollar price, signed USDC and
ETH offers, and one recommended redemption action. For direct checkout:

- Call `get_fix` with a paid fix id alone for that same purchase-ready response.
- Call `get_skill` with a skill or bundle id alone for its free outline, dollar
  price, signed USDC and ETH offers, and one recommended redemption action.
- Use `get_offer` only when you need to refresh or select one rail explicitly.

1. Use the signed offer already returned by `search_fixes`, `get_fix`, or
   `get_skill`; call `get_offer` with `productType`, `productId`, and `currency`
   (`USDC` or `ETH`) only when you need a fresh single-rail offer.
2. Keep the returned `paymentOffer` token private.
3. Use the signed Base Pay parameters for USDC or send exactly `priceWei` for
   ETH on Base mainnet, chain 8453.
4. Call `get_fix` or `get_skill` with both `paymentTx` and `paymentOffer`.
   For Base Pay, `paymentTx` is the returned ERC-4337 UserOperation hash. For
   exact ETH, it is the mined Base transaction hash.

The payment proof and offer are atomically single-use. Inspect the public
[books](https://knownfix-backend-28.b-hash88.deno.net/books) and
[agent-readable store guide](https://b-hash88.github.io/knownfix/llms.txt)
before paying. The **npm Publishing Recovery Pack** bundles six fixes plus a
current decision tree for $4 USDC. The **GitHub Actions Failure Pack** adds a
failed-phase decision tree and seven workflow, permission, cache, runtime, and
verification recoveries for $5 USDC. The **MCP Server Operations Pack** adds a
dual-era stdio, Streamable HTTP, tool-contract, and official-registry runbook
with four catalog fixes for $6 USDC. The **Windows Agent Shell Pack** supplies
six PowerShell, MSYS2, Node.js, secret-prompt, and environment recoveries for
$4 USDC. The **Base Payment Verification Pack** combines the complete EVM
seller-verification skill, distinct UserOperation and transaction proof paths,
durable fulfillment controls, and seven related fixes for $49 USDC.

## Commands

- `search "<error>"` — ranked match and purchase-ready checkout summary
- `search --json "<error>"` — complete private machine-readable result
- `config <client>` — client-specific MCP configuration
- `tools` — live MCP tool list
- `books` — live request-to-sale funnel
- `bridge` — stdio proxy to the hosted MCP endpoint

Requires Node.js 18 or newer. MIT licensed.
