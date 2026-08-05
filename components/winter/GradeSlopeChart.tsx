"use client";

/**
 * 윈터스쿨 전/후 등급 비교 슬로프 차트.
 *
 * "같은 3등급으로 시작해도 8주 뒤에는 두 등급이 벌어진다" — 이 한 문장을
 * 두 개의 선으로 보여준다. 숫자는 lib/winter-camp.ts의 GRADE_COMPARISON만 고치면 된다.
 *
 * 형식 선택 근거:
 *  - 두 시점 · 두 집단이라 슬로프(2점 선)가 맞다. 막대는 "출발이 같았다"를 못 보여준다.
 *  - 강조(emphasis) 배색 — 모다고만 accent, 일반 학원은 회색으로 물러난다.
 *    두 계열이 색으로만 구분되지 않도록 선 끝과 범례에 이름을 직접 붙였다.
 *  - 등급은 작을수록 높은 등급이라 세로축을 뒤집어 1등급 쪽을 위로 둔다.
 *  - 모든 값이 화면에 글자로 있으므로 툴팁 없이도 전부 읽힌다(=표 대체).
 */

import { motion } from "framer-motion";
import { GRADE_COMPARISON } from "@/lib/winter-camp";
import { fadeUp } from "@/components/winter/shared";

/* 플롯 좌표(%) — 라벨이 잘리지 않도록 위아래·좌우에 여백을 남긴다 */
const START_X = 12;
const END_X = 88;
const TOP_PAD = 15;
const PLOT_SPAN = 70;

