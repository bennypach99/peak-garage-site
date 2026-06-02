// Peak Garage Solutions — Configurator
// Pricing model (mirrors peakgaragesolutions.ca):
//   WORKBENCH  (2-high unit + mandatory work top + optional pegboard)
//     frame  = cols*2 * $22
//     top    = ½" $10*cols  /  ¾" $25*cols   (mandatory — pick one, default ½")
//     pegbd  = $50 * cols   (optional · adds 36" height)
//     led    = $45 flat      (optional)
//     stain/casters/totes = same helpers as below
//   DOUBLE UNIT WITH SHELVES (2-wide × 2 sides × ROWS, open middle shelf)
//     base   = 2h $400 / 3h $500 / 4h $600 (maple top incl.) · basic top saves
//     stain  = 2h $75 / 3h $85 / 4h $100 · casters $100 flat · totes $15 ea
//   CUSTOM SINGLE (any width × height)
//     base   = cols*rows * $22 + optional top/stain/casters/totes

const WIDTH_IN  = {1:23.5, 2:45.5, 3:67.5, 4:89.5, 5:111.5, 6:133.5};
const HEIGHT_IN = {2:36,   3:52,   4:68,   5:84,   6:100};
const CASTER_ADD_IN = 4;
const TOP_THICK_BASIC = 0.5, TOP_THICK_MAPLE = 0.75;

function stainCost(c,r)    { const s=c*r; return s<=8?50:s<=16?75:s<=24?100:150; }
function topCost(c)        { return c*30; }   // ¾" sanded maple — $30 / width
function basicTopCost(c)   { return c*15; }   // ½" basic — $15 / width
function casterCost(c,r)   { const s=c*r; return s<12?50:s<16?75:s<=25?100:125; }
function casterCount(c,r)  { const s=c*r; return s<12?4:s<16?6:s<=25?8:10; }

// ── Workbench constants (easy to tune) ──
const WB_WIDTHS = [2,3,4,5,6];
const WB_PEGBOARD_PER_WIDTH = 40;   // pegboard panel + 2x4 frame, per column of width
const WB_PEG_HEIGHT_IN = 36;        // pegboard adds 36" to overall height
const WB_LED_COST = 50;             // LED light bar — $50 each
// LED bars: one per 2 columns of width (workbench), up to 3 on a double unit.
function ledMax(mode, cols) { return mode === 'double' ? 3 : Math.max(1, Math.floor(cols / 2)); }

// ── Double-unit constants (from live site) ──
const DU_PROPS = {
  '2high': { rows: 2, slots: 8,  baseM: 400, baseB: 340, hIn: 36.75, stain: 75,  label: '2 HIGH', peg: 100, pegMode: 'top' },
  '3high': { rows: 3, slots: 12, baseM: 500, baseB: 435, hIn: 52.75, stain: 85,  label: '3 HIGH', peg: 80,  pegMode: 'center' },
  '4high': { rows: 4, slots: 16, baseM: 600, baseB: 530, hIn: 68.75, stain: 100, label: '4 HIGH', peg: 80,  pegMode: 'center' },
};
const DU_WIDTH_IN = 133.5;
const DU_CASTER_COST = 100;
const DU_CASTER_COUNT = 8;
const DU_PEG_COST = 100;   // pegboard back + frame on a double unit (flat)

function calcWorkbench(cols, addons, stainName, ledCount) {
  const rows = 2;
  const slots = cols * rows;
  const base = slots * 22;
  const lines = [{ label: `${slots} totes × $22 (2-high)`, val: base }];
  let total = base;
  // Work-surface top is mandatory — basic is the default, maple is the upgrade
  if (addons.has('top')) { const p = topCost(cols);      total += p; lines.push({ label: `¾″ Sanded maple work top ($30 × ${cols})`, val: p }); }
  else                   { const p = basicTopCost(cols); total += p; lines.push({ label: `½″ Basic work top ($15 × ${cols})`, val: p }); }
  if (addons.has('pegboard')) { const p = WB_PEGBOARD_PER_WIDTH * cols; total += p; lines.push({ label: `Pegboard back + frame ($40 × ${cols})`, val: p }); }
  if (ledCount > 0)           { const p = WB_LED_COST * ledCount; total += p; lines.push({ label: `LED light bar × ${ledCount}`, val: p }); }
  if (addons.has('stain'))    { const p = stainCost(cols,rows); total += p; lines.push({ label: `Stain (${stainName})`, val: p }); }
  if (addons.has('casters'))  { const p = casterCost(cols,rows); total += p; lines.push({ label: `Casters (${casterCount(cols,rows)} wheels)`, val: p }); }
  if (addons.has('totes'))    { const p = slots * 15; total += p; lines.push({ label: `${slots} totes × $15`, val: p }); }
  return { total, lines, slots };
}

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

