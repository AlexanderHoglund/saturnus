"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const HELVETICA = '"Helvetica Neue", Helvetica, Arial, sans-serif';
const SIGNUP_URL = "https://forms.gle/2fLgVY5FcULgxzrN9";
const INTERVAL_MS = 5000;

type Slot = { time: string; title: string; kind?: string; who?: string; note?: string };

const PROGRAM: Slot[] = [
  { time: "17.30", title: "Dörrarna öppnar", kind: "DJ", who: "DJ Pinot Noir och DJ Kuttersmycket" },
  { time: "18.30", title: "Välkomna", kind: "Inledning", who: "Kvällens konferencier och Edward Liepe" },
  {
    time: "18.40",
    title: "Saturnushusets historia och plats i “det goda Malmö”",
    kind: "Föredrag",
    who: "Martin Andersson, författare och journalist",
  },
  { time: "19.10", title: "Saturnushuset inifrån", kind: "Bildvisning", who: "Foton av David Neman" },
  { time: "19.20", title: "Paus" },
  {
    time: "19.40",
    title: "Saturnushuset: en arkitektonisk översikt",
    kind: "Introduktion",
    who: "Filip Mayer, arkitekt",
  },
  {
    time: "19.50",
    title: "Learning from Saturnus: att utgå från platsen som pedagogisk metod",
    kind: "Föredrag",
    who: "Elise Aldén och Petter Wallin, arkitekter",
  },
  { time: "20.20", title: "Paus" },
  {
    time: "20.40",
    title: "Saturnus sprit",
    kind: "Provning",
    who: "Edward Liepe och Tim Mellgård, Saturnus 1893",
    note: "Om dryckerna och historien bakom Saturnus.",
  },
  { time: "21.00", title: "Spekulationer om Saturnus", kind: "Panel och frågestund" },
  { time: "21.20", title: "Paus" },
  { time: "21.45", title: "Konsert", who: "Pharaoh Overlord" },
];

export default function Event({ posters }: { posters: string[] }) {
  const [index, setIndex] = useState(0);

  // Step to the next poster every few seconds; the stacked images crossfade.
  useEffect(() => {
    if (posters.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % posters.length), INTERVAL_MS);
    return () => clearInterval(id);
  }, [posters.length]);

  return (
    <section
      style={{ fontFamily: HELVETICA }}
      className="relative z-10 mx-auto w-full max-w-lg px-6 pb-24 pt-20 text-white"
    >
      {/* poster — height-capped so it sits centred in the first screen */}
      <div
        style={{ maxWidth: "calc((100svh - 10rem) * 0.8)" }}
        className="relative mx-auto aspect-4/5 w-full shadow-2xl"
      >
        {posters.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt="Saturnus: Preludium I, 21 november 2026, Brogatan 12, Malmö"
            fill
            priority={i === 0}
            sizes="(max-width: 512px) 100vw, 464px"
            aria-hidden={i !== index}
            className={`object-cover transition-opacity duration-1000 motion-reduce:transition-none ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      <div className="mt-12 text-base leading-relaxed">
        <h2 className="text-2xl font-semibold tracking-wide">SATURNUS: PRELUDIUM I</h2>
        <p className="mt-2 text-white/70">
          Lördag 21 november kl. 17.30 · Brogatan 12, Malmö · Fri entré
        </p>

        <p className="mt-6">
          Vänner, välkomna till Preludium I, en kväll om Saturnushuset och dess
          framtid. Det blir samtal om husets historia och arkitektur, bilder
          inifrån och provning av Saturnus sprit. Kvällen avslutas med en konsert.
        </p>

        <p className="mt-4">Antalet platser är begränsat.</p>
        <a
          href={SIGNUP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block rounded-full border border-white/50 px-5 py-2 text-white/80 transition-colors hover:border-white hover:text-white"
        >
          Anmäl dig här
        </a>

        <h3 className="mb-4 mt-12 text-lg">Program</h3>
        <ol className="space-y-4">
          {PROGRAM.map((slot) => {
            const pause = slot.title === "Paus";
            const meta = [slot.kind, slot.who].filter(Boolean).join(" · ");
            return (
              <li
                key={slot.time}
                className={`grid grid-cols-[3.25rem_1fr] gap-x-4 ${pause ? "text-white/40" : ""}`}
              >
                <span className={`tabular-nums ${pause ? "" : "text-white/60"}`}>{slot.time}</span>
                <div>
                  <p>{slot.title}</p>
                  {meta && <p className="text-sm text-white/60">{meta}</p>}
                  {slot.note && <p className="text-sm text-white/60">{slot.note}</p>}
                </div>
              </li>
            );
          })}
        </ol>

        <p className="mt-10 text-sm text-white/50">
          Vi förbehåller oss rätten att göra ändringar i programmet.
        </p>
      </div>
    </section>
  );
}
