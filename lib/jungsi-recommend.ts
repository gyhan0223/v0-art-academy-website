import {
  jungsiEntries,
  type Gun,
  type JungsiEntry,
  type SilgiType,
} from "./jungsi-data";

/* ────────────────────────────────────────────────────────────────
   정시 성적 → 대학별 수능 환산 백분위 → 군별 지원권 추천 (참고용)

   - 반영식(어느 과목 몇 %)은 각 대학 모집요강 기준이라 계산이 정확합니다.
   - 합격선은 2026학년도 입시결과가 공개된 곳만 안정/적정/도전 뱃지를 붙입니다.
   - 실기 성적은 반영하지 않습니다 → 최종 합불이 아니라 '수능 기준 지원권'입니다.
   ──────────────────────────────────────────────────────────────── */

export type Subject = "국어" | "수학" | "영어" | "탐구";

export type StudentScore = {
  국어: number | null; // 백분위 0~100
  수학: number | null; // 백분위 0~100, null = 미응시
  영어: number | null; // 등급 1~9
  탐구: number | null; // 백분위 0~100 (2과목 평균)
};

/** 영어 등급 → 백분위 근사(참고용). 대학마다 환산표가 달라 어림값입니다. */
const ENGLISH_PCT: Record<number, number> = {
  1: 99, 2: 92, 3: 85, 4: 75, 5: 65, 6: 55, 7: 45, 8: 30, 9: 15,
};

type Weights = Partial<Record<Subject, number>>;

type ReflectSpec =
  | { kind: "fixed"; w: Weights; mathRequired?: boolean; tamRequired?: boolean }
  | {
      kind: "pickTop";
      pool: Subject[];
      weights: number[]; // 내림차순: 학생의 상위 과목에 큰 가중치
      plus?: Weights;
      mathRequired?: boolean;
      tamRequired?: boolean;
    }
  | { kind: "custom"; label: string }; // 자체 환산 등 계산 제외

