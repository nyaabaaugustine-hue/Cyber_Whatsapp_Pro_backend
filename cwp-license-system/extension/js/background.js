// js/background.js
// Manifest V3 Service Worker for Cyber WhatsApp Pro
// Handles periodic license re-validation

import { recheckLicense } from "./license.js";

// Listen for alarms (periodic license re-check)
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "cwp_license_recheck") {
    recheckLicense();
  }
});

// On install / startup — restore alarm if license exists
chrome.runtime.onInstalled.addListener(async () => {
  const result = await chrome.storage.local.get("cwp_license");
  if (result.cwp_license?.premium) {
    chrome.alarms.create("cwp_license_recheck", { periodInMinutes: 360 });
  }
});

chrome.runtime.onStartup.addListener(async () => {
  const result = await chrome.storage.local.get("cwp_license");
  if (result.cwp_license?.premium) {
    chrome.alarms.create("cwp_license_recheck", { periodInMinutes: 360 });
  }
});
