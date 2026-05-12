'use client';
import { useState, useEffect, useCallback } from 'react';

const s = {
  wrap: { minHeight: '100vh', background: '#0f172a', color: '#e2e8f0', padding: '1.5rem', fontFamily: 'system-ui,sans-serif' },
  h1: { color: '#25d366', fontSize: '1.5rem', margin: '0 0 0.25rem' },
  sub: { color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' },
  card: { background: '#1e293b', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '1rem' },
  h2: { color: '#94a3b8', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', margin: '0 0 1rem' },
  row: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' },
  label: { display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' },
  input: { background: '#0f172a', border: '1px solid #334155', borderRadius: '0.375rem', color: '#e2e8f0', padding: '0.5rem 0.75rem', fontSize: '0.875rem', outline: 'none', minWidth: '140px' },
  select: { background: '#0f172a', border: '1px solid #334155', borderRadius: '0.375rem', color: '#e2e8f0', padding: '0.5rem 0.75rem', fontSize: '0.875rem' },
  btn: { background: '#25d366', color: '#000', border: 'none', borderRadius: '0.375rem', padding: '0.5rem 1rem', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' },
  btnSm: { background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', borderRadius: '0.25rem', padding: '0.25rem 0.5rem', cursor: 'pointer', fontSize: '0.75rem' },
  btnDanger: { background: '#7f1d1d', border: 'none', color: '#fca5a5', borderRadius: '0.25rem', padding: '0.25rem 0.5rem', cursor: 'pointer', fontSize: '0.75rem' },
  msg: { marginTop: '0.75rem', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.85rem' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' },
  th: { textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #334155', color: '#94a3b8', fontWeight: 500 },
  td: { padding: '0.5rem', borderBottom: '1px solid #1e293b', verticalAlign: 'middle' },
  badge: (active) => ({ display: 'inline-block', padding: '0.125rem 0.5rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 600, background: active ? '#14532d' : '#7f1d1d', color: active ? '#4ade80' : '#fca5a5' }),
  key: { fontFamily: 'monospace', fontSize: '0.8rem', letterSpacing: '0.05em', color: '#7dd3fc' },
};

export default function AdminPage() {
  const [token, setToken] = useState('');
  const [authed, setAuthed] = useState(false);
  const [authErr, setAuthErr] = useState('');

  // Generate form
  const [plan, setPlan] = useState('premium');
  const [duration, setDuration] = useState('365');
  const [quantity, setQuantity] = useState('1');
  const [email, setEmail] = useState('');
  const [genResult, setGenResult] = useState(null);
  const [genLoading, setGenLoading] = useState(false);

  // Keys list
  const [keys, setKeys] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [filterPlan, setFilterPlan] = useState('');
  const [filterActive, setFilterActive] = useState('');
  const [copied, setCopied] = useState('');

  const authHeaders = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  async function handleLogin(e) {
    e.preventDefault();
    setAuthErr('');
    // Test the token with a quick GET
    try {
      const res = await fetch('/api/admin/keys?plan=', { headers: authHeaders });
      if (res.ok) {
        setAuthed(true);
        fetchKeys();
      } else {
        setAuthErr('Invalid admin token.');
      }
    } catch {
      setAuthErr('Could not reach server.');
    }
  }

  const fetchKeys = useCallback(async () => {
    setListLoading(true);
    const params = new URLSearchParams();
    if (filterPlan) params.set('plan', filterPlan);
    if (filterActive !== '') params.set('active', filterActive);
    try {
      const res = await fetch(`/api/admin/keys?${params}`, { headers: authHeaders });
      const data = await res.json();
      setKeys(data.licenses || []);
    } catch {
      setKeys([]);
    } finally {
      setListLoading(false);
    }
  }, [filterPlan, filterActive, token]);

  useEffect(() => { if (authed) fetchKeys(); }, [authed, filterPlan, filterActive]);

  async function handleGenerate(e) {
    e.preventDefault();
    setGenLoading(true);
    setGenResult(null);
    try {
      const res = await fetch('/api/admin/generate-key', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          plan,
          durationDays: plan === 'lifetime' ? null : parseInt(duration, 10),
          quantity: parseInt(quantity, 10),
          email: email || null,
        }),
      });
      const data = await res.json();
      setGenResult(data);
      if (data.success) fetchKeys();
    } catch {
      setGenResult({ error: 'Network error.' });
    } finally {
      setGenLoading(false);
    }
  }

  async function toggleActive(key, current) {
    await fetch('/api/admin/keys', {
      method: 'PATCH',
      headers: authHeaders,
      body: JSON.stringify({ licenseKey: key, active: !current }),
    });
    fetchKeys();
  }

  async function deleteKey(key) {
    if (!confirm(`Delete key ${key}?`)) return;
    await fetch(`/api/admin/keys?licenseKey=${encodeURIComponent(key)}`, {
      method: 'DELETE',
      headers: authHeaders,
    });
    fetchKeys();
  }

  function copyKey(key) {
    navigator.clipboard.writeText(key).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(''), 2000);
    });
  }

  // ── Login screen ──────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{ ...s.wrap, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ ...s.card, width: 320 }}>
          <h1 style={s.h1}>🔑 Admin Login</h1>
          <p style={s.sub}>Cyber WhatsApp Pro — License Manager</p>
          <form onSubmit={handleLogin}>
            <label style={s.label}>Admin Token</label>
            <input
              style={{ ...s.input, width: '100%', boxSizing: 'border-box', marginBottom: '0.75rem' }}
              type="password"
              placeholder="Enter ADMIN_SECRET_TOKEN"
              value={token}
              onChange={e => setToken(e.target.value)}
              required
            />
            <button style={{ ...s.btn, width: '100%' }} type="submit">Login</button>
            {authErr && <div style={{ ...s.msg, background: '#7f1d1d', color: '#fca5a5' }}>{authErr}</div>}
          </form>
        </div>
      </div>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────
  return (
    <div style={s.wrap}>
      <h1 style={s.h1}>⚡ CWP License Dashboard</h1>
      <p style={s.sub}>Cyber WhatsApp Pro — Admin Panel &nbsp;|&nbsp; <button style={{ ...s.btnSm, cursor: 'pointer' }} onClick={() => setAuthed(false)}>Logout</button></p>

      {/* Generate Keys */}
      <div style={s.card}>
        <h2 style={s.h2}>Generate Keys</h2>
        <form onSubmit={handleGenerate}>
          <div style={s.row}>
            <div>
              <label style={s.label}>Plan</label>
              <select style={s.select} value={plan} onChange={e => setPlan(e.target.value)}>
                <option value="premium">Premium (1yr)</option>
                <option value="pro">Pro</option>
                <option value="lifetime">Lifetime</option>
              </select>
            </div>
            {plan !== 'lifetime' && (
              <div>
                <label style={s.label}>Duration (days)</label>
                <input style={s.input} type="number" min="1" max="3650" value={duration} onChange={e => setDuration(e.target.value)} />
              </div>
            )}
            <div>
              <label style={s.label}>Quantity</label>
              <input style={{ ...s.input, width: 70 }} type="number" min="1" max="50" value={quantity} onChange={e => setQuantity(e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={s.label}>Customer Email (optional)</label>
              <input style={{ ...s.input, width: '100%' }} type="email" placeholder="customer@email.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <button style={s.btn} type="submit" disabled={genLoading}>{genLoading ? 'Generating…' : 'Generate'}</button>
          </div>
        </form>

        {genResult && (
          <div style={{ marginTop: '1rem' }}>
            {genResult.error && <div style={{ ...s.msg, background: '#7f1d1d', color: '#fca5a5' }}>❌ {genResult.error}</div>}
            {genResult.success && (
              <div style={{ ...s.msg, background: '#14532d', color: '#4ade80' }}>
                ✅ Generated {genResult.generated} key(s):
                {genResult.keys.map(k => (
                  <div key={k.license_key} style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={s.key}>{k.license_key}</span>
                    <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{k.plan} · {k.expiry}</span>
                    <button style={s.btnSm} onClick={() => copyKey(k.license_key)}>{copied === k.license_key ? '✓ Copied' : 'Copy'}</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Keys List */}
      <div style={s.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ ...s.h2, margin: 0 }}>All Keys ({keys.length})</h2>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <select style={s.select} value={filterPlan} onChange={e => setFilterPlan(e.target.value)}>
              <option value="">All Plans</option>
              <option value="premium">Premium</option>
              <option value="pro">Pro</option>
              <option value="lifetime">Lifetime</option>
            </select>
            <select style={s.select} value={filterActive} onChange={e => setFilterActive(e.target.value)}>
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
            <button style={s.btnSm} onClick={fetchKeys}>{listLoading ? '…' : '↻ Refresh'}</button>
          </div>
        </div>

        {listLoading ? (
          <p style={{ color: '#64748b', textAlign: 'center' }}>Loading…</p>
        ) : keys.length === 0 ? (
          <p style={{ color: '#64748b', textAlign: 'center' }}>No keys found.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Key</th>
                  <th style={s.th}>Plan</th>
                  <th style={s.th}>Status</th>
                  <th style={s.th}>Expiry</th>
                  <th style={s.th}>Email</th>
                  <th style={s.th}>Activated</th>
                  <th style={s.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {keys.map(k => (
                  <tr key={k.id}>
                    <td style={s.td}>
                      <span style={s.key}>{k.license_key}</span>
                      <button style={{ ...s.btnSm, marginLeft: '0.4rem' }} onClick={() => copyKey(k.license_key)}>{copied === k.license_key ? '✓' : '⎘'}</button>
                    </td>
                    <td style={s.td}><span style={{ textTransform: 'capitalize' }}>{k.plan}</span></td>
                    <td style={s.td}><span style={s.badge(k.active)}>{k.active ? 'Active' : 'Inactive'}</span></td>
                    <td style={s.td} title={k.expiry_date}>{k.expiry_date ? new Date(k.expiry_date).toLocaleDateString() : '♾ Lifetime'}</td>
                    <td style={s.td}>{k.email || <span style={{ color: '#475569' }}>—</span>}</td>
                    <td style={s.td}>{k.activated_at ? new Date(k.activated_at).toLocaleDateString() : <span style={{ color: '#475569' }}>Not yet</span>}</td>
                    <td style={s.td}>
                      <button style={s.btnSm} onClick={() => toggleActive(k.license_key, k.active)}>
                        {k.active ? 'Deactivate' : 'Activate'}
                      </button>
                      {' '}
                      <button style={s.btnDanger} onClick={() => deleteKey(k.license_key)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
