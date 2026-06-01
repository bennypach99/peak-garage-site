// Bin tracker section — preview + link to the live tool

function BinTracker() {
  return (
    <section id="tracker" style={{ background: 'var(--ink2)', padding: '88px 0', borderBottom: '1px solid var(--ink4)', position: 'relative', overflow: 'hidden' }}>
      <div className="pg-wrap pg-col-grid pg-tracker-grid" style={{ padding: '0 48px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
        <div>
          <div className="pg-eyebrow" style={{ marginBottom: 12 }}>// 08 — INCLUDED FREE</div>
          <h2 className="pg-display" style={{ fontSize: 88, margin: 0 }}>
            SCAN A BIN.<br/>
            <span className="pg-hl">SEE INSIDE.</span>
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.5, color: 'var(--bone-d70)', marginTop: 24, maxWidth: 520 }}>
            Every Peak shelf ships with QR labels and a free web app — <strong style={{ color: 'var(--yellow)' }}>Peak Bin Finder</strong>. Scan a bin with your phone, log what's in it, search across every bin from anywhere. No app store. No account. Shared with your household.
          </p>
          <div className="pg-col-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 32 }}>
            {[
              ['QR LABELS', 'Avery 82805 · 24 per sheet'],
              ['HOUSEHOLD SYNC', 'Real-time across every device'],
              ['SEARCH ANY ITEM', '"Where are my Christmas lights?"'],
              ['EXPORT BACKUP', 'Excel export · CSV anytime'],
            ].map(([k,v]) => (
              <div key={k} style={{ borderTop: '1px solid var(--ink4)', paddingTop: 12 }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--yellow)', letterSpacing: '0.12em' }}>{k}</div>
                <div style={{ fontSize: 13, color: 'var(--bone)', marginTop: 4, fontFamily: 'var(--mono)' }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
            <a href={PG_R('binTracker', 'bin-tracker.html')} className="pg-btn" target="_blank" rel="noopener">
              OPEN PEAK BIN FINDER →
              <span style={{ background: 'var(--ink)', color: 'var(--yellow)', width: 24, height: 24, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>↗</span>
            </a>
            <button className="pg-btn pg-btn-ghost" onClick={() => {
              const iframe = document.getElementById('pg-tracker-iframe');
              if (iframe) iframe.contentWindow?.location.reload();
            }}>RESET DEMO</button>
          </div>
        </div>

        {/* Phone frame containing iframe of bin tracker */}
        <div className="pg-tracker-phone" style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <div style={{
            width: 360, height: 720,
            background: '#000',
            borderRadius: 42,
            padding: 12,
            boxShadow: '0 30px 80px -20px rgba(0,0,0,0.7), 0 0 0 1px var(--ink4)',
            position: 'relative',
          }}>
            {/* speaker / camera */}
            <div style={{
              position: 'absolute', top: 24, left: '50%', transform: 'translateX(-50%)',
              width: 110, height: 26, background: '#000', borderRadius: 16, zIndex: 2,
              display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 16,
            }}>
              <div style={{ width: 8, height: 8, borderRadius: 999, background: '#111', border: '1px solid #222' }} />
            </div>
            <div style={{
              width: '100%', height: '100%',
              borderRadius: 32, overflow: 'hidden',
              background: '#1a1a1a',
              position: 'relative',
            }}>
              <iframe
                id="pg-tracker-iframe"
                src={PG_R('binTracker', 'bin-tracker.html') + '#demo=1'}
                title="Peak Bin Finder"
                style={{ width: '100%', height: '100%', border: 'none', background: '#0E0E0E' }}
              />
            </div>
          </div>
          <div style={{
            position: 'absolute', top: -8, right: 12,
            background: 'var(--yellow)', color: 'var(--ink)',
            padding: '8px 14px',
            fontFamily: 'var(--display)', fontWeight: 800, fontSize: 13, letterSpacing: '0.06em',
            textTransform: 'uppercase', transform: 'skewX(-6deg) rotate(3deg)',
          }}>LIVE DEMO ↘</div>
        </div>
      </div>
    </section>
  );
}

window.BinTracker = BinTracker;
