/**
 * 성적 향상 사례 데이터 단일 소스.
 * 페이지(/grade-up)·네비게이션·사이트맵이 전부 이 파일만 참조한다.
 * 매년 사례를 추가할 때 컴포넌트는 건드리지 않고 이 파일만 고치면 된다.
 *
 * ── 데이터 넣는 법 ──────────────────────────────────────────────
 * 1. COHORT — 집계 결과(분모/분자)를 먼저 채운다. 페이지 최상단 문장이 된다.
 * 2. GRADE_CASES — 개별 사례를 추가한다. (형식은 파일 하단 EXAMPLE_CASE 참고)
 * 3. 다 넣었으면 IS_PLACEHOLDER를 false로 바꾼다.
 *    → 네비게이션 "준비중" 뱃지가 사라지고, 색인(noindex 해제)과
 *      사이트맵 등록이 자동으로 켜진다.
 * ───────────────────────────────────────────────────────────────
 *
 * ── 반드시 지킬 것 ──────────────────────────────────────────────
 * · 분모를 숨기지 않는다. 오른 학생만 세지 말고 집계 대상 전원을 COHORT.total에 넣는다.
 *   숫자가 기대에 못 미쳐도 그대로 쓴다. 아무도 100%를 믿지 않는다.
 * · 과목은 국어·영어·탐구만 쓴다. 미대가 반영하지 않는 수학은 타입에서 막아 두었다.
 * · 등급은 평가원 시험(6월·9월 모의평가, 수능)만 센다. 교육청 학력평가는 쓰지 않는다.
 * · 개인정보 — 이름은 이니셜(김○○), 학교는 지역만("일산 소재 고교"),
 *   성적표 이미지는 이름·수험번호를 가린 뒤 올린다.
 * · 서면 동의 없는 사례는 올리지 않는다. consent: false인 사례는
 *   코드에서 자동으로 걸러져 화면에 나가지 않는다.
 * ───────────────────────────────────────────────────────────────
 */

/* ------------------------------- 공개 스위치 ------------------------------- */

/**
 * 아래 데이터가 아직 자리표시자(샘플)인 상태인지 여부.
 * true  — 페이지 상단에 "샘플" 안내 표시 · noindex · 사이트맵 제외 · 네비 "준비중" 뱃지
 * false — 실제 데이터로 정식 공개
 */
export const IS_PLACEHOLDER = true;

/* ------------------------------- 집계(분모) ------------------------------- */

export interface Cohort {
  /** 학년도 — 예: "2026학년도" */
  year: string;
  /** 분모: 집계 대상 전체 인원. 오른 학생만 세지 말 것. */
  total: number;
  /** 분자: 상승 판정 기준을 넘긴 인원 */
  improved: number;
  /**
   * 상승 판정 기준 — 최상단 문장에 그대로 들어간다.
   * 예: "평균 1등급 이상" → "재원생 24명 중 21명이 평균 1등급 이상 올랐습니다"
   */
  criterion: string;
  /**
   * 어떤 시험을 비교했는지. 교육청 학력평가가 아니라 평가원 시험만 센다.
   * 예: "평가원 모의고사 기준"
   */
  basis: string;
  /** 집계 범위 — 누구를 셌는지. 예: "홍대 본원·일산 캠퍼스 재원생 전원" */
  scope: string;
  /** 제외 인원과 사유 — 숨기지 말고 밝힌다. 예: "중도 퇴원 3명 제외" */
  excluded?: string;
}

// TODO: 원장님 확인 — 실제 집계 결과로 교체.
export const COHORT: Cohort = {
  year: "[2026학년도]",
  total: 24,
  improved: 21,
  criterion: "국어·영어·탐구 평균 1등급 이상",
  basis: "평가원 모의고사 기준",
  scope: "[홍대 본원 · 일산 캠퍼스 정규반 재원생 전원]",
  excluded: "[중도 퇴원 3명 제외]",
};

/* --------------------------------- 타입 --------------------------------- */