function calcDouble(kind, addons, stainName, ledCount) {
  const props = DU_PROPS[kind];
  const hasMaple = addons.has('top');
  const base = hasMaple ? props.baseM : props.baseB;
  const topLabel = hasMaple ? '¾″ Sanded Maple plywood top (included)' : '½″ Basic plywood top (included)';
  const lines = [{ label: `${props.label} double w/ shelves — ${topLabel}`, val: base }];
  let total = base;
  if (addons.has('stain'))   { total += props.stain;     lines.push({ label: `Stain (${stainName})`, val: props.stain }); }
  if (addons.has('casters')) { total += DU_CASTER_COST;  lines.push({ label: `Casters (${DU_CASTER_COUNT} wheels · 2 sets)`, val: DU_CASTER_COST }); }
  if (addons.has('pegboard')){ total += props.peg;      lines.push({ label: `Pegboard back + frame`, val: props.peg }); }
  if (ledCount > 0)          { const p = WB_LED_COST * ledCount; total += p; lines.push({ label: `LED light bar × ${ledCount}`, val: p }); }
  if (addons.has('totes'))   { const p = props.slots * 15; total += p; lines.push({ label: `${props.slots} totes × $15`, val: p }); }
  return { total, lines, slots: props.slots, props };
}

function Configurator() {
  // Default to a 4-wide workbench with pegboard (matches the hero).
  const [mode, setMode] = React.useState('workbench'); // 'workbench' | 'double' | 'custom'
  const [wbWidth, setWbWidth] = React.useState(4);
  const [cols, setCols] = React.useState(4);
  const [rows, setRows] = React.useState(4);
  const [dualKind, setDualKind] = React.useState('4high');
  const [addons, setAddons] = React.useState(new Set(['pegboard']));
  const [ledCount, setLedCount] = React.useState(0);
  const [stain, setStain] = React.useState('walnut');
  const [pulse, setPulse] = React.useState(false);

  // Listen for gallery "load this build" events.
  React.useEffect(() => {
    function onLoad(e) {
      const cfg = e.detail || {};
      if (cfg.wbWidth) { setMode('workbench'); setWbWidth(cfg.wbWidth); }
      else if (cfg.dualKind) { setMode('double'); setDualKind(cfg.dualKind); }
      else { setMode('custom'); if (cfg.cols) setCols(cfg.cols); if (cfg.rows) setRows(cfg.rows); }
      if (Array.isArray(cfg.addons)) setAddons(new Set(cfg.addons));
      setLedCount(cfg.ledCount || 0);
      if (cfg.stain) setStain(cfg.stain);
      setPulse(true);
      setTimeout(() => setPulse(false), 1400);
    }
    window.addEventListener('pg-load-config', onLoad);
    return () => window.removeEventListener('pg-load-config', onLoad);
  }, []);

  // Custom mode: basic/maple optional + mutually exclusive (can have neither).
  const toggle = (k) => {
    const n = new Set(addons);
    if (n.has(k)) n.delete(k); else n.add(k);
    if (k === 'basictop' && n.has('basictop')) n.delete('top');
    if (k === 'top' && n.has('top'))           n.delete('basictop');
    setAddons(n);
  };
  // Workbench/Double: a top is always present — pick basic (default) or maple.
  const chooseTop = (maple) => {
    const n = new Set(addons);
    if (maple) n.add('top'); else n.delete('top');
    n.delete('basictop');
    setAddons(n);
  };
  // Generic optional add-on toggle (pegboard, led, stain, casters, totes)
  const toggleAddon = (k) => {
    const n = new Set(addons);
    if (n.has(k)) n.delete(k); else n.add(k);
    setAddons(n);
  };

  const stainName = stain.charAt(0).toUpperCase() + stain.slice(1);
  const isWorkbench = mode === 'workbench';
  const isDouble    = mode === 'double';
  const isCustom    = mode === 'custom';

  // LED bars: clamp the count to the max allowed for this build.
  const maxLed = ledMax(mode, isWorkbench ? wbWidth : 0);
  const effLed = isCustom ? 0 : Math.min(ledCount, maxLed);

  // ── Price + dimensions ──
  let total, lines, slots, wIn, hTotal, dimLabel;
  if (isWorkbench) {
    const r = calcWorkbench(wbWidth, addons, stainName, effLed);
    total = r.total; lines = r.lines; slots = r.slots;
    wIn = WIDTH_IN[wbWidth];
    const topThickIn = addons.has('top') ? TOP_THICK_MAPLE : TOP_THICK_BASIC;
    const pegH = addons.has('pegboard') ? WB_PEG_HEIGHT_IN : 0;
    hTotal = HEIGHT_IN[2] + topThickIn + pegH + (addons.has('casters') ? CASTER_ADD_IN : 0);
    dimLabel = `WORKBENCH · ${wbWidth}-WIDE · ${slots} TOTES`;
  } else if (isDouble) {
    const r = calcDouble(dualKind, addons, stainName, effLed);
    total = r.total; lines = r.lines; slots = r.slots;
    wIn = DU_WIDTH_IN;
    const pegH = (addons.has('pegboard') && DU_PROPS[dualKind].pegMode === 'top') ? WB_PEG_HEIGHT_IN : 0;
    hTotal = r.props.hIn + pegH + (addons.has('casters') ? CASTER_ADD_IN : 0);
    dimLabel = `${r.props.label} DOUBLE · ${slots} TOTES`;
  } else {
    const r = calcSingle(cols, rows, addons, stainName);
    total = r.total; lines = r.lines; slots = r.slots;
    wIn = WIDTH_IN[cols];
    const topThickIn = addons.has('top') ? TOP_THICK_MAPLE : addons.has('basictop') ? TOP_THICK_BASIC : 0;
    hTotal = HEIGHT_IN[rows] + topThickIn + (addons.has('casters') ? CASTER_ADD_IN : 0);
    dimLabel = `${cols}W × ${rows}H · ${slots} TOTES`;
  }

  const fromLabel = isWorkbench ? 'WORKBENCH FROM' : isDouble ? 'DOUBLE UNIT FROM' : 'CUSTOM FROM';
  const fromPrice = isWorkbench ? '$118' : isDouble ? '$340' : '$22';
  const fromUnit  = isCustom ? '/SLOT' : '';

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
              <span className="pg-hl">YOUR UNIT.</span>
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.5, color: 'var(--bone-d70)', marginTop: 20, maxWidth: 540 }}>
              Pick a workbench, a double unit with shelves, or a fully custom size. Instant price, real dimensions, real shop drawing — no quote needed.
            </p>
          </div>
          <div style={{ maxWidth: 260, textAlign: 'right' }}>
            <div className="pg-eyebrow" style={{ marginBottom: 8 }}>{fromLabel}</div>
            <div className="pg-display" style={{ fontSize: 48, color: 'var(--yellow)' }}>
              {fromPrice}
              <span style={{ fontSize: 22, color: 'var(--bone-d50)' }}>{fromUnit}</span>
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--bone-d50)', letterSpacing: '0.06em', marginTop: 4 }}>+ ADD-ONS</div>
          </div>
        </div>

        <div className="pg-col-grid pg-builder-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 24 }}>
          {/* LEFT — controls */}
          <div className="pg-builder-controls" style={{ background: 'var(--ink2)', border: '1px solid var(--ink4)', padding: 32 }}>

            {/* 01 — Build type */}
            <PickerBlock label="01 — BUILD TYPE" sub="Workbench, double unit, or fully custom">
              {/* Workbench */}
              <Divider>WORKBENCH · WORK TOP + OPTIONAL PEGBOARD</Divider>
              <div className="pg-buildtype-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                {WB_WIDTHS.map(w => (
                  <TypeBtn key={w} active={isWorkbench && wbWidth === w}
                    onClick={() => { setMode('workbench'); setWbWidth(w); }}
                    primary={`${w}-WIDE`} sub={`${w*2} totes`} center />
                ))}
              </div>
              {/* Double */}
              <Divider>DOUBLE UNIT W/ OPEN SHELVES</Divider>
              <div className="pg-buildtype-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                {Object.entries(DU_PROPS).map(([k, p]) => (
                  <TypeBtn key={k} active={isDouble && dualKind === k}
                    onClick={() => { setMode('double'); setDualKind(k); }}
                    primary={`DOUBLE · ${p.label}`} sub={`${p.slots} totes · ${p.hIn}″`} />
                ))}
              </div>
              {/* Custom */}
              <Divider>FULLY CUSTOM</Divider>
              <TypeBtn active={isCustom} onClick={() => setMode('custom')}
                primary="CUSTOM SIZE" sub="single shelf · pick width × height below" />
            </PickerBlock>

            {/* 02 — size selectors */}
            {isWorkbench && (
              <div style={{ marginBottom: 24, fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--bone-d50)', letterSpacing: '0.04em' }}>
                2-high · {wIn}″ W × {HEIGHT_IN[2] + (addons.has('pegboard') ? WB_PEG_HEIGHT_IN : 0)}″ H × 28.5″ D
                {addons.has('pegboard') ? ' · incl. pegboard' : ''}. Work top included.
              </div>
            )}

            {isCustom && (
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

            {/* 03/04 — add-ons */}
            <PickerBlock label="04 — ADD-ONS" sub="Mix and match — costs update live">
              <div className="pg-addons-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>

                {isWorkbench && (
                  <>
                    <AddOnCard active={!addons.has('top')} onClick={() => chooseTop(false)}
                      name='½″ BASIC WORK TOP' price={`$${basicTopCost(wbWidth)}`} note={`included · $15 × ${wbWidth}`} />
                    <AddOnCard active={addons.has('top')} onClick={() => chooseTop(true)}
                      name='¾″ SANDED MAPLE TOP' price={`$${topCost(wbWidth)}`} note={`upgrade · $30 × ${wbWidth}`} />
                    <AddOnCard active={addons.has('pegboard')} onClick={() => toggleAddon('pegboard')}
                      name='PEGBOARD BACK' price={`$${WB_PEGBOARD_PER_WIDTH * wbWidth}`} note={`$40 × ${wbWidth} · +36″ H`} />
                    <LedStepper count={effLed} max={maxLed} onChange={setLedCount} />
                    <AddOnCard active={addons.has('stain')} onClick={() => toggleAddon('stain')}
                      name='STAIN FINISH' price={`$${stainCost(wbWidth,2)}`} note={stainName} />
                    <AddOnCard active={addons.has('casters')} onClick={() => toggleAddon('casters')}
                      name='WHEEL CASTERS' price={`$${casterCost(wbWidth,2)}`} note={`${casterCount(wbWidth,2)} wheels`} />
                    <AddOnCard active={addons.has('totes')} onClick={() => toggleAddon('totes')}
                      name='27 GAL TOTES' price={`$${slots * 15}`} note={`$15 × ${slots} bins`} />
                  </>
                )}

                {isDouble && (
                  <>
                    <AddOnCard active={!addons.has('top')} onClick={() => chooseTop(false)}
                      name='½″ BASIC PLYWOOD TOP' price='INCLUDED' note='default — sturdy + clean' />
                    <AddOnCard active={addons.has('top')} onClick={() => chooseTop(true)}
                      name='¾″ SANDED MAPLE TOP' price={`+$${DU_PROPS[dualKind].baseM - DU_PROPS[dualKind].baseB}`} note='upgrade — best looking' />
                    <AddOnCard active={addons.has('pegboard')} onClick={() => toggleAddon('pegboard')}
                      name='PEGBOARD BACK' price={`$${DU_PROPS[dualKind].peg}`} note={DU_PROPS[dualKind].pegMode === 'top' ? 'full-width · +36″ H' : 'center section'} />
                    <LedStepper count={effLed} max={maxLed} onChange={setLedCount} />
                    <AddOnCard active={addons.has('stain')} onClick={() => toggleAddon('stain')}
                      name='STAIN FINISH' price={`$${DU_PROPS[dualKind].stain}`} note={stainName} />
                    <AddOnCard active={addons.has('casters')} onClick={() => toggleAddon('casters')}
                      name='WHEEL CASTERS' price={`$${DU_CASTER_COST}`} note={`${DU_CASTER_COUNT} wheels · 2 sets`} />
                    <AddOnCard active={addons.has('totes')} onClick={() => toggleAddon('totes')}
                      name='27 GAL TOTES' price={`$${slots * 15}`} note={`$15 × ${slots} bins`} />
                  </>
                )}

                {isCustom && (
                  <>
                    <AddOnCard active={addons.has('basictop')} onClick={() => toggle('basictop')}
                      name='½″ BASIC PLYWOOD TOP' price={`$${basicTopCost(cols)}`} note={`$10 × ${cols} wide`} disabled={addons.has('top')} />
                    <AddOnCard active={addons.has('top')} onClick={() => toggle('top')}
                      name='¾″ SANDED MAPLE TOP' price={`$${topCost(cols)}`} note={`$25 × ${cols} wide`} disabled={addons.has('basictop')} />
                    <AddOnCard active={addons.has('stain')} onClick={() => toggleAddon('stain')}
                      name='STAIN FINISH' price={`$${stainCost(cols,rows)}`} note={stainName} />
                    <AddOnCard active={addons.has('casters')} onClick={() => toggleAddon('casters')}
                      name='WHEEL CASTERS' price={`$${casterCost(cols,rows)}`} note={`${casterCount(cols,rows)} wheels`} />
                    <AddOnCard active={addons.has('totes')} onClick={() => toggleAddon('totes')}
                      name='27 GAL TOTES' price={`$${slots * 15}`} note={`$15 × ${slots} bins`} />
                  </>
                )}
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
            <ShelfPreview mode={mode} cols={cols} rows={rows} wbWidth={wbWidth} dualKind={dualKind} addons={addons} ledCount={effLed} stain={stain} />

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
                    const addonNames = [];
                    if (isWorkbench || isDouble) addonNames.push(addons.has('top') ? '¾″ sanded maple top' : '½″ basic top');
                    else if (addons.has('top')) addonNames.push('¾″ sanded maple top');
                    else if (addons.has('basictop')) addonNames.push('½″ basic top');
                    if (addons.has('pegboard')) addonNames.push('pegboard back');
                    if (effLed > 0) addonNames.push(`${effLed} LED light bar${effLed > 1 ? 's' : ''}`);
                    if (addons.has('stain')) addonNames.push(`${stainName.toLowerCase()} stain`);
                    if (addons.has('casters')) addonNames.push('wheel casters');
                    if (addons.has('totes')) addonNames.push(`${slots} totes`);
                    const name = isWorkbench
                      ? `Workbench · ${wbWidth}-wide (${slots} totes)`
                      : isDouble
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

function Divider({ children }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, margin: '4px 0 10px',
      fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--bone-d50)',
      letterSpacing: '0.14em', textTransform: 'uppercase',
    }}>
      <span style={{ flex: 1, height: 1, background: 'var(--ink4)' }} />
      <span style={{ flexShrink: 0 }}>{children}</span>
      <span style={{ flex: 1, height: 1, background: 'var(--ink4)' }} />
    </div>
  );
}

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

