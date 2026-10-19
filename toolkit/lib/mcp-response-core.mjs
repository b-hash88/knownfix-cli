const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
export const EXAMPLE = JSON.stringify({ jsonrpc: '2.0', id: 1, result: { tools: [] } }, null, 2);

// Only envelope structure is checked. Never return the user's payload or error text.
export function inspectResponse(text) {
  const errors = [], warnings = [];
  const result = { ok: false, kind: 'Not checked', errors, warnings };
  if (!text.trim()) { errors.push('Paste one JSON response.'); return result; }
  if (text.length > 200000) { errors.push('Response exceeds the 200,000-character limit.'); return result; }
  let value;
  try { value = JSON.parse(text); }
  catch { errors.push('Invalid JSON. Remove HTTP headers or SSE framing before checking.'); return result; }
  if (!object(value)) { errors.push('Expected one response object. Arrays, batches and streaming frames are outside this check.'); return result; }
  if (value.jsonrpc !== '2.0') errors.push('jsonrpc must be the string "2.0".');
  if (!Object.hasOwn(value, 'id') || !(value.id === null || typeof value.id === 'string' || (typeof value.id === 'number' && Number.isFinite(value.id)))) errors.push('A response id must be a string, number or null.');
  if (value.id === null) warnings.push('Null id can represent an unknown request id; correlate with the original request.');
  if (typeof value.id === 'number' && !Number.isSafeInteger(value.id)) warnings.push('Numeric id is fractional or outside the safe integer range; verify it against the original request.');
  const hasResult = Object.hasOwn(value, 'result'), hasError = Object.hasOwn(value, 'error');
  if (hasResult === hasError) errors.push('Include exactly one of result or error.');
  if (Object.hasOwn(value, 'method')) warnings.push('method is present. Confirm that this is a response, or a documented extension, rather than a request or notification.');
  if (hasError) {
    result.kind = 'JSON-RPC error response';
    if (!object(value.error) || !Number.isInteger(value.error.code) || typeof value.error.message !== 'string') errors.push('error must contain an integer code and a string message.');
  } else if (hasResult) {
    result.kind = object(value.result) && value.result.isError === true ? 'Tool-level error flag' : 'Result response';
    if (result.kind === 'Tool-level error flag') warnings.push('The result declares isError: true. An HTTP or JSON-RPC success can still contain a tool-level failure.');
  }
  warnings.push('Structure only: request-id matching, MCP method schemas, duplicate JSON keys, transport, authorization and tool outcomes are not verified.');
  result.ok = errors.length === 0;
  return result;
}

export function responseReceipt(result) {
  return ['KnownFix MCP Response Inspector', result.ok ? 'Envelope structure passed; live behavior not tested.' : 'Envelope needs attention.', result.kind,
    ...result.errors.map(s => '- ' + s), ...result.warnings.map(s => '- ' + s),
    'Input, identifiers, result bodies and error messages are omitted.'].join('\n');
}
