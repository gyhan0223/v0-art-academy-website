import type { Metadata } from "next";
import WinterLanding from "@/components/winter/WinterLanding";
import { CAMP_INFO } from "@/lib/winter-camp";

const PAGE_TITLE =
  "2027 모다고 윈터캠프 | 최상위권 미대 전문 홍대 본원 기숙 윈터스쿨";
const PAGE_DESCRIPTION =
  "최상위권 미대 전문. 예비 고3 대상 8주 기숙 직강 과정. 학과(국어·영어·탐구)는 강사 직강, 실기는 주말 집중. 홍대 본원. 정원 14명.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/winter" },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [{ url: "/images/og-winter.jpg", width: 1200, height: 630 }],
  },
};

const courseJsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: CAMP_INFO.name,
  description: `${CAMP_INFO.subtitle}. 8주 기숙 과정으로 학과는 강사 직강, 실기는 주말 집중 방식으로 운영합니다.`,
  provider: {
    "@type": "Organization",
    name: "모두다른고양이 미술학원",
    telephone: "+82-2-338-3302",
    address: {
      "@type": "PostalAddress",
      streetAddress: "와우산로23길 9 칼리오페 5층",
      addressLocality: "마포구",
      addressRegion: "서울",
      addressCountry: "KR",
    },
  },
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "Onsite",
    courseWorkload: "P8W",
    location: {
      "@type": "Place",
      name: CAMP_INFO.venueName,
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
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
      <WinterLanding />
    </>
  );
}
