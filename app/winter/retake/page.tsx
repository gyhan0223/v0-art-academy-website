import type { Metadata } from "next";
import RetakeLanding from "@/components/winter/RetakeLanding";
import RetakeMotion from "@/components/winter/RetakeMotion";
import "./retake.css";

export const metadata: Metadata = {
  title: "다시 선택한 1년, 이번에는 후회 없이 | 모두다른고양이",
  description: "지난 준비의 아쉬움을 짚고 달라지는 2028 수능에 맞춰 다시 준비합니다. 모다고의 겨울 8주에서 수능까지 이어갈 공부와 습관을 시작합니다.",
  alternates: { canonical: "/winter/retake" },
  robots: { index: false, follow: true },
};
export default function RetakePage() { return <><RetakeLanding /><RetakeMotion /></>; }