export default function GradeSlopeChart() {
  const { subjects, beforeLabel, afterLabel, startGrade, tracks, note } =
    GRADE_COMPARISON;

  /* 등급 눈금은 데이터에서 뽑는다 — 숫자를 바꿔도 축이 따라온다 */
  const grades = Array.from(
    new Set([startGrade, ...tracks.map((t) => t.afterGrade)]),
  ).sort((a, b) => a - b);
  const best = grades[0];
  const span = grades[grades.length - 1] - best || 1;

  /** 등급 → 세로 위치(%). 높은 등급(작은 숫자)이 위로 간다. */
  const y = (grade: number) => TOP_PAD + ((grade - best) / span) * PLOT_SPAN;

  /** 8주 뒤 두 계열이 벌어진 폭 — 이 페이지가 하려는 말 전부 */
  const afters = tracks.map((t) => t.afterGrade);
  const gap = Math.max(...afters) - Math.min(...afters);

  return (
    <motion.figure
      {...fadeUp}
      className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-10"
    >
      <figcaption className="text-center">
        <p className="text-[11px] tracking-[0.25em] text-accent uppercase">
          Before / After
        </p>
        <p className="mt-3 text-xl md:text-3xl font-bold text-white break-keep">
          같은 {startGrade}등급으로 시작해도,
          <br className="md:hidden" /> 8주 뒤엔 이만큼 벌어집니다
        </p>
        <p className="mt-2.5 text-sm text-white/50 break-keep">
          {subjects} 기준
        </p>
      </figcaption>

      {/* ---- 플롯 ---- */}
      <div className="mt-9 flex h-56 md:h-72" aria-hidden>
        {/* 등급 눈금 */}
        <div className="relative w-11 shrink-0 md:w-14">
          {grades.map((g) => (
            <span
              key={g}
              style={{ top: `${y(g)}%` }}
              className="absolute right-2 -translate-y-1/2 text-[11px] md:text-xs tabular-nums text-white/40"
            >
              {g}등급
            </span>
          ))}
        </div>

        <div className="relative flex-1">
          {/* 눈금선 — 실선 헤어라인, 배경 한 칸 위 */}
          {grades.map((g) => (
            <div
              key={g}
              style={{ top: `${y(g)}%` }}
              className="absolute inset-x-0 h-px bg-white/[0.07]"
            />
          ))}

          {/* 선 — 세로로 늘어나도 두께가 변하지 않도록 non-scaling-stroke */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full overflow-visible"
          >
            {tracks.map((track) => (
              <line
                key={track.key}
                x1={START_X}
                y1={y(startGrade)}
                x2={END_X}
                y2={y(track.afterGrade)}
                stroke={track.emphasis ? "var(--accent)" : "#8a8a95"}
                strokeWidth={2}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>

          {/* 출발점 — 두 계열이 겹치는 지점이라 중립색 */}
          <span
            style={{ left: `${START_X}%`, top: `${y(startGrade)}%` }}
            className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white ring-2 ring-[#0a0a0d]"
          />

          {/* 도착점 + 값 라벨 */}
          {tracks.map((track, i) => (
            <div key={track.key}>
              <motion.span
                style={{ left: `${END_X}%`, top: `${y(track.afterGrade)}%` }}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.35, delay: 0.15 + i * 0.1 }}
                className={`absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-[#0a0a0d] ${
                  track.emphasis ? "bg-accent" : "bg-[#8a8a95]"
                }`}
              />
              <span
                style={{ left: `${END_X}%`, top: `${y(track.afterGrade)}%` }}
                className={`absolute -translate-x-1/2 -translate-y-[165%] text-sm md:text-base font-bold tabular-nums whitespace-nowrap ${
                  track.emphasis ? "text-accent" : "text-white/45"
                }`}
              >
                {track.afterGrade}등급
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ---- 가로축 ---- */}
      <div className="flex" aria-hidden>
        <div className="w-11 shrink-0 md:w-14" />
        <div className="relative h-6 flex-1 border-t border-white/[0.07]">
          <span
            style={{ left: `${START_X}%` }}
            className="absolute top-2.5 -translate-x-1/2 text-[11px] md:text-xs whitespace-nowrap text-white/45"
          >
            {beforeLabel}
          </span>
          <span
            style={{ left: `${END_X}%` }}
            className="absolute top-2.5 -translate-x-1/2 text-[11px] md:text-xs whitespace-nowrap text-white/45"
          >
            {afterLabel}
          </span>
        </div>
      </div>

      {/* ---- 결론 한 줄 ---- */}
      {gap > 0 && (
        <p className="mt-7 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-5 py-2 text-sm md:text-base font-bold text-accent break-keep">
            같은 출발선에서 {afterLabel}, {gap}등급 차이
          </span>
        </p>
      )}

      {/* ---- 범례 겸 값 표 — 색을 못 봐도 여기서 전부 읽힌다 ---- */}
      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        {tracks.map((track) => {
          const diff = startGrade - track.afterGrade;
          return (
            <div
              key={track.key}
              className={`rounded-xl border px-5 py-4 ${
                track.emphasis
                  ? "border-accent/30 bg-accent/[0.06]"
                  : "border-white/10 bg-white/[0.02]"
              }`}
            >
              <dt className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                    track.emphasis ? "bg-accent" : "bg-[#8a8a95]"
                  }`}
                />
                <span
                  className={`text-sm font-bold ${
                    track.emphasis ? "text-white" : "text-white/60"
                  }`}
                >
                  {track.name}
                </span>
                <span className="text-xs text-white/35 break-keep">
                  {track.detail}
                </span>
              </dt>
              <dd className="mt-2 flex items-baseline gap-2 pl-[18px]">
                <span
                  className={`text-sm tabular-nums ${
                    track.emphasis ? "text-white/80" : "text-white/50"
                  }`}
                >
                  {startGrade}등급 → {track.afterGrade}등급
                </span>
                <span
                  className={`text-xs font-semibold ${
                    diff > 0 ? "text-accent" : "text-white/40"
                  }`}
                >
                  {diff > 0
                    ? `${diff}등급 상승`
                    : diff < 0
                      ? `${-diff}등급 하락`
                      : "제자리"}
                </span>
              </dd>
            </div>
          );
        })}
      </dl>

      <p className="mt-5 text-center text-xs leading-relaxed text-white/35 break-keep">
        세로축은 등급이며 위로 갈수록 높은 등급입니다.
        <br />※ {note}
      </p>
    </motion.figure>
  );
}
