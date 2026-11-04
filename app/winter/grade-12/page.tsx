import type { Metadata } from "next";
import Grade12Landing from "@/components/winter/Grade12Landing";
import RetakeMotion from "@/components/winter/RetakeMotion";
import "../retake/retake.css";
import "./grade12.css";

export const metadata: Metadata = {
  title: "고3이 되기 전, 목표 미대에 맞춘 겨울 준비 | 모두다른고양이",
  description: "2028학년도 미대입시를 준비하는 예비 고3의 겨울. 목표 대학의 반영 기준과 현재 성적·실기를 함께 보고, 이번 겨울에 집중할 공부와 실기를 정합니다.",
  alternates: { canonical: "/winter/grade-12" },
  robots: { index: false, follow: true },
};

export default function Grade12Page(){return <><Grade12Landing/><RetakeMotion/></>;}
