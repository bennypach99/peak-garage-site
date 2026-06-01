// Peak Garage Solutions — Configurator
// Mirrors the live pricing model from peakgaragesolutions.ca:
//   SINGLE UNIT
//     base   = cols*rows * $22
//     basic top (½″ ply) = $10 * cols
//     maple top (¾″)     = $25 * cols
//     stain  = $50 / $75 / $100 / $150 based on slot count
//     casters= $50 / $75 / $100 based on slot count (4/6/8 wheels)
//     totes  = $15 * slots
//   DOUBLE UNIT WITH SHELVES (always 2-wide × 2 sides × ROWS, with maple-shelf middle)
//     base   = 2h $400 / 3h $500 / 4h $600 (maple top included)
//              switch to basic top: 2h $340 / 3h $435 / 4h $530
//     stain  = 2h $75 / 3h $85 / 4h $100
//     casters= $100 flat (8 wheels = 2 sets)
//     totes  = $15 * (8/12/16)

const WIDTH_IN  = {1:23.5, 2:45.5, 3:67.5, 4:89.5, 5:111.5, 6:133.5};
const HEIGHT_IN = {2:36,   3:52,   4:68,   5:84,   6:100};
const CASTER_ADD_IN = 4;
const TOP_THICK_BASIC = 0.5, TOP_THICK_MAPLE = 0.75;

function stainCost(c,r)    { const s=c*r; return s<=8?50:s<=16?75:s<=24?100:150; }
function topCost(c)        { return c*25; }
function basicTopCost(c)   { return c*10; }
function casterCost(c,r)   { const s=c*r; return s<12?50:s<16?75:s<=25?100:125; }
function casterCount(c,r)  { const s=c*r; return s<12?4:s<16?6:s<=25?8:10; }

// Double-unit constants (from live site)
const DU_PROPS = {
  '2high': { rows: 2, slots: 8,  baseM: 400, baseB: 340, hIn: 36.75, stain: 75,  label: '2 HIGH' },
  '3high': { rows: 3, slots: 12, baseM: 500, baseB: 435, hIn: 52.75, stain: 85,  label: '3 HIGH' },
  '4high': { rows: 4, slots: 16, baseM: 600, baseB: 530, hIn: 68.75, stain: 100, label: '4 HIGH' },
};
const DU_WIDTH_IN = 133.5;
const DU_CASTER_COST = 100;
const DU_CASTER_COUNT = 8;

function calcSingle(cols, rows, addons, stainName) {
  const slots = cols * rows;
  const base = slots * 22;
  const lines = [{ label: `${slots} slots × $22`, val: base }];
  let total = base;
  if (addons.has('basictop')) { const p = basicTopCost(cols); total += p; lines.push({ label: `½″ Basic plywood top ($10 × ${cols})`, val: p }); }
  if (addons.has('top'))      { const p = topCost(cols);      total += p; lines.push({ label: `¾″ Maple plywood top ($25 × ${cols})`, val: p }); }
  if (addons.has('stain'))    { const p = stainCost(cols,rows); total += p; lines.push({ label: `Stain (${stainName})`, val: p }); }
  if (addons.has('casters'))  { const p = casterCost(cols,rows); total += p; lines.push({ label: `Casters (${casterCount(cols,rows)} wheels)`, val: p }); }
  if (addons.has('totes'))    { const p = slots * 15;          total += p; lines.push({ label: `${slots} totes × $15`, val: p }); }
  return { total, lines, slots };
}

function calcDouble(kind, addons, stainName) {
  const props = DU_PROPS[kind];
  // Default top is now ½″ BASIC plywood (included). Switch to maple = upgrade.
  const hasMaple = addons.has('top');
  const base = hasMaple ? props.baseM : props.baseB;
  const topLabel = hasMaple ? '¾″ Sanded Maple plywood top (included)' : '½″ Basic plywood top (included)';
  const lines = [{ label: `${props.label} double w/ shelves — ${topLabel}`, val: base }];
  let total = base;
  if (addons.has('stain'))   { total += props.stain;     lines.push({ label: `Stain (${stainName})`, val: props.stain }); }
  if (addons.has('casters')) { total += DU_CASTER_COST;  lines.push({ label: `Casters (${DU_CASTER_COUNT} wheels · 2 sets)`, val: DU_CASTER_COST }); }
  if (addons.has('totes'))   { const p = props.slots * 15; total += p; lines.push({ label: `${props.slots} totes × $15`, val: p }); }
  return { total, lines, slots: props.slots, props };
}

