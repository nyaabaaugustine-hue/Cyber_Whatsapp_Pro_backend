// src/app/admin/route.js
// GET /admin  — serves the admin dashboard HTML page
import { NextResponse } from "next/server";

const TOKEN = process.env.ADMIN_SECRET_TOKEN;

const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CWP Admin Dashboard</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Segoe UI',sans-serif;background:#0f172a;color:#e2e8f0;min-height:100vh}
  .topbar{background:#1e293b;border-bottom:1px solid #334155;padding:14px 28px;display:flex;align-items:center;justify-content:space-between}
  .topbar h1{font-size:18px;font-weight:700;color:#22d3ee}
  .topbar h1 span{color:#94a3b8;font-weight:400;font-size:14px;margin-left:8px}
  .status-dot{width:9px;height:9px;border-radius:50%;background:#22c55e;display:inline-block;margin-right:6px;animation:pulse 2s infinite}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
  .conn-status{font-size:13px;color:#94a3b8}
  .nav{background:#1e293b;border-bottom:1px solid #334155;display:flex;gap:4px;padding:0 24px}
  .nav button{background:none;border:none;color:#94a3b8;padding:13px 18px;cursor:pointer;font-size:14px;border-bottom:2px solid transparent;transition:all .2s}
  .nav button:hover{color:#e2e8f0}
  .nav button.active{color:#22d3ee;border-bottom-color:#22d3ee}
  .main{max-width:1100px;margin:0 auto;padding:28px 20px}
  .card{background:#1e293b;border:1px solid #334155;border-radius:12px;padding:24px;margin-bottom:20px}
  .card h2{font-size:16px;font-weight:600;margin-bottom:20px;color:#f1f5f9}
  .form-row{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px}
  .form-row.three{grid-template-columns:1fr 1fr 1fr}
  .form-group{display:flex;flex-direction:column;gap:6px}
  .form-group label{font-size:12px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px}
  .form-group input,.form-group select{background:#0f172a;border:1px solid #334155;color:#e2e8f0;padding:10px 12px;border-radius:8px;font-size:14px;outline:none;transition:border .2s}
  .form-group input:focus,.form-group select:focus{border-color:#22d3ee}
  .form-group select option{background:#1e293b}
  .btn{padding:11px 22px;border-radius:8px;border:none;font-size:14px;font-weight:600;cursor:pointer;transition:all .2s}
  .btn-primary{background:#22d3ee;color:#0f172a}
  .btn-primary:hover{background:#06b6d4}
  .btn-primary:disabled{background:#334155;color:#64748b;cursor:not-allowed}
  .btn-danger{background:#ef4444;color:#fff}
  .btn-danger:hover{background:#dc2626}
  .btn-success{background:#22c55e;color:#fff}
  .btn-success:hover{background:#16a34a}
  .btn-sm{padding:6px 12px;font-size:12px}
  .btn-outline{background:none;border:1px solid #334155;color:#94a3b8}
  .btn-outline:hover{border-color:#22d3ee;color:#22d3ee}
  .result-box{background:#0f172a;border:1px solid #334155;border-radius:8px;padding:16px;margin-top:16px;display:none}
  .result-box.show{display:block}
  .result-box.success{border-color:#22c55e}
  .result-box.error{border-color:#ef4444}
  .key-display{font-family:'Courier New',monospace;font-size:16px;font-weight:700;color:#22d3ee;letter-spacing:1px;word-break:break-all}
  .key-row{display:flex;align-items:center;gap:10px;margin-top:8px;flex-wrap:wrap}
  .key-meta{font-size:12px;color:#64748b;margin-top:4px}
  .table-wrap{overflow-x:auto}
  table{width:100%;border-collapse:collapse;font-size:13px}
  th{text-align:left;padding:10px 12px;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:.5px;border-bottom:1px solid #334155}
  td{padding:11px 12px;border-bottom:1px solid #1e293b;vertical-align:middle}
  tr:hover td{background:#0f172a}
  .badge{display:inline-block;padding:3px 9px;border-radius:99px;font-size:11px;font-weight:600}
  .badge-active{background:#14532d;color:#22c55e}
  .badge-inactive{background:#450a0a;color:#ef4444}
  .badge-premium{background:#312e81;color:#a5b4fc}
  .badge-pro{background:#3b0764;color:#c4b5fd}
  .badge-lifetime{background:#78350f;color:#fbbf24}
  .filters{display:flex;gap:10px;margin-bottom:16px;align-items:center;flex-wrap:wrap}
  .filters input,.filters select{background:#0f172a;border:1px solid #334155;color:#e2e8f0;padding:8px 12px;border-radius:8px;font-size:13px;outline:none}
  .filters input{flex:1;min-width:200px}
  #toast{position:fixed;bottom:24px;right:24px;background:#22c55e;color:#fff;padding:12px 20px;border-radius:8px;font-size:14px;font-weight:600;display:none;z-index:999;box-shadow:0 4px 20px #0008}
  #toast.error{background:#ef4444}
  .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px}
  .stat{background:#1e293b;border:1px solid #334155;border-radius:10px;padding:18px;text-align:center}
  .stat .num{font-size:28px;font-weight:700;color:#22d3ee}
  .stat .lbl{font-size:12px;color:#64748b;margin-top:4px}
  .section{display:none}
  .section.active{display:block}
  .spinner{display:inline-block;width:16px;height:16px;border:2px solid #334155;border-top-color:#22d3ee;border-radius:50%;animation:spin .7s linear infinite;vertical-align:middle;margin-right:6px}
  @keyframes spin{to{transform:rotate(360deg)}}
  .empty{text-align:center;color:#64748b;padding:40px;font-size:14px}
  .copy-btn{background:#334155;border:none;color:#94a3b8;padding:5px 10px;border-radius:6px;cursor:pointer;font-size:12px}
  .copy-btn:hover{background:#475569;color:#e2e8f0}
  @media(max-width:600px){.form-row,.form-row.three{grid-template-columns:1fr}.stats{grid-template-columns:1fr 1fr}}
</style>
</head>
<body>
<div class="topbar">
  <h1>⚡ CWP Admin <span>Cyber WhatsApp Pro</span></h1>
  <div class="conn-status"><span class="status-dot" id="dot"></span><span id="conn-label">Checking…</span></div>
</div>
<div class="nav">
  <button class="active" onclick="showTab('generate',this)">🔑 Generate Key</button>
  <button onclick="showTab('keys',this)">📋 Manage Keys</button>
  <button onclick="showTab('stats',this)">📊 Stats</button>
</div>
<div class="main">

  <!-- GENERATE -->
  <div id="tab-generate" class="section active">
    <div class="card">
      <h2>🔑 Generate License Key</h2>
      <div class="form-row">
        <div class="form-group">
          <label>Customer Email</label>
          <input type="email" id="g-email" placeholder="customer@email.com">
        </div>
        <div class="form-group">
          <label>Plan</label>
          <select id="g-plan" onchange="toggleDays()">
            <option value="premium">Premium</option>
            <option value="pro">Pro</option>
            <option value="lifetime">Lifetime</option>
          </select>
        </div>
      </div>
      <div class="form-row three">
        <div class="form-group" id="days-group">
          <label>Duration (days)</label>
          <input type="number" id="g-days" value="365" min="1">
        </div>
        <div class="form-group">
          <label>Quantity</label>
          <input type="number" id="g-qty" value="1" min="1" max="50">
        </div>
        <div class="form-group" style="justify-content:flex-end">
          <label>&nbsp;</label>
          <button class="btn btn-primary" id="gen-btn" onclick="generateKey()">Generate Key</button>
        </div>
      </div>
      <div id="gen-result" class="result-box">
        <div id="gen-result-inner"></div>
      </div>
    </div>
  </div>

  <!-- KEYS -->
  <div id="tab-keys" class="section">
    <div class="card">
      <h2>📋 All License Keys</h2>
      <div class="filters">
        <input type="text" id="search-input" placeholder="🔍  Search email or key…" oninput="filterTable()">
        <select id="filter-plan" onchange="filterTable()">
          <option value="">All Plans</option>
          <option value="premium">Premium</option>
          <option value="pro">Pro</option>
          <option value="lifetime">Lifetime</option>
        </select>
        <select id="filter-active" onchange="filterTable()">
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
        <button class="btn btn-outline btn-sm" onclick="loadKeys()">↺ Refresh</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Email</th><th>License Key</th><th>Plan</th><th>Status</th><th>Expiry</th><th>Created</th><th>Action</th></tr></thead>
          <tbody id="keys-tbody"><tr><td colspan="7" class="empty">Click Manage Keys tab to load…</td></tr></tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- STATS -->
  <div id="tab-stats" class="section">
    <div class="stats">
      <div class="stat"><div class="num" id="s-total">—</div><div class="lbl">Total Keys</div></div>
      <div class="stat"><div class="num" id="s-active">—</div><div class="lbl">Active</div></div>
      <div class="stat"><div class="num" id="s-inactive">—</div><div class="lbl">Inactive</div></div>
      <div class="stat"><div class="num" id="s-lifetime">—</div><div class="lbl">Lifetime</div></div>
    </div>
    <div class="card">
      <h2>Plan Breakdown</h2>
      <div id="plan-breakdown" class="empty">Loading…</div>
    </div>
  </div>
</div>

<div id="toast"></div>
<script>
  var allKeys=[];

  function showTab(tab,btn){
    document.querySelectorAll('.section').forEach(function(s){s.classList.remove('active')});
    document.querySelectorAll('.nav button').forEach(function(b){b.classList.remove('active')});
    document.getElementById('tab-'+tab).classList.add('active');
    btn.classList.add('active');
    if(tab==='keys')loadKeys();
    if(tab==='stats')loadStats();
  }

  function toast(msg,type){
    var t=document.getElementById('toast');
    t.textContent=msg;
    t.className=type==='error'?'error':'';
    t.style.display='block';
    setTimeout(function(){t.style.display='none'},3000);
  }

  function copyText(text){
    navigator.clipboard.writeText(text).then(function(){toast('✅ Copied!')});
  }

  function toggleDays(){
    var plan=document.getElementById('g-plan').value;
    document.getElementById('days-group').style.opacity=plan==='lifetime'?'0.3':'1';
  }

  async function generateKey(){
    var btn=document.getElementById('gen-btn');
    var email=document.getElementById('g-email').value.trim();
    var plan=document.getElementById('g-plan').value;
    var days=parseInt(document.getElementById('g-days').value)||365;
    var qty=parseInt(document.getElementById('g-qty').value)||1;
    var result=document.getElementById('gen-result');
    var inner=document.getElementById('gen-result-inner');
    btn.disabled=true;
    btn.innerHTML='<span class="spinner"></span>Generating…';
    result.className='result-box show';
    inner.innerHTML='<span class="spinner"></span> Talking to server…';
    try{
      var res=await fetch('/api/admin/generate-key',{
        method:'POST',
        headers:{'Content-Type':'application/json','Authorization':'Bearer ${TOKEN}'},
        body:JSON.stringify({email:email||null,plan:plan,durationDays:plan==='lifetime'?null:days,quantity:qty})
      });
      var data=await res.json();
      if(!res.ok)throw new Error(data.error||'Server error');
      result.classList.add('success');
      var html='<div style="color:#22c55e;font-weight:700;margin-bottom:12px">✅ Generated '+data.generated+' key'+(data.generated>1?'s':'')+'!</div>';
      data.keys.forEach(function(k){
        html+='<div style="background:#0f172a;border:1px solid #334155;border-radius:8px;padding:12px;margin-bottom:8px">'
          +'<div class="key-display">'+k.license_key+'</div>'
          +'<div class="key-meta">Plan: '+k.plan+' &nbsp;|&nbsp; Expiry: '+k.expiry+(email?' &nbsp;|&nbsp; Email: '+email:'')+'</div>'
          +'<div class="key-row">'
          +'<button class="btn btn-sm btn-primary" onclick="copyText(\''+k.license_key+'\')">📋 Copy Key</button>'
          +'<button class="btn btn-sm btn-outline" onclick="copyWA(\''+k.license_key+'\',\''+k.plan+'\',\''+k.expiry+'\')">📱 Copy WhatsApp Msg</button>'
          +'</div></div>';
      });
      inner.innerHTML=html;
      toast('✅ Key generated!');
    }catch(e){
      result.classList.add('error');
      inner.innerHTML='<span style="color:#ef4444">❌ Error: '+e.message+'</span>';
      toast('❌ '+e.message,'error');
    }
    btn.disabled=false;
    btn.textContent='Generate Key';
  }

  function copyWA(key,plan,expiry){
    var msg='🔐 *Your CWP License Key*\\n\\n'
      +'Key: \`'+key+'\`\\n'
      +'Plan: '+plan.charAt(0).toUpperCase()+plan.slice(1)+'\\n'
      +'Expiry: '+expiry+'\\n\\n'
      +'📖 *How to activate:*\\n'
      +'1. Open the Chrome extension\\n'
      +'2. Click Activate License\\n'
      +'3. Paste your key and click Confirm\\n\\n'
      +'Thank you for your purchase! 🙏';
    navigator.clipboard.writeText(msg).then(function(){toast('✅ WhatsApp message copied!')});
  }

  async function loadKeys(){
    var tbody=document.getElementById('keys-tbody');
    tbody.innerHTML='<tr><td colspan="7" class="empty"><span class="spinner"></span> Loading…</td></tr>';
    try{
      var res=await fetch('/api/admin/keys',{headers:{'Authorization':'Bearer ${TOKEN}'}});
      var data=await res.json();
      if(!res.ok)throw new Error(data.error||'Failed');
      allKeys=data.licenses;
      renderKeys(allKeys);
    }catch(e){
      tbody.innerHTML='<tr><td colspan="7" class="empty" style="color:#ef4444">❌ '+e.message+'</td></tr>';
      toast('❌ '+e.message,'error');
    }
  }

  function renderKeys(keys){
    var tbody=document.getElementById('keys-tbody');
    if(!keys.length){tbody.innerHTML='<tr><td colspan="7" class="empty">No keys found</td></tr>';return}
    tbody.innerHTML=keys.map(function(k){
      var plan='<span class="badge badge-'+k.plan+'">'+k.plan+'</span>';
      var status=k.active?'<span class="badge badge-active">Active</span>':'<span class="badge badge-inactive">Inactive</span>';
      var expiry=k.expiry_date?new Date(k.expiry_date).toLocaleDateString():'∞ Lifetime';
      var created=new Date(k.created_at).toLocaleDateString();
      var action=k.active
        ?'<button class="btn btn-sm btn-danger" onclick="toggleKey(\''+k.license_key+'\',false)">Deactivate</button>'
        :'<button class="btn btn-sm btn-success" onclick="toggleKey(\''+k.license_key+'\',true)">Activate</button>';
      return '<tr>'
        +'<td style="color:#94a3b8">'+(k.email||'<em style="color:#475569">none</em>')+'</td>'
        +'<td><span style="font-family:monospace;font-size:12px;color:#22d3ee">'+k.license_key+'</span>'
        +'<button class="copy-btn" style="margin-left:6px" onclick="copyText(\''+k.license_key+'\')">copy</button></td>'
        +'<td>'+plan+'</td>'
        +'<td>'+status+'</td>'
        +'<td style="color:#94a3b8;font-size:12px">'+expiry+'</td>'
        +'<td style="color:#64748b;font-size:12px">'+created+'</td>'
        +'<td>'+action+'</td>'
        +'</tr>';
    }).join('');
  }

  function filterTable(){
    var search=document.getElementById('search-input').value.toLowerCase();
    var plan=document.getElementById('filter-plan').value;
    var active=document.getElementById('filter-active').value;
    var filtered=allKeys.filter(function(k){
      return(!search||(k.email||'').toLowerCase().includes(search)||k.license_key.toLowerCase().includes(search))
        &&(!plan||k.plan===plan)
        &&(active===''||String(k.active)===active);
    });
    renderKeys(filtered);
  }

  async function toggleKey(licenseKey,active){
    try{
      var res=await fetch('/api/admin/keys',{
        method:'PATCH',
        headers:{'Content-Type':'application/json','Authorization':'Bearer ${TOKEN}'},
        body:JSON.stringify({licenseKey:licenseKey,active:active})
      });
      var data=await res.json();
      if(!res.ok)throw new Error(data.error||'Failed');
      toast(active?'✅ Key activated!':'🔴 Key deactivated!');
      loadKeys();
    }catch(e){toast('❌ '+e.message,'error')}
  }

  async function loadStats(){
    try{
      var res=await fetch('/api/admin/keys',{headers:{'Authorization':'Bearer ${TOKEN}'}});
      var data=await res.json();
      if(!res.ok)throw new Error(data.error);
      var keys=data.licenses;
      var active=keys.filter(function(k){return k.active}).length;
      document.getElementById('s-total').textContent=keys.length;
      document.getElementById('s-active').textContent=active;
      document.getElementById('s-inactive').textContent=keys.length-active;
      document.getElementById('s-lifetime').textContent=keys.filter(function(k){return k.plan==='lifetime'}).length;
      var premium=keys.filter(function(k){return k.plan==='premium'}).length;
      var pro=keys.filter(function(k){return k.plan==='pro'}).length;
      var lifetime=keys.filter(function(k){return k.plan==='lifetime'}).length;
      document.getElementById('plan-breakdown').innerHTML=
        '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:8px">'
        +'<div style="background:#0f172a;border-radius:8px;padding:16px;text-align:center"><div style="font-size:32px;font-weight:700;color:#a5b4fc">'+premium+'</div><div style="font-size:12px;color:#64748b;margin-top:4px">Premium</div></div>'
        +'<div style="background:#0f172a;border-radius:8px;padding:16px;text-align:center"><div style="font-size:32px;font-weight:700;color:#c4b5fd">'+pro+'</div><div style="font-size:12px;color:#64748b;margin-top:4px">Pro</div></div>'
        +'<div style="background:#0f172a;border-radius:8px;padding:16px;text-align:center"><div style="font-size:32px;font-weight:700;color:#fbbf24">'+lifetime+'</div><div style="font-size:12px;color:#64748b;margin-top:4px">Lifetime</div></div>'
        +'</div>';
    }catch(e){toast('❌ '+e.message,'error')}
  }

  // Ping on load
  fetch('/api/admin/keys',{headers:{'Authorization':'Bearer ${TOKEN}'}}).then(function(r){
    document.getElementById('dot').style.background=r.ok?'#22c55e':'#ef4444';
    document.getElementById('conn-label').textContent=r.ok?'Connected':'Auth failed';
  }).catch(function(){
    document.getElementById('dot').style.background='#ef4444';
    document.getElementById('conn-label').textContent='Connection error';
  });
</script>
</body>
</html>`;

export async function GET(request) {
  // Optional: protect the page itself with the token as a query param
  // const { searchParams } = new URL(request.url);
  // if (searchParams.get("token") !== TOKEN) {
  //   return new NextResponse("Unauthorized", { status: 401 });
  // }

  const html = HTML.replaceAll("${TOKEN}", TOKEN || "");
  return new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
