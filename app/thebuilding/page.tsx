import StarSky from "../components/StarSky";
import Building from "../components/Building";

export default function TheBuilding() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <StarSky />
      <Building className="relative z-10 w-[min(38vw,420px)] max-w-[85vw] text-[#e7ecff] drop-shadow-[0_0_24px_rgba(180,200,255,0.25)]" />
    </main>
  );
}