function Configurator() {
  // Default state matches the hero photo: natural pine 4-HIGH double w/ shelves, no add-ons.
  const [cols, setCols] = React.useState(4);
  const [rows, setRows] = React.useState(4);
  const [dualKind, setDualKind] = React.useState('4high');
  const [addons, setAddons] = React.useState(new Set());
  const [stain, setStain] = React.useState('walnut');
  const [pulse, setPulse] = React.useState(false);

  // Listen for gallery "load this build" events.
  React.useEffect(() => {
    function onLoad(e) {
      const cfg = e.detail || {};
      if (cfg.dualKind) {
        setDualKind(cfg.dualKind);
      } else {
        setDualKind(null);
        if (cfg.cols) setCols(cfg.cols);
        if (cfg.rows) setRows(cfg.rows);
      }
      if (Array.isArray(cfg.addons)) setAddons(new Set(cfg.addons));
      if (cfg.stain) setStain(cfg.stain);
      setPulse(true);
      setTimeout(() => setPulse(false), 1400);
    }
    window.addEventListener('pg-load-config', onLoad);
    return () => window.removeEventListener('pg-load-config', onLoad);
  }, []);

  const toggle = (k) => {
    const n = new Set(addons);
    if (n.has(k)) n.delete(k); else n.add(k);
    // basic + maple are mutually exclusive
    if (k === 'basictop' && n.has('basictop')) n.delete('top');
    if (k === 'top' && n.has('top'))           n.delete('basictop');
    setAddons(n);
  };

  const stainName = stain.charAt(0).toUpperCase() + stain.slice(1);
  const isDouble = !!dualKind;

  // ── Price + dimensions
  let total, lines, slots, wIn, hTotal, dimLabel;
  const topThickIn = addons.has('top') ? TOP_THICK_MAPLE : addons.has('basictop') ? TOP_THICK_BASIC : 0;
  if (isDouble) {
    const r = calcDouble(dualKind, addons, stainName);
    total = r.total; lines = r.lines; slots = r.slots;
    wIn = DU_WIDTH_IN;
    hTotal = r.props.hIn + (addons.has('casters') ? CASTER_ADD_IN : 0);
    dimLabel = `${r.props.label} DOUBLE · ${slots} TOTES`;
  } else {
    const r = calcSingle(cols, rows, addons, stainName);
    total = r.total; lines = r.lines; slots = r.slots;
    wIn = WIDTH_IN[cols];
    hTotal = HEIGHT_IN[rows] + topThickIn + (addons.has('casters') ? CASTER_ADD_IN : 0);
    dimLabel = `${cols}W × ${rows}H · ${slots} TOTES`;
  }

  return (
    <section id="build" style={{ background: 'var(--ink)', padding: '88px 0', borderBottom: '1px solid var(--ink4)', position: 'relative' }}>
      {pulse && (
        <div style={{
          position: 'absolute', top: 80, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--yellow)', color: 'var(--ink)',
          padding: '10px 18px', fontFamily: 'var(--display)', fontWeight: 800, fontSize: 13,
          letterSpacing: '0.06em', textTransform: 'uppercase',
          animation: 'pg-pulse 1.4s ease-out forwards', zIndex: 5,
        }}>✓ LOADED FROM GALLERY</div>
      )}
      <style>{`@keyframes pg-pulse { 0%{opacity:0;transform:translate(-50%,-8px)} 15%{opacity:1;transform:translate(-50%,0)} 85%{opacity:1;transform:translate(-50%,0)} 100%{opacity:0;transform:translate(-50%,-8px)} }`}</style>
      <div className="pg-wrap" style={{ padding: '0 48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
          <div>
            <div className="pg-eyebrow" style={{ marginBottom: 12 }}>// 02 — THE BUILDER</div>
            <h2 className="pg-display" style={{ fontSize: 96, margin: 0 }}>
              BUILD<br/>
              <span className="pg-hl">YOUR SHELF.</span>
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.5, color: 'var(--bone-d70)', marginTop: 20, maxWidth: 540 }}>
              Pick a single unit, or a double unit with shelves in the middle. Instant price, real dimensions, real shop drawing — no quote needed.
            </p>
          </div>
          <div style={{ maxWidth: 260, textAlign: 'right' }}>
            <div className="pg-eyebrow" style={{ marginBottom: 8 }}>{isDouble ? 'DOUBLE UNIT FROM' : 'SINGLE UNIT FROM'}</div>
            <div className="pg-display" style={{ fontSize: 48, color: 'var(--yellow)' }}>
              {isDouble ? '$340' : '$22'}
              <span style={{ fontSize: 22, color: 'var(--bone-d50)' }}>{isDouble ? '' : '/SLOT'}</span>
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--bone-d50)', letterSpacing: '0.06em', marginTop: 4 }}>+ ADD-ONS</div>
          </div>
        </div>

        <div className="pg-col-grid pg-builder-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 24 }}>
          {/* LEFT — controls */}
          <div className="pg-builder-controls" style={{ background: 'var(--ink2)', border: '1px solid var(--ink4)', padding: 32 }}>

            {/* 00 — Build type */}
            <PickerBlock label="01 — BUILD TYPE" sub="Custom-sized single shelf, or fixed-spec double unit w/ open middle shelves">
              {/* Custom single shelf — its own row, full width */}
              <div style={{ marginBottom: 14 }}>
                <TypeBtn active={!isDouble} onClick={() => setDualKind(null)} primary="CUSTOM SIZE" sub="single shelf · pick width × height below" />
              </div>
              {/* Divider label */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8,
                fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--bone-d50)',
                letterSpacing: '0.14em', textTransform: 'uppercase',
              }}>
                <span style={{ flex: 1, height: 1, background: 'var(--ink4)' }} />
                <span>OR — DOUBLE UNIT W/ OPEN SHELVES</span>
                <span style={{ flex: 1, height: 1, background: 'var(--ink4)' }} />
              </div>
              <div className="pg-buildtype-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                {Object.entries(DU_PROPS).map(([k, p]) => (
                  <TypeBtn key={k} active={dualKind === k} onClick={() => setDualKind(k)}
                    primary={`DOUBLE · ${p.label}`} sub={`${p.slots} totes · ${p.hIn}″`} />
                ))}
              </div>
            </PickerBlock>

            {!isDouble && (
              <>
                <PickerBlock label="02 — WIDTH (COLUMNS)" sub="Number of tote columns side-by-side">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
                    {[1,2,3,4,5,6].map(n => (
                      <SizeBtn key={n} active={cols === n} onClick={() => setCols(n)} primary={n} secondary={`${WIDTH_IN[n]}"`} />
                    ))}
                  </div>
                </PickerBlock>

                <PickerBlock label="03 — HEIGHT (ROWS)" sub="Number of stacked levels">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                    {[2,3,4,5,6].map(n => (
                      <SizeBtn key={n} active={rows === n} onClick={() => setRows(n)} primary={n} secondary={`${HEIGHT_IN[n]}"`} />
                    ))}
                  </div>
                </PickerBlock>
              </>
            )}

            {isDouble && (
              <div style={{ marginBottom: 24, fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--bone-d50)', letterSpacing: '0.04em' }}>
                {DU_WIDTH_IN}″ W × {DU_PROPS[dualKind].hIn}″ H × 28.5″ D · top board included.
              </div>
            )}

            <PickerBlock label={isDouble ? '04 — ADD-ONS' : '04 — ADD-ONS'} sub="Mix and match — costs update live">
              <div className="pg-addons-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                <AddOnCard
                  active={isDouble ? !addons.has('top') : addons.has('basictop')}
                  onClick={() => toggle('basictop')}
                  name={isDouble ? '½″ BASIC PLYWOOD TOP' : '½″ BASIC PLYWOOD TOP'}
                  price={isDouble ? 'INCLUDED' : `$${basicTopCost(cols)}`}
                  note={isDouble ? 'default — sturdy + clean' : `$10 × ${cols} wide`}
                  disabled={!isDouble && addons.has('top')} />
                <AddOnCard
                  active={addons.has('top')}
                  onClick={() => toggle('top')}
                  name={isDouble ? '¾″ SANDED MAPLE TOP' : '¾″ SANDED MAPLE TOP'}
                  price={isDouble ? `+$${DU_PROPS[dualKind].baseM - DU_PROPS[dualKind].baseB}` : `$${topCost(cols)}`}
                  note={isDouble ? 'upgrade — best looking' : `$25 × ${cols} wide`}
                  disabled={!isDouble && addons.has('basictop')} />
                <AddOnCard active={addons.has('stain')} onClick={() => toggle('stain')}
                  name='STAIN FINISH'
                  price={isDouble ? `$${DU_PROPS[dualKind].stain}` : `$${stainCost(cols,rows)}`}
                  note={stainName} />
                <AddOnCard active={addons.has('casters')} onClick={() => toggle('casters')}
                  name='WHEEL CASTERS'
                  price={isDouble ? `$${DU_CASTER_COST}` : `$${casterCost(cols,rows)}`}
                  note={isDouble ? `${DU_CASTER_COUNT} wheels · 2 sets` : `${casterCount(cols,rows)} wheels`} />
                <AddOnCard active={addons.has('totes')} onClick={() => toggle('totes')}
                  name='27 GAL TOTES'
                  price={`$${slots * 15}`} note={`$15 × ${slots} bins`} />
              </div>
              {addons.has('stain') && (
                <div style={{ marginTop: 16, padding: 14, background: 'var(--ink)', border: '1px solid var(--ink4)' }}>
                  <div className="pg-eyebrow" style={{ marginBottom: 10 }}>STAIN COLOR</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[
                      ['walnut',  '#3a2a1c'],
                      ['ebony',   '#0e0e0e'],
                      ['cherry',  '#5a2820'],
                      ['natural', '#d9b986'],
                    ].map(([k,c]) => (
                      <button key={k} type="button" onClick={() => setStain(k)} style={{
                        flex: 1, padding: '10px', background: stain === k ? 'var(--yellow-pale)' : 'var(--ink2)',
                        border: `1px solid ${stain === k ? 'var(--yellow)' : 'var(--ink4)'}`,
                        color: stain === k ? 'var(--yellow)' : 'var(--bone-d70)',
                        fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center',
                      }}>
                        <span style={{ width: 14, height: 14, background: c, border: '1px solid rgba(0,0,0,0.3)' }} />
                        {k}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </PickerBlock>
          </div>

          {/* RIGHT — preview + price */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <ShelfPreview cols={cols} rows={rows} dualKind={dualKind} addons={addons} stain={stain} />

            <div style={{ background: 'var(--yellow-pale)', border: '1px solid var(--yellow)', padding: 24, position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div className="pg-eyebrow" style={{ color: 'var(--yellow)', marginBottom: 8 }}>TOTAL ESTIMATED PRICE</div>
                  <div className="pg-display" style={{ fontSize: 64, color: 'var(--yellow-l)', lineHeight: 1 }}>${total.toLocaleString()}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--bone-d50)', marginTop: 6, letterSpacing: '0.06em', textTransform: 'uppercase' }}>delivery &amp; setup included*</div>
                </div>
                <div style={{ textAlign: 'right', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--bone-d70)', letterSpacing: '0.06em' }}>
                  <div>{dimLabel}</div>
                  <div style={{ color: 'var(--bone-d50)', marginTop: 2 }}>{wIn}″ W × {hTotal}″ H × 28.5″ D</div>
                </div>
              </div>
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--ink4)', fontFamily: 'var(--mono)', fontSize: 12 }}>
                {lines.map((l, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', gap: 12 }}>
                    <span style={{ color: 'var(--bone-d70)' }}>{l.label}</span>
                    <span style={{ color: 'var(--bone)', flexShrink: 0 }}>${l.val}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
                <button type="button" className="pg-btn" style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => {
                    // Build a human-readable spec + price and hand it to the quote form.
                    const addonNames = [];
                    if (addons.has('top')) addonNames.push('¾″ sanded maple top');
                    else if (isDouble || addons.has('basictop')) addonNames.push('½″ basic top');
                    if (addons.has('stain')) addonNames.push(`${stainName.toLowerCase()} stain`);
                    if (addons.has('casters')) addonNames.push('wheel casters');
                    if (addons.has('totes')) addonNames.push(`${slots} totes`);
                    const name = isDouble
                      ? `Double ${DU_PROPS[dualKind].label} unit w/ shelves`
                      : `Custom ${cols}×${rows} (${slots} totes)`;
                    const summary =
                      `${name}\n` +
                      (addonNames.length ? `Add-ons: ${addonNames.join(', ')}\n` : 'No add-ons\n') +
                      `Dimensions: ${wIn}″ W × ${hTotal}″ H × 28.5″ D\n` +
                      `Estimated total: $${total.toLocaleString()}`;
                    window.dispatchEvent(new CustomEvent('pg-load-quote', { detail: { summary } }));
                    const el = document.getElementById('quote');
                    if (el) {
                      const top = el.getBoundingClientRect().top + window.scrollY - 40;
                      window.scrollTo({ top, behavior: 'smooth' });
                    }
                  }}>LOCK THIS BUILD →</button>
                <a href={PG_PHONE_SMS} className="pg-btn pg-btn-ghost" style={{ justifyContent: 'center' }}>☏ TEXT</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────── controls */

function PickerBlock({ label, sub, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12, gap: 12 }}>
        <span className="pg-eyebrow">{label}</span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--bone-d50)', letterSpacing: '0.04em', textAlign: 'right' }}>{sub}</span>
      </div>
      {children}
    </div>
  );
}

function SizeBtn({ active, onClick, primary, secondary }) {
  return (
    <button type="button" onClick={onClick} style={{
      padding: '14px 8px',
      background: active ? 'var(--yellow)' : 'var(--ink)',
      color: active ? 'var(--ink)' : 'var(--bone)',
      border: `1px solid ${active ? 'var(--yellow)' : 'var(--ink4)'}`,
      fontFamily: 'var(--display)', fontWeight: 800, cursor: 'pointer',
      display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center',
      transition: 'all .12s',
    }}>
      <span style={{ fontSize: 22, lineHeight: 1 }}>{primary}</span>
      <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 400, letterSpacing: '0.06em', opacity: 0.7 }}>{secondary}</span>
    </button>
  );
}

function TypeBtn({ active, onClick, primary, sub }) {
  return (
    <button type="button" onClick={onClick} style={{
      padding: '14px 10px',
      background: active ? 'var(--yellow)' : 'var(--ink)',
      color: active ? 'var(--ink)' : 'var(--bone)',
      border: `1px solid ${active ? 'var(--yellow)' : 'var(--ink4)'}`,
      fontFamily: 'var(--display)', fontWeight: 800, cursor: 'pointer',
      display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start',
      transition: 'all .12s', textAlign: 'left',
    }}>
      <span style={{ fontSize: 13, lineHeight: 1, letterSpacing: '0.02em' }}>{primary}</span>
      <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 400, letterSpacing: '0.06em', opacity: 0.7 }}>{sub}</span>
    </button>
  );
}

function AddOnCard({ active, onClick, name, price, note, disabled, textOnly }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} style={{
      padding: '14px 14px',
      background: active ? 'var(--yellow-pale)' : 'var(--ink)',
      color: 'var(--bone)',
      border: `1px solid ${active ? 'var(--yellow)' : 'var(--ink4)'}`,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.35 : 1,
      textAlign: 'left',
      display: 'flex', flexDirection: 'column', gap: 4,
      transition: 'all .12s',
      position: 'relative',
    }}>
      <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 13, letterSpacing: '0.02em' }}>{name}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--bone-d50)', letterSpacing: '0.04em' }}>{note}</span>
        <span style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 16, color: active ? 'var(--yellow)' : 'var(--bone)' }}>{price}</span>
      </div>
      {active && (
        <span style={{ position: 'absolute', top: 6, right: 8, background: 'var(--yellow)', color: 'var(--ink)', width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--display)', fontWeight: 800, fontSize: 11 }}>✓</span>
      )}
    </button>
  );
}

