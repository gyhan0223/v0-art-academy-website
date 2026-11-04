import type { Metadata } from "next";
import Grade12Landing from "@/components/winter/Grade12Landing";
import RetakeMotion from "@/components/winter/RetakeMotion";
import "../retake/retake.css";
import "./grade12.css";

const title = "고3이 되기 전, 목표 미대에 맞춘 겨울 준비 | 모두다른고양이";
const description = "2028학년도 미대입시를 준비하는 예비 고3의 겨울. 목표 대학의 반영 기준과 현재 성적·실기를 함께 보고, 이번 겨울에 집중할 공부와 실기를 정합니다.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/winter/grade-12" },
  robots: { index: process.env.VERCEL_ENV !== "preview", follow: true },
  openGraph: {
    type: "website",
    url: "https://www.modago.me/winter/grade-12",
    siteName: "모두다른고양이 미술학원",
    locale: "ko_KR",
    title,
    description,
    images: [{
      url: "/images/grade12/grade12-hero.webp",
      width: 1254,
      height: 1254,
      alt: "워크북과 실기 스케치북을 함께 살펴보는 예비 고3 학생의 일러스트",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/grade12/grade12-hero.webp"],
  },
};

export default function Grade12Page(){return <><Grade12Landing/><RetakeMotion/></>;}
