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
  HOUR_MARKS,
  durationOf,
  durationLabel,
  toMinutes,
  offsetPercent,
  heightPercent,
  summarize,
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
 * 타임라인 높이. 한 시간이 항상 같은 높이를 차지하도록 고정한다.
 * (시간 눈금 17칸 × 52px / md 64px)
 */
const TRACK_HEIGHT = "h-[884px] md:h-[1088px]";

/** 왼쪽 시간 눈금자 — 두 타임라인이 이 눈금을 함께 쓴다 */
function HourRuler() {
  return (
    <div className={`relative ${TRACK_HEIGHT}`}>
      {HOUR_MARKS.map((hour) => (
        <span
          key={hour}
          className="absolute right-0 -translate-y-1/2 font-mono text-[10px] md:text-xs tabular-nums text-white/30"
          style={{ top: `${offsetPercent(hour * 60)}%` }}
        >
          {String(hour).padStart(2, "0")}
          <span className="hidden md:inline">:00</span>
        </span>
      ))}
    </div>
  );
}

/** 하루 시간이 유형별로 어떻게 갈리는지 — 타임라인 위에 얹는 막대 */
function DayHead({ title, sub, blocks }: { title: string; sub: string; blocks: TimeBlock[] }) {
  const shares = summarize(blocks);
  return (
    <div className="flex flex-col justify-end pb-3">
      <p className="text-sm md:text-base font-bold text-white break-keep">
        {title}{" "}
        <span className="text-xs md:text-sm font-medium text-white/40">{sub}</span>
      </p>
      {/* 유형별로 한 줄씩 — 두 요일의 줄 수가 같아야 눈금과 나란히 선다 */}
      <dl className="mt-2 space-y-1">
        {shares.map((share) => (
          <div key={share.type} className="flex items-center gap-1.5">
            <span
              className={`h-1.5 w-1.5 shrink-0 rounded-full ${SCHEDULE_STYLE[share.type].dot}`}
            />
            <dt className="text-[10px] md:text-xs text-white/45">
              {SCHEDULE_STYLE[share.type].label}
            </dt>
            <dd className="text-[10px] md:text-xs font-medium tabular-nums text-white/70">
              {durationLabel(share.minutes)}
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-3 flex h-1.5 overflow-hidden rounded-full bg-white/5">
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

/** 한 시간 단위로 끊긴 눈금 위에, 실제 길이만큼의 블록을 얹는다 */
function DayTimeline({ blocks }: { blocks: TimeBlock[] }) {
  return (
    <div
      className={`relative ${TRACK_HEIGHT} overflow-hidden rounded-xl border border-white/10 bg-white/[0.015]`}
    >
      {/* 정시 눈금 */}
      {HOUR_MARKS.map((hour) => (
        <span
          key={hour}
          aria-hidden
          className="pointer-events-none absolute inset-x-0 border-t border-white/[0.06]"
          style={{ top: `${offsetPercent(hour * 60)}%` }}
        />
      ))}

      {blocks.map((block) => {
        const minutes = durationOf(block);
        const style = SCHEDULE_STYLE[block.type];
        /* 블록이 짧으면 한 줄로만 쓴다 — 넘치는 것보다 낫다 */
        const roomy = minutes >= 70;
        const name = (
          <>
            <span className="md:hidden">{block.short}</span>
            <span className="hidden md:inline">{block.label}</span>
          </>
        );

        return (
          <div
            key={`${block.start}-${block.label}`}
            className={`absolute inset-x-1 overflow-hidden rounded-lg border-l-[3px] md:inset-x-1.5 ${
              style.block
            } ${roomy ? "px-2 py-1.5 md:px-3 md:py-2" : "flex items-center px-2 md:px-3"}`}
            style={{
              top: `calc(${offsetPercent(toMinutes(block.start))}% + 2px)`,
              height: `calc(${heightPercent(minutes)}% - 4px)`,
            }}
          >
            {roomy ? (
              <>
                <p className="font-mono text-[9px] md:text-[11px] tabular-nums text-white/35">
                  {block.start}–{block.end}
                </p>
                <p
                  className={`mt-0.5 text-[11px] md:text-sm font-semibold leading-snug break-keep ${style.title}`}
                >
                  {name}
                </p>
                <p className={`mt-1 text-[9px] md:text-[11px] ${style.text}`}>
                  {durationLabel(minutes)}
                </p>
                {block.note && minutes >= 120 && (
                  <p className="mt-1.5 hidden md:block text-[11px] leading-relaxed text-white/40 break-keep">
                    {block.note}
                  </p>
                )}
              </>
            ) : (
              <p
                className={`flex w-full items-baseline gap-1.5 text-[10px] md:text-xs leading-none break-keep ${style.title}`}
              >
                {name}
                <span className="shrink-0 font-normal text-white/30">
                  {durationLabel(minutes)}
                </span>
              </p>
            )}
          </div>
        );
      })}
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
            sub="평일은 학과에만, 주말은 대학교 유형 미술실기에 집중합니다. 기상과 취침 시각은 8주 내내 같습니다."
          />
          <WinterTabs className="mt-8" />
        </div>
      </section>

      {/* ---- 평일 · 주말 시간표 ---- */}
      <section className="px-5 py-16 md:px-6 md:py-20">
        <div className="mx-auto max-w-4xl">
          {/* 한 시간 눈금을 두 요일이 함께 쓴다 — 같은 높이 = 같은 시간 */}
          <motion.div
            {...fadeUp}
            className="grid grid-cols-[26px_1fr_1fr] gap-x-2 md:grid-cols-[52px_1fr_1fr] md:gap-x-5"
          >
            <div />
            <DayHead title="평일" sub="월–금" blocks={WEEKDAY_SCHEDULE} />
            <DayHead title="주말" sub="토·일" blocks={WEEKEND_SCHEDULE} />

            <HourRuler />
            <DayTimeline blocks={WEEKDAY_SCHEDULE} />
            <DayTimeline blocks={WEEKEND_SCHEDULE} />
          </motion.div>

          <motion.p
            {...fadeUp}
            className="mt-5 text-center text-xs leading-relaxed text-white/35 break-keep"
          >
            ※ 블록의 높이가 실제 소요 시간입니다. 취침 이후 다음 날 06:00 기상까지는
            생략했습니다.
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
                    <p className="mt-2 text-[10px] md:text-xs leading-snug text-white/50 break-keep">
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
                <dt className="text-[11px] tracking-widest text-accent uppercase">
                  {item.label}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-white/70 break-keep">
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
                <p className="mt-2.5 text-sm leading-relaxed text-white/60 break-keep">
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