/* ─────────────────────────────────────── Shelf preview (renders single OR double) */

function ShelfPreview({ cols, rows, dualKind, addons, stain }) {
  const stainColors = { walnut: '#3a2a1c', ebony: '#0e0e0e', cherry: '#5a2820', natural: '#d9b986' };
  const wood = addons.has('stain') ? stainColors[stain] : '#D9B986';
  const woodEdge = addons.has('stain') ? '#000' : '#A88656';
  const hasMaple = addons.has('top') || (!dualKind && addons.has('top'));
  // top thickness in SVG units; basic = thinner, maple = thicker; doubles ALWAYS show a top.
  const topThick = dualKind
    ? (addons.has('top') ? 7 : 4)
    : (addons.has('top') ? 7 : addons.has('basictop') ? 4 : 0);
  const hasCasters = addons.has('casters');

  const SVG_W = 540, SVG_H = 400;

  if (dualKind) {
    return renderDouble({ dualKind, wood, woodEdge, hasMaple, topThick, hasCasters, addons, stain, SVG_W, SVG_H });
  }
  return renderSingle({ cols, rows, wood, woodEdge, topThick, hasCasters, addons, stain, SVG_W, SVG_H });
}

function renderSingle({ cols, rows, wood, woodEdge, topThick, hasCasters, addons, stain, SVG_W, SVG_H }) {
  const wIn = WIDTH_IN[cols], hIn = HEIGHT_IN[rows];
  const MAX_W = 133.5, MAX_H = 100;
  const PAD = 36;
  const sx = (SVG_W - 2 * PAD) / MAX_W;
  const sy = (SVG_H - 2 * PAD) / MAX_H;
  const drawW = wIn * sx, drawH = hIn * sy;
  const ox = (SVG_W - drawW) / 2;
  const oy = SVG_H - PAD - drawH;
  const cellW = drawW / cols, cellH = drawH / rows;
  const ft = Math.max(4, Math.min(cellW, cellH) * 0.18);
  const hasTop = addons.has('top') || addons.has('basictop');
  return (
    <PreviewFrame title={`PG-${String(cols).padStart(2,'0')}-${String(rows).padStart(2,'0')}${hasCasters?'-CR':''}${addons.has('stain')?'-'+stain[0].toUpperCase():''}`} slots={cols*rows} SVG_W={SVG_W} SVG_H={SVG_H}>
      {hasTop && (
        <rect x={ox - 2} y={oy - topThick - 2} width={drawW + 4} height={topThick} fill={addons.has('top') ? '#E0C28E' : '#C9A77A'} stroke="rgba(0,0,0,0.4)"/>
      )}
      <Frame x={ox} y={oy} w={drawW} h={drawH} cols={cols} rows={rows} cellW={cellW} cellH={cellH} ft={ft} wood={wood} woodEdge={woodEdge}/>
      <Totes x={ox} y={oy} cols={cols} rows={rows} cellW={cellW} cellH={cellH} ft={ft}/>
      {hasCasters && <Casters x={ox} y={oy + drawH} w={drawW} count={casterCount(cols, rows)}/>}
      <Dimensions ox={ox} oy={oy} drawW={drawW} drawH={drawH} wIn={wIn} hIn={hIn} topThick={topThick} hasCasters={hasCasters}/>
    </PreviewFrame>
  );
}

