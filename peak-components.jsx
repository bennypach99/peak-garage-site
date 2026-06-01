// Peak Garage Solutions — main page components
// Brand: off-black + electric yellow (matches tote lids), Archivo display + Plex Mono.

const PG_OWNER = 'Benny Pacheco';
const PG_PHONE = '289-707-4755';
const PG_PHONE_TEL = '+12897074755';
const PG_PHONE_SMS = 'sms:+12897074755';
const PG_DOMAIN = 'peakgaragesolutions.ca';
const PG_REGION = 'Burlington & surrounding areas';
const PG_EST = '2024';

// Asset-URL resolver: prefers a blob URL injected by the standalone bundler,
// falls back to the project-relative path in dev mode.
function PG_R(id, fallback) {
  if (typeof window !== 'undefined' && window.__resources && window.__resources[id]) {
    return window.__resources[id];
  }
  return fallback;
}

// Each item knows the config it represents — clicking jumps to #build with this loaded.
// Tag price is the lowest base price for that build (no add-ons).
// Clicking loads cols/rows or dualKind only — NO add-ons applied.
const PG_GALLERY = [
  { id: 'gallery3', src: 'assets/gallery3.jpg', label: 'Natural pine · 4-HIGH double w/ shelves · Aldershot', tag: 'Double 4H · from $530', span: 2,
    cfg: { dualKind: '4high' } },
  { id: 'gallery1', src: 'assets/gallery1.jpg', label: '2-wide · 3-high · walnut stain + casters', tag: '6 totes · from $132',
    cfg: { cols: 2, rows: 3 } },
  { id: 'gallery2', src: 'assets/gallery2.jpg', label: '2-wide · 4-high · walnut stain + casters', tag: '8 totes · from $176',
    cfg: { cols: 2, rows: 4 } },
  { id: 'gallery4', src: 'assets/gallery4.jpg', label: '3-wide · 2-high · maple top + casters', tag: '6 totes · from $132',
    cfg: { cols: 3, rows: 2 } },
  { id: 'gallery5', src: 'assets/gallery5.jpg', label: '4-wide · 2-high · maple top + casters', tag: '8 totes · from $176',
    cfg: { cols: 4, rows: 2 } },
  { id: 'gallery6', src: 'assets/gallery6.jpg', label: 'Natural pine · 2-HIGH double w/ shelves', tag: 'Double 2H · from $340', span: 2,
    cfg: { dualKind: '2high' } },
  { id: 'gallery7', src: 'assets/gallery7.jpg', label: '4-wide · 4-high · walnut stain + casters', tag: '16 totes · from $352',
    cfg: { cols: 4, rows: 4 } },
  { id: 'gallery8', src: 'assets/gallery8.jpg', label: '4-wide · 5-high · walnut stain + casters', tag: '20 totes · from $440',
    cfg: { cols: 4, rows: 5 } },
  { id: 'gallery9', src: 'assets/gallery9.jpg', label: '5-wide · 5-high · walnut stain + casters', tag: '25 totes · from $550',
    cfg: { cols: 5, rows: 5 } },
];

/* ─────────────────────────────────────────── TopBar + Nav */

function TopBar() {
  return (
    <div style={{
      background: 'var(--ink)', color: 'var(--bone-d50)',
      borderBottom: '1px solid var(--ink4)',
      fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.12em',
      textTransform: 'uppercase',
    }}>
      <div className="pg-wrap pg-topbar-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 48px', gap: 24 }}>
        <span className="pg-topbar-detail">// HAND-BUILT IN BURLINGTON · EST. {PG_EST} · FITS COSTCO · HDX · GSC 102 L TOTES</span>
        <span style={{ display: 'flex', gap: 20, alignItems: 'center', flexShrink: 0 }}>
          <span className="pg-topbar-detail">★ 4.9 · 60+ REVIEWS</span>
          <a href={`tel:${PG_PHONE_TEL}`} style={{ color: 'var(--yellow)' }}>☏ {PG_PHONE}</a>
        </span>
      </div>
    </div>
  );
}

