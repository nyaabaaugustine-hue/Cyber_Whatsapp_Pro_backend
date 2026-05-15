"use client";
import Link from "next/link";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0a0a0f; --surface: #111118; --card: #16161f; --border: #2a2a3a;
    --accent: #00e5a0; --accent2: #7c6bff; --text: #e8e8f0; --muted: #6b6b80;
  }
  html, body { height: 100%; background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; }

  /* NAV */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    background: rgba(10,10,15,0.85); backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border);
    padding: 0 32px; height: 64px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .nav-brand {
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: 20px;
    color: var(--accent); text-decoration: none;
  }
  .nav-brand span { color: var(--text); }
  .nav-links { display: flex; align-items: center; gap: 28px; }
  .nav-link {
    color: var(--muted); text-decoration: none; font-size: 13px; font-weight: 500;
    transition: color 0.2s; letter-spacing: 0.02em;
  }
  .nav-link:hover { color: var(--text); }
  .nav-link.active { color: var(--accent); }
  .nav-cta {
    background: var(--accent); color: var(--bg); border: none; border-radius: 8px;
    padding: 8px 18px; font-size: 13px; font-weight: 600; text-decoration: none;
    transition: opacity 0.2s;
  }
  .nav-cta:hover { opacity: 0.85; }

  /* HERO */
  .hero {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    text-align: center; padding: 100px 24px 60px; position: relative; overflow: hidden;
  }
  .hero::before {
    content: ''; position: absolute; top: -200px; left: 50%; transform: translateX(-50%);
    width: 800px; height: 800px;
    background: radial-gradient(circle, rgba(0,229,160,0.06) 0%, transparent 60%);
    pointer-events: none;
  }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(0,229,160,0.08); border: 1px solid rgba(0,229,160,0.2);
    border-radius: 100px; padding: 6px 16px; font-size: 12px;
    letter-spacing: 0.08em; color: var(--accent); margin-bottom: 28px; text-transform: uppercase;
  }
  .hero-badge::before { content: '●'; font-size: 8px; }
  .hero h1 {
    font-family: 'Syne', sans-serif; font-size: clamp(36px, 7vw, 64px);
    font-weight: 800; letter-spacing: -0.03em; line-height: 1.08; margin-bottom: 20px;
  }
  .hero h1 span { color: var(--accent); }
  .hero p {
    font-size: clamp(15px, 2vw, 18px); color: var(--muted); max-width: 520px;
    margin: 0 auto 40px; line-height: 1.65;
  }
  .hero-actions { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
  .btn-primary {
    background: var(--accent); color: var(--bg); border: none; border-radius: 10px;
    padding: 14px 28px; font-size: 14px; font-weight: 600; text-decoration: none;
    transition: opacity 0.2s, transform 0.1s;
  }
  .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
  .btn-secondary {
    background: transparent; color: var(--text); border: 1px solid var(--border);
    border-radius: 10px; padding: 14px 28px; font-size: 14px; font-weight: 500;
    text-decoration: none; transition: border-color 0.2s, color 0.2s;
  }
  .btn-secondary:hover { border-color: var(--accent); color: var(--accent); }

  /* FEATURES */
  .features {
    padding: 80px 24px; max-width: 1000px; margin: 0 auto;
  }
  .features-label {
    text-align: center; font-size: 11px; font-weight: 600; letter-spacing: 0.14em;
    text-transform: uppercase; color: var(--muted); margin-bottom: 40px;
  }
  .features-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;
  }
  .feature-card {
    background: var(--card); border: 1px solid var(--border); border-radius: 14px;
    padding: 28px 24px; transition: border-color 0.2s;
  }
  .feature-card:hover { border-color: rgba(0,229,160,0.3); }
  .feature-icon {
    width: 44px; height: 44px; border-radius: 10px;
    background: rgba(0,229,160,0.08); display: flex; align-items: center; justify-content: center;
    font-size: 20px; margin-bottom: 16px;
  }
  .feature-card h3 {
    font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; margin-bottom: 8px;
  }
  .feature-card p { font-size: 14px; color: var(--muted); line-height: 1.6; }

  /* CTA */
  .cta-section {
    padding: 80px 24px; text-align: center;
  }
  .cta-box {
    max-width: 600px; margin: 0 auto; background: var(--card); border: 1px solid var(--border);
    border-radius: 20px; padding: 48px 32px; position: relative; overflow: hidden;
  }
  .cta-box::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
  }
  .cta-box h2 {
    font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 700; margin-bottom: 12px;
  }
  .cta-box p { font-size: 14px; color: var(--muted); line-height: 1.6; margin-bottom: 28px; }

  /* FOOTER */
  footer {
    text-align: center; padding: 32px 24px; font-size: 12px; color: var(--muted);
    border-top: 1px solid var(--border);
  }
  footer a { color: var(--accent); text-decoration: none; }
  footer a:hover { text-decoration: underline; }

  /* MOBILE MENU */
  .menu-toggle {
    display: none; background: none; border: none; color: var(--text);
    font-size: 24px; cursor: pointer; padding: 4px;
  }
  @media (max-width: 640px) {
    .nav { padding: 0 16px; }
    .nav-links { display: none; }
    .nav-links.open {
      display: flex; flex-direction: column; position: absolute;
      top: 64px; left: 0; right: 0; background: var(--surface);
      border-bottom: 1px solid var(--border); padding: 20px 16px; gap: 16px;
    }
    .menu-toggle { display: block; }
  }