function renderDouble({ dualKind, wood, woodEdge, hasMaple, topThick, hasCasters, addons, stain, SVG_W, SVG_H }) {
  const props = DU_PROPS[dualKind];
  const wIn = DU_WIDTH_IN;
  const hIn = props.hIn;
  const MAX_W = 133.5, MAX_H = 100;
  const PAD = 36;
  const sx = (SVG_W - 2 * PAD) / MAX_W;
  const sy = (SVG_H - 2 * PAD) / MAX_H;
  const drawW = wIn * sx, drawH = hIn * sy;
  const ox = (SVG_W - drawW) / 2;
  const oy = SVG_H - PAD - drawH;

  const binBlockIn = WIDTH_IN[2];
  const midIn = wIn - 2 * binBlockIn;
  const binBlockW = binBlockIn * sx;
  const midW = midIn * sx;
  const sideCols = 2;
  const sideRows = props.rows;
  const cellW = binBlockW / sideCols;
  const cellH = drawH / sideRows;
  const ft = Math.max(4, Math.min(cellW, cellH) * 0.18);

  // Top-board styling: same tan tone as the frame so the unit reads as one piece,
  // with a subtle highlight line on top + a darker shadow line below for thickness.
  const topFill = hasMaple ? '#D4B17A' : '#CDA571';
  const topShadow = '#7a5a32';

  return (
    <PreviewFrame title={`PG-${dualKind.toUpperCase().replace('HIGH','H')}-D${addons.has('stain')?'-'+stain[0].toUpperCase():''}`} slots={props.slots} subBadge="DOUBLE" SVG_W={SVG_W} SVG_H={SVG_H}>
      {/* Top board — single clean rect, the only varying dim is thickness */}
      <g>
        <rect x={ox - 3} y={oy - topThick} width={drawW + 6} height={topThick} fill={topFill} stroke={topShadow} strokeWidth="0.6"/>
        <line x1={ox - 3} y1={oy - topThick + 1} x2={ox + drawW + 3} y2={oy - topThick + 1} stroke="rgba(255,255,255,0.18)" strokeWidth="0.6"/>
        <line x1={ox - 3} y1={oy - 0.5} x2={ox + drawW + 3} y2={oy - 0.5} stroke="rgba(0,0,0,0.45)" strokeWidth="0.6"/>
      </g>

      {/* The middle section is OPEN at the back — so paint a black void behind the shelves */}
      <rect x={ox + binBlockW} y={oy} width={midW} height={drawH} fill="#000"/>

      {/* Left bin block (frame + bins) */}
      <Frame x={ox} y={oy} w={binBlockW} h={drawH} cols={sideCols} rows={sideRows} cellW={cellW} cellH={cellH} ft={ft} wood={wood} woodEdge={woodEdge}/>
      <Totes x={ox} y={oy} cols={sideCols} rows={sideRows} cellW={cellW} cellH={cellH} ft={ft}/>

      {/* Right bin block (frame + bins) */}
      <Frame x={ox + binBlockW + midW} y={oy} w={binBlockW} h={drawH} cols={sideCols} rows={sideRows} cellW={cellW} cellH={cellH} ft={ft} wood={wood} woodEdge={woodEdge}/>
      <Totes x={ox + binBlockW + midW} y={oy} cols={sideCols} rows={sideRows} cellW={cellW} cellH={cellH} ft={ft}/>

      {/* Middle posts + ONE center shelf (regardless of side bin-row count) */}
      <rect x={ox + binBlockW - ft/2} y={oy} width={ft} height={drawH} fill={wood} stroke={woodEdge}/>
      <rect x={ox + binBlockW + midW - ft/2} y={oy} width={ft} height={drawH} fill={wood} stroke={woodEdge}/>
      {(() => {
        const shelves = [];
        const studH = Math.max(4, topThick * 0.9); // 2x4 stud band visible under the plywood
        // Single shelf at the vertical center of the open section
        const ys = oy + drawH / 2;
        shelves.push(<rect key="midp" x={ox + binBlockW} y={ys - topThick} width={midW} height={topThick} fill={topFill} stroke={topShadow} strokeWidth="0.4"/>);
        shelves.push(<rect key="mids" x={ox + binBlockW} y={ys} width={midW} height={studH} fill={wood} stroke={woodEdge} strokeWidth="0.3"/>);
        // Bottom of unit: plywood floor + stud frame above it
        shelves.push(<rect key="botp" x={ox + binBlockW} y={oy + drawH - topThick} width={midW} height={topThick} fill={topFill} stroke={topShadow} strokeWidth="0.4"/>);
        shelves.push(<rect key="bots" x={ox + binBlockW} y={oy + drawH - topThick - studH} width={midW} height={studH} fill={wood} stroke={woodEdge} strokeWidth="0.3"/>);
        return shelves;
      })()}

      {hasCasters && <Casters x={ox} y={oy + drawH} w={drawW} count={DU_CASTER_COUNT}/>}
      <Dimensions ox={ox} oy={oy} drawW={drawW} drawH={drawH} wIn={wIn} hIn={hIn} topThick={topThick} hasCasters={hasCasters}/>
    </PreviewFrame>
  );
}

