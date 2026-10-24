"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const HELVETICA = '"Helvetica Neue", Helvetica, Arial, sans-serif';
const RED = "#ff5252";

type Line = { x1: number; y1: number; x2: number; y2: number };
type Geo = { origin: string; lines: Line[] };

export default function Info() {
  const [open, setOpen] = useState(false);
  const [geo, setGeo] = useState<Geo>({ origin: "50% 50%", lines: [] });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const boxRef = useRef<HTMLElement>(null);
  const rafRef = useRef(0);
  const runningRef = useRef(false);

  // Read the button centre and the box's *live* on-screen corners. Because
  // getBoundingClientRect reflects both the CSS scale transform and the scroll
  // position, the connector lines follow the box while it unfolds, folds, and
  // scrolls — always attached to the visible corners.
  const measure = useCallback(() => {
    const btn = buttonRef.current;
    const box = boxRef.current;
    if (!btn || !box) return;
    const b = btn.getBoundingClientRect();
    const bx = b.left + b.width / 2;
    const by = b.top + b.height / 2;
    const r = box.getBoundingClientRect();
    // scale origin = the button point expressed relative to the box's own box
    const originX = bx - box.offsetLeft;
    const originY = by - box.offsetTop;
    const line = (x2: number, y2: number): Line => ({ x1: bx, y1: by, x2, y2 });
    setGeo({
      origin: `${originX}px ${originY}px`,
      lines: [
        line(r.left, r.top),
        line(r.right, r.top),
        line(r.left, r.bottom),
        line(r.right, r.bottom),
      ],
    });
  }, []);

  // Track continuously while open; keep tracking briefly after close so the
  // fold-back stays glued too, then idle.
  useEffect(() => {
    const loop = () => {
      measure();
      if (runningRef.current) rafRef.current = requestAnimationFrame(loop);
    };
    runningRef.current = true;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(loop);

    if (!open) {
      const t = setTimeout(() => {
        runningRef.current = false;
      }, 400);
      return () => clearTimeout(t);
    }
    return () => {
      runningRef.current = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [open, measure]);

  return (
    <>
      {/* connector lines + corner nodes, tethering the box to the (i) */}
      <svg
        aria-hidden
        className="pointer-events-none fixed inset-0 z-20 h-full w-full"
      >
        {geo.lines.map((l, i) => (
          <g key={i} opacity={open ? 1 : 0} style={{ transition: "opacity 200ms" }}>
            <line
              x1={l.x1}
              y1={l.y1}
              x2={l.x2}
              y2={l.y2}
              stroke={RED}
              strokeWidth={1}
              strokeOpacity={0.55}
            />
            <circle cx={l.x2} cy={l.y2} r={2.5} fill={RED} fillOpacity={0.9} />
          </g>
        ))}
      </svg>

      {/* (i) button */}
      <button
        ref={buttonRef}
        type="button"
        aria-label="Information"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        style={{ fontFamily: HELVETICA, ...(open ? { color: RED, borderColor: RED } : {}) }}
        className={`fixed left-6 top-6 z-30 flex h-9 w-9 items-center justify-center rounded-full border text-base italic transition-colors ${
          open
            ? ""
            : "border-white/50 text-white/70 hover:border-white hover:text-white"
        }`}
      >
        i
      </button>

      {/* text overlay — centred, grows out of the (i) button */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-20 flex items-start justify-center overflow-y-auto p-6 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <article
          ref={boxRef}
          onClick={(e) => e.stopPropagation()}
          style={{ fontFamily: HELVETICA, color: RED, transformOrigin: geo.origin }}
          className={`my-16 max-w-2xl rounded-2xl border border-white/15 bg-black/30 px-8 py-10 text-base font-normal leading-relaxed shadow-2xl backdrop-blur-[2px] transition-[transform,opacity] duration-300 ease-out ${
            open ? "scale-100 opacity-100" : "scale-0 opacity-0"
          }`}
        >
          <h1 className="mb-6 text-xl font-normal">
            Saturnushuset i Malmö får nytt liv som en plats för kultur
          </h1>
          <p className="mb-4">
            I hörnet Lantmannagatan–Ystadsgatan ligger Saturnushuset, ett hus som
            nu stått tomt i 26 år. Här tillverkades en gång essenser, och många
            malmöbor minns fortfarande platsen med värme, som en levande del av
            staden.
          </p>
          <p className="mb-4">Nu väcker vi huset till liv igen.</p>
          <p className="mb-4">
            Den 2 juli 2026 tecknade MKB Fastighets AB avtal om att överlåta
            fastigheten. Huset ska nu förvaltas för att ge Malmö en ny plats
            för kultur, som rymmer ett kalejdoskop av uttryck och upplevelser,
            öppen för alla.
          </p>
          <p className="mb-4">
            Vi som kommer att förvalta Saturnushuset, tillsammans med Malmös
            invånare, gör det med kärlek till konst, musik, mat, design,
            scenkonst, dans och kultur i alla former. Bakom oss har vi bland annat
            tjugo år i Kulturföreningen PLX, verksam i Malmö, Stockholm och
            Blekinge.
          </p>
          <p className="mb-4">
            Just nu färdigställs överlåtelsen. Arbetet beräknas pågå till våren
            2027, och först därefter ges tillträde. Huset behöver renoveras
            varsamt, ett arbete som kommer att pågå under lång tid och fortsätter
            även efter att dörrarna öppnat.
          </p>
          <p className="mb-6">Hör av er. Vi svarar så gott vi kan.</p>
          <p>info@saturnuskultur.se</p>
        </article>
      </div>
    </>
  );
}
