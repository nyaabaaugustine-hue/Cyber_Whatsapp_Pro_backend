"use client";
import { useState, useEffect, useCallback } from "react";

const PIN = "211594a";
const TOKEN = process.env.NEXT_PUBLIC_ADMIN_TOKEN || "cwp-admin-2024";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Syne:wght@700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:       #0a0a0f;
    --surface:  #111118;
    --card:     #16161f;
    --border:   #2a2a3a;
    --accent:   #00e5a0;
    --accent2:  #7c6bff;
    --danger:   #ff4757;
    --warn:     #ffa502;
    --text:     #e8e8f0;
    --muted:    #6b6b80;
    --success:  #00e5a0;
  }

  html, body { height: 100%; background: var(--bg); color: var(--text); font-family: 'JetBrains Mono', monospace; }

  /* ── PIN SCREEN ── */
  .pin-screen {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg);
    position: relative;
    overflow: hidden;
  }
  .pin-screen::before {
    content: '';
    position: absolute;
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(0,229,160,0.07) 0%, transparent 70%);
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }
  .pin-box {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 48px 40px;
    width: 360px;
    text-align: center;
    position: relative;
    z-index: 1;
  }
  .pin-logo {
    font-family: 'Syne', sans-serif;
    font-size: 22px;
    font-weight: 800;
    color: var(--accent);
    letter-spacing: -0.5px;
    margin-bottom: 6px;
  }
  .pin-sub { font-size: 11px; color: var(--muted); margin-bottom: 32px; letter-spacing: 2px; text-transform: uppercase; }
  .pin-label { font-size: 11px; color: var(--muted); text-align: left; margin-bottom: 8px; letter-spacing: 1px; text-transform: uppercase; }
  .pin-input {
    width: 100%;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text);
    font-family: 'JetBrains Mono', monospace;
    font-size: 18px;
    padding: 14px 16px;
    letter-spacing: 6px;
    text-align: center;
    outline: none;
    transition: border-color 0.2s;
    margin-bottom: 16px;
  }
  .pin-input:focus { border-color: var(--accent); }
  .pin-input.error { border-color: var(--danger); animation: shake 0.3s ease; }
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    25% { transform: translateX(-6px); }
    75% { transform: translateX(6px); }
  }
  .pin-btn {
    width: 100%;
    background: var(--accent);
    color: #0a0a0f;
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 2px;
    text-transform: uppercase;
    border: none;
    border-radius: 8px;
    padding: 14px;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.1s;
  }
  .pin-btn:hover { opacity: 0.9; transform: translateY(-1px); }
  .pin-error { color: var(--danger); font-size: 12px; margin-top: 10px; }

  /* ── DASHBOARD ── */
  .dash { min-height: 100vh; display: flex; flex-direction: column; }

  .topbar {
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    padding: 0 32px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .topbar-brand {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 18px;
    color: var(--accent);
  }
  .topbar-brand span { color: var(--text); }
  .topbar-right { display: flex; align-items: center; gap: 16px; }
  .topbar-stat { font-size: 11px; color: var(--muted); }
  .topbar-stat b { color: var(--accent); }
  .logout-btn {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--muted);
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    padding: 6px 12px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .logout-btn:hover { border-color: var(--danger); color: var(--danger); }

  .main { flex: 1; padding: 32px; max-width: 1400px; margin: 0 auto; width: 100%; }

  /* ── STATS ROW ── */
  .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
  .stat-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 20px 24px;
    position: relative;
    overflow: hidden;
  }
  .stat-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
  }
  .stat-card.green::before { background: var(--accent); }
  .stat-card.purple::before { background: var(--accent2); }
  .stat-card.red::before { background: var(--danger); }
  .stat-card.yellow::before { background: var(--warn); }
  .stat-label { font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px; }
  .stat-value { font-family: 'Syne', sans-serif; font-size: 32px; font-weight: 800; color: var(--text); }
  .stat-value.green { color: var(--accent); }
  .stat-value.purple { color: var(--accent2); }
  .stat-value.red { color: var(--danger); }

  /* ── PANELS ── */
  .panels { display: grid; grid-template-columns: 380px 1fr; gap: 24px; }

  .panel {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
  }
  .panel-header {
    padding: 18px 24px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .panel-title { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; color: var(--text); }
  .panel-body { padding: 24px; }

  /* ── GENERATE FORM ── */
  .form-group { margin-bottom: 18px; }
  .form-label { font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px; display: block; }
  .form-input, .form-select {
    width: 100%;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text);
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    padding: 10px 14px;
    outline: none;
    transition: border-color 0.2s;
  }
  .form-input:focus, .form-select:focus { border-color: var(--accent); }
  .form-select option { background: var(--card); }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

  .gen-btn {
    width: 100%;
    background: var(--accent);
    color: #0a0a0f;
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    font-size: 12px;
    letter-spacing: 2px;
    text-transform: uppercase;
    border: none;
    border-radius: 8px;
    padding: 13px;
    cursor: pointer;
    transition: opacity 0.2s;
    margin-top: 8px;
  }
  .gen-btn:hover { opacity: 0.85; }
  .gen-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  /* ── GENERATED KEYS PREVIEW ── */
  .generated-keys {
    margin-top: 20px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 14px;
    max-height: 220px;
    overflow-y: auto;
  }
  .generated-key-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 0;
    border-bottom: 1px solid var(--border);
    font-size: 12px;
  }
  .generated-key-item:last-child { border-bottom: none; }
  .key-text { color: var(--accent); font-weight: 600; letter-spacing: 1px; }
  .copy-btn {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--muted);
    font-size: 10px;
    padding: 3px 8px;
    border-radius: 4px;
    cursor: pointer;
    font-family: 'JetBrains Mono', monospace;
    transition: all 0.15s;
  }
  .copy-btn:hover { border-color: var(--accent); color: var(--accent); }
  .copy-btn.copied { border-color: var(--accent); color: var(--accent); }

  /* ── KEYS TABLE ── */
  .table-toolbar {
    padding: 16px 24px;
    border-bottom: 1px solid var(--border);
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
  }
  .search-input {
    flex: 1;
    min-width: 200px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text);
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    padding: 8px 12px;
    outline: none;
    transition: border-color 0.2s;
  }
  .search-input:focus { border-color: var(--accent); }
  .filter-select {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text);
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    padding: 8px 12px;
    outline: none;
    cursor: pointer;
  }
  .refresh-btn {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--muted);
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    padding: 8px 14px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .refresh-btn:hover { border-color: var(--accent); color: var(--accent); }

  .table-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  thead tr { border-bottom: 1px solid var(--border); }
  th {
    text-align: left;
    padding: 12px 16px;
    font-size: 10px;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 1.5px;
    font-weight: 600;
    white-space: nowrap;
  }
  td { padding: 12px 16px; border-bottom: 1px solid rgba(42,42,58,0.5); vertical-align: middle; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: rgba(255,255,255,0.02); }

  .key-cell { color: var(--accent); font-weight: 600; letter-spacing: 1px; font-size: 11px; }
  .plan-badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  .plan-badge.lifetime { background: rgba(124,107,255,0.15); color: var(--accent2); }
  .plan-badge.premium  { background: rgba(0,229,160,0.12); color: var(--accent); }
  .plan-badge.pro      { background: rgba(255,165,2,0.12); color: var(--warn); }

  .status-dot {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
  }
  .status-dot::before {
    content: '';
    width: 6px; height: 6px;
    border-radius: 50%;
  }
  .status-dot.active::before { background: var(--accent); box-shadow: 0 0 6px var(--accent); }
  .status-dot.inactive::before { background: var(--muted); }

  .action-btn {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--muted);
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.15s;
    margin-right: 4px;
  }
  .action-btn:hover { border-color: var(--accent); color: var(--accent); }
  .action-btn.danger:hover { border-color: var(--danger); color: var(--danger); }
  .action-btn.warn:hover { border-color: var(--warn); color: var(--warn); }

  .empty-state {
    text-align: center;
    padding: 60px 24px;
    color: var(--muted);
    font-size: 13px;
  }

  .loading-row td { text-align: center; color: var(--muted); padding: 40px; }

  /* ── TOAST ── */
  .toast-container {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .toast {
    background: var(--card);
    border: 1px solid var(--border);
    border-left: 3px solid var(--accent);
    border-radius: 8px;
    padding: 12px 18px;
    font-size: 12px;
    color: var(--text);
    animation: slideIn 0.2s ease;
    max-width: 320px;
  }
  .toast.error { border-left-color: var(--danger); }
  @keyframes slideIn {
    from { transform: translateX(40px); opacity: 0; }
    to   { transform: translateX(0); opacity: 1; }
  }

  /* ── MODAL ── */
  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.7);
    display: flex; align-items: center; justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(4px);
  }
  .modal {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 32px;
    width: 440px;
    max-width: 90vw;
  }
  .modal-title {
    font-family: 'Syne', sans-serif;
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 20px;
    color: var(--text);
  }
  .modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 24px; }
  .btn-cancel {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--muted);
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    padding: 9px 18px;
    border-radius: 8px;
    cursor: pointer;
  }
  .btn-confirm {
    background: var(--danger);
    border: none;
    color: #fff;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    font-weight: 700;
    padding: 9px 18px;
    border-radius: 8px;
    cursor: pointer;
  }

  .muted { color: var(--muted); }
  .expiry-expired { color: var(--danger); }
  .expiry-ok { color: var(--text); }

  @media (max-width: 900px) {
    .panels { grid-template-columns: 1fr; }
    .stats-row { grid-template-columns: repeat(2, 1fr); }
    .main { padding: 16px; }
  }