/* ─────────────────── shared SVG fragments ─────────────────── */

function PreviewFrame({ title, slots, subBadge, SVG_W, SVG_H, children }) {
  return (
    <div style={{ background: 'var(--ink2)', border: '1px solid var(--ink4)', padding: 24, position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <span className="pg-eyebrow">// SHOP DRAWING</span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--bone-d50)', letterSpacing: '0.08em' }}>FRONT ELEVATION · APPROX 1:24</span>
      </div>
      <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
        <defs>
          <pattern id="pg-bg" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(244,241,234,0.04)" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width={SVG_W} height={SVG_H} fill="url(#pg-bg)"/>
        {children}
        {/* slot count badge */}
        <g>
          <rect x={SVG_W - 110} y={20} width={90} height={26} fill="var(--yellow)" transform={`skewX(-6 ${SVG_W - 65} 33)`}/>
          <text x={SVG_W - 65} y={38} fill="var(--ink)" fontFamily="var(--display)" fontWeight="800" fontSize="14" textAnchor="middle" letterSpacing="0.5">{slots} TOTES</text>
        </g>
        {subBadge && (
          <g>
            <rect x={SVG_W - 110} y={50} width={90} height={20} fill="var(--ink)" stroke="var(--yellow)" transform={`skewX(-6 ${SVG_W - 65} 60)`}/>
            <text x={SVG_W - 65} y={65} fill="var(--yellow)" fontFamily="var(--display)" fontWeight="800" fontSize="11" textAnchor="middle" letterSpacing="1">{subBadge}</text>
          </g>
        )}
        <text x="20" y="30" fill="var(--yellow)" fontFamily="var(--mono)" fontSize="9" letterSpacing="2">FIG. 2 / {title}</text>
      </svg>
    </div>
  );
}

function Frame({ x, y, w, h, cols, rows, cellW, cellH, ft, wood, woodEdge }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={wood} stroke={woodEdge}/>
      {Array.from({length: cols + 1}).map((_,c) => (
        <rect key={`v${c}`} x={x + c * cellW - ft/2} y={y} width={ft} height={h} fill={wood} stroke={woodEdge}/>
      ))}
      {Array.from({length: rows + 1}).map((_,r) => (
        <rect key={`h${r}`} x={x} y={y + r * cellH - ft/2} width={w} height={ft} fill={wood} stroke={woodEdge}/>
      ))}
    </g>
  );
}

function Totes({ x, y, cols, rows, cellW, cellH, ft }) {
  return (
    <g>
      {Array.from({length: rows}).map((_,r) =>
        Array.from({length: cols}).map((_,c) => {
          const bx = x + c * cellW + ft/2 + 1;
          const by = y + r * cellH + ft/2 + 1;
          const bw = cellW - ft - 2;
          const bh = cellH - ft - 2;
          const lidH = Math.max(2, bh * 0.16);
          return (
            <g key={`b${r}-${c}`}>
              <rect x={bx} y={by + lidH * 0.7} width={bw} height={bh - lidH * 0.7} fill="#181818" stroke="#000" strokeWidth="0.5" rx="1"/>
              <rect x={bx + bw * 0.04} y={by + lidH * 0.6} width={bw * 0.92} height={lidH} fill="var(--yellow)" stroke="#B89812" strokeWidth="0.4" rx="0.5"/>
              {bw > 18 && (
                <>
                  <rect x={bx + bw * 0.14} y={by + lidH * 0.55} width={bw * 0.08} height={lidH * 0.4} fill="#B89812"/>
                  <rect x={bx + bw * 0.78} y={by + lidH * 0.55} width={bw * 0.08} height={lidH * 0.4} fill="#B89812"/>
                </>
              )}
            </g>
          );
        })
      )}
    </g>
  );
}

// Casters: front elevation — visible count = total count / 2.
function Casters({ x, y, w, count = 4 }) {
  const visible = Math.max(2, Math.floor(count / 2));
  const wheelY = y + 8;
  const insetX = 18;
  const xs = [];
  for (let i = 0; i < visible; i++) {
    xs.push(x + insetX + ((w - 2 * insetX) * i) / (visible - 1));
  }
  return (
    <g>
      {xs.map((cx, i) => (
        <g key={i}>
          {/* caster plate */}
          <rect x={cx - 9} y={y} width={18} height={4} fill="#444" stroke="#666" strokeWidth="0.4"/>
          {/* fork */}
          <path d={`M ${cx - 6} ${y + 4} L ${cx - 7} ${wheelY - 1} M ${cx + 6} ${y + 4} L ${cx + 7} ${wheelY - 1}`} stroke="#666" strokeWidth="1.2" fill="none"/>
          {/* wheel */}
          <circle cx={cx} cy={wheelY} r="6.5" fill="#0a0a0a" stroke="#aaa" strokeWidth="0.6"/>
          <circle cx={cx} cy={wheelY} r="2" fill="#888"/>
        </g>
      ))}
    </g>
  );
}

function Dimensions({ ox, oy, drawW, drawH, wIn, hIn, topThick, hasCasters }) {
  // topThick is in SVG units, but we present total height in inches based on the unit
  const totalIn = Math.round((hIn + (hasCasters ? CASTER_ADD_IN : 0)) * 10) / 10;
  return (
    <>
      <g stroke="var(--yellow)" strokeWidth="0.8" fill="none">
        <line x1={ox - 18} y1={oy} x2={ox - 18} y2={oy + drawH}/>
        <line x1={ox - 22} y1={oy} x2={ox - 14} y2={oy}/>
        <line x1={ox - 22} y1={oy + drawH} x2={ox - 14} y2={oy + drawH}/>
        <line x1={ox} y1={oy + drawH + (hasCasters ? 28 : 14)} x2={ox + drawW} y2={oy + drawH + (hasCasters ? 28 : 14)}/>
        <line x1={ox} y1={oy + drawH + (hasCasters ? 24 : 10)} x2={ox} y2={oy + drawH + (hasCasters ? 32 : 18)}/>
        <line x1={ox + drawW} y1={oy + drawH + (hasCasters ? 24 : 10)} x2={ox + drawW} y2={oy + drawH + (hasCasters ? 32 : 18)}/>
      </g>
      <text x={ox - 24} y={oy + drawH / 2} fill="var(--yellow)" fontFamily="var(--mono)" fontSize="10" textAnchor="end" transform={`rotate(-90, ${ox - 24}, ${oy + drawH / 2})`}>H · {totalIn}″</text>
      <text x={ox + drawW / 2} y={oy + drawH + (hasCasters ? 42 : 28)} fill="var(--yellow)" fontFamily="var(--mono)" fontSize="10" textAnchor="middle">W · {wIn}″</text>
    </>
  );
}

window.Configurator = Configurator;