`;

export default function Home() {
  return (
    <>
      <style>{styles}</style>

      {/* NAV */}
      <nav className="nav">
        <Link href="/" className="nav-brand">CWP <span>Pro</span></Link>
        <button className="menu-toggle" onClick={() => {
          const el = document.getElementById('nav-links');
          el.classList.toggle('open');
        }}>☰</button>
        <div className="nav-links" id="nav-links">
          <Link href="/" className="nav-link active">Home</Link>
          <Link href="/install" className="nav-link">Install Guide</Link>
          <Link href="/admin" className="nav-link">Admin</Link>
          <a href="https://wa.me/233541988383" target="_blank" className="nav-cta">Contact Us</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div>
          <div className="hero-badge">Chrome Extension</div>
          <h1>Cyber WhatsApp<br /><span>Pro</span></h1>
          <p>Supercharge your WhatsApp with powerful tools for bulk messaging, contact management, data export, and more.</p>
          <div className="hero-actions">
            <Link href="/install" className="btn-primary">Get Started →</Link>
            <a href="https://wa.me/233541988383" target="_blank" className="btn-secondary">Contact Support</a>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="features-label">Features</div>
        <div className="features-grid">
          {[
            { icon: '📨', title: 'Bulk Messaging', desc: 'Send messages to multiple contacts at once with personalized content.' },
            { icon: '📇', title: 'Contact Management', desc: 'Organize, import, and export your WhatsApp contacts effortlessly.' },
            { icon: '📊', title: 'Data Export', desc: 'Export chat data and contact lists to CSV or Excel for analysis.' },
            { icon: '🔒', title: 'License Protected', desc: 'Secure activation system with device binding and admin control.' },
            { icon: '⚡', title: 'Fast & Lightweight', desc: 'Runs as a Chrome extension — no extra software needed.' },
            { icon: '🛟', title: 'Dedicated Support', desc: 'Get help directly via WhatsApp with step-by-step guidance.' },
          ].map((f, i) => (
            <div className="feature-card" key={i}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-box">
          <h2>Ready to get started?</h2>
          <p>Follow our step-by-step installation guide to set up Cyber WhatsApp Pro on your computer in under 2 minutes.</p>
          <Link href="/install" className="btn-primary">View Install Guide →</Link>
        </div>
      </section>

      <footer>
        Cyber WhatsApp Pro • <a href="https://wa.me/233541988383" target="_blank">Support</a> • +233 54 198 8383
      </footer>
    </>
  );
}