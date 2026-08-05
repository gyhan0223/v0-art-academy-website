import type { Metadata } from "next";
import WinterResultsPage from "@/components/winter/WinterResultsPage";
import { IS_PLACEHOLDER } from "@/lib/winter-results";

const PAGE_TITLE = "윈터스쿨 성적 향상 사례 | 2027 모다고 윈터스쿨";
const PAGE_DESCRIPTION =
  "1주차 진단고사와 8주차 재측정을 같은 기준으로 비교합니다. 오른 학생만 고르지 않고 8주를 마친 전원을 분모로 공개하며, 국어·영어·탐구 3과목만 다룹니다.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/winter/results" },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [{ url: "/images/og-winter.jpg", width: 1200, height: 630 }],
  },
  // 자리표시자 상태에서는 색인하지 않는다 — lib/winter-results.ts의
  // IS_PLACEHOLDER를 false로 바꾸면 색인과 사이트맵 등록이 자동으로 켜진다.
  ...(IS_PLACEHOLDER ? { robots: { index: false, follow: true } } : {}),
};

export default function Page() {
  return <WinterResultsPage />;
}
