// src/lib/keyGenerator.js
// Generates professional CWP license keys

const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars (0/O, 1/I)

/**
 * Generates a random segment of given length from CHARS
 */
function randomSegment(length) {
  let seg = "";
  for (let i = 0; i < length; i++) {
    seg += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return seg;
}

/**
 * Generates a license key in format: CWP-{PLAN}-{YEAR}-{RANDOM}
 * Examples:
 *   CWP-PRO-2026-X8A91
 *   CWP-PREM-2026-L9A21M
 *   CWP-LIFE-2026-AB3K9
 */
export function generateLicenseKey(plan = "PRO") {
  const planCode =
    plan.toUpperCase() === "LIFETIME"
      ? "LIFE"
      : plan.toUpperCase() === "PREMIUM"
      ? "PREM"
      : "PRO";

  const year = new Date().getFullYear();
  const suffix = randomSegment(5) + randomSegment(1); // e.g. X8A91M → 6 chars
  return `CWP-${planCode}-${year}-${suffix}`;
}

/**
 * Validates key format without hitting the DB
 */
export function isValidKeyFormat(key) {
  return /^CWP-(PRO|PREM|LIFE)-\d{4}-[A-Z0-9]{5,8}$/.test(key);
}
