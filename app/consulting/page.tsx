import type { Metadata } from "next";
import ConsultingLanding from "@/components/consulting/ConsultingLanding";
import { CONSULTING_FAQS, CONSULTING_INFO } from "@/lib/consulting";

const PAGE_TITLE = "미대 입시 1:1 컨설팅 | 모두다른고양이 미술학원";
const PAGE_DESCRIPTION =
  "현재 성적·실기 유형·희망 대학을 바탕으로 지원 가능 대학, 목표 대학까지의 거리, 가·나·다군 지원 방향을 1:1로 상담합니다.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/consulting" },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    type: "website",
    images: [{ url: "/images/og-home.jpg", width: 1200, height: 630 }],
  },
};

// 확인되지 않은 정보(상담 시간·평점·후기 등)는 넣지 않는다.
const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "1:1 미대 입시 전략 컨설팅",
  serviceType: "미대 입시 전략 컨설팅",
  description: PAGE_DESCRIPTION,
  provider: {
    "@type": "Organization",
    name: "모두다른고양이 미술학원",
  },
  areaServed: "KR",
  offers: {
    "@type": "Offer",
    price: CONSULTING_INFO.price,
    priceCurrency: "KRW",
  },
};

// FAQ가 실제 페이지에 노출되므로 FAQPage structured data도 함께 둔다.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: CONSULTING_FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {/* ?from= 유입 추적은 ConsultingLanding이 마운트 후 location에서 직접
          읽는다 — useSearchParams를 쓰지 않아 Suspense 경계 없이 정적 렌더된다 */}
      <ConsultingLanding />
    </>
  );
}
