"use client";

/**
 * /winter/results — 윈터스쿨 성적 향상 사례.
 * 1주차 진단고사 → 8주차 재측정, 국어·영어·탐구 세 과목만.
 * 분모(8주를 마친 전원)를 먼저 공개하고 그 안의 개별 사례를 보여준다.
 * 데이터는 lib/winter-results.ts에만 있다.
 */

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Minus } from "lucide-react";
import {
  WINTER_COHORT,
  IS_PLACEHOLDER,
  SUBJECT_ORDER,
  getPublishableResults,
  getWinterCohortSummary,
  getGain,
  type SubjectResult,
  type WinterResultCase,
} from "@/lib/winter-results";
import Testimonials from "@/components/winter/Testimonials";
import CtaBand from "@/components/winter/CtaBand";
import MobileActionBar from "@/components/winter/MobileActionBar";
import {
  fadeUp,
  SectionHead,
  SubPageHeader,
  SubPageTabs,
  PlaceholderNotice,
} from "@/components/winter/shared";

function GainBadge({ result }: { result: SubjectResult }) {
  const gain = getGain(result);

  if (gain <= 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-white/15 px-2.5 py-1 text-[11px] font-medium text-white/45">
        <Minus size={11} />
        유지
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 text-[11px] font-bold text-accent">
      {gain}등급 ↑
    </span>
  );
}

function ResultCard({ item }: { item: WinterResultCase }) {
  // 과목 순서는 국어 → 영어 → 탐구로 고정한다
  const rows = [...item.results].sort(
    (a, b) =>
      SUBJECT_ORDER.indexOf(a.subject) - SUBJECT_ORDER.indexOf(b.subject),
  );

  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-7">
      <div className="flex items-baseline gap-2">
        <p className="text-lg font-bold text-white">{item.name}</p>
        <p className="text-xs text-white/45">{item.grade}</p>
      </div>
      {item.school && (
        <p className="mt-1 text-xs text-white/35">{item.school}</p>
      )}

      <table className="mt-5 w-full border-t border-white/10 text-sm">
        <caption className="sr-only">
          {item.name} 1주차 진단고사와 8주차 재측정 등급 비교
        </caption>
        <thead>
          <tr className="text-[11px] tracking-widest text-white/35 uppercase">
            <th scope="col" className="py-2.5 text-left font-normal">
              과목
            </th>
            <th scope="col" className="py-2.5 text-center font-normal">
              1주차
            </th>
            <th scope="col" className="py-2.5 text-center font-normal">
              8주차
            </th>
            <th scope="col" className="py-2.5 text-right font-normal">
              변화
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.subject}
              className="border-t border-white/5 tabular-nums"
            >
              <th
                scope="row"
                className="py-3 text-left text-sm font-medium text-white/80"
              >
                {row.subject}
              </th>
              <td className="py-3 text-center text-white/45">
                {row.diagnostic}등급
              </td>
              <td className="py-3 text-center text-base font-bold text-white">
                {row.retest}등급
              </td>
              <td className="py-3 text-right">
                <GainBadge result={row} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {item.quote && (
        <p className="mt-5 border-t border-white/10 pt-5 text-sm leading-relaxed text-white/55 break-keep">
          “{item.quote}”
        </p>
      )}
    </div>
  );
}

