"use client";

/**
 * 진단 결과 화면.
 * - 고3·N수(FINAL_TRACK_GRADES): (target이 있으면 목표 대학 분석 먼저)
 *   → 현재 가·나·다 조합 → 한 등급 상승 비교 → 수능 파이널 집중반(/final) 카드
 * - 고2: 같은 흐름이되 마지막이 윈터스쿨 안내
 * - 고1·중3 이하: 희망 대학까지의 거리(정량화 가능할 때만) → 윈터스쿨 안내
 * target은 온보딩의 희망 대학 단계뿐 아니라 /guide/jungsi-2027 대학 카드
 * (?target=) 진입으로도 채워진다 — 사용자가 처음 던진 "이 대학 가능할까?"에
 * 결과 화면이 먼저 답하도록, target 분석을 모든 분기에서 최상단에 둔다.
 * 정시 가이드 원서 트레이에서 조합(?pick=)을 들고 온 학생에게는 "내가 고른
 * 가·나·다 조합" 점검(PlanCheck)을 그보다도 먼저 보여준다.
 *
 * 유료 1:1 컨설팅 CTA는 어느 학년에게도 보여주지 않는다 — 무료 진단 직후에
 * 유료 상품을 붙이면 진단 자체가 영업으로 읽힌다(2026-09-08 제거).
 * 다음 단계 카드는 학년당 정확히 하나만 렌더된다: 고3·N수는 파이널, 나머지는 윈터스쿨.
 */

import { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import type { Gun, JungsiEntry } from "@/lib/jungsi-data";
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
  isFinalTrack,
  resultBranchOf,
  scoreDetailLevel,
  type DetailedStudentScore,
  type DiagnosisGender,
  type DiagnosisGrade,
  type DiagnosisSilgi,
} from "@/lib/diagnosis/types";
import { trackDiagnosis } from "@/lib/diagnosis/analytics";
import { ComboCard, TierBadge } from "./ComboCards";
import PlanCheck from "./PlanCheck";
import FinalConversion from "./FinalConversion";
import GradeUpComparison from "./GradeUpComparison";
import WinterConversion from "./WinterConversion";
import { useFadeProps } from "./step-ui";

const GUNS: Gun[] = ["가", "나", "다"];

/* ------------------------------ 정확도 라벨 ------------------------------ */