function TypeBtn({ active, onClick, primary, sub, center }) {
  return (
    <button type="button" onClick={onClick} style={{
      padding: '14px 10px',
      background: active ? 'var(--yellow)' : 'var(--ink)',
      color: active ? 'var(--ink)' : 'var(--bone)',
      border: `1px solid ${active ? 'var(--yellow)' : 'var(--ink4)'}`,
      fontFamily: 'var(--display)', fontWeight: 800, cursor: 'pointer',
      display: 'flex', flexDirection: 'column', gap: 4,
      alignItems: center ? 'center' : 'flex-start',
      transition: 'all .12s', textAlign: center ? 'center' : 'left',
    }}>
      <span style={{ fontSize: center ? 16 : 13, lineHeight: 1, letterSpacing: '0.02em' }}>{primary}</span>
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

// LED light bar — quantity stepper (0 … max). $50 each.
function LedStepper({ count, max, onChange }) {
  const active = count > 0;
  const dec = (e) => { e.stopPropagation(); onChange(Math.max(0, count - 1)); };
  const inc = (e) => { e.stopPropagation(); onChange(Math.min(max, count + 1)); };
  return (
    <div style={{
      padding: '14px 14px',
      background: active ? 'var(--yellow-pale)' : 'var(--ink)',
      border: `1px solid ${active ? 'var(--yellow)' : 'var(--ink4)'}`,
      display: 'flex', flexDirection: 'column', gap: 6, position: 'relative',
    }}>
      <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 13, letterSpacing: '0.02em', color: 'var(--bone)' }}>LED LIGHT BARS</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--bone-d50)', letterSpacing: '0.04em' }}>$50 each · up to {max}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button type="button" onClick={dec} disabled={count <= 0} style={{
            width: 24, height: 24, lineHeight: 1, border: `1px solid ${count <= 0 ? 'var(--ink4)' : 'var(--yellow)'}`,
            background: 'transparent', color: count <= 0 ? 'var(--bone-d50)' : 'var(--yellow)',
            fontFamily: 'var(--display)', fontWeight: 800, fontSize: 16, cursor: count <= 0 ? 'not-allowed' : 'pointer',
          }}>−</button>
          <span style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 18, color: active ? 'var(--yellow)' : 'var(--bone)', minWidth: 16, textAlign: 'center' }}>{count}</span>
          <button type="button" onClick={inc} disabled={count >= max} style={{
            width: 24, height: 24, lineHeight: 1, border: `1px solid ${count >= max ? 'var(--ink4)' : 'var(--yellow)'}`,
            background: 'transparent', color: count >= max ? 'var(--bone-d50)' : 'var(--yellow)',
            fontFamily: 'var(--display)', fontWeight: 800, fontSize: 16, cursor: count >= max ? 'not-allowed' : 'pointer',
          }}>+</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────── Shelf preview */

