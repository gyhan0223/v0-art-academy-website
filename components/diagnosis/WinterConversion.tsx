"use client";

/**
 * 결과 → 윈터스쿨 안내 블록.
 * 고2 이하 학생의 결과 화면에서 유일한 다음 단계 카드다(고3·N수생은
 * FinalConversion을 대신 본다). 유료 컨설팅 CTA는 결과 화면에 두지 않는다 —
 * 무료 진단 직후에 상품을 붙이면 진단이 영업으로 읽힌다.
 * 강요하는 인상을 주지 않도록 채워진 버튼 없이 테두리형 버튼만 쓴다.
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
          <p className="mt-2 text-[15px] leading-relaxed text-white/75">
            {term} 수료생 중 <span className="font-bold text-white">{summary.rate}</span>가{" "}
            {criterion}
          </p>
          <p className="mt-1.5 text-[12px] text-white/50">
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
