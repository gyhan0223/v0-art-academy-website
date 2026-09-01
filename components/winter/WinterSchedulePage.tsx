"use client";

/**
 * /winter/schedule — 하루 일과표.
 * 평일 시간표(학과 중심) · 주말 시간표(대학 유형별 실기) · 주간 반복 구조.
 * 시간표 데이터는 lib/winter-schedule.ts에만 있다.
 */

import { motion } from "framer-motion";
import { Palette } from "lucide-react";
import {
  WEEKDAY_SCHEDULE,
  WEEKEND_SCHEDULE,
  WEEKLY_PATTERN,
  WEEKLY_FIXTURES,
  WEEKEND_POINTS,
  SCHEDULE_STYLE,
  ROW_STARTS,
  ROW_TIMES,
  AWAKE_MINUTES,
  SLEEP_HOURS,
  WAKE_TIME,
  SLEEP_TIME,
  cellsOf,
  durationOf,
  durationLabel,
  summarize,
  type ScheduleCell,
  type TimeBlock,
} from "@/lib/winter-schedule";
import CtaBand from "@/components/winter/CtaBand";
import MobileActionBar from "@/components/winter/MobileActionBar";
import {
  fadeUp,
  SectionHead,
  SubPageHeader,
  WinterTabs,
} from "@/components/winter/shared";

/**
 * 표의 첫 줄은 요일 머리, 그 다음부터 시각 행이 온다.
 * CSS 그리드 행 번호는 1부터라 시각 행 i는 i + 2가 된다.
 */
const gridRowOf = (i: number) => i + 2;

/** 취침 줄 — 시각 행 아래에 한 줄 더 붙는다 */
const SLEEP_ROW = gridRowOf(ROW_STARTS.length);

/** 요일 머리 — 이름과 그날 시간이 유형별로 어떻게 갈리는지 */
function DayHead({
  title,
  sub,
  blocks,
  column,
}: {
  title: string;
  sub: string;
  blocks: TimeBlock[];
  column: number;
}) {
  const shares = summarize(blocks);
  return (
    <div
      className="flex flex-col justify-end gap-1.5 pb-2"
      style={{ gridColumn: column, gridRow: 1 }}
    >
      <p className="text-sm md:text-base font-bold text-white break-keep">
        {title}{" "}
        <span className="text-[11px] md:text-xs font-medium text-white/50">{sub}</span>
      </p>
      <dl className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
        {shares.map((share) => (
          <div key={share.type} className="flex items-center gap-1">
            <span
              className={`h-1.5 w-1.5 shrink-0 rounded-full ${SCHEDULE_STYLE[share.type].dot}`}
            />
            <dt className="text-[10px] md:text-[12px] text-white/55">
              {SCHEDULE_STYLE[share.type].label}
            </dt>
            <dd className="text-[10px] md:text-[12px] font-medium tabular-nums text-white/75">
              {durationLabel(share.minutes)}
            </dd>
          </div>
        ))}
      </dl>
      <div className="flex h-1 overflow-hidden rounded-full bg-white/5">
        {shares.map((share) => (
          <span
            key={share.type}
            className={SCHEDULE_STYLE[share.type].dot}
            style={{ width: `${share.ratio * 100}%` }}
          />
        ))}
      </div>
    </div>
  );
}

/** 표의 칸 하나 — 다른 요일 때문에 생긴 행까지 덮을 때는 셀을 합친다 */
function SlotCell({ cell, column }: { cell: ScheduleCell; column: number }) {
  const style = SCHEDULE_STYLE[cell.block.type];
  return (
    <div
      className={`flex flex-col justify-center rounded-lg border-l-[3px] px-2 py-1.5 md:px-3.5 md:py-2.5 ${style.block}`}
      style={{
        gridColumn: column,
        gridRow: `${gridRowOf(cell.row)} / span ${cell.span}`,
      }}
    >
      <p
        className={`text-[12px] md:text-sm font-semibold leading-snug break-keep ${style.title}`}
      >
        <span className="md:hidden">{cell.block.short}</span>
        <span className="hidden md:inline">{cell.block.label}</span>
      </p>
      <p
        className={`mt-0.5 text-[10px] md:text-[12px] tabular-nums ${style.text}`}
      >
        {durationLabel(durationOf(cell.block))}
      </p>
      {cell.block.note && (
        <p className="mt-1 hidden md:block text-[12px] leading-relaxed text-white/50 break-keep">
          {cell.block.note}
        </p>
      )}
    </div>
  );
}

