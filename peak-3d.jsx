// Peak Garage Solutions — parametric 3D preview (Three.js)
// Builds shelving geometry live from the configurator's real inch dimensions.
// Replaces the SVG shop drawing. Exposes window.Shelf3D.
(function () {
  const WIDTH_IN  = { 1: 23.5, 2: 45.5, 3: 67.5, 4: 89.5, 5: 111.5, 6: 133.5 };
  const HEIGHT_IN = { 2: 36, 3: 52, 4: 68, 5: 84, 6: 100 };
  const DEPTH_IN = 28.5;
  const DU_PROPS = {
    '2high': { rows: 2, slots: 8,  hIn: 36.75, label: '2 HIGH', pegMode: 'top' },
    '3high': { rows: 3, slots: 12, hIn: 52.75, label: '3 HIGH', pegMode: 'center' },
    '4high': { rows: 4, slots: 16, hIn: 68.75, label: '4 HIGH', pegMode: 'center' },
  };
  const STAINS = { walnut: '#3a2a1c', ebony: '#0e0e0e', cherry: '#5a2820', natural: '#d9b986' };
  const WOOD_DEFAULT = '#CDA068';   // natural pine 2x4 lumber
  const PLY = 0.75;        // plywood thickness (shelves / top / sides)
  const POST = 1.5;        // 2x4 narrow face (1.5")
  const BOARD = 3.5;       // 2x4 wide face (3.5")
  const RAIL = 1.5;        // tote-support rail height
  const CASTER_H = 4;

  // ── geometry helpers ───────────────────────────────────────────
  function addBox(THREE, group, w, h, d, cx, cy, cz, mat) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(Math.max(0.05, w), Math.max(0.05, h), Math.max(0.05, d)), mat);
    m.position.set(cx, cy, cz);
    m.castShadow = true; m.receiveShadow = true;
    group.add(m);
    return m;
  }

  // ── 2x4 tote rack built like the real thing:
  //   • wide 2x4 studs (3.5" face forward), front + back, at every column boundary
  //   • top + bottom plates span the width (the only horizontal cross members)
  //   • RUNNERS: 1.5×3.5×28.5 cleats screwed to the SIDES of the studs, two per tote bay,
  //     running full depth front→back. The tote lid rests ON the runners; the bin hangs below.
  //   • first runner sits 2.5" below the underside of the top plate.
  function toteRack(THREE, group, o) {
    const { x0, x1, D, nCols, yb, totalH, rows, wood, totes } = o;
    const colW = (x1 - x0) / nCols;
    const STUD_W = 3.5, STUD_D = 1.5;          // stud: wide face forward
    const PLATE = 3.5;                          // top/bottom plate height
    const RUN_PROJ = 1.5, RUN_H = 3.5;          // runner: projects 1.5", 3.5" tall, full depth
    const zF = D / 2 - STUD_D / 2;
    const zB = -D / 2 + STUD_D / 2;
    // vertical studs (front + back) at every column boundary
    for (let i = 0; i <= nCols; i++) {
      const x = x0 + i * colW;
      addBox(THREE, group, STUD_W, totalH, STUD_D, x, yb + totalH / 2, zF, wood);
      addBox(THREE, group, STUD_W, totalH, STUD_D, x, yb + totalH / 2, zB, wood);
    }
    // top + bottom plates span the width (front + back) — only horizontal members
    [yb + PLATE / 2, yb + totalH - PLATE / 2].forEach((y) => {
      addBox(THREE, group, (x1 - x0) + STUD_W, PLATE, STUD_D, (x0 + x1) / 2, y, zF, wood);
      addBox(THREE, group, (x1 - x0) + STUD_W, PLATE, STUD_D, (x0 + x1) / 2, y, zB, wood);
    });
    // runner levels: first 2.5" below underside of top plate, then one tote-pitch apart
    const topPlateBottom = yb + totalH - PLATE;
    const pitch = totalH / rows;
    const runY = [];
    for (let k = 0; k < rows; k++) runY.push(topPlateBottom - 2.5 - k * pitch);
    // runners: two per bay (left + right), screwed to the inner sides of the studs, full depth
    runY.forEach((ry) => {
      for (let c = 0; c < nCols; c++) {
        const lx = x0 + c * colW, rx = x0 + (c + 1) * colW;
        addBox(THREE, group, RUN_PROJ, RUN_H, D, lx + STUD_W / 2 + RUN_PROJ / 2, ry - RUN_H / 2, 0, wood);
        addBox(THREE, group, RUN_PROJ, RUN_H, D, rx - STUD_W / 2 - RUN_PROJ / 2, ry - RUN_H / 2, 0, wood);
      }
    });
    // totes: lid rests on top of the two runners; bin hangs below between them
    if (totes) {
      runY.forEach((ry) => {
        const bodyH = pitch * 0.78;
        for (let c = 0; c < nCols; c++) {
          const cx = x0 + (c + 0.5) * colW;
          const lidW = colW - STUD_W + 0.4, lidD = D - 2;
          const bodyW = colW - STUD_W - 2 * RUN_PROJ - 0.6, bodyD = lidD - 3;
          addBox(THREE, group, lidW, 2.0, lidD, cx, ry - 1.0, 0, totes.toteLid);
          addBox(THREE, group, bodyW, bodyH, bodyD, cx, ry - 2.0 - bodyH / 2, 0, totes.tote);
          addBox(THREE, group, bodyW * 0.9, 0.6, bodyD * 0.9, cx, ry - 2.0 - bodyH, 0, totes.tote);
        }
      });
    }
  }

  // ── plywood box: solid sides + horizontal shelves (open shelving / center bay).
  function plywoodBox(THREE, group, o) {
    const { x0, x1, D, yb, H, nShelves, wood, back } = o;
    addBox(THREE, group, PLY, H, D, x0 + PLY / 2, yb + H / 2, 0, wood);
    addBox(THREE, group, PLY, H, D, x1 - PLY / 2, yb + H / 2, 0, wood);
    if (back) addBox(THREE, group, (x1 - x0), H, PLY, (x0 + x1) / 2, yb + H / 2, -D / 2 + PLY / 2, wood);
    const gaps = nShelves + 1;
    for (let i = 0; i <= gaps; i++) {
      const y = yb + (H * i) / gaps;
      addBox(THREE, group, (x1 - x0) - PLY, PLY, D, (x0 + x1) / 2, y, 0, wood);
    }
  }

  function addCasters(THREE, group, W, D, count, mat) {
    const per = Math.max(2, Math.round(count / 2));
    const zs = [-D / 2 + 3, D / 2 - 3];
    for (const z of zs) {
      for (let k = 0; k < per; k++) {
        const x = per === 1 ? 0 : (-W / 2 + 3) + ((W - 6) * k) / (per - 1);
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(CASTER_H * 0.45, CASTER_H * 0.45, 1.8, 18), mat);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(x, CASTER_H * 0.45, z);
        wheel.castShadow = true; group.add(wheel);
        addBox(THREE, group, 2.2, CASTER_H * 0.55, 2.2, x, CASTER_H * 0.55 + CASTER_H * 0.45, z, mat);
      }
    }
  }

  function pegMaterial(THREE) {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#D8C7A2'; ctx.fillRect(0, 0, 128, 128);
    ctx.fillStyle = 'rgba(40,30,15,0.4)';
    for (let y = 12; y < 128; y += 16) for (let x = 12; x < 128; x += 16) { ctx.beginPath(); ctx.arc(x, y, 2.6, 0, 7); ctx.fill(); }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    if (THREE.sRGBEncoding) t.encoding = THREE.sRGBEncoding;
    return (w, h) => {
      const tt = t.clone(); tt.needsUpdate = true;
      tt.repeat.set(Math.max(1, Math.round(w / 8)), Math.max(1, Math.round(h / 8)));
      return new THREE.MeshStandardMaterial({ map: tt, roughness: 0.85, metalness: 0 });
    };
  }

  function makeMats(THREE, cfg) {
    const a = cfg.addons;
    const col = (hex) => new THREE.Color(hex).convertSRGBToLinear();
    const woodColor = a.includes('stain') ? (STAINS[cfg.stain] || WOOD_DEFAULT) : WOOD_DEFAULT;
    return {
      wood: new THREE.MeshStandardMaterial({ color: col(woodColor), roughness: 0.84, metalness: 0 }),
      top: new THREE.MeshStandardMaterial({ color: col(a.includes('top') ? '#E0C28E' : '#C7A371'), roughness: 0.68, metalness: 0 }),
      tote: new THREE.MeshStandardMaterial({ color: col('#3a3d42'), roughness: 0.5, metalness: 0.05 }),
      toteLid: new THREE.MeshStandardMaterial({ color: col('#E8B91C'), roughness: 0.45, metalness: 0.05 }),
      caster: new THREE.MeshStandardMaterial({ color: col('#15161a'), roughness: 0.55, metalness: 0.25 }),
      led: new THREE.MeshStandardMaterial({ color: col('#fff7da'), emissive: col('#ffe49c'), emissiveIntensity: 1.8, roughness: 0.4 }),
      peg: pegMaterial(THREE),
    };
  }

  // ── builders per mode ──────────────────────────────────────────
  function buildWorkbench(THREE, cfg, mats) {
    const u = new THREE.Group();
    const W = WIDTH_IN[cfg.wbWidth], D = DEPTH_IN;
    const a = cfg.addons;
    const hasPeg = a.includes('pegboard');
    const toteZone = hasPeg ? 33 : 36;
    const topThick = a.includes('top') ? 0.75 : 0.5;
    const yb = a.includes('casters') ? CASTER_H : 0;
    toteRack(THREE, u, { x0: -W / 2, x1: W / 2, D, nCols: cfg.wbWidth, yb, totalH: toteZone, rows: 2, wood: mats.wood, totes: a.includes('totes') ? mats : null });
    addBox(THREE, u, W + 2, topThick, D + 1.5, 0, yb + toteZone + topThick / 2, 0, mats.top);
    const topY = yb + toteZone + topThick;
    if (hasPeg) {
      const ph = 32;
      addBox(THREE, u, BOARD, ph, POST, -W / 2 + BOARD / 2, topY + ph / 2, -D / 2 + POST / 2, mats.wood);
      addBox(THREE, u, BOARD, ph, POST, W / 2 - BOARD / 2, topY + ph / 2, -D / 2 + POST / 2, mats.wood);
      addBox(THREE, u, W, BOARD, POST, 0, topY + ph - BOARD / 2, -D / 2 + POST / 2, mats.wood);
      addBox(THREE, u, W - 4, ph - 2, 0.4, 0, topY + ph / 2, -D / 2 + POST + 0.2, mats.peg(W - 4, ph - 2));
      if (cfg.leds > 0) addBox(THREE, u, W - 6, 0.9, 1.2, 0, topY + 0.8, -D / 2 + 2.6, mats.led);
    } else if (cfg.leds > 0) {
      addBox(THREE, u, W - 6, 0.9, 1.2, 0, topY - 0.8, D / 2 - 1.6, mats.led);
    }
    if (yb) addCasters(THREE, u, W, D, casterCount(cfg.wbWidth * 2), mats.caster);
    return u;
  }

  function buildDouble(THREE, cfg, mats) {
    const u = new THREE.Group();
    const D = DEPTH_IN;
    const props = DU_PROPS[cfg.dualKind];
    const cw = cfg.centerWidth || 42;
    const side = WIDTH_IN[2];
    const W = 2 * side + cw;
    const rows = props.rows, hIn = props.hIn;
    const a = cfg.addons;
    const yb = a.includes('casters') ? CASTER_H : 0;
    const topThick = a.includes('top') ? 0.75 : 0.5;
    const hasPeg = a.includes('pegboard');
    const xL0 = -W / 2, xL1 = -W / 2 + side, xC0 = xL1, xC1 = xL1 + cw, xR0 = xC1, xR1 = W / 2;
    const totesMat = a.includes('totes') ? mats : null;
    toteRack(THREE, u, { x0: xL0, x1: xL1, D, nCols: 2, yb, totalH: hIn, rows, wood: mats.wood, totes: totesMat });
    toteRack(THREE, u, { x0: xR0, x1: xR1, D, nCols: 2, yb, totalH: hIn, rows, wood: mats.wood, totes: totesMat });
    plywoodBox(THREE, u, { x0: xC0, x1: xC1, D, yb, H: hIn, nShelves: cfg.centerShelves, wood: mats.wood, back: false });
    addBox(THREE, u, W + 1, topThick, D + 1.5, 0, yb + hIn + topThick / 2, 0, mats.top);
    const gaps = cfg.centerShelves + 1;
    if (hasPeg) {
      if (props.pegMode === 'top') {
        const ph = 32, py0 = yb + hIn + topThick;
        addBox(THREE, u, BOARD, ph, POST, xL0 + BOARD / 2, py0 + ph / 2, -D / 2 + POST / 2, mats.wood);
        addBox(THREE, u, BOARD, ph, POST, xR1 - BOARD / 2, py0 + ph / 2, -D / 2 + POST / 2, mats.wood);
        addBox(THREE, u, W, BOARD, POST, 0, py0 + ph - BOARD / 2, -D / 2 + POST / 2, mats.wood);
        addBox(THREE, u, W - 4, ph - 2, 0.4, 0, py0 + ph / 2, -D / 2 + POST + 0.2, mats.peg(W - 4, ph - 2));
        if (cfg.leds > 0) addBox(THREE, u, W - 6, 0.9, 1.2, 0, py0 + 0.8, -D / 2 + 2.6, mats.led);
      } else {
        const comp = hIn / gaps;
        const cav = (cfg.dualKind === '4high' && cfg.centerShelves >= 3) ? 2 : 1;
        const ph = cav * comp, py0 = yb + hIn - ph;
        addBox(THREE, u, cw - 3, ph - 2, 0.4, (xC0 + xC1) / 2, py0 + ph / 2, -D / 2 + PLY + 0.2, mats.peg(cw - 3, ph - 2));
        if (cfg.leds > 0) addBox(THREE, u, cw - 6, 0.9, 1.2, (xC0 + xC1) / 2, yb + hIn - 1.4, -D / 2 + 2, mats.led);
      }
    }
    if (yb) addCasters(THREE, u, W, D, 8, mats.caster);
    return u;
  }

  function buildSingle(THREE, cfg, mats) {
    const u = new THREE.Group();
    const D = DEPTH_IN;
    const cols = cfg.cols, rows = cfg.rows;
    const W = WIDTH_IN[cols] || cols * 22, hIn = HEIGHT_IN[rows] || rows * 16;
    const a = cfg.addons;
    const yb = a.includes('casters') ? CASTER_H : 0;
    toteRack(THREE, u, { x0: -W / 2, x1: W / 2, D, nCols: cols, yb, totalH: hIn, rows, wood: mats.wood, totes: a.includes('totes') ? mats : null });
    if (a.includes('top') || a.includes('basictop')) {
      const tt = a.includes('top') ? 0.75 : 0.5;
      addBox(THREE, u, W + 2, tt, D + 1.5, 0, yb + hIn + tt / 2, 0, mats.top);
    }
    if (yb) addCasters(THREE, u, W, D, casterCount(cols * rows), mats.caster);
    return u;
  }

  function casterCount(s) { return s < 12 ? 4 : s < 16 ? 6 : s <= 25 ? 8 : 10; }

  function buildModel(THREE, cfg) {
    const mats = makeMats(THREE, cfg);
    if (cfg.mode === 'workbench') return buildWorkbench(THREE, cfg, mats);
    if (cfg.mode === 'double') return buildDouble(THREE, cfg, mats);
    return buildSingle(THREE, cfg, mats);
  }

  function disposeGroup(g) {
    g.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) { if (o.material.map) o.material.map.dispose(); o.material.dispose(); }
    });
  }

  // ── React component ────────────────────────────────────────────
  function Shelf3D({ cfg, slots, subBadge }) {
    const mountRef = React.useRef(null);
    const sRef = React.useRef(null);
    const cfgKey = JSON.stringify(cfg);

    React.useEffect(() => {
      const THREE = window.THREE;
      const mount = mountRef.current;
      if (!THREE || !mount) return;
      const H = 380;
      const W = mount.clientWidth || 500;
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      if (THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.92;
      mount.appendChild(renderer.domElement);
      renderer.domElement.style.display = 'block';
      renderer.domElement.style.cursor = 'grab';

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, W / H, 0.5, 6000);

      scene.add(new THREE.HemisphereLight(0xffffff, 0x3a3a40, 0.5));
      const key = new THREE.DirectionalLight(0xfff3e2, 1.5);
      key.castShadow = true;
      key.shadow.mapSize.set(1024, 1024);
      key.shadow.bias = -0.0004;
      scene.add(key); scene.add(key.target);
      const fill = new THREE.DirectionalLight(0xa8c0dc, 0.4);
      fill.position.set(-1, 0.6, -0.6);
      scene.add(fill);

      const ground = new THREE.Mesh(new THREE.PlaneGeometry(4000, 4000), new THREE.ShadowMaterial({ opacity: 0.3 }));
      ground.rotation.x = -Math.PI / 2;
      ground.receiveShadow = true;
      scene.add(ground);

      const controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.enablePan = false;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.9;
      controls.addEventListener('start', () => { controls.autoRotate = false; });

      const s = { THREE, renderer, scene, camera, controls, key, ground, modelGroup: null, raf: 0, mount };
      sRef.current = s;
      if (window.__DEBUG3D) window.__S = s;

      const loop = () => { s.raf = requestAnimationFrame(loop); controls.update(); renderer.render(scene, camera); };
      loop();

      const ro = new ResizeObserver(() => {
        const w = mount.clientWidth || W;
        renderer.setSize(w, H);
        camera.aspect = w / H; camera.updateProjectionMatrix();
      });
      ro.observe(mount);
      s.ro = ro;

      return () => {
        cancelAnimationFrame(s.raf);
        ro.disconnect();
        controls.dispose();
        if (s.modelGroup) disposeGroup(s.modelGroup);
        renderer.dispose();
        if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
        sRef.current = null;
      };
    }, []);

    React.useEffect(() => {
      const s = sRef.current;
      if (!s) return;
      const THREE = s.THREE;
      if (s.modelGroup) { s.scene.remove(s.modelGroup); disposeGroup(s.modelGroup); }
      const g = buildModel(THREE, cfg);
      s.scene.add(g); s.modelGroup = g;

      // frame camera + shadow to the model bounds
      const box = new THREE.Box3().setFromObject(g);
      const c = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxd = Math.max(size.x, size.y, size.z);
      const fov = s.camera.fov * Math.PI / 180;
      let dist = (maxd / 2) / Math.tan(fov / 2) * 1.45;
      s.controls.target.copy(c);
      const dir = new THREE.Vector3(0.62, 0.42, 1).normalize();
      s.camera.position.copy(c).add(dir.multiplyScalar(dist));
      s.camera.near = dist / 50; s.camera.far = dist * 12; s.camera.updateProjectionMatrix();
      s.controls.minDistance = dist * 0.55; s.controls.maxDistance = dist * 2.4;
      s.controls.autoRotate = true;
      s.controls.update();

      s.key.position.copy(c).add(new THREE.Vector3(0.6, 1.15, 0.75).normalize().multiplyScalar(maxd * 2.4));
      s.key.target.position.copy(c); s.key.target.updateMatrixWorld();
      const sc = s.key.shadow.camera, r = maxd * 0.85;
      sc.left = -r; sc.right = r; sc.top = r; sc.bottom = -r; sc.near = 0.5; sc.far = maxd * 6;
      sc.updateProjectionMatrix();
    }, [cfgKey]);

    return (
      <div style={{ background: 'var(--ink2)', border: '1px solid var(--ink4)', padding: 24, position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
          <span style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 13, color: 'var(--bone)', letterSpacing: '0.04em' }}>3D PREVIEW</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--bone-d50)', letterSpacing: '0.08em' }}>DRAG TO ROTATE · SCROLL TO ZOOM</span>
        </div>
        <div style={{ position: 'relative', borderRadius: 2, overflow: 'hidden', background: 'radial-gradient(120% 120% at 50% 20%, #26262b 0%, #161619 70%)' }}>
          <div ref={mountRef} style={{ width: '100%', height: 380 }}></div>
          <div style={{ position: 'absolute', top: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, pointerEvents: 'none', padding: 0 }}>
            <span style={{ background: 'var(--yellow)', color: 'var(--ink)', fontFamily: 'var(--display)', fontWeight: 800, fontSize: 14, letterSpacing: '0.5px', padding: '5px 14px', transform: 'skewX(-6deg)' }}>{slots} TOTES</span>
            {subBadge && <span style={{ background: 'var(--ink)', color: 'var(--yellow)', border: '1px solid var(--yellow)', fontFamily: 'var(--display)', fontWeight: 800, fontSize: 11, letterSpacing: '1px', padding: '3px 14px', transform: 'skewX(-6deg)' }}>{subBadge}</span>}
          </div>
        </div>
      </div>
    );
  }

  window.Shelf3D = Shelf3D;
})();
