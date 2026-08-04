import type { Metadata } from "next";
import WinterTeachersPage from "@/components/winter/WinterTeachersPage";

const PAGE_TITLE = "윈터캠프 강사진 | 2027 모다고 윈터캠프";
const PAGE_DESCRIPTION =
  "윈터캠프 학과(국어·영어·사회탐구)는 강사 직강, 주말 실기는 지원 대학 유형별. 강사마다 한 줄 소개와 경력, 본원 상주 여부까지 공개합니다.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  // 같은 강사진을 /teachers와 나눠 쓰는 페이지라 원본을 canonical로 지정한다.
  // (중복 문서로 잡히지 않게 하려는 것 — 링크는 그대로 따라간다)
  alternates: { canonical: "/teachers" },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [{ url: "/images/og-winter.jpg", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return <WinterTeachersPage />;
}
