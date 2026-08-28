import type { Metadata } from "next";
import Link from "next/link";
import { CAMPUSES } from "@/lib/contact";

/**
 * [임시] 네이버 예약 차단 중 안내 페이지.
 *
 * 네이버 예약 상품이 검수 중인 동안 모든 예약 리다이렉트(app/booking/*)가
 * 이곳으로 온다 — lib/contact.ts의 NAVER_BOOKING_PAUSED 참고.
 * 예약 대신 캠퍼스별 전화 예약을 안내한다.
 * 검수가 끝나 스위치를 끄면 아무도 도달하지 않는 페이지가 되므로
 * 색인은 처음부터 막아둔다.
 */

export const metadata: Metadata = {
  title: "예약 준비 중 | 모두다른고양이 미술학원",
  description:
    "네이버 예약 서비스를 준비하고 있습니다. 준비되는 동안 전화로 상담을 예약하실 수 있습니다.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <main className="bg-background text-foreground flex min-h-dvh flex-col items-center justify-center px-6 pt-28 pb-16">
      <div className="w-full max-w-md">
        <div className="text-center">
          <p className="text-accent text-xs tracking-[0.3em] mb-4">
            SERVICE PREPARING
          </p>
          <h1 className="text-3xl font-bold text-white leading-snug break-keep">
            네이버 예약 서비스
            <br />
            준비 중입니다
          </h1>
          <p className="text-muted-foreground text-sm mt-5 leading-relaxed break-keep">
            더 편한 예약을 위해 네이버 예약 서비스를 준비하고 있습니다.
            <br />
            준비되는 동안에는 전화로 상담을 예약하실 수 있습니다.
          </p>

          {/* 캠퍼스별 전화 예약 — 번호는 lib/contact.ts의 CAMPUSES 단일 소스 */}
          <div className="mt-8 space-y-3">
            {CAMPUSES.map((campus) => (
              <a
                key={campus.label}
                href={`tel:${campus.phone}`}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5 text-left transition-colors hover:border-accent/40"
              >
                <span className="text-sm font-medium text-white/70">
                  {campus.label}
                </span>
                <span className="text-lg font-bold text-white tabular-nums">
                  {campus.phone}
                </span>
              </a>
            ))}
          </div>
          <p className="text-muted-foreground/70 mt-3 text-xs">
            번호를 누르면 바로 전화가 연결됩니다.
          </p>

          <p className="mt-10">
            <Link
              href="/"
              className="text-sm text-white/50 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white"
            >
              홈으로 돌아가기
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
