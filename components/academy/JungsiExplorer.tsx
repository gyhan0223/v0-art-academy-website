"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { trackDiagnosis } from "@/lib/diagnosis/analytics";
import { jungsiDiagnosisHref } from "@/lib/diagnosis/entry-params";
import {
  GUN_ORDER,
  SILGI_CATEGORY_ORDER,
  SILGI_META,
  jungsiEntries,
  pendingUniversities,
  silgiCategory,
  silgiLabel,
  silgiShort,
  type Gun,
  type JungsiEntry,
  type Major,
  type SilgiCategory,
} from "@/lib/jungsi-data";
import { useReportBottomBar } from "@/components/academy/NaverTalk";

/* ─────────────────────────── 배지 · 비율 바 ─────────────────────────── */

/* accent = 사고·발상형 종목, 화이트 = 묘사·조형형 종목, 비실기 = 파선 */
const SILGI_BADGE: Record<SilgiCategory, string> = {
  기초디자인: "bg-white/8 text-white/85 border border-white/20",
  발상과표현: "bg-accent/15 text-accent border border-accent/40",
  "기초조형·소양평가":
    "bg-accent/10 text-accent/90 border border-accent/30 border-dotted",
  소묘: "bg-white/5 text-white/75 border border-white/25",
  "수채화·수묵담채": "bg-white/5 text-white/75 border border-white/25 border-dotted",
  "소조·입체": "bg-white/5 text-white/75 border border-white/25 border-dashed",
  "만화·상황표현": "bg-white/8 text-white/75 border border-white/30",
  "통합·자체실기": "bg-transparent text-accent border border-accent/60",
  비실기: "bg-transparent text-white/70 border border-dashed border-white/35",
};