function Nav() {
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(14,14,14,0.92)', backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--ink4)',
    }}>
      <div className="pg-wrap pg-nav" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 72, padding: '0 48px',
      }}>
        <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <img src={PG_R('logo', 'assets/logo.png')} alt="Peak" style={{ width: 42, height: 42, borderRadius: 4 }} />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 17, letterSpacing: '-0.01em', textTransform: 'uppercase' }}>PEAK GARAGE SOLUTIONS</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--bone-d50)', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 4 }}>Burlington, ON</span>
          </div>
        </a>
        <div className="pg-nav-links" style={{ display: 'flex', gap: 22, fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {[['01','Build','#build'],['02','Gallery','#gallery'],['03','How','#how'],['04','Reviews','#reviews'],['05','Tracker','#tracker'],['06','FAQ','#faq']].map(([n,l,h]) => (
            <a key={l} href={h} style={{ color: 'var(--bone)', opacity: 0.85, display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
              <span style={{ color: 'var(--yellow)' }}>{n}</span>{l}
            </a>
          ))}
        </div>
        <div className="pg-nav-cta-row" style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
          <a className="pg-btn pg-btn-ghost pg-btn-small pg-nav-ghost" href={PG_PHONE_SMS} style={{ whiteSpace: 'nowrap' }}>☏ TEXT</a>
          <a className="pg-btn pg-btn-small" href="#quote" style={{ whiteSpace: 'nowrap' }}>QUOTE →</a>
        </div>
      </div>
    </nav>
  );
}

/* ─────────────────────────────────────────── Hero */

function Hero() {
  return (
    <section id="top" style={{ background: 'var(--ink)', color: 'var(--bone)', position: 'relative', overflow: 'hidden' }}>
      <div className="pg-wrap pg-col-grid pg-hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: 48, padding: '64px 48px 56px', alignItems: 'center' }}>
        <div>
          <div className="pg-eyebrow" style={{ marginBottom: 20 }}>// CUSTOM TOTE STORAGE · BUILT TO SPEC</div>
          <h1 className="pg-display" style={{ fontSize: 140, margin: 0 }}>
            A SHELF<br/>
            <span className="pg-hl">SIZED</span><br/>
            FOR YOUR<br/>
            TOTES.
          </h1>
          <p style={{ fontSize: 19, lineHeight: 1.5, color: 'var(--bone-d70)', marginTop: 28, maxWidth: 500 }}>
            Hand-built pine and bin garage storage, sized to fit Costco, HDX, and GSC 27&nbsp;Gal / 102&nbsp;L totes. From 2-bin starters to 30-bin full walls — pick your width, height, add-ons, and get an instant price.
          </p>
          <div className="pg-hero-cta" style={{ display: 'flex', gap: 12, marginTop: 36 }}>
            <a className="pg-btn" href="#build">
              CONFIGURE &amp; PRICE
              <span style={{ background: 'var(--ink)', color: 'var(--yellow)', width: 24, height: 24, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>→</span>
            </a>
            <a className="pg-btn pg-btn-ghost" href={PG_PHONE_SMS}>☏ TEXT {PG_PHONE}</a>
          </div>
          <div className="pg-hero-stats" style={{ display: 'flex', gap: 32, marginTop: 48, fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--bone-d50)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            <div><span style={{ color: 'var(--yellow)' }}>★ 4.9</span> · 60+ REVIEWS</div>
            <div>240+ DELIVERED</div>
            <div>10–14 DAY BUILDS</div>
            <div>DELIVERY + SETUP INCLUDED</div>
          </div>
        </div>

        <div className="pg-hero-photo" style={{ position: 'relative' }}>
          <div style={{
            aspectRatio: '4/3',
            backgroundImage: `url(${PG_R('gallery3', 'assets/gallery3.jpg')})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            position: 'relative',
          }}>
            {/* Spec overlay */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} viewBox="0 0 800 600" preserveAspectRatio="none">
              {/* corner brackets */}
              <g stroke="var(--yellow)" strokeWidth="1.4" fill="none">
                <path d="M 40 40 L 40 70 M 40 40 L 70 40"/>
                <path d="M 760 40 L 760 70 M 760 40 L 730 40"/>
                <path d="M 40 560 L 40 530 M 40 560 L 70 560"/>
                <path d="M 760 560 L 760 530 M 760 560 L 730 560"/>
              </g>
              {/* call-outs */}
              <g stroke="var(--yellow)" strokeWidth="0.8" fill="none" opacity="0.85">
                <circle cx="200" cy="320" r="7"/>
                <line x1="207" y1="320" x2="280" y2="265"/>
                <circle cx="580" cy="320" r="7"/>
                <line x1="573" y1="320" x2="500" y2="265"/>
                <circle cx="395" cy="380" r="7"/>
                <line x1="402" y1="380" x2="470" y2="430"/>
              </g>
              <g fontFamily="var(--mono)" fontSize="11" fill="var(--bone)">
                <text x="285" y="258">DOUBLE 4-HIGH</text>
                <text x="285" y="272" fill="var(--bone-d70)">8 totes per side · natural pine</text>
                <text x="500" y="258">FULL-WIDTH TOP</text>
                <text x="500" y="272" fill="var(--bone-d70)">¾″ maple included</text>
                <text x="475" y="446">OPEN WORKBENCH SHELVES</text>
                <text x="475" y="460" fill="var(--bone-d70)">in the middle section</text>
              </g>
              {/* tick marks */}
              <g stroke="var(--yellow)" strokeWidth="1" fill="none">
                <line x1="540" y1="40" x2="560" y2="40"/>
                <line x1="550" y1="30" x2="550" y2="50"/>
              </g>
              <text x="40" y="30" fill="var(--yellow)" fontFamily="var(--mono)" fontSize="11" letterSpacing="2">FIG. 1 / FULL GARAGE BUILD · DOUBLE 4-HIGH W/ SHELVES · ALDERSHOT</text>
            </svg>
          </div>
          <div style={{
            position: 'absolute', right: 18, bottom: 18,
            background: 'var(--yellow)', color: 'var(--ink)',
            padding: '12px 16px', fontFamily: 'var(--display)', fontWeight: 800, fontSize: 14, letterSpacing: '0.04em',
            textTransform: 'uppercase', transform: 'skewX(-6deg)',
          }}>DOUBLE 4H · FROM $600</div>
        </div>
      </div>

      {/* Marquee */}
      <Marquee items={['HEAVY DUTY','★','CUSTOM SIZING','★','LOCAL DELIVERY','★','HAND-BUILT IN ALDERSHOT','★','MODULAR','★','10–14 DAY BUILDS','★','FAST QUOTE','★']} />
    </section>
  );
}

function Marquee({ items }) {
  return (
    <div style={{
      background: 'var(--yellow)', color: 'var(--ink)',
      padding: '16px 0', overflow: 'hidden',
      fontFamily: 'var(--display)', fontWeight: 800, fontSize: 22, letterSpacing: '-0.01em',
      textTransform: 'uppercase', whiteSpace: 'nowrap',
    }}>
      <div style={{ display: 'flex', gap: 32, animation: 'pg-marquee 30s linear infinite', width: 'max-content' }}>
        {Array.from({length: 8}).map((_,i) => items.map((it,j) => <span key={`${i}-${j}`}>{it}</span>)).flat()}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────── Gallery */

function Gallery() {
  function loadInBuilder(cfg, e) {
    e.preventDefault();
    // Always clear add-ons when loading from gallery — show the bare build at its base price.
    const payload = { ...cfg, addons: [], stain: 'walnut' };
    window.dispatchEvent(new CustomEvent('pg-load-config', { detail: payload }));
    const el = document.getElementById('build');
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 60;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }
  return (
    <section id="gallery" style={{ padding: '88px 0', borderBottom: '1px solid var(--ink4)' }}>
      <div className="pg-wrap" style={{ padding: '0 48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
          <div>
            <div className="pg-eyebrow" style={{ marginBottom: 12 }}>// 02 — IN THE WILD</div>
            <h2 className="pg-display" style={{ fontSize: 88, margin: 0 }}>
              SHIPPED<br/>THIS YEAR.
            </h2>
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--bone-d50)', maxWidth: 320, letterSpacing: '0.04em' }}>
            Real photos. Real customers. Real garages. <strong style={{ color: 'var(--yellow)' }}>Tap any build to load it in the builder.</strong>
          </div>
        </div>
        <div className="pg-col-grid pg-gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {PG_GALLERY.map((g, i) => (
            <a key={i} href="#build" onClick={(e) => loadInBuilder(g.cfg, e)} style={{
              aspectRatio: '5/3',
              position: 'relative', overflow: 'hidden',
              background: '#0E0E0E',
              cursor: 'pointer',
            }}>
              <img src={PG_R(g.id, g.src)} alt={g.label} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', transition: 'transform .4s' }} />
              <div style={{ position: 'absolute', top: 12, left: 12, background: 'var(--ink)', color: 'var(--yellow)', padding: '4px 8px', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.1em', zIndex: 2 }}>{g.tag}</div>
              <div style={{ position: 'absolute', top: 12, right: 12, background: 'var(--yellow)', color: 'var(--ink)', padding: '4px 8px', fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.08em', opacity: 0, transition: 'opacity .15s', zIndex: 2 }} className="pg-gallery-cta">LOAD →</div>
              <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12, background: 'rgba(14,14,14,0.85)', color: 'var(--bone)', padding: '6px 10px', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.08em', zIndex: 2 }}>{g.label}</div>
            </a>
          ))}
        </div>
        <style>{`
          #gallery a:hover .pg-gallery-cta { opacity: 1 !important; }
          #gallery a:hover img { transform: scale(1.03); }
        `}</style>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────── How it works */

function How() {
  const steps = [
    { n: '01', t: 'SKETCH OR SHOOT', d: 'Photo of your garage wall plus rough dimensions. Or just tell me how many totes you need to store.' },
    { n: '02', t: 'INSTANT PRICE', d: 'Use the builder above for an instant fixed price. Or text me — I quote back within 24 hours.' },
    { n: '03', t: 'WORKSHOP BUILD', d: 'Kiln-dried pine, pocket-screw joinery, stained or natural. Built in my Aldershot shop in 10–14 days.' },
    { n: '04', t: 'DELIVERED & SET UP', d: 'Next-day or two-day delivery once it’s ready. Free in-garage setup across the GTA core — wheel it in (if you ordered casters) and you’re done.' },
  ];
  return (
    <section id="how" style={{ background: 'var(--ink2)', padding: '88px 0', borderBottom: '1px solid var(--ink4)' }}>
      <div className="pg-wrap" style={{ padding: '0 48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48 }}>
          <div>
            <div className="pg-eyebrow" style={{ marginBottom: 12 }}>// 03 — PROCESS</div>
            <h2 className="pg-display" style={{ fontSize: 88, margin: 0 }}>
              FOUR STEPS.<br/>TWO WEEKS.
            </h2>
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--bone-d50)', maxWidth: 260, letterSpacing: '0.04em', textAlign: 'right' }}>
            NO SHOWROOM, NO MIDDLEMAN.<br/>JUST A WOODWORKER, A WORKSHOP, A TRUCK.
          </div>
        </div>
        <div className="pg-col-grid pg-how-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--ink4)', border: '1px solid var(--ink4)' }}>
          {steps.map(s => (
            <div key={s.n} style={{ background: 'var(--ink)', padding: 32, minHeight: 280 }}>
              <div className="pg-eyebrow">STEP / {s.n}</div>
              <div className="pg-display" style={{ fontSize: 72, color: 'var(--yellow)', margin: '16px 0 28px' }}>{s.n}</div>
              <h3 className="pg-display" style={{ fontSize: 22, margin: 0 }}>{s.t}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--bone-d70)', marginTop: 10 }}>{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────── About Benny */

function About() {
  return (
    <section id="about" style={{ padding: '88px 0', borderBottom: '1px solid var(--ink4)' }}>
      <div className="pg-wrap pg-col-grid pg-about-grid" style={{ padding: '0 48px', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 64, alignItems: 'center' }}>
        <div>
          <div className="pg-eyebrow" style={{ marginBottom: 12 }}>// 05 — THE WORKSHOP</div>
          <h2 className="pg-display" style={{ fontSize: 88, margin: 0 }}>
            ONE GUY.<br/>
            <span style={{ color: 'var(--yellow)' }}>ONE WORKSHOP.</span><br/>
            ZERO BS.
          </h2>
          <div className="pg-col-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginTop: 40 }}>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--bone-d70)', margin: 0 }}>
              I'm {PG_OWNER}. I started Peak Garage Solutions in {PG_EST} because I couldn't find a shelf sized right for the 27 Gal / 102 L totes that everyone in Burlington has from Costco. So I built one for my own garage. Then a neighbor wanted one.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--bone-d70)', margin: 0 }}>
              Two years and a few hundred builds later, it's still just me in the shop. Every shelf is built by hand, by the same set of hands. I quote it, I build it, I deliver it. That's the whole pitch.
            </p>
          </div>
          <div style={{ marginTop: 40, fontFamily: 'var(--display)', fontWeight: 800, fontSize: 22, letterSpacing: '-0.01em', textTransform: 'uppercase' }}>
            — {PG_OWNER.toUpperCase()}<span style={{ color: 'var(--yellow)' }}> / BUILDER & OWNER</span>
          </div>
        </div>
        <div style={{ aspectRatio: '3/4', background: 'var(--ink2)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(45deg, var(--ink2) 0 12px, var(--ink3) 12px 24px)' }} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--bone-d50)', letterSpacing: '0.1em', textAlign: 'center', textTransform: 'uppercase' }}>
            [ PORTRAIT ·<br/>{PG_OWNER.toUpperCase()}<br/>IN THE WORKSHOP ]
          </div>
          <div style={{ position: 'absolute', top: 16, left: 16, background: 'var(--yellow)', color: 'var(--ink)', padding: '6px 10px', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.12em' }}>// FIG. 4</div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────── Reviews */

function Reviews() {
  const reviews = [
    { q: 'Benny measured our wall, drew it up the same afternoon, and installed two weeks later. Cleanest the garage has been since we moved in.', a: 'SARAH & DEV', loc: 'ALDERSHOT', build: 'PG-16' },
    { q: 'I priced Gladiator and the Costco systems — this was half, looks twice as good, and the bins actually fit without wiggle.', a: 'TOM R.', loc: 'TYANDAGA', build: 'PG-24' },
    { q: 'Asked for a 36-bin wall with a notch around the breaker panel. He just figured it out. The QR inventory app is icing.', a: 'MEGAN H.', loc: 'OAKVILLE', build: 'PG-36' },
  ];
  return (
    <section id="reviews" style={{ background: 'var(--ink2)', padding: '88px 0', borderBottom: '1px solid var(--ink4)' }}>
      <div className="pg-wrap" style={{ padding: '0 48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
          <div>
            <div className="pg-eyebrow" style={{ marginBottom: 12 }}>// 06 — REVIEWS</div>
            <h2 className="pg-display" style={{ fontSize: 80, margin: 0 }}>
              WORD OF<br/>MOUTH.
            </h2>
          </div>
          <div className="pg-display" style={{ fontSize: 26 }}>
            <span style={{ background: 'var(--yellow)', color: 'var(--ink)', padding: '4px 12px' }}>★ 4.9</span>
            <span style={{ marginLeft: 12 }}>· 60+ REVIEWS</span>
          </div>
        </div>
        <div className="pg-col-grid pg-reviews-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {reviews.map((r,i) => (
            <div key={i} style={{ background: 'var(--ink)', padding: 28, position: 'relative', minHeight: 280 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.1em' }}>
                <span style={{ color: 'var(--yellow)' }}>{r.build}</span>
                <span style={{ color: 'var(--bone-d50)' }}>★★★★★</span>
              </div>
              <p className="pg-display" style={{ fontSize: 22, lineHeight: 1.2, letterSpacing: '-0.01em', textTransform: 'none', fontWeight: 600, margin: 0 }}>"{r.q}"</p>
              <div style={{ position: 'absolute', bottom: 28, left: 28, right: 28, display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.1em' }}>
                <span>{r.a}</span>
                <span style={{ color: 'var(--yellow)' }}>{r.loc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────── Delivery */

function Delivery() {
  const free = [
    ['MILTON',                  '~10 KM'],
    ['BURLINGTON',              '~12 KM'],
    ['WATERDOWN / STONEY CK',   '~15 KM'],
    ['HAMILTON / DUNDAS',       '~20 KM'],
    ['OAKVILLE',                '~22 KM'],
  ];
  const paid = [
    ['MISSISSAUGA',                                       '$40'],
    ['TORONTO / BRAMPTON / ETOBICOKE',                    '$50'],
    ['CAMBRIDGE / WATERLOO / GUELPH',                     '$50'],
    ['BRANTFORD / GRIMSBY / NIAGARA FALLS',               "LET'S TALK"],
  ];
  return (
    <section id="delivery" style={{ padding: '88px 0', borderBottom: '1px solid var(--ink4)' }}>
      <div className="pg-wrap pg-col-grid pg-delivery-grid" style={{ padding: '0 48px', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 48, alignItems: 'center' }}>
        <div>
          <div className="pg-eyebrow" style={{ marginBottom: 12 }}>// 07 — DELIVERY & SETUP</div>
          <h2 className="pg-display" style={{ fontSize: 64, margin: 0 }}>
            DELIVERY +<br/>SETUP
            <span className="pg-hl" style={{ marginLeft: 12 }}>INCLUDED.</span>
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.5, color: 'var(--bone-d70)', marginTop: 20, maxWidth: 460 }}>
            These shelves are big and heavy — so delivery and in-garage setup are baked into the price for the cities below. Most orders ship next day or within two days of being ready.
          </p>
          <div style={{ marginTop: 24 }}>
            <div className="pg-eyebrow" style={{ marginBottom: 8 }}>FREE DELIVERY + SETUP</div>
            {free.map(([k,d]) => (
              <div key={k} style={{
                display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 16, alignItems: 'center',
                borderTop: '1px solid var(--ink4)', padding: '11px 0',
                fontFamily: 'var(--mono)', fontSize: 13, letterSpacing: '0.04em',
              }}>
                <span>{k}</span>
                <span style={{ color: 'var(--bone-d50)' }}>{d}</span>
                <span style={{ background: 'var(--yellow)', color: 'var(--ink)', padding: '0 8px', minWidth: 100, textAlign: 'right' }}>FREE</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 24 }}>
            <div className="pg-eyebrow" style={{ marginBottom: 8, color: 'var(--bone-d70)' }}>FLAT DELIVERY FEE</div>
            {paid.map(([k,v]) => (
              <div key={k} style={{
                display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'center',
                borderTop: '1px solid var(--ink4)', padding: '11px 0',
                fontFamily: 'var(--mono)', fontSize: 13, letterSpacing: '0.04em',
              }}>
                <span style={{ color: 'var(--bone-d70)' }}>{k}</span>
                <span style={{ background: 'var(--ink2)', color: 'var(--yellow)', border: '1px solid var(--yellow)', padding: '0 8px', minWidth: 100, textAlign: 'right' }}>{v}</span>
              </div>
            ))}
          </div>
          <p style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--bone-d50)', marginTop: 16, letterSpacing: '0.08em' }}>
            FURTHER? TEXT BENNY — HAPPY TO QUOTE.
          </p>
        </div>
        <div style={{ aspectRatio: '4/3', background: 'var(--ink2)', position: 'relative', overflow: 'hidden' }}>
          <svg viewBox="0 0 480 360" style={{ width: '100%', height: '100%' }}>
            <defs>
              <pattern id="pg-mapgrid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(244,241,234,0.06)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="480" height="360" fill="url(#pg-mapgrid)"/>
            <path d="M 0 260 Q 120 240 240 270 T 480 260 L 480 360 L 0 360 Z" fill="rgba(245,216,32,0.06)" stroke="rgba(245,216,32,0.3)" strokeDasharray="3 3"/>
            {[70, 130, 190].map((r,i) => (
              <circle key={r} cx="220" cy="190" r={r} fill="none" stroke="var(--yellow)" strokeOpacity={0.4 - i*0.1}/>
            ))}
            <rect x="216" y="186" width="8" height="8" fill="var(--yellow)"/>
            <text x="232" y="195" fill="var(--yellow)" fontSize="11" fontFamily="var(--mono)" letterSpacing="2">WORKSHOP</text>
            {[
              [285, 170, 'BURLINGTON', 'FREE'],
              [360, 145, 'OAKVILLE', 'FREE'],
              [150, 160, 'HAMILTON', 'FREE'],
              [240, 100, 'WATERDOWN', 'FREE'],
              [340, 95, 'MILTON', 'FREE'],
              [395, 175, 'MISSISSAUGA', '$40'],
              [440, 130, 'TORONTO', '$50'],
              [60, 105, 'CAMBRIDGE', '$50'],
              [30, 60, 'KW / GUELPH', '$50'],
              [120, 245, 'BRANTFORD / NIAGARA', '$$'],
            ].map(([x,y,n,v]) => (
              <g key={n}>
                <line x1="220" y1="190" x2={x} y2={y} stroke="var(--yellow)" strokeOpacity={v === 'FREE' ? 0.45 : 0.2} strokeDasharray="2 3"/>
                <circle cx={x} cy={y} r="3" fill={v === 'FREE' ? 'var(--yellow)' : 'var(--bone)'}/>
                <text x={x+8} y={y} fill="var(--bone)" fontSize="10" fontFamily="var(--mono)">{n}</text>
                <text x={x+8} y={y+12} fill={v === 'FREE' ? 'var(--yellow)' : 'rgba(244,241,234,0.5)'} fontSize="9" fontFamily="var(--mono)">{v}</text>
              </g>
            ))}
            <text x="20" y="340" fill="rgba(244,241,234,0.5)" fontSize="9" fontFamily="var(--mono)" letterSpacing="2">LAKE ONTARIO</text>
            <text x="20" y="30" fill="var(--yellow)" fontSize="10" fontFamily="var(--mono)" letterSpacing="2">FIG. 5 — DELIVERY ZONES / NEXT-DAY OR 2-DAY</text>
          </svg>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────── FAQ */

function FAQ() {
  const qs = [
    ['Do you only build for 102 L / 27 Gal totes?', "That's the standard — the totes Costco, HDX, and GSC all sell. But I've built shelves for 17 Gal small bins, mixed walls, and oddball totes too. Send me a photo with rough dimensions and I'll size around it."],
    ['How heavy can each shelf go?', "Each shelf level handles 2,000 lb total — these aren’t wire racks. If you go with the wheel casters, each individual caster is rated to 250 lb, so even a fully loaded 24-bin wall rolls easy."],
    ['Do you install?', "Yes — delivery and in-garage setup are included in the price for Milton, Burlington, Waterdown/Stoney Creek, Hamilton/Dundas, and Oakville. Mississauga is $40 flat, Toronto/Brampton/Etobicoke/Cambridge/Waterloo/Guelph is $50 flat, and further out (Brantford, Grimsby, Niagara) we’ll work it out. No drilling required unless you want them wall-anchored."],,
    ['Can I add a workbench later?', "Yes — everything is modular. Workbench bays, extra columns, casters, and stain finishes can all be added later."],
    ['How long does it take?', "Workshop build is 10–14 days typical — then most orders are delivered the next day or within two days of being ready. Holiday season (Oct–Dec) runs about 3 weeks. A 25% deposit holds your slot in the build queue."],,
    ['Payment?', "E-transfer, debit, or cash on delivery. 25% deposit up front, balance on delivery."],
    ['Do the totes come with the shelf?', "Optional. Costco 27 Gal black-and-yellow totes are $15 each as an add-on, or bring your own."],
  ];
  return (
    <section id="faq" style={{ background: 'var(--ink2)', padding: '88px 0', borderBottom: '1px solid var(--ink4)' }}>
      <div className="pg-wrap pg-col-grid pg-faq-grid" style={{ padding: '0 48px', display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 64 }}>
        <div>
          <div className="pg-eyebrow" style={{ marginBottom: 12 }}>// 09 — FAQ</div>
          <h2 className="pg-display" style={{ fontSize: 80, margin: 0 }}>
            WHAT I GET<br/>
            <span style={{ color: 'var(--yellow)' }}>ASKED.</span>
          </h2>
        </div>
        <div>
          {qs.map(([q,a],i) => (
            <details key={i} open={i === 0} style={{ borderTop: '2px solid var(--bone)', padding: '18px 0' }}>
              <summary style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, cursor: 'pointer' }}>
                <span className="pg-display" style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.15 }}>{q}</span>
                <span style={{ background: 'var(--yellow)', color: 'var(--ink)', width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--display)', fontWeight: 700, flexShrink: 0 }}>+</span>
              </summary>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--bone-d70)', marginTop: 12, maxWidth: 600 }}>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────── Contact / Quote */

function Contact() {
  return (
    <section id="quote" style={{ padding: '88px 0', borderBottom: '1px solid var(--ink4)' }}>
      <div className="pg-wrap pg-col-grid pg-contact-grid" style={{ padding: '0 48px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 64 }}>
        <div>
          <div className="pg-eyebrow" style={{ marginBottom: 12 }}>// 10 — QUOTE / CONTACT</div>
          <h1 className="pg-display" style={{ fontSize: 128, margin: 0 }}>
            LET'S<br/>
            <span className="pg-hl">BUILD.</span>
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.55, color: 'var(--bone-d70)', marginTop: 28, maxWidth: 480 }}>
            Quote back within 24 hours. Text the workshop directly for fastest reply — usually within an hour during business hours.
          </p>
          <div className="pg-col-grid" style={{ marginTop: 40, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            {[
              ['CALL / TEXT', PG_PHONE, '8AM – 8PM · DAILY'],
              ['EMAIL', 'benny@peakgaragesolutions.ca', '24-HR REPLY'],
              ['WORKSHOP', 'BURLINGTON, ON', 'PICKUP BY APPT.'],
              ['SOCIAL', '@PEAKGARAGE', 'IG · FB'],
            ].map(([k,v,d]) => (
              <div key={k} style={{ borderTop: '1px solid var(--yellow)', paddingTop: 14 }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--yellow)' }}>{k}</div>
                <div className="pg-display" style={{ fontSize: 22, marginTop: 6, fontWeight: 700, textTransform: 'none' }}>{v}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--bone-d50)', marginTop: 4, letterSpacing: '0.1em' }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
        <QuoteForm />
      </div>
    </section>
  );
}

function QuoteForm() {
  const [sent, setSent] = React.useState(false);
  if (sent) {
    return (
      <div style={{ background: 'var(--ink2)', padding: 32, border: '1px solid var(--ink4)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', minHeight: 480 }}>
        <div style={{ background: 'var(--yellow)', color: 'var(--ink)', width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--display)', fontWeight: 800, fontSize: 32, marginBottom: 20 }}>✓</div>
        <h3 className="pg-display" style={{ fontSize: 32, margin: 0 }}>QUOTE REQUESTED</h3>
        <p style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--bone-d70)', marginTop: 12, letterSpacing: '0.08em', maxWidth: 320 }}>
          THANKS — I'LL REPLY WITHIN 24 HOURS.<br/><br/>NEED IT FASTER? TEXT ME AT {PG_PHONE}.
        </p>
        <button className="pg-btn pg-btn-ghost pg-btn-small" onClick={() => setSent(false)} style={{ marginTop: 24 }}>← BACK</button>
      </div>
    );
  }
  return (
    <form onSubmit={e => { e.preventDefault(); setSent(true); }}
      style={{ background: 'var(--ink2)', padding: 32, display: 'flex', flexDirection: 'column', gap: 14, border: '1px solid var(--ink4)' }}>
      <div className="pg-eyebrow" style={{ marginBottom: 8 }}>// QUOTE FORM</div>
      {[
        ['NAME','Sarah Cavanaugh','name'],
        ['PHONE OR EMAIL', PG_PHONE,'contact'],
        ['POSTAL CODE','L7T 1A1','postal'],
      ].map(([k,p,n]) => (
        <label key={n} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--bone-d50)' }}>{k}</span>
          <input name={n} placeholder={p} required style={{ background: 'transparent', border: 'none', borderBottom: '1px solid var(--ink4)', padding: '8px 0', color: 'var(--bone)', fontFamily: 'var(--mono)', fontSize: 14, outline: 'none' }} />
        </label>
      ))}
      <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--bone-d50)' }}>BUILD SIZE</span>
        <select style={{ background: 'transparent', border: 'none', borderBottom: '1px solid var(--ink4)', padding: '8px 0', color: 'var(--bone)', fontFamily: 'var(--mono)', fontSize: 14, outline: 'none', appearance: 'none' }}>
          {['Not sure — recommend a size','2×3 (6 bins)','2×4 (8 bins)','3×4 (12 bins)','4×4 (16 bins)','5×4 (20 bins)','6×4 (24 bins)','6×6 (36 bins) full wall','Workbench + bins','Custom — I\'ll describe below'].map(o => <option key={o} style={{ background: 'var(--ink)' }}>{o}</option>)}
        </select>
      </label>
      <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--bone-d50)' }}>NOTES</span>
        <textarea rows={3} placeholder="Garage photo helps a lot — text it to me after." style={{ background: 'transparent', border: 'none', borderBottom: '1px solid var(--ink4)', padding: '8px 0', color: 'var(--bone)', fontFamily: 'var(--mono)', fontSize: 14, outline: 'none', resize: 'none' }} />
      </label>
      <button type="submit" className="pg-btn" style={{ marginTop: 12, justifyContent: 'center' }}>
        SEND QUOTE REQUEST →
      </button>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--bone-d50)', letterSpacing: '0.06em', textAlign: 'center', textTransform: 'uppercase' }}>
        No spam · No mailing list · Just your quote
      </div>
    </form>
  );
}

/* ─────────────────────────────────────────── Footer */

function Footer() {
  return (
    <footer style={{ background: 'var(--ink)', padding: '40px 0', borderTop: '2px solid var(--yellow)' }}>
      <div className="pg-wrap" style={{ padding: '0 48px' }}>
        <div className="pg-footer-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <img src={PG_R('logo', 'assets/logo.png')} alt="" style={{ width: 48, height: 48 }} />
            <div>
              <div className="pg-display" style={{ fontSize: 20 }}>PEAK GARAGE SOLUTIONS</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--bone-d50)', letterSpacing: '0.12em', marginTop: 4, textTransform: 'uppercase' }}>{PG_REGION} · Est. {PG_EST}</div>
            </div>
          </div>
          <div className="pg-footer-links" style={{ display: 'flex', gap: 32, fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.06em' }}>
            {[
              ['BUILD', [['Configure', '#build'],['Gallery','#gallery'],['How it works','#how']]],
              ['ABOUT', [['Story','#about'],['Reviews','#reviews'],['FAQ','#faq']]],
              ['CONTACT', [[PG_PHONE,`tel:${PG_PHONE_TEL}`],['benny@peakgaragesolutions.ca','mailto:benny@peakgaragesolutions.ca'],['Bin tracker','#tracker']]],
            ].map(([h, items]) => (
              <div key={h} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <strong style={{ color: 'var(--bone)', letterSpacing: '0.14em' }}>{h}</strong>
                {items.map(([label, href]) => <a key={label} href={href} style={{ color: 'var(--bone-d70)' }}>{label}</a>)}
              </div>
            ))}
          </div>
        </div>
        <div className="pg-footer-bottom" style={{ borderTop: '1px solid var(--ink4)', paddingTop: 18, display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--bone-d50)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          <span>© 2026 Peak Garage Solutions · Built by {PG_OWNER}</span>
          <a href="#top" style={{ background: 'var(--yellow)', color: 'var(--ink)', padding: '0 8px' }}>↑ TOP</a>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, {
  TopBar, Nav, Hero, Gallery, How, About, Reviews, Delivery, FAQ, Contact, Footer,
  PG_OWNER, PG_PHONE, PG_PHONE_TEL, PG_PHONE_SMS, PG_DOMAIN, PG_R,
});
