"use client";

import { useRef, useEffect } from "react";

export type FractalState = "chaos" | "organizing" | "panic";

interface Props {
  state: FractalState;
}

export default function FractalBackground({ state }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    // ── Tuning knobs ────────────────────────────────────────────────────────
    const N = 100; // particle count  (O(N^3) triangle search — keep ≤ 100)
    const MAX_DIST = 100; // px — connection radius in chaos state
    const MAX_TRIS = 600; // cap triangles per frame so dense clusters don't spike
    // ────────────────────────────────────────────────────────────────────────

    const px = new Float32Array(N);
    const py = new Float32Array(N);
    const vx = new Float32Array(N);
    const vy = new Float32Array(N);
    const tx = new Float32Array(N); // grid target X
    const ty = new Float32Array(N); // grid target Y
    const phase = new Float32Array(N); // per-particle phase offset for organic variation

    const connected = new Uint8Array(N * N);

    let W = 0,
      H = 0;

    const init = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      for (let i = 0; i < N; i++) {
        px[i] = Math.random() * W;
        py[i] = Math.random() * H;
        vx[i] = 0;
        vy[i] = 0;
        phase[i] = Math.random() * Math.PI * 2;
      }
      // grid targets for "organizing" state
      const cols = Math.round(Math.sqrt(N * (W / H)));
      const rows = Math.ceil(N / cols);
      for (let i = 0; i < N; i++) {
        tx[i] = ((i % cols) + 0.5) * (W / cols);
        ty[i] = (Math.floor(i / cols) + 0.5) * (H / rows);
      }
    };

    init();
    window.addEventListener("resize", init);

    let t = 0;
    let orgProgress = 0;
    let animId: number;
    let lastTime = 0;
    const TARGET_FPS = 12; // draw at 30fps — halves all O(N^3) work vs 60fps
    const FRAME_MS = 1000 / TARGET_FPS;

    function draw(now: number) {
      animId = requestAnimationFrame(draw);
      if (now - lastTime < FRAME_MS) return; // skip frame
      lastTime = now;

      const s = stateRef.current;
      const isPanic = s === "panic";
      const isOrg = s === "organizing";

      // Advance time — values halved vs before because we run at 30fps
      t += isPanic ? 0.0005 : isOrg ? 0.0001 : 0.0001;

      // Organise progress
      if (isOrg) orgProgress = Math.min(1, orgProgress + 0.012);
      else if (isPanic) orgProgress = Math.max(0, orgProgress - 0.02);
      else orgProgress = Math.max(0, orgProgress - 0.006);

      // Trail fade — slow fade = long organic trails
      ctx.fillStyle = isPanic ? "rgba(10,5,5,0.25)" : "rgba(10,10,20,0.13)";
      ctx.fillRect(0, 0, W, H);

      // ── Flow field (two-frequency: big slow currents + small local wiggles) ──
      const chaosAmp = isPanic ? 4.8 : (1 - orgProgress * 0.8) * 1.8;
      const fLow = 0.0007; // large scale — big lazy curls
      const fHigh = 0.003; // small scale — organic texture

      for (let i = 0; i < N; i++) {
        const ph = phase[i];
        // Two-layer flow: smooth large curl + detailed local wiggle
        const ax =
          Math.sin(py[i] * fLow + t * 0.5 + ph) * chaosAmp * 2.2 +
          Math.cos(px[i] * fHigh + t * 1.1 + i * 0.09) * chaosAmp * 0.5;
        const ay =
          Math.cos(px[i] * fLow + t * 0.45 + ph * 1.2) * chaosAmp * 2.2 +
          Math.sin(py[i] * fHigh + t * 0.95 + i * 0.07) * chaosAmp * 0.5;

        // Pull toward grid when organizing
        const pull = orgProgress * 0.08;
        vx[i] += (ax + (tx[i] - px[i]) * pull) * 0.08;
        vy[i] += (ay + (ty[i] - py[i]) * pull) * 0.08;

        const damp = isPanic ? 0.87 : 0.92 + orgProgress * 0.06;
        vx[i] *= damp;
        vy[i] *= damp;

        px[i] += vx[i];
        py[i] += vy[i];

        if (px[i] < 0) px[i] += W;
        if (px[i] > W) px[i] -= W;
        if (py[i] < 0) py[i] += H;
        if (py[i] > H) py[i] -= H;
      }

      // ── Color ──────────────────────────────────────────────────────────────
      // chaos = deep purple, organizing = teal-blue, panic = random red/orange
      const rC = Math.round(139 * (1 - orgProgress) + 16 * orgProgress);
      const gC = Math.round(92 * (1 - orgProgress) + 185 * orgProgress);
      const bC = Math.round(246 * (1 - orgProgress) + 129 * orgProgress);

      const cr = isPanic ? Math.floor(Math.random() * 80 + 180) : rC;
      const cg = isPanic ? Math.floor(Math.random() * 30) : gC;
      const cb = isPanic ? Math.floor(Math.random() * 20) : bC;

      // ── Adjacency matrix ───────────────────────────────────────────────────
      const maxDist = MAX_DIST + orgProgress * 50;
      const maxDist2 = maxDist * maxDist;
      connected.fill(0);
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = px[i] - px[j];
          const dy = py[i] - py[j];
          if (dx * dx + dy * dy < maxDist2) {
            connected[i * N + j] = 1;
            connected[j * N + i] = 1;
          }
        }
      }

      // ── Glow setup ────────────────────────────────────────────────────────
      const glowColor = `rgba(${cr},${cg},${cb},0.6)`;
      ctx.shadowColor = glowColor;

      // ── Filled triangles (per-triangle alpha based on area) ──────────────
      // Smaller triangles get brighter alpha; larger ones keep the base alpha.
      // Area via cross-product: A = 0.5 * |AB × AC|
      // We normalize against a reference area (~half of maxDist^2) so that
      // triangles with side ≈ maxDist get base alpha, and tiny ones get boosted.
      const triAlphaBase = isPanic ? 0.13 : 0.03 + orgProgress * 0.09;
      const refArea = maxDist2 * 0.25; // reference: equilateral-ish at ~maxDist
      ctx.shadowBlur = 4;
      let triCount = 0;
      outer: for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          if (!connected[i * N + j]) continue;
          for (let k = j + 1; k < N; k++) {
            if (connected[i * N + k] && connected[j * N + k]) {
              // Half cross-product = triangle area
              const area =
                0.5 *
                Math.abs(
                  (px[j] - px[i]) * (py[k] - py[i]) -
                    (px[k] - px[i]) * (py[j] - py[i]),
                );
              // t=0 (tiny) → alpha boosted; t=1 (large) → base alpha
              const t = Math.min(area / refArea, 1);
              const alpha = triAlphaBase * (1 + (1 - t) * 2.5);
              ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha})`;
              ctx.beginPath();
              ctx.moveTo(px[i], py[i]);
              ctx.lineTo(px[j], py[j]);
              ctx.lineTo(px[k], py[k]);
              ctx.closePath();
              ctx.fill();
              if (++triCount >= MAX_TRIS) break outer;
            }
          }
        }
      }

      // ── Edges ─────────────────────────────────────────────────────────────
      ctx.shadowBlur = 6;
      ctx.lineWidth = 0.6 + orgProgress * 0.5;
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          if (!connected[i * N + j]) continue;
          const dx = px[i] - px[j];
          const dy = py[i] - py[j];
          const dist = Math.sqrt(dx * dx + dy * dy);
          const alpha = (1 - dist / maxDist) * 0.55;
          ctx.strokeStyle = `rgba(${cr},${cg},${cb},${alpha})`;
          ctx.beginPath();
          ctx.moveTo(px[i], py[i]);
          ctx.lineTo(px[j], py[j]);
          ctx.stroke();
        }
      }

      // Reset shadow so it doesn't bleed into the trail rect next frame
      ctx.shadowBlur = 0;
    }

    draw(0);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", init);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        background: "#0a0a14",
        display: "block",
        opacity: 0.35,
      }}
    />
  );
}
