import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FinalLanding from "@/components/final/FinalLanding";
import { CAMPUSES } from "@/lib/contact";
import PostExamLinks from "@/components/final/PostExamLinks";
import { FINAL_IS_PUBLISHED, FINAL_IS_RECRUITING, FINAL_PROGRAM } from "@/lib/final-program";

/**
 * /final — 2027 미대입시 수능 파이널 집중반 랜딩.
 * 9월 모의평가 이후부터 수능(2026-11-19) 전까지 미대 정시 준비 고3·N수생을
 * 위한 학과 집중 과정. 본문은 components/final/FinalLanding.tsx,
 * 계절성 설정은 lib/final-program.ts에 있다.
 *
 * 비공개(FINAL_IS_PUBLISHED=false) 동안에는 404를 돌려주고 색인도 막는다 —
 * 코드는 그대로 두고 스위치만 되돌리면 다시 열린다.
 */

const PAGE_TITLE = `${FINAL_PROGRAM.name}${FINAL_IS_RECRUITING ? "" : " 모집 종료"} | 모두다른고양이 미술학원`;
const PAGE_DESCRIPTION = FINAL_IS_RECRUITING
  ? "수능까지 남은 시간은 같아도 필요한 공부는 다릅니다. 미대 정시를 준비하는 고3·N수생이 지금까지 해온 공부와 희망 대학을 함께 살펴보고, 남은 기간에 유지할 공부와 먼저 보완할 부분을 정하는 국어·영어·사회탐구 집중 과정. 홍대 본원."
  : "2027 수능 파이널 집중반 모집이 종료되었습니다. 올해 미대 정시 지원을 준비한다면 가·나·다군별 대학과 실기 유형을 확인해 보세요.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    "미대입시 수능 파이널",
    "미대 정시 수능 준비",
    "미대 수능 파이널",
    "미대입시 학과",
    "미대 정시 고3",
    "미대 정시 N수생",
    "9월 모의평가 이후",
    "홍대 미술학원 수능",
    "모두다른고양이",
    "모다고",
  ],
  alternates: { canonical: FINAL_PROGRAM.href },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: `https://www.modago.me${FINAL_PROGRAM.href}`,
    // 전용 OG 이미지는 만들지 않고 홈 이미지를 재사용한다.
    images: [{ url: "/images/og-home.jpg", width: 1200, height: 630 }],
  },
  // 비공개 상태에서는 어떤 경로로도 색인되지 않게 막는다 (404와 이중 안전장치)
  ...(FINAL_IS_PUBLISHED ? {} : { robots: { index: false, follow: false } }),
};

// 전화번호는 lib/contact.ts의 홍대 본원 값을 국제 형식으로 바꿔 쓴다 (02-338-3302 → +82-2-338-3302).
const [CAMPUS_HONGDAE] = CAMPUSES;
const HONGDAE_TELEPHONE = `+82-${CAMPUS_HONGDAE.phone.replace(/^0/, "")}`;

/*
 * Course 구조화 데이터.
 * 확인되지 않은 가격·정원·개강일은 넣지 않는다 — offers·startDate·maximumAttendeeCapacity 없음.
 */
const courseJsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: FINAL_PROGRAM.name,
  description: PAGE_DESCRIPTION,
  url: `https://www.modago.me${FINAL_PROGRAM.href}`,
  inLanguage: "ko",
  teaches: [...FINAL_PROGRAM.subjects],
  audience: {
    "@type": "EducationalAudience",
    educationalRole: "student",
    audienceType: FINAL_PROGRAM.target,
  },
  provider: {
    "@type": "Organization",
    name: "모두다른고양이 미술학원",
    telephone: HONGDAE_TELEPHONE,
    url: "https://www.modago.me",
  },
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "Onsite",
    // 확정된 개강일이 없어 startDate는 두지 않는다. 수능일만 종료 시점으로 밝힌다.
    endDate: FINAL_PROGRAM.examDateISO,
    location: {
      "@type": "Place",
      name: FINAL_PROGRAM.venueName,
      address: {
        "@type": "PostalAddress",
        streetAddress: "와우산로23길 9 칼리오페 5층",
        addressLocality: "마포구",
        addressRegion: "서울",
        addressCountry: "KR",
      },
    },
  },
};

export default function Page() {
  if (!FINAL_IS_PUBLISHED) notFound();
  if (!FINAL_IS_RECRUITING) {
    return (
      <main className="mx-auto max-w-xl px-5 py-20 text-white">
        <h1 className="break-keep text-3xl font-bold">{FINAL_PROGRAM.shortName} 모집이 종료되었습니다</h1>
        <p className="mt-4 break-keep leading-relaxed text-white/75">
          올해 미대 정시를 준비한다면 지원하려는 학과의 모집군과 실기 유형을 확인해 보세요.
        </p>
        <PostExamLinks />
      </main>
    );
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
      <FinalLanding />
    </>
  );
}
