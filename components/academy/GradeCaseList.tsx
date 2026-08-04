"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp } from "lucide-react";
import {
  GRADE_CASES,
  TRACK_TABS,
  TRACK_LABELS,
  getSortedCases,
  type CaseTrack,
  type GradeCase,
  type ScoreChange,
} from "@/lib/grade-cases";

/** 등급(1~9)을 막대 길이로 환산 — 1등급이 가장 길다. */
function gradeRatio(grade: number) {
  const clamped = Math.min(9, Math.max(1, grade));
  return ((9 - clamped + 1) / 9) * 100;
}

function ScoreRow({ change }: { change: ScoreChange }) {
  const rise = change.before - change.after;
  const beforeRatio = gradeRatio(change.before);
  const afterRatio = gradeRatio(change.after);
  // 등급이 떨어진(=드문) 경우에도 막대가 뒤집히지 않도록 항상 작은 값을 기준으로 잡는다
  const base = Math.min(beforeRatio, afterRatio);
  const gain = Math.abs(afterRatio - beforeRatio);

  return (
    <li className="py-3 first:pt-0 last:pb-0">
      <div className="flex items-center gap-3">
        <span className="w-12 shrink-0 text-sm font-medium text-white/80">
          {change.subject}
        </span>

        <div className="flex flex-1 items-center gap-2">
          <span className="w-11 shrink-0 text-right text-sm tabular-nums text-white/45">
            {change.before}등급
          </span>
          <div
            className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/10"
            role="img"
            aria-label={`${change.subject} ${change.before}등급에서 ${change.after}등급으로 변화`}
          >
            {/* 시작 등급까지는 흰 막대, 올라간 만큼만 accent로 강조 */}
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-white/25"
              style={{ width: `${base}%` }}
            />
            {rise > 0 && (
              <div
                className="absolute inset-y-0 rounded-full bg-accent"
                style={{ left: `${base}%`, width: `${gain}%` }}
              />
            )}
          </div>
          <span className="w-11 shrink-0 text-sm font-semibold tabular-nums text-white">
            {change.after}등급
          </span>
        </div>

        {rise > 0 && (
          <span className="shrink-0 rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-semibold text-accent tabular-nums">
            ▲{rise}
          </span>
        )}
      </div>

      {change.basis && (
        <p className="mt-1 pl-15 text-[11px] text-white/35">{change.basis}</p>
      )}
    </li>
  );
}

function CaseCard({ item, index }: { item: GradeCase; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index, 6) * 0.05 }}
      className={`flex flex-col rounded-2xl border bg-white/[0.03] p-6 md:p-7 ${
        item.featured ? "border-accent/35" : "border-white/10"
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-base font-bold text-white">{item.name}</span>
        <span className="text-sm text-white/50">{item.grade}</span>
        <span className="ml-auto rounded-full border border-white/15 px-2.5 py-0.5 text-[11px] text-white/55">
          {TRACK_LABELS[item.track]}
        </span>
      </div>

      <p className="mt-3 text-lg font-bold leading-snug text-white break-keep">
        {item.headline}
      </p>

      {(item.campus || item.program || item.period) && (
        <p className="mt-2 text-xs text-white/40">
          {[item.campus, item.program, item.period]
            .filter(Boolean)
            .join(" · ")}
        </p>
      )}

      {item.changes.length > 0 && (
        <ul className="mt-5 divide-y divide-white/5 border-t border-white/10 pt-4">
          {item.changes.map((change, i) => (
            <ScoreRow key={`${change.subject}-${i}`} change={change} />
          ))}
        </ul>
      )}

      {item.practical && (
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

      {item.result && (
        <p className="mt-5 flex items-center gap-1.5 border-t border-white/10 pt-4 text-sm font-semibold text-accent break-keep">
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

  const sorted = useMemo(() => getSortedCases(GRADE_CASES), []);
  const items = useMemo(
    () =>
      active === "all" ? sorted : sorted.filter((c) => c.track === active),
    [sorted, active],
  );

  if (sorted.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 px-6 py-16 text-center">
        <p className="text-base font-semibold text-white">
          사례를 정리하고 있습니다
        </p>
        <p className="mt-2 text-sm leading-relaxed text-white/50 break-keep">
          학생·학부모 동의를 받은 사례만 순차적으로 공개하고 있습니다.
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
              ? sorted.length
              : sorted.filter((c) => c.track === tab.key).length;

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
