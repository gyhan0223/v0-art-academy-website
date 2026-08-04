import type { Metadata } from "next";
import WinterGalleryPage from "@/components/winter/WinterGalleryPage";

const PAGE_TITLE = "윈터캠프 캠프 사진 | 2027 모다고 윈터캠프";
const PAGE_DESCRIPTION =
  "8주를 보낼 공간입니다. 홍대 본원의 기숙사·강의실·실기실과 매 끼 30찬 뷔페식 식사를 사진으로 확인하세요.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/winter/gallery" },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [{ url: "/images/og-winter.jpg", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return <WinterGalleryPage />;
}
