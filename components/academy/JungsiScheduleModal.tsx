"use client";

import { useEffect, useState } from "react";

/* 2027학년도 정시 일정 (대입전형 시행계획 기준) */
type CalEvent = {
  id: string;
  /** 달력 막대 안에 표시되는 라벨 */
  label: string;
  /** 마우스오버 시 전체 정보 */
  title: string;
  start: number;
  end: number;
  /** 막대 색 (Tailwind 리터럴 클래스) */
  bar: string;
};

type CalMonth = {
  name: string;
  days: number;
  /** 1일의 요일 (일요일 시작, 0=일) */
  offset: number;
  events: CalEvent[];
};

const MONTHS: CalMonth[] = [
  {
    name: "2027년 1월",
    days: 31,
    offset: 5, // 1/1 = 금
    events: [
      {
        id: "wonseo",
        label: "원서접수",
        title: "원서접수 1. 4.(월) ~ 1. 7.(목) · 대학별 3일 이상",
        start: 4,
        end: 7,
        bar: "bg-sky-400/25 text-sky-200",
      },
      {
        id: "ga",
        label: "가군 전형",
        title: "가군 전형기간 1. 11.(월) ~ 1. 17.(일)",
        start: 11,
        end: 17,
        bar: "bg-accent/30 text-accent",
      },
      {
        id: "na",
        label: "나군 전형",
        title: "나군 전형기간 1. 18.(월) ~ 1. 24.(일)",
        start: 18,
        end: 24,
        bar: "bg-emerald-400/25 text-emerald-200",
      },
      {
        id: "da",
        label: "다군 전형",
        title: "다군 전형기간 1. 25.(월) ~ 1. 31.(일)",
        start: 25,
        end: 31,
        bar: "bg-violet-400/30 text-violet-200",
      },
    ],
  },
  {
    name: "2027년 2월",
    days: 28,
    offset: 1, // 2/1 = 월
    events: [
      {
        id: "balpyo",
        label: "합격 발표",
        title: "합격자 발표 2. 5.(금)까지",
        start: 5,
        end: 5,
        bar: "bg-white/25 text-white",
      },
      {
        id: "deungrok",
        label: "합격자 등록",
        title: "합격자 등록 2. 10.(수) ~ 2. 12.(금)",
        start: 10,
        end: 12,
        bar: "bg-rose-400/25 text-rose-200",
      },
      {
        id: "chungwon",
        label: "충원 통보",
        title:
          "미등록 충원 합격 통보 2. 13.(토) ~ 2. 17.(수) · 발표 18시까지 (홈페이지 발표는 14시까지)",
        start: 13,
        end: 17,
        bar: "bg-amber-300/25 text-amber-200",
      },
      {
        id: "chungwon-end",
        label: "충원 등록",
        title: "미등록 충원 등록 마감 2. 18.(목) 22시까지",
        start: 18,
        end: 18,
        bar: "bg-orange-400/30 text-orange-200",
      },
      {
        id: "chuga",
        label: "추가모집",
        title: "추가모집 2. 19.(금) ~ 2. 26.(금) · 등록 2. 26.(금) 22시까지",
        start: 19,
        end: 26,
        bar: "bg-teal-400/25 text-teal-200",
      },
    ],
  },
];

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