/** 대학(entry.id)별 수능 반영식. 모집요강의 '수능 반영영역' 문구를 구조화한 것. */
const REFLECT: Record<string, ReflectSpec> = {
  // ── 가군 ──
  "ewha-ga": { kind: "pickTop", pool: ["국어", "수학", "탐구"], weights: [50, 50] },
  "kookmin-ga": { kind: "pickTop", pool: ["수학", "탐구"], weights: [33.34], plus: { 국어: 33.33, 영어: 33.33 } },
  "kookmin-hoehwa-ga": { kind: "pickTop", pool: ["수학", "탐구"], weights: [33.34], plus: { 국어: 33.33, 영어: 33.33 } },
  "skku-ga": { kind: "fixed", w: { 국어: 45, 탐구: 45, 영어: 10 } },
  "skku-fine-ga": { kind: "fixed", w: { 국어: 45, 탐구: 45, 영어: 10 } },
  "uos-ga": { kind: "fixed", w: { 국어: 50, 영어: 30, 탐구: 20 } },
  "uos-sculpture-ga": { kind: "fixed", w: { 국어: 40, 영어: 40, 탐구: 20 } },
  "korea-design": { kind: "fixed", w: { 국어: 55.56, 탐구: 44.44 } },
  "korea-freemajor-ga": { kind: "fixed", w: { 국어: 35.7, 수학: 35.7, 탐구: 28.6 }, mathRequired: true },
  "sookmyung-ga": { kind: "fixed", w: { 국어: 40, 영어: 30, 탐구: 30 } },
  "sookmyung-fine-ga": { kind: "fixed", w: { 국어: 60, 영어: 40 } },
  "swu-ga": { kind: "pickTop", pool: ["국어", "영어", "수학", "탐구"], weights: [40, 40, 20] },
  "skuniv-ga": { kind: "pickTop", pool: ["국어", "수학", "탐구"], weights: [40, 40], plus: { 영어: 20 } },
  "syu-ga": { kind: "custom", label: "삼육대 자체 등급 환산점수" },
  "konkuk-ga": { kind: "pickTop", pool: ["수학", "탐구"], weights: [30], plus: { 국어: 45, 영어: 25 } },
  "konkuk-hyeondae-ga": { kind: "pickTop", pool: ["수학", "탐구"], weights: [30], plus: { 국어: 45, 영어: 25 } },
  "gyeonggi-ga": { kind: "pickTop", pool: ["국어", "수학", "탐구"], weights: [35, 35], plus: { 영어: 30 } },
  "dongduk-ga": { kind: "pickTop", pool: ["국어", "수학"], weights: [35, 25], plus: { 영어: 20, 탐구: 20 } },
  "hansung-ga": { kind: "fixed", w: { 국어: 35, 수학: 25, 영어: 20, 탐구: 20 } },

  // ── 나군 ──
  "snu-art": { kind: "custom", label: "서울대 자체·통합실기 기준" },
  "hongik-art": { kind: "pickTop", pool: ["국어", "수학", "탐구"], weights: [40, 40], plus: { 영어: 20 } },
  "seoultech-na": { kind: "fixed", w: { 국어: 40, 영어: 25, 탐구: 35 } },
  "seoultech-nonsilgi-na": { kind: "fixed", w: { 국어: 30, 수학: 25, 영어: 25, 탐구: 20 }, mathRequired: true },
  "sejong-fine-na": { kind: "fixed", w: { 국어: 70, 영어: 30 } },
  "sejong-na": { kind: "fixed", w: { 국어: 70, 영어: 30 } },
  "sejong-sw-na": { kind: "fixed", w: { 국어: 35, 수학: 35, 영어: 20, 탐구: 10 }, mathRequired: true },
  "khu-na": { kind: "fixed", w: { 국어: 60, 탐구: 40 } },
  "dgu-na": { kind: "fixed", w: { 국어: 45, 영어: 15, 탐구: 40 } },
  "cau-na": { kind: "fixed", w: { 국어: 50, 탐구: 50 } },
  "kookmin-na": { kind: "fixed", w: { 국어: 33.33, 영어: 33.33, 탐구: 33.34 }, tamRequired: true },
  "konkuk-na": { kind: "pickTop", pool: ["수학", "탐구"], weights: [30], plus: { 국어: 45, 영어: 25 } },
  "konkuk-uisang-inmun-na": { kind: "fixed", w: { 국어: 40, 수학: 30, 영어: 10, 탐구: 20 }, mathRequired: true },
  "dongduk-na": { kind: "pickTop", pool: ["국어", "수학"], weights: [33.33], plus: { 영어: 33.33, 탐구: 33.34 } },
  "swu-na": { kind: "pickTop", pool: ["국어", "영어", "수학", "탐구"], weights: [40, 40, 20] },
  "swu-hyeondae-na": { kind: "pickTop", pool: ["국어", "영어", "수학", "탐구"], weights: [40, 40, 20] },
  "duksung-na": { kind: "pickTop", pool: ["국어", "영어", "수학", "탐구"], weights: [50, 50] },
  "sangmyung-na": { kind: "pickTop", pool: ["국어", "수학", "영어"], weights: [40, 40], plus: { 탐구: 20 } },
  "sangmyung-sw-na": { kind: "fixed", w: { 국어: 35, 수학: 25, 영어: 20, 탐구: 20 }, mathRequired: true },

  // ── 다군 ──
  "hongik-da": { kind: "fixed", w: { 국어: 25, 수학: 33, 영어: 15, 탐구: 27 }, mathRequired: true },
  "dongduk-da": { kind: "pickTop", pool: ["국어", "수학"], weights: [33.33], plus: { 영어: 33.33, 탐구: 33.34 } },
  "chugye-da": { kind: "fixed", w: { 국어: 50, 영어: 50 } },
  "hansung-da": { kind: "pickTop", pool: ["국어", "수학"], weights: [40], plus: { 영어: 40, 탐구: 20 } },
  "swu-da": { kind: "pickTop", pool: ["국어", "수학", "영어", "탐구"], weights: [35, 30, 20, 15] },
  "sungshin-da": { kind: "pickTop", pool: ["국어", "수학", "영어", "탐구"], weights: [33.33, 33.33, 33.34] },
  "mju-da": { kind: "pickTop", pool: ["수학", "탐구"], weights: [30], plus: { 국어: 35, 영어: 35 } },
  "mju-ai-da": { kind: "fixed", w: { 국어: 25, 수학: 35, 영어: 20, 탐구: 20 }, mathRequired: true },
  "konkuk-da": { kind: "pickTop", pool: ["수학", "탐구"], weights: [30], plus: { 국어: 45, 영어: 25 } },
  "skuniv-mudae-da": { kind: "pickTop", pool: ["국어", "수학", "탐구"], weights: [40, 40], plus: { 영어: 20 } },
};