/** 평일과 주말을 한 표에 나란히 — 스크롤 없이 하루가 한눈에 들어오게 한다 */
function ScheduleTable() {
  return (
    <div className="grid auto-rows-[minmax(2.5rem,auto)] grid-cols-[42px_1fr_1fr] gap-x-1.5 gap-y-1 md:auto-rows-[minmax(3rem,auto)] md:grid-cols-[56px_1fr_1fr] md:gap-x-3 md:gap-y-1.5">
      <DayHead title="평일" sub="월–금" blocks={WEEKDAY_SCHEDULE} column={2} />
      <DayHead title="주말" sub="토·일" blocks={WEEKEND_SCHEDULE} column={3} />

      {/* 왼쪽 시각 눈금 — 각 행이 시작하는 시각을 행 맨 위에 세운다 */}
      {ROW_TIMES.map((time, i) => (
        <span
          key={time}
          className="pt-1.5 text-right font-mono text-[11px] md:text-xs tabular-nums text-white/45"
          style={{ gridColumn: 1, gridRow: gridRowOf(i) }}
        >
          {time}
        </span>
      ))}

      {cellsOf(WEEKDAY_SCHEDULE).map((cell) => (
        <SlotCell key={`weekday-${cell.block.start}`} cell={cell} column={2} />
      ))}
      {cellsOf(WEEKEND_SCHEDULE).map((cell) => (
        <SlotCell key={`weekend-${cell.block.start}`} cell={cell} column={3} />
      ))}

      {/* 취침은 두 요일이 같다 — 한 칸으로 합쳐 8시간 수면을 못박는다 */}
      <div
        className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 rounded-lg border border-dashed border-white/15 bg-white/[0.02] px-2.5 py-2 md:px-3.5"
        style={{ gridColumn: "2 / span 2", gridRow: SLEEP_ROW }}
      >
        <span className="text-[12px] md:text-sm font-semibold text-white/70">
          취침
        </span>
        <span className="text-[11px] md:text-xs text-white/50 break-keep">
          다음 날 {WAKE_TIME} 기상까지 — 매일 {SLEEP_HOURS}시간 수면
        </span>
      </div>
    </div>
  );
}

export default function WinterSchedulePage() {
  return (
    <main className="bg-background text-foreground pb-20 md:pb-0">
      <section className="px-5 pt-28 md:px-6 md:pt-32">
        <div className="mx-auto max-w-4xl">
          <SubPageHeader
            en="Daily Routine"
            title="하루 일과표"
            sub="평일은 학과에만, 주말은 대학교 유형 미술실기에 집중합니다. 06:00 기상·22:00 취침으로 8주 내내 하루 8시간 수면을 지킵니다."
          />
          <WinterTabs className="mt-8" />
        </div>
      </section>

      {/* ---- 평일 · 주말 시간표 ---- */}
      <section className="px-5 py-16 md:px-6 md:py-20">
        <div className="mx-auto max-w-4xl">
          {/* 평일과 주말을 같은 시각 눈금 위에 나란히 놓는다 */}
          <motion.div {...fadeUp}>
            <ScheduleTable />
          </motion.div>

          <motion.p
            {...fadeUp}
            className="mt-5 text-center text-[13px] leading-relaxed text-white/50 break-keep"
          >
            ※ {WAKE_TIME} 기상부터 {SLEEP_TIME} 취침까지, 깨어 있는 하루{" "}
            {durationLabel(AWAKE_MINUTES)}입니다.
            <br className="hidden sm:block" /> 수업시간은 효율에 따라 변경될 수
            있습니다.
          </motion.p>
        </div>
      </section>

      {/* ---- 주간 반복 구조 ---- */}
      <section className="border-y border-white/5 bg-[#05050a] px-5 py-20 md:px-6 md:py-28">
        <div className="mx-auto max-w-4xl">
          <SectionHead
            en="Weekly Pattern"
            ko="8주 동안 반복되는 한 주"
            sub="한 주의 모양이 8번 반복됩니다. 무엇이 언제 오는지 학생도 미리 압니다."
          />

          {/* 요일 띠 */}
          <motion.div {...fadeUp} className="grid grid-cols-7 gap-1.5 md:gap-3">
            {WEEKLY_PATTERN.map((day) => {
              const style = SCHEDULE_STYLE[day.focus];
              const isSilgi = day.focus === "silgi";
              return (
                <div
                  key={day.day}
                  className={`rounded-xl border px-1.5 py-4 text-center md:px-3 md:py-6 ${
                    isSilgi
                      ? "border-accent/40 bg-accent/[0.07]"
                      : "border-sky-400/25 bg-sky-400/[0.05]"
                  }`}
                >
                  <p className="text-sm md:text-base font-bold text-white">
                    {day.day}
                  </p>
                  <p
                    className={`mt-2 text-[11px] md:text-sm font-semibold ${style.text}`}
                  >
                    {style.label}
                  </p>
                  {day.highlight && (
                    <p className="mt-2 text-[11px] md:text-xs leading-snug text-white/60 break-keep">
                      {day.highlight}
                    </p>
                  )}
                </div>
              );
            })}
          </motion.div>

          {/* 매주 고정으로 반복되는 것 */}
          <motion.dl
            {...fadeUp}
            className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          >
            {WEEKLY_FIXTURES.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-5"
              >
                <dt className="text-[12px] tracking-widest text-accent uppercase">
                  {item.label}
                </dt>
                <dd className="mt-2.5 text-[15px] leading-relaxed text-white/75 break-keep">
                  {item.detail}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </section>

      {/* ---- 주말 실기 운영 ---- */}
      <section className="px-5 py-20 md:px-6 md:py-28">
        <div className="mx-auto max-w-5xl">
          <SectionHead
            en="Weekend Practice"
            ko="주말 실기는 이렇게 운영합니다"
            sub="주말 이틀을 대학교 유형 실기에 온전히 씁니다."
          />

          <div className="grid gap-4 md:grid-cols-3">
            {WEEKEND_POINTS.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 md:p-8"
              >
                <Palette size={22} strokeWidth={1.5} className="text-accent" />
                <h3 className="mt-4 text-base md:text-lg font-bold text-white break-keep">
                  {item.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-white/70 break-keep">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        headline={
          <>
            이 일과를 8주 동안
            <br className="md:hidden" /> 지켜드립니다
          </>
        }
        sub="아이의 현재 상태에 맞는 과정인지 상담에서 확인해 보세요."
      />

      <MobileActionBar />
    </main>
  );
}
