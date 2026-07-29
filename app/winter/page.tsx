import type { Metadata } from "next";
import WinterLanding from "@/components/winter/WinterLanding";
import { CAMP_INFO } from "@/lib/winter-camp";

export const metadata: Metadata = {
  title: "2027 모다고 윈터캠프 | 홍대 본원 미대입시 기숙 윈터스쿨",
  description:
    "[예비 고2·고3 대상 8주 기숙 과정. 실기+학과+숙식+생활관리 통합. 홍대 본원. 정원 14명.]", // TODO: 원장님 확인
  openGraph: {
    title: "2027 모다고 윈터캠프 | 홍대 본원 미대입시 기숙 윈터스쿨",
    description:
      "[예비 고2·고3 대상 8주 기숙 과정. 실기+학과+숙식+생활관리 통합. 홍대 본원. 정원 14명.]", // TODO: 원장님 확인
    images: [{ url: "/images/og-winter.jpg", width: 1200, height: 630 }],
  },
};

const courseJsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: CAMP_INFO.name,
  description: `${CAMP_INFO.subtitle}. 8주 기숙 과정으로 실기·학과·숙식·생활관리를 통합 운영합니다.`,
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
