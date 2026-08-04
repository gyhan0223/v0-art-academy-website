import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "파주 미대 기숙학원 | 모두다른고양이 미술학원",
  description:
    "경기 파주 소재 미대 재수 기숙학원이 2027년 3월 문을 엽니다. 모두다른고양이 미술학원의 정규 기숙 과정, 사전 상담 예약을 받고 있습니다.",
  alternates: { canonical: "/gisuk" },
};

const NAVER_BOOKING =
  "https://m.booking.naver.com/booking/6/bizes/1602022/items/7458196?theme=place&service-target=map-pc&lang=ko&area=bmp&map-search=1";

export default function Page() {
  return (
    <main className="bg-background text-foreground flex min-h-dvh flex-col items-center justify-center px-6 pt-28 pb-16">
      <div className="w-full max-w-md">
        <div className="text-center">
          <p className="text-accent text-xs tracking-[0.3em] mb-4">
            COMING SOON
          </p>
          <h1 className="text-3xl font-bold text-white leading-snug break-keep">
            파주 미대 기숙학원
            <br />
            2027년 3월 오픈
          </h1>
          <p className="text-muted-foreground text-sm mt-5 leading-relaxed break-keep">
            미대 재수, 관리가 전부입니다.
            <br />
            경기 파주에 재수생 정규 기숙 과정이 문을 엽니다.
            <br />
            자세한 안내는 준비 중이며, 사전 상담은 지금도 가능합니다.
          </p>
          <a
            href={NAVER_BOOKING}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block rounded-md bg-accent px-6 py-3 text-sm font-medium text-black transition-opacity hover:opacity-85"
          >
            사전 상담 신청
          </a>

          {/* 기숙 과정에서 학부모가 가장 먼저 확인하는 것 — 누가 가르치는가 */}
          <p className="mt-6">
            <Link
              href="/teachers"
              className="text-sm text-white/50 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white"
            >
              학과 · 실기 강사진 먼저 보기
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
