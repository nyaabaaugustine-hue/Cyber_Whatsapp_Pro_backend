// js/license.js — CACHE BUST: 2026-05-13T21:00:00
const LICENSE_API_URL = "https://cyberwhatsapp-back.vercel.app/api/verify-license";
const STORAGE_KEY = "cwp_license";
const CHECK_ALARM = "cwp_license_recheck";

const OWNER_KEYS = new Set([
  "5U6DE-SKO94-9127C-JRNBY",
  "FCUCS-6VM6S-UHD3B-EP7SB",
]);

async function getDeviceId() {
  const result = await chrome.storage.local.get("cwp_device_id");
  if (result.cwp_device_id) return result.cwp_device_id;
  const newId = crypto.randomUUID();
  await chrome.storage.local.set({ cwp_device_id: newId });
  return newId;
}

export async function activateLicense(licenseKey) {
  const key = (licenseKey || "").trim().toUpperCase();
  if (!key || key.length < 10) return { success: false, error: "Please enter a valid activation key." };

  // OWNER KEYS — no server call at all
  if (OWNER_KEYS.has(key)) {
    await chrome.storage.local.set({
      [STORAGE_KEY]: { key, plan: "lifetime", expiry: null, lifetime: true, verified: Date.now(), premium: true }
    });
    chrome.alarms.clear(CHECK_ALARM, () => chrome.alarms.create(CHECK_ALARM, { periodInMinutes: 360 }));
    return { success: true, plan: "lifetime", expiry: null, lifetime: true };
  }

  // NORMAL KEYS — hit the server
  try {
    const deviceId = await getDeviceId();
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 20000);
    let res;
    try {
      res = await fetch(LICENSE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseKey: key, deviceId }),
        signal: ctrl.signal,
      });
    } finally { clearTimeout(t); }

    if (!res.ok) return { success: false, error: `Server error (${res.status}).` };
    const data = await res.json();
    if (data.valid) {
      await chrome.storage.local.set({
        [STORAGE_KEY]: { key, plan: data.plan, expiry: data.expiry, lifetime: data.lifetime, verified: Date.now(), premium: true }
      });
      chrome.alarms.clear(CHECK_ALARM, () => chrome.alarms.create(CHECK_ALARM, { periodInMinutes: 360 }));
      return { success: true, plan: data.plan, expiry: data.expiry, lifetime: data.lifetime };
    }
    return { success: false, error: data.error || "Invalid or expired key." };
  } catch (err) {
    if (err.name === "AbortError") return { success: false, error: "Request timed out. Try again." };
    return { success: false, error: "Server unreachable. Check your internet." };
  }
}

export async function getLicense() {
  const r = await chrome.storage.local.get(STORAGE_KEY);
  return r[STORAGE_KEY] || null;
}

export async function isPremium() {
  const lic = await getLicense();
  if (!lic || !lic.premium) return false;
  if (!lic.lifetime && lic.expiry && new Date(lic.expiry) < new Date()) {
    await revokeLicense(); return false;
  }
  return true;
}

export async function revokeLicense() {
  await chrome.storage.local.remove(STORAGE_KEY);
  chrome.alarms.clear(CHECK_ALARM);
}

export async function recheckLicense() {
  const lic = await getLicense();
  if (!lic?.key || OWNER_KEYS.has(lic.key)) return;
  try {
    const deviceId = await getDeviceId();
    const res = await fetch(LICENSE_API_URL, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ licenseKey: lic.key, deviceId }),
    });
    if (!res.ok) return;
    const data = await res.json();
    if (!data.valid) { await revokeLicense(); return; }
    await chrome.storage.local.set({ [STORAGE_KEY]: { ...lic, plan: data.plan, expiry: data.expiry, lifetime: data.lifetime, premium: true, verified: Date.now() } });
  } catch { /* keep existing status */ }
}
