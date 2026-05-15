import Link from "next/link";

export default function InstallPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      color: "#e8e8f0",
      fontFamily: "'DM Sans', sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
    }}>
      <div style={{ textAlign: "center", maxWidth: 600 }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: "rgba(0,229,160,0.1)",
          border: "1px solid rgba(0,229,160,0.25)",
          borderRadius: 100,
          padding: "5px 14px",
          fontSize: 11,
          letterSpacing: "0.08em",
          color: "#00e5a0",
          marginBottom: 24,
          textTransform: "uppercase",
        }}>
          <span style={{ fontSize: 8 }}>●</span> Installation Guide
        </div>

        <h1 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(28px, 5vw, 42px)",
          fontWeight: 800,
          letterSpacing: "-0.02em",
          lineHeight: 1.15,
          marginBottom: 14,
        }}>
          Cyber WhatsApp Pro
        </h1>

        <p style={{
          fontSize: 15,
          color: "rgba(255,255,255,0.45)",
          lineHeight: 1.6,
          marginBottom: 48,
        }}>
          Select your operating system to get started
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 20,
          width: "100%",
        }}>
          <Link href="/install/mac" style={{
            background: "#16161f",
            border: "1px solid #2a2a3a",
            borderRadius: 16,
            padding: "32px 28px",
            textDecoration: "none",
            color: "inherit",
            transition: "all 0.2s",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🍎</div>
            <div style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 18,
              fontWeight: 700,
              marginBottom: 8,
            }}>Mac</div>
            <div style={{ fontSize: 13, color: "#6b6b80", lineHeight: 1.5 }}>
              macOS installation guide<br/>for Google Chrome
            </div>
          </Link>

          <Link href="/install/windows" style={{
            background: "#16161f",
            border: "1px solid #2a2a3a",
            borderRadius: 16,
            padding: "32px 28px",
            textDecoration: "none",
            color: "inherit",
            transition: "all 0.2s",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🖥️</div>
            <div style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 18,
              fontWeight: 700,
              marginBottom: 8,
            }}>Windows</div>
            <div style={{ fontSize: 13, color: "#6b6b80", lineHeight: 1.5 }}>
              Windows installation guide<br/>for Google Chrome
            </div>
          </Link>
        </div>

        <div style={{
          marginTop: 48,
          padding: "16px 20px",
          background: "rgba(0,229,160,0.06)",
          border: "1px solid rgba(0,229,160,0.15)",
          borderRadius: 12,
          fontSize: 13,
          color: "rgba(255,255,255,0.5)",
          lineHeight: 1.6,
        }}>
          Need help? <a href="https://wa.me/233541988383" target="_blank" style={{ color: "#00e5a0", textDecoration: "none", fontWeight: 500 }}>Chat with us on WhatsApp</a>
        </div>
      </div>
    </div>
  );
}