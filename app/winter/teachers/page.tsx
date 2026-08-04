import type { Metadata } from "next";
import WinterTeachersPage from "@/components/winter/WinterTeachersPage";
import { IS_PLACEHOLDER } from "@/lib/winter-teachers";

const PAGE_TITLE = "윈터캠프 강사진 | 2027 모다고 윈터캠프";
const PAGE_DESCRIPTION =
  "학과(국어·영어·탐구)는 강사 직강, 주말 실기는 유형별 담당 강사가 맡습니다. 담당 과목·경력·캠프 상주 여부를 공개합니다.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/winter/teachers" },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [{ url: "/images/og-winter.jpg", width: 1200, height: 630 }],
  },
  // 자리표시자 상태에서는 색인하지 않는다 — lib/winter-teachers.ts의
  // IS_PLACEHOLDER를 false로 바꾸면 색인과 사이트맵 등록이 자동으로 켜진다.
  ...(IS_PLACEHOLDER ? { robots: { index: false, follow: true } } : {}),
};

export default function Page() {
  return <WinterTeachersPage />;
}
