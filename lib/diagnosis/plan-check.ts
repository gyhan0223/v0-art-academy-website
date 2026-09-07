/**
 * "내가 고른 가·나·다 3장" 조합 점검 — /guide/jungsi-2027 원서 트레이에서
 * ?pick=으로 넘어온 대학들을 진단 입력(성적·실기·성별) 기준으로 되짚는다.
 *
 * 새 합격 확률 계산기를 만들지 않는다. 이미 있는 데이터·엔진만 쓴다 —
 * - 수능 환산·지원권(안정/적정/도전/낮음): lib/jungsi-recommend.ts rankByGun
 *   (2026 입결이 공개된 대학만 tier가 붙고, 나머지는 '참고'로 남긴다)
 * - 한 등급 상승: lib/diagnosis/grade-up-simulation.ts
 * - 실기 종목 응시 가능 여부: lib/diagnosis/silgi.ts + lib/jungsi-plan.ts
 * - 여대·수능 반영영역·수능:실기 비율: lib/jungsi-data.ts entry 원본
 * 데이터가 없는 항목은 억지로 채우지 않고 null/미공개로 돌려 UI가 그대로
 * "판단 어려움"을 보여주게 한다.
 */

import type { JungsiEntry } from "@/lib/jungsi-data";
import {
  isWomensUniv,
  rankByGun,
  type Ranked,
  type Tier,
} from "@/lib/jungsi-recommend";
import { analyzeSelection, type PlanSilgiAnalysis } from "@/lib/jungsi-plan";
import { simulateOneGradeUp } from "./grade-up-simulation";
import { hasAnyScore, toStudentScore } from "./score-engine";
import { isCompatibleSilgiAny, isSilgiFree } from "./silgi";
import type {
  DetailedStudentScore,
  DiagnosisGender,
  DiagnosisSilgi,
} from "./types";

export type PlanSilgiFit =
  | "fit" // 준비 중인 종목으로 응시 가능
  | "mismatch" // 준비 중인 종목과 다른 종목을 요구
  | "free" // 비실기 — 종목 무관
  | "unknown"; // 실기를 "모름"으로 두었거나 미선택

export type PlanEntryCheck = {
  entry: JungsiEntry;
  /** 이 대학 반영식으로 투영한 백분위(0~100). null이면 계산 불가 */
  converted: number | null;
  /** 계산 불가·제외 사유 (자체 환산·수학 필수 등) */
  blocked?: string;
  /** 2026 입결이 공개된 대학만 — 없으면 판정하지 않는다 */
  tier?: Tier;
  cutoffLabel?: string;
  /** 국·영·탐 한 등급 상승 시 tier (입결 공개 대학만) */
  gradeUpTier?: Tier;
  silgiFit: PlanSilgiFit;
  /** 남학생이 여대를 담은 경우 */
  genderBlocked: boolean;
  /** 모집요강의 '수능 반영영역' 문장 (있을 때만) */
  reflectLine: string | null;
};

export type PlanCheck = {
  items: PlanEntryCheck[];
  silgi: PlanSilgiAnalysis;
  /** 반영 구조상 현재 성적이 가장 잘 반영되는 대학 — 차이가 뚜렷할 때만 */
  bestFit: { entry: JungsiEntry; margin: number } | null;
  /** 계산 가능한 대학이 2곳 이상인데 bestFit이 없으면 "차이 크지 않음" */
  fitComparable: boolean;
  /** 지원권(안정·적정) / 도전 / 컷과 차이 큼(낮음) / 입결 미공개 / 계산 제외(자체 환산·필수 과목 미응시) */
  range: {
    reachable: JungsiEntry[];
    stretch: JungsiEntry[];
    far: JungsiEntry[];
    unpublished: JungsiEntry[];
    excluded: JungsiEntry[];
  };
  /** 한 등급 상승 시 판정이 바뀌는 대학 */
  gradeUpChanges: { entry: JungsiEntry; from: Tier; to: Tier }[];
  /** 입결 공개 대학이 있는데 한 등급 올라도 판정이 안 바뀌는 경우 true */
  gradeUpUnchanged: boolean;
  scoreless: boolean;
};