`;

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [pinShake, setPinShake] = useState(false);

  // Dashboard state
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterPlan, setFilterPlan] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [toasts, setToasts] = useState([]);
  const [deleteModal, setDeleteModal] = useState(null);
  const [generatedKeys, setGeneratedKeys] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState({});

  // Generate form
  const [genPlan, setGenPlan] = useState("lifetime");
  const [genDays, setGenDays] = useState("365");
  const [genQty, setGenQty] = useState("1");
  const [genEmail, setGenEmail] = useState("");

  const toast = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);

  const authHeader = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN || TOKEN}`,
  });

  const fetchKeys = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/keys", { headers: authHeader() });
      const data = await res.json();
      if (data.licenses) setKeys(data.licenses);
      else toast(data.error || "Failed to load keys", "error");
    } catch {
      toast("Network error loading keys", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) fetchKeys();
  }, [authed, fetchKeys]);

  const handlePin = () => {
    if (pin === PIN) {
      setAuthed(true);
    } else {
      setPinError(true);
      setPinShake(true);
      setPin("");
      setTimeout(() => { setPinError(false); setPinShake(false); }, 600);
    }
  };

  const handleGenerate = async () => {
    const qty = parseInt(genQty);
    if (isNaN(qty) || qty < 1 || qty > 50) { toast("Qty must be 1–50", "error"); return; }
    setGenerating(true);
    setGeneratedKeys([]);
    try {
      const body = {
        plan: genPlan,
        quantity: qty,
        durationDays: genPlan === "lifetime" ? null : parseInt(genDays) || 365,
        email: genEmail || null,
      };
      const res = await fetch("/api/admin/generate-key", {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedKeys(data.keys);
        toast(`Generated ${data.generated} key${data.generated > 1 ? "s" : ""}`);
        fetchKeys();
      } else {
        toast(data.error || "Generation failed", "error");
      }
    } catch {
      toast("Network error", "error");
    } finally {
      setGenerating(false);
    }
  };

  const toggleActive = async (key, current) => {
    try {
      const res = await fetch("/api/admin/keys", {
        method: "PATCH",
        headers: authHeader(),
        body: JSON.stringify({ licenseKey: key, active: !current }),
      });
      const data = await res.json();
      if (data.success) {
        setKeys(ks => ks.map(k => k.license_key === key ? { ...k, active: !current } : k));
        toast(`Key ${!current ? "activated" : "deactivated"}`);
      } else toast(data.error, "error");
    } catch { toast("Network error", "error"); }
  };

  const resetDevice = async (key) => {
    try {
      const res = await fetch("/api/admin/keys", {
        method: "PATCH",
        headers: authHeader(),
        body: JSON.stringify({ licenseKey: key, resetDevice: true }),
      });
      const data = await res.json();
      if (data.success) {
        setKeys(ks => ks.map(k => k.license_key === key ? { ...k, device_id: null } : k));
        toast("Device binding cleared");
      } else toast(data.error, "error");
    } catch { toast("Network error", "error"); }
  };

  const deleteKey = async (key) => {
    try {
      const res = await fetch(`/api/admin/keys?licenseKey=${encodeURIComponent(key)}`, {
        method: "DELETE",
        headers: authHeader(),
      });
      const data = await res.json();
      if (data.success) {
        setKeys(ks => ks.filter(k => k.license_key !== key));
        toast("Key deleted");
      } else toast(data.error, "error");
    } catch { toast("Network error", "error"); }
    setDeleteModal(null);
  };

  const copyKey = (key) => {
    navigator.clipboard.writeText(key).then(() => {
      setCopied(c => ({ ...c, [key]: true }));
      setTimeout(() => setCopied(c => ({ ...c, [key]: false })), 1500);
    });
  };

  // Filtered keys
  const filtered = keys.filter(k => {
    const matchSearch = !search ||
      k.license_key.toLowerCase().includes(search.toLowerCase()) ||
      (k.email || "").toLowerCase().includes(search.toLowerCase());
    const matchPlan = filterPlan === "all" || k.plan === filterPlan;
    const matchStatus = filterStatus === "all" ||
      (filterStatus === "active" && k.active) ||
      (filterStatus === "inactive" && !k.active);
    return matchSearch && matchPlan && matchStatus;
  });

  // Stats
  const totalKeys = keys.length;
  const activeKeys = keys.filter(k => k.active).length;
  const lifetimeKeys = keys.filter(k => k.plan === "lifetime").length;
  const expiredKeys = keys.filter(k => k.expiry_date && new Date(k.expiry_date) < new Date()).length;

  const fmt = (d) => {
    if (!d) return <span className="muted">Lifetime</span>;
    const date = new Date(d);
    const expired = date < new Date();
    return <span className={expired ? "expiry-expired" : "expiry-ok"}>{date.toLocaleDateString()}</span>;
  };

  if (!authed) return (
    <>
      <style>{STYLES}</style>
      <div className="pin-screen">
        <div className="pin-box">
          <div className="pin-logo">CWP</div>
          <div className="pin-sub">Admin Dashboard</div>
          <div className="pin-label">Enter PIN</div>
          <input
            className={`pin-input${pinShake ? " error" : ""}`}
            type="password"
            value={pin}
            maxLength={10}
            onChange={e => setPin(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handlePin()}
            autoFocus
          />
          <button className="pin-btn" onClick={handlePin}>Unlock</button>
          {pinError && <div className="pin-error">Incorrect PIN</div>}
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{STYLES}</style>
      <div className="dash">
        {/* TOPBAR */}
        <div className="topbar">
          <div className="topbar-brand">CWP <span>Admin</span></div>
          <div className="topbar-right">
            <div className="topbar-stat">Total <b>{totalKeys}</b></div>
            <div className="topbar-stat">Active <b>{activeKeys}</b></div>
            <button className="logout-btn" onClick={() => setAuthed(false)}>Logout</button>
          </div>
        </div>

        <div className="main">
          {/* STATS */}
          <div className="stats-row">
            <div className="stat-card green">
              <div className="stat-label">Total Keys</div>
              <div className="stat-value">{totalKeys}</div>
            </div>
            <div className="stat-card green">
              <div className="stat-label">Active</div>
              <div className="stat-value green">{activeKeys}</div>
            </div>
            <div className="stat-card purple">
              <div className="stat-label">Lifetime</div>
              <div className="stat-value purple">{lifetimeKeys}</div>
            </div>
            <div className="stat-card red">
              <div className="stat-label">Expired</div>
              <div className="stat-value red">{expiredKeys}</div>
            </div>
          </div>

          <div className="panels">
            {/* GENERATE PANEL */}
            <div className="panel">
              <div className="panel-header">
                <div className="panel-title">Generate Keys</div>
              </div>
              <div className="panel-body">
                <div className="form-group">
                  <label className="form-label">Plan</label>
                  <select className="form-select" value={genPlan} onChange={e => setGenPlan(e.target.value)}>
                    <option value="lifetime">Lifetime</option>
                    <option value="premium">Premium</option>
                    <option value="pro">Pro</option>
                  </select>
                </div>

                {genPlan !== "lifetime" && (
                  <div className="form-group">
                    <label className="form-label">Duration (Days)</label>
                    <input className="form-input" type="number" min="1" value={genDays} onChange={e => setGenDays(e.target.value)} placeholder="365" />
                  </div>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Quantity</label>
                    <input className="form-input" type="number" min="1" max="50" value={genQty} onChange={e => setGenQty(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email (opt)</label>
                    <input className="form-input" type="email" value={genEmail} onChange={e => setGenEmail(e.target.value)} placeholder="user@email.com" />
                  </div>
                </div>

                <button className="gen-btn" onClick={handleGenerate} disabled={generating}>
                  {generating ? "Generating..." : "⚡ Generate Keys"}
                </button>

                {generatedKeys.length > 0 && (
                  <div className="generated-keys">
                    {generatedKeys.map(k => (
                      <div className="generated-key-item" key={k.license_key}>
                        <span className="key-text">{k.license_key}</span>
                        <button
                          className={`copy-btn${copied[k.license_key] ? " copied" : ""}`}
                          onClick={() => copyKey(k.license_key)}
                        >
                          {copied[k.license_key] ? "✓" : "Copy"}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* KEYS TABLE */}
            <div className="panel">
              <div className="table-toolbar">
                <input
                  className="search-input"
                  placeholder="Search key or email..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <select className="filter-select" value={filterPlan} onChange={e => setFilterPlan(e.target.value)}>
                  <option value="all">All Plans</option>
                  <option value="lifetime">Lifetime</option>
                  <option value="premium">Premium</option>
                  <option value="pro">Pro</option>
                </select>
                <select className="filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <button className="refresh-btn" onClick={fetchKeys}>↻ Refresh</button>
              </div>

              <div className="table-wrap">
                {loading ? (
                  <table><tbody><tr className="loading-row"><td colSpan="7">Loading keys...</td></tr></tbody></table>
                ) : filtered.length === 0 ? (
                  <div className="empty-state">No keys found</div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>License Key</th>
                        <th>Plan</th>
                        <th>Status</th>
                        <th>Expiry</th>
                        <th>Email</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(k => (
                        <tr key={k.id}>
                          <td>
                            <span className="key-cell">{k.license_key}</span>
                            <button className="copy-btn" style={{marginLeft:8}} onClick={() => copyKey(k.license_key)}>
                              {copied[k.license_key] ? "✓" : "⎘"}
                            </button>
                          </td>
                          <td><span className={`plan-badge ${k.plan}`}>{k.plan}</span></td>
                          <td>
                            <span className={`status-dot ${k.active ? "active" : "inactive"}`}>
                              {k.active ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td>{fmt(k.expiry_date)}</td>
                          <td><span className="muted">{k.email || "—"}</span></td>
                          <td><span className="muted">{new Date(k.created_at).toLocaleDateString()}</span></td>
                          <td>
                            <button
                              className={`action-btn ${k.active ? "warn" : ""}`}
                              onClick={() => toggleActive(k.license_key, k.active)}
                            >
                              {k.active ? "Deactivate" : "Activate"}
                            </button>
                            <button className="action-btn warn" onClick={() => resetDevice(k.license_key)}>
                              Reset Device
                            </button>
                            <button className="action-btn danger" onClick={() => setDeleteModal(k.license_key)}>
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DELETE MODAL */}
      {deleteModal && (
        <div className="modal-overlay" onClick={() => setDeleteModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Delete License Key?</div>
            <div style={{fontSize:13,color:'var(--muted)',marginBottom:8}}>This action cannot be undone.</div>
            <div className="key-cell" style={{fontSize:13,marginTop:12}}>{deleteModal}</div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setDeleteModal(null)}>Cancel</button>
              <button className="btn-confirm" onClick={() => deleteKey(deleteModal)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* TOASTS */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast${t.type === "error" ? " error" : ""}`}>{t.msg}</div>
        ))}
      </div>
    </>
  );
}
