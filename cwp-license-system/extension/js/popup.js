// js/popup.js
// Popup controller for Cyber WhatsApp Pro activation UI

import { activateLicense, getLicense, isPremium, revokeLicense } from "./license.js";

// ── DOM refs ─────────────────────────────────────────────────
const planBadge        = document.getElementById("planBadge");
const statusCard       = document.getElementById("statusCard");
const statusIcon       = document.getElementById("statusIcon");
const statusPlan       = document.getElementById("statusPlan");
const statusDetail     = document.getElementById("statusDetail");
const activationSection = document.getElementById("activationSection");
const premiumSection   = document.getElementById("premiumSection");
const licenseInput     = document.getElementById("licenseInput");
const activateBtn      = document.getElementById("activateBtn");
const messageBox       = document.getElementById("messageBox");
const deactivateBtn    = document.getElementById("deactivateBtn");

// ── Init ──────────────────────────────────────────────────────
async function init() {
  const license = await getLicense();
  const premium = await isPremium();

  if (premium && license) {
    renderPremium(license);
  } else {
    renderFree();
  }
}

// ── Render States ─────────────────────────────────────────────
function renderFree() {
  planBadge.textContent = "FREE";
  planBadge.classList.remove("premium");

  statusCard.classList.remove("active");
  statusIcon.textContent = "🔒";
  statusPlan.textContent = "Free Plan";
  statusPlan.classList.remove("premium");
  statusDetail.textContent = "Enter your key to unlock premium";

  activationSection.classList.remove("hidden");
  premiumSection.classList.add("hidden");
}

function renderPremium(license) {
  const planLabel = license.plan === "lifetime" ? "LIFETIME" : "PREMIUM";
  planBadge.textContent = planLabel;
  planBadge.classList.add("premium");

  statusCard.classList.add("active");
  statusIcon.textContent = "✅";
  statusPlan.textContent = planLabel + " Plan";
  statusPlan.classList.add("premium");

  if (license.lifetime) {
    statusDetail.textContent = "🔓 Lifetime access — never expires";
  } else if (license.expiry) {
    statusDetail.textContent = `🗓 Expires: ${license.expiry}`;
  } else {
    statusDetail.textContent = "Premium features unlocked";
  }

  activationSection.classList.add("hidden");
  premiumSection.classList.remove("hidden");
}

// ── Activate ──────────────────────────────────────────────────
activateBtn.addEventListener("click", async () => {
  const key = licenseInput.value.trim().toUpperCase();

  if (!key) {
    showMessage("Please enter your activation key.", "error");
    licenseInput.focus();
    return;
  }

  setLoading(true);
  clearMessage();

  const result = await activateLicense(key);

  setLoading(false);

  if (result.success) {
    showMessage("✅ License activated! Premium features unlocked.", "success");
    setTimeout(async () => {
      const license = await getLicense();
      renderPremium(license);
    }, 1200);
  } else {
    showMessage("❌ " + result.error, "error");
  }
});

// Auto-format input as CWP-XXX-XXXX-XXXXX
licenseInput.addEventListener("input", (e) => {
  let val = e.target.value.replace(/[^A-Za-z0-9-]/g, "").toUpperCase();
  e.target.value = val;
  clearMessage();
});

// ── Deactivate ────────────────────────────────────────────────
deactivateBtn.addEventListener("click", async () => {
  if (!confirm("Are you sure you want to deactivate your license?")) return;
  await revokeLicense();
  renderFree();
});

// ── Helpers ───────────────────────────────────────────────────
function setLoading(loading) {
  activateBtn.disabled = loading;
  activateBtn.classList.toggle("loading", loading);
  const btnText = activateBtn.querySelector(".btn-text");
  btnText.textContent = loading ? "Verifying..." : "Activate Premium";
}

function showMessage(text, type) {
  messageBox.textContent = text;
  messageBox.className = `message-box show ${type}`;
}

function clearMessage() {
  messageBox.textContent = "";
  messageBox.className = "message-box";
}

// ── Start ─────────────────────────────────────────────────────
init();