const TIER_ORDER: Tier[] = ["낮음", "도전", "적정", "안정"];

/** bestFit으로 부를 최소 환산 차이(백분위 점) — 이보다 작으면 유불리를 말하지 않는다 */
const BEST_FIT_MIN_MARGIN = 2;

function reflectLineOf(entry: JungsiEntry): string | null {
  const line = entry.method.find((m) => m.startsWith("수능 반영영역:"));
  return line ? line.replace(/^수능 반영영역:\s*/, "") : null;
}

function silgiFitOf(entry: JungsiEntry, silgi: DiagnosisSilgi[]): PlanSilgiFit {
  if (isSilgiFree(entry)) return "free";
  if (silgi.length === 0 || silgi.includes("모름")) return "unknown";
  return isCompatibleSilgiAny(entry, silgi) ? "fit" : "mismatch";
}

function rankedById(score: DetailedStudentScore): Map<string, Ranked> {
  const all = rankByGun(toStudentScore(score), null);
  const map = new Map<string, Ranked>();
  for (const list of Object.values(all)) for (const r of list) map.set(r.entry.id, r);
  return map;
}

export function checkPlan(
  plan: JungsiEntry[],
  score: DetailedStudentScore,
  filters: { gender: DiagnosisGender; silgi: DiagnosisSilgi[] },
): PlanCheck {
  const scoreless = !hasAnyScore(score);
  const now = scoreless ? null : rankedById(score);
  const up = scoreless ? null : rankedById(simulateOneGradeUp(score));

  const items: PlanEntryCheck[] = plan.map((entry) => {
    const r = now?.get(entry.id);
    const u = up?.get(entry.id);
    return {
      entry,
      converted: r?.converted ?? null,
      blocked: r?.blocked,
      tier: r?.tier,
      cutoffLabel: r?.cutoffLabel,
      gradeUpTier: u?.tier,
      silgiFit: silgiFitOf(entry, filters.silgi),
      genderBlocked: filters.gender === "남학생" && isWomensUniv(entry),
      reflectLine: reflectLineOf(entry),
    };
  });

  // 반영 구조 유불리 — 같은 0~100 백분위 척도의 가중 평균이므로 "내 과목
  // 프로필이 어느 반영식에 잘 맞나"는 비교할 수 있다. 차이가 작으면 말하지 않는다.
  const computable = items
    .filter((i) => i.converted != null)
    .sort((a, b) => (b.converted ?? 0) - (a.converted ?? 0));
  const fitComparable = computable.length >= 2;
  const margin = fitComparable
    ? (computable[0].converted ?? 0) - (computable[1].converted ?? 0)
    : 0;
  const bestFit =
    fitComparable && margin >= BEST_FIT_MIN_MARGIN
      ? { entry: computable[0].entry, margin }
      : null;

  const range: PlanCheck["range"] = {
    reachable: [],
    stretch: [],
    far: [],
    unpublished: [],
    excluded: [],
  };
  for (const i of items) {
    if (i.tier === "안정" || i.tier === "적정") range.reachable.push(i.entry);
    else if (i.tier === "도전") range.stretch.push(i.entry);
    else if (i.tier === "낮음") range.far.push(i.entry);
    else if (i.converted != null) range.unpublished.push(i.entry);
    else range.excluded.push(i.entry);
  }

  const gradeUpChanges: PlanCheck["gradeUpChanges"] = [];
  let withCutoff = 0;
  for (const i of items) {
    if (!i.tier || !i.gradeUpTier) continue;
    withCutoff += 1;
    if (TIER_ORDER.indexOf(i.gradeUpTier) > TIER_ORDER.indexOf(i.tier)) {
      gradeUpChanges.push({ entry: i.entry, from: i.tier, to: i.gradeUpTier });
    }
  }

  return {
    items,
    silgi: analyzeSelection(plan),
    bestFit,
    fitComparable,
    range,
    gradeUpChanges,
    gradeUpUnchanged: withCutoff > 0 && gradeUpChanges.length === 0,
    scoreless,
  };
}
