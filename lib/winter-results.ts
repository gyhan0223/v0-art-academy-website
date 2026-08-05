/**
 * 윈터스쿨 성적 향상 사례 데이터 단일 소스.
 * /winter/results 페이지가 이 파일만 참조한다.
 *
 * 학원 전체 사례(lib/grade-cases.ts)와 다른 점 —
 * 여기는 오직 "1주차 진단고사 → 8주차 재측정" 한 가지 비교만 다룬다.
 * 8주 안에 무엇이 바뀌었는지가 질문이므로, 그 외 비교는 넣지 않는다.
 *
 * ── 반드시 지킬 것 ──────────────────────────────────────────
 * · 분모를 숨기지 않는다. 오른 학생만 세지 말고 8주를 마친 전원을
 *   COHORT.total에 넣는다. 숫자가 기대에 못 미쳐도 그대로 쓴다.
 * · 과목은 국어·영어·탐구만. 미대가 반영하지 않는 수학은 타입에서 막았다.
 * · 이름은 이니셜, 학교는 지역만. 서면 동의 없는 사례(consent: false)는
 *   코드에서 자동으로 걸러져 화면에 나가지 않는다.
 * ─────────────────────────────────────────────────────────────
 */

import { SUBJECTS, type Subject } from "@/lib/grade-cases";

export type { Subject };

/** 화면 표기 순서 — 국어 → 영어 → 탐구 고정 */
export const SUBJECT_ORDER: Subject[] = SUBJECTS;

/* ------------------------------- 공개 스위치 ------------------------------- */

/**
 * 아직 자리표시자(샘플) 상태인지 여부.
 * true  — 페이지 상단에 "샘플" 안내 표시 · noindex · 사이트맵 제외
 * false — 실제 집계 결과로 정식 공개
 */
export const IS_PLACEHOLDER = false;

/* ------------------------------- 집계(분모) ------------------------------- */

export interface WinterCohort {
  /** 기수 — 예: "2027 윈터스쿨" */
  term: string;
  /** 분모: 8주 전 과정을 마친 인원 전원 */
  total: number;
  /** 그중 8주차 재측정에 응시한 인원 */
  measured: number;
  /** 상승 판정 기준을 넘긴 인원 */
  improved: number;
  /** 상승 판정 기준 — 최상단 문장에 그대로 들어간다 */
  criterion: string;
  /** 무엇과 무엇을 비교했는지 */
  basis: string;
  /** 제외 인원과 사유 — 숨기지 않는다 */
  excluded?: string;
}

// 2026 윈터스쿨 집계 — 여 12명 · 남 3명, 중도 퇴소 없음, 전원 재측정 응시.
export const WINTER_COHORT: WinterCohort = {
  term: "2026 윈터스쿨",
  total: 15,
  measured: 15,
  improved: 13,
  criterion: "국어·영어·탐구 중 1과목 이상 1등급 상승",
  basis: "1주차 진단고사 → 8주차 재측정 (평가원 기출 동일 난이도 기준)",
  excluded: "중도 퇴소 없음 (전원 8주 수료 · 전원 재측정 응시)",
};

/* --------------------------------- 사례 --------------------------------- */

/** 한 과목의 진단 → 재측정 변화. 등급은 1(최상)~9 사이 정수. */
export interface SubjectResult {
  subject: Subject;
  /** 1주차 진단고사 등급 */
  diagnostic: number;
  /** 8주차 재측정 등급 */
  retest: number;
}

export interface WinterResultCase {
  /** 고유 키 — 예: "2027-kim-01" */
  id: string;
  /** 표기명 — 반드시 이니셜 */
  name: string;
  /** 학년 — 예: "예비 고3" */
  grade: string;
  /** 학교 — 실명 금지, 지역만 */
  school?: string;
  /** 국어·영어·탐구 세 과목. 응시하지 않은 과목은 빼고 넣는다. */
  results: SubjectResult[];
  /** 한마디 — 없으면 비워 둔다 */
  quote?: string;
  /** 학생·학부모 서면 동의 여부. false면 화면에 나가지 않는다. */
  consent: boolean;
  /** 상단에 먼저 노출할 대표 사례 */
  featured?: boolean;
}

// 2026 윈터스쿨 15명 중 서면 동의를 받아 공개하는 3건.
export const WINTER_RESULT_CASES: WinterResultCase[] = [
  {
    id: "2026-choi-01",
    name: "최○○",
    grade: "예비 고3",
    results: [
      { subject: "국어", diagnostic: 5, retest: 4 },
      { subject: "영어", diagnostic: 4, retest: 2 },
      { subject: "탐구", diagnostic: 5, retest: 2 },
    ],
    consent: true,
    featured: true,
  },
  {
    id: "2026-hwang-02",
    name: "황○○",
    grade: "예비 고3",
    results: [
      { subject: "국어", diagnostic: 2, retest: 2 },
      { subject: "영어", diagnostic: 2, retest: 2 },
      { subject: "탐구", diagnostic: 5, retest: 2 },
    ],
    consent: true,
  },
  {
    id: "2026-yun-03",
    name: "윤○○",
    grade: "예비 고2",
    results: [
      { subject: "국어", diagnostic: 6, retest: 3 },
      { subject: "영어", diagnostic: 5, retest: 4 },
      { subject: "탐구", diagnostic: 6, retest: 3 },
    ],
    consent: true,
  },
];

/* --------------------------------- 파생값 -------------------------------- */

/** 서면 동의를 받은 사례만. 화면에 나가는 것은 항상 이 결과만 쓴다. */
export function getPublishableResults(
  cases: WinterResultCase[] = WINTER_RESULT_CASES,
): WinterResultCase[] {
  return cases
    .filter((c) => c.consent)
    .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
}

/** 등급이 몇 칸 올랐는지. 등급은 숫자가 작아질수록 좋으므로 뺄셈 방향에 주의. */
export function getGain(result: SubjectResult): number {
  return result.diagnostic - result.retest;
}

/** 그 학생이 가장 크게 올린 과목 */
export function getBestResult(item: WinterResultCase): SubjectResult | null {
  if (item.results.length === 0) return null;
  return item.results.reduce((best, r) => (getGain(r) > getGain(best) ? r : best));
}

export interface WinterCohortSummary {
  /** 상승 판정 기준을 넘긴 비율 (%) — 소수 첫째 자리, .0이면 정수 */
  rate: string;
  /** 집계 수치가 유효한지 — 분모가 0이거나 앞뒤가 맞지 않으면 false */
  isValid: boolean;
}

/** 집계 문장에 쓸 비율을 계산한다. 분모는 재측정 응시 인원(measured). */
export function getWinterCohortSummary(
  cohort: WinterCohort = WINTER_COHORT,
): WinterCohortSummary {
  const { total, measured, improved } = cohort;
  const isValid =
    total > 0 &&
    measured > 0 &&
    measured <= total &&
    improved >= 0 &&
    improved <= measured;
  if (!isValid) return { rate: "—", isValid: false };

  const pct = Math.round((improved / measured) * 1000) / 10;
  return {
    rate: `${pct % 1 === 0 ? pct.toFixed(0) : pct.toFixed(1)}%`,
    isValid,
  };
}
