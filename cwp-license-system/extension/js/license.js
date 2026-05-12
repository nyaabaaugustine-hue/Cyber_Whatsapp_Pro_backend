// js/license.js
// Core license verification logic for Cyber WhatsApp Pro
// Handles storage, API calls, and premium status checks

const LICENSE_API_URL = "https://cyber-whatsapp-pro-backend.vercel.app/api/verify-license";

// Keys used in chrome.storage.local
const STORAGE_KEY  = "cwp_license";
const CHECK_ALARM  = "cwp_license_recheck";

// ── Public API ───────────────────────────────────────────────

/**
 * Verify a license key against the backend API.
 * Saves result to chrome.storage.local on success.
 * @returns {{ success: boolean, plan?: string, expiry?: string, error?: string }}
 */
export async function activateLicense(licenseKey) {
  if (!licenseKey || licenseKey.trim().length < 10) {
    return { success: false, error: "Please enter a valid activation key." };
  }

  try {
    const response = await fetch(LICENSE_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ licenseKey: licenseKey.trim().toUpperCase() }),
    });

    if (!response.ok) {
      return { success: false, error: "Server unreachable. Check your internet." };
    }

    const data = await response.json();

    if (data.valid) {
      // Persist license locally
      await chrome.storage.local.set({
        [STORAGE_KEY]: {
          key:      licenseKey.trim().toUpperCase(),
          plan:     data.plan,
          expiry:   data.expiry,
          lifetime: data.lifetime,
          verified: Date.now(),
          premium:  true,
        },
      });

      // Schedule periodic re-checks
      await scheduleRecheck();

      return { success: true, plan: data.plan, expiry: data.expiry, lifetime: data.lifetime };
    } else {
      return { success: false, error: data.error || "Invalid or expired key." };
    }
  } catch (err) {
    console.error("[CWP License] Network error:", err);
    return { success: false, error: "Could not connect to license server." };
  }
}

/**
 * Returns the stored license object, or null if not activated.
 */
export async function getLicense() {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  return result[STORAGE_KEY] || null;
}

/**
 * Returns true only if a valid, non-expired premium license is stored.
 */
export async function isPremium() {
  const license = await getLicense();
  if (!license || !license.premium) return false;

  // Check local expiry (server re-validates periodically)
  if (!license.lifetime && license.expiry) {
    const expiryDate = new Date(license.expiry);
    if (expiryDate < new Date()) {
      await revokeLicense();
      return false;
    }
  }

  return true;
}

/**
 * Clears license from local storage (logout / deactivate).
 */
export async function revokeLicense() {
  await chrome.storage.local.remove(STORAGE_KEY);
  await chrome.alarms.clear(CHECK_ALARM);
}

/**
 * Re-verifies the stored key against the server.
 * Called by background service worker alarm.
 */
export async function recheckLicense() {
  const license = await getLicense();
  if (!license?.key) return; // Nothing to recheck

  try {
    const response = await fetch(LICENSE_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ licenseKey: license.key }),
    });

    if (!response.ok) return; // Network issue — keep existing status

    const data = await response.json();

    if (!data.valid) {
      await revokeLicense(); // Server says invalid — revoke locally
    } else {
      // Refresh stored data
      await chrome.storage.local.set({
        [STORAGE_KEY]: {
          ...license,
          plan:     data.plan,
          expiry:   data.expiry,
          lifetime: data.lifetime,
          premium:  true,
          verified: Date.now(),
        },
      });
    }
  } catch {
    // Silently fail — keep existing premium status if server unreachable
  }
}

// ── Internal helpers ─────────────────────────────────────────

async function scheduleRecheck() {
  await chrome.alarms.clear(CHECK_ALARM);
  // Re-check every 6 hours
  chrome.alarms.create(CHECK_ALARM, { periodInMinutes: 360 });
}
