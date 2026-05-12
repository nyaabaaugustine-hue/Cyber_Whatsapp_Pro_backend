// js/proinjt.js (updated section — add to top of your existing proinjt.js)
// Premium feature gate — checks license before enabling premium tools

/**
 * Call this at the top of any premium feature in proinjt.js
 * Returns true if premium is active, false otherwise.
 *
 * Usage inside proinjt.js:
 *   if (!(await isPremiumActive())) return showUpgradePrompt();
 */
async function isPremiumActive() {
  return new Promise((resolve) => {
    chrome.storage.local.get("cwp_license", (result) => {
      const license = result.cwp_license;
      if (!license || license.premium !== true) {
        resolve(false);
        return;
      }
      // Check expiry locally
      if (!license.lifetime && license.expiry) {
        if (new Date(license.expiry) < new Date()) {
          chrome.storage.local.remove("cwp_license");
          resolve(false);
          return;
        }
      }
      resolve(true);
    });
  });
}

/**
 * Shows an in-page toast nudging the user to upgrade.
 */
function showUpgradePrompt() {
  const existing = document.getElementById("cwp-upgrade-toast");
  if (existing) return;

  const toast = document.createElement("div");
  toast.id = "cwp-upgrade-toast";
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: #111720;
    color: #e0eaf5;
    border: 1px solid rgba(0,230,118,0.3);
    border-radius: 10px;
    padding: 14px 18px;
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 600;
    z-index: 99999;
    box-shadow: 0 4px 24px rgba(0,230,118,0.15);
    max-width: 280px;
    line-height: 1.5;
  `;
  toast.innerHTML = `
    🔒 <strong>Premium Feature</strong><br/>
    <span style="font-size:12px;color:#5a7090;">Activate your key in the extension popup to unlock this feature.</span>
  `;

  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// ── Example usage in premium features ────────────────────────
// (Add similar guards to each premium function in your existing proinjt.js)

async function startBulkMessaging(contacts, message) {
  if (!(await isPremiumActive())) {
    showUpgradePrompt();
    return;
  }
  // ... your existing bulk messaging code ...
}

async function enableAutoReply(trigger, response) {
  if (!(await isPremiumActive())) {
    showUpgradePrompt();
    return;
  }
  // ... your existing auto-reply code ...
}