function DetailLevelBadge({ score }: { score: DetailedStudentScore }) {
  const level = scoreDetailLevel(score);
  return (
    <span className="inline-block rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-[13px] text-white/65">
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
          <p className="text-[15px] leading-relaxed text-white/75">
            {university}는 최근 입시결과 공개 자료가 없어, 현재 데이터만으로
            정확한 등급 차이 산정이 어려워요.
          </p>
          {analysis.entries.length > 0 && (
            <p className="mt-3 text-sm leading-relaxed text-white/60">
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
        <p className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.07] p-4 text-[15px] leading-relaxed text-emerald-200/90">
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
          <div className="flex justify-between text-[13px] text-white/55">
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
                  <p className="text-[13px] text-white/65">
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
              <div className="mt-2.5 flex items-center gap-4 text-[15px]">
                <span className="text-white/70">
                  현재{" "}
                  <span className="font-bold text-white">
                    {s.currentGrade != null ? `${s.currentGrade}등급` : "—"}
                  </span>
                </span>
                <span aria-hidden className="text-white/25">
                  →
                </span>
                <span className="text-white/70">
                  목표권 <span className="font-bold text-accent">{target}</span>
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 text-[13px] leading-relaxed text-white/50">
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
          <p className="mt-2 text-sm leading-relaxed text-white/70">
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
        <p className="mt-3 text-[13px] leading-relaxed text-white/50">
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
  plan = [],
  entrySource = null,
  onRestart,
}: {
  grade: DiagnosisGrade;
  gender: DiagnosisGender;
  silgi: DiagnosisSilgi[];
  score: DetailedStudentScore;
  target: string | null;
  /** 정시 가이드 원서 트레이에서 담아 온 가·나·다 대학(검증된 entry) — 있으면 최상단에서 먼저 점검 */
  plan?: JungsiEntry[];
  /** 검증된 유입 경로 (예: "jungsi") — 애널리틱스에만 쓴다 */
  entrySource?: string | null;
  onRestart: () => void;
}) {
  const fade = useFadeProps();
  const branch = resultBranchOf(grade);
  // 고3·N수생 — 다음 단계는 수능 파이널 하나뿐. 컨설팅·윈터스쿨은 렌더하지 않는다.
  const finalTrack = isFinalTrack(grade);
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
      entry_source: entrySource ?? undefined,
      target_university: target ?? undefined,
      plan_filled_count: plan.length > 0 ? plan.length : undefined,
    });
  }, [grade, gender, silgi, score, branch, target, entrySource, plan]);

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
          <p className="mt-3 text-[15px] leading-relaxed text-white/70">
            지금 단계에서는 실기 유형과 목표 대학을 기준으로 준비 방향을 잡는
            것으로 충분해요. 첫 모의고사 성적이 나오면 다시 진단해보세요 —
            지원 가능한 대학 조합까지 보여드릴 수 있어요.
          </p>
        </section>
      )}

      {/* 내가 고른 가·나·다 조합 점검 — 원서 트레이(?pick=)로 들어온 학생이
          처음 던진 "이 조합 괜찮나?"에 다른 어떤 섹션보다 먼저 답한다 */}
      {plan.length > 0 && (
        <div className="mt-6">
          <PlanCheck plan={plan} score={score} gender={gender} silgi={silgi} />
        </div>
      )}

      {/* 희망 대학 거리 — 온보딩에서 골랐든 정시 가이드 카드(?target=)로
          들어왔든, target이 있으면 학년 분기와 무관하게 가장 먼저 답한다 */}
      {target != null && (
        <div className="mt-6">
          <TargetGapView score={score} university={target} filters={filters} />
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

      {/* 수능 파이널 집중반 카드 — 고3·N수생의 유일한 다음 단계.
          한 등급 상승 비교 바로 아래에 둔다(성적이 없으면 안내문 아래). */}
      {finalTrack && (
        <div className="mt-12">
          <FinalConversion
            hasGradeUp={gradeUp != null}
            entrySource={entrySource}
          />
        </div>
      )}

      {/* 희망 대학을 고른 학생에게도 현재 조합을 참고로 보여준다 */}
      {branch === "target" && target != null && !scoreless && (
        <section aria-label="현재 성적 기준 참고 조합" className="mt-12">
          <h2 className="text-[18px] font-bold leading-snug text-white">
            지금 성적 기준으로 보이는 조합
          </h2>
          <p className="mt-2 text-sm text-white/60">
            목표와 별개로, 현재 위치를 가늠하는 참고 조합이에요.
          </p>
          <div className="mt-4 space-y-3">
            {GUNS.map((g) =>
              current.combo[g] ? (
                <div
                  key={g}
                  className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3"
                >
                  <p className="min-w-0 text-[15px] text-white/85">
                    <span className="mr-2 font-mono text-[13px] text-accent">
                      {g}군
                    </span>
                    {current.combo[g]!.entry.university}
                    <span className="ml-1.5 text-[13px] text-white/55">
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

      {/* 윈터스쿨 전환 — 고3·N수생에게는 절대 보여주지 않는다 */}
      {!finalTrack && (
        <div className="mt-12">
          <WinterConversion />
        </div>
      )}

      {/* 다시 진단 */}
      <button
        type="button"
        onClick={() => {
          trackDiagnosis("diagnosis_restart");
          onRestart();
        }}
        className="mt-8 block min-h-[44px] w-full rounded-xl border border-white/12 px-5 py-3.5 text-center text-[14px] text-white/65 transition-colors hover:border-white/30 hover:text-white/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        처음부터 다시 진단하기
      </button>

      {/* 유의사항 */}
      <div className="mt-10 space-y-2 border-t border-white/10 pt-5">
        <p className="text-[12px] leading-relaxed text-white/45">
          본 결과는 수능 성적과 공개된 대학별 전형·입시결과를 기반으로 한 지원
          전략 참고 자료입니다. 실기 성적, 경쟁률, 실제 수능 난이도 등에 따라
          결과는 달라질 수 있습니다.
        </p>
        {FUTURE_ADMISSION_GRADES.includes(grade) && (
          <p className="text-[12px] leading-relaxed text-white/45">
            향후 입시를 준비하는 학생은 현재 공개된 최신 대학 전형 구조를
            기준으로 비교합니다. 실제 지원 연도의 모집요강은 변경될 수
            있습니다.
          </p>
        )}
      </div>
    </motion.div>
  );
}
