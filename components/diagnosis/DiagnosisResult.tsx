"use client";

/**
 * 진단 결과 화면.
 * - 고2·고3·N수: 현재 가·나·다 조합 → 한 등급 상승 비교 → 1:1 컨설팅 CTA
 * - 고1·중3 이하: 희망 대학까지의 거리(정량화 가능할 때만) → 1:1 컨설팅 CTA
 * 윈터스쿨은 두 분기 모두에서 컨설팅 아래의 보조 선택지로 내려간다.
 * 컨설팅 CTA는 분기 조건상 정확히 한 번만 렌더된다.
 */

import { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import type { Gun } from "@/lib/jungsi-data";
import {
  analyzeTarget,
  customBasisFromRanked,
  diagnose,
  hasAnyScore,
  isTopTier,
  TOP_CUSTOM_UNIVERSITIES,
  type DiagnosisFilters,
} from "@/lib/diagnosis/score-engine";
import type { Ranked } from "@/lib/jungsi-recommend";
import { simulateOneGradeUp } from "@/lib/diagnosis/grade-up-simulation";
import {
  FUTURE_ADMISSION_GRADES,
  resultBranchOf,
  scoreDetailLevel,
  type DetailedStudentScore,
  type DiagnosisGender,
  type DiagnosisGrade,
  type DiagnosisSilgi,
} from "@/lib/diagnosis/types";
import { trackDiagnosis } from "@/lib/diagnosis/analytics";
import { ComboCard, TierBadge } from "./ComboCards";
import StrategyConsultCta from "./StrategyConsultCta";
import GradeUpComparison from "./GradeUpComparison";
import WinterConversion from "./WinterConversion";
import { useFadeProps } from "./step-ui";

const GUNS: Gun[] = ["가", "나", "다"];

/* ------------------------------ 정확도 라벨 ------------------------------ */

function DetailLevelBadge({ score }: { score: DetailedStudentScore }) {
  const level = scoreDetailLevel(score);
  return (
    <span className="inline-block rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-[12px] text-white/55">
      {level === "detailed" ? "성적표 기준 분석" : "등급 기준 예상"}
    </span>
  );
}

/* --------------------------- 희망 대학 거리 보기 --------------------------- */

function TargetGapView({
  score,
  university,
  filters,
}: {
  score: DetailedStudentScore;
  university: string;
  filters: DiagnosisFilters;
}) {
  const analysis = useMemo(
    () => analyzeTarget(score, university, filters),
    [score, university, filters],
  );

  if (analysis.kind === "no-data") {
    return (
      <section aria-label="희망 대학 분석">
        <h2 className="text-[22px] font-bold leading-snug text-white">
          {university}까지
          <br />
          지금 얼마나 남았을까요?
        </h2>
        <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <p className="text-[14px] leading-relaxed text-white/70">
            {university}는 최근 입시결과 공개 자료가 없어, 현재 데이터만으로
            정확한 등급 차이 산정이 어려워요.
          </p>
          {analysis.entries.length > 0 && (
            <p className="mt-3 text-[13px] leading-relaxed text-white/50">
              {university}는{" "}
              {[...new Set(analysis.entries.map((e) => `${e.gun}군`))].join(" · ")}
              에서 모집해요. 아래 일반 추천과 함께 지원권 기준으로
              준비 방향을 잡아보세요.
            </p>
          )}
        </div>
      </section>
    );
  }

  const { targetPercentile, currentConverted, subjects, reached } = analysis;
  // 목표를 바 오른쪽 85% 지점에 두고 현재 위치를 비율로 배치
  const currentPos =
    currentConverted == null
      ? null
      : Math.max(
          4,
          Math.min(96, (currentConverted / targetPercentile) * 85),
        );

  return (
    <section aria-label="희망 대학까지의 거리">
      <h2 className="text-[22px] font-bold leading-snug text-white">
        {university}까지
        <br />
        지금 얼마나 남았을까요?
      </h2>

      {reached && (
        <p className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.07] p-4 text-[14px] leading-relaxed text-emerald-200/90">
          수능 기준으로는 이미 목표권에 근접해 있어요. 이 위치를 유지하면서
          실기 완성도를 끌어올리는 게 다음 과제예요.
        </p>
      )}

      {currentPos != null && (
        <div className="mt-6" aria-hidden>
          <div className="relative h-8">
            <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-white/10" />
            <div
              className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-accent/60"
              style={{ width: `${currentPos}%` }}
            />
            <span
              className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
              style={{ left: `${currentPos}%` }}
            />
            <span className="absolute left-[85%] top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/60 bg-transparent" />
          </div>
          <div className="flex justify-between text-[12px] text-white/45">
            <span>현재 위치</span>
            <span>{university} 목표권</span>
          </div>
        </div>
      )}

      <ul className="mt-6 space-y-3">
        {subjects.map((s) => {
          const target =
            s.targetGrade[0] === s.targetGrade[1]
              ? `${s.targetGrade[0]}등급`
              : `${s.targetGrade[0]}~${s.targetGrade[1]}등급`;
          return (
            <li
              key={s.label}
              className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
            >
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-[15px] font-bold text-white">{s.label}</p>
                {s.gapGrades != null && (
                  <p className="text-[13px] text-white/55">
                    {s.gapGrades <= 0
                      ? "목표권"
                      : `약 ${
                          s.targetGrade[0] === s.targetGrade[1]
                            ? s.gapGrades
                            : `${Math.max(1, s.gapGrades)}~${
                                s.gapGrades + (s.targetGrade[1] - s.targetGrade[0])
                              }`
                        }등급 차이`}
                  </p>
                )}
              </div>
              <div className="mt-2 flex items-center gap-4 text-[14px]">
                <span className="text-white/60">
                  현재{" "}
                  <span className="font-bold text-white">
                    {s.currentGrade != null ? `${s.currentGrade}등급` : "—"}
                  </span>
                </span>
                <span aria-hidden className="text-white/25">
                  →
                </span>
                <span className="text-white/60">
                  목표권 <span className="font-bold text-accent">{target}</span>
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 text-[12px] leading-relaxed text-white/35">
        목표권 등급은 공개된 입시결과 컷을 등급 구간으로 되돌린 근사 범위예요.
        과목별 실제 요구 수준은 대학 반영비율에 따라 달라질 수 있어요.
      </p>
    </section>
  );
}

/* --------------------------- 자체 기준 전형 참고 --------------------------- */

function customRefName(r: Ranked): string {
  const gun = r.entry.gun === "별도" ? "군외 별도" : `${r.entry.gun}군`;
  return `${r.entry.university}(${gun})`;
}

/**
 * 서울대·한예종처럼 자체 기준이라 환산 비교에서 빠진 대학 안내.
 * 수능 최상위권이면 강조 카드로, 아니면 작은 각주로 보여준다.
 * 임의 환산식 없이 "비교에서 제외했다"는 사실만 전달한다.
 */
function CustomBasisNote({
  refs,
  topTier,
}: {
  refs: Ranked[];
  topTier: boolean;
}) {
  if (refs.length === 0) return null;

  const topRefs = refs.filter((r) =>
    TOP_CUSTOM_UNIVERSITIES.includes(r.entry.university),
  );
  const otherRefs = refs.filter(
    (r) => !TOP_CUSTOM_UNIVERSITIES.includes(r.entry.university),
  );
  const showTopCard = topTier && topRefs.length > 0;
  const footnoteRefs = showTopCard ? otherRefs : refs;

  return (
    <>
      {showTopCard && (
        <div className="mt-4 rounded-xl border border-accent/40 bg-accent/[0.06] p-5">
          <p className="text-[15px] font-bold text-white">
            자체 기준 전형도 검토 대상이에요
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-white/65">
            <span className="font-medium text-white/85">
              {topRefs.map(customRefName).join(" · ")}
            </span>
            {"은(는) "}
            자체 실기·자체 기준으로 선발해 점수 비교에서는 제외했지만, 지금
            수능 위치라면 함께 검토할 만한 전형이에요.
            {topRefs.some((r) => r.entry.university === "서울대학교") &&
              " 서울대는 1단계를 수능 100%로 선발해요."}
          </p>
        </div>
      )}
      {footnoteRefs.length > 0 && (
        <p className="mt-3 text-[12px] leading-relaxed text-white/35">
          {footnoteRefs.map(customRefName).join(" · ")}
          {"은(는) "}자체 기준 전형이라 환산 비교에서 제외했어요.
        </p>
      )}
    </>
  );
}

/* --------------------------------- 결과 --------------------------------- */

export default function DiagnosisResult({
  grade,
  gender,
  silgi,
  score,
  target,
  onRestart,
}: {
  grade: DiagnosisGrade;
  gender: DiagnosisGender;
  silgi: DiagnosisSilgi[];
  score: DetailedStudentScore;
  target: string | null;
  onRestart: () => void;
}) {
  const fade = useFadeProps();
  const branch = resultBranchOf(grade);
  const filters = useMemo<DiagnosisFilters>(
    () => ({ gender, silgi }),
    [gender, silgi],
  );

  const current = useMemo(() => diagnose(score, filters), [score, filters]);
  const customRefs = useMemo(
    () => customBasisFromRanked(current.ranked),
    [current],
  );
  const topTier = useMemo(() => isTopTier(score), [score]);
  const scoreless = !hasAnyScore(score);
  const gradeUp = useMemo(
    () =>
      branch === "simulation" && !scoreless
        ? diagnose(simulateOneGradeUp(score), filters)
        : null,
    [branch, score, filters, scoreless],
  );

  const viewed = useRef(false);
  useEffect(() => {
    if (viewed.current) return;
    viewed.current = true;
    trackDiagnosis("diagnosis_result_view", {
      grade_group: grade,
      gender,
      silgi_type: silgi.join(",") || undefined,
      has_detailed_score: scoreDetailLevel(score) === "detailed",
      result_branch: branch === "target" && target ? "target" : branch,
    });
  }, [grade, gender, silgi, score, branch, target]);

  const showCombo = !scoreless && (branch === "simulation" || target == null);

  return (
    <motion.div {...fade} className="mx-auto w-full max-w-md px-5 pb-24 pt-6">
      {!scoreless && <DetailLevelBadge score={score} />}

      {/* 성적 없이 진행한 경우(중3·모의고사 전) — 지원권 계산 없이 방향만 안내 */}
      {scoreless && (
        <section
          aria-label="성적 입력 전 안내"
          className="mt-2 rounded-xl border border-white/10 bg-white/[0.02] p-5"
        >
          <h2 className="text-[20px] font-bold leading-snug text-white">
            아직 모의고사 성적이 없어서
            <br />
            지원권 계산은 건너뛰었어요
          </h2>
          <p className="mt-3 text-[14px] leading-relaxed text-white/60">
            지금 단계에서는 실기 유형과 목표 대학을 기준으로 준비 방향을 잡는
            것으로 충분해요. 첫 모의고사 성적이 나오면 다시 진단해보세요 —
            지원 가능한 대학 조합까지 보여드릴 수 있어요.
          </p>
        </section>
      )}

      {/* 희망 대학 거리 (고1·중3 이하 + 목표 대학 선택) */}
      {branch === "target" && target != null && (
        <div className="mt-6">
          <TargetGapView score={score} university={target} filters={filters} />
        </div>
      )}

      {/* 1:1 전략 컨설팅 CTA — 모든 분기에서 정확히 한 번만 노출한다.
          성적 없음·희망 대학 분석 분기는 결과 바로 아래(여기),
          지원권 조합 분기는 한 등급 상승 비교 뒤(아래쪽)에 둔다.
          데이터가 부족한 분기에서 사람이 이어받는 창구 역할도 겸한다. */}
      {(scoreless || (branch === "target" && target != null)) && (
        <div className="mt-6">
          <StrategyConsultCta showMiddleSchoolNote={grade === "중3 이하"} />
        </div>
      )}

      {/* 현재 지원권 조합 */}
      {showCombo && (
        <section aria-label="현재 지원권 조합" className="mt-6">
          <h2 className="text-[22px] font-bold leading-snug text-white">
            지금 성적으로는
            <br />
            이런 조합이 보여요
          </h2>
          <div className="mt-5 space-y-3">
            {GUNS.map((g) => (
              <ComboCard key={g} gun={g} pick={current.combo[g]} />
            ))}
          </div>
          <CustomBasisNote refs={customRefs} topTier={topTier} />
        </section>
      )}

      {/* 한 등급 상승 비교 (고2·고3·N수) */}
      {branch === "simulation" && gradeUp != null && (
        <div className="mt-12">
          <GradeUpComparison current={current.combo} gradeUp={gradeUp.combo} />
        </div>
      )}

      {/* 1:1 전략 컨설팅 CTA — 지원권 조합을 본 학생용 (위 분기와 중복되지 않는다) */}
      {!scoreless && !(branch === "target" && target != null) && (
        <div className="mt-12">
          <StrategyConsultCta />
        </div>
      )}

      {/* 희망 대학을 고른 학생에게도 현재 조합을 참고로 보여준다 */}
      {branch === "target" && target != null && !scoreless && (
        <section aria-label="현재 성적 기준 참고 조합" className="mt-12">
          <h2 className="text-[18px] font-bold leading-snug text-white">
            지금 성적 기준으로 보이는 조합
          </h2>
          <p className="mt-1.5 text-[13px] text-white/50">
            목표와 별개로, 현재 위치를 가늠하는 참고 조합이에요.
          </p>
          <div className="mt-4 space-y-3">
            {GUNS.map((g) =>
              current.combo[g] ? (
                <div
                  key={g}
                  className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3"
                >
                  <p className="min-w-0 text-[14px] text-white/80">
                    <span className="mr-2 font-mono text-[12px] text-accent">
                      {g}군
                    </span>
                    {current.combo[g]!.entry.university}
                    <span className="ml-1.5 text-[12px] text-white/45">
                      {current.combo[g]!.entry.campus ?? ""}
                    </span>
                  </p>
                  <TierBadge tier={current.combo[g]!.tier} />
                </div>
              ) : null,
            )}
          </div>
          <CustomBasisNote refs={customRefs} topTier={topTier} />
        </section>
      )}

      {/* 윈터스쿨 전환 */}
      <div className="mt-12">
        <WinterConversion />
      </div>

      {/* 다시 진단 */}
      <button
        type="button"
        onClick={() => {
          trackDiagnosis("diagnosis_restart");
          onRestart();
        }}
        className="mt-8 block min-h-[44px] w-full rounded-xl border border-white/12 px-5 py-3.5 text-center text-[14px] text-white/55 transition-colors hover:border-white/30 hover:text-white/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        처음부터 다시 진단하기
      </button>

      {/* 유의사항 */}
      <div className="mt-10 space-y-2 border-t border-white/10 pt-5">
        <p className="text-[11px] leading-relaxed text-white/35">
          본 결과는 수능 성적과 공개된 대학별 전형·입시결과를 기반으로 한 지원
          전략 참고 자료입니다. 실기 성적, 경쟁률, 실제 수능 난이도 등에 따라
          결과는 달라질 수 있습니다.
        </p>
        {FUTURE_ADMISSION_GRADES.includes(grade) && (
          <p className="text-[11px] leading-relaxed text-white/35">
            향후 입시를 준비하는 학생은 현재 공개된 최신 대학 전형 구조를
            기준으로 비교합니다. 실제 지원 연도의 모집요강은 변경될 수
            있습니다.
          </p>
        )}
      </div>
    </motion.div>
  );
}
