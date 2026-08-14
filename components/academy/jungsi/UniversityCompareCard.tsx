"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  SILGI_META,
  type JungsiEntry,
  type SilgiType,
} from "@/lib/jungsi-data";
import { getAdmissionStages, primaryTags, splitMethod } from "@/lib/jungsi-stages";
import AdmissionStageBars from "./AdmissionStageBars";
import UniversityDetail from "./UniversityDetail";

const SILGI_BADGE: Record<SilgiType, string> = {
  기초소양: "bg-accent/15 text-accent border border-accent/40",
  기초디자인: "bg-white/8 text-white/85 border border-white/20",
  선택실기: "bg-white/5 text-white/75 border border-white/25 border-dotted",
  자체실기: "bg-transparent text-accent border border-accent/60",
  비실기: "bg-transparent text-white/70 border border-dashed border-white/35",
};

function SilgiBadge({ type }: { type: SilgiType }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded px-2 py-0.5 text-[11px] font-medium tracking-wide ${SILGI_BADGE[type]}`}
    >
      {SILGI_META[type].label}
    </span>
  );
}

/**
 * 대학 비교 카드 — 기본 상태는 대학명·모집단위·실기 badge·전형 bar·핵심 태그만,
 * 카드를 클릭하면 아래로 상세(inline accordion)가 펼쳐집니다.
 */
export default function UniversityCompareCard({
  entry,
  selected,
  expanded,
  onToggleSelect,
  onToggleExpand,
}: {
  entry: JungsiEntry;
  selected: boolean;
  expanded: boolean;
  onToggleSelect: (entry: JungsiEntry) => void;
  onToggleExpand: (entry: JungsiEntry) => void;
}) {
  const reduceMotion = useReducedMotion();
  const stages = getAdmissionStages(entry);
  const { admission } = splitMethod(entry);
  const tags = primaryTags(entry.tags);
  const detailId = `uni-detail-${entry.id}`;
  const slotName =
    entry.gun === "별도" ? "한예종 슬롯" : `${entry.gun}군 카드`;

  // 카드 전체 클릭으로 펼치기 — 내부 버튼·링크 클릭은 제외.
  // 접기는 명시적 버튼으로만: 상세를 읽거나 드래그하다 실수로 닫히지 않게.
  const handleCardClick = (e: React.MouseEvent) => {
    if (expanded) return;
    if ((e.target as HTMLElement).closest("button, a")) return;
    onToggleExpand(entry);
  };

  return (
    <article
      onClick={handleCardClick}
      className={`flex flex-col rounded-lg border bg-[#0a0a0a] p-5 transition-colors ${
        selected
          ? "border-accent/70 shadow-[0_0_0_1px_rgba(245,136,70,0.25)]"
          : "border-white/10 hover:border-white/25 hover:bg-[#0d0d0d]"
      } ${expanded ? "" : "cursor-pointer"}`}
    >
      {/* 상단: 대학명 + 실기 badge */}
      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1.5">
        <h4 className="min-w-0 text-base font-bold leading-tight text-white">
          {entry.university}
          {entry.campus && (
            <span className="ml-1.5 text-xs font-medium text-white/45">
              {entry.campus}
            </span>
          )}
        </h4>
        <SilgiBadge type={entry.silgi} />
      </div>

      {/* 모집단위 — 기본 상태에선 2줄까지만 */}
      <p
        className={`mt-1.5 text-xs leading-relaxed text-white/55 ${
          expanded ? "" : "line-clamp-2"
        }`}
      >
        {entry.units}
      </p>

      {/* 전형 구조 bar (파싱 불가 entry는 method 텍스트 fallback) */}
      <div className="mt-4">
        {stages ? (
          <AdmissionStageBars stages={stages} showNotes={expanded} />
        ) : (
          <ul className="space-y-1">
            {admission.map((line) => (
              <li
                key={line}
                className="text-[12px] leading-relaxed text-white/70 before:mr-2 before:text-accent before:content-['·']"
              >
                {line}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 핵심 태그 — 기본 최대 3개, 전체는 상세보기에서 */}
      {!expanded && tags.length > 0 && (
        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-sm bg-white/5 px-1.5 py-0.5 text-[11px] text-white/60"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* 상세 — inline accordion */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            id={detailId}
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="mt-4">
              <UniversityDetail entry={entry} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 푸터: 담기 + 상세보기 토글 */}
      <div className="mt-4 flex items-center gap-2 border-t border-white/5 pt-3">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect(entry);
          }}
          aria-pressed={selected}
          className={`flex-1 rounded-md border py-2 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
            selected
              ? "border-accent/60 bg-accent/15 text-accent hover:bg-accent/25"
              : "border-white/15 text-white/70 hover:border-accent/50 hover:text-accent"
          }`}
        >
          {selected ? `${slotName}에서 빼기` : `${slotName}에 담기`}
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand(entry);
          }}
          aria-expanded={expanded}
          aria-controls={detailId}
          className="flex-1 rounded-md border border-white/15 py-2 text-xs font-medium text-white/60 transition-colors hover:border-white/35 hover:text-white/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {expanded ? "접기 ↑" : "상세보기 ↓"}
        </button>
      </div>
    </article>
  );
}
