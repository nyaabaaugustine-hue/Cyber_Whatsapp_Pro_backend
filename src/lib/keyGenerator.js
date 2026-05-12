import crypto from 'crypto'

export function generateLicenseKey(plan = "PREM") {
  const segments = 4
  const segmentLength = 5
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

  const prefix = plan.toUpperCase().substring(0, 4);
  const key = Array.from({ length: segments - 1 }, () =>
    Array.from({ length: segmentLength }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join('')
  ).join('-')
  return `${prefix}-${key}`;
}

export function hashKey(key) {
  return crypto.createHash('sha256').update(key).digest('hex')
}

export function isValidKeyFormat(key) {
  // Allows prefixes of 3-5 chars, followed by segments of 4-5 chars
  return /^[A-Z0-9]{3,5}(-[A-Z0-9]{4,5}){2,4}$/.test(key)
}
