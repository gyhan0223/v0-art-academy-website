/**
 * 대학별 점수 규칙(Score Spec) V2 — 데이터 구조.
 *
 * 목표: 대학마다 "어느 지표(표준점수/백분위/등급환산)를 쓰는지"를 코드가 아니라
 * 데이터로 명시할 수 있게 한다. 2027 최종 모집요강이 나오면 여기의 spec만
 * 교체하면 되고, 엔진(score-engine.ts)은 손대지 않는다.
 *
 * ⚠️ 검증되지 않은 점수식을 만들어내지 않는다.
 * 현재 저장소 데이터는 2026 모집요강 기준 반영비율과 2026 입시결과 합격선까지만
 * 검증돼 있고, 대학별 공식 환산(표준점수 총점·영어 등급표 원본 등)은 검증된
 * 원본이 없다. 따라서 SCORE_SPECS는 아직 비어 있으며, 모든 대학이 기존
 * 백분위 근사 엔진(lib/jungsi-recommend.ts convertScore)으로 fallback 한다.
 * 확인된 대학부터 아래 형식으로 추가하면 엔진이 자동으로 V2 계산을 쓴다.
 */

import type { DetailedStudentScore } from "./types";

export const DIAGNOSIS_DATA_VERSION = {
  dataVersion: "2026-08",
  /** 반영비율·모집군의 근거 연도 (2026학년도 요강 대조 결과) */
  sourceYear: 2026,
  lastVerifiedAt: "2026-08",
} as const;

export type ScoreMetric =
  | "standardScore" // 표준점수 합산
  | "percentile" // 백분위 합산
  | "gradeConversion" // 등급 → 자체 환산점수
  | "convertedStandardScore" // 변환표준점수
  | "custom";

export type SourceStatus =
  | "final-guide" // 2027 최종 모집요강으로 확인
  | "admission-plan" // 2027 전형계획(시행계획)으로 확인
  | "previous-year" // 직전연도(2026) 방식 참고
  | "estimate"; // 백분위 근사 등 어림 계산

export type UniversityScoreSpec = {
  entryId: string;
  sourceYear: number;
  sourceStatus: SourceStatus;
  korean?: { metric: ScoreMetric; weight?: number };
  math?: { metric: ScoreMetric; weight?: number; required?: boolean };
  inquiry?: {
    metric: ScoreMetric;
    count: 1 | 2;
    aggregation: "best1" | "sum" | "average";
    weight?: number;
  };
  english?: {
    type: "gradeTable" | "penalty" | "none";
    /** 등급 → 점수(또는 감점). 요강 원본 표를 그대로 옮긴다. */
    table?: Record<number, number>;
  };
  koreanHistory?: {
    type: "gradeTable" | "penalty" | "eligibility" | "none";
    table?: Record<number, number>;
  };
  /** 환산 만점 — 대학 원점수 그대로 보여줄 때 필요 */
  totalMax?: number;
};

/**
 * 검증된 공식이 확인된 대학만 추가한다.
 * (예시)
 * "kookmin-ga": {
 *   entryId: "kookmin-ga",
 *   sourceYear: 2027,
 *   sourceStatus: "final-guide",
 *   korean: { metric: "percentile", weight: 33.33 },
 *   ...
 * }
 */
export const SCORE_SPECS: Record<string, UniversityScoreSpec> = {};

export function getScoreSpec(entryId: string): UniversityScoreSpec | null {
  return SCORE_SPECS[entryId] ?? null;
}

/** 이 대학이 검증된 V2 공식으로 계산되는지 (아니면 백분위 근사 fallback) */
export function hasExactSpec(entryId: string): boolean {
  const spec = SCORE_SPECS[entryId];
  return (
    spec != null &&
    (spec.sourceStatus === "final-guide" || spec.sourceStatus === "admission-plan")
  );
}

/**
 * V2 계산기 — 백분위 지표 spec만 우선 지원한다.
 * 표준점수·변환표준점수 spec은 시험별 원자료(도수분포)가 필요해
 * 자료가 확보된 뒤 확장한다. 계산 불가면 null → 엔진이 fallback 한다.
 */
export function computeBySpec(
  spec: UniversityScoreSpec,
  d: DetailedStudentScore,
): number | null {
  let total = 0;
  let wsum = 0;

  const add = (value: number | null, weight?: number) => {
    if (value == null || weight == null || weight <= 0) return;
    total += value * weight;
    wsum += weight;
  };

  if (spec.korean) {
    if (spec.korean.metric !== "percentile") return null;
    add(d.korean.percentile, spec.korean.weight);
  }
  if (spec.math) {
    if (spec.math.metric !== "percentile") return null;
    if (spec.math.required && (d.math.notTaken || d.math.percentile == null)) {
      return null;
    }
    if (!d.math.notTaken) add(d.math.percentile, spec.math.weight);
  }
  if (spec.inquiry) {
    if (spec.inquiry.metric !== "percentile") return null;
    const taken = [d.inquiry1, d.inquiry2]
      .filter((q) => !q.notTaken && q.percentile != null)
      .map((q) => q.percentile as number)
      .sort((a, b) => b - a);
    if (taken.length > 0) {
      const v =
        spec.inquiry.aggregation === "best1"
          ? taken[0]
          : spec.inquiry.aggregation === "sum"
            ? taken.reduce((a, b) => a + b, 0) / taken.length // 정규화 위해 평균과 동일 처리
            : taken.reduce((a, b) => a + b, 0) / taken.length;
      add(v, spec.inquiry.weight);
    }
  }
  if (spec.english?.type === "gradeTable" && spec.english.table) {
    const g = d.english.grade;
    if (g != null && spec.english.table[g] != null) {
      // 등급표 점수는 만점 대비 백분율로 정규화돼 있다고 가정 — 원본 표를 넣을 때 주석으로 명시
      add(spec.english.table[g], 0);
    }
  }

  return wsum > 0 ? total / wsum : null;
}
