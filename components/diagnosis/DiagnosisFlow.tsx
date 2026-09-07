"use client";

/**
 * /diagnosis 온보딩 플로우 오케스트레이터.
 *
 * 시작 → 학년 → 성별 → 실기 → 성적 → 확인 → (고1·중3 이하: 희망 대학)
 * → 분석 → 결과. 뒤로 가도 입력값은 유지된다(React state — 새로고침 시 초기화).
 * V1에서는 성적을 서버·저장소에 보내지 않는다.
 *
 * /guide/jungsi-2027 원서 트레이에서 ?pick=으로 담아 온 가·나·다 조합(initialPlan)은
 * 다시 고르게 하지 않는다 — 시작 화면·확인 화면에서 작게 보여주고, 결과에서
 * 그 조합을 먼저 점검한다.
 */

import { useCallback, useEffect, useReducer, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  createEmptyScore,
  resultBranchOf,
  scoreDetailLevel,
  type DetailedStudentScore,
  type DiagnosisGender,
  type DiagnosisGrade,
  type DiagnosisSilgi,
} from "@/lib/diagnosis/types";
import { trackDiagnosis } from "@/lib/diagnosis/analytics";
import type { DiagnosisEntrySource } from "@/lib/diagnosis/entry-params";
import type { JungsiEntry } from "@/lib/jungsi-data";
import { hasAnyScore } from "@/lib/diagnosis/score-engine";
import DiagnosisProgress from "./DiagnosisProgress";
import GradeStep from "./GradeStep";
import GenderStep from "./GenderStep";
import SilgiStep from "./SilgiStep";
import ScoreStep from "./ScoreStep";
import ConfirmStep from "./ConfirmStep";
import TargetUniversityStep from "./TargetUniversityStep";
import AnalysisStep from "./AnalysisStep";
import DiagnosisResult from "./DiagnosisResult";
import { PrimaryButton, useFadeProps } from "./step-ui";

type Step =
  | "intro"
  | "grade"
  | "gender"
  | "silgi"
  | "score"
  | "confirm"
  | "target"
  | "analysis"
  | "result";

type FlowState = {
  step: Step;
  grade: DiagnosisGrade | null;
  gender: DiagnosisGender | null;
  /** 준비 중인 실기 — 복수 선택 */
  silgi: DiagnosisSilgi[];
  score: DetailedStudentScore;
  target: string | null;
  /** 정시 가이드에서 담아 온 가·나·다 조합(검증된 entry). 다시 진단하면 비운다 */
  plan: JungsiEntry[];
  /** 확인 화면에서 수정하러 갔다가 돌아오는 중인지 */
  returnToConfirm: boolean;
};

type Action =
  | { type: "GOTO"; step: Step }
  | { type: "SET_GRADE"; value: DiagnosisGrade }
  | { type: "SET_GENDER"; value: DiagnosisGender }
  | { type: "SET_SILGI"; value: DiagnosisSilgi[] }
  | { type: "SET_SCORE"; value: DetailedStudentScore }
  | { type: "SET_TARGET"; value: string | null }
  | { type: "EDIT_FROM_CONFIRM"; step: Step }
  | { type: "RESTART" };

function initialState(init: {
  target: string | null;
  plan: JungsiEntry[];
}): FlowState {
  return {
    step: "intro",
    grade: null,
    gender: null,
    silgi: [],
    score: createEmptyScore(),
    target: init.target,
    plan: init.plan,
    returnToConfirm: false,
  };
}

function reducer(state: FlowState, action: Action): FlowState {
  switch (action.type) {
    case "GOTO":
      return { ...state, step: action.step, returnToConfirm: false };
    case "SET_GRADE":
      return { ...state, grade: action.value };
    case "SET_GENDER":
      return { ...state, gender: action.value };
    case "SET_SILGI":
      return { ...state, silgi: action.value };
    case "SET_SCORE":
      return { ...state, score: action.value };
    case "SET_TARGET":
      return { ...state, target: action.value };
    case "EDIT_FROM_CONFIRM":
      return { ...state, step: action.step, returnToConfirm: true };
    case "RESTART":
      // 처음부터 다시 = 일반 진단으로 초기화 (query target·pick 조합도 버린다)
      return { ...initialState({ target: null, plan: [] }), step: "grade" };
  }
}

/** 진행 바에 잡히는 단계 (분기에 따라 희망 대학 단계가 추가된다) */
function progressOf(state: FlowState): { current: number; total: number } {
  const hasTargetStep =
    state.grade != null && resultBranchOf(state.grade) === "target";
  const steps: Step[] = hasTargetStep
    ? ["grade", "gender", "silgi", "score", "confirm", "target"]
    : ["grade", "gender", "silgi", "score", "confirm"];
  const idx = steps.indexOf(state.step);
  return { current: idx === -1 ? 0 : idx + 1, total: steps.length };
}

/* -------------------------------- 시작 화면 ------------------------------- */

