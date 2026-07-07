import StarSky from "./components/StarSky";
import Info from "./components/Info";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <StarSky />
      <Info />
      <p
        style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
        className="fixed inset-x-0 bottom-6 z-10 text-center text-xs font-light tracking-[0.2em] text-white/60"
      >
        info@saturnushuset.se
      </p>
    </main>
  );
}
