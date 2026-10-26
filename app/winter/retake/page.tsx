import type { Metadata } from "next";
import RetakeLanding from "@/components/winter/RetakeLanding";
import RetakeMotion from "@/components/winter/RetakeMotion";
import "./retake.css";

export const metadata: Metadata = {
  title: "2028 수능 재도전, 공부·실기·생활을 겨울 8주부터 | 모두다른고양이",
  description: "2028학년도 수능을 준비하는 N수생의 겨울 8주. 바뀐 출제 범위와 목표 미대의 실기를 함께 살펴보고, 수능까지 이어갈 학습·생활 습관을 연습합니다.",
  alternates: { canonical: "/winter/retake" },
  robots: { index: false, follow: true },
};
export default function RetakePage() { return <><RetakeLanding /><RetakeMotion /></>; }
