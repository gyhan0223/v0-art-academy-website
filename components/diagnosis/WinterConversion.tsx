"use client";

/**
 * 결과 → 윈터스쿨 안내 블록.
 * 진단 직후의 주 CTA는 1:1 전략 컨설팅(StrategyConsultCta)이고, 윈터스쿨은
 * 그 아래의 맥락형 보조 선택지다 — 채워진 accent 버튼은 컨설팅 CTA가
 * 독점하도록 여기서는 테두리형 버튼만 쓴다.
 * 숫자는 lib/winter-results.ts 단일 소스에서만 가져온다 — JSX에 하드코딩하지 않는다.
 */

import Link from "next/link";
import {
  WINTER_COHORT,
  getWinterCohortSummary,
} from "@/lib/winter-results";
import { trackDiagnosis } from "@/lib/diagnosis/analytics";

export default function WinterConversion() {
  const summary = getWinterCohortSummary();
  const { term, total, measured, improved, criterion, basis } = WINTER_COHORT;

  return (
    <section
      aria-label="윈터스쿨 안내"
      className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
    >
      <h2 className="text-[20px] font-bold leading-snug text-white">
        겨울방학 동안
        <br />
        집중 관리가 필요하다면
      </h2>

      {summary.isValid && (
        <div className="mt-6">
          <p className="text-3xl font-bold text-accent">
            {measured}명 중 {improved}명
          </p>
          <p className="mt-2 text-[14px] leading-relaxed text-white/70">
            {term} 수료생 중 <span className="font-bold text-white">{summary.rate}</span>가{" "}
            {criterion}
          </p>
          <p className="mt-1.5 text-[12px] text-white/40">
            {basis}
            {measured < total ? ` · 수료 ${total}명 중 ${measured}명 재측정` : ""}
          </p>
        </div>
      )}

      <div className="mt-6 space-y-3">
        <Link
          href="/winter"
          onClick={() => trackDiagnosis("diagnosis_winter_cta_click")}
          className="block rounded-xl border border-accent/50 px-6 py-4 text-center text-[15px] font-bold text-accent transition-colors hover:bg-accent/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          윈터스쿨에서 한 등급 올리는 방법 보기
        </Link>
        <Link
          href="/winter/results"
          onClick={() => trackDiagnosis("diagnosis_winter_results_click")}
          className="block rounded-xl border border-white/15 px-6 py-4 text-center text-[15px] font-medium text-white/80 transition-colors hover:border-accent/50 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          지난 윈터스쿨 성적 결과 확인하기
        </Link>
      </div>
    </section>
  );
}