function ShelfPreview({ mode, cols, rows, wbWidth, dualKind, addons, ledCount, stain }) {
  const stainColors = { walnut: '#3a2a1c', ebony: '#0e0e0e', cherry: '#5a2820', natural: '#d9b986' };
  const wood = addons.has('stain') ? stainColors[stain] : '#D9B986';
  const woodEdge = addons.has('stain') ? '#000' : '#A88656';
  const hasMaple = addons.has('top');
  // top thickness in SVG units; basic = thinner, maple = thicker.
  const topThick = (mode === 'double' || mode === 'workbench')
    ? (hasMaple ? 7 : 4)
    : (addons.has('top') ? 7 : addons.has('basictop') ? 4 : 0);
  const hasCasters = addons.has('casters');
  const leds = ledCount || 0;

  const SVG_W = 540, SVG_H = 400;

  if (mode === 'workbench') {
    return renderWorkbench({ cols: wbWidth, wood, woodEdge, topThick, hasCasters, addons, leds, stain, SVG_W, SVG_H });
  }
  if (mode === 'double') {
    return renderDouble({ dualKind, wood, woodEdge, hasMaple, topThick, hasCasters, addons, leds, stain, SVG_W, SVG_H });
  }
  return renderSingle({ cols, rows, wood, woodEdge, topThick, hasCasters, addons, stain, SVG_W, SVG_H });
}

