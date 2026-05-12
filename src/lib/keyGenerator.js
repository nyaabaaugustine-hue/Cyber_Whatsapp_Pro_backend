import crypto from 'crypto'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

/**
 * Generates a license key in strict XXXXX-XXXXX-XXXXX-XXXXX format.
 * All four segments are exactly 5 alphanumeric characters (uppercase).
 * Example: AB12C-XY34Z-MN56P-QR78S
 */
export function generateLicenseKey() {
  const segments = Array.from({ length: 4 }, () =>
    Array.from({ length: 5 }, () =>
      CHARS[Math.floor(Math.random() * CHARS.length)]
    ).join('')
  )
  return segments.join('-')
}

export function hashKey(key) {
  return crypto.createHash('sha256').update(key).digest('hex')
}

/**
 * Validates key format — strictly 5-5-5-5 alphanumeric uppercase.
 * Matches what the Chrome extension popup formatter produces.
 */
export function isValidKeyFormat(key) {
  return /^[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}$/.test(key)
}
