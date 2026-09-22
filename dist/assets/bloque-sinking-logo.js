/* L / Q relief animation over the existing 1954 × 805 hero photograph.
 * No image replacement: canvas is removed at rest, revealing the original pixels.
 * Coordinates are tied to bloque-hero-light-v3.png, not to viewport dimensions.
 */
(() => {
  'use strict';
  const WIDTH = 1954;
  const HEIGHT = 805;
  const HOLD = 1500;
  const DURATION = 2850;
  const GAP = 250;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const smooth = t => {
    t = Math.max(0, Math.min(1, t));
    return t * t * t * (t * (t * 6 - 15) + 10);
  };
  const shapes = [
    {
      name: 'L',
      path: 'M1294 212 L1319 217 L1284 267 L1370 285 L1366 299 L1249 279 Z',
      box: [1246, 210, 127, 92],
      elevation: 18,
      depth: 20,
      ground: ['#f1f2ed', '#e9ebe6'],
      offset: 0,
    },
    {
      name: 'Q',
      path: 'M1218 397 C1256 393 1291 407 1296 431 C1301 449 1287 465 1267 474 L1281 492 L1263 500 L1244 481 C1214 488 1173 478 1152 463 C1127 445 1136 422 1160 408 C1177 399 1197 397 1218 397 Z M1219 411 C1196 410 1178 419 1171 432 C1162 449 1179 462 1200 465 C1210 468 1221 467 1230 465 L1215 456 L1234 450 L1248 465 C1264 459 1268 446 1264 434 C1259 419 1240 412 1219 411 Z',
      box: [1134, 394, 165, 108],
      elevation: 20,
      depth: 23,
      ground: ['#f0f1ec', '#e9ebe6'],
      offset: DURATION + GAP,
    },
  ].map(shape => ({ ...shape, outline: new Path2D(shape.path) }));

  let current = null;
  let revealAt = 0;

  function init(root = document) {
    current?.destroy();
    current = null;
    revealAt = 0;
    if (reducedMotion.matches) return;
    const img = root.querySelector('.home-header .header-bg img.cover-image');
    if (!img || !img.getAttribute('src').includes('bloque-hero-light-v3.png')) return;
    img.loading = 'eager';
    img.fetchPriority = 'high';

    const canvas = document.createElement('canvas');
    canvas.className = 'bloque-sinking-logo';
    canvas.setAttribute('aria-hidden', 'true');
    Object.assign(canvas.style, {
      position: 'absolute', inset: '0', width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: '1',
    });
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    img.parentElement.append(canvas);
    let frame = 0;
    let elapsed = 0;
    let lastTime = 0;
    let ready = false;
    let disposed = false;
    let finished = false;
    let scale = 1, left = 0, top = 0;
    let visible = true;
    let dpr = 1;
    let matteTexture = null;
    const intro = document.querySelector('.loading-screen');

    function resize() {
      const w = img.clientWidth, h = img.clientHeight;
      if (!w || !h) return;
      dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      scale = Math.max(w / WIDTH, h / HEIGHT);
      const position = getComputedStyle(img).objectPosition.split(' ');
      const fraction = value => value?.endsWith('%') ? parseFloat(value) / 100 : 0.5;
      left = (w - WIDTH * scale) * fraction(position[0]);
      top = (h - HEIGHT * scale) * fraction(position[1]);
      paint();
    }

    function fillGround(shape, amount) {
      // Covers the baked recess while the corresponding solid is above the plane.
      // The small edge stroke covers the photographed white bevel as well.
      const [x, y, w, h] = shape.box;
      const ground = ctx.createLinearGradient(x, y, x + w, y + h);
      ground.addColorStop(0, shape.ground[0]);
      ground.addColorStop(1, shape.ground[1]);
      ctx.save();
      ctx.globalAlpha = amount;
      ctx.fillStyle = ground;
      ctx.strokeStyle = ground;
      ctx.lineWidth = 2;
      ctx.fill(shape.outline, 'evenodd');
      ctx.stroke(shape.outline);
      ctx.restore();
    }

    function drawLetter(shape, progress) {
      if (progress >= 1) return;
      const travel = smooth(progress);
      const z = -shape.elevation + (shape.elevation + shape.depth) * travel;
      const above = Math.max(0, -z / shape.elevation);
      const [x, y, w, h] = shape.box;
      if (z < 0) {
        fillGround(shape, 1);
        ctx.save();
        ctx.translate(-above * 7, -above * 2);
        ctx.shadowColor = `rgba(8, 10, 11, ${0.32 * above})`;
        ctx.shadowBlur = (5 + above * 6) * scale;
        ctx.shadowOffsetX = -above * 13 * scale;
        ctx.shadowOffsetY = above * 3 * scale;
        ctx.fillStyle = `rgba(18, 19, 20, ${0.2 * above})`;
        ctx.fill(shape.outline, 'evenodd');
        ctx.restore();
        // Stacked contours form sidewalls whose height really shrinks to zero.
        ctx.fillStyle = '#191b1c';
        for (let height = 0; height >= z; height -= 0.75) {
          ctx.save();
          ctx.translate(0, height);
          ctx.fill(shape.outline, 'evenodd');
          ctx.restore();
        }
      }
      ctx.save();
      if (z >= 0) {
        // As the face moves below the surface, its opening masks it. The original
        // cavity walls become exposed from the top instead of the whole letter fading.
        ctx.clip(shape.outline, 'evenodd');
      }
      ctx.translate(0, z);
      const shade = ctx.createLinearGradient(x, y, x + w, y + h);
      const light = Math.round(55 - Math.max(0, z) * 1.35);
      shade.addColorStop(0, `rgb(${light + 5},${light + 6},${light + 5})`);
      shade.addColorStop(1, `rgb(${light - 11},${light - 10},${light - 10})`);
      ctx.fillStyle = shade;
      // A short, eased handover to the photographed cavity floor ends exactly at
      // the approved still, without altering any other part of the image.
      ctx.globalAlpha = 1 - smooth((progress - 0.65) / 0.35);
      ctx.fill(shape.outline, 'evenodd');
      if (matteTexture) {
        ctx.fillStyle = matteTexture;
        ctx.globalAlpha *= 0.72 * (1 - smooth(Math.max(0, z) / shape.depth));
        ctx.fill(shape.outline, 'evenodd');
      }
      ctx.globalAlpha = 0.55 * (1 - smooth((progress - 0.65) / 0.35));
      ctx.strokeStyle = 'rgba(225,227,224,0.12)';
      ctx.lineWidth = 0.55;
      ctx.stroke(shape.outline);
      ctx.restore();
    }

    function paint() {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * left, dpr * top);
      shapes.forEach(shape => drawLetter(shape,
        Math.max(0, Math.min(1, (elapsed - HOLD - shape.offset) / DURATION))));
    }

    function tick(time) {
      frame = 0;
      if (disposed || finished || !ready) return;
      if (!canvas.isConnected) { destroy(); return; }
      const delta = lastTime ? Math.min(time - lastTime, 80) : 0;
      lastTime = time;
      // Loader event starts the 1.5 s hold after the entrance has completed.
      // Fallback permits independent use if the original transition script fails.
      if (!revealAt && (!intro || getComputedStyle(intro).visibility === 'hidden')) revealAt = time;
      if (revealAt && !document.hidden && visible) elapsed += delta;
      paint();
      if (elapsed >= HOLD + DURATION * 2 + GAP) {
        finished = true;
        canvas.remove();
        resizeObserver.disconnect();
        intersection.disconnect();
        document.removeEventListener('visibilitychange', wake);
        return;
      }
      if (!document.hidden && visible) frame = requestAnimationFrame(tick);
    }

    function wake() {
      lastTime = 0;
      if (ready && !frame && !finished && !disposed && visible && !document.hidden) frame = requestAnimationFrame(tick);
    }
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(img);
    const intersection = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible) wake();
    });
    intersection.observe(img);
    document.addEventListener('visibilitychange', wake);

    function destroy() {
      disposed = true;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
      document.removeEventListener('visibilitychange', wake);
      canvas.remove();
    }
    current = { destroy };
    img.decode().then(() => {
      if (disposed) return;
      // Reuse a small patch from the raised O's matte top face, instead of
      // inventing a new glossy material for the two animated letters.
      const tile = document.createElement('canvas');
      tile.width = 18;
      tile.height = 7;
      tile.getContext('2d').drawImage(img, 1240, 298, 18, 7, 0, 0, 18, 7);
      matteTexture = ctx.createPattern(tile, 'repeat');
      ready = true;
      resize();
      wake();
    }).catch(destroy);
  }

  window.BloqueSinkingLogo = { init };
  window.addEventListener('bloque:hero-revealed', () => { revealAt = performance.now(); });
  reducedMotion.addEventListener('change', () => {
    // Changing accessibility settings settles immediately; no unexpected replay.
    if (reducedMotion.matches) { current?.destroy(); current = null; }
  });
})();
