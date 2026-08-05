import type { Metadata } from "next";
import WinterTeachersPage from "@/components/winter/WinterTeachersPage";

const PAGE_TITLE = "윈터스쿨 강사진 | 2027 모다고 윈터스쿨";
const PAGE_DESCRIPTION =
  "예비 고2·예비 고3·재수생 선행반을 가르치는 강사진. 학과(국어·영어·사회탐구)는 강사 직강, 주말 실기는 지원 대학 유형별. 강사마다 한 줄 소개와 경력, 본원 상주 여부까지 공개합니다.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  // 강사 카드는 /teachers와 같은 데이터를 쓰지만, 이 페이지에만 있는 내용이
  // 따로 있다 — 과목별 8주 목표·진행 방식과 윈터스쿨 수업 FAQ. 검색에서 찾는
  // 질문("윈터스쿨 강사")도 다르다. 그래서 자기 자신을 canonical로 둔다.
  // 예전에는 /teachers를 canonical로 걸어 이 페이지가 검색에서 통째로 빠졌다.
  alternates: { canonical: "/winter/teachers" },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [{ url: "/images/og-winter.jpg", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return <WinterTeachersPage />;
}
