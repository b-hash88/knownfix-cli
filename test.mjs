import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import http from "node:http";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);

test("search JSON exposes checkout only when explicitly requested", async () => {
  let observedQuery = "";
  const result = {
    matches: [{
      id: "npm-publish-2fa-403",
      match: 0.99,
      confidence: "verified-production",
      sample: false,
    }],
    purchase: {
      checkout: "ready",
      diagnosisPreview: { likelyCause: "npm authentication policy" },
      compatibility: { technologies: ["npm", "2fa"] },
      price: { usd: "$4.00", currency: "USD" },
      signedPurchaseOffer: { token: "private-test-token" },
      nextAction: { action: "pay-and-redeem" },
    },
  };
  const server = http.createServer((request, response) => {
    let body = "";
    request.setEncoding("utf8");
    request.on("data", (chunk) => body += chunk);
    request.on("end", () => {
      observedQuery = JSON.parse(body).params.arguments.query;
      response.setHeader("content-type", "application/json");
      response.end(JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        result: { content: [{ type: "text", text: JSON.stringify(result) }] },
      }));
    });
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  const env = { ...process.env, KNOWNFIX_URL: `http://127.0.0.1:${port}` };

  try {
    const machine = await execFileAsync(process.execPath, [
      "index.mjs",
      "search",
      "--json",
      "npm ERR! code EOTP",
    ], { env });
    assert.equal(observedQuery, "npm ERR! code EOTP");
    assert.equal(
      JSON.parse(machine.stdout).purchase.signedPurchaseOffer.token,
      "private-test-token",
    );

    const human = await execFileAsync(process.execPath, [
      "index.mjs",
      "search",
      "npm ERR! code EOTP",
    ], { env });
    assert.match(human.stdout, /Compatibility: npm, 2fa/);
    assert.match(human.stdout, /Price: \$4\.00 USD/);
    assert.match(human.stdout, /Next: connect KnownFix as MCP/);
    assert.equal(human.stdout.match(/^Next:/gm)?.length, 1);
    assert.doesNotMatch(human.stdout, /private-test-token|get_offer/);
  } finally {
    await new Promise((resolve, reject) =>
      server.close((error) => error ? reject(error) : resolve())
    );
  }
});
