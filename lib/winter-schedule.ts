/**
 * 윈터캠프 하루 일과표 데이터 단일 소스.
 * /winter/schedule 페이지가 이 파일만 참조한다.
 * 시간표가 바뀌면 컴포넌트는 건드리지 말고 이 파일만 고치면 된다.
 */

export type ScheduleType = "silgi" | "hakgwa" | "life";

export type ScheduleRow = { time: string; label: string; type: ScheduleType };

/** 2027학년도 시간표 기준 — 평일은 학과에 전부 쓴다 */
export const WEEKDAY_SCHEDULE: ScheduleRow[] = [
  { time: "06:00", label: "기상 · 아침식사 · 0교시 자기주도", type: "life" },
  {
    time: "09:00",
    label: "학과 수업 — 국어 · 영어 · 탐구 (요일별)",
    type: "hakgwa",
  },
  { time: "12:50", label: "점심 시간", type: "life" },
  {
    time: "13:35",
    label: "학과 클리닉 — 국어 · 영어 클리닉 / 탐구",
    type: "hakgwa",
  },
  {
    time: "15:50",
    label: "자기주도 학습 (화 영어 · 금 국어 모의고사)",
    type: "hakgwa",
  },
  { time: "17:25", label: "저녁 시간", type: "life" },
  { time: "18:10", label: "자기주도 학습", type: "hakgwa" },
  { time: "22:20", label: "영어 100단어 시험", type: "hakgwa" },
  { time: "22:40", label: "취침", type: "life" },
];

/** 주말은 대학교 유형 실기에 온전히 쓴다 */
export const WEEKEND_SCHEDULE: ScheduleRow[] = [
  { time: "09:00", label: "대학교 유형 미술실기", type: "silgi" },
  { time: "12:50", label: "점심 시간", type: "life" },
  { time: "13:35", label: "대학교 유형 미술실기", type: "silgi" },
  { time: "17:25", label: "저녁 시간", type: "life" },
  { time: "18:10", label: "대학교 유형 미술실기", type: "silgi" },
  { time: "22:30", label: "취침", type: "life" },
];

export const SCHEDULE_STYLE: Record<
  ScheduleType,
  { dot: string; text: string; label: string }
> = {
  silgi: { dot: "bg-accent", text: "text-accent", label: "실기" },
  hakgwa: { dot: "bg-sky-400", text: "text-sky-400", label: "학과" },
  life: { dot: "bg-white/30", text: "text-white/50", label: "생활" },
};

/* ----------------------------- 주간 반복 구조 ----------------------------- */

export type WeeklyDay = {
  /** 요일 한 글자 */
  day: string;
  /** 그날의 중심 — 학과인지 실기인지 */
  focus: Extract<ScheduleType, "hakgwa" | "silgi">;
  /** 그날에만 있는 일정. 없으면 비워 둔다. */
  highlight?: string;
};

/** 8주 내내 반복되는 한 주의 모양 — 한눈에 보이게 하는 것이 목적이다 */
export const WEEKLY_PATTERN: WeeklyDay[] = [
  { day: "월", focus: "hakgwa" },
  { day: "화", focus: "hakgwa", highlight: "영어 모의고사" },
  { day: "수", focus: "hakgwa" },
  { day: "목", focus: "hakgwa" },
  { day: "금", focus: "hakgwa", highlight: "국어 모의고사" },
  { day: "토", focus: "silgi", highlight: "대학교 유형 실기" },
  { day: "일", focus: "silgi", highlight: "대학교 유형 실기" },
];

/** 요일과 무관하게 매일·매주 고정으로 반복되는 것들 */
export const WEEKLY_FIXTURES: { label: string; detail: string }[] = [
  {
    label: "매일 밤 22:20",
    detail: "영어 100단어 시험 — 8주간 5,000단어",
  },
  {
    label: "주 2회",
    detail: "화요일 영어 · 금요일 국어 모의고사",
  },
  {
    label: "매일 06:00 / 22:40",
    detail: "기상·취침 시각 고정 — 8주간 생활 리듬을 흔들지 않는다",
  },
  {
    label: "격주",
    detail: "학습·생활 리포트를 학부모님께 발송",
  },
];

/** 주말 실기 운영 원칙 */
export const WEEKEND_POINTS: { title: string; desc: string }[] = [
  {
    title: "대학교 유형 실기",
    desc: "목표 대학의 출제 유형에 맞춘 실기 훈련을 주말에 집중 진행합니다.",
  },
  {
    title: "레벨 테스트 후 수준별 분반",
    desc: "[기초 소묘·발상과 표현 등 실기 기초를 8주간 집중적으로 다집니다. 레벨 테스트 후 수준별 분반, 담당 강사 개별 피드백 진행]" /* TODO: 원장님 확인 */,
  },
  {
    title: "실기는 끊기지 않을 만큼",
    desc: "겨울은 학과의 골든타임입니다. 실기는 감을 잃지 않도록 주말 집중 방식으로 유지하고, 평일은 학과에 전부 씁니다.",
  },
];
