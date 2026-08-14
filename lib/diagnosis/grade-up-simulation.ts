/**
 * "국어·영어·탐구가 각각 한 등급 오르면?" 시뮬레이션.
 *
 * 한 등급 상승이 고정된 표준점수·백분위 상승을 뜻하지 않으므로,
 * 이 시뮬레이션은 '등급 구간을 한 단계 개선했을 때의 지원권 변화'로만 다룬다.
 * 시험별 실제 표준점수 컷 데이터가 없는 상태에서 정밀한 표준점수를
 * 만들어내지 않는다 — 표준점수는 시뮬레이션 결과에서 비운다(null).
 *
 * 근사 기준: 상대평가 9등급제 백분위 구간(스테나인)과 구간 대표 백분위.
 * 실제 등급 컷은 시험 난이도에 따라 달라지므로 참고용 근사치다.
 */

import type { DetailedStudentScore, ScoreValue } from "./types";

/** 상대평가 등급 구간(백분위 하한)과 구간 대표 백분위 */
export const GRADE_BANDS: { grade: number; min: number; rep: number }[] = [
  { grade: 1, min: 96, rep: 98 },
  { grade: 2, min: 89, rep: 93 },
  { grade: 3, min: 77, rep: 83 },
  { grade: 4, min: 60, rep: 69 },
  { grade: 5, min: 40, rep: 50 },
  { grade: 6, min: 23, rep: 31 },
  { grade: 7, min: 11, rep: 17 },
  { grade: 8, min: 4, rep: 7 },
  { grade: 9, min: 0, rep: 2 },
];

/** 백분위 → 등급 (상대평가 구간 기준 근사) */
export function gradeFromPercentile(p: number): number {
  const band = GRADE_BANDS.find((b) => p >= b.min);
  return band ? band.grade : 9;
}

/** 등급 → 구간 대표 백분위 (근사) */
export function repPercentileOfGrade(grade: number): number {
  const band = GRADE_BANDS.find((b) => b.grade === grade);
  return band ? band.rep : 50;
}

/** 성적표 값에서 실질 등급을 얻는다 — 등급 우선, 없으면 백분위로 근사 */
export function effectiveGrade(v: ScoreValue): number | null {
  if (v.grade != null) return v.grade;
  if (v.percentile != null) return gradeFromPercentile(v.percentile);
  return null;
}

/** 한 과목을 한 등급 개선한 값. 표준점수는 지어내지 않고 비운다. */
function oneGradeUp(v: ScoreValue): ScoreValue {
  const current = effectiveGrade(v);
  if (current == null) return { ...v };
  const upGrade = Math.max(1, current - 1);
  const target = repPercentileOfGrade(upGrade);
  return {
    grade: upGrade,
    standardScore: null,
    // 이미 대표 백분위보다 높으면 낮추지 않는다
    percentile: Math.max(v.percentile ?? 0, target),
  };
}

/**
 * 국어·영어·탐구를 각각 한 등급 개선한 시나리오.
 * 수학·한국사는 그대로 둔다 (윈터스쿨 커리큘럼 기준 과목만 개선).
 */
export function simulateOneGradeUp(
  d: DetailedStudentScore,
): DetailedStudentScore {
  return {
    ...d,
    korean: oneGradeUp(d.korean),
    english: {
      grade: d.english.grade == null ? null : Math.max(1, d.english.grade - 1),
    },
    inquiry1: d.inquiry1.notTaken
      ? { ...d.inquiry1 }
      : { ...d.inquiry1, ...oneGradeUp(d.inquiry1) },
    inquiry2: d.inquiry2.notTaken
      ? { ...d.inquiry2 }
      : { ...d.inquiry2, ...oneGradeUp(d.inquiry2) },
  };
}
