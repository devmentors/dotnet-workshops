/* =========================================================
   DevMentors D3 render helpers · iteration 7
   ---------------------------------------------------------
   Builds on d3 v7. Each helper renders an SVG into a host
   element using brand tokens read live from CSS variables.
   Exposed on window.DM.
   ---------------------------------------------------------
   Helpers:
     DM.renderCurves(el, cfg)   — line/area chart, dots on all points
     DM.renderVectors(el, cfg)  — vector fan (from-positions explicit)
     DM.renderGantt(el, cfg)    — stacked horizontal bars with target
     DM.renderFlow(el, cfg)     — row of cards with connector arrows
     DM.renderTree(el, cfg)     — multi-level tree, highlighted layer
     DM.renderTimeline(el, cfg) — horizontal axis with labelled points
     DM.renderMatrix(el, cfg)   — dot-rating comparison matrix [NEW]
   ---------------------------------------------------------
   Interactive mode (default ON, opt-out per chart via
   `interactive: false` in config, or globally via
   DM.options.interactive = false):
     · Lines draw on entry (stroke-dashoffset transition)
     · Areas fade in
     · Dots pop in (back-out easing)
     · Hover on dots: enlarge
   ========================================================= */

(function () {
  'use strict';

  // ---- global options ----
  window.DM = window.DM || {};
  window.DM.options = Object.assign({ interactive: true }, window.DM.options || {});

  // ---- icon registry ----
  // Source of truth: window.DMLucide + window.DMDevicon, generated from
  // vendor/<lib>/<name>.svg files (load lib bundle BEFORE this helper).
  //
  // Usage in slide configs:
  //   icon: "bot"               → defaults to lucide:bot
  //   icon: "lucide:bot"        → explicit lib prefix
  //   icon: "devicon:azure"     → use devicon lib
  //   icon: {lib:"devicon", name:"aws"}     → object form
  //   icon: {html: "<path .../>..."}        → raw inner SVG (escape hatch)
  //   icon: "M21 15a2 2..."     → raw single path d-string (backward compat)
  //
  // If a bundle isn't loaded, that lib's icons resolve to null gracefully.
  function _lookup(lib, name) {
    const bundle = lib === 'devicon' ? window.DMDevicon : window.DMLucide;
    return (bundle && bundle[name]) || null;
  }
  function resolveIcon(spec) {
    if (!spec) return null;
    if (typeof spec === 'string') {
      // namespaced: "lib:name"
      const colon = spec.indexOf(':');
      if (colon > 0 && colon < 20) {
        const lib = spec.slice(0, colon);
        const name = spec.slice(colon + 1);
        const hit = _lookup(lib, name);
        if (hit) return hit;
      }
      // bare name → try lucide first, then devicon
      const fromLucide = _lookup('lucide', spec);
      if (fromLucide) return fromLucide;
      const fromDevicon = _lookup('devicon', spec);
      if (fromDevicon) return fromDevicon;
      // raw d-attribute fallback (single path string)
      if (spec.length > 4 && /^[Mm]\s*[-\d.]/.test(spec)) {
        return `<path d="${spec}"/>`;
      }
      return null;
    }
    if (spec.html) return spec.html;
    if (spec.lib && spec.name) return _lookup(spec.lib, spec.name);
    if (spec.name) return _lookup('lucide', spec.name) || _lookup('devicon', spec.name);
    if (spec.d) return `<path d="${spec.d}"/>`;
    return null;
  }

  // ---- token reader ----
  const css = (name, fallback) => {
    const v = getComputedStyle(document.documentElement)
      .getPropertyValue(name).trim();
    return v || fallback;
  };
  const tokens = () => ({
    canvas:   css('--canvas',          '#0a0a0a'),
    surface1: css('--surface-1',       '#141414'),
    surface2: css('--surface-2',       '#1c1c1c'),
    hairline: css('--hairline',        'rgba(255,255,255,0.08)'),
    ink:      css('--ink',             '#fafafa'),
    ink2:     css('--ink-secondary',   '#cfcfcf'),
    inkMute:  css('--ink-mute',        '#8e8e8e'),
    inkFaint: css('--ink-faint',       '#5a5a5a'),
    teal:     css('--teal',            '#4FC9C3'),
    tealSoft: css('--teal-soft',       '#7CDCD6'),
    tealDeep: css('--teal-deep',       '#2EA09B'),
    tealGlow: css('--teal-glow',       'rgba(79,201,195,0.18)'),
    coral:    css('--coral',           '#E07856'),
    indigo:   css('--indigo',          '#6B8DD6'),
    sage:     css('--sage',            '#7BC47F'),
    amber:    css('--amber',           '#E8A838'),
    violet:   css('--violet',          '#9B7ED6'),
    fontSans: css('--font-sans',       'Inter, system-ui, sans-serif'),
    fontMono: css('--font-mono',       'Geist Mono, monospace'),
  });

  // ---- helpers ----
  const isInteractive = cfg => cfg.interactive !== undefined
    ? !!cfg.interactive
    : !!window.DM.options.interactive;

  // SVG viewBox-to-screen scale fix (iter 11).
  // viewBox is in unit-space; when rendered into a CSS-sized container with
  // preserveAspectRatio=meet, the rendered px = viewBox-unit × scale where
  // scale = min(containerW/viewW, containerH/viewH). Authors expect font-size
  // attributes in CSS px. We attach svg.fs(base) that inverse-scales the
  // requested base so the rendered CSS px ≈ base.
  function newSvg(el, viewW, viewH) {
    // Use parent canvas-vis offsetWidth/Height (CSS layout box size).
    // Reasons NOT to use getBoundingClientRect or el itself:
    //   · Reveal.js applies a transform matrix(scale,...) to .slides at non-
    //     unity viewports; bbox is the VISUAL scaled size, not layout size.
    //     SVG font-size renders against layout size, not visual size.
    //   · The data-dm-render placeholder uses `width: 94%` which shrinks
    //     to ~60% if measured after innerHTML clear (flexbox shrink-to-fit).
    // offsetWidth on the canvas-vis parent gives the stable layout box,
    // unaffected by transforms and innerHTML changes.
    const parent = el.parentElement;
    const cw = (parent && parent.offsetWidth)  || el.offsetWidth  || viewW;
    const ch = (parent && parent.offsetHeight) || el.offsetHeight || viewH;
    el.innerHTML = '';
    const containerScale = Math.min(cw / viewW, ch / viewH) || 1;
    const inverseScale = 1 / containerScale;
    const svg = d3.select(el).append('svg')
      .attr('class', 'd3-svg')
      .attr('viewBox', `0 0 ${viewW} ${viewH}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('width', '100%')
      .style('height', '100%')
      .style('max-width', '100%')
      .style('max-height', '100%')
      .style('display', 'block');
    svg._scale = containerScale;
    svg.fs = (base) => Math.round(base * inverseScale);
    return svg;
  }

  // animate a path "drawing" via stroke-dashoffset trick
  function animPath(path, dur, delay) {
    const node = path.node();
    if (!node || !node.getTotalLength) return;
    const len = node.getTotalLength();
    path
      .attr('stroke-dasharray', `${len} ${len}`)
      .attr('stroke-dashoffset', len)
      .transition().delay(delay || 0).duration(dur || 800).ease(d3.easeCubicOut)
      .attr('stroke-dashoffset', 0)
      .on('end', function () { d3.select(this).attr('stroke-dasharray', null); });
  }

  // fade in an element
  function animFade(sel, dur, delay) {
    sel.attr('opacity', 0)
      .transition().delay(delay || 0).duration(dur || 600).ease(d3.easeCubicOut)
      .attr('opacity', 1);
  }

  // pop in a circle (scale via radius)
  function animPop(circle, dur, delay) {
    const r = +circle.attr('r');
    circle.attr('r', 0)
      .transition().delay(delay || 0).duration(dur || 500).ease(d3.easeBackOut.overshoot(2))
      .attr('r', r);
  }

  // hover enlarge for a circle
  function attachHover(circle, factor) {
    factor = factor || 1.5;
    const r = +circle.attr('r');
    circle.style('cursor', 'pointer')
      .on('mouseenter', function () {
        d3.select(this).transition().duration(140).ease(d3.easeCubicOut)
          .attr('r', r * factor);
      })
      .on('mouseleave', function () {
        d3.select(this).transition().duration(140).ease(d3.easeCubicOut).attr('r', r);
      });
  }

  // =========================================================
  // 1. renderCurves — line/area with dots on EVERY labeled point
  // =========================================================
  function renderCurves(el, config) {
    const t = tokens();
    const W = config.width  || 1200;
    const H = config.height || 600;
    const pad = { l: 100, r: 260, t: 80, b: 110 };
    const xW = W - pad.l - pad.r;
    const yH = H - pad.t - pad.b;
    const inter = isInteractive(config);
    const smooth = config.smooth !== false; // default smooth, can disable

    const svg = newSvg(el, W, H);
    const fs = svg.fs;
    const root = svg.append('g');

    // axes
    root.append('line').attr('x1', pad.l).attr('y1', pad.t)
      .attr('x2', pad.l).attr('y2', H - pad.b)
      .attr('stroke', t.inkFaint).attr('stroke-width', 1.5);
    root.append('line').attr('x1', pad.l).attr('y1', H - pad.b)
      .attr('x2', W - pad.r).attr('y2', H - pad.b)
      .attr('stroke', t.inkFaint).attr('stroke-width', 1.5);

    if (config.xAxis?.label) {
      root.append('text').attr('x', pad.l + xW / 2).attr('y', H - 32)
        .attr('text-anchor', 'middle')
        .attr('fill', t.inkMute).attr('font-family', t.fontMono)
        .attr('font-size', fs(18)).text(config.xAxis.label);
    }
    if (config.yAxis?.label) {
      root.append('text').attr('x', 36).attr('y', pad.t + yH / 2)
        .attr('text-anchor', 'middle')
        .attr('fill', t.inkMute).attr('font-family', t.fontMono)
        .attr('font-size', fs(16))
        .attr('transform', `rotate(-90 36 ${pad.t + yH / 2})`)
        .text(config.yAxis.label);
    }

    (config.xAxis?.ticks || []).forEach(tk => {
      const x = pad.l + tk.x * xW;
      root.append('line').attr('x1', x).attr('y1', H - pad.b)
        .attr('x2', x).attr('y2', H - pad.b + 8)
        .attr('stroke', t.inkFaint);
      root.append('text').attr('x', x).attr('y', H - pad.b + 28)
        .attr('text-anchor', 'middle')
        .attr('fill', t.inkMute).attr('font-family', t.fontMono)
        .attr('font-size', fs(14)).text(tk.label);
    });

    const grads = svg.select('defs').empty() ? svg.append('defs') : svg.select('defs');
    config.curves.forEach((c, i) => {
      const color = t[c.color] || c.color || t.teal;
      if (c.area) {
        const gid = `dm-grad-${i}-${Math.random().toString(36).slice(2, 7)}`;
        c._gid = gid;
        const g = grads.append('linearGradient')
          .attr('id', gid).attr('x1', '0').attr('y1', '1')
          .attr('x2', '0').attr('y2', '0');
        g.append('stop').attr('offset', '0%')
          .attr('stop-color', color).attr('stop-opacity', 0.02);
        g.append('stop').attr('offset', '100%')
          .attr('stop-color', color).attr('stop-opacity', 0.35);
      }
    });

    const xs = x => pad.l + x * xW;
    const ys = y => H - pad.b - y * yH;
    const curveFn = smooth ? d3.curveCatmullRom.alpha(0.5) : d3.curveLinear;
    const lineGen = d3.line().curve(curveFn).x(p => xs(p.x)).y(p => ys(p.y));

    config.curves.forEach((c, ci) => {
      const color = t[c.color] || c.color || t.teal;
      const stroke = c.strokeWidth || 4;
      const baseDelay = ci * 200;

      if (c.area) {
        const areaGen = d3.area().curve(curveFn)
          .x(p => xs(p.x))
          .y0(H - pad.b)
          .y1(p => ys(p.y));
        const areaPath = root.append('path').datum(c.points).attr('d', areaGen)
          .attr('fill', `url(#${c._gid})`);
        if (inter) animFade(areaPath, 800, baseDelay + 200);
      }

      const linePath = root.append('path').datum(c.points).attr('d', lineGen)
        .attr('fill', 'none').attr('stroke', color)
        .attr('stroke-width', stroke)
        .attr('stroke-linecap', 'round')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-dasharray', c.dashed ? '8 6' : null);
      if (inter && !c.dashed) animPath(linePath, 900, baseDelay);

      // DOTS on EVERY point (not just endpoint). Bigger on labeled/endpoint.
      c.points.forEach((p, pi) => {
        const cx = xs(p.x), cy = ys(p.y);
        const isEnd = pi === c.points.length - 1;
        const isLabeled = !!p.label;
        const radius = isEnd ? 9 : (isLabeled ? 7 : 5);
        const dot = root.append('circle')
          .attr('cx', cx).attr('cy', cy).attr('r', radius)
          .attr('fill', color)
          .attr('stroke', t.canvas).attr('stroke-width', 2);
        if (inter) {
          animPop(dot, 450, baseDelay + 700 + pi * 80);
          attachHover(dot, 1.45);
        }

        // point label (small mono, above) — SKIP at endpoint to avoid
        // collision with the curve's endpoint label rendered separately below.
        if (p.label && !isEnd) {
          const txt = root.append('text').attr('x', cx).attr('y', cy - 16)
            .attr('text-anchor', 'middle')
            .attr('fill', color).attr('font-family', t.fontMono)
            .attr('font-size', fs(14)).attr('letter-spacing', 1.2).attr('font-weight', 600)
            .text(p.label);
          if (inter) animFade(txt, 400, baseDelay + 800 + pi * 80);
        }
      });

      // curve label at endpoint
      const last = c.points[c.points.length - 1];
      const lx = xs(last.x) + 16;
      const ly = ys(last.y) - 6;
      const lbl = root.append('text').attr('x', lx).attr('y', ly)
        .attr('fill', color).attr('font-family', t.fontSans)
        .attr('font-weight', 600).attr('font-size', fs(24)).text(c.label);
      if (inter) animFade(lbl, 500, baseDelay + 900);
      if (c.sub) {
        const sub = root.append('text').attr('x', lx).attr('y', ly + 28)
          .attr('fill', t.inkMute).attr('font-family', t.fontSans)
          .attr('font-size', fs(15)).text(c.sub);
        if (inter) animFade(sub, 500, baseDelay + 1000);
      }
    });

    // annotations
    (config.annotations || []).forEach((a, ai) => {
      const x = xs(a.x); const y = ys(a.y);
      const baseDelay = 1200 + ai * 150;
      if (a.lineTo) {
        const ty = ys(a.lineTo.y);
        const ln = root.append('line').attr('x1', x).attr('y1', y)
          .attr('x2', x).attr('y2', ty)
          .attr('stroke', t.coral).attr('stroke-width', 2)
          .attr('stroke-dasharray', '4 5');
        if (inter) animFade(ln, 400, baseDelay);
      }
      const c = root.append('circle').attr('cx', x).attr('cy', y).attr('r', 10)
        .attr('fill', t.canvas).attr('stroke', t.coral).attr('stroke-width', 3);
      if (inter) animPop(c, 500, baseDelay + 100);
      const text = root.append('text').attr('x', x + 14).attr('y', y - 8)
        .attr('fill', t.coral).attr('font-family', t.fontMono)
        .attr('font-size', fs(15)).attr('letter-spacing', 1.2).attr('font-weight', 600)
        .text(a.text);
      if (inter) animFade(text, 400, baseDelay + 200);
      if (a.subtext) {
        const st = root.append('text').attr('x', x + 14).attr('y', y + 18)
          .attr('fill', t.ink2).attr('font-family', t.fontSans)
          .attr('font-size', fs(15)).text(a.subtext);
        if (inter) animFade(st, 400, baseDelay + 300);
      }
    });
  }

  // =========================================================
  // 2. renderVectors — fan of vectors using EXPLICIT from-positions
  // Each vector: { from: {x,y} (0..1 within fan box), to?: {x,y} }
  // Legacy: {angleDeg, mag} still supported (computed against center).
  // =========================================================
  function renderVectors(el, config) {
    const t = tokens();
    const W = config.width  || 1200;
    const H = config.height || 600;
    const inter = isInteractive(config);
    const svg = newSvg(el, W, H);
    const fs = svg.fs;
    const defs = svg.append('defs');

    // Markers — use unique IDs per render to avoid collisions when multiple
    // vector charts coexist in the document.
    const uid = Math.random().toString(36).slice(2, 8);
    ['mute', 'teal'].forEach(k => {
      const m = defs.append('marker')
        .attr('id', `dm-arr-${k}-${uid}`)
        .attr('viewBox', '0 0 12 12').attr('refX', 11).attr('refY', 6)
        .attr('markerWidth', 9).attr('markerHeight', 9)
        .attr('orient', 'auto');
      m.append('path').attr('d', 'M0,0 L12,6 L0,12 Z')
        .attr('fill', k === 'teal' ? t.teal : t.inkMute);
    });

    // central divider
    svg.append('line').attr('x1', W / 2).attr('y1', 60)
      .attr('x2', W / 2).attr('y2', H - 60)
      .attr('stroke', t.hairline).attr('stroke-dasharray', '6 6');

    function drawSide(conf, x0, x1, color, markerId) {
      if (!conf || !Array.isArray(conf.vectors)) return;
      const halfW = x1 - x0;
      const yTop = 90, yBot = H - 90;
      const halfH = yBot - yTop;
      const cx = (x0 + x1) / 2;
      const cy = (yTop + yBot) / 2;
      const fx = u => x0 + u * halfW;
      const fy = u => yTop + u * halfH;

      const target = conf.target;
      const tPos = target ? { x: fx(target.x ?? 0.85), y: fy(target.y ?? 0.5) } : null;
      const originDefault = { x: cx, y: cy };

      // draw vectors
      const drawn = [];
      conf.vectors.forEach((v, vi) => {
        let sx, sy, ex, ey;
        if (v.from) {
          sx = fx(v.from.x);
          sy = fy(v.from.y);
          if (v.to) {
            ex = fx(v.to.x); ey = fy(v.to.y);
          } else if (tPos) {
            ex = tPos.x; ey = tPos.y;
          } else {
            // no target, no to → degenerate; skip
            return;
          }
        } else if (v.angleDeg !== undefined) {
          const rad = (v.angleDeg * Math.PI) / 180;
          const mag = v.mag || halfW * 0.4;
          if (tPos) {
            sx = tPos.x - Math.cos(rad) * mag;
            sy = tPos.y - Math.sin(rad) * mag;
            ex = tPos.x; ey = tPos.y;
          } else {
            sx = originDefault.x; sy = originDefault.y;
            ex = sx + Math.cos(rad) * mag;
            ey = sy + Math.sin(rad) * mag;
          }
        } else {
          return; // skip invalid
        }
        const ln = svg.append('line')
          .attr('x1', sx).attr('y1', sy).attr('x2', ex).attr('y2', ey)
          .attr('stroke', color).attr('stroke-width', 5)
          .attr('stroke-linecap', 'round')
          .attr('marker-end', `url(#${markerId})`);
        if (inter) {
          ln.attr('opacity', 0)
            .transition().delay(150 + vi * 70).duration(420).ease(d3.easeCubicOut)
            .attr('opacity', 1);
        }
        drawn.push(ln);
      });

      // anchor dot (origin if diverge, target if converge)
      const dotPos = tPos || originDefault;
      const dot = svg.append('circle')
        .attr('cx', dotPos.x).attr('cy', dotPos.y).attr('r', 16)
        .attr('fill', color);
      if (inter) {
        animPop(dot, 480, 50);
        attachHover(dot, 1.4);
      }
      if (tPos) {
        // METa label under target dot
        const meta = svg.append('text').attr('x', tPos.x).attr('y', tPos.y + 50)
          .attr('text-anchor', 'middle').attr('fill', color)
          .attr('font-family', t.fontMono).attr('font-size', fs(16))
          .attr('letter-spacing', 1.4).attr('font-weight', 700).text('META');
        if (inter) animFade(meta, 350, 750);
      }

      // side label (big)
      const lbl = svg.append('text').attr('x', cx).attr('y', H - 48)
        .attr('text-anchor', 'middle').attr('fill', color)
        .attr('font-family', t.fontSans).attr('font-weight', 800)
        .attr('font-size', fs(46)).attr('letter-spacing', -1.2).text(conf.label);
      if (inter) animFade(lbl, 500, 900);

      if (conf.note) {
        const note = svg.append('text').attr('x', cx).attr('y', H - 16)
          .attr('text-anchor', 'middle').attr('fill', t.inkMute)
          .attr('font-family', t.fontMono).attr('font-size', fs(15))
          .attr('letter-spacing', 0.6).text(conf.note);
        if (inter) animFade(note, 400, 1000);
      }
    }

    drawSide(config.left,  60,         W / 2 - 30, t.inkMute, `dm-arr-mute-${uid}`);
    drawSide(config.right, W / 2 + 30, W - 60,     t.teal,    `dm-arr-teal-${uid}`);

    // F-011 fix: caption at TOP of canvas (label-corner top-right convention),
    // because side labels + notes already own the bottom zone.
    if (config.caption) {
      const cap = svg.append('text').attr('x', W - 60).attr('y', 36)
        .attr('text-anchor', 'end')
        .attr('fill', t.inkFaint).attr('font-family', t.fontMono)
        .attr('font-size', fs(14)).attr('letter-spacing', 0.5)
        .text(config.caption);
      if (inter) animFade(cap, 400, 1100);
    }
  }

  // =========================================================
  // 3. renderGantt
  // =========================================================
  function renderGantt(el, config) {
    const t = tokens();
    const W = config.width  || 1200;
    const H = config.height || 600;
    const inter = isInteractive(config);
    const padL = 200, padR = 80, padT = 60, padB = 60;
    const svg = newSvg(el, W, H);
    const fs = svg.fs;

    const groups = config.groups || [];
    const rowH = (H - padT - padB) / Math.max(1, groups.reduce((a, g) => a + g.bars.length, 0));
    const xs = v => padL + v * (W - padL - padR);

    let y = padT;
    groups.forEach((grp, gi) => {
      svg.append('text').attr('x', 40).attr('y', y + 24)
        .attr('fill', t.inkMute).attr('font-family', t.fontMono)
        .attr('font-size', fs(18)).attr('letter-spacing', 1.4)
        .text(grp.label);
      grp.bars.forEach((b, i) => {
        const yy = y + i * rowH + rowH * 0.15;
        const h = rowH * 0.55;
        const color = t[b.color] || b.color || (gi === 0 ? t.inkMute : t.teal);
        const fullW = Math.max(2, xs(b.end) - xs(b.start));
        const rect = svg.append('rect').attr('x', xs(b.start)).attr('y', yy)
          .attr('width', inter ? 0 : fullW).attr('height', h).attr('rx', 6)
          .attr('fill', color).attr('opacity', 0.85);
        if (inter) {
          rect.transition().delay(300 + i * 70).duration(500).ease(d3.easeCubicOut)
            .attr('width', fullW);
        }
        if (b.sub) {
          const sub = svg.append('text').attr('x', xs(b.end) + 12).attr('y', yy + h / 2 + 5)
            .attr('fill', color).attr('font-family', t.fontMono)
            .attr('font-size', fs(15)).text(b.sub);
          if (inter) animFade(sub, 400, 800 + i * 70);
        }
      });
      y += grp.bars.length * rowH + 16;
    });

    if (config.target) {
      const tx = xs(config.target.x);
      svg.append('line').attr('x1', tx).attr('y1', padT - 10)
        .attr('x2', tx).attr('y2', H - padB + 10)
        .attr('stroke', t.teal).attr('stroke-dasharray', '4 6')
        .attr('stroke-width', 2);
      svg.append('text').attr('x', tx).attr('y', padT - 18)
        .attr('text-anchor', 'middle')
        .attr('fill', t.teal).attr('font-family', t.fontMono)
        .attr('font-size', fs(16)).attr('letter-spacing', 1.4)
        .text(config.target.label);
    }

    if (config.caption) {
      svg.append('text').attr('x', W / 2).attr('y', H - 16)
        .attr('text-anchor', 'middle')
        .attr('fill', t.inkFaint).attr('font-family', t.fontMono)
        .attr('font-size', fs(14)).attr('letter-spacing', 0.5)
        .text(config.caption);
    }
  }

  // =========================================================
  // 4. renderFlow
  // =========================================================
  function renderFlow(el, config) {
    const t = tokens();
    const W = config.width  || 1200;
    const H = config.height || 600;
    const inter = isInteractive(config);
    const svg = newSvg(el, W, H);
    const fs = svg.fs;

    const rows = config.rows || [];
    const rowH = (H - 40) / rows.length;

    let maxLabelW = 0;
    rows.forEach(row => {
      if (row.label) {
        const tmp = svg.append('text')
          .attr('font-family', t.fontMono).attr('font-size', fs(20))
          .attr('font-weight', 600).text(row.label);
        maxLabelW = Math.max(maxLabelW, tmp.node().getBBox().width);
        tmp.remove();
      }
    });
    const padL = Math.min(380, Math.max(200, maxLabelW + 100));
    const padR = 260;

    rows.forEach((row, ri) => {
      const y = 20 + ri * rowH + rowH / 2;
      const labelColor = row.mode === 'after' ? t.teal : t.inkMute;

      if (row.label) {
        const lbl = svg.append('text').attr('x', 40).attr('y', y + 6)
          .attr('fill', labelColor).attr('font-family', t.fontMono)
          .attr('font-size', fs(20)).attr('font-weight', 600)
          .attr('letter-spacing', 1.4).text(row.label);
        if (inter) animFade(lbl, 400, ri * 200);
      }

      const usableW = W - padL - padR;
      const weights = row.cards.map(c => c.featured ? 2 : 1);
      const sum = weights.reduce((a, b) => a + b, 0);
      const gap = 22;
      const totalGap = row.cards.length * gap;
      const cardSpace = usableW - totalGap;

      let x = padL;
      row.cards.forEach((c, i) => {
        const w = (weights[i] / sum) * cardSpace;
        const h = Math.max(96, Math.min(140, rowH * 0.42));
        const yy = y - h / 2;
        const lit = c.lit;
        const fill = lit ? t.surface2 : t.surface1;
        const stroke = lit ? t.teal : t.hairline;
        const strokeW = lit ? 2.5 : 1;
        const baseDelay = ri * 200 + i * 100;

        const grp = svg.append('g').attr('class', 'flow-card-g');
        const rect = grp.append('rect').attr('x', x).attr('y', yy)
          .attr('width', w).attr('height', h).attr('rx', 14)
          .attr('fill', fill).attr('stroke', stroke).attr('stroke-width', strokeW);
        if (lit) {
          grp.append('rect').attr('x', x - 3).attr('y', yy - 3)
            .attr('width', w + 6).attr('height', h + 6)
            .attr('rx', 16).attr('fill', 'none')
            .attr('stroke', t.tealGlow).attr('stroke-width', 6);
        }

        grp.append('text').attr('x', x + 20).attr('y', yy + 38)
          .attr('fill', lit ? t.ink : t.ink2)
          .attr('font-family', t.fontSans)
          .attr('font-weight', 700).attr('font-size', fs(22))
          .attr('letter-spacing', -0.3).text(c.title);
        if (c.sub) {
          grp.append('text').attr('x', x + 20).attr('y', yy + 70)
            .attr('fill', t.inkMute).attr('font-family', t.fontSans)
            .attr('font-size', fs(15)).text(c.sub);
        }

        if (inter) animFade(grp, 500, baseDelay + 150);

        // arrow to next
        if (i < row.cards.length - 1 || row.badge) {
          const ax = x + w + 4;
          const ay = y;
          const arrowG = svg.append('g');
          arrowG.append('path')
            .attr('d', `M ${ax} ${ay} L ${ax + gap - 8} ${ay}`)
            .attr('stroke', lit ? t.teal : t.inkFaint)
            .attr('stroke-width', 2.5).attr('fill', 'none');
          arrowG.append('path')
            .attr('d', `M ${ax + gap - 12} ${ay - 5} L ${ax + gap - 4} ${ay} L ${ax + gap - 12} ${ay + 5}`)
            .attr('fill', 'none')
            .attr('stroke', lit ? t.teal : t.inkFaint).attr('stroke-width', 2.5)
            .attr('stroke-linejoin', 'round').attr('stroke-linecap', 'round');
          if (inter) animFade(arrowG, 300, baseDelay + 400);
        }
        x += w + gap;
      });

      if (row.badge) {
        const bw = padR - 30;
        const bx = W - bw - 12;
        const by = y - 22;
        const bm = row.badge.mode || 'warn';
        const bFill = bm === 'lit' ? 'rgba(79,201,195,0.14)' : 'rgba(224,120,86,0.10)';
        const bStroke = bm === 'lit' ? t.teal : t.coral;
        const bg = svg.append('g');
        bg.append('rect').attr('x', bx).attr('y', by)
          .attr('width', bw).attr('height', 44).attr('rx', 999)
          .attr('fill', bFill).attr('stroke', bStroke).attr('stroke-width', 1.5);
        bg.append('text').attr('x', bx + bw / 2).attr('y', by + 29)
          .attr('text-anchor', 'middle').attr('font-family', t.fontMono)
          .attr('font-size', fs(14)).attr('font-weight', 700)
          .attr('letter-spacing', 0.4)
          .attr('fill', bm === 'lit' ? t.teal : t.coral)
          .text(row.badge.text);
        if (inter) animFade(bg, 400, ri * 200 + 700);
      }
    });
  }

  // =========================================================
  // 5. renderTree
  // =========================================================
  function renderTree(el, config) {
    const t = tokens();
    const W = config.width  || 1200;
    const H = config.height || 600;
    const inter = isInteractive(config);
    const svg = newSvg(el, W, H);
    const fs = svg.fs;

    const rows = config.rows || [];
    const annotation = config.annotation;
    const annoH = annotation ? 130 : 0;
    const usableH = H - 60 - annoH;
    const rowGap = usableH / rows.length;

    let prevCenters = null;

    rows.forEach((row, ri) => {
      const y = 60 + ri * rowGap;
      const highlight = row.highlight;
      const color = highlight ? t.teal : t.inkMute;
      const baseDelay = ri * 200;

      const cardW = Math.min(240, (W - 160) / row.nodes.length - 40);
      const cardH = highlight ? 88 : 68;
      const totalW = row.nodes.length * cardW + (row.nodes.length - 1) * 80;
      const startX = (W - totalW) / 2;
      const centers = [];

      row.nodes.forEach((n, i) => {
        const x = startX + i * (cardW + 80);
        const cx = x + cardW / 2;
        centers.push({ x: cx, y: y + cardH / 2 });
        const g = svg.append('g');
        const rect = g.append('rect').attr('x', x).attr('y', y)
          .attr('width', cardW).attr('height', cardH).attr('rx', 12)
          .attr('fill', t.surface2)
          .attr('stroke', color)
          .attr('stroke-width', highlight ? 3 : 1.5);
        if (highlight) {
          g.append('rect').attr('x', x - 3).attr('y', y - 3)
            .attr('width', cardW + 6).attr('height', cardH + 6)
            .attr('rx', 14).attr('fill', 'none')
            .attr('stroke', t.tealGlow).attr('stroke-width', 6);
        }
        g.append('text').attr('x', cx).attr('y', y + (n.sub ? cardH / 2 - 2 : cardH / 2 + 7))
          .attr('text-anchor', 'middle')
          .attr('fill', highlight ? t.teal : t.ink2)
          .attr('font-family', t.fontSans)
          .attr('font-weight', highlight ? 700 : 500)
          .attr('font-size', highlight ? fs(26) : fs(20)).text(n.title);
        if (n.sub) {
          g.append('text').attr('x', cx).attr('y', y + cardH - 14)
            .attr('text-anchor', 'middle')
            .attr('fill', t.inkMute).attr('font-family', t.fontSans)
            .attr('font-size', fs(15)).text(n.sub);
        }
        if (inter) animFade(g, 500, baseDelay + i * 80);
      });

      if (prevCenters) {
        const fromY = prevCenters[0].y + (rows[ri - 1].highlight ? 44 : 34);
        const toY = y;
        prevCenters.forEach(pc => {
          centers.forEach(cc => {
            if (prevCenters.length === 1 || centers.length === 1 ||
                Math.abs(pc.x - cc.x) < (W / row.nodes.length) * 0.55) {
              const path = svg.append('path').attr('d',
                `M ${pc.x} ${fromY} C ${pc.x} ${(fromY + toY) / 2}, ${cc.x} ${(fromY + toY) / 2}, ${cc.x} ${toY}`)
                .attr('fill', 'none').attr('stroke', highlight ? t.teal : t.inkFaint)
                .attr('stroke-width', highlight ? 2.5 : 1.5);
              if (inter) animPath(path, 600, baseDelay + 200);
            }
          });
        });
      }
      prevCenters = centers;
    });

    if (annotation) {
      const ay = H - annoH + 10;
      const path = svg.append('path').attr('d',
        `M 120 ${ay} L 120 ${ay - 16} L ${W - 120} ${ay - 16} L ${W - 120} ${ay}`)
        .attr('fill', 'none').attr('stroke', t.teal).attr('stroke-width', 2);
      if (inter) animPath(path, 700, rows.length * 200 + 300);
      const v = svg.append('line').attr('x1', W / 2).attr('y1', ay)
        .attr('x2', W / 2).attr('y2', ay + 18)
        .attr('stroke', t.teal).attr('stroke-width', 2);
      if (inter) animFade(v, 300, rows.length * 200 + 600);
      const ann = svg.append('g');
      ann.append('text').attr('x', W / 2).attr('y', ay + 40)
        .attr('text-anchor', 'middle').attr('fill', t.teal)
        .attr('font-family', t.fontSans).attr('font-weight', 700)
        .attr('font-size', fs(26)).attr('letter-spacing', 0.5)
        .text(annotation.text);
      if (annotation.subtext) {
        ann.append('text').attr('x', W / 2).attr('y', ay + 68)
          .attr('text-anchor', 'middle').attr('fill', t.inkMute)
          .attr('font-family', t.fontSans).attr('font-size', fs(18))
          .text(annotation.subtext);
      }
      if (inter) animFade(ann, 500, rows.length * 200 + 800);
    }
  }

  // =========================================================
  // 6. renderTimeline
  // =========================================================
  function renderTimeline(el, config) {
    const t = tokens();
    const W = config.width  || 1200;
    const H = config.height || 600;
    const inter = isInteractive(config);
    const svg = newSvg(el, W, H);
    const fs = svg.fs;

    const axisY = H / 2;
    const padX = 80;

    // base axis line
    svg.append('line').attr('x1', padX).attr('y1', axisY)
      .attr('x2', W - padX).attr('y2', axisY)
      .attr('stroke', t.hairline).attr('stroke-width', 3);

    const activePoints = (config.points || []).filter(p => p.active);
    if (activePoints.length) {
      const maxX = padX + activePoints[activePoints.length - 1].x * (W - 2 * padX);
      const liveLine = svg.append('line').attr('x1', padX).attr('y1', axisY)
        .attr('x2', maxX).attr('y2', axisY)
        .attr('stroke', t.teal).attr('stroke-width', 4);
      if (inter) animPath(liveLine, 1000, 200);
    }

    // Layout positions — span ~75% of vertical canvas with proper breathing
    // room between icon → date → name → dot → blurb.
    const iconSize = 88;
    const iconYTop = 18;            // icon top (icon bottom = 106)
    const whenY   = axisY - 118;    // 182 — 76px gap below icon
    const whatY   = axisY - 56;     // 244 — 62px gap below when
    const blurbY1 = axisY + 96;     // 396
    const blurbY2 = axisY + 128;    // 428

    (config.points || []).forEach((p, pi) => {
      const x = padX + p.x * (W - 2 * padX);
      const active = p.active;
      const color = active ? t.teal : t.inkMute;
      const baseDelay = 600 + pi * 200;

      // ICON (above when label) — point.icon = registry name or {html}|{d}|{name}
      const iconInner = resolveIcon(p.icon);
      if (iconInner) {
        const iconBg = svg.append('rect')
          .attr('x', x - iconSize / 2 - 12).attr('y', iconYTop - 12)
          .attr('width', iconSize + 24).attr('height', iconSize + 24)
          .attr('rx', 18)
          .attr('fill', active ? 'rgba(79,201,195,0.10)' : 'rgba(255,255,255,0.04)')
          .attr('stroke', active ? color : t.hairline)
          .attr('stroke-width', active ? 2 : 1);
        const iconG = svg.append('g')
          .attr('transform', `translate(${x - iconSize / 2}, ${iconYTop}) scale(${iconSize / 24})`)
          .attr('fill', 'none')
          .attr('stroke', color)
          .attr('stroke-width', 1.8)
          .attr('stroke-linecap', 'round')
          .attr('stroke-linejoin', 'round');
        iconG.html(iconInner);   // supports raw SVG element list (path/rect/circle/line/etc.)
        if (inter) {
          animFade(iconBg, 400, baseDelay - 50);
          animFade(iconG, 400, baseDelay);
        }
      }

      // glow ring (active only)
      if (active) {
        const ring = svg.append('circle').attr('cx', x).attr('cy', axisY).attr('r', 36)
          .attr('fill', 'none').attr('stroke', t.tealGlow).attr('stroke-width', 12);
        if (inter) animPop(ring, 500, baseDelay);
      }
      // dot (bigger — 22 vs 18)
      const dot = svg.append('circle').attr('cx', x).attr('cy', axisY).attr('r', 22)
        .attr('fill', active ? t.teal : t.surface2)
        .attr('stroke', color).attr('stroke-width', 3);
      if (inter) {
        animPop(dot, 500, baseDelay);
        attachHover(dot, 1.35);
      }

      // when (above dot)
      const whenTxt = svg.append('text').attr('x', x).attr('y', whenY)
        .attr('text-anchor', 'middle').attr('fill', color)
        .attr('font-family', t.fontMono).attr('font-size', fs(18))
        .attr('letter-spacing', 1.5).attr('font-weight', 600).text(p.when);
      if (inter) animFade(whenTxt, 400, baseDelay + 100);

      // what (below when — bigger font for executive readability)
      const whatTxt = svg.append('text').attr('x', x).attr('y', whatY)
        .attr('text-anchor', 'middle').attr('fill', t.ink)
        .attr('font-family', t.fontSans).attr('font-weight', 800)
        .attr('font-size', fs(40)).attr('letter-spacing', -1).text(p.what);
      if (inter) animFade(whatTxt, 400, baseDelay + 200);

      // blurb (below dot — larger font, more spacing)
      if (p.blurb) {
        const words = p.blurb.split(' ');
        let line1 = '', line2 = '', total = 0;
        words.forEach(w => {
          if (total < 26) { line1 += (line1 ? ' ' : '') + w; total += w.length + 1; }
          else line2 += (line2 ? ' ' : '') + w;
        });
        const blurbG = svg.append('g');
        blurbG.append('text').attr('x', x).attr('y', blurbY1)
          .attr('text-anchor', 'middle').attr('fill', t.ink2)
          .attr('font-family', t.fontSans).attr('font-size', fs(20)).text(line1);
        if (line2) {
          blurbG.append('text').attr('x', x).attr('y', blurbY2 + 6)
            .attr('text-anchor', 'middle').attr('fill', t.ink2)
            .attr('font-family', t.fontSans).attr('font-size', fs(20)).text(line2);
        }
        if (inter) animFade(blurbG, 400, baseDelay + 300);
      }
    });

    if (config.caption) {
      svg.append('text').attr('x', W / 2).attr('y', H - 30)
        .attr('text-anchor', 'middle').attr('fill', t.inkFaint)
        .attr('font-family', t.fontMono).attr('font-size', fs(14))
        .attr('letter-spacing', 0.5).text(config.caption);
    }
  }

  // =========================================================
  // 7. renderMatrix — comparison matrix with dot ratings [NEW]
  //   config: {
  //     width?, height?,
  //     cols: [{ title, tag?, lead?: bool }],
  //     rows: [{ label, hint? }],
  //     // cells[rowIdx][colIdx] = 0|1|2|3 (0..max dots; default scale 0-3)
  //     cells: [[...numbers...]],
  //     verdicts?: [perCol strings],
  //     scale?: 3,
  //     legendLabels?: ['słabe','średnie','mocne']
  //   }
  // =========================================================
  function renderMatrix(el, config) {
    const t = tokens();
    const W = config.width  || 1200;
    const H = config.height || 600;
    const inter = isInteractive(config);
    const svg = newSvg(el, W, H);
    const fs = svg.fs;

    const cols = config.cols || [];
    const rows = config.rows || [];
    const scale = config.scale || 3;
    const padL = 220, padR = 40, padT = 60, padB = 80;
    const verdicts = config.verdicts || [];
    const verdictH = verdicts.length ? 80 : 0;

    const usableW = W - padL - padR;
    const colW = usableW / cols.length;
    const usableH = H - padT - padB - verdictH;
    const rowH = usableH / (rows.length + 1); // +1 for header

    // header row
    cols.forEach((c, ci) => {
      const x = padL + ci * colW + colW / 2;
      const isLead = c.lead;
      const g = svg.append('g');
      g.append('text').attr('x', x).attr('y', padT + 22)
        .attr('text-anchor', 'middle')
        .attr('fill', isLead ? t.teal : t.ink)
        .attr('font-family', t.fontSans).attr('font-weight', 700)
        .attr('font-size', fs(28)).attr('letter-spacing', -0.3)
        .text(c.title);
      if (c.tag) {
        g.append('text').attr('x', x).attr('y', padT + 52)
          .attr('text-anchor', 'middle')
          .attr('fill', t.inkMute).attr('font-family', t.fontMono)
          .attr('font-size', fs(15)).attr('letter-spacing', 1.0)
          .text(c.tag);
      }
      if (inter) animFade(g, 400, 100 + ci * 80);
    });

    // header divider
    svg.append('line')
      .attr('x1', 40).attr('y1', padT + rowH - 6)
      .attr('x2', W - 40).attr('y2', padT + rowH - 6)
      .attr('stroke', t.hairline).attr('stroke-width', 1);

    // column dividers (subtle)
    cols.slice(1).forEach((_, ci) => {
      const x = padL + (ci + 1) * colW;
      svg.append('line').attr('x1', x).attr('y1', padT + 10)
        .attr('x2', x).attr('y2', padT + usableH + rowH - 10)
        .attr('stroke', t.hairline).attr('stroke-dasharray', '3 5');
    });

    // rows
    rows.forEach((r, ri) => {
      const rowY = padT + rowH + ri * rowH;
      const rowBg = ri % 2 === 0 ? null : 'rgba(255,255,255,0.018)';
      if (rowBg) {
        svg.append('rect')
          .attr('x', 40).attr('y', rowY - rowH / 2 + 6)
          .attr('width', W - 80).attr('height', rowH - 4).attr('rx', 6)
          .attr('fill', rowBg);
      }

      // row label
      const labelG = svg.append('g');
      labelG.append('text').attr('x', 64).attr('y', rowY + 6)
        .attr('fill', t.ink2)
        .attr('font-family', t.fontSans).attr('font-weight', 600)
        .attr('font-size', fs(19)).text(r.label);
      if (r.hint) {
        labelG.append('text').attr('x', 64).attr('y', rowY + 30)
          .attr('fill', t.inkFaint).attr('font-family', t.fontMono)
          .attr('font-size', fs(14)).attr('letter-spacing', 0.4).text(r.hint);
      }
      if (inter) animFade(labelG, 400, 300 + ri * 100);

      // dots per column
      cols.forEach((c, ci) => {
        const cellX = padL + ci * colW + colW / 2;
        const filled = (config.cells[ri] || [])[ci] || 0;
        const dotSize = 14;
        const gap = 8;
        const groupW = scale * dotSize + (scale - 1) * gap;
        const startX = cellX - groupW / 2 + dotSize / 2;

        for (let d = 0; d < scale; d++) {
          const dx = startX + d * (dotSize + gap);
          const isFilled = d < filled;
          let fill, stroke;
          if (isFilled) {
            if (c.lead) { fill = t.teal; stroke = t.teal; }
            else if (filled === scale) { fill = t.sage; stroke = t.sage; }
            else { fill = t.inkMute; stroke = t.inkMute; }
          } else {
            fill = 'none';
            stroke = t.inkFaint;
          }
          const dot = svg.append('circle')
            .attr('cx', dx).attr('cy', rowY + 2).attr('r', dotSize / 2)
            .attr('fill', fill).attr('stroke', stroke).attr('stroke-width', 1.5);
          if (inter) animPop(dot, 380, 400 + ri * 100 + ci * 60 + d * 30);
        }
      });
    });

    // verdict row
    if (verdicts.length) {
      const vy = padT + rowH + rows.length * rowH + 30;
      svg.append('line').attr('x1', 40).attr('y1', vy - 12)
        .attr('x2', W - 40).attr('y2', vy - 12)
        .attr('stroke', t.hairline);
      svg.append('text').attr('x', 64).attr('y', vy + 18)
        .attr('fill', t.inkMute).attr('font-family', t.fontMono)
        .attr('font-size', fs(15)).attr('letter-spacing', 1.2)
        .attr('font-weight', 600).text('WERDYKT');
      // foreignObject HTML uses CSS px directly (not viewBox units), so we
      // multiply the desired CSS px by inverseScale to compensate for the
      // viewBox->container scale that affects ALL svg children, including FO.
      const foPx = fs(15);
      verdicts.forEach((v, ci) => {
        const x = padL + ci * colW + 18;
        const wText = colW - 36;
        const ft = svg.append('foreignObject')
          .attr('x', x).attr('y', vy - 4)
          .attr('width', wText).attr('height', verdictH + 20);
        const div = ft.append('xhtml:div')
          .attr('style', `font-family: ${t.fontSans}; font-size: ${foPx}px; line-height: 1.4; color: ${t.ink2};`)
          .html(v);
        if (inter) animFade(d3.select(ft.node()), 400, 800 + ci * 100);
      });
    }

    // legend
    if (config.legendLabels) {
      const ly = H - 30;
      const legendG = svg.append('g');
      legendG.append('text').attr('x', 64).attr('y', ly)
        .attr('fill', t.inkFaint).attr('font-family', t.fontMono)
        .attr('font-size', fs(13)).attr('letter-spacing', 0.6).text('//');
      let lx = 96;
      config.legendLabels.forEach((label, i) => {
        const filled = i + 1;
        for (let d = 0; d < scale; d++) {
          legendG.append('circle').attr('cx', lx + d * 14).attr('cy', ly - 5).attr('r', 5)
            .attr('fill', d < filled ? t.inkMute : 'none')
            .attr('stroke', d < filled ? t.inkMute : t.inkFaint).attr('stroke-width', 1.2);
        }
        lx += scale * 14 + 8;
        legendG.append('text').attr('x', lx).attr('y', ly)
          .attr('fill', t.inkMute).attr('font-family', t.fontMono).attr('font-size', fs(13))
          .text(label);
        lx += label.length * 9 + 32;
      });
      if (inter) animFade(legendG, 400, 1200);
    }
  }

  // ---- render one element ----
  function renderEl(el) {
    const type = el.getAttribute('data-dm-render');
    const cfgStr = el.getAttribute('data-dm-config') || '{}';
    let cfg;
    try { cfg = JSON.parse(cfgStr); }
    catch (e) { console.error('DM render config parse error on', el, e); return; }
    const fn = window.DM[`render${type[0].toUpperCase() + type.slice(1)}`];
    if (!fn) { console.error('DM render: unknown type', type); return; }
    try { fn(el, cfg); }
    catch (e) { console.error('DM render error', type, e); }
  }

  // Render with layout settled. Reveal fires 'slidechanged' before the slide
  // transform/transition completes, so canvas-vis offsetWidth can be ~half its
  // final size at that instant — the fs() helper bakes font-size attrs at a
  // wrong inverse-scale and text renders 2× too large. Defer to next frame,
  // and re-render if the container size changes (ResizeObserver settles).
  const _observers = new WeakMap();
  function renderElDeferred(el) {
    // Wait for layout: rAF, then verify parent has non-zero, stable size.
    const tryRender = (attempt) => {
      const parent = el.parentElement;
      const pw = parent ? parent.offsetWidth : 0;
      const ph = parent ? parent.offsetHeight : 0;
      if (pw > 200 && ph > 100) {
        renderEl(el);
      } else if (attempt < 10) {
        requestAnimationFrame(() => tryRender(attempt + 1));
      } else {
        renderEl(el);
      }
    };
    requestAnimationFrame(() => tryRender(0));

    // Re-render on container resize (one-shot per stable size).
    if (!_observers.has(el) && typeof ResizeObserver !== 'undefined' && el.parentElement) {
      let lastW = 0, lastH = 0, debounce;
      const ro = new ResizeObserver(() => {
        const w = el.parentElement.offsetWidth;
        const h = el.parentElement.offsetHeight;
        if (w === lastW && h === lastH) return;
        lastW = w; lastH = h;
        clearTimeout(debounce);
        debounce = setTimeout(() => {
          if (w > 200 && h > 100) renderEl(el);
        }, 120);
      });
      ro.observe(el.parentElement);
      _observers.set(el, ro);
    }
  }

  function renderWithin(root) {
    if (!root) return;
    root.querySelectorAll('[data-dm-render]').forEach(renderElDeferred);
  }

  // ---- Slide-aware init: only render the CURRENT slide on entry.
  // Reveal.js fires 'slidechanged' when navigation occurs — re-render on enter
  // so animations play fresh every time the slide becomes visible.
  function setupRevealHooks() {
    const R = window.Reveal;
    if (!R) return false;
    const onFn = R.on || R.addEventListener;
    if (typeof onFn !== 'function') return false;

    const renderCurrent = () => {
      const cur = R.getCurrentSlide && R.getCurrentSlide();
      if (cur) renderWithin(cur);
    };

    onFn.call(R, 'ready', renderCurrent);
    onFn.call(R, 'slidechanged', (e) => {
      if (e && e.currentSlide) renderWithin(e.currentSlide);
    });

    // Fragment changes also re-render (in case fragments hide/show D3 vis)
    // Skipped: usually unnecessary, and re-render would replay animations each fragment.

    // Render current slide NOW in case 'ready' already fired
    if (R.isReady && R.isReady()) renderCurrent();

    return true;
  }

  function autoInit() {
    // Prefer Reveal-driven render. Fall back to eager render if Reveal absent
    // or not initialized within ~3 seconds.
    if (setupRevealHooks()) return;
    let tries = 0;
    const poll = setInterval(() => {
      if (setupRevealHooks()) { clearInterval(poll); return; }
      if (++tries > 30) {
        // No Reveal — render everything eagerly (non-reveal context)
        clearInterval(poll);
        renderWithin(document);
      }
    }, 100);
  }

  Object.assign(window.DM, {
    renderCurves, renderVectors, renderGantt,
    renderFlow, renderTree, renderTimeline, renderMatrix,
    autoInit, renderWithin, renderEl, tokens,
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }
})();
