export const MCP_ENDPOINT = 'https://knownfix-backend-28.b-hash88.deno.net/mcp';
export const CLI_VERSION = '0.3.17';
export function clientSetup(client, endpoint = MCP_ENDPOINT) {
  const json = value => JSON.stringify(value, null, 2);
  switch (client) {
    case 'claude': case 'claude-code': return { filename: 'Claude Code terminal command', extension: 'txt', text: `claude mcp add --transport http knownfix "${endpoint}"` };
    case 'codex': return { filename: '~/.codex/config.toml', extension: 'toml', text: `[mcp_servers.knownfix]\nurl = "${endpoint}"` };
    case 'cursor': return { filename: '.cursor/mcp.json', extension: 'json', text: json({ mcpServers: { knownfix: { url: endpoint } } }) };
    case 'vscode': return { filename: '.vscode/mcp.json', extension: 'json', text: json({ servers: { knownfix: { type: 'http', url: endpoint } } }) };
    case 'claude-desktop': return { filename: 'claude_desktop_config.json (local stdio bridge)', extension: 'json', text: json({ mcpServers: { knownfix: { command: 'npx', args: ['-y', `knownfix@${CLI_VERSION}`, 'bridge'] } } }) };
    default: return null;
  }
}

export function installationLinks(endpoint = MCP_ENDPOINT) {
  return {
    vscode: 'vscode:mcp/install?' + encodeURIComponent(JSON.stringify({ name: 'knownfix', type: 'http', url: endpoint })),
    cursor: 'https://cursor.com/link/mcp/install?name=knownfix&config=' + encodeURIComponent(btoa(JSON.stringify({ url: endpoint }))),
  };
}
