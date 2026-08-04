/**
 * 성적 향상 사례 데이터 단일 소스.
 * 페이지(/grade-up)·네비게이션·사이트맵이 전부 이 파일만 참조한다.
 *
 * ── 데이터 넣는 법 ──────────────────────────────────────────────
 * 1. 아래 GRADE_CASES 배열에 사례를 추가한다. (형식은 파일 하단 EXAMPLE_CASE 참고)
 * 2. 실제 사례를 다 넣었으면 IS_PLACEHOLDER를 false로 바꾼다.
 *    → 그때부터 네비게이션 "준비중" 뱃지가 사라지고, 검색엔진 색인(noindex 해제)과
 *      사이트맵 등록이 자동으로 켜진다.
 * 3. 미확정 문구는 저장소 관례대로 대괄호 [ ]로 표기해 둔다.
 * ───────────────────────────────────────────────────────────────
 */

/* ------------------------------- 공개 스위치 ------------------------------- */

/**
 * 아래 GRADE_CASES가 아직 자리표시자(샘플)인 상태인지 여부.
 * true  — 페이지 상단에 "샘플" 안내 표시 · noindex · 사이트맵 제외 · 네비 "준비중" 뱃지
 * false — 실제 사례로 정식 공개
 */
export const IS_PLACEHOLDER = true;

/* --------------------------------- 타입 --------------------------------- */

/** 향상 유형 — 필터 탭 기준 */
export type CaseTrack = "academic" | "practical" | "both";

export type CaseCampus = "홍대 본원" | "일산 캠퍼스" | "파주 기숙";

/** 과목 하나의 등급 변화. 등급은 1(최상)~9 사이 정수. */
export interface ScoreChange {
  /** 과목명 — 예: "국어", "영어", "탐구", "수학" */
  subject: string;
  /** 시작 등급 */
  before: number;
  /** 향상 후 등급 */
  after: number;
  /** 기준 설명 — 예: "3월 학평 → 수능" */
  basis?: string;
}

export interface GradeCase {
  /** 고유 키 — 아무 문자열이나 가능. 예: "2026-kim-01" */
  id: string;
  /** 표기명 — 실명 대신 "김○○" 형태 권장 */
  name: string;
  /** 학년/신분 — 예: "고3", "고2", "재수" */
  grade: string;
  campus?: CaseCampus;
  /** 수강 과정 — 예: "정규반", "2026 윈터캠프" */
  program?: string;
  /** 기간 — 예: "2026.03 ~ 2026.11 (9개월)" */
  period?: string;
  track: CaseTrack;
  /** 카드 제목으로 쓰이는 한 줄 요약 — 예: "국어 5등급 → 2등급" */
  headline: string;
  /** 학과 등급 변화. 실기만 있는 사례는 빈 배열로 둔다. */
  changes: ScoreChange[];
  /** 실기 향상 서술 — 예: "기초디자인 교내 15위 → 3위" */
  practical?: string;
  /** 최종 결과 — 예: "홍익대학교 미술대학 합격" */
  result?: string;
  /** 학생·학부모 한마디 */
  quote?: string;
  /** 상단에 먼저 노출할 대표 사례 */
  featured?: boolean;
}

/* --------------------------------- 필터 --------------------------------- */

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

/* -------------------------------- 사례 데이터 ------------------------------- */

// TODO: 원장님 확인 — 아래는 전부 자리표시자. 실제 사례로 교체한 뒤
//       위의 IS_PLACEHOLDER를 false로 바꿔 주세요.
export const GRADE_CASES: GradeCase[] = [
  {
    id: "sample-01",
    name: "[김○○]",
    grade: "[고3]",
    campus: "홍대 본원",
    program: "[정규반]",
    period: "[2026.03 ~ 2026.11]",
    track: "both",
    headline: "[국어 5등급 → 2등급, 기초디자인 상위권 진입]",
    changes: [
      { subject: "국어", before: 5, after: 2, basis: "[3월 학평 → 수능]" },
      { subject: "영어", before: 4, after: 2, basis: "[3월 학평 → 수능]" },
      { subject: "탐구", before: 4, after: 3, basis: "[3월 학평 → 수능]" },
    ],
    practical: "[기초디자인 교내 평가 15위 → 3위]",
    result: "[홍익대학교 미술대학 합격]",
    quote: "[학과가 발목을 잡을 줄 알았는데, 겨울에 잡아둔 게 끝까지 갔습니다.]",
    featured: true,
  },
  {
    id: "sample-02",
    name: "[이○○]",
    grade: "[고2]",
    campus: "일산 캠퍼스",
    program: "[2026 윈터캠프]",
    period: "[2026.01 ~ 2026.02 (8주)]",
    track: "academic",
    headline: "[영어 4등급 → 2등급]",
    changes: [
      { subject: "영어", before: 4, after: 2, basis: "[11월 학평 → 3월 학평]" },
      { subject: "국어", before: 4, after: 3, basis: "[11월 학평 → 3월 학평]" },
    ],
    quote: "[매일 영단어 100개가 처음엔 힘들었는데, 8주 뒤에 등급이 올랐어요.]",
  },
  {
    id: "sample-03",
    name: "[박○○]",
    grade: "[재수]",
    campus: "홍대 본원",
    program: "[정규반]",
    period: "[2026.03 ~ 2026.11]",
    track: "practical",
    headline: "[사고의전환 기본반 → 최상위반]",
    changes: [],
    practical: "[사고의전환 기본반 시작 → 9월 최상위반 배정]",
    result: "[국민대학교 조형대학 합격]",
  },
];

/* --------------------------------- 통계 --------------------------------- */

export interface CaseStats {
  /** 전체 사례 수 */
  total: number;
  /** 등급이 오른 과목 수 */
  subjectCount: number;
  /** 평균 상승 등급 (소수 첫째 자리) — 등급 변화가 없으면 0 */
  averageRise: number;
  /** 한 과목 기준 최대 상승 폭 */
  maxRise: number;
}

/** 사례 배열에서 요약 지표를 계산한다. 데이터가 비어 있어도 안전하다. */
export function getCaseStats(cases: GradeCase[] = GRADE_CASES): CaseStats {
  const rises = cases
    .flatMap((c) => c.changes)
    .map((s) => s.before - s.after)
    .filter((rise) => rise > 0);

  const sum = rises.reduce((acc, rise) => acc + rise, 0);

  return {
    total: cases.length,
    subjectCount: rises.length,
    averageRise: rises.length
      ? Math.round((sum / rises.length) * 10) / 10
      : 0,
    maxRise: rises.length ? Math.max(...rises) : 0,
  };
}

/** 대표 사례를 앞으로 보낸 정렬본 */
export function getSortedCases(cases: GradeCase[] = GRADE_CASES): GradeCase[] {
  return [...cases].sort(
    (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)),
  );
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
  campus: "홍대 본원",
  program: "정규반",
  period: "2027.03 ~ 2027.11 (9개월)",
  track: "both",
  headline: "국어 6등급 → 3등급, 기초디자인 최상위반 진입",
  changes: [
    { subject: "국어", before: 6, after: 3, basis: "3월 학평 → 수능" },
    { subject: "탐구", before: 5, after: 2, basis: "3월 학평 → 수능" },
  ],
  practical: "기초디자인 중위반 → 최상위반",
  result: "서울대학교 디자인학부 합격",
  quote: "실기와 학과를 한 곳에서 끝낸 게 가장 컸습니다.",
  featured: false,
};
