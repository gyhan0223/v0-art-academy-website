/**
 * /diagnosis 온보딩 진단 전용 데이터 모델.
 *
 * 기존 lib/jungsi-recommend.ts 의 StudentScore(백분위 4칸)는 그대로 두고,
 * 여기서는 성적표 원본(표준점수·백분위·등급·선택과목·탐구 2과목)을
 * 최대한 그대로 담는 상세 모델을 별도로 둔다.
 * 대학마다 실제 반영 지표가 달라서, 원본을 버리면 나중에 정확한
 * 대학별 환산을 붙일 수 없다.
 */

/* ------------------------------- 학년 분기 ------------------------------- */

export type DiagnosisGrade = "중3 이하" | "고1" | "고2" | "고3" | "N수생";

export const DIAGNOSIS_GRADES: DiagnosisGrade[] = [
  "중3 이하",
  "고1",
  "고2",
  "고3",
  "N수생",
];

/**
 * 결과 화면 분기 기준.
 * - simulation: 현재 지원권 + "한 등급 상승" 비교 (고2·고3·N수)
 * - target: 희망 대학까지의 거리 시각화 (고1·중3 이하)
 * 기준이 바뀌면 이 상수만 고치면 된다.
 */
export const SIMULATION_BRANCH_GRADES: DiagnosisGrade[] = ["고2", "고3", "N수생"];

export type ResultBranch = "simulation" | "target";

export function resultBranchOf(grade: DiagnosisGrade): ResultBranch {
  return SIMULATION_BRANCH_GRADES.includes(grade) ? "simulation" : "target";
}

/** 고2 이하는 2027보다 이후 입시 대상 — 결과 하단 안내문 분기에 사용 */
export const FUTURE_ADMISSION_GRADES: DiagnosisGrade[] = [
  "중3 이하",
  "고1",
  "고2",
];

/* --------------------------------- 성별 --------------------------------- */

export type DiagnosisGender = "남학생" | "여학생";

/* ------------------------------ 준비 중 실기 ------------------------------ */

/**
 * 진단에서 고르는 실기 과목.
 * 기존 PrepTrack(기초디자인·기초소양 2종)은 기존 페이지용으로 그대로 두고,
 * 여기서는 실제 학생들이 준비하는 과목 전체를 다룬다.
 * "모름"은 실기 조건으로 대학을 걸러내지 않는다.
 */
export type DiagnosisSilgi =
  | "기초디자인"
  | "발상과 표현"
  | "기초조형·소양평가"
  | "소묘"
  | "수채화·수묵담채"
  | "소조·입체"
  | "만화·상황표현"
  | "통합·자체실기"
  | "비실기"
  | "모름";

// 기초조형·소양평가(학원 강점 유형)를 첫 번째로 노출한다.
// hint의 대학명은 lib/jungsi-data.ts 실기 내용 기준 대표 예시 — 데이터가 바뀌면 함께 갱신한다.
export const DIAGNOSIS_SILGI_OPTIONS: {
  value: DiagnosisSilgi;
  label: string;
  hint?: string;
}[] = [
  { value: "기초조형·소양평가", label: "기초조형·소양평가", hint: "국민대 · 성균관대 · 고려대 등" },
  { value: "기초디자인", label: "기초디자인", hint: "숙명여대 · 건국대 · 서울과기대 등" },
  { value: "발상과 표현", label: "발상과 표현", hint: "고려대 · 서경대 · 삼육대 등" },
  { value: "소묘", label: "소묘", hint: "중앙대 · 건국대(현대미술) 등" },
  { value: "수채화·수묵담채", label: "수채화·수묵담채", hint: "성균관대 · 경희대 · 숙명여대 등" },
  { value: "소조·입체", label: "소조·입체", hint: "서울시립대 · 국민대 · 경희대 등" },
  { value: "만화·상황표현", label: "만화·상황표현", hint: "경기대(애니메이션) 등" },
  { value: "통합·자체실기", label: "통합·자체실기", hint: "서울대 · 이화여대 · 서울시립대 · 한예종 등" },
  { value: "비실기", label: "비실기(수능·서류)", hint: "홍익대 · 고려대(자유전공) 등" },
  { value: "모름", label: "아직 잘 모르겠어요" },
];

/* ------------------------------ 상세 성적 모델 ----------------------------- */

/** 한 과목의 성적표 원본 값. 모르는 값은 null로 비워 둔다. */
export type ScoreValue = {
  grade: number | null; // 등급 1~9
  standardScore: number | null; // 표준점수
  percentile: number | null; // 백분위 0~100
};

export const MATH_SUBJECTS = ["확률과통계", "미적분", "기하"] as const;
export type MathSubject = (typeof MATH_SUBJECTS)[number];

export type InquiryScore = ScoreValue & {
  /** 과목명 — 예: "생활과윤리" */
  subject: string;
  notTaken: boolean;
};

export type DetailedStudentScore = {
  korean: ScoreValue;
  math: ScoreValue & { subject: MathSubject | null; notTaken: boolean };
  english: { grade: number | null };
  /** 탐구는 두 과목을 평균으로 합치지 않고 원본 그대로 둔다 */
  inquiry1: InquiryScore;
  inquiry2: InquiryScore;
  koreanHistory: { grade: number | null };
};

export function createEmptyScore(): DetailedStudentScore {
  const empty = (): ScoreValue => ({
    grade: null,
    standardScore: null,
    percentile: null,
  });
  return {
    korean: empty(),
    math: { ...empty(), subject: null, notTaken: false },
    english: { grade: null },
    inquiry1: { ...empty(), subject: "", notTaken: false },
    inquiry2: { ...empty(), subject: "", notTaken: false },
    koreanHistory: { grade: null },
  };
}

/**
 * 결과 정확도 구분.
 * - detailed: 표준점수·백분위가 하나라도 있음 → "성적표 기준 분석"
 * - grade-only: 등급만 있음 → "등급 기준 예상"
 * 사용자에게 confidence 숫자는 보여주지 않는다.
 */
export type ScoreDetailLevel = "detailed" | "grade-only";

export function scoreDetailLevel(d: DetailedStudentScore): ScoreDetailLevel {
  const hasDetail = [d.korean, d.math, d.inquiry1, d.inquiry2].some(
    (v) => v.percentile != null || v.standardScore != null,
  );
  return hasDetail ? "detailed" : "grade-only";
}
