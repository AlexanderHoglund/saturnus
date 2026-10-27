import { readdirSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import StarSky from "./components/StarSky";
import Info from "./components/Info";
import Event from "./components/Event";

export default function Home() {
  // Every image in public/event becomes a poster, in filename order.
  const posters = readdirSync(path.join(process.cwd(), "public", "event"))
    .filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f))
    .sort()
    .map((f) => `/event/${encodeURIComponent(f)}`);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <StarSky />
      <Event posters={posters} />
      <Info />
      <Image
        src="/logo_saturnus_small_white.png"
        alt="Saturnushuset"
        width={422}
        height={255}
        priority
        className="fixed right-6 top-6 z-10 h-auto w-10 opacity-80"
      />
    </main>
  );
}
