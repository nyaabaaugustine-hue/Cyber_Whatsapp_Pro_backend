// js/license.js
// Core license verification logic for Cyber WhatsApp Pro

const LICENSE_API_URL = "https://cyberwhatsapp-back.vercel.app/api/verify-license";
const STORAGE_KEY = "cwp_license";
const CHECK_ALARM = "cwp_license_recheck";

// ── Hardcoded owner keys — bypass server entirely ─────────────
const OWNER_KEYS = new Set([
  "5U6DE-SKO94-9127C-JRNBY",
  "FCUCS-6VM6S-UHD3B-EP7SB",
]);

// ── Helpers ───────────────────────────────────────────────────
async function getDeviceId() {
  const result = await chrome.storage.local.get("cwp_device_id");
  if (result.cwp_device_id) return result.cwp_device_id;
  const newId = crypto.randomUUID();
  await chrome.storage.local.set({ cwp_device_id: newId });
  return newId;
}

async function scheduleRecheck() {
  chrome.alarms.clear(CHECK_ALARM, () => {
    chrome.alarms.create(CHECK_ALARM, { periodInMinutes: 360 });
  });
}

// ── Public API ────────────────────────────────────────────────
export async function activateLicense(licenseKey) {
  if (!licenseKey || licenseKey.trim().length < 10) {
    return { success: false, error: "Please enter a valid activation key." };
  }

  const key = licenseKey.trim().toUpperCase();

  // Owner/test keys — activate instantly without hitting the server
  if (OWNER_KEYS.has(key)) {
    await chrome.storage.local.set({
      [STORAGE_KEY]: {
        key,
        plan:     "lifetime",
        expiry:   null,
        lifetime: true,
        verified: Date.now(),
        premium:  true,
      },
    });
    await scheduleRecheck();
    return { success: true, plan: "lifetime", expiry: null, lifetime: true };
  }

  // Normal keys — verify against server
  const deviceId = await getDeviceId();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    let response;
    try {
      response = await fetch(LICENSE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseKey: key, deviceId }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      return { success: false, error: `Server error (${response.status}). Please try again.` };
    }

    const data = await response.json();

    if (data.valid) {
      await chrome.storage.local.set({
        [STORAGE_KEY]: {
          key,
          plan:     data.plan,
          expiry:   data.expiry,
          lifetime: data.lifetime,
          verified: Date.now(),
          premium:  true,
        },
      });
      await scheduleRecheck();
      return { success: true, plan: data.plan, expiry: data.expiry, lifetime: data.lifetime };
    } else {
      return { success: false, error: data.error || "Invalid or expired key." };
    }
  } catch (err) {
    if (err.name === "AbortError") {
      return { success: false, error: "Request timed out. Please try again." };
    }
    return { success: false, error: "Server unreachable. Check your internet." };
  }
}

export async function getLicense() {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  return result[STORAGE_KEY] || null;
}

export async function isPremium() {
  const license = await getLicense();
  if (!license || !license.premium) return false;
  if (!license.lifetime && license.expiry) {
    if (new Date(license.expiry) < new Date()) {
      await revokeLicense();
      return false;
    }
  }
  return true;
}

export async function revokeLicense() {
  await chrome.storage.local.remove(STORAGE_KEY);
  chrome.alarms.clear(CHECK_ALARM);
}

export async function recheckLicense() {
  const license = await getLicense();
  if (!license?.key) return;

  // Never recheck owner keys against server
  if (OWNER_KEYS.has(license.key)) return;

  const deviceId = await getDeviceId();

  try {
    const response = await fetch(LICENSE_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ licenseKey: license.key, deviceId }),
    });

    if (!response.ok) return;

    const data = await response.json();

    if (!data.valid) {
      await revokeLicense();
    } else {
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
    // Silently fail — keep premium if server unreachable
  }
}