function IntroStep({
  target,
  plan,
  onStart,
}: {
  /** /guide/jungsi-2027 대학 카드에서 넘어온 canonical 대학명 (없으면 일반 진입) */
  target: string | null;
  /** /guide/jungsi-2027 원서 트레이에서 담아 온 가·나·다 조합 (없으면 빈 배열) */
  plan: JungsiEntry[];
  onStart: () => void;
}) {
  const fade = useFadeProps();
  const hasPlan = plan.length > 0;
  const planCount = plan.length === 3 ? "3장" : `${plan.length}장`;
  return (
    <motion.div
      {...fade}
      className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 pb-24 pt-10"
    >
      <p className="text-[13px] tracking-wider text-white/50">
        {hasPlan
          ? `선택한 가·나·다군 ${planCount}을 기준으로 점검합니다`
          : "서울 주요 미대 전형 데이터 기준"}
      </p>
      {hasPlan ? (
        <>
          <h1 className="mt-4 break-keep text-[28px] font-bold leading-snug text-white">
            고른 {planCount} 조합,
            <br />내 성적으로 현실적일까요?
          </h1>
          {/* 담아 온 조합 — 카드 없이 한 줄씩만. 여기서 다시 고르게 하지 않는다 */}
          <ul className="mt-5 space-y-1.5" aria-label="점검할 조합">
            {plan.map((e) => (
              <li key={e.id} className="flex items-baseline gap-3 text-[15px]">
                <span className="w-8 shrink-0 font-mono text-[13px] text-accent">
                  {e.gun}군
                </span>
                <span className="min-w-0 text-white/85">
                  {e.university}
                  {e.campus ? (
                    <span className="ml-1 text-[13px] text-white/50">{e.campus}</span>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-5 break-keep text-[15px] leading-relaxed text-white/65">
            현재 성적과 준비 중인 실기를 넣으면 이 조합을 함께 되짚어드려요.
          </p>
        </>
      ) : target != null ? (
        <>
          <h1 className="mt-4 break-keep text-[28px] font-bold leading-snug text-white">
            {target},
            <br />내 성적으로 가능할까요?
          </h1>
          <p className="mt-4 break-keep text-[15px] leading-relaxed text-white/65">
            현재 성적과 준비 중인 실기를 기준으로 {target}와 현재 지원권을
            함께 비교해드려요.
          </p>
        </>
      ) : (
        <>
          <h1 className="mt-4 text-[28px] font-bold leading-snug text-white">
            내 성적으로 갈 수 있는 미대,
            <br />
            지금 바로 확인해보세요.
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-white/65">
            현재 성적과 준비 중인 실기를 기준으로
            <br />
            지원 전략을 비교해드려요.
          </p>
        </>
      )}
      <div className="mt-10">
        <PrimaryButton onClick={onStart}>
          {hasPlan
            ? "무료로 이 조합 점검하기"
            : target != null
              ? `${target} 가능성 확인하기`
              : "무료로 진단하기"}
        </PrimaryButton>
        <p className="mt-3 text-center text-[13px] text-white/50">
          약 1분 · 회원가입 없음
        </p>
      </div>
    </motion.div>
  );
}

/* --------------------------------- 플로우 -------------------------------- */

export default function DiagnosisFlow({
  initialTarget = null,
  initialPlan = [],
  entrySource = null,
}: {
  /** query에서 검증된 canonical 대학명 — 있으면 첫 화면·결과를 개인화 */
  initialTarget?: string | null;
  /** query ?pick=에서 검증된 가·나·다 조합 — 있으면 첫 화면·결과에서 그 조합을 먼저 점검 */
  initialPlan?: JungsiEntry[];
  /** 검증된 유입 경로 (예: "jungsi") — 애널리틱스에만 쓴다 */
  entrySource?: DiagnosisEntrySource | null;
}) {
  const [state, dispatch] = useReducer(
    reducer,
    { target: initialTarget, plan: initialPlan },
    initialState,
  );
  const { step, grade, gender, silgi, score, target, plan } = state;

  // 조합을 들고 진단에 들어온 시점 — 한 번만 집계
  const planViewed = useRef(false);
  useEffect(() => {
    if (planViewed.current || initialPlan.length === 0) return;
    planViewed.current = true;
    trackDiagnosis("diagnosis_jungsi_plan_view", {
      entry_source: entrySource ?? undefined,
      plan_filled_count: initialPlan.length,
      plan_ids: initialPlan.map((e) => e.id).join(","),
      plan_universities: initialPlan.map((e) => e.university).join(","),
    });
  }, [initialPlan, entrySource]);

  const goto = useCallback((s: Step) => dispatch({ type: "GOTO", step: s }), []);

  /** 선택형 단계가 끝났을 때 — 수정 모드면 확인 화면으로 복귀 */
  const afterStep = (next: Step) => {
    if (state.returnToConfirm) goto("confirm");
    else goto(next);
  };

  const progress = progressOf(state);
  const branch = grade != null ? resultBranchOf(grade) : "simulation";

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background text-foreground">
      {/* 단순 상단 바 — 일반 사이트 크롬 없이 로고와 나가기만 */}
      <header className="flex items-center justify-between px-5 py-4">
        <Link
          href="/"
          className="text-[15px] font-black tracking-tight text-white"
          aria-label="모두다른고양이 홈으로"
        >
          모두다른고양이
        </Link>
        <Link
          href="/"
          className="rounded-md px-2 py-1.5 text-[14px] text-white/60 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          나가기
        </Link>
      </header>

      <DiagnosisProgress current={progress.current} total={progress.total} />

      <main className="flex flex-1 flex-col">
        <AnimatePresence mode="wait" initial={false}>
          {step === "intro" && (
            <IntroStep
              key="intro"
              target={initialTarget}
              plan={plan}
              onStart={() => {
                trackDiagnosis("diagnosis_start", {
                  entry_source: entrySource ?? undefined,
                  target_university: initialTarget ?? undefined,
                  plan_filled_count: plan.length > 0 ? plan.length : undefined,
                });
                goto("grade");
              }}
            />
          )}

          {step === "grade" && (
            <GradeStep
              key="grade"
              value={grade}
              onSelect={(v) => dispatch({ type: "SET_GRADE", value: v })}
              onNext={() => {
                trackDiagnosis("diagnosis_grade_complete", {
                  grade_group: state.grade ?? undefined,
                });
                afterStep("gender");
              }}
              onBack={() => goto("intro")}
            />
          )}

          {step === "gender" && (
            <GenderStep
              key="gender"
              value={gender}
              onSelect={(v) => dispatch({ type: "SET_GENDER", value: v })}
              onNext={() => {
                trackDiagnosis("diagnosis_gender_complete", {
                  gender: state.gender ?? undefined,
                });
                afterStep("silgi");
              }}
              onBack={() => goto("grade")}
            />
          )}

          {step === "silgi" && (
            <SilgiStep
              key="silgi"
              value={silgi}
              onChange={(v) => dispatch({ type: "SET_SILGI", value: v })}
              onNext={() => {
                trackDiagnosis("diagnosis_silgi_complete", {
                  silgi_type: state.silgi.join(",") || undefined,
                });
                afterStep("score");
              }}
              onBack={() => goto("gender")}
            />
          )}

          {step === "score" && (
            <ScoreStep
              key="score"
              value={score}
              onChange={(v) => dispatch({ type: "SET_SCORE", value: v })}
              onNext={() => {
                trackDiagnosis("diagnosis_score_complete", {
                  has_detailed_score: scoreDetailLevel(score) === "detailed",
                });
                goto("confirm");
              }}
              onSkip={() => {
                trackDiagnosis("diagnosis_score_complete", {
                  has_detailed_score: false,
                });
                goto("confirm");
              }}
              onBack={() => (state.returnToConfirm ? goto("confirm") : goto("silgi"))}
            />
          )}

          {step === "confirm" && grade != null && gender != null && silgi.length > 0 && (
            <ConfirmStep
              key="confirm"
              grade={grade}
              gender={gender}
              silgi={silgi}
              score={score}
              plan={plan}
              onEditProfile={() => dispatch({ type: "EDIT_FROM_CONFIRM", step: "grade" })}
              onEditSilgi={() => dispatch({ type: "EDIT_FROM_CONFIRM", step: "silgi" })}
              onEditScore={() => dispatch({ type: "EDIT_FROM_CONFIRM", step: "score" })}
              onNext={() => {
                if (branch === "target") {
                  goto("target");
                } else {
                  trackDiagnosis("diagnosis_analysis_start", {
                    result_branch: branch,
                  });
                  goto("analysis");
                }
              }}
              onBack={() => goto("score")}
            />
          )}

          {step === "target" && gender != null && (
            <TargetUniversityStep
              key="target"
              gender={gender}
              value={target}
              onSelect={(u) => {
                dispatch({ type: "SET_TARGET", value: u });
                trackDiagnosis("diagnosis_target_university_complete", {
                  result_branch: "target",
                });
                trackDiagnosis("diagnosis_analysis_start", {
                  result_branch: "target",
                });
                goto("analysis");
              }}
              onSkip={() => {
                dispatch({ type: "SET_TARGET", value: null });
                trackDiagnosis("diagnosis_analysis_start", {
                  result_branch: "target",
                });
                goto("analysis");
              }}
              onBack={() => goto("confirm")}
            />
          )}

          {step === "analysis" && (
            <AnalysisStep
              key="analysis"
              scoreless={!hasAnyScore(score)}
              onDone={() => goto("result")}
            />
          )}

          {step === "result" && grade != null && gender != null && silgi.length > 0 && (
            <DiagnosisResult
              key="result"
              grade={grade}
              gender={gender}
              silgi={silgi}
              score={score}
              target={target}
              plan={plan}
              entrySource={entrySource}
              onRestart={() => dispatch({ type: "RESTART" })}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
