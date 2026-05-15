import Link from "next/link";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --green: #1a7a4a; --green-light: #e8f5ee; --green-mid: #25a862;
    --gray-bg: #f7f6f3; --gray-card: #ffffff; --gray-border: #e2e0da;
    --text-dark: #1a1a18; --text-mid: #4a4a45; --text-soft: #8a8a85;
    --step-bg: #111410; --accent: #00c853; --radius: 12px;
  }
  body { font-family: 'DM Sans', sans-serif; background: var(--gray-bg); color: var(--text-dark); }
  .hero {
    background: var(--step-bg); color: #fff; padding: 52px 40px 48px;
    text-align: center; position: relative; overflow: hidden;
  }
  .hero::before {
    content: ''; position: absolute; top: -60px; right: -60px;
    width: 260px; height: 260px; border-radius: 50%;
    border: 1px solid rgba(0,200,83,0.15);
  }
  .hero::after {
    content: ''; position: absolute; bottom: -40px; left: -40px;
    width: 180px; height: 180px; border-radius: 50%;
    border: 1px solid rgba(0,200,83,0.10);
  }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(0,200,83,0.12); border: 1px solid rgba(0,200,83,0.3);
    border-radius: 100px; padding: 5px 14px; font-size: 12px;
    letter-spacing: 0.08em; color: #00c853; margin-bottom: 20px; text-transform: uppercase;
  }
  .hero-badge::before { content: '●'; font-size: 8px; }
  .hero h1 {
    font-family: 'Syne', sans-serif; font-size: clamp(26px, 5vw, 38px);
    font-weight: 700; letter-spacing: -0.02em; line-height: 1.15; margin-bottom: 12px;
  }
  .hero h1 span { color: #00c853; }
  .hero p { font-size: 15px; color: rgba(255,255,255,0.55); max-width: 440px; margin: 0 auto; line-height: 1.6; }
  .container { max-width: 720px; margin: 0 auto; padding: 40px 24px 60px; }
  .notice {
    background: var(--green-light); border: 1px solid #b2dfc3; border-radius: var(--radius);
    padding: 16px 20px; display: flex; gap: 14px; align-items: flex-start; margin-bottom: 36px;
  }
  .notice-icon {
    width: 28px; height: 28px; background: var(--green); border-radius: 50%;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;
  }
  .notice-icon svg { width: 14px; height: 14px; fill: #fff; }
  .notice-text { font-size: 14px; line-height: 1.6; color: #1a4a2e; }
  .notice-text strong { font-weight: 500; }
  .section-label {
    font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 600;
    letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-soft); margin-bottom: 14px;
  }
  .steps { margin-bottom: 40px; }
  .step { display: grid; grid-template-columns: 40px 1fr; gap: 0 18px; margin-bottom: 4px; position: relative; }
  .step-num-col { display: flex; flex-direction: column; align-items: center; }
  .step-num {
    width: 40px; height: 40px; background: var(--step-bg); color: #fff; border-radius: 50%;
    display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif;
    font-weight: 700; font-size: 15px; flex-shrink: 0; position: relative; z-index: 1;
  }
  .step-num.done { background: var(--green); }
  .step-line { width: 2px; flex: 1; background: var(--gray-border); margin: 4px 0; min-height: 20px; }
  .step:last-child .step-line { display: none; }
  .step-body { padding: 8px 0 28px; }
  .step-title {
    font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 600;
    color: var(--text-dark); margin-bottom: 6px; line-height: 1.3;
  }
  .step-desc { font-size: 14px; color: var(--text-mid); line-height: 1.7; margin-bottom: 10px; }
  .step-desc a { color: var(--green); text-decoration: none; font-weight: 500; }
  .step-desc a:hover { text-decoration: underline; }
  .path-pill {
    display: inline-flex; align-items: center; gap: 8px; background: #f0eeea;
    border: 1px solid var(--gray-border); border-radius: 8px; padding: 8px 14px;
    font-family: 'Courier New', monospace; font-size: 13px; color: var(--text-dark);
    margin: 4px 0 10px; word-break: break-all;
  }
  .path-pill .copy-btn {
    cursor: pointer; background: none; border: none; color: var(--text-soft);
    font-size: 11px; font-family: 'DM Sans', sans-serif; padding: 2px 6px;
    border-radius: 4px; transition: background 0.15s; flex-shrink: 0;
  }
  .path-pill .copy-btn:hover { background: #e0ddd8; color: var(--green); }
  .screenshot {
    background: #f0eeea; border: 1px solid var(--gray-border); border-radius: 10px;
    padding: 24px 20px; margin-top: 12px; font-size: 13px; color: var(--text-soft); text-align: center;
  }
  .screenshot .chrome-bar {
    background: #e8e6e1; border-radius: 8px 8px 0 0; padding: 8px 14px;
    display: flex; align-items: center; gap: 6px; margin: -24px -20px 14px;
  }
  .dot { width: 10px; height: 10px; border-radius: 50%; }
  .dot.r { background: #ff5f57; } .dot.y { background: #febc2e; } .dot.g { background: #28c840; }
  .chrome-url {
    flex: 1; background: #fff; border-radius: 6px; padding: 4px 10px; font-size: 12px;
    color: #555; font-family: monospace; text-align: left;
  }
  .toggle-row {
    display: flex; align-items: center; justify-content: space-between; background: #fff;
    border-radius: 8px; border: 1px solid #ddd; padding: 10px 14px; margin-bottom: 8px;
  }
  .toggle-label { font-size: 13px; color: #333; }
  .toggle-track { width: 36px; height: 20px; background: #25a862; border-radius: 100px; position: relative; }
  .toggle-thumb { width: 16px; height: 16px; background: #fff; border-radius: 50%; position: absolute; top: 2px; right: 2px; }
  .tip {
    background: #fffdf5; border: 1px solid #f0e6b0; border-radius: 10px; padding: 12px 16px;
    font-size: 13px; color: #7a6a20; line-height: 1.6; margin-top: 10px;
    display: flex; gap: 10px; align-items: flex-start;
  }
  .tip::before { content: '💡'; flex-shrink: 0; margin-top: 1px; }
  .help-card {
    background: var(--step-bg); color: #fff; border-radius: var(--radius); padding: 28px 28px;
    display: flex; flex-direction: column; align-items: center; text-align: center; gap: 12px; margin-top: 8px;
  }
  .help-card p { font-size: 14px; color: rgba(255,255,255,0.55); line-height: 1.6; }
  .help-card h3 { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 600; }
  .wa-btn {
    display: inline-flex; align-items: center; gap: 8px; background: #25D366; color: #fff;
    border: none; border-radius: 100px; padding: 12px 24px; font-size: 14px; font-weight: 500;
    cursor: pointer; text-decoration: none; margin-top: 4px;
  }
  .wa-btn svg { width: 18px; height: 18px; fill: #fff; }
  footer {
    text-align: center; padding: 24px; font-size: 12px; color: var(--text-soft);
    border-top: 1px solid var(--gray-border);
  }
  .back-link {
    display: inline-flex; align-items: center; gap: 6px; color: rgba(255,255,255,0.5);
    text-decoration: none; font-size: 13px; margin-bottom: 16px; transition: color 0.2s;
  }
  .back-link:hover { color: #00c853; }
  @media (max-width: 480px) {
    .hero { padding: 40px 20px 36px; }
    .container { padding: 28px 16px 48px; }
  }
`;

export default function WindowsInstallPage() {
  return (
    <>
      <style>{styles}</style>
      <div className="hero">
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <Link href="/install" className="back-link">← All guides</Link>
          <div className="hero-badge">Windows Installation Guide</div>
          <h1>Cyber WhatsApp Pro<br /><span>on your PC</span></h1>
          <p>Get the extension running in under 2 minutes — no Microsoft Store needed</p>
        </div>
      </div>

      <div className="container">
        <div className="notice">
          <div className="notice-icon">
            <svg viewBox="0 0 16 16"><path d="M8 1a7 7 0 100 14A7 7 0 008 1zm.75 4.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.25 7.5a.75.75 0 011.5 0v3.25a.75.75 0 01-1.5 0V7.5z" /></svg>
          </div>
          <div className="notice-text">
            <strong>Chrome extensions work the same on any OS.</strong> No special Windows version is needed. Just follow the steps below to load it into Chrome on your PC.
          </div>
        </div>

        <p className="section-label">What you need</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 36 }}>
          {[
            { icon: '🖥️', title: 'Windows PC', sub: 'Windows 10 or 11' },
            { icon: '🌐', title: 'Google Chrome', sub: 'Not Edge — must be Chrome' },
            { icon: '📦', title: 'Extension ZIP file', sub: 'Sent to you via WhatsApp' },
            { icon: '🔑', title: 'Your license key', sub: 'From your purchase' },
          ].map((item, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid var(--gray-border)', borderRadius: 10, padding: '14px 16px', display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ fontSize: 22 }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-soft)' }}>{item.sub}</div>
              </div>
            </div>
          ))}
        </div>

        <p className="section-label">Installation steps</p>
        <div className="steps">
          {[
            { num: '1', title: 'Download the extension file', desc: 'Save the chrome_Extenton.zip file you received to your PC\'s Downloads folder. If it came via WhatsApp Web, right-click the file → Save as → choose Downloads.' },
            { num: '2', title: 'Extract the ZIP file', desc: 'Open File Explorer → go to your Downloads folder → right-click chrome_Extenton.zip → click Extract All… → click Extract. A folder called chrome_Extenton will appear. Move it somewhere safe — like your Desktop or Documents.', tip: 'Keep this folder on your PC permanently. If you move or delete it, the extension will stop working.' },
            { num: '3', title: 'Open Chrome Extensions settings', desc: 'Open Google Chrome. In the address bar, type exactly:', path: 'chrome://extensions', descAfter: 'Then press Enter.' },
            { num: '4', title: 'Turn on Developer Mode', desc: 'In the top-right corner of the Extensions page, find the Developer mode toggle and switch it ON.', screenshot: true },
            { num: '5', title: 'Click "Load unpacked"', desc: 'After turning on Developer mode, three new buttons appear at the top-left. Click Load unpacked.', buttons: true },
            { num: '6', title: 'Select the extension folder', desc: 'A File Explorer window opens. Navigate to the chrome_Extenton folder you extracted in Step 2. Click once on the folder to select it, then click Select Folder.', tip: 'Select the folder itself — not the ZIP file and not a file inside the folder.' },
            { num: '✓', title: 'Activate your license', desc: 'Cyber WhatsApp Pro now appears in your extensions list. Click the puzzle piece 🧩 icon in Chrome\'s toolbar → click Cyber WhatsApp Pro → enter your activation key and click Activate Premium.', tip: 'To pin the extension to your toolbar: click the puzzle piece → click the pin 📌 icon next to Cyber WhatsApp Pro.', done: true },
          ].map((step, i) => (
            <div className="step" key={i}>
              <div className="step-num-col">
                <div className={`step-num${step.done ? ' done' : ''}`}>{step.num}</div>
                {i < 6 && <div className="step-line" />}
              </div>
              <div className="step-body">
                <div className="step-title">{step.title}</div>
                <div className="step-desc">{step.desc}</div>
                {step.path && (
                  <div className="path-pill">
                    {step.path}
                    <button className="copy-btn" onClick={(e) => { navigator.clipboard.writeText(step.path); e.target.textContent = 'Copied!'; setTimeout(() => e.target.textContent = 'Copy', 1800); }}>Copy</button>
                  </div>
                )}
                {step.descAfter && <div className="step-desc">{step.descAfter}</div>}
                {step.screenshot && (
                  <div className="screenshot">
                    <div className="chrome-bar">
                      <div className="dot r" /><div className="dot y" /><div className="dot g" />
                      <div className="chrome-url">chrome://extensions</div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '4px 0 8px' }}>
                      <div className="toggle-row" style={{ width: 200 }}>
                        <span className="toggle-label">Developer mode</span>
                        <div className="toggle-track"><div className="toggle-thumb" /></div>
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-soft)' }}>Toggle is in the top-right corner</div>
                  </div>
                )}
                {step.buttons && (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
                    <div style={{ background: 'var(--step-bg)', color: '#fff', borderRadius: 7, padding: '8px 14px', fontSize: 13, fontWeight: 500 }}>Load unpacked</div>
                    <div style={{ background: '#f0eeea', border: '1px solid #ddd', borderRadius: 7, padding: '8px 14px', fontSize: 13, color: '#555' }}>Pack extension</div>
                    <div style={{ background: '#f0eeea', border: '1px solid #ddd', borderRadius: 7, padding: '8px 14px', fontSize: 13, color: '#555' }}>Update</div>
                  </div>
                )}
                {step.tip && <div className="tip">{step.tip}</div>}
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', border: '1px solid var(--gray-border)', borderRadius: 'var(--radius)', padding: '20px 22px', marginBottom: 36 }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Don't have Google Chrome on your PC?</div>
          <div style={{ fontSize: 14, color: 'var(--text-mid)', lineHeight: 1.6, marginBottom: 14 }}>Download it free from Google. Works on Windows 10 and 11.</div>
          <a href="https://www.google.com/chrome/" target="_blank" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--step-bg)', color: '#fff', textDecoration: 'none', borderRadius: 8, padding: '10px 18px', fontSize: 13, fontWeight: 500 }}>
            Download Google Chrome →
          </a>
        </div>

        <p className="section-label">Need help?</p>
        <div className="help-card">
          <h3>We're here for you</h3>
          <p>Message us directly on WhatsApp and we'll walk you through the installation step by step.</p>
          <a href="https://wa.me/233541988383" className="wa-btn" target="_blank">
            <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M11.99 2C6.476 2 2 6.477 2 11.99c0 1.95.563 3.768 1.532 5.303L2 22l4.835-1.505A9.952 9.952 0 0011.99 22c5.514 0 9.99-4.477 9.99-9.99C21.98 6.477 17.504 2 11.99 2z" /></svg>
            Chat on WhatsApp
          </a>
        </div>
      </div>

      <footer>Cyber WhatsApp Pro • Support: +233 54 198 8383</footer>
    </>
  );
}