import {
  jungsiEntries,
  type Gun,
  type JungsiEntry,
  type SilgiSubject,
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
  | { kind: "custom"; label: string } // 자체 환산 등 계산 제외
  | {
      /** 반영식이 모집단위별로 다른 대학: 학생에게 유리한 쪽으로 계산 */
      kind: "maxOf";
      specs: { kind: "fixed"; w: Weights }[];
      mathRequired?: boolean;
      tamRequired?: boolean;
    };

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
  "konkuk-hyeondae-ga": { kind: "pickTop", pool: ["수학", "탐구"], weights: [30], plus: { 국어: 45, 영어: 25 } },
  "gyeonggi-ga": { kind: "pickTop", pool: ["국어", "수학", "탐구"], weights: [35, 35], plus: { 영어: 30 } },
  "dongduk-ga": { kind: "pickTop", pool: ["국어", "수학"], weights: [35, 25], plus: { 영어: 20, 탐구: 20 } },
  "hansung-ga": { kind: "fixed", w: { 국어: 35, 수학: 25, 영어: 20, 탐구: 20 } },
  "sungshin-ga": { kind: "pickTop", pool: ["국어", "수학", "영어", "탐구"], weights: [33.33, 33.33, 33.34] },

  // ── 나군 ──
  // 서울대: 표준점수 자체 환산을 백분위 가중합으로 근사(수·영·한 감점은 미반영).
  // 예술계열(국50+탐50)과 디자인과(국수탐 균등) 중 학생에게 유리한 쪽으로 계산.
  // 수능 전 영역 응시가 지원 요건이라 수학 미응시는 제외.
  "snu-art": {
    kind: "maxOf",
    mathRequired: true,
    specs: [
      { kind: "fixed", w: { 국어: 50, 탐구: 50 } },
      { kind: "fixed", w: { 국어: 33.3, 수학: 33.4, 탐구: 33.3 } },
    ],
  },
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
  // 건국대 영상디자인학과(구 영상학과): 2027학년도 가→다군 이동
  "konkuk-video-da": { kind: "pickTop", pool: ["수학", "탐구"], weights: [30], plus: { 국어: 45, 영어: 25 } },
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
  "konkuk-video-da": { p: 77, label: "2026 70%컷 국어 66·탐구 93 (가군 영상학과 시절)" },
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

/** 학생이 준비 중인 실기 종목 트랙 (디자인계열 3종) */
export type PrepTrack = Extract<
  SilgiSubject,
  "기초디자인" | "발상과표현" | "기초조형·소양평가"
>;

/**
 * 준비 종목으로 그 대학에 응시할 수 있는지.
 * - 비실기(subjects 빈 배열): 실기 무관 → 누구나 지원 가능
 * - 그 외: 응시 가능 종목 배열에 준비 종목이 포함될 때만 가능
 *   (택1 대학도 지정 종목에 없으면 제외 — 예: 서경대는 발상과표현·기초디자인 택1이라
 *    기초조형·소양평가 트랙으로는 지원 불가)
 */
export function isCompatibleTrack(
  subjects: SilgiSubject[],
  track: PrepTrack,
): boolean {
  return subjects.length === 0 || subjects.includes(track);
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

  const fixedValue = (w: Weights): number | null => {
    let total = 0;
    let wsum = 0;
    for (const [subj, wt] of Object.entries(w) as [Subject, number][]) {
      const p = subjectPct(s, subj) ?? 0; // 미응시 반영과목은 0점 처리(불리)
      total += p * wt;
      wsum += wt;
    }
    return wsum > 0 ? total / wsum : null;
  };

  if (spec.kind === "fixed") return { value: fixedValue(spec.w) };

  if (spec.kind === "maxOf") {
    const vals = spec.specs
      .map((sub) => fixedValue(sub.w))
      .filter((v): v is number => v != null);
    return { value: vals.length ? Math.max(...vals) : null };
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

/** 여자대학교 여부 — 남학생 추천에서 제외할 때 사용 */
export function isWomensUniv(e: JungsiEntry): boolean {
  return e.university.includes("여자대학교");
}

export type RecommendOpts = {
  /** true면 여대를 추천·정렬에서 제외 (남학생) */
  excludeWomens?: boolean;
};

/** 군별로 학생 점수에 맞춰 정렬된 대학 목록. track을 주면 지원 가능한 실기유형만 남깁니다. */
export function rankByGun(
  s: StudentScore,
  track?: PrepTrack | null,
  opts?: RecommendOpts,
): Record<Gun, Ranked[]> {
  const out: Record<Gun, Ranked[]> = { 가: [], 나: [], 다: [], 별도: [] };
  for (const entry of jungsiEntries) {
    if (track && !isCompatibleTrack(entry.subjects, track)) continue;
    if (opts?.excludeWomens && isWomensUniv(entry)) continue;
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

/**
 * 가·나·다 각 1곳씩 추천 조합. 같은 대학은 중복 추천하지 않습니다.
 *
 * 원칙 — "안정적인 곳"이 아니라 "붙을 수 있는 곳 중 가장 가고 싶을 곳":
 * 1. 군마다 지원권(안정·적정) 안에서는 환산점수가 아니라 입결 서열(벨류)이
 *    가장 높은 대학을 고릅니다.
 * 2. 세 군이 모두 지원권으로 채워지면, 도전 카드로 바꿨을 때 벨류가 가장
 *    크게 오르는 군 하나를 도전으로 상향합니다 — 안정 2장 + 도전 1장 포트폴리오.
 *    도전 풀에는 도전 뱃지 대학과, 입결 비공개라 뱃지가 없는 상위권 대학
 *    (홍익·국민 등)을 함께 넣습니다.
 * 3. 입결 비공개 대학이라도 환산이 압도적(97+)이면 지원권으로 취급합니다 —
 *    최상위권 학생이 컷 공개 대학(건국 등)에만 묶여 벨류 낮은 조합을 받지
 *    않도록.
 */
const PSEUDO_SAFE_MIN = 97;
export type ComboPick = Ranked & {
  /** 2차에서 도전 카드로 상향된 픽 (뱃지 없는 대학도 도전 카드로 표시) */
  stretch?: boolean;
};

export function recommendCombo(
  s: StudentScore,
  track?: PrepTrack | null,
  opts?: RecommendOpts,
): Partial<Record<Gun, ComboPick>> {
  const ranked = rankByGun(s, track, opts);
  const guns = ["가", "나", "다"] as Gun[];

  const byValue = (a: Ranked, b: Ranked) =>
    prestigeOf(a.entry) - prestigeOf(b.entry) ||
    unitPriority(a.entry) - unitPriority(b.entry) ||
    (b.converted ?? 0) - (a.converted ?? 0);

  // 지원권(앵커) 판정: 안정·적정 뱃지, 또는 입결 비공개지만 환산이 압도적인 곳
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
      // 도전 상향 후보: 도전 뱃지 + 입결 비공개(뱃지 없음) 대학
      stretch: cands.filter((r) => r.tier === "도전" || !r.tier).sort(byValue),
    };
  });

  const combo: Partial<Record<Gun, ComboPick>> = {};
  const used = new Set<string>();
  const firstFree = (pool: Ranked[]) =>
    pool.find((r) => !used.has(r.entry.university));

  // 1차: 군마다 지원권 중 벨류 최상위 → 지원권이 없으면 정렬 순(적정·안정 우선 정렬)
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
      const gain = prestigeOf(cur.entry) - prestigeOf(ch.entry);
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
