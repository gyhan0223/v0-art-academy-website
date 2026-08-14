"use client";

/**
 * 성적 입력 — 한 화면 안에서 국어 → 영어 → 탐구1 → 탐구2 → 수학 → 한국사가
 * 순서대로 펼쳐진다. 등급만 있어도 진행 가능하고, 표준점수·백분위는 선택 입력.
 * 숫자는 inputMode="numeric"으로 모바일 숫자 키패드를 바로 연다.
 * (iOS 확대 방지를 위해 입력 글자 크기는 16px 이상으로 유지)
 */

import { motion } from "framer-motion";
import {
  MATH_SUBJECTS,
  type DetailedStudentScore,
  type MathSubject,
  type ScoreValue,
} from "@/lib/diagnosis/types";
import { effectiveGrade } from "@/lib/diagnosis/grade-up-simulation";
import { PrimaryButton, StepLayout, useFadeProps } from "./step-ui";

const GRADES = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function parseNum(v: string): number | null {
  const t = v.trim();
  if (t === "") return null;
  const n = Number(t);
  return Number.isNaN(n) ? null : n;
}

/** 1~9 등급 선택 — 팝업·휠 없이 바로 누른다 */
function GradeSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | null;
  onChange: (g: number) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 block text-[13px] text-white/50">{label}</legend>
      <div className="grid grid-cols-5 gap-1.5">
        {GRADES.map((g) => (
          <button
            key={g}
            type="button"
            aria-pressed={value === g}
            onClick={() => onChange(g)}
            className={`min-h-[44px] rounded-lg border text-base font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
              value === g
                ? "border-accent bg-accent/15 text-accent"
                : "border-white/12 bg-white/[0.03] text-white/75 hover:border-white/30"
            }`}
          >
            {g}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

/** 숫자 직접 입력 — 잘못된 값은 입력 즉시 부드럽게 안내 */
function NumInput({
  id,
  label,
  value,
  onChange,
  min,
  max,
  placeholder,
  optional = true,
}: {
  id: string;
  label: string;
  value: number | null;
  onChange: (v: number | null) => void;
  min: number;
  max: number;
  placeholder?: string;
  optional?: boolean;
}) {
  const invalid = value != null && (value < min || value > max);
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[13px] text-white/50">
        {label}
        {optional && <span className="ml-1 text-white/30">선택 입력</span>}
      </label>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder={placeholder}
        value={value == null ? "" : String(value)}
        onChange={(e) => {
          const raw = e.target.value.replace(/[^\d]/g, "");
          onChange(raw === "" ? null : parseNum(raw));
        }}
        aria-invalid={invalid}
        className={`w-full rounded-lg border bg-white/[0.03] px-4 py-3 text-base text-white placeholder:text-white/25 focus:outline-none ${
          invalid
            ? "border-red-400/60"
            : "border-white/12 focus:border-accent/60"
        }`}
      />
      {invalid && (
        <p className="mt-1.5 text-[13px] text-red-300/90">
          {min}~{max} 사이 값으로 입력해주세요.
        </p>
      )}
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const fade = useFadeProps();
  return (
    <motion.section
      {...fade}
      className="rounded-xl border border-white/10 bg-white/[0.02] p-5"
      aria-label={title}
    >
      <h2 className="mb-4 text-base font-bold text-white">{title}</h2>
      <div className="space-y-4">{children}</div>
    </motion.section>
  );
}

function NotTakenToggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 text-[14px] text-white/55">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-[color:var(--accent)]"
      />
      {label}
    </label>
  );
}

/** 상대평가 과목 공용 입력(등급 + 표준점수·백분위 선택 입력) */
function RelativeSubjectInputs({
  idPrefix,
  value,
  onChange,
}: {
  idPrefix: string;
  value: ScoreValue;
  onChange: (v: Partial<ScoreValue>) => void;
}) {
  return (
    <>
      <GradeSelect
        label="등급"
        value={value.grade}
        onChange={(g) => onChange({ grade: g })}
      />
      <div className="grid grid-cols-2 gap-3">
        <NumInput
          id={`${idPrefix}-std`}
          label="표준점수"
          value={value.standardScore}
          onChange={(v) => onChange({ standardScore: v })}
          min={0}
          max={200}
          placeholder="예: 128"
        />
        <NumInput
          id={`${idPrefix}-pct`}
          label="백분위"
          value={value.percentile}
          onChange={(v) => onChange({ percentile: v })}
          min={0}
          max={100}
          placeholder="0~100"
        />
      </div>
    </>
  );
}

type SectionKey =
  | "korean"
  | "english"
  | "inquiry1"
  | "inquiry2"
  | "math"
  | "koreanHistory";

function sectionDone(d: DetailedStudentScore, key: SectionKey): boolean {
  switch (key) {
    case "korean":
      return effectiveGrade(d.korean) != null;
    case "english":
      return d.english.grade != null;
    case "inquiry1":
      return d.inquiry1.notTaken || effectiveGrade(d.inquiry1) != null;
    case "inquiry2":
      // 탐구1을 미응시하면 탐구2 칸 자체가 없다
      return (
        d.inquiry1.notTaken ||
        d.inquiry2.notTaken ||
        effectiveGrade(d.inquiry2) != null
      );
    case "math":
      return d.math.notTaken || effectiveGrade(d.math) != null;
    case "koreanHistory":
      return true; // 선택 입력
  }
}

const SECTION_ORDER: SectionKey[] = [
  "korean",
  "english",
  "inquiry1",
  "inquiry2",
  "math",
  "koreanHistory",
];

export default function ScoreStep({
  value,
  onChange,
  onNext,
  onSkip,
  onBack,
}: {
  value: DetailedStudentScore;
  onChange: (v: DetailedStudentScore) => void;
  onNext: () => void;
  /** 모의고사 성적이 아직 없는 학생(중3 등)의 탈출구 */
  onSkip: () => void;
  onBack: () => void;
}) {
  // i번째 섹션은 앞 섹션이 모두 채워졌을 때 나타난다 (한 번 채우면 계속 보임)
  const firstIncomplete = SECTION_ORDER.findIndex((k) => !sectionDone(value, k));
  const visibleCount =
    firstIncomplete === -1 ? SECTION_ORDER.length : firstIncomplete + 1;
  const visible = SECTION_ORDER.slice(0, visibleCount);

  const allRequiredDone = SECTION_ORDER.slice(0, 5).every((k) =>
    sectionDone(value, k),
  );

  const patch = (p: Partial<DetailedStudentScore>) =>
    onChange({ ...value, ...p });

  return (
    <StepLayout
      title="최근 성적을 알려주세요"
      sub={
        <>
          최근 성적표를 그대로 옮겨주세요.
          <br />
          표준점수·백분위가 있다면 같이 입력할수록 대학별 환산이 더 정확해져요.
          모르면 등급만으로도 진행할 수 있어요.
        </>
      }
      onBack={onBack}
    >
      <div className="space-y-4">
        {visible.includes("korean") && (
          <SectionCard title="국어">
            <RelativeSubjectInputs
              idPrefix="korean"
              value={value.korean}
              onChange={(p) => patch({ korean: { ...value.korean, ...p } })}
            />
          </SectionCard>
        )}

        {visible.includes("english") && (
          <SectionCard title="영어">
            <GradeSelect
              label="등급"
              value={value.english.grade}
              onChange={(g) => patch({ english: { grade: g } })}
            />
          </SectionCard>
        )}

        {visible.includes("inquiry1") && (
          <SectionCard title="탐구 1">
            <div>
              <label
                htmlFor="inquiry1-subject"
                className="mb-2 block text-[13px] text-white/50"
              >
                과목명<span className="ml-1 text-white/30">선택 입력</span>
              </label>
              <input
                id="inquiry1-subject"
                type="text"
                autoComplete="off"
                placeholder="예: 생활과윤리"
                value={value.inquiry1.subject}
                disabled={value.inquiry1.notTaken}
                onChange={(e) =>
                  patch({
                    inquiry1: { ...value.inquiry1, subject: e.target.value },
                  })
                }
                className="w-full rounded-lg border border-white/12 bg-white/[0.03] px-4 py-3 text-base text-white placeholder:text-white/25 focus:border-accent/60 focus:outline-none disabled:opacity-40"
              />
            </div>
            {!value.inquiry1.notTaken && (
              <RelativeSubjectInputs
                idPrefix="inquiry1"
                value={value.inquiry1}
                onChange={(p) =>
                  patch({ inquiry1: { ...value.inquiry1, ...p } })
                }
              />
            )}
            <NotTakenToggle
              checked={value.inquiry1.notTaken}
              onChange={(v) =>
                patch({ inquiry1: { ...value.inquiry1, notTaken: v } })
              }
              label="탐구를 아직 응시하지 않았어요"
            />
          </SectionCard>
        )}

        {visible.includes("inquiry2") && !value.inquiry1.notTaken && (
          <SectionCard title="탐구 2">
            <div>
              <label
                htmlFor="inquiry2-subject"
                className="mb-2 block text-[13px] text-white/50"
              >
                과목명<span className="ml-1 text-white/30">선택 입력</span>
              </label>
              <input
                id="inquiry2-subject"
                type="text"
                autoComplete="off"
                placeholder="예: 사회문화"
                value={value.inquiry2.subject}
                disabled={value.inquiry2.notTaken}
                onChange={(e) =>
                  patch({
                    inquiry2: { ...value.inquiry2, subject: e.target.value },
                  })
                }
                className="w-full rounded-lg border border-white/12 bg-white/[0.03] px-4 py-3 text-base text-white placeholder:text-white/25 focus:border-accent/60 focus:outline-none disabled:opacity-40"
              />
            </div>
            {!value.inquiry2.notTaken && (
              <RelativeSubjectInputs
                idPrefix="inquiry2"
                value={value.inquiry2}
                onChange={(p) =>
                  patch({ inquiry2: { ...value.inquiry2, ...p } })
                }
              />
            )}
            <NotTakenToggle
              checked={value.inquiry2.notTaken}
              onChange={(v) =>
                patch({ inquiry2: { ...value.inquiry2, notTaken: v } })
              }
              label="탐구는 한 과목만 응시했어요"
            />
          </SectionCard>
        )}

        {visible.includes("math") && (
          <SectionCard title="수학">
            {!value.math.notTaken && (
              <>
                <div>
                  <span className="mb-2 block text-[13px] text-white/50">
                    선택과목
                    <span className="ml-1 text-white/30">선택 입력</span>
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {MATH_SUBJECTS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        aria-pressed={value.math.subject === s}
                        onClick={() =>
                          patch({
                            math: {
                              ...value.math,
                              subject:
                                value.math.subject === s ? null : (s as MathSubject),
                            },
                          })
                        }
                        className={`min-h-[44px] rounded-lg border text-[14px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                          value.math.subject === s
                            ? "border-accent bg-accent/15 text-accent"
                            : "border-white/12 bg-white/[0.03] text-white/70 hover:border-white/30"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <RelativeSubjectInputs
                  idPrefix="math"
                  value={value.math}
                  onChange={(p) => patch({ math: { ...value.math, ...p } })}
                />
              </>
            )}
            <NotTakenToggle
              checked={value.math.notTaken}
              onChange={(v) => patch({ math: { ...value.math, notTaken: v } })}
              label="수학은 응시하지 않았어요 (미대 정시는 수학 없이도 가능한 곳이 많아요)"
            />
          </SectionCard>
        )}

        {visible.includes("koreanHistory") && (
          <SectionCard title="한국사">
            <GradeSelect
              label="등급 — 입력하지 않아도 돼요"
              value={value.koreanHistory.grade}
              onChange={(g) => patch({ koreanHistory: { grade: g } })}
            />
          </SectionCard>
        )}
      </div>

      {allRequiredDone && (
        <div className="mt-8">
          <PrimaryButton onClick={onNext}>입력 완료</PrimaryButton>
        </div>
      )}

      {/* 모의고사를 아직 안 본 학생(중3 등)이 여기서 막히지 않게 하는 탈출구 */}
      {!allRequiredDone && (
        <button
          type="button"
          onClick={onSkip}
          className="mt-6 block min-h-[44px] w-full rounded-xl border border-white/12 px-5 py-3.5 text-center text-[15px] text-white/60 transition-colors hover:border-white/30 hover:text-white/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          아직 모의고사 성적이 없어요
        </button>
      )}
    </StepLayout>
  );
}
