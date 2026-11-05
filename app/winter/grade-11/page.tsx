import type { Metadata } from "next";
import Grade11Landing from "@/components/winter/Grade11Landing";
import RetakeMotion from "@/components/winter/RetakeMotion";
import "../retake/retake.css";
import "../grade-12/grade12.css";
import "./grade11.css";

const title = "고2의 첫 단추, 희망 대학을 향한 방향부터 | 모두다른고양이";
const description = "2029학년도 미대입시를 준비하는 예비 고2의 겨울. 내신·모의고사 성적과 희망 대학·학과를 바탕으로 수시·정시의 가능성을 살피며 지금부터의 준비 방향을 잡고, 겨울 일과에서 실행합니다. 윈터스쿨 상담 예약.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/winter/grade-11" },
  robots: { index: process.env.VERCEL_ENV !== "preview", follow: true },
  openGraph: {
    type: "website",
    url: "https://www.modago.me/winter/grade-11",
    siteName: "모두다른고양이 미술학원",
    locale: "ko_KR",
    title,
    description,
    images: [{
      url: "/images/grade11/grade11-hero.webp",
      width: 1254,
      height: 1254,
      alt: "기초 소묘를 연습하는 예비 고2 학생의 일러스트",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/grade11/grade11-hero.webp"],
  },
};

export default function Grade11Page() { return <><Grade11Landing/><RetakeMotion/></>; }
