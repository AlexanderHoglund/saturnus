import type { Metadata } from "next";
import Image from "next/image";
import StarSky from "../components/StarSky";

export const metadata: Metadata = {
  title: "Byggnaden",
  description:
    "Saturnushuset i hörnet Lantmannagatan–Ystadsgatan i Malmö — det gamla funkishuset som PLX Kulturförening väcker till liv som en plats för kultur.",
  alternates: { canonical: "/thebuilding" },
};

export default function TheBuilding() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <StarSky />
      <Image
        src="/saturnushuset_white.png"
        alt="Saturnushuset"
        width={9646}
        height={2806}
        priority
        className="relative z-10 h-auto w-[90vw] max-w-[1600px] drop-shadow-[0_0_30px_rgba(180,200,255,0.15)]"
      />
    </main>
  );
}
