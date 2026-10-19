#!/usr/bin/env node
// knownfix — connect any AI agent to the KnownFix store.
//
//   npx knownfix               what this is + how to connect
//   npx knownfix config <c>    print MCP config for a client
//   npx knownfix bridge        run a local stdio MCP server that proxies to
//                              the remote KnownFix MCP (for stdio-only clients)
//   npx knownfix search "err"  quick free error match from the terminal
//   npx knownfix search --json  complete machine-readable search result
//   npx knownfix books         explain owner-only statistics access
//
// The store's customers are AI agents. This package is the on-ramp.

import { clientSetup } from './lib/mcp-client-configs.mjs';
const REMOTE = process.env.KNOWNFIX_URL || "https://knownfix-backend-28.b-hash88.deno.net";
const MCP_URL = `${REMOTE}/mcp`;

const [cmd, ...rest] = process.argv.slice(2);

const INTRO = `KnownFix — cataloged fixes for real errors, sold per-lookup to AI agents.
Free to search, with free fixes and six full workflow skills. Current inventory
is available from get_overview. Paid fixes start at $0.05 USDC on Base. Search
returns a diagnosis preview and purchase-ready offers. No buyer account or API key.

Remote MCP server (Streamable HTTP): ${MCP_URL}
Store guide + product catalog:       ${REMOTE}/llms.txt

Commands:
  npx knownfix config <client>   MCP setup (claude-code | claude-desktop | cursor | codex | vscode | langchain | crewai | raw)
  npx knownfix bridge            local stdio MCP server proxying to the remote (for stdio-only clients)
  npx knownfix search "<error>"  free error match from the terminal
  npx knownfix search --json "<error>"
                                  complete result; keep signed offers private
  npx knownfix tools             list the remote MCP tools
  npx knownfix inspect-response FILE|-   offline JSON-RPC envelope check
  npx knownfix retry-plan FILE|-         offline retry budget model
  npx knownfix books             explains owner-only stats access`;

const CONFIGS = {
  langchain: `# LangChain (langchain-mcp-adapters):
from langchain_mcp_adapters.client import MultiServerMCPClient
client = MultiServerMCPClient({
    "knownfix": {"transport": "streamable_http", "url": "${MCP_URL}"}
})
tools = await client.get_tools()`,
  crewai: `# CrewAI (crewai-tools MCPServerAdapter):
from crewai_tools import MCPServerAdapter
server = {"url": "${MCP_URL}", "transport": "streamable-http"}
with MCPServerAdapter(server) as tools:
    ...  # give 'tools' to your agent`,
  raw: `# Raw JSON-RPC over HTTP (any language):
curl -s -X POST ${MCP_URL} -H 'content-type: application/json' \\
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
curl -s -X POST ${MCP_URL} -H 'content-type: application/json' \\
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"search_fixes","arguments":{"query":"YOUR ERROR"}}}'`,
};

async function rpc(method, params) {
  const r = await fetch(MCP_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  const j = await r.json();
  if (j.error) throw new Error(j.error.message);
  return j.result;
}

async function main() {
  if (!cmd || cmd === "help" || cmd === "--help") return void console.log(INTRO);

  if (cmd === 'inspect-response' || cmd === 'retry-plan') {
    const { main } = await import('./toolkit/cli.mjs');
    await main([cmd, ...rest]);
    return;
  }

  if (cmd === "config") {
    const client = (rest[0] || "").toLowerCase();
    const setup = clientSetup(client, MCP_URL);
    if (setup) { console.log(`# ${setup.filename}\n${setup.text}`); return; }
    if (!CONFIGS[client]) {
      console.log(`Usage: npx knownfix config <claude-code | claude-desktop | codex | cursor | vscode | ${Object.keys(CONFIGS).join(" | ")}>`);
      return;
    }
    console.log(CONFIGS[client]);
    return;
  }

  if (cmd === "tools") {
    const { tools } = await rpc("tools/list");
    for (const t of tools) console.log(`- ${t.name}: ${t.description.split(".")[0]}.`);
    return;
  }

  if (cmd === "books") {
    console.log('Books is owner-only. Use the owner sign-in flow; never add its credential to MCP config. No public statistics are returned.');
    return;
  }

  if (cmd === "search") {
    const jsonOutput = rest.includes("--json");
    const q = rest.filter((part) => part !== "--json").join(" ");
    if (!q) return void console.log('Usage: npx knownfix search "<your error text>"');
    const res = await rpc("tools/call", { name: "search_fixes", arguments: { query: q } });
    const out = JSON.parse(res.content[0].text);
    if (jsonOutput) return void console.log(JSON.stringify(out, null, 2));
    if (!out.matches.length) return void console.log("No match — honest miss. This store does not stock your error.");
    console.log(`Top matches for: ${q}\n`);
    for (const m of out.matches) {
      console.log(`  ${m.id}  (${m.match ?? m.score}, ${m.confidence}${m.sample ? ", free" : ", paid"})`);
    }
    const top = out.matches[0];
    const purchase = out.purchase;
    if (purchase?.checkout === "ready") {
      console.log(`\nLikely cause: ${purchase.diagnosisPreview?.likelyCause || "A stocked failure mode matches this signature."}`);
      if (purchase.compatibility?.technologies?.length) {
        console.log(`Compatibility: ${purchase.compatibility.technologies.join(", ")}`);
      }
      console.log(`Price: ${purchase.price?.usd || "$0.05"} ${purchase.price?.currency || "USD"}`);
      console.log("Next: connect KnownFix as MCP and call search_fixes with this error to receive the private signed USDC/ETH checkout and its single redemption action.");
      console.log("The signed paymentOffer is hidden in default output; use --json only in a private terminal or agent process.");
    } else if (out.topMatchTier === "free-sample") {
      console.log("\nThe complete free fix is included in the MCP search result.");
    }
    console.log(`\nMachine-readable store guide: ${REMOTE}/llms.txt`);
    return;
  }

  if (cmd === "bridge") {
    // Local stdio MCP server that forwards tool calls to the remote HTTP MCP.
    // Lets stdio-only clients use KnownFix. Requires @modelcontextprotocol/sdk.
    const { Server } = await import("@modelcontextprotocol/sdk/server/index.js");
    const { StdioServerTransport } = await import("@modelcontextprotocol/sdk/server/stdio.js");
    const { ListToolsRequestSchema, CallToolRequestSchema } = await import(
      "@modelcontextprotocol/sdk/types.js"
    );
    const server = new Server({ name: "knownfix-bridge", version: "0.4.0" }, { capabilities: { tools: {} } });
    server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: (await rpc("tools/list")).tools }));
    server.setRequestHandler(CallToolRequestSchema, async (req) =>
      rpc("tools/call", { name: req.params.name, arguments: req.params.arguments ?? {} })
    );
    await server.connect(new StdioServerTransport());
    console.error(`knownfix bridge -> ${MCP_URL}`);
    return;
  }

  console.log(`Unknown command: ${cmd}\n\n${INTRO}`);
}

main().catch((e) => {
  console.error("knownfix error:", e.message);
  process.exitCode = 1;
});