/**
 * 2026학년도 정시 입시결과 기반 참고 합격선(백분위 또는 백분위 상당 환산치, 0~100).
 * 있는 곳만 안정/적정/도전 판정. 컷의 종류(50%·70%컷/평균)와 근거는 label에 명시.
 *
 * p 산정 규약:
 * - "환산" 표기: 대학이 공개한 수능 환산점수를 만점 대비 100점 척도로 환원한 값
 *   (반영식이 백분위 가중합인 대학만 — 서울여대 ÷60×100, 경기대 100점 환산 등).
 * - 건국대처럼 컷 지점 학생의 과목별 백분위만 공개한 곳은 반영비율 가중
 *   (영어 제외 재정규화) 근사치를 p로 사용 — label에는 공개 원수치를 그대로 표기.
 * - 학과(전공)별 편차가 있는 항목은 범위를 label에 적고 p는 중간값 부근으로 앵커.
 * - 출처: 각 대학 입학처 2026 전형결과 발표(2026.5~6월)·대입정보포털 어디가.
 * - 제외: 경희대(공개분은 국제캠 예술디자인대·비실기라 수록 항목과 불일치),
 *   국민대(어디가 원자료 내부 모순), 홍익대(표준점수 평균만)·한성대(등급만)·
 *   명지대(자체 환산만)·숙명 회화·추계예대·중앙대(미공개).
 */
const CUTOFFS: Record<string, { p: number; label: string }> = {
  // ── 가군 ──
  "ewha-ga": { p: 80, label: "2026 70%컷 70(도자)~89(디자인)" },
  "sookmyung-ga": { p: 77, label: "2026 50%컷 66~85 (학과별·어디가)" },
  "swu-ga": { p: 83, label: "2026 70%컷 환산 82.2~84.2" },
  "skuniv-ga": { p: 54, label: "2026 70%컷 환산 50~58 (실기 80%)" },
  "konkuk-ga": { p: 77, label: "2026 70%컷 국어 66·탐구 93" },
  "konkuk-hyeondae-ga": { p: 64, label: "2026 70%컷 국어 57·탐구 73.5" },
  "gyeonggi-ga": { p: 71, label: "2026 50%컷 환산 69.6~73.4" },
  "dongduk-ga": { p: 80.8, label: "2026 70%컷 80.8" },
  // ── 나군 ──
  "seoultech-na": { p: 86.5, label: "2026 70%컷 84.3~88.8 (학과별)" },
  "seoultech-nonsilgi-na": { p: 87.8, label: "2026 산업 70%컷 87.8 (시각·금속 비공개)" },
  "sejong-fine-na": { p: 67, label: "2026 컷 67 (어디가)" },
  "sejong-na": { p: 77, label: "2026 70%컷 77 (국어 백분위 기준)" },
  "sejong-sw-na": { p: 83.5, label: "2026 컷 80·87 (전공별 · 각 2명 모집)" },
  "dgu-na": { p: 71, label: "2026 상위80% 평균 백분위 70.9" },
  "konkuk-na": { p: 78, label: "2026 70%컷 국어 67~77·탐구 81~88.5" },
  "konkuk-uisang-inmun-na": { p: 86, label: "2026 70%컷 국98·수76·탐75.5" },
  "dongduk-na": { p: 81.4, label: "2026 합격자 평균 80.3~82.5" },
  "swu-na": { p: 86.2, label: "2026 70%컷 환산 86.2" },
  "swu-hyeondae-na": { p: 81.8, label: "2026 70%컷 환산 81.8" },
  "duksung-na": { p: 68, label: "2026 70%컷 67~68 (기초소양 89)" },
  // ── 다군 ──
  "dongduk-da": { p: 84, label: "2026 합격자 평균 79.3~88.5 (전공별)" },
  "swu-da": { p: 86.6, label: "2026 70%컷 환산 86.6" },
  "sungshin-da": { p: 87.8, label: "2026 등록자 백분위 평균 87.8" },
  "konkuk-da": { p: 90, label: "2026 70%컷 국어 87·탐구 94.5" },
};

/**
 * 미대 정시 입결 서열(숫자가 작을수록 상위).
 * 환산점수가 화면 표기(소수 첫째 자리) 기준으로 같을 때의 정렬 기준으로만 쓰입니다.
 * 최근 입결·선호도를 반영한 참고용 편집 데이터 — 숫자 간격을 띄워 둬서 사이에 끼워 넣기 쉽습니다.
 */
