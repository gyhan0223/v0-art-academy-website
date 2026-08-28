import type { Metadata } from "next";
import Link from "next/link";
import { NAVER_BOOKING_URL_ILSAN } from "@/lib/contact";

export const metadata: Metadata = {
  title: "홍대 미활보 가이드 준비중 | 모두다른고양이 미술학원",
  description:
    "홍익대 미술활동보고서 가이드를 준비하고 있습니다. 공개 전까지 궁금한 점은 상담으로 문의해 주세요.",
  robots: { index: false, follow: false },
};

// 일산 네이버 예약 — 내부 리다이렉트를 거쳐 차단 스위치(lib/contact.ts)를 태운다.
const NAVER_BOOKING = NAVER_BOOKING_URL_ILSAN;

export default function Page() {
  return (
    <main className="bg-background text-foreground flex min-h-dvh items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-accent text-xs tracking-[0.3em] mb-4">COMING SOON</p>
        <h1 className="text-3xl font-bold text-white leading-snug">
          홍대 미활보 가이드
          <br />
          준비중입니다
        </h1>
        <p className="text-muted-foreground text-sm mt-5 leading-relaxed">
          홍익대 미술활동보고서 가이드를 다듬고 있습니다.
          <br />
          공개 전까지 궁금한 점은 상담으로 문의해 주세요.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <a
            href={NAVER_BOOKING}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-md bg-accent px-6 py-3 text-sm font-medium text-black transition-opacity hover:opacity-85"
          >
            상담 신청
          </a>
          <Link
            href="/"
            className="text-xs text-muted-foreground transition-colors hover:text-white"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  );
}
