import type { Metadata } from "next";
import Grade12Landing from "@/components/winter/Grade12Landing";
import RetakeMotion from "@/components/winter/RetakeMotion";
import "../retake/retake.css";
import "./grade12.css";

export const metadata: Metadata = {
  title: "고3이 되기 전 준비의 순서를 정합니다 | 모두다른고양이",
  description: "2028학년도 미대입시를 준비하는 예비 고3과 학부모를 위한 겨울 준비 안내. 원장 심층 상담으로 학과·실기 우선순위를 짚고 실제 수업으로 연결합니다.",
  alternates: { canonical: "/winter/grade-12" },
  robots: { index: false, follow: true },
};

export default function Grade12Page(){return <><Grade12Landing/><RetakeMotion/></>;}
