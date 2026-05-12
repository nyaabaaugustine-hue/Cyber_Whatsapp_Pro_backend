import crypto from 'crypto'

/**
 * Generate a license key.
 * Format: XXXXX-XXXXX-XXXXX-XXXXX  (4 segments × 5 alphanumeric chars)
 * The `plan` parameter is accepted for compatibility but does not change format.
 */
export function generateLicenseKey(plan = 'premium') {
  const segmentLength = 5
  const segments = 4
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

  return Array.from({ length: segments }, () =>
    Array.from({ length: segmentLength }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join('')
  ).join('-')
}

export function hashKey(key) {
  return crypto.createHash('sha256').update(key).digest('hex')
}

/**
 * Valid format: XXXXX-XXXXX-XXXXX-XXXXX
 * Exactly 4 groups of 5 uppercase alphanumeric chars separated by hyphens.
 */
export function isValidKeyFormat(key) {
  return /^[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}$/.test(key)
}
