/**
 * 진단 페이지 점수 엔진.
 *
 * 계산 경로 두 갈래 —
 * 1) 검증된 대학별 spec(university-score-spec.ts)이 있으면 V2 계산.
 * 2) 없으면 기존 백분위 근사 엔진(lib/jungsi-recommend.ts)을 fallback으로 쓴다.
 *    fallback 결과는 '정확한 대학 환산점수'가 아니라 지원권 참고치다 —
 *    UI에서는 환산 숫자보다 안정/적정/도전/참고 표현을 중심에 둔다.
 *
 * 서로 다른 대학의 원점수를 직접 비교하지 않는다. 내부적으로
 * (a) 대학별 계산값 (b) 추천용 0~100 정규화 지수(converted)
 * (c) 입결 cutoff (d) 지원 tier 를 분리해서 다룬다.
 */

import { jungsiEntries, type Gun, type JungsiEntry } from "@/lib/jungsi-data";
import {
  convertScore,
  getCutoffInfo,
  getPrestige,
  isWomensUniv,
  rankByGun,
  type Ranked,
  type StudentScore,
} from "@/lib/jungsi-recommend";
import {
  effectiveGrade,
  gradeFromPercentile,
  repPercentileOfGrade,
} from "./grade-up-simulation";
import { isCompatibleSilgiAny } from "./silgi";
import { computeBySpec, getScoreSpec, hasExactSpec } from "./university-score-spec";
import type {
  DetailedStudentScore,
  DiagnosisGender,
  DiagnosisSilgi,
  ScoreValue,
} from "./types";

/* -------------------------------- 여대 판정 ------------------------------- */

// 여대 판정은 lib/jungsi-recommend.ts의 isWomensUniv(entry)를 그대로 쓴다.
export { isWomensUniv } from "@/lib/jungsi-recommend";

/* --------------------------- 상세 성적 → 백분위 투영 -------------------------- */

/** 백분위 우선, 없으면 등급 구간 대표 백분위로 근사 */
function toPercentile(v: ScoreValue): number | null {
  if (v.percentile != null) return v.percentile;
  if (v.grade != null) return repPercentileOfGrade(v.grade);
  return null;
}

/**
 * 상세 성적을 기존 fallback 엔진의 StudentScore(백분위 4칸)로 투영한다.
 * 탐구는 응시한 과목들의 백분위 평균 — 원본 두 과목은 DetailedStudentScore에
 * 그대로 남아 있으므로 데이터를 버리는 것이 아니다.
 */
export function toStudentScore(d: DetailedStudentScore): StudentScore {
  const inquiries = [d.inquiry1, d.inquiry2]
    .filter((q) => !q.notTaken)
    .map((q) => toPercentile(q))
    .filter((p): p is number => p != null);
  return {
    국어: toPercentile(d.korean),
    수학: d.math.notTaken ? null : toPercentile(d.math),
    영어: d.english.grade,
    탐구:
      inquiries.length > 0
        ? Math.round((inquiries.reduce((a, b) => a + b, 0) / inquiries.length) * 10) / 10
        : null,
  };
}

export function hasAnyScore(d: DetailedStudentScore): boolean {
  return (
    effectiveGrade(d.korean) != null ||
    d.english.grade != null ||
    effectiveGrade(d.inquiry1) != null
  );
}

/* ------------------------------- 진단 랭킹 계산 ------------------------------ */

export type DiagnosisFilters = {
  gender: DiagnosisGender;
  /** 준비 중인 실기(복수 선택) — 하나라도 맞으면 포함. 모름 포함 시 필터 없음 */
  silgi: DiagnosisSilgi[];
};

export type DiagnosisRankings = {
  ranked: Record<Gun, Ranked[]>;
  combo: Partial<Record<Gun, DiagnosisComboPick>>;
};

function passesFilters(entry: JungsiEntry, f: DiagnosisFilters): boolean {
  if (f.gender === "남학생" && isWomensUniv(entry)) return false;
  return isCompatibleSilgiAny(entry, f.silgi);
}