function SilgiBadge({ entry }: { entry: JungsiEntry }) {
  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-[12px] font-medium tracking-wide ${SILGI_BADGE[silgiCategory(entry)]}`}
    >
      {silgiLabel(entry)}
    </span>
  );
}

function RatioBar({ entry }: { entry: JungsiEntry }) {
  if (!entry.ratio) return null;
  const { suneung, silgi, etc = 0, etcLabel } = entry.ratio;
  const segments = [
    { key: "수능", value: suneung, className: "bg-accent" },
    { key: "실기", value: silgi, className: "bg-white/70" },
    ...(etc > 0
      ? [{ key: etcLabel ?? "기타", value: etc, className: "bg-white/25" }]
      : []),
  ].filter((s) => s.value > 0);

  return (
    <div className="mt-4" aria-label="최종 단계 반영비율">
      <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-white/5">
        {segments.map((s) => (
          <div
            key={s.key}
            className={s.className}
            style={{ width: `${s.value}%` }}
          />
        ))}
      </div>
      <div className="mt-2 flex gap-3 text-[12px] text-white/55">
        {segments.map((s) => (
          <span key={s.key} className="flex items-center gap-1.5">
            <span
              className={`inline-block h-1.5 w-1.5 rounded-full ${s.className}`}
            />
            {s.key} {s.value}%
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────── 실기·모집 상세 ─────────────────────── */

function fmtRate(rate: number | null) {
  return rate == null ? "—" : `${rate.toFixed(2)} : 1`;
}

/* ───────────── 문장 → label·value 재구성 (표현만, 데이터 불변) ───────────── */

/**
 * 전형방법 한 줄을 "라벨 → 값"으로 분해한다.
 * 데이터 문자열은 그대로 두고, 훑어 읽을 수 있게 표시만 바꾼다.
 */
function parseMethodLine(line: string): { label: string; value: string } {
  const bracket = line.match(/^\[([^\]]{1,8})\]\s*(.+)$/);
  if (bracket) return { label: bracket[1], value: bracket[2] };
  const stage = line.match(/^(\d단계)\s+(.+)$/);
  if (stage) return { label: stage[1], value: stage[2] };
  const region = line.match(/^수능 반영영역:\s*(.+)$/);
  if (region) return { label: "수능 반영", value: region[1] };
  if (line.includes("일괄합산")) {
    const value = line
      .replace(/\s*일괄합산\s*/, " ")
      .replace(/\s{2,}/g, " ")
      .trim();
    return { label: "일괄합산", value };
  }
  return { label: "전형", value: line };
}

/** 문장 속 "60%" 같은 비율 숫자만 밝게 — 숫자가 문장에 묻히지 않게 한다 */
function ValueText({ text }: { text: string }) {
  const parts = text.split(/(\d+(?:\.\d+)?%)/g);
  return (
    <>
      {parts.map((p, i) =>
        /^\d+(?:\.\d+)?%$/.test(p) ? (
          <span key={i} className="font-semibold text-white">
            {p}
          </span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

/** 긴 참고 문단을 문장 단위로 잘라 훑기 좋은 bullet 덩어리로 만든다 */
function splitSentences(text: string): string[] {
  return text
    .split(/(?<=(?:[다요]|\))\.)\s+(?=\S)/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** 카드 중단: 실기 스펙(label→value 행) + 모집·경쟁률 key-value */
function MajorSummary({ entry }: { entry: JungsiEntry }) {
  const majors = entry.majors ?? [];
  if (majors.length === 0 && !entry.practical) return null;

  const rates = majors
    .map((m) => m.rate)
    .filter((r): r is number => r != null);
  const quotas = majors
    .map((m) => m.quota)
    .filter((q): q is number => q != null);
  const totalQuota = quotas.reduce((a, b) => a + b, 0);
  const minRate = rates.length ? Math.min(...rates) : null;
  const maxRate = rates.length ? Math.max(...rates) : null;

  const specs: { label: string; value: string }[] = [
    ...(entry.practical ? [{ label: "실기", value: entry.practical }] : []),
    ...(entry.duration ? [{ label: "시간", value: entry.duration }] : []),
    ...(entry.paper ? [{ label: "화지", value: entry.paper }] : []),
  ];

  return (
    <>
      {specs.length > 0 && (
        <div className="mt-4 space-y-1.5 border-t border-white/[0.06] pt-3.5">
          {specs.map((s) => (
            <div key={s.label} className="flex gap-3">
              <span className="w-16 shrink-0 pt-px text-[12px] font-medium text-white/45">
                {s.label}
              </span>
              <span className="min-w-0 flex-1 text-[13px] leading-relaxed text-white/80">
                {s.value}
              </span>
            </div>
          ))}
        </div>
      )}
      {(totalQuota > 0 || minRate != null) && (
        <div className="mt-4 flex flex-wrap gap-x-10 gap-y-2">
          {totalQuota > 0 && (
            <div>
              <p className="text-[12px] text-white/45">모집</p>
              <p className="mt-0.5 text-[15px] font-semibold tabular-nums text-white">
                {totalQuota}
                <span className="ml-0.5 text-[12px] font-normal text-white/55">
                  명
                </span>
              </p>
            </div>
          )}
          {minRate != null && (
            <div>
              <p className="text-[12px] text-white/45">2026 경쟁률</p>
              <p className="mt-0.5 text-[15px] font-semibold tabular-nums text-accent">
                {minRate === maxRate
                  ? minRate.toFixed(2)
                  : `${minRate.toFixed(2)} ~ ${maxRate!.toFixed(2)}`}
                <span className="ml-1 text-[12px] font-normal text-white/55">
                  : 1
                </span>
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}

/** 접이식 학과별 표 */
function MajorTable({ majors }: { majors: Major[] }) {
  if (majors.length === 0) return null;
  return (
    <details className="group/major mt-3">
      <summary className="flex cursor-pointer list-none items-center gap-1.5 py-1 text-[13px] font-medium text-white/70 transition-colors hover:text-accent">
        <span className="text-accent transition-transform group-open/major:rotate-90">
          ▸
        </span>
        학과별 모집 상세 · {majors.length}개 전공
      </summary>
      <ul className="mt-2 divide-y divide-white/5 rounded-md border border-white/10 bg-black/30">
        {majors.map((m) => (
          <li key={m.name} className="px-3.5 py-3">
            <p className="text-[13px] font-medium leading-snug text-white/90">
              {m.name}
              {m.stageTag && (
                <span className="ml-1.5 rounded-sm bg-white/8 px-1 py-0.5 align-middle text-[11px] font-normal text-white/55">
                  {m.stageTag}
                </span>
              )}
            </p>
            <div className="mt-1.5 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[12px]">
              <span className="text-white/45">
                모집{" "}
                <span className="font-mono text-[13px] text-white/90">
                  {m.quota != null ? `${m.quota}명` : m.quotaNote ?? "—"}
                </span>
              </span>
              <span className="text-white/45">
                경쟁률{" "}
                <span className="font-mono text-[13px] text-accent/90">
                  {fmtRate(m.rate)}
                </span>
              </span>
              {m.applicants != null && (
                <span className="text-white/40">지원 {m.applicants}명</span>
              )}
              {m.rateQuota != null && m.rateQuota !== m.quota && (
                <span className="text-white/40">당시 {m.rateQuota}명 모집</span>
              )}
            </div>
            {(m.practical || m.duration) && (
              <p className="mt-1.5 text-[12px] leading-relaxed text-white/50">
                {[m.practical, m.duration].filter(Boolean).join(" · ")}
              </p>
            )}
          </li>
        ))}
      </ul>
    </details>
  );
}

/* ─────────────────────────── 대학 카드 ─────────────────────────── */

const GUN_LABEL: Record<Gun, string> = {
  가: "가군",
  나: "나군",
  다: "다군",
  별도: "군 외",
};

/**
 * 펼침 패널 본문 — 대학명·학과는 헤더 버튼에 이미 있으므로 여기서는
 * 실기 배지부터 전형방법·비율·모집·경쟁률·참고·CTA·담기까지만 담당한다.
 */
function UniversityDetail({
  entry,
  selected,
  onToggle,
}: {
  entry: JungsiEntry;
  selected: boolean;
  onToggle: (entry: JungsiEntry) => void;
}) {
  const slotName = entry.gun === "별도" ? "한예종 슬롯" : `${GUN_LABEL[entry.gun]} 카드`;
  return (
    <div className="flex flex-col">
      <div>
        <SilgiBadge entry={entry} />
      </div>

      <div className="mt-4 space-y-2">
        {entry.method.map((line) => {
          const { label, value } = parseMethodLine(line);
          return (
            <div key={line} className="flex gap-3">
              <span className="w-16 shrink-0 pt-[3px] text-[12px] font-medium tracking-wide text-white/45">
                {label}
              </span>
              <span className="min-w-0 flex-1 text-sm leading-relaxed text-white/75">
                <ValueText text={value} />
              </span>
            </div>
          );
        })}
      </div>

      <RatioBar entry={entry} />

      <MajorSummary entry={entry} />

      {entry.majors && entry.majors.length > 1 && (
        <MajorTable majors={entry.majors} />
      )}

      {(entry.tags?.length || entry.note) && (
        <div className="mt-4 border-t border-white/5 pt-3">
          {entry.tags && entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {entry.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-sm bg-white/5 px-1.5 py-0.5 text-[12px] text-white/65"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          {entry.note &&
            (() => {
              const sentences = splitSentences(entry.note);
              return sentences.length > 1 ? (
                <ul className="mt-2.5 space-y-1.5">
                  {sentences.map((s) => (
                    <li
                      key={s}
                      className="flex gap-2 text-[12px] leading-relaxed text-white/55"
                    >
                      <span aria-hidden className="select-none text-white/25">
                        ·
                      </span>
                      <span className="min-w-0">{s}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2.5 text-[12px] leading-relaxed text-white/55">
                  {entry.note}
                </p>
              );
            })()}
        </div>
      )}

      {/* 대학 정보를 본 직후의 자연스러운 다음 질문 — "내 성적으로 가능한가?"
          담기(계획)보다 먼저, 진단(개인화) 진입을 대학별 CTA로 제공한다 */}
      <Link
        href={jungsiDiagnosisHref(entry.university)}
        onClick={() =>
          trackDiagnosis("jungsi_university_diagnosis_click", {
            target_university: entry.university,
            gun: entry.gun,
            silgi_type: silgiCategory(entry),
            placement: "card",
          })
        }
        className="mt-4 flex min-h-[44px] w-full items-center justify-between gap-2 rounded-md border border-accent/35 bg-accent/[0.06] px-3.5 py-2.5 text-left text-sm font-medium text-accent transition-colors hover:border-accent/70 hover:bg-accent/[0.12] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <span className="break-keep leading-snug">
          내 성적으로 {entry.university} 가능성 확인
        </span>
        <span aria-hidden className="shrink-0">
          →
        </span>
      </Link>

      <button
        type="button"
        onClick={() => onToggle(entry)}
        aria-pressed={selected}
        className={`mt-2 w-full rounded-md border py-2 text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
          selected
            ? "border-accent/60 bg-accent/15 text-accent hover:bg-accent/25"
            : "border-white/15 text-white/70 hover:border-accent/50 hover:text-accent"
        }`}
      >
        {selected ? `${slotName}에서 빼기` : `${slotName}에 담기`}
      </button>
    </div>
  );
}

/**
 * 목록 행 — 접힌 상태엔 대학명·학과만, 헤더 버튼을 누르면 바로 아래에 상세
 * 패널이 열린다. 펼침 상태는 부모(JungsiExplorer)가 entry.id 단위로 관리하므로
 * 여러 행을 동시에 열어 두고 비교할 수 있다.
 */
function UniversityAccordionItem({
  entry,
  open,
  selected,
  onToggleOpen,
  onToggleSelect,
}: {
  entry: JungsiEntry;
  open: boolean;
  selected: boolean;
  onToggleOpen: (id: string) => void;
  onToggleSelect: (entry: JungsiEntry) => void;
}) {
  const headerId = `uni-header-${entry.id}`;
  const panelId = `uni-panel-${entry.id}`;
  return (
    <div
      className={`border-l-2 transition-colors ${
        selected
          ? "border-l-accent bg-accent/[0.05]"
          : "border-l-transparent"
      }`}
    >
      <h4 className="m-0">
        <button
          type="button"
          id={headerId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => onToggleOpen(entry.id)}
          className="flex min-h-[64px] w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-white/[0.03] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent md:px-5"
        >
          <span className="min-w-0 flex-1">
            <span className="block text-[16px] font-bold leading-snug text-white md:text-[17px]">
              {entry.university}
              {entry.campus && (
                <span className="ml-1.5 text-[13px] font-medium text-white/55">
                  {entry.campus}
                </span>
              )}
            </span>
            <span className="mt-1 block text-[13px] leading-relaxed text-white/65">
              {entry.units}
            </span>
          </span>
          <svg
            aria-hidden
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className={`shrink-0 text-white/45 transition-transform duration-150 ${
              open ? "rotate-180 text-accent" : ""
            }`}
          >
            <path
              d="M3.5 6l4.5 4.5L12.5 6"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </h4>
      {open && (
        <div
          id={panelId}
          role="region"
          aria-labelledby={headerId}
          className="border-t border-white/[0.06] px-4 pb-5 pt-4 md:px-5"
        >
          <UniversityDetail
            entry={entry}
            selected={selected}
            onToggle={onToggleSelect}
          />
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── 조합 분석 ─────────────────────────── */

type Selection = Partial<Record<Gun, string>>;

function analyzeSelection(picked: JungsiEntry[]): {
  headline: string;
  detail: string;
} {
  const main = picked.filter((e) => e.gun !== "별도");
  const hasKarts = picked.some((e) => e.gun === "별도");
  const silgiPicks = picked.filter((e) => e.subjects.length > 0);
  const nonSilgiPicks = main.filter((e) => e.subjects.length === 0);

  if (
    silgiPicks.some((e) => e.subjects.includes("통합·자체실기")) ||
    (hasKarts && main.length > 0)
  ) {
    return {
      headline: "자체 실기 대비가 들어가는 조합",
      detail:
        "서울대·이화여대·한예종급 자체실기는 대학 기출에 맞춘 별도 준비가 필요합니다. 나머지 카드의 종목과 시간 배분을 함께 설계해야 합니다.",
    };
  }

  // 선택한 실기 대학들이 공유하는 종목 (택1 대학은 응시 가능 종목 전체로 판정)
  const common =
    silgiPicks.length > 0
      ? silgiPicks[0].subjects.filter((s) =>
          silgiPicks.every((e) => e.subjects.includes(s)),
        )
      : [];

  if (silgiPicks.length >= 2 && common.length === 0) {
    const names = [
      ...new Set(silgiPicks.map((e) => SILGI_META[silgiCategory(e)].short)),
    ];
    return {
      headline: "실기 두 갈래를 병행하는 조합",
      detail: `선택한 대학들의 실기 종목이 겹치지 않아 ${names.join("·")} 종목을 각각 준비해야 합니다. 남은 기간의 시간 배분이 합격을 가릅니다.`,
    };
  }
  if (nonSilgiPicks.length > 0 && silgiPicks.length > 0) {
    return {
      headline: "실기 + 수능·서류를 병행하는 조합",
      detail:
        "비실기 카드는 그림 대신 수능·서류 관리가 승부처입니다. 나머지 카드의 실기와 시간 배분이 필요합니다.",
    };
  }
  if (main.length > 0 && silgiPicks.length === 0) {
    return {
      headline: "실기 없이 가는 조합",
      detail:
        "실기고사 부담이 없는 대신, 수능 성적과 서류 완성도가 당락을 결정합니다.",
    };
  }
  if (silgiPicks.length > 0) {
    return {
      headline: "한 종목으로 끝나는 조합",
      detail: `${SILGI_META[common[0]].label} 하나로 선택한 실기 대학을 모두 지원할 수 있어, 실기 준비를 한 갈래에 집중할 수 있는 조합입니다.`,
    };
  }
  return { headline: "", detail: "" };
}

/* ─────────────────────────── 공유 · 저장 ─────────────────────────── */

const MAIN_GUNS: Gun[] = ["가", "나", "다"];

function slotLine(entry: JungsiEntry) {
  const name = entry.campus
    ? `${entry.university} ${entry.campus}`
    : entry.university;
  return { name, silgi: silgiLabel(entry) };
}

/** 상담 예약 요청사항에 붙여넣을 조합 요약 텍스트 */
function buildDiagnosisText(
  selection: Selection,
  byId: Map<string, JungsiEntry>,
  analysis: { headline: string },
) {
  const lines: string[] = ["[정시 원서 조합 진단 요청]"];
  for (const g of MAIN_GUNS) {
    const entry = selection[g] ? byId.get(selection[g]!) : undefined;
    if (entry) {
      const s = slotLine(entry);
      lines.push(`${g}군: ${s.name} (${s.silgi})`);
    } else {
      lines.push(`${g}군: 미정`);
    }
  }
  const extra = selection["별도"] ? byId.get(selection["별도"]!) : undefined;
  if (extra) lines.push(`별도: ${extra.university}`);
  if (analysis.headline) lines.push(`조합 유형: ${analysis.headline}`);
  if (typeof window !== "undefined")
    lines.push(`조합 보기: ${window.location.href}`);
  return lines.join("\n");
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // clipboard API가 막힌 환경(http 등) 폴백
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}

/** 조합을 카톡으로 보내기 좋은 세로형 카드 이미지로 렌더 */
async function renderShareImage(
  selection: Selection,
  byId: Map<string, JungsiEntry>,
  analysis: { headline: string; detail: string },
): Promise<HTMLCanvasElement> {
  const ACCENT = "#f58846";
  const W = 1080;
  const PAD = 72;
  const FONT = '"Noto Sans KR", sans-serif';

  // 페이지 폰트가 캔버스에도 적용되도록 로드 완료를 기다림
  try {
    await Promise.all([
      document.fonts.load(`700 44px ${FONT}`),
      document.fonts.load(`400 28px ${FONT}`),
      document.fonts.ready,
    ]);
  } catch {
    /* 폰트 로드 실패 시 시스템 폰트로 진행 */
  }

  const canvas = document.createElement("canvas");
  canvas.width = W;
  const measure = canvas.getContext("2d")!;

  const wrap = (text: string, font: string, maxWidth: number) => {
    measure.font = font;
    const lines: string[] = [];
    let line = "";
    for (const ch of text) {
      if (measure.measureText(line + ch).width > maxWidth && line !== "") {
        lines.push(line);
        line = ch === " " ? "" : ch;
      } else {
        line += ch;
      }
    }
    if (line) lines.push(line);
    return lines;
  };

  const extra = selection["별도"] ? byId.get(selection["별도"]!) : undefined;
  const rows: { gun: string; entry: JungsiEntry | undefined }[] = [
    ...MAIN_GUNS.map((g) => ({
      gun: g,
      entry: selection[g] ? byId.get(selection[g]!) : undefined,
    })),
    ...(extra ? [{ gun: "+", entry: extra }] : []),
  ];

  const ROW_H = 148;
  const ROW_GAP = 20;
  const detailLines = analysis.detail
    ? wrap(analysis.detail, `400 27px ${FONT}`, W - PAD * 2)
    : [];
  const headerH = 220;
  const rowsH = rows.length * (ROW_H + ROW_GAP);
  const analysisH = analysis.headline ? 90 + detailLines.length * 42 : 0;
  const footerH = 170;
  const H = headerH + rowsH + analysisH + footerH;
  canvas.height = H;

  const ctx = canvas.getContext("2d")!;
  const rounded = (x: number, y: number, w: number, h: number, r: number) => {
    ctx.beginPath();
    if (typeof ctx.roundRect === "function") {
      ctx.roundRect(x, y, w, h, r);
    } else {
      ctx.rect(x, y, w, h);
    }
  };

  // 배경
  ctx.fillStyle = "#060606";
  ctx.fillRect(0, 0, W, H);

  // 헤더
  ctx.fillStyle = ACCENT;
  ctx.font = `500 26px ${FONT}`;
  ctx.fillText("2027 미대 정시", PAD, 108);
  ctx.fillStyle = "#ffffff";
  ctx.font = `700 58px ${FONT}`;
  ctx.fillText("내 원서 조합", PAD, 178);

  // 슬롯 카드
  let y = headerH;
  for (const row of rows) {
    if (row.entry) {
      ctx.fillStyle = "#0f0f0f";
      rounded(PAD, y, W - PAD * 2, ROW_H, 16);
      ctx.fill();
      ctx.strokeStyle = "rgba(245,136,70,0.45)";
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      rounded(PAD, y, W - PAD * 2, ROW_H, 16);
      ctx.stroke();

      const s = slotLine(row.entry);
      ctx.fillStyle = ACCENT;
      ctx.font = `700 44px ${FONT}`;
      ctx.fillText(row.gun, PAD + 36, y + 90);
      ctx.fillStyle = "#ffffff";
      ctx.font = `700 40px ${FONT}`;
      ctx.fillText(s.name, PAD + 120, y + 66);
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.font = `400 26px ${FONT}`;
      ctx.fillText(s.silgi, PAD + 120, y + 112);
    } else {
      ctx.strokeStyle = "rgba(255,255,255,0.22)";
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 8]);
      rounded(PAD, y, W - PAD * 2, ROW_H, 16);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.font = `700 44px ${FONT}`;
      ctx.fillText(row.gun, PAD + 36, y + 90);
      ctx.font = `400 28px ${FONT}`;
      ctx.fillText("비어 있음", PAD + 120, y + 86);
    }
    y += ROW_H + ROW_GAP;
  }

  // 조합 분석
  if (analysis.headline) {
    y += 30;
    ctx.fillStyle = ACCENT;
    ctx.font = `700 32px ${FONT}`;
    ctx.fillText(analysis.headline, PAD, y);
    y += 20;
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.font = `400 27px ${FONT}`;
    for (const line of detailLines) {
      y += 42;
      ctx.fillText(line, PAD, y);
    }
  }

  // 푸터
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PAD, H - 118);
  ctx.lineTo(W - PAD, H - 118);
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.font = `700 30px ${FONT}`;
  ctx.fillText("모두다른고양이 미술학원", PAD, H - 62);
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = `400 24px ${FONT}`;
  ctx.fillText("일산 · 031-916-8885 · 입학 상담 예약 가능", PAD, H - 24);

  return canvas;
}

/** 이미지 저장 — 모바일은 공유 시트(카톡 전송), PC는 PNG 다운로드 */
async function shareOrDownloadImage(
  selection: Selection,
  byId: Map<string, JungsiEntry>,
  analysis: { headline: string; detail: string },
) {
  const canvas = await renderShareImage(selection, byId, analysis);
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/png"),
  );
  if (!blob) return false;

  const file = new File([blob], "정시-원서조합-모두다른고양이.png", {
    type: "image/png",
  });
  if (
    typeof navigator.canShare === "function" &&
    navigator.canShare({ files: [file] })
  ) {
    try {
      await navigator.share({
        files: [file],
        title: "내 정시 원서 조합",
      });
      return true;
    } catch (err) {
      // 사용자가 공유 시트를 닫은 경우 — 다운로드로 넘어가지 않고 종료
      if ((err as DOMException).name === "AbortError") return false;
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  a.click();
  URL.revokeObjectURL(url);
  return true;
}

/* ─────────────────────────── 원서 트레이 ─────────────────────────── */

function PlanTray({
  selection,
  byId,
  onRemove,
  onGoGun,
  onClear,
  ctaHref,
}: {
  selection: Selection;
  byId: Map<string, JungsiEntry>;
  onRemove: (gun: Gun) => void;
  onGoGun: (gun: Gun) => void;
  onClear: () => void;
  ctaHref: string;
}) {
  const mainGuns: Gun[] = ["가", "나", "다"];
  const picked = (Object.keys(selection) as Gun[])
    .map((g) => byId.get(selection[g]!))
    .filter((e): e is JungsiEntry => Boolean(e));
  const filledCount = mainGuns.filter((g) => selection[g]).length;
  const complete = filledCount === 3;
  const analysis = analyzeSelection(picked);

  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [saving, setSaving] = useState(false);

  // 트레이가 떠 있는 동안 톡톡 플로팅 버튼을 그 위로 밀어 올린다
  const trayRef = useRef<HTMLDivElement>(null);
  useReportBottomBar(trayRef);

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  };
  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    [],
  );

  const handleCopyLink = async () => {
    const ok = await copyText(window.location.href);
    showToast(
      ok
        ? "링크를 복사했어요 — 카톡에 붙여넣으면 이 조합이 그대로 열립니다."
        : "복사에 실패했어요. 주소창의 링크를 직접 복사해 주세요.",
    );
  };

  const handleSaveImage = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const done = await shareOrDownloadImage(selection, byId, analysis);
      if (done) showToast("조합 이미지를 저장했어요 — 카톡으로 공유해 보세요.");
    } catch {
      showToast("이미지 저장에 실패했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSaving(false);
    }
  };

  // 상담 신청으로 넘어가기 전에 조합 요약을 복사해 두면
  // 신청서에 붙여넣기만 하면 됨 → 상담 리드에 조합 정보가 따라붙음
  const handleCta = async () => {
    const ok = await copyText(buildDiagnosisText(selection, byId, analysis));
    if (ok)
      showToast(
        "조합 내용을 복사했어요 — 신청서 '지금 가장 고민되는 점'란에 붙여넣어 주세요.",
      );
  };

  return (
    <div
      ref={trayRef}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/90 backdrop-blur-md"
    >
      {toast && (
        <div
          role="status"
          className="pointer-events-none absolute inset-x-0 -top-12 flex justify-center px-5"
        >
          <p className="rounded-full border border-accent/40 bg-black/90 px-4 py-2 text-[12px] font-medium text-accent shadow-lg backdrop-blur-md">
            {toast}
          </p>
        </div>
      )}
      <div className="mx-auto max-w-4xl px-5 py-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[12px] tracking-wider text-white/55">
            내 원서 조합{" "}
            <span className="font-mono text-accent">{filledCount}</span>
            <span className="text-white/35"> / 3장</span>
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveImage}
              disabled={saving}
              className="flex items-center gap-1 text-[12px] text-white/65 transition-colors hover:text-accent disabled:opacity-50"
            >
              <svg aria-hidden width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M7 1v8m0 0L4 6.2M7 9l3-2.8M1.5 10.5V12a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {saving ? "만드는 중…" : "이미지 저장"}
            </button>
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center gap-1 text-[12px] text-white/65 transition-colors hover:text-accent"
            >
              <svg aria-hidden width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M5.8 8.2a2.8 2.8 0 0 0 4 0l2-2a2.83 2.83 0 0 0-4-4l-1 1M8.2 5.8a2.8 2.8 0 0 0-4 0l-2 2a2.83 2.83 0 0 0 4 4l1-1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              링크 복사
            </button>
            <button
              type="button"
              onClick={onClear}
              className="text-[12px] text-white/50 underline underline-offset-2 transition-colors hover:text-white/80"
            >
              비우기
            </button>
          </div>
        </div>

        <div className="mt-2 flex items-stretch gap-2 overflow-x-auto pb-1">
          {mainGuns.map((g) => {
            const entry = selection[g] ? byId.get(selection[g]!) : undefined;
            return entry ? (
              <div
                key={g}
                className="flex shrink-0 items-center gap-2 rounded-md border border-accent/40 bg-accent/10 px-3 py-2"
              >
                <span className="font-mono text-xs font-bold text-accent">
                  {g}
                </span>
                <span className="text-xs font-medium text-white">
                  {entry.university}
                  {entry.campus ? ` ${entry.campus}` : ""}
                </span>
                <span className="text-[11px] text-white/60">
                  {silgiShort(entry)}
                </span>
                <button
                  type="button"
                  onClick={() => onRemove(g)}
                  aria-label={`${GUN_LABEL[g]} 선택 해제`}
                  className="ml-1 rounded px-1 text-white/40 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-accent"
                >
                  ×
                </button>
              </div>
            ) : (
              <button
                key={g}
                type="button"
                onClick={() => onGoGun(g)}
                className="flex shrink-0 items-center gap-2 rounded-md border border-dashed border-white/20 px-3 py-2 text-xs text-white/40 transition-colors hover:border-accent/50 hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
              >
                <span className="font-mono font-bold">{g}</span>
                비어 있음 — {GUN_LABEL[g]} 보기
              </button>
            );
          })}
          {selection["별도"] && byId.get(selection["별도"]!) && (
            <div className="flex shrink-0 items-center gap-2 rounded-md border border-dashed border-accent/50 px-3 py-2">
              <span className="font-mono text-xs font-bold text-accent/90">
                +
              </span>
              <span className="text-xs font-medium text-white">
                {byId.get(selection["별도"]!)!.university}
              </span>
              <button
                type="button"
                onClick={() => onRemove("별도")}
                aria-label="한예종 선택 해제"
                className="ml-1 rounded px-1 text-white/40 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-accent"
              >
                ×
              </button>
            </div>
          )}
        </div>

        <div className="mt-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          {/* 1~2장 상태는 트레이 높이를 최소화한다 — 모바일은 다음 질문 한
              줄만, 궁합 headline은 md 이상에서만 덧붙인다(detail은 공유
              이미지·상담 요약 텍스트에는 그대로 들어간다). */}
          <p aria-live="polite" className="text-[13px] leading-snug">
            {complete ? (
              <span className="font-bold text-accent">
                ✓ 3장 완성! 이 조합, 1:1 상담에서 바로 점검받아 보세요.
              </span>
            ) : (
              <>
                {analysis.headline && (
                  <span className="hidden font-medium text-accent md:inline">
                    {analysis.headline}{" "}
                  </span>
                )}
                <span className="text-white/65">
                  선택한 대학, 내 성적에서도 현실적일까요?
                </span>
              </>
            )}
          </p>
          {/* CTA 강도는 engagement에 맞춘다 —
              1~2장: 유료 상담을 요구하기엔 이르다. "이 선택이 내 성적에서
              현실적인가?"가 자연스러운 다음 질문이라 무료 진단을 primary로,
              전략 상담은 낮은 강조의 secondary로 둔다.
              3장 완성: 전략 의도가 충분히 강하므로 기존 강한 상담 CTA 유지.
              내부 경로(/consulting 등)는 같은 탭에서, 외부 예약 주소만 새 탭에서 연다 */}
          {complete ? (
            <a
              href={ctaHref}
              {...(/^https?:/.test(ctaHref)
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              onClick={handleCta}
              className="w-full shrink-0 rounded-md bg-accent px-6 py-3 text-center text-sm font-bold text-black shadow-[0_0_0_3px_rgba(255,255,255,0.12)] transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:w-auto"
            >
              이 3장 조합으로 전략 상담받기
            </a>
          ) : (
            <div className="flex shrink-0 items-center gap-3">
              <Link
                href={
                  picked.length === 1
                    ? jungsiDiagnosisHref(picked[0].university)
                    : jungsiDiagnosisHref()
                }
                onClick={() =>
                  trackDiagnosis("jungsi_plantray_diagnosis_click", {
                    plan_filled_count: filledCount,
                    target_university:
                      picked.length === 1 ? picked[0].university : undefined,
                  })
                }
                className="flex-1 rounded-md bg-accent px-5 py-2.5 text-center text-[13px] font-bold text-black transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:flex-none"
              >
                무료로 확인하기 →
              </Link>
              <a
                href={ctaHref}
                {...(/^https?:/.test(ctaHref)
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                onClick={handleCta}
                className="shrink-0 py-2 text-[12px] text-white/60 underline underline-offset-2 transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                1:1 전략 상담
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── 메인 탐색기 ─────────────────────────── */

const SILGI_FILTERS: (SilgiCategory | "전체")[] = [
  "전체",
  ...SILGI_CATEGORY_ORDER,
];

/** 종목 필터 판정 — 택1 대학은 응시 가능 종목 필터 모두에 노출 */
function matchesSilgiFilter(e: JungsiEntry, filter: SilgiCategory | "전체") {
  if (filter === "전체") return true;
  if (filter === "비실기") return e.subjects.length === 0;
  return e.subjects.includes(filter);
}

export default function JungsiExplorer({
  ctaHref = "#",
}: {
  ctaHref?: string;
}) {
  const [gun, setGun] = useState<Gun>("가");
  const [silgi, setSilgi] = useState<SilgiCategory | "전체">("전체");
  const [query, setQuery] = useState("");
  const [selection, setSelection] = useState<Selection>({});
  const [focusId, setFocusId] = useState<string | null>(null);
  // 성적 추천기에서 넘어온 카드 — 결과로 돌아가는 링크를 카드 위에 유지
  const [cameFromScoreId, setCameFromScoreId] = useState<string | null>(null);
  // 펼쳐 둔 항목(entry.id) — 여러 개를 동시에 열어 비교할 수 있게 Set으로 관리.
  // 군·필터·검색 변경과는 독립이며, 그 코드에서 이 상태를 초기화하지 않는다.
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set());

  const toggleOpen = (id: string) =>
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const closeAllOpen = () => setOpenIds(new Set());

  const rootRef = useRef<HTMLDivElement>(null);
  const tabBarRef = useRef<HTMLDivElement>(null);

  // 사이트 헤더는 fixed인데 높이가 고정이 아니다 — 알림 띠(닫기 가능)와
  // 반응형 네비 때문에 64~130px 사이를 오간다. 실제 높이를 측정해
  // 스티키 탭바가 헤더 바로 아래 붙도록 top을 맞춘다.
  const [headerH, setHeaderH] = useState(64);
  useEffect(() => {
    // 본문 히어로의 <header>가 아니라 fixed 사이트 헤더만 잰다
    const header = document.querySelector("header.fixed");
    if (!header) return;
    const update = () =>
      setHeaderH(Math.round(header.getBoundingClientRect().height));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(header);
    return () => ro.disconnect();
  }, []);

  // 군 전환 시 목록을 아래까지 스크롤한 상태 그대로 두면 빈 화면·엉뚱한
  // 섹션이 보인다 — 탭바(스티키) 바로 아래 목록 시작점으로 복귀시킨다.
  const scrollToListTop = () => {
    const el = rootRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - headerH - 16;
    if (window.scrollY > top) window.scrollTo(0, Math.max(0, top));
  };

  // 다른 섹션(성적 추천기)에서 "이 대학으로 이동" 요청을 받으면 해당 군으로 전환
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ id: string; gun: Gun }>).detail;
      if (!detail) return;
      setGun(detail.gun);
      setSilgi("전체");
      setQuery("");
      // 찾아간 대학은 바로 상세를 볼 수 있도록 자동으로 펼친다(기존 펼침은 유지)
      setOpenIds((prev) => {
        if (prev.has(detail.id)) return prev;
        const next = new Set(prev);
        next.add(detail.id);
        return next;
      });
      setFocusId(detail.id);
      setCameFromScoreId(detail.id);
    };
    window.addEventListener("jungsi:focus", handler);
    return () => window.removeEventListener("jungsi:focus", handler);
  }, []);

  const byId = useMemo(
    () => new Map(jungsiEntries.map((e) => [e.id, e])),
    [],
  );

  // 공유 링크(?pick=id,id,...)로 들어온 경우 조합 복원
  const restored = useRef(false);
  useEffect(() => {
    const pick = new URLSearchParams(window.location.search).get("pick");
    restored.current = true;
    if (!pick) return;
    const next: Selection = {};
    for (const id of pick.split(",")) {
      const entry = byId.get(id);
      if (entry && !next[entry.gun]) next[entry.gun] = entry.id;
    }
    if (Object.keys(next).length > 0) setSelection(next);
  }, [byId]);

  // 조합이 바뀔 때마다 URL에 반영 → 링크 복사만으로 조합 공유 가능
  useEffect(() => {
    if (!restored.current) return;
    const url = new URL(window.location.href);
    const ids = GUN_ORDER.filter((g) => selection[g]).map(
      (g) => selection[g]!,
    );
    if (ids.length > 0) url.searchParams.set("pick", ids.join(","));
    else url.searchParams.delete("pick");
    window.history.replaceState(null, "", url);
  }, [selection]);

  const gunCounts = useMemo(() => {
    const counts = { 가: 0, 나: 0, 다: 0, 별도: 0 } as Record<Gun, number>;
    for (const e of jungsiEntries) counts[e.gun] += 1;
    return counts;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim();
    return jungsiEntries.filter(
      (e) =>
        // 검색어가 있으면 전체 군에서 찾고, 없으면 선택한 군만 표시
        (q !== "" || e.gun === gun) &&
        matchesSilgiFilter(e, silgi) &&
        (q === "" ||
          e.university.includes(q) ||
          (e.campus ?? "").includes(q) ||
          e.units.includes(q)),
    );
  }, [gun, silgi, query]);

  const visibleGuns = GUN_ORDER.filter((g) =>
    filtered.some((e) => e.gun === g),
  );

  // 군 전환으로 카드가 렌더된 뒤, 대상 대학으로 스크롤 + 강조
  useEffect(() => {
    if (!focusId) return;
    const el = document.getElementById(`uni-${focusId}`);
    if (!el) return;
    // scrollIntoView는 body 스크롤 컨테이너 때문에 뷰포트를 못 움직여서 window.scrollTo 사용.
    // 실측한 헤더 높이 + 스티키 군 탭바 높이 아래로 오도록 오프셋 확보.
    const tabBarH = tabBarRef.current?.offsetHeight ?? 120;
    const top =
      el.getBoundingClientRect().top + window.scrollY - headerH - tabBarH - 12;
    // 네이티브 smooth는 reduced-motion 환경에서 no-op이 되므로 즉시 이동으로 확실히 처리
    window.scrollTo(0, Math.max(0, top));
    // 목록 컨테이너가 overflow-hidden이라 바깥 ring은 잘린다 — 안쪽 ring으로 강조
    el.classList.add("ring-2", "ring-inset", "ring-accent");
    const t = setTimeout(
      () => el.classList.remove("ring-2", "ring-inset", "ring-accent"),
      1800,
    );
    setFocusId(null);
    return () => clearTimeout(t);
  }, [focusId, filtered, headerH]);

  const toggleEntry = (entry: JungsiEntry) => {
    setSelection((prev) =>
      prev[entry.gun] === entry.id
        ? Object.fromEntries(
            Object.entries(prev).filter(([g]) => g !== entry.gun),
          )
        : { ...prev, [entry.gun]: entry.id },
    );
  };

  const removeGun = (g: Gun) =>
    setSelection((prev) =>
      Object.fromEntries(Object.entries(prev).filter(([key]) => key !== g)),
    );

  const goGun = (g: Gun) => {
    setGun(g);
    setSilgi("전체");
    setQuery("");
    setCameFromScoreId(null);
    scrollToListTop();
  };

  const hasSelection = Object.keys(selection).length > 0;

  return (
    <div ref={rootRef}>
      {/* 군 탭 + 필터 */}
      <div
        ref={tabBarRef}
        role="tablist"
        aria-label="모집군 선택"
        style={{ top: headerH }}
        className="sticky z-30 -mx-5 border-b border-white/10 bg-black/85 px-5 py-3 backdrop-blur-md"
      >
        <div className="scrollbar-hide flex gap-2 overflow-x-auto">
          {GUN_ORDER.map((g) => {
            const active = gun === g;
            return (
              <button
                key={g}
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setGun(g);
                  setCameFromScoreId(null);
                  scrollToListTop();
                }}
                className={`shrink-0 rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  active
                    ? "bg-accent text-black"
                    : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {GUN_LABEL[g]}
                <span
                  className={`ml-1.5 font-mono text-[11px] ${
                    active ? "text-black/60" : "text-white/35"
                  }`}
                >
                  {gunCounts[g]}
                </span>
              </button>
            );
          })}
          <div className="relative ml-auto shrink-0">
            <svg
              aria-hidden
              className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-white/50"
              width="13"
              height="13"
              viewBox="0 0 14 14"
              fill="none"
            >
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4" />
              <path d="M13 13L9.6 9.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="대학·학과 검색"
              aria-label="대학 또는 학과 검색"
              className="w-36 rounded-md border border-white/25 bg-white/[0.07] py-2 pl-8 pr-3 text-[13px] text-white placeholder:text-white/50 focus:border-accent/60 focus:bg-white/[0.1] focus:outline-none md:w-52"
            />
          </div>
        </div>

        <div className="scrollbar-hide mt-2.5 flex items-center gap-2 overflow-x-auto md:flex-wrap md:overflow-x-visible">
          <span className="shrink-0 text-[12px] tracking-wider text-white/45">
            실기 종목
          </span>
          {SILGI_FILTERS.map((s) => {
            const active = silgi === s;
            return (
              <button
                key={s}
                onClick={() => setSilgi(s)}
                aria-pressed={active}
                className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  active
                    ? "border-accent bg-accent/15 text-accent"
                    : "border-white/15 text-white/60 hover:border-white/35 hover:text-white/85"
                }`}
              >
                {s === "전체" ? "전체" : SILGI_META[s].short}
              </button>
            );
          })}
        </div>
      </div>

      {/* 사용 안내 (선택 전에만) */}
      {!hasSelection && (
        <p className="mt-5 rounded-md border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm leading-relaxed text-white/70">
          대학·학과를 누르면 전형방법·반영비율·실기·모집인원·경쟁률이 열립니다.
          여러 대학을 동시에 펼쳐 비교해 보세요. 마음에 드는 대학은{" "}
          <span className="text-accent">담기</span>로 원서 조합에 추가됩니다 —
          군마다 1곳씩, 3장을 채우면 실기 종목 궁합을 바로 알려드립니다.
        </p>
      )}

      {/* 군별 섹션 */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-sm text-white/50">
            이 조합에 해당하는 대학이 없습니다.
          </p>
          <button
            onClick={() => {
              setGun("가");
              setSilgi("전체");
              setQuery("");
            }}
            className="mt-4 text-sm text-accent underline underline-offset-4"
          >
            필터 초기화
          </button>
        </div>
      ) : (
        visibleGuns.map((g) => {
          const entries = filtered.filter((e) => e.gun === g);
          const anyOpen = entries.some((e) => openIds.has(e.id));
          return (
            <section key={g} className="pt-10" aria-label={GUN_LABEL[g]}>
              <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="text-lg font-bold text-white">
                  <span className="mr-2 font-mono text-accent">
                    {g === "별도" ? "+" : g}
                  </span>
                  {GUN_LABEL[g]}
                </h3>
                <span className="text-[13px] text-white/50">
                  {entries.length}개 대학
                </span>
                {g === "별도" && (
                  <span className="text-[13px] text-white/50">
                    가나다군과 별개로 지원 가능
                  </span>
                )}
                {anyOpen && (
                  <button
                    type="button"
                    onClick={closeAllOpen}
                    className="ml-auto text-[12px] text-white/45 underline underline-offset-2 transition-colors hover:text-white/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    펼친 항목 모두 닫기
                  </button>
                )}
              </div>
              <div className="divide-y divide-white/[0.08] overflow-hidden rounded-lg border border-white/10 bg-[#0a0a0a]">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    id={`uni-${entry.id}`}
                    className="scroll-mt-48 transition-shadow"
                  >
                    {cameFromScoreId === entry.id && (
                      <a
                        href="#score-finder"
                        onClick={() => setCameFromScoreId(null)}
                        className="inline-flex items-center gap-1.5 px-4 pt-3 text-[13px] font-medium text-accent/90 transition-colors hover:text-accent md:px-5"
                      >
                        <span aria-hidden>↑</span>
                        내 성적 추천 결과로 돌아가기
                      </a>
                    )}
                    <UniversityAccordionItem
                      entry={entry}
                      open={openIds.has(entry.id)}
                      selected={selection[entry.gun] === entry.id}
                      onToggleOpen={toggleOpen}
                      onToggleSelect={toggleEntry}
                    />
                  </div>
                ))}
              </div>
            </section>
          );
        })
      )}

      {/* 목록을 끝까지 본 사용자를 성적 기반 검색으로 안내 (페이지 내 1회) */}
      {filtered.length > 0 && (
        <div className="mt-10 flex flex-col gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-5 md:flex-row md:items-center md:justify-between md:gap-6">
          <p className="text-sm leading-relaxed text-white/70">
            <span className="font-medium text-white/90">
              일일이 비교하지 않아도 됩니다.
            </span>
            <br className="hidden md:block" /> 수능 백분위를 입력하면 대학마다
            다른 반영식으로 환산해, 지원 가능한 대학을 유리한 순으로 보여드립니다.
          </p>
          <a
            href="#score-finder"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-accent/50 px-5 py-2.5 text-sm font-medium text-accent transition-colors hover:border-accent hover:bg-accent/[0.08] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            내 성적으로 대학 찾기
            <span aria-hidden>→</span>
          </a>
        </div>
      )}

      {/* 확인 중 대학 */}
      {pendingUniversities.length > 0 && (
        <div className="mt-10 rounded-lg border border-yellow-900/50 bg-yellow-950/15 p-5">
          <p className="text-xs font-medium tracking-wide text-yellow-500/90">
            모집군 확인 중
          </p>
          {pendingUniversities.map((p) => (
            <p
              key={p.university}
              className="mt-2.5 text-sm leading-relaxed text-white/65"
            >
              <span className="font-medium text-white/90">
                {p.university} {p.units}
              </span>
              {" — "}
              {p.reason}
            </p>
          ))}
        </div>
      )}

      {/* 트레이가 본문을 가리지 않도록 여백 확보 */}
      {hasSelection && <div aria-hidden className="h-44 md:h-36" />}

      {hasSelection && (
        <PlanTray
          selection={selection}
          byId={byId}
          onRemove={removeGun}
          onGoGun={goGun}
          onClear={() => setSelection({})}
          ctaHref={ctaHref}
        />
      )}
    </div>
  );
}
