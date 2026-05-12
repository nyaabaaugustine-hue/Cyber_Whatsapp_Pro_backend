import crypto from 'crypto'

export function generateLicenseKey() {
  const segments = 4
  const segmentLength = 5
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

export function isValidKeyFormat(key) {
  return /^[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}$/.test(key)
}