/**
 * entry 하나의 계산값. 검증 spec이 있으면 V2, 없으면 fallback.
 * 현재는 모든 대학이 fallback이며(SCORE_SPECS 비어 있음), spec이 채워지면
 * 자동으로 exact 경로를 탄다.
 */
export function convertDetailed(
  entryId: string,
  d: DetailedStudentScore,
): { value: number | null; exact: boolean; blocked?: string } {
  const spec = getScoreSpec(entryId);
  if (spec && hasExactSpec(entryId)) {
    const v = computeBySpec(spec, d);
    if (v != null) return { value: v, exact: true };
  }
  const { value, blocked } = convertScore(entryId, toStudentScore(d));
  return { value, exact: false, blocked };
}

/**
 * 가·나·다 각 1곳 조합 — lib/jungsi-recommend.ts recommendCombo와 같은 철학을
 * 진단 필터(성별·복수 실기)가 적용된 목록 위에서 수행한다.
 *
 * 원칙 — "안정적인 곳"이 아니라 "붙을 수 있는 곳 중 가장 가고 싶을 곳":
 * 1. 군마다 지원권(안정·적정, 또는 입결 비공개지만 환산이 압도적인 곳) 안에서
 *    입결 서열(벨류)이 가장 높은 대학을 고른다 — 환산 숫자는 반영식이 달라
 *    대학 간 직접 비교 지표로 쓰지 않는다.
 * 2. 세 군이 모두 지원권이면 벨류 상승폭이 가장 큰 군 하나를 도전 카드로
 *    상향한다(안정 2장 + 도전 1장 포트폴리오).
 */
const PSEUDO_SAFE_MIN = 97;

export type DiagnosisComboPick = Ranked & {
  /** 도전 카드로 상향된 픽 (입결 비공개 대학 포함) */
  stretch?: boolean;
};

function pickCombo(
  ranked: Record<Gun, Ranked[]>,
): Partial<Record<Gun, DiagnosisComboPick>> {
  const guns = ["가", "나", "다"] as Gun[];

  const byValue = (a: Ranked, b: Ranked) =>
    getPrestige(a.entry.university) - getPrestige(b.entry.university) ||
    (b.converted ?? 0) - (a.converted ?? 0);

  const isAnchor = (r: Ranked) =>
    r.tier === "안정" ||
    r.tier === "적정" ||
    (!r.tier && (r.converted ?? 0) >= PSEUDO_SAFE_MIN);

  const pools = guns.map((g) => {
    const cands = ranked[g].filter(
      (r) => r.converted != null && r.tier !== "낮음",
    );
    return {
      g,
      cands,
      safe: cands.filter(isAnchor).sort(byValue),
      stretch: cands.filter((r) => r.tier === "도전" || !r.tier).sort(byValue),
    };
  });

  const combo: Partial<Record<Gun, DiagnosisComboPick>> = {};
  const used = new Set<string>();
  const firstFree = (pool: Ranked[]) =>
    pool.find((r) => !used.has(r.entry.university));

  // 1차: 군마다 지원권 중 벨류 최상위 → 지원권이 없으면 정렬 순(적정·안정 우선)
  for (const p of pools) {
    const pick = firstFree(p.safe) ?? firstFree(p.cands) ?? p.cands[0];
    if (pick) {
      combo[p.g] = pick;
      used.add(pick.entry.university);
    }
  }

  // 2차: 세 군 모두 지원권이면 한 군을 도전 카드로 상향 (벨류 상승폭 최대인 군)
  const allSafe = pools.every((p) => {
    const pick = combo[p.g];
    return pick != null && isAnchor(pick);
  });
  if (allSafe) {
    let best: { g: Gun; cur: Ranked; ch: Ranked } | null = null;
    let bestGain = 0;
    for (const p of pools) {
      const cur = combo[p.g];
      if (!cur) continue;
      const ch = p.stretch.find(
        (r) =>
          !used.has(r.entry.university) ||
          r.entry.university === cur.entry.university,
      );
      if (!ch) continue;
      const gain =
        getPrestige(cur.entry.university) - getPrestige(ch.entry.university);
      if (gain > bestGain) {
        bestGain = gain;
        best = { g: p.g, cur, ch };
      }
    }
    if (best) {
      used.delete(best.cur.entry.university);
      combo[best.g] = { ...best.ch, stretch: true };
      used.add(best.ch.entry.university);
    }
  }

  return combo;
}

