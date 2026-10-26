import type { Metadata } from "next";
import RetakeLanding from "@/components/winter/RetakeLanding";
import RetakeMotion from "@/components/winter/RetakeMotion";
import "./retake.css";

export const metadata: Metadata = {
  title: "2028학년도, 수능이 바뀌는 재도전 | 모두다른고양이",
  description: "2028학년도 수능을 준비하는 N수생과 학부모를 위한 안내. 선택과목 폐지·통합탐구·모의평가 일정 변화를 확인하고 현재 상태와 목표 미대에 맞는 준비 방향을 상담합니다.",
  alternates: { canonical: "/winter/retake" },
  robots: { index: false, follow: true },
};
export default function RetakePage() { return <><RetakeLanding /><RetakeMotion /></>; }
