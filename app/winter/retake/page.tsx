import type { Metadata } from "next";
import RetakeLanding from "@/components/winter/RetakeLanding";
import RetakeMotion from "@/components/winter/RetakeMotion";
import "./retake.css";

const title = "다시 선택한 1년, 이번에는 후회 없이 | 모두다른고양이";
const description = "지난 준비의 아쉬움을 짚고 달라지는 2028 수능에 맞춰 다시 준비합니다. 모다고의 겨울 8주에서 수능까지 이어갈 공부와 습관을 시작합니다.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/winter/retake" },
  robots: { index: process.env.VERCEL_ENV !== "preview", follow: true },
  openGraph: {
    type: "website",
    url: "https://www.modago.me/winter/retake",
    siteName: "모두다른고양이 미술학원",
    locale: "ko_KR",
    title,
    description,
    images: [{
      url: "/images/retake/hero-new-start-glasses.webp",
      width: 1254,
      height: 1254,
      alt: "얇은 안경과 오렌지 니트를 착용한 N수생이 스케치북을 살펴보는 일러스트",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/retake/hero-new-start-glasses.webp"],
  },
};
export default function RetakePage() { return <><RetakeLanding /><RetakeMotion /></>; }
