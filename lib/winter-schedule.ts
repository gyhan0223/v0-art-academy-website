/**
 * 윈터스쿨 하루 일과표 데이터 단일 소스.
 * /winter/schedule 페이지가 이 파일만 참조한다.
 * 시간표가 바뀌면 컴포넌트는 건드리지 말고 이 파일만 고치면 된다.
 *
 * 일과표는 "몇 시에 무엇" 목록이 아니라 한 시간 단위로 끊긴 타임라인 위에
 * 블록으로 그려진다. 그래서 각 항목은 시작·끝 시각을 모두 가진다.
 */

export type ScheduleType = "silgi" | "hakgwa" | "life";

export type TimeBlock = {
  /** "HH:MM" */
  start: string;
  /** "HH:MM" — 다음 블록의 시작과 붙여 둔다. 하루에 빈틈이 없어야 한다. */
  end: string;
  /** 넓은 화면에서 쓰는 이름 */
  label: string;
  /** 좁은 화면에서 쓰는 짧은 이름 */
  short: string;
  /** 블록이 충분히 길 때만 함께 보여 주는 부연 */
  note?: string;
  type: ScheduleType;
};

/** 타임라인이 그려지는 하루의 범위 */
export const DAY_START = "06:00";
export const DAY_END = "23:00";

/** 2027학년도 시간표 기준 — 평일은 학과에 전부 쓴다 */
export const WEEKDAY_SCHEDULE: TimeBlock[] = [
  {
    start: "06:00",
    end: "09:00",
    label: "기상 · 아침식사 · 0교시 자기주도",
    short: "기상 · 아침 · 0교시",
    type: "life",
  },
  {
    start: "09:00",
    end: "12:50",
    label: "학과 수업",
    short: "학과 수업",
    note: "국어 · 영어 · 탐구 (요일별)",
    type: "hakgwa",
  },
  { start: "12:50", end: "13:35", label: "점심 시간", short: "점심", type: "life" },
  {
    start: "13:35",
    end: "15:50",
    label: "학과 클리닉",
    short: "학과 클리닉",
    note: "국어 · 영어 클리닉 / 탐구",
    type: "hakgwa",
  },
  {
    start: "15:50",
    end: "17:25",
    label: "자기주도 학습",
    short: "자기주도",
    note: "화 영어 · 금 국어 모의고사",
    type: "hakgwa",
  },
  { start: "17:25", end: "18:10", label: "저녁 시간", short: "저녁", type: "life" },
  {
    start: "18:10",
    end: "22:20",
    label: "자기주도 학습",
    short: "자기주도",
    type: "hakgwa",
  },
  {
    start: "22:20",
    end: "22:40",
    label: "영어 100단어 시험",
    short: "단어 시험",
    type: "hakgwa",
  },
  { start: "22:40", end: "23:00", label: "취침", short: "취침", type: "life" },
];

/** 주말은 대학교 유형 실기에 온전히 쓴다 */
export const WEEKEND_SCHEDULE: TimeBlock[] = [
  {
    start: "06:00",
    end: "09:00",
    label: "기상 · 아침식사",
    short: "기상 · 아침",
    type: "life",
  },
  {
    start: "09:00",
    end: "12:50",
    label: "대학교 유형 미술실기",
    short: "대학 유형 실기",
    note: "목표 대학 출제 유형 훈련",
    type: "silgi",
  },
  { start: "12:50", end: "13:35", label: "점심 시간", short: "점심", type: "life" },
  {
    start: "13:35",
    end: "17:25",
    label: "대학교 유형 미술실기",
    short: "대학 유형 실기",
    note: "수준별 분반 · 강사 개별 피드백",
    type: "silgi",
  },
  { start: "17:25", end: "18:10", label: "저녁 시간", short: "저녁", type: "life" },
  {
    start: "18:10",
    end: "22:30",
    label: "대학교 유형 미술실기",
    short: "대학 유형 실기",
    type: "silgi",
  },
  { start: "22:30", end: "23:00", label: "취침", short: "취침", type: "life" },
];

export const SCHEDULE_STYLE: Record<
  ScheduleType,
  { dot: string; text: string; label: string; block: string; title: string }
> = {
  silgi: {
    dot: "bg-accent",
    text: "text-accent",
    label: "실기",
    block: "border-accent bg-accent/[0.12]",
    title: "text-white",
  },
  hakgwa: {
    dot: "bg-sky-400",
    text: "text-sky-400",
    label: "학과",
    block: "border-sky-400 bg-sky-400/[0.10]",
    title: "text-white",
  },
  life: {
    dot: "bg-white/30",
    text: "text-white/40",
    label: "생활",
    block: "border-white/20 bg-white/[0.03]",
    title: "text-white/50",
  },
};

/* ------------------------------ 시간 계산 도구 ----------------------------- */

/** "HH:MM" → 자정 기준 분 */
export function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function durationOf(block: TimeBlock): number {
  return toMinutes(block.end) - toMinutes(block.start);
}

/** 분 → "3시간 50분" */
export function durationLabel(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return `${m}분`;
  if (!m) return `${h}시간`;
  return `${h}시간 ${m}분`;
}

/** 타임라인 전체 길이(분) — 위치를 비율로 환산할 때 쓴다 */
export const DAY_MINUTES = toMinutes(DAY_END) - toMinutes(DAY_START);

/** 하루 범위 안의 정시 눈금 — [6, 7, ... 23] */
export const HOUR_MARKS: number[] = Array.from(
  { length: Math.floor(toMinutes(DAY_END) / 60) - Math.ceil(toMinutes(DAY_START) / 60) + 1 },
  (_, i) => Math.ceil(toMinutes(DAY_START) / 60) + i,
);

/** 자정 기준 분 → 타임라인 상단에서의 위치(%) */
export function offsetPercent(minutes: number): number {
  return ((minutes - toMinutes(DAY_START)) / DAY_MINUTES) * 100;
}

/** 길이(분) → 타임라인에서 차지하는 높이(%) */
export function heightPercent(minutes: number): number {
  return (minutes / DAY_MINUTES) * 100;
}

/** 유형이 놓이는 순서 — 그날의 중심이 먼저 온다 */
const TYPE_ORDER: ScheduleType[] = ["silgi", "hakgwa", "life"];

export type TypeShare = { type: ScheduleType; minutes: number; ratio: number };

/** 하루를 유형별로 몇 분씩 쓰는지 — 시간 배분 막대에 쓴다 */
export function summarize(blocks: TimeBlock[]): TypeShare[] {
  const total = blocks.reduce((sum, b) => sum + durationOf(b), 0);
  return TYPE_ORDER.map((type) => {
    const minutes = blocks
      .filter((b) => b.type === type)
      .reduce((sum, b) => sum + durationOf(b), 0);
    return { type, minutes, ratio: total ? minutes / total : 0 };
  }).filter((share) => share.minutes > 0);
}

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
