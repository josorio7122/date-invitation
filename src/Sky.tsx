import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

type Star = { x: number; y: number; r: number; a: number; phase: number; speed: number; color: string };

// Real-sky spectral mix: mostly white, some blue-white, a few warm and orange.
function starColor(u: number) {
  if (u < 0.58) return "#f2f5ff";
  if (u < 0.8) return "#d5e3ff";
  if (u < 0.95) return "#ffeccb";
  return "#ffc99a";
}
type Blob = { x: number; y: number; rx: number; ry: number; rot: number; hue: number; sat: number; light: number; alpha: number; phase: number; drift: number };
type Meteor = { x: number; y: number; vx: number; vy: number; life: number; max: number; len: number };

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeStars(seed: number, count: number, rMin: number, rSpread: number, aMin: number, aSpread: number): Star[] {
  const rand = mulberry32(seed);
  return Array.from({ length: count }, () => {
    const m = rand();
    return {
      x: rand(),
      y: rand() * 0.92,
      r: rMin + m * m * rSpread,
      a: aMin + rand() * aSpread,
      phase: rand() * Math.PI * 2,
      speed: 1.2 + rand() * 2.6,
      color: starColor(rand()),
    };
  });
}

// Near stars twinkle live every frame; mid and far layers are baked to sprites and refreshed at a low rate.
const NEAR = makeStars(828, 60, 0.8, 1.3, 0.75, 0.25);
const MID = makeStars(829, 320, 0.45, 0.6, 0.4, 0.4);
const FAR = makeStars(830, 1100, 0.25, 0.35, 0.16, 0.3);
const BRIGHT = NEAR.filter((s) => s.r > 1.75).slice(0, 8);

const BAND_ANGLE = -0.75;

// Dust along a diagonal band with a denser core, the Milky Way.
const DUST: Star[] = (() => {
  const r = mulberry32(1128);
  const gauss = () => (r() + r() + r() - 1.5) * 1.2;
  const out: Star[] = [];
  const ux = Math.cos(BAND_ANGLE);
  const uy = Math.sin(BAND_ANGLE);
  for (let i = 0; i < 2600; i++) {
    const t = (r() * 2 - 1) * 1.2;
    const core = i < 900;
    const w = gauss() * (core ? 0.03 : 0.09);
    out.push({
      x: 0.55 + ux * t - uy * w,
      y: 0.42 + uy * t + ux * w,
      r: 0.25 + r() * (core ? 0.45 : 0.35),
      a: (core ? 0.16 : 0.09) + r() * 0.2,
      phase: r() * 6.28,
      speed: 0.3 + r() * 0.8,
      color: "#e6edff",
    });
  }
  return out;
})();

// The Milky Way as a pale, desaturated band with a darker dust lane along its core, plus faint airglow low in the sky.
const BLOBS: Blob[] = [
  { x: 0.55, y: 0.42, rx: 1.0, ry: 0.17, rot: BAND_ANGLE, hue: 222, sat: 22, light: 62, alpha: 0.11, phase: 0.4, drift: 0.008 },
  { x: 0.62, y: 0.36, rx: 0.55, ry: 0.07, rot: BAND_ANGLE, hue: 225, sat: 20, light: 70, alpha: 0.09, phase: 2.2, drift: 0.006 },
  { x: 0.3, y: 0.6, rx: 0.5, ry: 0.06, rot: BAND_ANGLE + 0.08, hue: 222, sat: 20, light: 66, alpha: 0.07, phase: 1.1, drift: 0.007 },
  { x: 0.5, y: 0.82, rx: 0.9, ry: 0.22, rot: 0, hue: 215, sat: 45, light: 40, alpha: 0.1, phase: 4.4, drift: 0.004 },
];
const LANE: Blob = { x: 0.56, y: 0.44, rx: 0.7, ry: 0.032, rot: BAND_ANGLE, hue: 222, sat: 40, light: 6, alpha: 0.55, phase: 0, drift: 0.006 };