const PRESTIGE: Record<string, number> = {
  서울대학교: 10,
  한국예술종합학교: 15,
  홍익대학교: 20,
  국민대학교: 30,
  이화여자대학교: 35,
  성균관대학교: 40,
  고려대학교: 45,
  중앙대학교: 50,
  경희대학교: 55,
  서울시립대학교: 60,
  건국대학교: 65,
  동국대학교: 70,
  숙명여자대학교: 75,
  서울과학기술대학교: 80,
  세종대학교: 85,
  인하대학교: 90,
  상명대학교: 95,
  성신여자대학교: 100,
  덕성여자대학교: 105,
  동덕여자대학교: 110,
  서울여자대학교: 115,
  한성대학교: 120,
  명지대학교: 125,
  경기대학교: 130,
  서경대학교: 135,
  삼육대학교: 140,
  추계예술대학교: 145,
};

const prestigeOf = (e: JungsiEntry) => PRESTIGE[e.university] ?? 999;

/**
 * 같은 대학 안에서 동점일 때의 우선순위 (입시 디자인 학원 관점).
 * 디자인 계열 모집단위 우선, 자율전공은 후순위.
 */
const unitPriority = (e: JungsiEntry) => {
  if (e.units.includes("디자인")) return 0;
  if (e.units.includes("자율전공")) return 2;
  return 1;
};

/** 화면 표기(소수 첫째 자리)와 같은 기준의 비교값 */
const displayScore = (v: number) => Math.round(v * 10);

/** 학생이 준비 중인 실기 트랙 */
export type PrepTrack = "기초디자인" | "기초소양";

/**
 * 준비한 실기유형으로 그 대학에 지원할 수 있는지.
 * - 같은 유형이면 당연히 가능
 * - 선택실기: 지정 유형(기초디자인·기초소양·소묘 등) 중 골라 응시 → 준비한 유형으로 지원 가능
 * - 비실기: 실기 자체가 없음(수능·서류) → 누구나 지원 가능
 * - 다른 유형(기초디자인↔기초소양)·자체실기: 별도 준비가 필요 → 제외
 */
export function isCompatibleTrack(silgi: SilgiType, track: PrepTrack): boolean {
  if (silgi === track) return true;
  if (silgi === "선택실기" || silgi === "비실기") return true;
  return false;
}

function subjectPct(s: StudentScore, subj: Subject): number | null {
  if (subj === "영어") return s.영어 == null ? null : ENGLISH_PCT[s.영어] ?? null;
  const v = s[subj];
  return v == null ? null : v;
}

export type Tier = "안정" | "적정" | "도전" | "낮음";

export type Ranked = {
  entry: JungsiEntry;
  /** 수능 환산 백분위(0~100). null이면 자체환산 등 계산 불가. */
  converted: number | null;
  /** 계산 불가/제외 사유 */
  blocked?: string;
  tier?: Tier;
  cutoffLabel?: string;
};

function tierOf(converted: number, cutoff: number): Tier {
  const d = converted - cutoff;
  if (d >= 2) return "안정";
  if (d >= -3) return "적정";
  if (d >= -8) return "도전";
  return "낮음";
}

/** 한 대학의 수능 환산 백분위 계산 */
export function convertScore(
  entryId: string,
  s: StudentScore,
): { value: number | null; blocked?: string } {
  const spec = REFLECT[entryId];
  if (!spec) return { value: null, blocked: "반영식 확인 필요" };
  if (spec.kind === "custom") return { value: null, blocked: spec.label };

  const mathRequired = spec.mathRequired;
  const tamRequired = spec.tamRequired;
  if (mathRequired && s.수학 == null) return { value: null, blocked: "수학 필수 (미응시)" };
  if (tamRequired && s.탐구 == null) return { value: null, blocked: "탐구 필수 (미응시)" };

  if (spec.kind === "fixed") {
    let total = 0;
    let wsum = 0;
    for (const [subj, w] of Object.entries(spec.w) as [Subject, number][]) {
      const p = subjectPct(s, subj) ?? 0; // 미응시 반영과목은 0점 처리(불리)
      total += p * w;
      wsum += w;
    }
    return { value: wsum > 0 ? total / wsum : null };
  }

  // pickTop: 학생의 상위 과목에 큰 가중치를 배정
  const ranked = spec.pool
    .map((subj) => ({ subj, p: subjectPct(s, subj) ?? 0 }))
    .sort((a, b) => b.p - a.p);
  let total = 0;
  let wsum = 0;
  spec.weights.forEach((w, i) => {
    const p = ranked[i]?.p ?? 0;
    total += p * w;
    wsum += w;
  });
  if (spec.plus) {
    for (const [subj, w] of Object.entries(spec.plus) as [Subject, number][]) {
      const p = subjectPct(s, subj) ?? 0;
      total += p * w;
      wsum += w;
    }
  }
  return { value: wsum > 0 ? total / wsum : null };
}