/** 달을 일요일 시작 주 단위(7칸, 빈칸은 null)로 자른다 */
function buildWeeks(month: CalMonth): (number | null)[][] {
  const cells: (number | null)[] = [
    ...Array<null>(month.offset).fill(null),
    ...Array.from({ length: month.days }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

function WeekRow({
  week,
  events,
}: {
  week: (number | null)[];
  events: CalEvent[];
}) {
  const days = week.filter((d): d is number => d != null);
  const first = days[0];
  const last = days[days.length - 1];

  /* 이 주에 걸치는 일정 → 막대 구간으로 변환 */
  const bars = events
    .map((e) => {
      const s = Math.max(e.start, first);
      const t = Math.min(e.end, last);
      if (s > t) return null;
      return { event: e, colStart: week.indexOf(s) + 1, colEnd: week.indexOf(t) + 2 };
    })
    .filter(Boolean) as { event: CalEvent; colStart: number; colEnd: number }[];

  return (
    <div className="grid min-h-[3.6rem] grid-cols-7 border-t border-white/5 pt-1.5 pb-2">
      {week.map((day, c) => (
        <span
          key={c}
          style={{ gridColumn: c + 1, gridRow: 1 }}
          className={`pb-1 text-center font-mono text-[12px] ${
            day == null
              ? ""
              : c === 0
                ? "text-red-300/70"
                : "text-white/65"
          }`}
        >
          {day ?? ""}
        </span>
      ))}
      {bars.map(({ event, colStart, colEnd }) => (
        <span
          key={event.id}
          title={event.title}
          style={{ gridColumn: `${colStart} / ${colEnd}`, gridRow: 2 }}
          className={`mx-0.5 flex h-5 min-w-0 items-center justify-center truncate rounded px-1 text-[11px] font-medium ${event.bar}`}
        >
          {event.label}
        </span>
      ))}
    </div>
  );
}

function MonthCalendar({ month }: { month: CalMonth }) {
  return (
    <div>
      <div className="grid grid-cols-7 pb-1.5">
        {WEEKDAYS.map((d, i) => (
          <span
            key={d}
            className={`text-center text-[12px] ${
              i === 0 ? "text-red-300/70" : "text-white/50"
            }`}
          >
            {d}
          </span>
        ))}
      </div>
      {buildWeeks(month).map((week, i) => (
        <WeekRow key={i} week={week} events={month.events} />
      ))}
    </div>
  );
}

export default function JungsiScheduleModal() {
  const [open, setOpen] = useState(false);
  const [monthIdx, setMonthIdx] = useState(0);
  const month = MONTHS[monthIdx];

  useEffect(() => {
    if (!open) return;
    setMonthIdx(0);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-6 inline-flex items-center gap-2 rounded-full border border-accent/50 px-5 py-2.5 text-sm font-medium text-accent transition-colors hover:bg-accent/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <svg
          aria-hidden
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        2027학년도 정시일정 보기
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="2027학년도 정시모집 일정"
        >
          <div
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="relative max-h-[88vh] w-full max-w-xl overflow-y-auto rounded-xl border border-white/15 bg-[#0a0a0a] p-5 text-left shadow-2xl md:p-7">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="mb-1 text-[12px] tracking-[0.25em] text-accent">
                  2027학년도
                </p>
                <h2 className="text-lg font-bold leading-snug text-white">
                  정시모집 일정
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="닫기"
                className="-mr-1 -mt-1 rounded p-1.5 text-white/50 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-accent"
              >
                <svg
                  aria-hidden
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="mb-3 flex items-center justify-center gap-5">
              <button
                type="button"
                onClick={() => setMonthIdx((i) => Math.max(0, i - 1))}
                disabled={monthIdx === 0}
                aria-label="이전 달"
                className="rounded p-1.5 text-white/60 transition-colors hover:text-white disabled:cursor-default disabled:opacity-25 focus-visible:outline-2 focus-visible:outline-accent"
              >
                <svg
                  aria-hidden
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <p className="w-28 text-center font-mono text-[15px] font-bold text-white">
                {month.name}
              </p>
              <button
                type="button"
                onClick={() =>
                  setMonthIdx((i) => Math.min(MONTHS.length - 1, i + 1))
                }
                disabled={monthIdx === MONTHS.length - 1}
                aria-label="다음 달"
                className="rounded p-1.5 text-white/60 transition-colors hover:text-white disabled:cursor-default disabled:opacity-25 focus-visible:outline-2 focus-visible:outline-accent"
              >
                <svg
                  aria-hidden
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>

            <MonthCalendar month={month} />

            <p className="mt-4 border-t border-white/10 pt-4 text-[12px] leading-relaxed text-white/50">
              2027학년도 대입전형 시행계획 기준 · 충원 합격 통보는 2. 17.(수)
              18시, 충원 등록은 2. 18.(목) 22시, 추가모집 등록은 2. 26.(금)
              22시까지 · 대학별 세부 일정은 각 대학 모집요강을 확인하세요.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
