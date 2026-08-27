#!/usr/bin/env node
// knownfix — connect any AI agent to the KnownFix store.
//
//   npx knownfix               what this is + how to connect
//   npx knownfix config <c>    print MCP config for a client
//   npx knownfix bridge        run a local stdio MCP server that proxies to
//                              the remote KnownFix MCP (for stdio-only clients)
//   npx knownfix search "err"  quick free error match from the terminal
//   npx knownfix books         print the live request-to-sale funnel
//
// The store's customers are AI agents. This package is the on-ramp.

const REMOTE = process.env.KNOWNFIX_URL || "https://knownfix-backend-28.b-hash88.deno.net";
const MCP_URL = `${REMOTE}/mcp`;

const [cmd, ...rest] = process.argv.slice(2);

const INTRO = `KnownFix — cataloged fixes for real errors, sold per-lookup to AI agents.
Free to search; 36 fixes (33 verified in production, 3 documented), with 11 free
in full. Paid fixes cost $0.05 USDC or signed exact ETH on Base mainnet. Search
returns a diagnosis preview and purchase-ready offers. No buyer account or API key.

Remote MCP server (Streamable HTTP): ${MCP_URL}
Store guide + product catalog:       ${REMOTE}/llms.txt

Commands:
  npx knownfix config <client>   MCP config snippet (claude | cursor | codex | vscode | langchain | crewai | raw)
  npx knownfix bridge            local stdio MCP server proxying to the remote (for stdio-only clients)
  npx knownfix search "<error>"  free error match from the terminal
  npx knownfix tools             list the remote MCP tools
  npx knownfix books             print the live request-to-sale funnel`;

const CONFIGS = {
  claude: `# Claude Desktop / Claude Code — remote MCP (claude_desktop_config.json):
{
  "mcpServers": {
    "knownfix": { "url": "${MCP_URL}", "transport": "http" }
  }
}
# Or, for stdio-only builds, bridge it:
{
  "mcpServers": {
    "knownfix": { "command": "npx", "args": ["-y", "knownfix", "bridge"] }
  }
}`,
  cursor: `# Cursor (.cursor/mcp.json):
{
  "mcpServers": {
    "knownfix": { "url": "${MCP_URL}" }
  }
}`,
  codex: `# OpenAI Codex / codex config — stdio bridge:
{
  "mcpServers": {
    "knownfix": { "command": "npx", "args": ["-y", "knownfix", "bridge"] }
  }
}`,
  vscode: `# VS Code (.vscode/mcp.json):
{
  "servers": {
    "knownfix": { "type": "http", "url": "${MCP_URL}" }
  }
}`,
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

  if (cmd === "config") {
    const client = (rest[0] || "").toLowerCase();
    if (!CONFIGS[client]) {
      console.log(`Usage: npx knownfix config <${Object.keys(CONFIGS).join(" | ")}>`);
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
    const response = await fetch(`${REMOTE}/books?format=json`, { headers: { accept: "application/json" } });
    if (!response.ok) throw new Error(`books returned HTTP ${response.status}`);
    const books = await response.json();
    console.log(`KnownFix open books — ${books.generatedAt || "timestamp unavailable"}\n`);
    for (const stage of books.conversionFunnel || []) {
      console.log(`  ${String(stage.value).padStart(8)}  ${stage.label} — ${stage.note}`);
    }
    console.log(`\n${books.nextExperiment || books.mcpFunnel?.interpretation || ""}`);
    return;
  }

  if (cmd === "search") {
    const q = rest.join(" ");
    if (!q) return void console.log('Usage: npx knownfix search "<your error text>"');
    const res = await rpc("tools/call", { name: "search_fixes", arguments: { query: q } });
    const out = JSON.parse(res.content[0].text);
    if (!out.matches.length) return void console.log("No match — honest miss. This store does not stock your error.");
    console.log(`Top matches for: ${q}\n`);
    for (const m of out.matches) {
      console.log(`  ${m.id}  (${m.match ?? m.score}, ${m.confidence}${m.sample ? ", free" : ", paid"})`);
    }
    const top = out.matches[0];
    const purchase = out.purchase;
    if (purchase?.checkout === "ready") {
      console.log(`\nLikely cause: ${purchase.diagnosisPreview?.likelyCause || "A stocked failure mode matches this signature."}`);
      console.log(`Price: ${purchase.price?.usd || "$0.05"} ${purchase.price?.currency || "USD"}`);
      console.log(`Next: ${purchase.nextAction?.instruction || "Pay the signed offer, then redeem with get_fix."}`);
      console.log("The signed paymentOffer is intentionally not printed by this CLI.");
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
    const server = new Server({ name: "knownfix-bridge", version: "0.3.0" }, { capabilities: { tools: {} } });
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