export function hasScore(s: StudentScore): boolean {
  return [s.국어, s.영어, s.탐구].some((v) => v != null);
}

/** 군별로 학생 점수에 맞춰 정렬된 대학 목록. track을 주면 지원 가능한 실기유형만 남깁니다. */
export function rankByGun(
  s: StudentScore,
  track?: PrepTrack | null,
): Record<Gun, Ranked[]> {
  const out: Record<Gun, Ranked[]> = { 가: [], 나: [], 다: [], 별도: [] };
  for (const entry of jungsiEntries) {
    if (track && !isCompatibleTrack(entry.silgi, track)) continue;
    const { value, blocked } = convertScore(entry.id, s);
    const cut = CUTOFFS[entry.id];
    const r: Ranked = {
      entry,
      converted: value,
      blocked,
      tier: value != null && cut ? tierOf(value, cut.p) : undefined,
      cutoffLabel: cut?.label,
    };
    (out[entry.gun] ??= []).push(r);
  }
  const tierRank: Record<Tier, number> = { 적정: 0, 안정: 1, 도전: 2, 낮음: 3 };
  for (const g of Object.keys(out) as Gun[]) {
    out[g].sort((a, b) => {
      // 계산 가능한 대학을 위로, 그다음 환산점수 높은 순
      if (a.converted == null && b.converted == null) return 0;
      if (a.converted == null) return 1;
      if (b.converted == null) return -1;
      // 화면 표기 기준 동점이면 입결 서열 높은 대학 우선,
      // 같은 대학이면 디자인 계열 우선·자율전공 후순위
      if (displayScore(a.converted) === displayScore(b.converted)) {
        const p = prestigeOf(a.entry) - prestigeOf(b.entry);
        if (p !== 0) return p;
        return unitPriority(a.entry) - unitPriority(b.entry);
      }
      return b.converted - a.converted;
    });
    // 적정 라인이 있으면 살짝 끌어올려 추천 상단 노출(안정보다 적정 우선 노출)
    out[g].sort((a, b) => {
      if (a.converted == null || b.converted == null) return 0;
      // 동점끼리는 입결 순서를 유지(안정 뱃지가 입결 상위 대학을 밀어내지 않도록)
      if (displayScore(a.converted) === displayScore(b.converted)) return 0;
      const ta = a.tier ? tierRank[a.tier] : 1.5;
      const tb = b.tier ? tierRank[b.tier] : 1.5;
      return ta - tb;
    });
  }
  return out;
}

/** 가·나·다 각 1곳씩 추천 조합(환산 상위 + 적정/안정 우선). 같은 대학은 중복 추천하지 않습니다. */
export function recommendCombo(
  s: StudentScore,
  track?: PrepTrack | null,
): Partial<Record<Gun, Ranked>> {
  const ranked = rankByGun(s, track);
  const combo: Partial<Record<Gun, Ranked>> = {};
  const usedUniversities = new Set<string>();
  for (const g of ["가", "나", "다"] as Gun[]) {
    const candidates = ranked[g].filter(
      (r) => r.converted != null && r.tier !== "낮음",
    );
    // 이미 추천한 대학은 건너뛰되, 그 군에 다른 대학이 없으면 중복이라도 추천
    const pick =
      candidates.find((r) => !usedUniversities.has(r.entry.university)) ??
      candidates[0];
    if (pick) {
      combo[g] = pick;
      usedUniversities.add(pick.entry.university);
    }
  }
  return combo;
}

/** 진단 페이지 등 외부에서 참고 합격선을 읽는 읽기 전용 접근자 */
export function getCutoffInfo(
  entryId: string,
): { p: number; label: string } | null {
  return CUTOFFS[entryId] ?? null;
}

/** 입결 서열 읽기 전용 접근자 (숫자가 작을수록 상위, 미수록 999) */
export function getPrestige(university: string): number {
  return PRESTIGE[university] ?? 999;
}

export const RECOMMEND_COVERAGE = {
  totalEntries: jungsiEntries.length,
  withReflect: Object.values(REFLECT).filter((r) => r.kind !== "custom").length,
  withCutoff: Object.keys(CUTOFFS).length,
};