/**
 * 미대 반영 3과목.
 * 수학은 대부분의 미대가 반영하지 않으므로 타입에서 아예 막는다.
 */
export type Subject = "국어" | "영어" | "탐구";

export const SUBJECTS: Subject[] = ["국어", "영어", "탐구"];

/** 미대 반영 과목임을 카드에 표기하는 문구 */
export const SUBJECT_NOTE = "미대 반영 3과목";

export type CaseCampus = "홍대 본원" | "일산 캠퍼스" | "파주 기숙";

/** 과목 하나의 등급 변화. 등급은 1(최상)~9 사이 정수. */
export interface ScoreChange {
  subject: Subject;
  /** 시작 등급 */
  before: number;
  /** 향상 후 등급 */
  after: number;
}

export interface GradeCase {
  /** 고유 키 — 예: "2026-kim-01" */
  id: string;
  /** 표기명 — 반드시 이니셜. 예: "김○○" */
  name: string;
  /** 학년/신분 — 예: "고3", "고2", "재수" */
  grade: string;
  /** 학교 — 실명 금지, 지역만. 예: "일산 소재 고교" */
  school?: string;
  campus?: CaseCampus;
  /** 수강 과정 — 예: "정규반", "2026 윈터스쿨" */
  program?: string;
  /** 기간 — 예: "2026.03 ~ 2026.11 (9개월)" */
  period?: string;
  /** 등급 비교 기준 — 평가원 시험만. 예: "6월 모평 → 수능" */
  basis?: string;
  /** 학과 등급 변화. 실기만 있는 사례는 빈 배열. */
  changes: ScoreChange[];
  /** 실기 향상 서술 — 예: "기초디자인 교내 평가 15위 → 3위" */
  practical?: string;
  /** 최종 결과 — 예: "홍익대학교 미술대학 합격" */
  result?: string;
  /** 학생·학부모 한마디 */
  quote?: string;
  /**
   * 학생·학부모 서면 동의 여부.
   * false면 화면에 나가지 않는다. 동의서를 받기 전에는 true로 바꾸지 말 것.
   */
  consent: boolean;
  /** 상단에 먼저 노출할 대표 사례 */
  featured?: boolean;
}

/* --------------------------------- 필터 --------------------------------- */

/** 향상 유형 — 입력값이 아니라 데이터에서 자동으로 판정한다. */
export type CaseTrack = "academic" | "practical" | "both";

export const TRACK_LABELS: Record<CaseTrack, string> = {
  academic: "학과",
  practical: "실기",
  both: "학과 + 실기",
};

export const TRACK_TABS: { key: CaseTrack | "all"; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "academic", label: "학과" },
  { key: "practical", label: "실기" },
  { key: "both", label: "학과 + 실기" },
];

/** 등급 변화와 실기 서술의 유무로 유형을 판정 */
export function getTrack(item: GradeCase): CaseTrack {
  const hasAcademic = item.changes.length > 0;
  const hasPractical = Boolean(item.practical);
  if (hasAcademic && hasPractical) return "both";
  return hasAcademic ? "academic" : "practical";
}

/* -------------------------------- 사례 데이터 ------------------------------- */

