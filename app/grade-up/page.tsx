import type { Metadata } from "next";
import GradeCaseList from "@/components/academy/GradeCaseList";
import {
  GRADE_CASES,
  IS_PLACEHOLDER,
  getCaseStats,
} from "@/lib/grade-cases";

export const metadata: Metadata = {
  title: "성적 향상 사례 | 모두다른고양이 미술학원",
  description:
    "모두다른고양이 미술학원에서 학과 등급과 실기가 함께 오른 실제 사례입니다. 과목별 등급 변화와 최종 결과를 그대로 공개합니다.",
  alternates: { canonical: "/grade-up" },
  // 자리표시자 상태에서는 색인되지 않도록 차단 — 실제 데이터 입력 후
  // lib/grade-cases.ts의 IS_PLACEHOLDER를 false로 바꾸면 자동으로 색인이 열린다.
  ...(IS_PLACEHOLDER ? { robots: { index: false, follow: true } } : {}),
};

const NAVER_BOOKING =
  "https://m.booking.naver.com/booking/6/bizes/1602022/items/7458196?theme=place&service-target=map-pc&lang=ko&area=bmp&map-search=1";

const PHONE_HONGDAE = "02-338-3302";

export default function Page() {
  const stats = getCaseStats(GRADE_CASES);

  const summary: { label: string; value: string }[] = [
    { label: "공개 사례", value: `${stats.total}건` },
    { label: "등급이 오른 과목", value: `${stats.subjectCount}개` },
    {
      label: "평균 상승 등급",
      value: stats.averageRise > 0 ? `${stats.averageRise}등급` : "—",
    },
    {
      label: "최대 상승 폭",
      value: stats.maxRise > 0 ? `${stats.maxRise}등급` : "—",
    },
  ];

  return (
    <main className="bg-background text-foreground min-h-dvh px-5 pt-28 pb-20 md:px-6">
      <div className="mx-auto max-w-5xl">
        {/* 헤더 */}
        <header className="text-center">
          <p className="text-accent text-xs tracking-[0.3em] uppercase mb-4">
            Grade Improvement
          </p>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white break-keep">
            성적 향상 사례
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm md:text-base leading-relaxed text-white/60 break-keep">
            미대 입시는 실기만으로 끝나지 않습니다. 학과 등급이 어디서 어디까지
            올랐는지, 실기는 어떻게 달라졌는지 — 실제 수강생의 변화를 과목
            단위로 공개합니다.
          </p>
        </header>

        {IS_PLACEHOLDER && stats.total > 0 && (
          <p className="mx-auto mt-8 max-w-xl rounded-lg border border-dashed border-accent/40 bg-accent/[0.06] px-4 py-3 text-center text-xs leading-relaxed text-accent break-keep">
            현재 표시된 내용은 화면 확인용 샘플입니다. 실제 사례 입력 후
            공개됩니다.
          </p>
        )}

        {/* 요약 지표 — 사례가 하나도 없으면 0만 나열되므로 감춘다 */}
        {stats.total > 0 && (
          <dl className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
            {summary.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-5 text-center"
              >
                <dt className="text-xs text-white/45">{s.label}</dt>
                <dd className="mt-1.5 text-xl md:text-2xl font-black tabular-nums text-white">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {/* 사례 목록 */}
        <section className="mt-14">
          <GradeCaseList />
        </section>

        {/* 안내 */}
        <p className="mt-10 text-center text-xs leading-relaxed text-white/35 break-keep">
          모든 사례는 학생 및 학부모의 동의를 받아 게시하며, 이름은 성만
          표기합니다. 등급 변화는 각 사례에 표기된 시험을 기준으로 하며, 성적
          향상 정도는 개인에 따라 다를 수 있습니다.
        </p>

        {/* CTA */}
        <section className="mt-12 rounded-2xl border border-accent/30 bg-accent/[0.06] px-7 py-9 text-center md:px-12 md:py-11">
          <p className="text-xl md:text-2xl font-bold leading-snug text-white break-keep">
            지금 등급으로 갈 수 있는 학교, 먼저 알려드립니다
          </p>
          <p className="mt-2.5 text-sm md:text-base text-white/60 break-keep">
            현재 성적과 실기 수준을 보고 남은 기간에 무엇을 올려야 하는지
            상담에서 구체적으로 잡아드립니다.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={NAVER_BOOKING}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center rounded-full bg-accent px-8 py-4 text-base font-bold text-black transition-opacity hover:opacity-85 sm:w-auto"
            >
              상담 신청하기
            </a>
            <a
              href={`tel:${PHONE_HONGDAE}`}
              className="inline-flex w-full items-center justify-center rounded-full border border-white/25 px-8 py-4 text-base font-medium text-white transition-colors hover:border-white/50 sm:w-auto"
            >
              {PHONE_HONGDAE}
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
