"use client";

import { useEffect, useRef } from "react";

type Star = { x: number; y: number; r: number; a: number; glow: number };
type Satellite = { x: number; y: number; vx: number; vy: number; blink: number };
type Meteor = { x: number; y: number; vx: number; vy: number; life: number; max: number };

// Well-known constellations as bare dot patterns (local coords 0..1, brightness).
// No lines, no labels — just the recognizable placement of the stars.
const CONSTELLATIONS: { anchor: [number, number]; w: number; h: number; pts: [number, number, number][] }[] = [
  {
    // Ursa Major (the Plough / Big Dipper)
    anchor: [0.05, 0.1],
    w: 0.32,
    h: 0.16,
    pts: [
      [0.02, 0.2, 1], [0.03, 0.55, 0.9], [0.28, 0.7, 0.85], [0.3, 0.35, 0.8],
      [0.55, 0.3, 0.95], [0.78, 0.24, 0.85], [0.98, 0.05, 1],
    ],
  },
  {
    // Orion
    anchor: [0.12, 0.55],
    w: 0.2,
    h: 0.36,
    pts: [
      [0.18, 0.04, 1], [0.7, 0.12, 0.95],
      [0.4, 0.48, 0.9], [0.5, 0.52, 0.9], [0.6, 0.56, 0.9],
      [0.24, 0.96, 1], [0.72, 0.9, 0.85],
    ],
  },
  {
    // Cassiopeia (the W)
    anchor: [0.72, 0.06],
    w: 0.22,
    h: 0.1,
    pts: [
      [0.0, 0.3, 0.9], [0.25, 0.9, 0.85], [0.5, 0.2, 0.95], [0.75, 0.85, 0.85], [1.0, 0.35, 0.9],
    ],
  },
];