export default function WinterResultsPage() {
  const summary = getWinterCohortSummary(WINTER_COHORT);
  const published = getPublishableResults();

  return (
    <main className="bg-background text-foreground pb-20 md:pb-0">
      <section className="px-5 pt-28 md:px-6 md:pt-32">
        <div className="mx-auto max-w-5xl">
          <SubPageHeader
            en="Results"
            title="성적 향상 사례"
            sub="1주차 진단고사와 8주차 재측정을 같은 기준으로 비교합니다. 오른 학생만 골라 보여드리지 않고, 8주를 마친 전원을 분모로 먼저 공개합니다."
          />

          {IS_PLACEHOLDER && (
            <div className="mt-8">
              <PlaceholderNotice>
                현재 표시된 수치와 사례는 화면 확인용 샘플입니다. 실제 집계 결과
                입력 후 공개됩니다.
              </PlaceholderNotice>
            </div>
          )}

          <div className="mt-8">
            <SubPageTabs />
          </div>
        </div>
      </section>

      {/* ---- 분모 공개 ---- */}
      {summary.isValid && (
        <section className="px-5 py-14 md:px-6 md:py-16">
          <motion.div
            {...fadeUp}
            aria-label="집계 결과"
            className="mx-auto max-w-4xl rounded-2xl border border-accent/30 bg-accent/[0.06] px-6 py-8 md:px-10 md:py-10"
          >
            <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:gap-10">
              <div className="flex-1">
                <p className="text-xs font-semibold tracking-[0.2em] text-accent">
                  {WINTER_COHORT.term}
                </p>
                <p className="mt-3 text-2xl md:text-3xl font-bold leading-snug text-white break-keep">
                  8주를 마친{" "}
                  <span className="tabular-nums text-accent">
                    {WINTER_COHORT.total}명
                  </span>{" "}
                  중 재측정에 응시한{" "}
                  <span className="tabular-nums text-accent">
                    {WINTER_COHORT.measured}명
                  </span>
                  ,
                  <br className="hidden sm:block" /> 그중{" "}
                  <span className="tabular-nums text-accent">
                    {WINTER_COHORT.improved}명
                  </span>
                  이 {WINTER_COHORT.criterion}했습니다
                </p>
                <p className="mt-3 text-sm text-white/50 break-keep">
                  {WINTER_COHORT.basis}
                </p>
              </div>

              <p className="text-5xl md:text-6xl font-black leading-none tabular-nums text-accent">
                {summary.rate}
              </p>
            </div>

            <dl className="mt-7 grid gap-2 border-t border-white/10 pt-5 text-xs sm:grid-cols-3">
              <div>
                <dt className="text-white/40">비교 기준</dt>
                <dd className="mt-1 leading-relaxed text-white/70 break-keep">
                  1주차 진단고사 → 8주차 재측정
                </dd>
              </div>
              <div>
                <dt className="text-white/40">대상 과목</dt>
                <dd className="mt-1 leading-relaxed text-white/70 break-keep">
                  국어 · 영어 · 탐구 (미대 반영 3과목)
                </dd>
              </div>
              {WINTER_COHORT.excluded && (
                <div>
                  <dt className="text-white/40">제외</dt>
                  <dd className="mt-1 leading-relaxed text-white/70 break-keep">
                    {WINTER_COHORT.excluded}
                  </dd>
                </div>
              )}
            </dl>
          </motion.div>
        </section>
      )}

      {/* ---- 개별 사례 ---- */}
      <section className="border-y border-white/5 bg-[#05050a] px-5 py-20 md:px-6 md:py-24">
        <div className="mx-auto max-w-5xl">
          <SectionHead
            en="Cases"
            ko="8주 동안 무엇이 바뀌었나"
            sub={
              published.length > 0 ? (
                <>
                  위 집계 중 학생·학부모의 서면 동의를 받아 공개하는{" "}
                  <span className="font-semibold tabular-nums text-white">
                    {published.length}건
                  </span>
                  입니다.
                </>
              ) : undefined
            }
          />

          {published.length === 0 ? (
            <p className="text-center text-sm text-white/45 break-keep">
              공개 동의를 받은 사례를 준비하고 있습니다.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {published.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                >
                  <ResultCard item={item} />
                </motion.div>
              ))}
            </div>
          )}

          <p className="mx-auto mt-10 max-w-2xl text-center text-xs leading-relaxed text-white/35 break-keep">
            모든 사례는 학생 및 학부모의 서면 동의를 받아 게시하며, 이름은
            이니셜로, 학교는 지역만 표기합니다. 등급은 미대 반영 3과목(국어·영어·
            탐구) 기준이며, 성적 향상 정도는 개인에 따라 다를 수 있습니다.
          </p>

          <p className="mt-6 text-center text-sm">
            <Link
              href="/grade-up"
              className="inline-flex items-center gap-1.5 text-accent hover:underline"
            >
              학원 전체 성적 향상 사례 보기
              <ArrowRight size={15} />
            </Link>
          </p>
        </div>
      </section>

      {/* ---- 후기 ---- */}
      <section className="px-5 py-20 md:px-6 md:py-24">
        <div className="mx-auto max-w-5xl">
          <SectionHead
            en="Reviews"
            ko="먼저 보낸 부모님들의 이야기"
            sub="윈터스쿨을 경험한 학생과 학부모님의 목소리입니다."
          />
          <motion.div {...fadeUp}>
            <Testimonials />
          </motion.div>
        </div>
      </section>

      <CtaBand
        headline={
          <>
            지금 등급에서 8주 뒤
            <br className="md:hidden" /> 어디까지 갈 수 있는지
          </>
        }
        sub="현재 성적을 보고 무엇을 먼저 올려야 하는지 상담에서 구체적으로 잡아드립니다."
      />

      <MobileActionBar />
    </main>
  );
}
