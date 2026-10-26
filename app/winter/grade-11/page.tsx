import type { Metadata } from "next";
import Grade11Landing from "@/components/winter/Grade11Landing";
import RetakeMotion from "@/components/winter/RetakeMotion";
import "../retake/retake.css";
import "../grade-12/grade12.css";
import "./grade11.css";

export const metadata: Metadata = {
  title: "고2의 첫 단추, 희망 대학을 향한 방향부터 | 모두다른고양이",
  description: "2029학년도 미대입시를 준비하는 예비 고2의 겨울. 내신·모의고사 성적과 희망 대학·학과를 바탕으로 수시·정시의 가능성을 살피며 지금부터의 준비 방향을 잡고, 겨울 일과에서 실행합니다. 원장 심층 상담 예약.",
  alternates: { canonical: "/winter/grade-11" },
  robots: { index: false, follow: true },
};

export default function Grade11Page() { return <><Grade11Landing/><RetakeMotion/></>; }