// TODO: 원장님 확인 — 아래는 전부 자리표시자. 실제 사례로 교체한 뒤
//       위의 IS_PLACEHOLDER를 false로 바꿔 주세요.
export const GRADE_CASES: GradeCase[] = [
  {
    id: "sample-01",
    name: "[김○○]",
    grade: "[고3]",
    school: "[마포구 소재 고교]",
    campus: "홍대 본원",
    program: "[정규반]",
    period: "[2026.03 ~ 2026.11]",
    basis: "[6월 모평 → 수능]",
    changes: [
      { subject: "국어", before: 5, after: 2 },
      { subject: "영어", before: 4, after: 2 },
      { subject: "탐구", before: 4, after: 3 },
    ],
    practical: "[기초디자인 교내 평가 15위 → 3위]",
    result: "[홍익대학교 미술대학 합격]",
    quote: "[학과가 발목을 잡을 줄 알았는데, 겨울에 잡아둔 게 끝까지 갔습니다.]",
    consent: true,
    featured: true,
  },
  {
    id: "sample-02",
    name: "[이○○]",
    grade: "[고2]",
    school: "[일산 소재 고교]",
    campus: "일산 캠퍼스",
    program: "[2026 윈터스쿨]",
    period: "[2026.01 ~ 2026.02 (8주)]",
    basis: "[전년 수능 → 6월 모평]",
    changes: [
      { subject: "영어", before: 4, after: 2 },
      { subject: "국어", before: 4, after: 3 },
    ],
    quote: "[매일 영단어 100개가 처음엔 힘들었는데, 8주 뒤에 등급이 올랐어요.]",
    consent: true,
  },
  {
    id: "sample-03",
    name: "[박○○]",
    grade: "[재수]",
    campus: "홍대 본원",
    program: "[정규반]",
    period: "[2026.03 ~ 2026.11]",
    changes: [],
    practical: "[사고의전환 기본반 시작 → 9월 최상위반 배정]",
    result: "[국민대학교 조형대학 합격]",
    consent: true,
  },
];

/* --------------------------------- 파생값 -------------------------------- */

/** 서면 동의를 받은 사례만. 화면에 나가는 것은 항상 이 결과만 쓴다. */
export function getPublishableCases(
  cases: GradeCase[] = GRADE_CASES,
): GradeCase[] {
  return cases
    .filter((c) => c.consent)
    .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
}

/** 상승 폭이 가장 큰 과목 — 카드에서 가장 크게 보여줄 변화 */
export function getPrimaryChange(item: GradeCase): ScoreChange | null {
  if (item.changes.length === 0) return null;
  return item.changes.reduce((best, c) =>
    c.before - c.after > best.before - best.after ? c : best,
  );
}

/** 대표 변화를 뺀 나머지 과목 */
export function getSecondaryChanges(item: GradeCase): ScoreChange[] {
  const primary = getPrimaryChange(item);
  return primary ? item.changes.filter((c) => c !== primary) : [];
}

export interface CohortSummary {
  /** 1등급 이상 오른 비율 (%) — 소수 첫째 자리, .0이면 정수로 표기 */
  rate: string;
  /** 집계 수치가 유효한지 — 분모가 0이거나 분자가 분모보다 크면 false */
  isValid: boolean;
}

/** 집계 문장에 쓸 비율을 계산한다. */
export function getCohortSummary(cohort: Cohort = COHORT): CohortSummary {
  const { total, improved } = cohort;
  const isValid = total > 0 && improved >= 0 && improved <= total;
  if (!isValid) return { rate: "—", isValid: false };

  const pct = Math.round((improved / total) * 1000) / 10;
  return {
    rate: `${pct % 1 === 0 ? pct.toFixed(0) : pct.toFixed(1)}%`,
    isValid,
  };
}

/* -------------------------------- 작성 예시 -------------------------------- */

/**
 * 새 사례를 넣을 때 이 형태를 그대로 복사해 쓰세요.
 * (실제로 화면에 나가지 않는 예시 상수입니다.)
 */
export const EXAMPLE_CASE: GradeCase = {
  id: "2027-choi-01",
  name: "최○○",
  grade: "고3",
  school: "마포구 소재 고교",
  campus: "홍대 본원",
  program: "정규반",
  period: "2027.03 ~ 2027.11 (9개월)",
  basis: "6월 모평 → 수능",
  changes: [
    { subject: "국어", before: 6, after: 3 },
    { subject: "탐구", before: 5, after: 2 },
  ],
  practical: "기초디자인 중위반 → 최상위반",
  result: "서울대학교 디자인학부 합격",
  quote: "실기와 학과를 한 곳에서 끝낸 게 가장 컸습니다.",
  consent: true,
  featured: false,
};
