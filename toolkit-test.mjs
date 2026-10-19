import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import { clientSetup } from './lib/mcp-client-configs.mjs';

test('offline commands, configured client formats and owner-only books', () => {
  const run = (args, input) => spawnSync(process.execPath, ['index.mjs', ...args], { input, encoding: 'utf8', timeout: 5000, env: { ...process.env, KNOWNFIX_URL: 'http://127.0.0.1:1' } });
  const response = run(['inspect-response', '-'], '{"jsonrpc":"2.0","id":"PRIVATE-ID","result":{}}');
  assert.equal(response.status, 0);
  assert(!response.stdout.includes('PRIVATE-ID'));
  assert.equal(JSON.parse(response.stdout).ok, true);
  assert.equal(run(['inspect-response', '-'], 'PRIVATE-CANARY').status, 2);
  const retry = run(['retry-plan', 'toolkit/examples/retry.json']);
  assert.equal(retry.status, 0);
  assert.equal(JSON.parse(retry.stdout).durationMax, 215);
  assert.match(run(['books']).stdout, /owner-only/);
  for (const client of ['claude-code', 'claude-desktop', 'codex', 'cursor', 'vscode']) {
    const result = run(['config', client]);
    assert.equal(result.status, 0);
    assert(result.stdout.includes(clientSetup(client, 'http://127.0.0.1:1/mcp').text));
  }
  const dirs = fs.readdirSync('skills');
  assert.equal(dirs.length, 6);
  for (const dir of dirs) assert(fs.readFileSync(`skills/${dir}/SKILL.md`, 'utf8').includes(`name: ${dir}`));
});
