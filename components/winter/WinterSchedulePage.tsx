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
  type ScheduleRow,
  type ScheduleType,
} from "@/lib/winter-schedule";
import CtaBand from "@/components/winter/CtaBand";
import MobileActionBar from "@/components/winter/MobileActionBar";
import {
  fadeUp,
  SectionHead,
  SubPageHeader,
  SubPageTabs,
} from "@/components/winter/shared";

function ScheduleTable({ title, rows }: { title: string; rows: ScheduleRow[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">
      <p className="border-b border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white">
        {title}
      </p>
      <table className="w-full text-sm md:text-[15px]">
        <tbody>
          {rows.map((row) => {
            const style = SCHEDULE_STYLE[row.type];
            return (
              <tr
                key={row.time}
                className="border-b border-white/5 last:border-b-0"
              >
                <td className="w-20 px-4 py-3.5 align-top font-mono text-white/40">
                  {row.time}
                </td>
                <td className="px-2 py-3.5 pr-4">
                  <span className="flex items-start gap-2.5">
                    <span
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${style.dot}`}
                    />
                    <span
                      className={`break-keep ${
                        row.type === "life"
                          ? "text-white/50"
                          : "font-medium text-white"
                      }`}
                    >
                      {row.label}
                    </span>
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
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
          <div className="mt-8">
            <SubPageTabs />
          </div>
        </div>
      </section>

      {/* ---- 평일 · 주말 시간표 ---- */}
      <section className="px-5 py-16 md:px-6 md:py-20">
        <div className="mx-auto max-w-4xl">
          {/* 범례 */}
          <motion.div
            {...fadeUp}
            className="mb-6 flex items-center justify-center gap-6"
          >
            {(Object.keys(SCHEDULE_STYLE) as ScheduleType[]).map((key) => (
              <span
                key={key}
                className="flex items-center gap-2 text-xs md:text-sm text-white/60"
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${SCHEDULE_STYLE[key].dot}`}
                />
                {SCHEDULE_STYLE[key].label}
              </span>
            ))}
          </motion.div>

          <motion.div {...fadeUp} className="grid gap-6 md:grid-cols-2">
            <ScheduleTable title="평일 (월–금) · 학과" rows={WEEKDAY_SCHEDULE} />
            <ScheduleTable
              title="주말 (토·일) · 대학교 유형 실기"
              rows={WEEKEND_SCHEDULE}
            />
          </motion.div>

          <motion.p {...fadeUp} className="mt-5 text-center text-xs text-white/35">
            ※ 수업시간은 효율에 따라 변경될 수 있습니다.
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
