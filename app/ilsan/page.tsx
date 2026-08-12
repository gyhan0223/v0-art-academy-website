import type { Metadata } from "next";
import IlsanLanding from "@/components/ilsan/IlsanLanding";
import { ILSAN_INFO } from "@/lib/ilsan";

/**
 * 일산캠퍼스 랜딩.
 * "일산 입시미술학원" 등 검색 유입의 도착 페이지 — 2027학년도 예비 고3(현 고2)
 * 중심의 상담 전환용. 본문·데이터는 components/ilsan/IlsanLanding.tsx와
 * lib/ilsan.ts에 있다.
 */

const PAGE_TITLE = "일산 입시미술학원 | 모두다른고양이 일산 캠퍼스";
const PAGE_DESCRIPTION =
  "예비 고2·고3을 위한 일산 입시미술 실기 수업. 평일 저녁 6시부터 10시까지 목표 대학과 현재 실력에 맞춰 실기 준비 방향을 함께 설계합니다.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    "일산 입시미술학원",
    "일산 미대입시",
    "일산 입시미술",
    "고양시 입시미술",
    "예비 고3 입시미술",
    "예비 고2 입시미술",
    "모두다른고양이",
    "모다고",
  ],
  alternates: { canonical: "/ilsan" },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: "https://www.modago.me/ilsan",
    // TODO: 일산 전용 OG 이미지가 준비되면 /images/og-ilsan.jpg로 교체
    images: [{ url: "/images/og-home.jpg", width: 1200, height: 630 }],
  },
};

/* 지역 검색(일산·고양시 입시미술학원) 노출을 위한 구조화 데이터 */
const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: ILSAN_INFO.name,
  description:
    "미대입시 실기 전문 미술학원. 평일 18:00–22:00 저녁 실기 수업 운영.",
  url: "https://www.modago.me/ilsan",
  telephone: "+82-31-916-8885",
  address: {
    "@type": "PostalAddress",
    streetAddress: "원중1길 56 8층",
    addressLocality: "고양시 일산동구",
    addressRegion: "경기도",
    addressCountry: "KR",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "18:00",
    closes: "22:00",
  },
  parentOrganization: {
    "@type": "Organization",
    name: "모두다른고양이 미술학원",
  },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessJsonLd),
        }}
      />
      <IlsanLanding />
    </>
  );
}
