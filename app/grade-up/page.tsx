import type { Metadata } from "next";
import GradeCaseList from "@/components/academy/GradeCaseList";
import { NAVER_BOOKING_URL_ILSAN } from "@/lib/contact";
import {
  COHORT,
  GRADE_CASES,
  IS_PLACEHOLDER,
  getCohortSummary,
  getPublishableCases,
} from "@/lib/grade-cases";

export const metadata: Metadata = {
  title: "성적 향상 사례 | 모두다른고양이 미술학원",
  description:
    "잘 오른 학생만 골라 보여주지 않습니다. 집계 대상 전원을 분모로 공개하고, 국어·영어·탐구 등급이 실제로 어떻게 바뀌었는지 사례별로 보여드립니다.",
  alternates: { canonical: "/grade-up" },
  // 자리표시자 상태에서는 색인되지 않도록 차단 — 실제 데이터 입력 후
  // lib/grade-cases.ts의 IS_PLACEHOLDER를 false로 바꾸면 자동으로 색인이 열린다.
  ...(IS_PLACEHOLDER ? { robots: { index: false, follow: true } } : {}),
};

// 일산 네이버 예약 — 내부 리다이렉트를 거쳐 차단 스위치(lib/contact.ts)를 태운다.
const NAVER_BOOKING = NAVER_BOOKING_URL_ILSAN;

const PHONE_HONGDAE = "02-338-3302";

export default function Page() {
  const cohort = getCohortSummary(COHORT);
  const published = getPublishableCases(GRADE_CASES);

  const facts: { label: string; value: string }[] = [
    { label: "집계 범위", value: COHORT.scope },
    ...(COHORT.excluded ? [{ label: "제외", value: COHORT.excluded }] : []),
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
            잘 오른 학생만 골라 보여드리지 않습니다. 집계 대상 전원을 분모로
            먼저 공개하고, 그 안의 개별 사례를 보여드립니다.
          </p>
        </header>

        {IS_PLACEHOLDER && (
          <p className="mx-auto mt-8 max-w-xl rounded-lg border border-dashed border-accent/40 bg-accent/[0.06] px-4 py-3 text-center text-xs leading-relaxed text-accent break-keep">
            현재 표시된 수치와 사례는 화면 확인용 샘플입니다. 실제 집계 결과
            입력 후 공개됩니다.
          </p>
        )}

        {/* 분모 공개 — 이 페이지에서 가장 먼저 읽혀야 하는 숫자 */}
        {cohort.isValid && (
          <section
            aria-label="집계 결과"
            className="mt-10 rounded-2xl border border-accent/30 bg-accent/[0.06] px-6 py-8 md:px-10 md:py-10"
          >
            <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:gap-10">
              <div className="flex-1">
                <p className="text-xs font-semibold tracking-[0.2em] text-accent">
                  {COHORT.year}
                </p>
                <p className="mt-3 text-2xl md:text-3xl font-bold leading-snug text-white break-keep">
                  재원생{" "}
                  <span className="tabular-nums text-accent">
                    {COHORT.total}명
                  </span>{" "}
                  중{" "}
                  <span className="tabular-nums text-accent">
                    {COHORT.improved}명
                  </span>
                  이<br className="hidden sm:block" /> {COHORT.criterion}{" "}
                  올랐습니다
                </p>
                {/* 어떤 시험을 비교한 숫자인지 — 주장 바로 아래에 붙인다 */}
                <p className="mt-3 text-sm text-white/50">{COHORT.basis}</p>
              </div>

              <p className="text-5xl md:text-6xl font-black leading-none tabular-nums text-accent">
                {cohort.rate}
              </p>
            </div>

            {/* 숫자를 믿게 만드는 것은 숫자가 아니라 집계 방법이다 */}
            <dl className="mt-7 grid gap-2 border-t border-white/10 pt-5 text-xs sm:grid-cols-3">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-white/40">{fact.label}</dt>
                  <dd className="mt-1 leading-relaxed text-white/70 break-keep">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {/* 집계와 사례를 잇는 문장 — 사례가 전체가 아님을 먼저 밝힌다 */}
        {published.length > 0 && (
          <p className="mt-8 text-center text-sm leading-relaxed text-white/55 break-keep">
            아래는 그중 학생·학부모의 서면 동의를 받아 공개하는{" "}
            <span className="font-semibold tabular-nums text-white">
              {published.length}건
            </span>
            입니다.
          </p>
        )}

        {/* 사례 목록 */}
        <section className="mt-10">
          <GradeCaseList />
        </section>

        {/* 안내 */}
        <p className="mt-10 text-center text-xs leading-relaxed text-white/35 break-keep">
          모든 사례는 학생 및 학부모의 서면 동의를 받아 게시하며, 이름은
          이니셜로, 학교는 지역만 표기합니다. 등급은 미대 반영 3과목(국어·영어·
          탐구)의 평가원 시험(모의평가·수능) 성적 기준이며, 성적 향상 정도는
          개인에 따라 다를 수 있습니다.
        </p>

        {/* CTA */}
        <section className="mt-12 rounded-2xl border border-white/12 bg-white/[0.03] px-7 py-9 text-center md:px-12 md:py-11">
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
