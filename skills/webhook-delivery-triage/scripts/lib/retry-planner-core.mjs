const fields = {
  attempts: [1, 20, true, 'Attempts'],
  initialDelay: [0, 86400, false, 'Initial delay'],
  multiplier: [1, 10, false, 'Multiplier'],
  maxDelay: [0, 86400, false, 'Delay cap'],
  timeout: [0.1, 3600, false, 'Attempt timeout'],
  budget: [1, 604800, false, 'Time budget'],
};

export const DEFAULT_PLAN = Object.freeze({ attempts: 6, initialDelay: 5, multiplier: 2, maxDelay: 300, timeout: 10, budget: 600, jitter: 'full' });

export function planRetries(input) {
  const config = {};
  for (const [key, [min, max, integer, label]] of Object.entries(fields)) {
    const raw = input?.[key];
    const number = typeof raw === 'number' ? raw : typeof raw === 'string' && raw.trim() ? Number(raw) : NaN;
    if (!Number.isFinite(number) || number < min || number > max || (integer && !Number.isInteger(number))) {
      throw new Error(`${label} must be ${integer ? 'a whole number' : 'a number'} from ${min} to ${max}.`);
    }
    config[key] = number;
  }
  if (!['none', 'full'].includes(input.jitter)) throw new Error('Choose no jitter or full jitter.');
  config.jitter = input.jitter;
  const rows = [];
  let earliest = 0, expected = 0, latest = 0;
  for (let attempt = 1; attempt <= config.attempts; attempt++) {
    const delayMax = attempt === 1 ? 0 : Math.min(config.maxDelay, config.initialDelay * config.multiplier ** (attempt - 2));
    const delayMin = config.jitter === 'full' ? 0 : delayMax;
    const delayExpected = (delayMin + delayMax) / 2;
    if (attempt > 1) {
      earliest += config.timeout + delayMin;
      expected += config.timeout + delayExpected;
      latest += config.timeout + delayMax;
    }
    const finishLatest = latest + config.timeout;
    // Allow only accumulated floating-point rounding error at an exact budget boundary.
    const tolerance = Number.EPSILON * 4 * attempt * Math.max(1, finishLatest, config.budget);
    rows.push({ attempt, delayMin, delayMax, startEarliest: earliest, startExpected: expected, startLatest: latest,
      finishLatest, fitsBudget: finishLatest - config.budget <= tolerance });
  }
  return { config, rows, durationMin: earliest + config.timeout, durationExpected: expected + config.timeout,
    durationMax: latest + config.timeout, attemptsWithinBudget: rows.filter(row => row.fitsBudget).length };
}

export function planChecklist(plan) {
  const { config: c } = plan;
  return [
    '# KnownFix webhook retry plan',
    `Attempts: ${c.attempts} total, including the initial attempt.`,
    `Delay: min(${c.maxDelay}, ${c.initialDelay} * ${c.multiplier}^(retry - 1)) seconds.`,
    `Jitter: ${c.jitter === 'full' ? 'uniform from zero to the capped delay' : 'none'}.`,
    `Attempt timeout: ${c.timeout} seconds. Budget: ${c.budget} seconds.`,
    `Maximum modeled duration: ${plan.durationMax} seconds.`,
    `Attempts guaranteed to finish within this modeled budget: ${plan.attemptsWithinBudget}.`,
    '',
    'Assumes serial attempts, all unsuccessful, each consuming its full timeout; waits begin after failure.',
    'No queue latency, network overhead, Retry-After, provider policy or actual execution is modeled.',
    '',
    '- [ ] Confirm the provider retry policy and retryable outcomes.',
    '- [ ] Check duplicate handling before repeating a business effect.',
    '- [ ] Agree a delivery deadline and a terminal failure/recovery path.',
    '- [ ] Verify timing and failure cases with synthetic events in an authorized test environment.',
  ].join('\n');
}
