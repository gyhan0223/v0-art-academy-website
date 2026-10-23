import type { Metadata } from "next";
import RetakeLanding from "@/components/winter/RetakeLanding";
import RetakeMotion from "@/components/winter/RetakeMotion";
import "./retake.css";

export const metadata: Metadata = {
  title: "부족했던 이유를 찾고, 달라질 준비를 시작합니다 | 모두다른고양이",
  description: "N수생과 학부모를 위한 겨울 준비 안내. 심층 상담으로 부족했던 원인을 짚고, 수강을 시작하면 실제 학과 수업과 실기 훈련에 반영합니다.",
  alternates: { canonical: "/winter/retake" },
  robots: { index: false, follow: true },
};
export default function RetakePage() { return <><RetakeLanding /><RetakeMotion /></>; }
