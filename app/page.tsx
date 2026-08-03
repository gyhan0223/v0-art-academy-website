import type { Metadata } from "next";
import Scene1 from "@/components/cinematic/Scene1";
import Scene2 from "@/components/cinematic/Scene2";
import Scene3 from "@/components/cinematic/Scene3";
import Scene4 from "@/components/cinematic/Scene4";
import WinterBanner from "@/components/winter/WinterBanner";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Page() {
  return (
    <main className="bg-background text-foreground">
      <Scene1 />
      <WinterBanner />
      <Scene2 />
      <Scene3 />
      <Scene4 />
    </main>
  );
}
