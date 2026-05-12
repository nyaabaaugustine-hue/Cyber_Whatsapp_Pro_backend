export default function Home() {
  return (
    <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ color: '#25d366', fontSize: '2rem' }}>⚡ CWP License Backend</h1>
        <p style={{ color: '#94a3b8' }}>API is running.</p>
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
          POST /api/verify-license — verify a key<br />
          POST /api/admin/generate-key — generate keys (auth required)<br />
          GET /api/admin/keys — list keys (auth required)
        </p>
        <a href="/admin" style={{ color: '#25d366', marginTop: '1rem', display: 'inline-block' }}>
          → Go to Admin Dashboard
        </a>
      </div>
    </main>
  );
}
