"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp } from "lucide-react";
import {
  GRADE_CASES,
  SUBJECT_NOTE,
  TRACK_TABS,
  TRACK_LABELS,
  getPublishableCases,
  getPrimaryChange,
  getSecondaryChanges,
  getTrack,
  type CaseTrack,
  type GradeCase,
  type ScoreChange,
} from "@/lib/grade-cases";

/** 한 카드에서 가장 크게 읽혀야 하는 것 — 상승 폭이 가장 큰 과목의 등급 변화. */
function PrimaryChange({ change }: { change: ScoreChange }) {
  const rise = change.before - change.after;

  return (
    <div className="mt-4 flex items-end gap-3 border-t border-white/10 pt-5">
      <div>
        <p className="text-xs font-medium tracking-wide text-white/50">
          {change.subject}
        </p>
        <p
          className="mt-1.5 flex items-center gap-2.5 font-black leading-none tabular-nums"
          aria-label={`${change.subject} ${change.before}등급에서 ${change.after}등급으로 ${rise}등급 상승`}
        >
          <span className="text-5xl text-white/40 md:text-6xl">
            {change.before}
          </span>
          <ArrowRight
            size={24}
            strokeWidth={2.5}
            className="text-white/30"
            aria-hidden
          />
          <span className="text-5xl text-accent md:text-6xl">
            {change.after}
          </span>
          <span className="self-end pb-1 text-base font-bold text-white/50">
            등급
          </span>
        </p>
      </div>

      {rise > 0 && (
        <span className="ml-auto rounded-full bg-accent/15 px-2.5 py-1 text-xs font-bold tabular-nums text-accent">
          ▲{rise}등급
        </span>
      )}
    </div>
  );
}

/** 대표 과목 외 나머지 — 훑고 지나갈 수 있도록 한 줄씩 작게. */
function SecondaryChange({ change }: { change: ScoreChange }) {
  const rise = change.before - change.after;

  return (
    <li className="flex items-center gap-2 py-1.5 text-sm">
      <span className="w-10 shrink-0 text-white/50">{change.subject}</span>
      <span className="tabular-nums text-white/55">{change.before}</span>
      <ArrowRight size={13} className="text-white/35" aria-hidden />
      <span className="font-semibold tabular-nums text-white">
        {change.after}
      </span>
      <span className="text-white/40">등급</span>
      {rise > 0 && (
        <span className="ml-auto text-xs font-semibold tabular-nums text-accent">
          ▲{rise}
        </span>
      )}
    </li>
  );
}

function CaseCard({ item, index }: { item: GradeCase; index: number }) {
  const primary = getPrimaryChange(item);
  const secondary = getSecondaryChanges(item);
  const meta = [item.school, item.campus, item.program, item.period].filter(
    Boolean,
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index, 6) * 0.05 }}
      className={`flex flex-col rounded-2xl border bg-white/[0.03] p-6 md:p-7 ${
        item.featured ? "border-accent/35" : "border-white/10"
      }`}
    >
      {/* 누구인지 — 작게, 맨 위에 */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-bold text-white">{item.name}</span>
        <span className="text-sm text-white/50">{item.grade}</span>
        <span className="ml-auto rounded-full border border-white/15 px-2.5 py-0.5 text-[11px] text-white/55">
          {TRACK_LABELS[getTrack(item)]}
        </span>
      </div>

      {/* 무엇이 얼마나 올랐는지 — 카드에서 가장 큰 글씨 */}
      {primary ? (
        <>
          <PrimaryChange change={primary} />
          {secondary.length > 0 && (
            <ul className="mt-4 divide-y divide-white/5 border-t border-white/5 pt-1">
              {secondary.map((change) => (
                <SecondaryChange key={change.subject} change={change} />
              ))}
            </ul>
          )}
          <p className="mt-3 text-[11px] text-white/35">
            {SUBJECT_NOTE}
            {item.basis && ` · ${item.basis}`}
          </p>
        </>
      ) : (
        item.practical && (
          <p className="mt-4 border-t border-white/10 pt-5 text-xl font-bold leading-snug text-white break-keep">
            {item.practical}
          </p>
        )
      )}

      {/* 실기 — 등급 변화가 있는 카드에서는 보조 정보 */}
      {primary && item.practical && (
        <p className="mt-4 flex items-start gap-2 rounded-lg bg-white/[0.04] px-3.5 py-3 text-sm leading-relaxed text-white/70 break-keep">
          <TrendingUp
            size={15}
            className="mt-0.5 shrink-0 text-accent"
            aria-hidden
          />
          {item.practical}
        </p>
      )}

      {item.quote && (
        <blockquote className="mt-4 border-l-2 border-accent/40 pl-3.5 text-sm leading-relaxed text-white/60 break-keep">
          {item.quote}
        </blockquote>
      )}

      {meta.length > 0 && (
        <p className="mt-4 text-xs text-white/35">{meta.join(" · ")}</p>
      )}

      {item.result && (
        <p className="mt-auto flex items-center gap-1.5 pt-5 text-sm font-semibold text-accent break-keep">
          <ArrowRight size={15} aria-hidden />
          {item.result}
        </p>
      )}
    </motion.article>
  );
}

/** 향상 유형 탭으로 걸러 보는 성적 향상 사례 목록. */
export default function GradeCaseList() {
  const [active, setActive] = useState<CaseTrack | "all">("all");

  // 서면 동의를 받은 사례만 화면에 올린다.
  const cases = useMemo(() => getPublishableCases(GRADE_CASES), []);
  const items = useMemo(
    () =>
      active === "all"
        ? cases
        : cases.filter((item) => getTrack(item) === active),
    [cases, active],
  );

  if (cases.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 px-6 py-16 text-center">
        <p className="text-base font-semibold text-white">
          사례를 정리하고 있습니다
        </p>
        <p className="mt-2 text-sm leading-relaxed text-white/50 break-keep">
          학생·학부모의 서면 동의를 받은 사례만 순차적으로 공개하고 있습니다.
          <br />
          궁금한 점은 상담으로 먼저 안내드리겠습니다.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="향상 유형"
        className="flex flex-wrap justify-center gap-2"
      >
        {TRACK_TABS.map((tab) => {
          const count =
            tab.key === "all"
              ? cases.length
              : cases.filter((item) => getTrack(item) === tab.key).length;

          return (
            <button
              key={tab.key}
              role="tab"
              type="button"
              aria-selected={active === tab.key}
              onClick={() => setActive(tab.key)}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
                active === tab.key
                  ? "bg-accent text-black"
                  : "border border-white/15 text-white/60 hover:border-white/40 hover:text-white"
              }`}
            >
              {tab.label}
              <span className="ml-1.5 text-xs opacity-60 tabular-nums">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div role="tabpanel" className="mt-8 grid gap-4 md:grid-cols-2">
        {items.map((item, i) => (
          <CaseCard key={`${active}-${item.id}`} item={item} index={i} />
        ))}
      </div>

      {items.length === 0 && (
        <p className="mt-8 text-center text-sm text-white/45">
          이 유형의 사례는 아직 공개된 것이 없습니다.
        </p>
      )}
    </div>
  );
}
