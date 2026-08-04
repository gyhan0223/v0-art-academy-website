import type { Metadata } from "next";
import WinterSchedulePage from "@/components/winter/WinterSchedulePage";

const PAGE_TITLE = "윈터캠프 하루 일과표 | 2027 모다고 윈터캠프";
const PAGE_DESCRIPTION =
  "평일은 국어·영어·탐구 학과에, 주말은 대학교 유형 미술실기에. 기상부터 취침까지 윈터캠프의 하루와 8주간 반복되는 한 주의 구조를 공개합니다.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/winter/schedule" },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [{ url: "/images/og-winter.jpg", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return <WinterSchedulePage />;
}
