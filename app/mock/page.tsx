import type { Metadata } from "next";
import MockLanding from "@/components/mock/MockLanding";

export const metadata: Metadata = {
  title: "실기 모의고사 | 모두다른고양이 미술학원 홍대 본원",
  description:
    "대학 실기고사와 동일한 4시간. 6개 항목 채점과 목표 대학 합격선을 담은 성적표를 드립니다. 토·일 진행, 47,600원.",
  alternates: { canonical: "/mock" },
  openGraph: {
    title: "실기 모의고사 | 모두다른고양이 미술학원 홍대 본원",
    description:
      "대학 실기고사와 동일한 4시간. 6개 항목 채점과 목표 대학 합격선을 담은 성적표를 드립니다. 토·일 진행, 47,600원.",
    // TODO: /images/og-mock.jpg 파일 추가 필요
    images: [{ url: "/images/og-mock.jpg", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return <MockLanding />;
}
