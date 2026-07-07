import StarSky from "./components/StarSky";
import Info from "./components/Info";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <StarSky />
      <Info />
    </main>
  );
}