export function Sky({ lit }: { lit: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const litRef = useRef(lit);
  const redrawRef = useRef<() => void>(() => {});

  useEffect(() => {
    litRef.current = lit;
    if (reduce) redrawRef.current();
  }, [lit, reduce]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let last = performance.now();
    let t = 0;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const meteors: Meteor[] = [];
    let nextMeteor = 2.5;
    let litAmount = 0;
    let nebulaAt = -1;
    let midAt = -1;
    let farAt = -1;

    const moon = document.createElement("canvas");
    const moonCtx = moon.getContext("2d")!;
    const nebula = document.createElement("canvas");
    const nebulaCtx = nebula.getContext("2d")!;
    const mid = document.createElement("canvas");
    const midCtx = mid.getContext("2d")!;
    const far = document.createElement("canvas");
    const farCtx = far.getContext("2d")!;
    const PAD = 40;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = canvas!.clientWidth;
      h = canvas!.clientHeight;
      canvas!.width = Math.floor(w * dpr);
      canvas!.height = Math.floor(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      nebula.width = Math.ceil(w / 4);
      nebula.height = Math.ceil(h / 4);
      for (const c of [mid, far]) {
        c.width = Math.floor((w + PAD * 2) * dpr);
        c.height = Math.floor((h + PAD * 2) * dpr);
      }
      midCtx.setTransform(dpr, 0, 0, dpr, PAD * dpr, PAD * dpr);
      farCtx.setTransform(dpr, 0, 0, dpr, PAD * dpr, PAD * dpr);
      nebulaAt = midAt = farAt = -1;
      paintMoon();
      if (reduce) draw(0);
    }

    function paintMoon() {
      const R = Math.max(14, Math.min(w, h) * 0.034);
      const size = R * 2.4;
      moon.width = size * dpr;
      moon.height = size * dpr;
      moonCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      moonCtx.clearRect(0, 0, size, size);
      const c = size / 2;
      moonCtx.fillStyle = "#f3f0ea";
      moonCtx.beginPath();
      moonCtx.arc(c, c, R, 0, Math.PI * 2);
      moonCtx.fill();
      moonCtx.globalCompositeOperation = "destination-out";
      moonCtx.beginPath();
      moonCtx.arc(c - R * 0.42, c - R * 0.12, R * 0.92, 0, Math.PI * 2);
      moonCtx.fill();
      moonCtx.globalCompositeOperation = "source-over";
    }

    function paintNebula() {
      const nw = nebula.width;
      const nh = nebula.height;
      nebulaCtx.setTransform(1, 0, 0, 1, 0, 0);
      nebulaCtx.clearRect(0, 0, nw, nh);
      nebulaCtx.globalCompositeOperation = "source-over";
      const boost = 1 + litAmount * 0.6;
      for (const b of BLOBS) {
        const bx = (b.x + Math.sin(t * b.drift + b.phase) * 0.03) * nw;
        const by = (b.y + Math.cos(t * b.drift * 0.8 + b.phase) * 0.025) * nh;
        const rx = b.rx * Math.max(nw, nh) * 0.55;
        const ry = b.ry * Math.max(nw, nh) * 0.55;
        nebulaCtx.setTransform(1, 0, 0, 1, bx, by);
        nebulaCtx.rotate(b.rot);
        nebulaCtx.scale(1, ry / rx);
        const rg = nebulaCtx.createRadialGradient(0, 0, 0, 0, 0, rx);
        const a = Math.min(0.4, b.alpha * boost);
        rg.addColorStop(0, `hsla(${b.hue} ${b.sat}% ${b.light}% / ${a})`);
        rg.addColorStop(0.45, `hsla(${b.hue} ${b.sat}% ${b.light}% / ${a * 0.4})`);
        rg.addColorStop(1, `hsla(${b.hue} ${b.sat}% ${b.light}% / 0)`);
        nebulaCtx.fillStyle = rg;
        nebulaCtx.fillRect(-rx, -rx, rx * 2, rx * 2);
      }
      nebulaCtx.setTransform(1, 0, 0, 1, 0, 0);
      nebulaCtx.globalCompositeOperation = "source-over";
      {
        const b = LANE;
        const bx = (b.x + Math.sin(t * b.drift + b.phase) * 0.03) * nw;
        const by = (b.y + Math.cos(t * b.drift * 0.8 + b.phase) * 0.025) * nh;
        const rx = b.rx * Math.max(nw, nh) * 0.55;
        const ry = b.ry * Math.max(nw, nh) * 0.55;
        nebulaCtx.setTransform(1, 0, 0, 1, bx, by);
        nebulaCtx.rotate(b.rot);
        nebulaCtx.scale(1, ry / rx);
        const rg = nebulaCtx.createRadialGradient(0, 0, 0, 0, 0, rx);
        rg.addColorStop(0, `hsla(${b.hue} ${b.sat}% ${b.light}% / ${b.alpha})`);
        rg.addColorStop(0.6, `hsla(${b.hue} ${b.sat}% ${b.light}% / ${b.alpha * 0.35})`);
        rg.addColorStop(1, `hsla(${b.hue} ${b.sat}% ${b.light}% / 0)`);
        nebulaCtx.fillStyle = rg;
        nebulaCtx.fillRect(-rx, -rx, rx * 2, rx * 2);
        nebulaCtx.setTransform(1, 0, 0, 1, 0, 0);
      }
    }

    function paintLayer(c: CanvasRenderingContext2D, stars: Star[], twinkleDepth: number, extra?: Star[]) {
      c.clearRect(-PAD, -PAD, w + PAD * 2, h + PAD * 2);
      const staticFrame = !!reduce;
      const lift = 1 + litAmount * 0.35;
      if (extra) {
        c.fillStyle = "#e6edff";
        for (const s of extra) {
          const px = s.x * w;
          const py = s.y * h;
          if (px < -PAD || px > w + PAD || py < -PAD || py > h + PAD) continue;
          const tw = staticFrame ? 1 : 0.8 + 0.2 * Math.sin(t * s.speed + s.phase);
          c.globalAlpha = Math.min(1, s.a * tw * lift);
          c.beginPath();
          c.arc(px, py, s.r, 0, Math.PI * 2);
          c.fill();
        }
      }
      for (const s of stars) {
        const tw = staticFrame ? 1 : 1 - twinkleDepth + twinkleDepth * Math.sin(t * s.speed + s.phase);
        c.globalAlpha = Math.min(1, s.a * tw * lift);
        c.fillStyle = s.color;
        c.beginPath();
        c.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
        c.fill();
      }
      c.globalAlpha = 1;
    }

    function hills(y0: number) {
      ctx!.beginPath();
      ctx!.moveTo(0, h);
      ctx!.lineTo(0, y0 + h * 0.02);
      ctx!.bezierCurveTo(w * 0.18, y0 - h * 0.03, w * 0.3, y0 + h * 0.035, w * 0.46, y0 + h * 0.005);
      ctx!.bezierCurveTo(w * 0.62, y0 - h * 0.03, w * 0.78, y0 + h * 0.03, w, y0 - h * 0.01);
      ctx!.lineTo(w, h);
      ctx!.closePath();
    }

    function draw(dt: number) {
      const staticFrame = !!reduce;
      const target = litRef.current ? 1 : 0;
      litAmount = dt === 0 ? target : litAmount + (target - litAmount) * Math.min(1, dt * 1.4);

      pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 3);
      pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 3);

      // Ground: deep zenith to a blue horizon; the horizon lifts a little when she says yes.
      const g = ctx!.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "#02040f");
      g.addColorStop(0.5, mix("#040a20", "#061131", litAmount));
      g.addColorStop(0.85, mix("#08132e", "#0c1f4a", litAmount));
      g.addColorStop(1, mix("#0e1c3f", "#16305f", litAmount));
      ctx!.fillStyle = g;
      ctx!.fillRect(0, 0, w, h);

      // Nebula, painted at quarter resolution and upscaled.
      if (t - nebulaAt > 0.12 || nebulaAt < 0) {
        paintNebula();
        nebulaAt = t;
      }
      ctx!.imageSmoothingEnabled = true;
      ctx!.drawImage(nebula, pointer.x * 8 - 8, pointer.y * 5 - 5, w + 16, h + 10);

      // Far and mid layers, refreshed at ~10 Hz, offset by pointer for parallax.
      if (t - farAt > 0.11 || farAt < 0) {
        paintLayer(farCtx, FAR, 0.12, DUST);
        farAt = t;
      }
      if (t - midAt > 0.09 || midAt < 0) {
        paintLayer(midCtx, MID, 0.16);
        midAt = t;
      }
      ctx!.drawImage(far, -PAD + pointer.x * 10, -PAD + pointer.y * 6, w + PAD * 2, h + PAD * 2);
      ctx!.drawImage(mid, -PAD + pointer.x * 18, -PAD + pointer.y * 11, w + PAD * 2, h + PAD * 2);

      // Near stars, live twinkle.
      const lift = 1 + litAmount * 0.3;
      for (const s of NEAR) {
        const px = s.x * w + pointer.x * 28;
        const py = s.y * h + pointer.y * 18;
        const tw = staticFrame ? 1 : 0.8 + 0.2 * Math.sin(t * s.speed + s.phase) * Math.sin(t * s.speed * 0.37 + s.phase * 2);
        ctx!.globalAlpha = Math.min(1, s.a * tw * lift);
        ctx!.fillStyle = s.color;
        ctx!.beginPath();
        ctx!.arc(px, py, s.r, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;

      // Halos and glints on the brightest.
      for (const s of BRIGHT) {
        const px = s.x * w + pointer.x * 28;
        const py = s.y * h + pointer.y * 18;
        const tw = staticFrame ? 1 : 0.75 + 0.25 * Math.sin(t * s.speed * 0.7 + s.phase);
        const hr = s.r * 4;
        const rg = ctx!.createRadialGradient(px, py, 0, px, py, hr);
        rg.addColorStop(0, `rgba(238,244,255,${0.18 * tw})`);
        rg.addColorStop(1, "rgba(238,244,255,0)");
        ctx!.fillStyle = rg;
        ctx!.fillRect(px - hr, py - hr, hr * 2, hr * 2);
        ctx!.strokeStyle = `rgba(238,244,255,${0.22 * tw})`;
        ctx!.lineWidth = 0.5;
        const L = s.r * 2.6 * tw;
        ctx!.beginPath();
        ctx!.moveTo(px - L, py);
        ctx!.lineTo(px + L, py);
        ctx!.moveTo(px, py - L);
        ctx!.lineTo(px, py + L);
        ctx!.stroke();
      }

      // Meteors.
      if (!staticFrame) {
        nextMeteor -= dt;
        if (nextMeteor <= 0 && meteors.length < 2) {
          const fromLeft = Math.random() > 0.5;
          const speed = 900 + Math.random() * 500;
          const ang = fromLeft ? 0.55 + Math.random() * 0.3 : Math.PI - (0.55 + Math.random() * 0.3);
          meteors.push({
            x: fromLeft ? Math.random() * w * 0.5 : w * 0.5 + Math.random() * w * 0.5,
            y: Math.random() * h * 0.35,
            vx: Math.cos(ang) * speed,
            vy: Math.sin(ang) * speed * 0.6,
            life: 0,
            max: 0.45 + Math.random() * 0.35,
            len: 60 + Math.random() * 80,
          });
          nextMeteor = litAmount > 0.5 ? 2.5 + Math.random() * 3 : 8 + Math.random() * 9;
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
          const fade = p < 0.2 ? p / 0.2 : 1 - (p - 0.2) / 0.8;
          const n = Math.hypot(m.vx, m.vy);
          const tx = m.x - (m.vx / n) * m.len;
          const ty = m.y - (m.vy / n) * m.len;
          const lg = ctx!.createLinearGradient(m.x, m.y, tx, ty);
          lg.addColorStop(0, `rgba(255,255,255,${0.95 * fade})`);
          lg.addColorStop(0.3, `rgba(210,228,255,${0.5 * fade})`);
          lg.addColorStop(1, "rgba(210,228,255,0)");
          ctx!.strokeStyle = lg;
          ctx!.lineWidth = 1;
          ctx!.lineCap = "round";
          ctx!.beginPath();
          ctx!.moveTo(m.x, m.y);
          ctx!.lineTo(tx, ty);
          ctx!.stroke();
        }
      }

      // Moon, upper right, with a wide soft glow.
      const mx = w * 0.82 + pointer.x * 6;
      const my = h * 0.14 + pointer.y * 4;
      const ms = moon.width / dpr;
      const mR = ms / 2.4;
      const glowR = mR * 6;
      const mg = ctx!.createRadialGradient(mx, my, mR * 0.6, mx, my, glowR);
      mg.addColorStop(0, "rgba(220,230,255,0.12)");
      mg.addColorStop(0.4, "rgba(180,205,255,0.035)");
      mg.addColorStop(1, "rgba(180,205,255,0)");
      ctx!.fillStyle = mg;
      ctx!.fillRect(mx - glowR, my - glowR, glowR * 2, glowR * 2);
      ctx!.drawImage(moon, mx - ms / 2, my - ms / 2, ms, ms);

      // Mist above the hills, then the hills.
      const hy = h * 0.86;
      const mist = ctx!.createLinearGradient(0, hy - h * 0.22, 0, hy + h * 0.02);
      mist.addColorStop(0, "rgba(100,150,225,0)");
      mist.addColorStop(1, `rgba(90,130,200,${0.06 + litAmount * 0.05})`);
      ctx!.fillStyle = mist;
      ctx!.fillRect(0, hy - h * 0.22, w, h * 0.24);

      hills(hy + h * 0.03);
      ctx!.fillStyle = "#050c1e";
      ctx!.fill();
      hills(hy + h * 0.065);
      ctx!.fillStyle = "#02050f";
      ctx!.fill();
    }

    function frame(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      t += dt;
      draw(dt);
      raf = requestAnimationFrame(frame);
    }

    function onPointer(e: PointerEvent) {
      pointer.tx = (e.clientX / w - 0.5) * 2;
      pointer.ty = (e.clientY / h - 0.5) * 2;
    }
    function onTilt(e: DeviceOrientationEvent) {
      if (e.gamma == null || e.beta == null) return;
      pointer.tx = Math.max(-1, Math.min(1, e.gamma / 30));
      pointer.ty = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
    }
    function onVisibility() {
      if (reduce) return;
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    }

    redrawRef.current = () => draw(0);
    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    if (reduce) {
      draw(0);
    } else {
      window.addEventListener("pointermove", onPointer, { passive: true });
      window.addEventListener("deviceorientation", onTilt, true);
      raf = requestAnimationFrame(frame);
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("deviceorientation", onTilt, true);
    };
  }, [reduce]);

  return <canvas ref={ref} className="sky" aria-hidden="true" />;
}

function mix(a: string, b: string, k: number) {
  if (k <= 0) return a;
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (shift: number) => {
    const va = (pa >> shift) & 255;
    const vb = (pb >> shift) & 255;
    return Math.round(va + (vb - va) * k);
  };
  return `rgb(${ch(16)},${ch(8)},${ch(0)})`;
}
