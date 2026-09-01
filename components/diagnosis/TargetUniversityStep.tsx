"use client";

/**
 * 고1·중3 이하 분기 — 가장 가고 싶은 대학 선택.
 * 성별 조건을 먼저 반영한 목록에서 검색해 고른다.
 * 목표 대학 없이도 진행 가능("아직 목표 대학이 없어요").
 */

import { useMemo, useState } from "react";
import { universityOptions } from "@/lib/diagnosis/score-engine";
import type { DiagnosisGender } from "@/lib/diagnosis/types";
import { StepLayout } from "./step-ui";

export default function TargetUniversityStep({
  gender,
  value,
  onSelect,
  onSkip,
  onBack,
}: {
  gender: DiagnosisGender;
  value: string | null;
  onSelect: (u: string) => void;
  onSkip: () => void;
  onBack: () => void;
}) {
  const [query, setQuery] = useState("");
  const options = useMemo(() => universityOptions(gender), [gender]);
  const filtered = useMemo(() => {
    const q = query.trim();
    if (q === "") return options;
    return options.filter((u) => u.includes(q));
  }, [options, query]);

  return (
    <StepLayout
      title="가장 가고 싶은 대학이 있나요?"
      sub="지금 성적과 얼마나 차이가 나는지 보여드릴게요."
      onBack={onBack}
    >
      <label htmlFor="target-univ-search" className="sr-only">
        대학 검색
      </label>
      <input
        id="target-univ-search"
        type="search"
        autoComplete="off"
        placeholder="대학 이름 검색 — 예: 국민"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-xl border border-white/12 bg-white/[0.03] px-4 py-3.5 text-base text-white placeholder:text-white/35 focus:border-accent/60 focus:outline-none"
      />

      <ul className="mt-4 max-h-[45vh] overflow-y-auto rounded-xl border border-white/10 bg-white/[0.02]">
        {filtered.length === 0 && (
          <li className="px-5 py-6 text-center text-[14px] text-white/55">
            검색 결과가 없어요. 다른 이름으로 찾아보세요.
          </li>
        )}
        {filtered.map((u) => (
          <li key={u} className="border-b border-white/8 last:border-b-0">
            <button
              type="button"
              aria-pressed={value === u}
              onClick={() => onSelect(u)}
              className={`block min-h-[52px] w-full px-5 py-3.5 text-left text-[15px] transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent ${
                value === u
                  ? "bg-accent/10 text-accent"
                  : "text-white/85 hover:bg-white/[0.04]"
              }`}
            >
              {u}
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onSkip}
        className="mt-5 block min-h-[44px] w-full rounded-xl border border-white/12 px-5 py-3.5 text-center text-[15px] text-white/60 transition-colors hover:border-white/30 hover:text-white/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        아직 목표 대학이 없어요
      </button>
    </StepLayout>
  );
}
