/* Continuous L / Q relief, registered to the 1954 × 805 hero photograph.
 * One contour defines the solid, its walls and its opening. Keep the settled
 * render: switching back to the photographed cavity would change the geometry.
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
      contours: [[[1294,212],[1319,217],[1284,267],[1370,285],[1366,299],[1249,279]]],
      box: [1246, 210, 127, 92],
      elevation: 18,
      depth: 20,
      offset: 0,
    },
    {
      name: 'Q',
      box: [1134, 394, 165, 108],
      elevation: 20,
      depth: 23,
      offset: DURATION + GAP,
    },
  ];

  // Sample the same cubic contours used by Path2D; no separate approximation
  // for the sidewalls or the cavity. The inner contour runs in reverse.
  function cubicContour(start, curves) {
    const result = [start];
    let p = start;
    curves.forEach(c => {
      for (let i = 1; i <= 20; i++) {
        const t = i / 20, u = 1 - t;
        result.push([u*u*u*p[0]+3*u*u*t*c[0]+3*u*t*t*c[2]+t*t*t*c[4],
          u*u*u*p[1]+3*u*u*t*c[1]+3*u*t*t*c[3]+t*t*t*c[5]]);
      }
      p = c.slice(4);
    });
    return result;
  }
  const qOuter = cubicContour([1218,397], [
    [1256,393,1291,407,1296,431], [1301,449,1287,465,1267,474],
  ]);
  qOuter.push([1281,492],[1263,500],[1244,481]);
  qOuter.push(...cubicContour([1244,481], [
    [1214,488,1173,478,1152,463], [1127,445,1136,422,1160,408],
    [1177,399,1197,397,1218,397],
  ]).slice(1));
  const qInner = cubicContour([1219,411], [
    [1196,410,1178,419,1171,432], [1162,449,1179,462,1200,465],
    [1210,468,1221,467,1230,465],
  ]);
  qInner.push([1215,456],[1234,450],[1248,465]);
  qInner.push(...cubicContour([1248,465], [
    [1264,459,1268,446,1264,434], [1259,419,1240,412,1219,411],
  ]).slice(1));
  shapes[1].contours = [qOuter, qInner];
  shapes.forEach(shape => {
    const outline = new Path2D();
    shape.contours.forEach(contour => {
      contour.forEach(([x,y],i) => i ? outline.lineTo(x,y) : outline.moveTo(x,y));
      outline.closePath();
    });
    shape.outline = outline;
  });

  let current = null;
  let revealAt = 0;

  function init(root = document) {
    current?.destroy();
    current = null;
    revealAt = 0;
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
    let groundPatch = null;
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

    function drawLetter(shape, progress) {
      const travel = smooth(progress);
      const z = -shape.elevation + (shape.elevation + shape.depth) * travel;
      const above = Math.max(0, -z / shape.elevation);
      const [x, y, w, h] = shape.box;
      ctx.save();
      if (z < 0) {
        ctx.save();
        ctx.shadowColor = `rgba(8,10,11,${0.38 * above})`;
        ctx.shadowBlur = (2 + above * 9) * scale * dpr;
        ctx.shadowOffsetX = -above * 17 * scale * dpr;
        ctx.shadowOffsetY = above * 2 * scale * dpr;
        ctx.fillStyle = '#27282a';
        ctx.fill(shape.outline, 'evenodd');
        ctx.restore();
      } else {
        ctx.clip(shape.outline, 'evenodd');
        ctx.fillStyle = '#17191a';
        ctx.fill(shape.outline, 'evenodd');
      }

      // Vertical faces share their endpoints with the top. Lighting changes
      // with the face normal, avoiding a uniform black, cut-out-looking edge.
      function walls() {
        const segments = [];
        shape.contours.forEach(contour => contour.forEach((a, i) => {
          const b = contour[(i + 1) % contour.length];
          segments.push({ a, b, y: (a[1] + b[1]) / 2 });
        }));
        segments.sort((a,b) => a.y - b.y);
        segments.forEach(({a,b}) => {
          const dx = b[0]-a[0], dy = b[1]-a[1], length = Math.hypot(dx,dy);
          if (length < 0.01) return;
          const light = Math.max(0, (dy*0.75+dx*0.3)/length);
          const value = z < 0 ? 16+24*light : 15+24*(1-light);
          const wall = ctx.createLinearGradient(0, a[1]+Math.min(z,0), 0, a[1]+Math.max(z,0)+0.01);
          wall.addColorStop(0, `rgb(${value+5},${value+6},${value+5})`);
          wall.addColorStop(1, `rgb(${value-7},${value-6},${value-5})`);
          ctx.fillStyle = wall;
          ctx.beginPath();
          // Adjacent faces overlap by a fraction of a pixel to avoid AA seams.
          const ex=dx/length*0.35, ey=dy/length*0.35;
          ctx.moveTo(a[0]-ex,a[1]-ey); ctx.lineTo(b[0]+ex,b[1]+ey);
          ctx.lineTo(b[0]+ex,b[1]+ey+z); ctx.lineTo(a[0]-ex,a[1]-ey+z); ctx.closePath();
          ctx.fill();
        });
      }
      if (z < 0) walls();
      ctx.save();
      ctx.translate(0, z);
      const shade = ctx.createLinearGradient(x, y, x + w, y + h);
      const light = Math.round(51 - Math.max(0, z) * 0.7);
      shade.addColorStop(0, `rgb(${light + 5},${light + 6},${light + 5})`);
      shade.addColorStop(1, `rgb(${light - 11},${light - 10},${light - 10})`);
      ctx.fillStyle = shade;
      ctx.fill(shape.outline, 'evenodd');
      if (matteTexture) {
        ctx.fillStyle = matteTexture;
        ctx.globalAlpha = 0.18;
        ctx.fill(shape.outline, 'evenodd');
      }
      ctx.restore();
      if (z >= 0) walls();
      ctx.restore();
    }

    function paint() {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * left, dpr * top);
      if (!groundPatch) return;
      ctx.drawImage(groundPatch, 0, 0);
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
    function settle() {
      elapsed = HOLD + DURATION * 2 + GAP;
      finished = true;
      cancelAnimationFrame(frame);
      frame = 0;
      intersection.disconnect();
      document.removeEventListener('visibilitychange', wake);
      if (ready) paint();
    }
    current = { destroy, settle };
    img.decode().then(() => {
      if (disposed) return;
      // Remove the baked bevel and cavity only beneath these two letters.
      // Interpolate nearby plane colors; a feathered mask leaves the surrounding
      // photograph unchanged, including the other four letters.
      groundPatch = document.createElement('canvas');
      groundPatch.width = WIDTH; groundPatch.height = HEIGHT;
      const groundCtx = groundPatch.getContext('2d');
      groundCtx.drawImage(img, 0, 0);
      const source = groundCtx.getImageData(0, 0, WIDTH, HEIGHT);
      groundCtx.clearRect(0,0,WIDTH,HEIGHT);
      function sample(x,y) {
        const rgb = [0,0,0]; let count = 0;
        for (let dy=-5;dy<=5;dy++) for(let dx=-5;dx<=5;dx++) {
          const at=((y+dy)*WIDTH+x+dx)*4;
          if(source.data[at]<205) continue;
          rgb.forEach((_,c)=>rgb[c]+=source.data[at+c]); count++;
        }
        return rgb.map(v=>v/Math.max(count,1));
      }
      shapes.forEach(shape => {
        const [x,y,w,h]=shape.box, margin=12;
        const patch=document.createElement('canvas');
        patch.width=w+margin*2; patch.height=h+margin*2;
        const pc=patch.getContext('2d');
        const pixels=pc.createImageData(patch.width,patch.height);
        const a=sample(x-16,y+5), b=sample(x+w+16,y+5);
        const c=sample(x-25,y+h-10), d=sample(x+w+20,y+h-10);
        for(let py=0;py<patch.height;py++) for(let px=0;px<patch.width;px++) {
          const tx=px/patch.width, ty=py/patch.height, at=(py*patch.width+px)*4;
          for(let k=0;k<3;k++) pixels.data[at+k]=(a[k]*(1-tx)+b[k]*tx)*(1-ty)+(c[k]*(1-tx)+d[k]*tx)*ty;
          pixels.data[at+3]=255;
        }
        pc.putImageData(pixels,0,0);
        const mask=document.createElement('canvas'); mask.width=patch.width; mask.height=patch.height;
        const mc=mask.getContext('2d');
        mc.translate(margin-x,margin-y);
        mc.filter='blur(2px)'; mc.lineWidth=shape.name==='Q' ? 18 : 12; mc.lineJoin='round';
        mc.fill(shape.outline,'evenodd'); mc.stroke(shape.outline);
        pc.globalCompositeOperation='destination-in'; pc.drawImage(mask,0,0);
        groundCtx.drawImage(patch,x-margin,y-margin);
      });

      // Non-repeating fine matte grain. A fixed seed prevents moving texture.
      const tile = document.createElement('canvas');
      tile.width = 256; tile.height = 256;
      const tc=tile.getContext('2d'), grain=tc.createImageData(256,256);
      let seed=431;
      for(let i=0;i<grain.data.length;i+=4) {
        seed=(Math.imul(seed,1664525)+1013904223)>>>0;
        const v=25+(seed>>>25);
        grain.data[i]=v;grain.data[i+1]=v+1;grain.data[i+2]=v;grain.data[i+3]=255;
      }
      tc.putImageData(grain,0,0);
      const soft=document.createElement('canvas'); soft.width=256; soft.height=256;
      const sc=soft.getContext('2d'); sc.filter='blur(1px)';
      sc.drawImage(tile,0,0,64,64,0,0,256,256);
      matteTexture = ctx.createPattern(soft, 'repeat');
      ready = true;
      if (reducedMotion.matches) settle();
      resize();
      wake();
    }).catch(destroy);
  }

  window.BloqueSinkingLogo = { init };
  window.addEventListener('bloque:hero-revealed', () => { revealAt = performance.now(); });
  reducedMotion.addEventListener('change', () => {
    // Changing accessibility settings settles immediately; no unexpected replay.
    if (reducedMotion.matches) current?.settle();
  });
})();
