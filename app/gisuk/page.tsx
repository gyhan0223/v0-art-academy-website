import type { Metadata } from "next";
import Link from "next/link";
import ConsultCampusLinks from "@/components/academy/ConsultCampusLinks";

export const metadata: Metadata = {
  title: "파주 미대 기숙학원 | 모두다른고양이 미술학원",
  description:
    "경기 파주 소재 미대 재수 기숙학원이 2027년 3월 문을 엽니다. 1~2월 홍대 본원 윈터스쿨에서 먼저 시작해 3월 정규 과정으로 이어갈 수 있으며, 사전 상담 예약을 받고 있습니다.",
  alternates: { canonical: "/gisuk" },
};

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
          {/* 파주는 아직 상담 창구가 없어 두 캠퍼스 중 가까운 곳에서 받는다 */}
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <ConsultCampusLinks
              action="사전 상담 신청"
              className="w-full rounded-md bg-accent px-6 py-3 text-center text-sm font-medium text-black transition-opacity hover:opacity-85 sm:w-auto"
            />
          </div>

          {/* 3월까지 기다릴 필요가 없다는 것을 여기서 먼저 알린다 */}
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-6 text-left">
            <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
              3월까지 기다리지 않아도 됩니다
            </p>
            <p className="mt-2.5 text-sm leading-relaxed text-white/70 break-keep">
              1월부터 2월까지는 홍대 본원 기숙 윈터스쿨에서 국어·영어·탐구를
              먼저 올려두고, 3월에 이곳 정규 과정으로 그대로 이어갈 수 있습니다.
            </p>
            <Link
              href="/winter"
              className="mt-4 inline-block text-sm font-semibold text-accent hover:underline"
            >
              2027 윈터스쿨 보기 →
            </Link>
          </div>

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