/** 성별·실기 조건을 반영한 군별 랭킹 + 가·나·다 추천 조합 */
export function diagnose(
  d: DetailedStudentScore,
  filters: DiagnosisFilters,
): DiagnosisRankings {
  const all = rankByGun(toStudentScore(d), null, {
    excludeWomens: filters.gender === "남학생",
  });
  const ranked: Record<Gun, Ranked[]> = { 가: [], 나: [], 다: [], 별도: [] };
  for (const g of Object.keys(all) as Gun[]) {
    ranked[g] = all[g].filter((r) => passesFilters(r.entry, filters));
  }
  return { ranked, combo: pickCombo(ranked) };
}

/* --------------------------- 자체 기준 전형 참고 --------------------------- */

/**
 * 서울대·삼육대(자체 환산)·한예종(별도 전형)은 기존 엔진이 계산 불가로
 * 분류해 조합 카드에 오르지 못한다. 수능 최상위권 학생에게 서울대가
 * '없는 학교'처럼 보이지 않도록, 계산에서 제외된 대학을 결과 화면에
 * 참고로 노출하기 위한 헬퍼들. 임의 환산식을 만들지 않는 대신
 * "비교에서 제외했다"는 사실을 그대로 보여준다.
 */

/** 최상위권 판정 기준 — 강조 카드 노출 문턱. 필요하면 여기만 조정한다. */
export const TOP_TIER = {
  minAvgPercentile: 93, // 국어·탐구 투영 백분위 평균
  maxEnglishGrade: 2,
} as const;

/** 최상위권 강조 카드로 띄울 자체 기준 대학 — 그 외(삼육대 등)는 각주로만 표기 */
export const TOP_CUSTOM_UNIVERSITIES = ["서울대학교", "한국예술종합학교"];

export function isTopTier(d: DetailedStudentScore): boolean {
  const s = toStudentScore(d);
  const parts = [s.국어, s.탐구].filter((v): v is number => v != null);
  if (parts.length === 0 || s.영어 == null) return false;
  const avg = parts.reduce((a, b) => a + b, 0) / parts.length;
  return avg >= TOP_TIER.minAvgPercentile && s.영어 <= TOP_TIER.maxEnglishGrade;
}

/**
 * 성별·실기 필터를 통과했지만 자체 기준이라 환산 비교에서 제외된 대학들.
 * (수학·탐구 미응시로 막힌 곳은 '필수' 문구로 걸러 제외 사유가 다르므로 뺀다)
 */
export function customBasisFromRanked(
  ranked: Record<Gun, Ranked[]>,
): Ranked[] {
  const guns: Gun[] = ["가", "나", "다", "별도"];
  return guns.flatMap((g) =>
    ranked[g].filter(
      (r) =>
        r.converted == null && r.blocked != null && !r.blocked.includes("필수"),
    ),
  );
}

/* ------------------------------ 희망 대학 거리 ------------------------------ */

/** 검색 UI용 대학 목록 — 성별 조건 반영, 가나다순. 한예종(별도군) 포함. */
export function universityOptions(gender: DiagnosisGender): string[] {
  const names = new Set<string>();
  for (const e of jungsiEntries) {
    if (gender === "남학생" && isWomensUniv(e)) continue;
    names.add(e.university);
  }
  return [...names].sort((a, b) => a.localeCompare(b, "ko"));
}

export type SubjectGap = {
  label: string; // 예: "국어" · "탐구1 생활과윤리"
  currentGrade: number | null;
  /** 목표권 등급 범위 [상위, 하위] — 예: [2, 3] → "2~3등급" */
  targetGrade: [number, number];
  /** 현재 − 목표 하위 등급. 0 이하면 이미 목표권 */
  gapGrades: number | null;
};

