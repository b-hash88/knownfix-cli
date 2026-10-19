#!/usr/bin/env node
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { inspectResponse } from './lib/mcp-response-core.mjs';
import { planRetries } from './lib/retry-planner-core.mjs';

const MAX_BYTES = 200000;
const fields = ['attempts', 'initialDelay', 'multiplier', 'maxDelay', 'timeout', 'budget', 'jitter'];
const failure = (code, message, exitCode) => ({ value: { ok: false, error: { code, message } }, exitCode });

async function readInput(file) {
  if (file !== '-' && !(await stat(file)).isFile()) throw new Error('READ');
  const stream = file === '-' ? process.stdin : createReadStream(file);
  let bytes = 0;
  const chunks = [];
  for await (const chunk of stream) {
    bytes += chunk.length;
    if (bytes > MAX_BYTES) throw new Error('LIMIT');
    chunks.push(chunk);
  }
  return new TextDecoder('utf-8', { fatal: true }).decode(Buffer.concat(chunks));
}

// These commands import only local modules and never execute input or make requests.
export async function runLocal(args) {
  const [command, file, ...extra] = args;
  if (!['inspect-response', 'retry-plan'].includes(command) || !file || extra.length) {
    return failure('USAGE', 'Use inspect-response FILE|- or retry-plan FILE|- (UTF-8 JSON, at most 200,000 bytes).', 2);
  }
  let text;
  try { text = await readInput(file); }
  catch (error) {
    return error.message === 'LIMIT'
      ? failure('INPUT_TOO_LARGE', 'Input exceeds 200,000 bytes.', 2)
      : failure('INPUT_UNREADABLE', 'Expected a readable regular UTF-8 file or piped stdin. Input and path omitted.', 1);
  }
  if (command === 'inspect-response') {
    const value = inspectResponse(text);
    return { value, exitCode: value.ok ? 0 : 2 };
  }
  let input;
  try { input = JSON.parse(text); }
  catch { return failure('INVALID_JSON', 'Expected one JSON retry configuration.', 2); }
  if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).some(key => !fields.includes(key))) {
    return failure('INVALID_CONFIG', 'Use only attempts, initialDelay, multiplier, maxDelay, timeout, budget and jitter.', 2);
  }
  try {
    return { value: { ok: true, ...planRetries(input), limitation: 'Serial unsuccessful attempts; no queue/network overhead, Retry-After or provider policy. No webhook is sent.' }, exitCode: 0 };
  } catch (error) {
    // planRetries only emits fixed field-validation messages, never input values.
    return failure('INVALID_CONFIG', error.message, 2);
  }
}

export async function main(args = process.argv.slice(2)) {
  const { value, exitCode } = await runLocal(args);
  process.stdout.write(JSON.stringify(value, null, 2) + '\n');
  process.exitCode = exitCode;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
