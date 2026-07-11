import Image from "next/image";
import StarSky from "./components/StarSky";
import Info from "./components/Info";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <StarSky />
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
