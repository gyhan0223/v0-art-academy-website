import type { Metadata } from "next";
import Grade11Landing from "@/components/winter/Grade11Landing";
import RetakeMotion from "@/components/winter/RetakeMotion";
import Grade11TimeControls from "@/components/winter/Grade11TimeControls";
import "../retake/retake.css";
import "../grade-12/grade12.css";
import "./grade11.css";

export const metadata: Metadata = {
  title: "고2의 첫 단추, 스스로 준비할 이유를 아는 것부터 | 모두다른고양이",
  description: "2029학년도 미대입시를 준비하는 예비 고2의 겨울. 방학 준비 시간을 계산하고, 현재 성적·실기·일과를 살펴보며 준비의 이유와 방향을 이해하도록 돕습니다. 무료 원장 심층 상담 예약.",
  alternates: { canonical: "/winter/grade-11" },
  robots: { index: false, follow: true },
};

export default function Grade11Page() { return <><Grade11Landing/><Grade11TimeControls/><RetakeMotion/></>; }