export default function StarSky({
  density = 1,
  saturnus = true,
}: {
  density?: number;
  saturnus?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const buffer = document.createElement("canvas");
    const bctx = buffer.getContext("2d");
    if (!bctx) return;

    let dpr = 1;
    let raf = 0;
    let lastT = 0;
    let time = 0;
    const satellites: Satellite[] = [];
    const meteors: Meteor[] = [];
    let nextSat = 3;
    let nextMeteor = 2;

    const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo);

    const dot = (
      c: CanvasRenderingContext2D,
      px: number,
      py: number,
      r: number,
      a: number,
      glow: number
    ) => {
      if (glow > 0) {
        const g = c.createRadialGradient(px, py, 0, px, py, r * glow);
        g.addColorStop(0, `rgba(255,255,255,${a * 0.55})`);
        g.addColorStop(1, "rgba(255,255,255,0)");
        c.fillStyle = g;
        c.beginPath();
        c.arc(px, py, r * glow, 0, Math.PI * 2);
        c.fill();
      }
      c.fillStyle = `rgba(255,255,255,${a})`;
      c.beginPath();
      c.arc(px, py, r, 0, Math.PI * 2);
      c.fill();
    };

    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = buffer.width = Math.floor(w * dpr);
      canvas.height = buffer.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      const W = buffer.width;
      const H = buffer.height;
      const area = w * h;
      const stars: Star[] = [];

      // The Milky Way — a soft diagonal haze band across the sky, with a dense
      // concentration of extra-faint stars along it. This is what sells depth.
      const bandCx = W * rand(0.35, 0.65);
      const bandCy = H * rand(0.35, 0.65);
      const bandAng = rand(-0.7, 0.7);
      const bandThick = rand(0.3, 0.5) * H;
      const cos = Math.cos(bandAng);
      const sin = Math.sin(bandAng);

      // Ultra-faint "dust" — a huge number of barely-visible pinpoints. This is
      // the layer that makes the sky feel deep and endless.
      const dust = Math.floor((area / 32) * density);
      for (let i = 0; i < dust; i++) {
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: rand(0.16, 0.4) * dpr,
          a: rand(0.07, 0.26),
          glow: 0,
        });
      }

      // Faint tiny stars, biased so the field isn't perfectly uniform.
      const tiny = Math.floor((area / 85) * density);
      for (let i = 0; i < tiny; i++) {
        const y = Math.pow(Math.random(), rand(0.7, 1.4));
        stars.push({
          x: Math.random() * W,
          y: y * H,
          r: rand(0.2, 0.5) * dpr,
          a: rand(0.12, 0.38),
          glow: 0,
        });
      }

      // Extra faint stars packed along the Milky Way band.
      const bandStars = Math.floor((area / 28) * density);
      for (let i = 0; i < bandStars; i++) {
        // position along the band (u) and gaussian offset across it (v)
        const u = (Math.random() - 0.5) * Math.max(W, H) * 1.8;
        const v =
          (Math.random() + Math.random() + Math.random() - 1.5) * (bandThick / 2);
        stars.push({
          x: bandCx + u * cos - v * sin,
          y: bandCy + u * sin + v * cos,
          r: rand(0.16, 0.42) * dpr,
          a: rand(0.08, 0.3),
          glow: 0,
        });
      }

      // Clusters — denser knots of tiny stars, so distribution reads clumpy.
      const clusters = Math.floor(rand(9, 14) * density);
      for (let ci = 0; ci < clusters; ci++) {
        const cx = Math.random() * W;
        const cy = Math.random() * H;
        const spread = rand(40, 150) * dpr;
        const n = Math.floor(rand(30, 80));
        for (let i = 0; i < n; i++) {
          // gaussian-ish offset
          const ox = (Math.random() + Math.random() + Math.random() - 1.5) * spread;
          const oy = (Math.random() + Math.random() + Math.random() - 1.5) * spread;
          stars.push({
            x: cx + ox,
            y: cy + oy,
            r: rand(0.25, 0.55) * dpr,
            a: rand(0.18, 0.45),
            glow: 0,
          });
        }
      }

      // A sprinkle of brighter stars — mostly small, a rare few larger (steep
      // power curve gives real size variance instead of one uniform big size).
      const bright = Math.floor((area / 3200) * density);
      for (let i = 0; i < bright; i++) {
        const mag = Math.pow(Math.random(), 3);
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: (0.55 + mag * 0.9) * dpr,
          a: 0.5 + mag * 0.45,
          glow: mag > 0.5 ? 2.4 : 0,
        });
      }

      // Constellations — recognizable dot patterns, a touch brighter.
      for (const c of CONSTELLATIONS) {
        for (const [lx, ly, mag] of c.pts) {
          stars.push({
            x: (c.anchor[0] + lx * c.w) * W,
            y: (c.anchor[1] + ly * c.h) * H,
            r: rand(0.7, 1.15) * mag * dpr,
            a: 0.6 + mag * 0.3,
            glow: mag > 0.9 ? 2.2 : 0,
          });
        }
      }

      bctx.clearRect(0, 0, W, H);

      // Soft galactic haze under the stars — a couple of faint blotches along
      // the band axis give it an uneven, cloudy Milky-Way texture.
      bctx.save();
      bctx.translate(bandCx, bandCy);
      bctx.rotate(bandAng);
      const len = Math.max(W, H) * 1.8;
      // Overlapping soft blotches. Each is a circular gradient that fades fully
      // to zero at its radius, then squashed into an ellipse — so there is no
      // hard edge where the disc ends.
      for (let i = 0; i < 8; i++) {
        const bx = ((i + rand(-0.35, 0.35)) / 7 - 0.5) * len * 0.95;
        const by = rand(-0.18, 0.18) * bandThick;
        const rx = rand(0.32, 0.6) * len * 0.5;
        const ry = bandThick * rand(0.42, 0.72);
        const alpha = rand(0.022, 0.045);
        bctx.save();
        bctx.translate(bx, by);
        bctx.scale(1, ry / rx);
        const g = bctx.createRadialGradient(0, 0, 0, 0, 0, rx);
        g.addColorStop(0, `rgba(190,200,225,${alpha})`);
        g.addColorStop(0.45, `rgba(190,200,225,${alpha * 0.55})`);
        g.addColorStop(1, "rgba(190,200,225,0)");
        bctx.fillStyle = g;
        bctx.beginPath();
        bctx.arc(0, 0, rx, 0, Math.PI * 2);
        bctx.fill();
        bctx.restore();
      }
      bctx.restore();

      for (const s of stars) dot(bctx, s.x, s.y, s.r, s.a, s.glow);
    };

    const spawnSatellite = () => {
      const W = canvas.width;
      const H = canvas.height;
      const fromLeft = Math.random() < 0.5;
      const speed = rand(0.008, 0.017) * W; // px per second — very slow drift
      const angle = rand(-0.25, 0.25); // slight tilt
      satellites.push({
        x: fromLeft ? -10 : W + 10,
        y: rand(0.05, 0.8) * H,
        vx: (fromLeft ? 1 : -1) * speed * Math.cos(angle),
        vy: speed * Math.sin(angle),
        blink: Math.random() * Math.PI * 2,
      });
    };

    const spawnMeteor = () => {
      const W = canvas.width;
      const H = canvas.height;
      const speed = rand(0.4, 0.65) * W; // fast, but short-lived
      const dir = Math.random() < 0.5 ? 1 : -1;
      const angle = rand(0.35, 0.6); // downward diagonal
      meteors.push({
        x: rand(0.15, 0.85) * W,
        y: rand(0.05, 0.4) * H,
        vx: dir * speed * Math.cos(angle),
        vy: speed * Math.sin(angle),
        life: 0,
        max: rand(0.3, 0.55), // short travel — crosses only part of the sky
      });
    };

    const tick = (t: number) => {
      const now = t / 1000;
      const dt = lastT ? Math.min(now - lastT, 0.05) : 0;
      lastT = now;
      time = now;

      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(buffer, 0, 0);

      // Satellites — steady points drifting across, gentle blink. Keep max 2.
      if (now > nextSat && satellites.length < 2) {
        spawnSatellite();
        nextSat = now + rand(9, 22);
      }
      for (let i = satellites.length - 1; i >= 0; i--) {
        const s = satellites[i];
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        if (s.x < -20 || s.x > W + 20 || s.y < -20 || s.y > H + 20) {
          satellites.splice(i, 1);
          continue;
        }
        const a = 0.55 + 0.35 * Math.sin(now * 4 + s.blink);
        dot(ctx, s.x, s.y, 1.0 * dpr, a, 0);
      }

      // Meteors (stjärnfall) — fast streak with a fading tail.
      if (now > nextMeteor) {
        spawnMeteor();
        nextMeteor = now + rand(14, 34);
      }
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.life += dt;
        m.x += m.vx * dt;
        m.y += m.vy * dt;
        const p = m.life / m.max;
        if (p >= 1) {
          meteors.splice(i, 1);
          continue;
        }
        // fade in then out
        const fade = Math.sin(Math.min(p, 1) * Math.PI);
        const tailT = 0.03; // seconds of trail — short streak
        const tx = m.x - m.vx * tailT;
        const ty = m.y - m.vy * tailT;
        const grad = ctx.createLinearGradient(m.x, m.y, tx, ty);
        grad.addColorStop(0, `rgba(255,255,255,${0.85 * fade})`);
        grad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 0.9 * dpr;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tx, ty);
        ctx.stroke();
        // bright head
        dot(ctx, m.x, m.y, 0.85 * dpr, fade, 2.2);
      }

      // Saturnus — slightly larger star near the centre. Fast, irregular
      // flicker (layered sines) plus a faint tilted aura hinting the ring.
      if (saturnus) {
        // On portrait/phone screens sit closer to the upper-right rule-of-thirds
        // point for a stronger composition; keep the roomier spot on wide screens.
        const portrait = W < H;
        const px = (portrait ? 0.66 : 0.6) * W;
        const py = (portrait ? 0.34 : 0.3) * H;
        // mostly bright, with small fast irregular variation — a shimmer,
        // not an on/off blink
        const tw =
          0.86 +
          0.06 * Math.sin(time * 7.0) +
          0.05 * Math.sin(time * 13.3 + 1.7) +
          0.04 * Math.sin(time * 23.1 + 4.2);
        const a = Math.max(0.6, Math.min(1, tw));

        // ring aura — a subtle tilted ellipse, brightening with the twinkle
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(-0.4);
        ctx.strokeStyle = `rgba(255,246,224,${0.08 + a * 0.14})`;
        ctx.lineWidth = 0.8 * dpr;
        ctx.beginPath();
        ctx.ellipse(0, 0, 7 * dpr, 2.4 * dpr, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        dot(ctx, px, py, 2.0 * dpr, a, 3.8);
      }

      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      build();
      lastT = 0;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };

    start();

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(start, 150);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
    };
  }, [density, saturnus]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 h-full w-full"
    />
  );
}