function renderWorkbench({ cols, wood, woodEdge, topThick, hasCasters, addons, leds, stain, SVG_W, SVG_H }) {
  const wIn = WIDTH_IN[cols];
  const toteRows = 2;
  const toteHIn = HEIGHT_IN[2];                 // 36
  const hasPeg = addons.has('pegboard');
  const pegHIn = hasPeg ? WB_PEG_HEIGHT_IN : 0; // 36
  const totalHIn = toteHIn + pegHIn;

  const MAX_W = 133.5, MAX_H = 100;
  const PAD = 36;
  const sx = (SVG_W - 2 * PAD) / MAX_W;
  const sy = (SVG_H - 2 * PAD) / MAX_H;
  const drawW = wIn * sx;
  const toteH = toteHIn * sy;
  const pegH = pegHIn * sy;
  const gap = hasPeg ? 8 : 0; // gap between pegboard frame and work surface

  const ox = (SVG_W - drawW) / 2;
  const oyTotes = SVG_H - PAD - toteH;            // tote block sits on the floor
  const workTopY = oyTotes - topThick;           // work surface on top of totes
  const pegBottom = workTopY - gap;
  const pegTop = pegBottom - pegH;
  const assemblyTop = hasPeg ? pegTop : workTopY;
  const assemblyH = (oyTotes + toteH) - assemblyTop;

  const cellW = drawW / cols, cellH = toteH / toteRows;
  const ft = Math.max(4, Math.min(cellW, cellH) * 0.18);
  const topFill = addons.has('top') ? '#E0C28E' : '#C9A77A';
  const pegFieldColor = '#C9A06A';
  const pegId = `pg-peg-${cols}`;

  return (
    <PreviewFrame title={`PG-WB-${cols}W${hasPeg ? '-PEG' : ''}${addons.has('top') ? '-M' : ''}${addons.has('stain') ? '-' + stain[0].toUpperCase() : ''}`} slots={cols * toteRows} subBadge="WORKBENCH" SVG_W={SVG_W} SVG_H={SVG_H}>
      {/* Pegboard panel above the work surface */}
      {hasPeg && (
        <g>
          <defs>
            <pattern id={pegId} width="9" height="9" patternUnits="userSpaceOnUse">
              <circle cx="4.5" cy="4.5" r="1.15" fill="rgba(0,0,0,0.30)"/>
            </pattern>
          </defs>
          {/* 2x4 frame around the pegboard */}
          <rect x={ox} y={pegTop} width={drawW} height={pegH} fill={wood} stroke={woodEdge}/>
          {/* perforated field, inset by the frame thickness */}
          <rect x={ox + ft} y={pegTop + ft} width={drawW - 2 * ft} height={pegH - 2 * ft} fill={pegFieldColor} stroke="rgba(0,0,0,0.35)" strokeWidth="0.5"/>
          <rect x={ox + ft} y={pegTop + ft} width={drawW - 2 * ft} height={pegH - 2 * ft} fill={`url(#${pegId})`}/>
          {/* LED light bars under the pegboard frame */}
          <LedBars n={leds} x={ox + ft + 6} y={pegBottom - 5} w={drawW - 2 * ft - 12} />
        </g>
      )}

      {/* Work surface top (mandatory) */}
      <rect x={ox - 3} y={workTopY} width={drawW + 6} height={topThick} fill={topFill} stroke="rgba(0,0,0,0.4)"/>
      <line x1={ox - 3} y1={workTopY + 0.8} x2={ox + drawW + 3} y2={workTopY + 0.8} stroke="rgba(255,255,255,0.18)" strokeWidth="0.6"/>

      {/* Tote block — totes all the way across, 2 high */}
      <Frame x={ox} y={oyTotes} w={drawW} h={toteH} cols={cols} rows={toteRows} cellW={cellW} cellH={cellH} ft={ft} wood={wood} woodEdge={woodEdge}/>
      <Totes x={ox} y={oyTotes} cols={cols} rows={toteRows} cellW={cellW} cellH={cellH} ft={ft}/>

      {hasCasters && <Casters x={ox} y={oyTotes + toteH} w={drawW} count={casterCount(cols, toteRows)}/>}

      <Dimensions ox={ox} oy={assemblyTop} drawW={drawW} drawH={assemblyH} wIn={wIn} hIn={totalHIn} topThick={topThick} hasCasters={hasCasters}/>
    </PreviewFrame>
  );
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

function renderDouble({ dualKind, wood, woodEdge, hasMaple, topThick, hasCasters, addons, leds, stain, SVG_W, SVG_H }) {
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

  const topFill = hasMaple ? '#D4B17A' : '#CDA571';
  const topShadow = '#7a5a32';

  // Optional pegboard. 2-high: full-width panel above the top board.
  // 3/4-high: panel fills the upper half of the open center bay (2-wide).
  const hasPeg = addons.has('pegboard');
  const pegMode = props.pegMode;
  const pegTopH = (hasPeg && pegMode === 'top' ? WB_PEG_HEIGHT_IN : 0) * sy;
  const gap = (hasPeg && pegMode === 'top') ? 8 : 0;
  const pegBottom = oy - topThick - gap;
  const pegTop = pegBottom - pegTopH;
  const pegFieldColor = '#C9A06A';
  const pegId = `pg-peg-d-${dualKind}`;
  const assemblyTop = (hasPeg && pegMode === 'top') ? pegTop : (oy - topThick);
  const assemblyH = (oy + drawH) - assemblyTop;
  // center-bay pegboard geometry (3/4-high)
  const cbX = ox + binBlockW, cbW = midW, cbY = oy, cbH = drawH / 2;

  return (
    <PreviewFrame title={`PG-${dualKind.toUpperCase().replace('HIGH','H')}-D${hasPeg?'-PEG':''}${addons.has('stain')?'-'+stain[0].toUpperCase():''}`} slots={props.slots} subBadge="DOUBLE" SVG_W={SVG_W} SVG_H={SVG_H}>
      <defs>
        <pattern id={pegId} width="9" height="9" patternUnits="userSpaceOnUse">
          <circle cx="4.5" cy="4.5" r="1.15" fill="rgba(0,0,0,0.30)"/>
        </pattern>
      </defs>
      {/* 2-high pegboard: panels ONLY above the two side tote blocks; middle bay stays open */}
      {hasPeg && pegMode === 'top' && (
        <g>
          {/* Left pegboard panel */}
          <rect x={ox} y={pegTop} width={binBlockW} height={pegTopH} fill={wood} stroke={woodEdge}/>
          <rect x={ox + ft} y={pegTop + ft} width={binBlockW - 2 * ft} height={pegTopH - 2 * ft} fill={pegFieldColor} stroke="rgba(0,0,0,0.35)" strokeWidth="0.5"/>
          <rect x={ox + ft} y={pegTop + ft} width={binBlockW - 2 * ft} height={pegTopH - 2 * ft} fill={`url(#${pegId})`}/>
          {/* Right pegboard panel */}
          <rect x={ox + binBlockW + midW} y={pegTop} width={binBlockW} height={pegTopH} fill={wood} stroke={woodEdge}/>
          <rect x={ox + binBlockW + midW + ft} y={pegTop + ft} width={binBlockW - 2 * ft} height={pegTopH - 2 * ft} fill={pegFieldColor} stroke="rgba(0,0,0,0.35)" strokeWidth="0.5"/>
          <rect x={ox + binBlockW + midW + ft} y={pegTop + ft} width={binBlockW - 2 * ft} height={pegTopH - 2 * ft} fill={`url(#${pegId})`}/>
          {/* Middle bay OPEN — black void with framing posts */}
          <rect x={ox + binBlockW} y={pegTop} width={midW} height={pegTopH} fill="#000"/>
          <rect x={ox + binBlockW - ft/2} y={pegTop} width={ft} height={pegTopH} fill={wood} stroke={woodEdge}/>
          <rect x={ox + binBlockW + midW - ft/2} y={pegTop} width={ft} height={pegTopH} fill={wood} stroke={woodEdge}/>
          {/* Work-surface shelf at the bottom of the open middle bay */}
          <rect x={ox + binBlockW} y={pegBottom - topThick} width={midW} height={topThick} fill={topFill} stroke={topShadow} strokeWidth="0.4"/>
          {/* LED bar in the upper middle open bay */}
          <LedBars n={leds} x={ox + binBlockW + ft + 4} y={pegTop + ft + 6} w={midW - 2 * ft - 8} />
        </g>
      )}

      <g>
        <rect x={ox - 3} y={oy - topThick} width={drawW + 6} height={topThick} fill={topFill} stroke={topShadow} strokeWidth="0.6"/>
        <line x1={ox - 3} y1={oy - topThick + 1} x2={ox + drawW + 3} y2={oy - topThick + 1} stroke="rgba(255,255,255,0.18)" strokeWidth="0.6"/>
        <line x1={ox - 3} y1={oy - 0.5} x2={ox + drawW + 3} y2={oy - 0.5} stroke="rgba(0,0,0,0.45)" strokeWidth="0.6"/>
      </g>

      {/* The middle section is OPEN at the back — paint a black void behind the shelves */}
      <rect x={ox + binBlockW} y={oy} width={midW} height={drawH} fill="#000"/>

      {/* Pegboard — fills the upper half of the open center bay (3/4-high) */}
      {hasPeg && pegMode === 'center' && (
        <g>
          <rect x={cbX + ft/2} y={cbY + ft/2} width={cbW - ft} height={cbH - ft} fill={pegFieldColor} stroke="rgba(0,0,0,0.35)" strokeWidth="0.5"/>
          <rect x={cbX + ft/2} y={cbY + ft/2} width={cbW - ft} height={cbH - ft} fill={`url(#${pegId})`}/>
          <LedBars n={leds} x={cbX + ft/2 + 4} y={cbY + cbH - ft - 5} w={cbW - ft - 8} />
        </g>
      )}

      <Frame x={ox} y={oy} w={binBlockW} h={drawH} cols={sideCols} rows={sideRows} cellW={cellW} cellH={cellH} ft={ft} wood={wood} woodEdge={woodEdge}/>
      <Totes x={ox} y={oy} cols={sideCols} rows={sideRows} cellW={cellW} cellH={cellH} ft={ft}/>

      <Frame x={ox + binBlockW + midW} y={oy} w={binBlockW} h={drawH} cols={sideCols} rows={sideRows} cellW={cellW} cellH={cellH} ft={ft} wood={wood} woodEdge={woodEdge}/>
      <Totes x={ox + binBlockW + midW} y={oy} cols={sideCols} rows={sideRows} cellW={cellW} cellH={cellH} ft={ft}/>

      <rect x={ox + binBlockW - ft/2} y={oy} width={ft} height={drawH} fill={wood} stroke={woodEdge}/>
      <rect x={ox + binBlockW + midW - ft/2} y={oy} width={ft} height={drawH} fill={wood} stroke={woodEdge}/>
      {(() => {
        const shelves = [];
        const studH = Math.max(4, topThick * 0.9);
        const ys = oy + drawH / 2;
        shelves.push(<rect key="midp" x={ox + binBlockW} y={ys - topThick} width={midW} height={topThick} fill={topFill} stroke={topShadow} strokeWidth="0.4"/>);
        shelves.push(<rect key="mids" x={ox + binBlockW} y={ys} width={midW} height={studH} fill={wood} stroke={woodEdge} strokeWidth="0.3"/>);
        shelves.push(<rect key="botp" x={ox + binBlockW} y={oy + drawH - topThick} width={midW} height={topThick} fill={topFill} stroke={topShadow} strokeWidth="0.4"/>);
        shelves.push(<rect key="bots" x={ox + binBlockW} y={oy + drawH - topThick - studH} width={midW} height={studH} fill={wood} stroke={woodEdge} strokeWidth="0.3"/>);
        return shelves;
      })()}

      {hasCasters && <Casters x={ox} y={oy + drawH} w={drawW} count={DU_CASTER_COUNT}/>}
      <Dimensions ox={ox} oy={assemblyTop} drawW={drawW} drawH={assemblyH} wIn={wIn} hIn={hIn + (hasPeg ? WB_PEG_HEIGHT_IN : 0)} topThick={topThick} hasCasters={hasCasters}/>
    </PreviewFrame>
  );
}

// Renders n LED light bars spread across width w (front elevation).
function LedBars({ n, x, y, w }) {
  if (!n || n <= 0) return null;
  const barW = (w - (n - 1) * 8) / n;
  const bars = [];
  for (let i = 0; i < n; i++) {
    const bx = x + i * (barW + 8);
    bars.push(
      <g key={i}>
        <rect x={bx} y={y} width={barW} height={3} rx="1.5" fill="#fff6cf"/>
        <rect x={bx} y={y} width={barW} height={3} rx="1.5" fill="var(--yellow)" opacity="0.5"/>
      </g>
    );
  }
  return <g>{bars}</g>;
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
          <rect x={cx - 9} y={y} width={18} height={4} fill="#444" stroke="#666" strokeWidth="0.4"/>
          <path d={`M ${cx - 6} ${y + 4} L ${cx - 7} ${wheelY - 1} M ${cx + 6} ${y + 4} L ${cx + 7} ${wheelY - 1}`} stroke="#666" strokeWidth="1.2" fill="none"/>
          <circle cx={cx} cy={wheelY} r="6.5" fill="#0a0a0a" stroke="#aaa" strokeWidth="0.6"/>
          <circle cx={cx} cy={wheelY} r="2" fill="#888"/>
        </g>
      ))}
    </g>
  );
}

function Dimensions({ ox, oy, drawW, drawH, wIn, hIn, topThick, hasCasters }) {
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