export type TargetAnalysis =
  | {
      kind: "quantified";
      university: string;
      /** 근거가 된 입결 컷 (0~100 백분위 상당) */
      targetPercentile: number;
      cutoffLabels: string[];
      /** 학생의 현재 위치 (해당 대학 반영식 환산, 계산 가능한 entry 중 최고) */
      currentConverted: number | null;
      /** 이미 목표권에 근접(또는 도달)했는지 */
      reached: boolean;
      subjects: SubjectGap[];
    }
  | {
      kind: "no-data";
      university: string;
      /** 계산 가능하면 지원권 참고치라도 준다 */
      currentConverted: number | null;
      entries: JungsiEntry[];
    };

/**
 * 희망 대학까지의 거리 (고1·중3 이하 분기).
 * 2026 입결이 공개된 모집단위가 있을 때만 정량화하고,
 * 없으면 no-data로 돌려 UI가 "산정이 어려워요"를 보여주게 한다.
 * 목표권 등급은 대학 컷 백분위를 등급 구간으로 되돌린 근사 범위다.
 */
export function analyzeTarget(
  d: DetailedStudentScore,
  university: string,
  filters: DiagnosisFilters,
): TargetAnalysis {
  const entries = jungsiEntries.filter(
    (e) => e.university === university && e.gun !== "별도",
  );
  const cutoffs = entries
    .map((e) => ({ entry: e, cut: getCutoffInfo(e.id) }))
    .filter((c): c is { entry: JungsiEntry; cut: { p: number; label: string } } =>
      c.cut != null,
    );

  // 성적이 하나도 없으면 환산 0점이 '현재 위치'처럼 보이지 않게 계산하지 않는다
  const score = toStudentScore(d);
  const converted = hasAnyScore(d)
    ? entries
        .map((e) => convertScore(e.id, score).value)
        .filter((v): v is number => v != null)
    : [];
  const currentConverted = converted.length > 0 ? Math.max(...converted) : null;

  if (cutoffs.length === 0) {
    return { kind: "no-data", university, currentConverted, entries };
  }

  // 목표권: 공개된 컷 중 가장 높은 값 기준 (준비 방향은 높은 쪽에 맞춘다)
  const targetPercentile = Math.max(...cutoffs.map((c) => c.cut.p));
  const gradeHigh = gradeFromPercentile(Math.min(100, targetPercentile + 6));
  const gradeLow = gradeFromPercentile(targetPercentile);
  const targetGrade: [number, number] = [
    Math.min(gradeHigh, gradeLow),
    Math.max(gradeHigh, gradeLow),
  ];

  const subject = (label: string, v: ScoreValue | null): SubjectGap => {
    const currentGrade = v ? effectiveGrade(v) : null;
    return {
      label,
      currentGrade,
      targetGrade,
      gapGrades: currentGrade == null ? null : currentGrade - targetGrade[1],
    };
  };

  const subjects: SubjectGap[] = [
    subject("국어", d.korean),
    {
      label: "영어",
      currentGrade: d.english.grade,
      targetGrade,
      gapGrades:
        d.english.grade == null ? null : d.english.grade - targetGrade[1],
    },
  ];
  if (!d.inquiry1.notTaken && effectiveGrade(d.inquiry1) != null) {
    subjects.push(
      subject(
        d.inquiry1.subject ? `탐구1 ${d.inquiry1.subject}` : "탐구1",
        d.inquiry1,
      ),
    );
  }
  if (!d.inquiry2.notTaken && effectiveGrade(d.inquiry2) != null) {
    subjects.push(
      subject(
        d.inquiry2.subject ? `탐구2 ${d.inquiry2.subject}` : "탐구2",
        d.inquiry2,
      ),
    );
  }

  const reached =
    currentConverted != null && currentConverted >= targetPercentile - 1;

  return {
    kind: "quantified",
    university,
    targetPercentile,
    cutoffLabels: cutoffs.map((c) => c.cut.label),
    currentConverted,
    reached,
    subjects,
  };
}
