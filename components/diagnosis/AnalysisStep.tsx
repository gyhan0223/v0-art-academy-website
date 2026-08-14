"use client";

/**
 * 분석 로딩 — AI 연출이 아니라, 실제로 수행하는 계산 과정을
 * 순서대로 보여주는 로딩 화면. 계산은 즉시 끝나지만 화면이 번쩍 사라지지
 * 않도록 약 2초에 걸쳐 단계를 진행한다.
 */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useFadeProps } from "./step-ui";

const STAGES = [
  "성별에 맞는 지원 대학을 확인하고 있어요",
  "준비 중인 실기와 맞는 모집단위를 찾고 있어요",
  "대학별 수능 반영방식을 적용하고 있어요",
  "가·나·다군 조합을 비교하고 있어요",
];

// 성적 없이 진행한 경우 — 실제로 하지 않는 수능 환산·조합 비교를 말하지 않는다
const SCORELESS_STAGES = [
  "성별에 맞는 지원 대학을 확인하고 있어요",
  "준비 중인 실기와 맞는 모집단위를 찾고 있어요",
  "목표 기준 준비 방향을 정리하고 있어요",
];

const STAGE_MS = 520;

export default function AnalysisStep({
  onDone,
  scoreless = false,
}: {
  onDone: () => void;
  scoreless?: boolean;
}) {
  const STAGES_USED = scoreless ? SCORELESS_STAGES : STAGES;
  const [stage, setStage] = useState(0);
  const fade = useFadeProps();

  useEffect(() => {
    const timers: number[] = [];
    STAGES_USED.forEach((_, i) => {
      timers.push(window.setTimeout(() => setStage(i + 1), (i + 1) * STAGE_MS));
    });
    timers.push(
      window.setTimeout(onDone, STAGES_USED.length * STAGE_MS + 500),
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
    // onDone은 마운트 시점 값으로 충분하다 — 재실행하면 타이머가 꼬인다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      {...fade}
      className="mx-auto flex w-full max-w-md flex-col justify-center px-5 pb-28 pt-16"
      aria-live="polite"
    >
      <h1 className="text-[24px] font-bold leading-snug text-white">
        지원 가능한 대학을
        <br />
        분석하고 있어요
      </h1>
      <ul className="mt-10 space-y-5">
        {STAGES_USED.map((label, i) => {
          const done = stage > i;
          const active = stage === i;
          return (
            <li key={label} className="flex items-center gap-3">
              <span
                aria-hidden
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] transition-colors ${
                  done
                    ? "border-accent bg-accent text-black"
                    : active
                      ? "border-accent text-accent"
                      : "border-white/20 text-transparent"
                }`}
              >
                {done ? "✓" : active ? "●" : "○"}
              </span>
              <span
                className={`text-[15px] transition-colors ${
                  done
                    ? "text-white/80"
                    : active
                      ? "text-white"
                      : "text-white/35"
                }`}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}
