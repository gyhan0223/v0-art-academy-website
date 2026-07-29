import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "파주 미대 기숙학원 | 모두다른고양이 미술학원",
  description:
    "경기 파주 소재 미대 재수 기숙학원이 2027년 3월 문을 엽니다. 모두다른고양이 미술학원의 정규 기숙 과정, 사전 상담 예약을 받고 있습니다.",
};

const NAVER_BOOKING =
  "https://m.booking.naver.com/booking/6/bizes/1602022/items/7458196?theme=place&service-target=map-pc&lang=ko&area=bmp&map-search=1";

export default function Page() {
  return (
    <main className="bg-background text-foreground flex min-h-dvh flex-col items-center justify-center px-6 pt-28 pb-16">
      <div className="w-full max-w-md">
        {/* 윈터캠프(선행반) 안내 박스 */}
        <Link
          href="/winter"
          className="group mb-12 block rounded-xl border border-accent/30 bg-accent/[0.06] p-5 transition-colors hover:border-accent/60"
        >
          <p className="text-accent text-[11px] tracking-[0.25em] uppercase">
            Winter Camp · 선행반
          </p>
          <p className="mt-2 text-sm leading-relaxed text-white/80 break-keep">
            3월 정규 과정 이전, 홍대 본원에서 진행되는 1~2월
            윈터캠프(선행반)로 먼저 시작하실 수 있습니다.
          </p>
          <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
            윈터캠프 자세히 보기
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          </span>
        </Link>

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
        </div>
      </div>
    </main>
  );
}
