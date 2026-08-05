/**
 * 윈터스쿨 하루 일과표 데이터 단일 소스.
 * /winter/schedule 페이지가 이 파일만 참조한다.
 * 시간표가 바뀌면 컴포넌트는 건드리지 말고 이 파일만 고치면 된다.
 *
 * 일과표는 평일·주말을 나란히 놓은 한 장의 표로 그려진다. 두 요일의 시각이
 * 갈리는 지점마다 행이 하나씩 생기고, 여러 행에 걸치는 일정은 셀을 합친다.
 * 그래서 각 항목은 시작·끝 시각을 모두 가진다.
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

/**
 * 표가 그려지는 범위 — 깨어 있는 시간만 그린다.
 * 22:00 취침 → 06:00 기상, 즉 매일 8시간 수면이 이 두 값에 들어 있다.
 */
export const WAKE_TIME = "06:00";
export const SLEEP_TIME = "22:00";
export const SLEEP_HOURS = 8;

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
    note: "주 2회 국어 · 영어 모의고사",
    type: "hakgwa",
  },
  { start: "17:25", end: "18:10", label: "저녁 시간", short: "저녁", type: "life" },
  {
    start: "18:10",
    end: "21:50",
    label: "자기주도 학습",
    short: "자기주도",
    type: "hakgwa",
  },
  {
    start: "21:50",
    end: "22:00",
    label: "영어 100단어 시험",
    short: "단어 시험",
    type: "hakgwa",
  },
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
    end: "22:00",
    label: "대학교 유형 미술실기",
    short: "대학 유형 실기",
    type: "silgi",
  },
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

/** 깨어 있는 시간의 총량(분) — 06:00부터 22:00까지 */
export const AWAKE_MINUTES = toMinutes(SLEEP_TIME) - toMinutes(WAKE_TIME);

/* ------------------------------ 표의 행과 셀 ------------------------------ */

/**
 * 평일·주말의 시각이 갈리는 지점 = 표의 행이 시작하는 시각.
 * 두 요일을 한 표에 나란히 놓기 위해 시작 시각을 모두 모아 정렬한다.
 */
export const ROW_STARTS: string[] = Array.from(
  new Set([...WEEKDAY_SCHEDULE, ...WEEKEND_SCHEDULE].map((b) => b.start)),
).sort((a, b) => toMinutes(a) - toMinutes(b));

/** 표에 그려지는 시각 눈금 — 각 행의 시작에 마지막 취침 시각을 더한 것 */
export const ROW_TIMES: string[] = [...ROW_STARTS, SLEEP_TIME];

export type ScheduleCell = {
  block: TimeBlock;
  /** ROW_STARTS 안에서의 시작 행 번호 (0부터) */
  row: number;
  /** 몇 개의 행에 걸치는지 — 1보다 크면 셀을 합친다 */
  span: number;
};

/** 하루 일정을 표의 셀로 — 다른 요일 때문에 생긴 행까지 함께 덮게 한다 */
export function cellsOf(blocks: TimeBlock[]): ScheduleCell[] {
  return blocks.map((block) => {
    const row = ROW_STARTS.indexOf(block.start);
    const after = ROW_STARTS.findIndex((t) => toMinutes(t) >= toMinutes(block.end));
    const end = after === -1 ? ROW_STARTS.length : after;
    return { block, row, span: end - row };
  });
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
  /* 모의고사는 주 2회지만 요일을 못박지 않는다 — 아래 WEEKLY_FIXTURES로만 안내한다 */
  { day: "월", focus: "hakgwa", highlight: "영단어 시험" },
  { day: "화", focus: "hakgwa", highlight: "영단어 시험" },
  { day: "수", focus: "hakgwa", highlight: "영단어 시험" },
  { day: "목", focus: "hakgwa", highlight: "영단어 시험" },
  { day: "금", focus: "hakgwa", highlight: "영단어 시험" },
  { day: "토", focus: "silgi", highlight: "대학교 유형 실기" },
  { day: "일", focus: "silgi", highlight: "대학교 유형 실기" },
];

/** 요일과 무관하게 매일·매주 고정으로 반복되는 것들 */
export const WEEKLY_FIXTURES: { label: string; detail: string }[] = [
  {
    label: "평일 매일 밤 21:50",
    detail: "영어 100단어 시험 — 주 500단어, 8주간 4,000단어",
  },
  {
    label: "주 2회",
    detail: "국어 · 영어 모의고사 — 요일은 주차별 진도에 맞춰 공지",
  },
  {
    label: "매일 06:00 / 22:00",
    detail: "기상·취침 시각 고정 — 8주 내내 하루 8시간 수면 확보",
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
    desc: "입소 전 레벨 테스트로 실기 수준을 확인해 반을 나눕니다. 기초가 필요한 학생은 소묘·발상과 표현부터 8주간 다지고, 담당 강사가 개별 피드백을 붙입니다.",
  },
  {
    title: "실기는 끊기지 않을 만큼",
    desc: "겨울은 학과의 골든타임입니다. 실기는 감을 잃지 않도록 주말 집중 방식으로 유지하고, 평일은 학과에 전부 씁니다.",
  },
];
