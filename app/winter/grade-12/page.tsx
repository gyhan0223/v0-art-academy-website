import type { Metadata } from "next";
import Grade12Landing from "@/components/winter/Grade12Landing";
import RetakeMotion from "@/components/winter/RetakeMotion";
import "../retake/retake.css";
import "./grade12.css";

export const metadata: Metadata = {
  title: "2028 개편 수능, 목표 미대에 맞춘 고3 준비 | 모두다른고양이",
  description: "2028학년도 수능 개편에 맞춘 예비 고3 겨울 준비. 공통 출제 범위·통합탐구·모의평가 일정을 확인하고, 목표 미대에 맞춰 학과·실기·학습 점검을 연결합니다.",
  alternates: { canonical: "/winter/grade-12" },
  robots: { index: false, follow: true },
};

export default function Grade12Page(){return <><Grade12Landing/><RetakeMotion/></>;}
