"use client";

import { useMemo, useState } from "react";
import { jungsiEntries, SILGI_META, type Gun } from "@/lib/jungsi-data";
import {
  hasScore,
  isCompatibleTrack,
  rankByGun,
  recommendCombo,
  RECOMMEND_COVERAGE,
  type PrepTrack,
  type Ranked,
  type StudentScore,
  type Tier,
} from "@/lib/jungsi-recommend";

const TRACK_OPTIONS: { value: PrepTrack | "전체"; label: string }[] = [
  { value: "전체", label: "전체 보기" },
  { value: "기초디자인", label: "기초디자인" },
  { value: "기초소양", label: "기초소양·기초조형" },
];

/** 아래 '군별 대학 한눈에 보기'의 해당 대학 카드로 이동 요청 */
function focusUniversity(id: string, gun: Gun) {
  window.dispatchEvent(
    new CustomEvent("jungsi:focus", { detail: { id, gun } }),
  );
}

const GUN_LABEL: Record<Gun, string> = {
  가: "가군",
  나: "나군",
  다: "다군",
  별도: "별도(한예종)",
};

const TIER_STYLE: Record<Tier, string> = {
  안정: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  적정: "border-accent/50 bg-accent/15 text-accent",
  도전: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  낮음: "border-white/15 bg-white/5 text-white/40",
};

type NumField = "국어" | "수학" | "탐구";

function pctInput(v: string): number | null {
  if (v.trim() === "") return null;
  const n = Number(v);
  if (Number.isNaN(n)) return null;
  return Math.max(0, Math.min(100, n));
}

/** 백분위 입력 + 테마 맞춤 자체 화살표 스테퍼(네이티브 스피너 대체) */
function NumberField({
  value,
  onChange,
  placeholder,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const step = (dir: 1 | -1) => {
    const n = value.trim() === "" ? null : Number(value);
    const base = n == null || Number.isNaN(n) ? (dir === 1 ? -1 : 1) : n;
    onChange(String(Math.max(0, Math.min(100, base + dir))));
  };
  return (
    <div
      className={`flex items-stretch overflow-hidden rounded-md border border-white/15 transition-colors focus-within:border-accent/60 ${
        disabled ? "opacity-40" : ""
      }`}
    >
      <input
        type="number"
        inputMode="numeric"
        min={0}
        max={100}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0"
      />
      <div className="flex w-7 flex-col border-l border-white/10">
        {([1, -1] as const).map((dir) => (
          <button
            key={dir}
            type="button"
            tabIndex={-1}
            aria-label={dir === 1 ? "1 올리기" : "1 내리기"}
            disabled={disabled}
            onClick={() => step(dir)}
            className={`flex flex-1 items-center justify-center text-white/40 transition-colors hover:bg-white/5 hover:text-accent disabled:pointer-events-none ${
              dir === -1 ? "border-t border-white/10" : ""
            }`}
          >
            <svg width="9" height="6" viewBox="0 0 9 6" fill="none" aria-hidden>
              <path
                d={dir === 1 ? "M1 5L4.5 1.5L8 5" : "M1 1L4.5 4.5L8 1"}
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}

/** 환산 백분위 막대 */
function ScoreBar({ value }: { value: number }) {
  return (
    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/8">
      <div className="h-full rounded-full bg-accent" style={{ width: `${value}%` }} />
    </div>
  );
}

function RankRow({ r }: { r: Ranked }) {
  const { entry } = r;
  return (
    <li>
      <button
        type="button"
        onClick={() => focusUniversity(entry.id, entry.gun)}
        title="아래 상세 표에서 이 대학 보기"
        className="block w-full rounded-md border border-white/10 bg-black/30 px-3 py-2.5 text-left transition-colors hover:border-accent/40 hover:bg-white/[0.05] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">
            {entry.university}
            {entry.campus ? (
              <span className="text-white/50"> {entry.campus}</span>
            ) : null}
          </p>
          <p className="mt-0.5 truncate text-[11px] text-white/40">
            {SILGI_META[entry.silgi].short} · {entry.units}
          </p>
        </div>
        <div className="shrink-0 text-right">
          {r.converted != null ? (
            <>
              <p className="font-mono text-sm font-bold text-white">
                {r.converted.toFixed(1)}
                <span className="ml-0.5 text-[10px] font-normal text-white/40">
                  환산
                </span>
              </p>
              {r.tier && (
                <span
                  className={`mt-0.5 inline-block rounded-full border px-1.5 py-0.5 text-[10px] font-medium ${TIER_STYLE[r.tier]}`}
                >
                  {r.tier}
                </span>
              )}
            </>
          ) : (
            <span className="text-[11px] text-white/35">{r.blocked}</span>
          )}
        </div>
      </div>
      {r.converted != null && <ScoreBar value={r.converted} />}
      {r.cutoffLabel && (
        <p className="mt-1 text-[10px] text-white/35">{r.cutoffLabel}</p>
      )}
      </button>
    </li>
  );
}

export default function ScoreRecommender({ ctaHref }: { ctaHref: string }) {
  const [국어, set국어] = useState("");
  const [수학, set수학] = useState("");
  const [수학미응시, set수학미응시] = useState(false);
  const [영어, set영어] = useState(""); // 등급 1~9
  const [탐구, set탐구] = useState("");
  const [track, setTrack] = useState<PrepTrack | "전체">("전체");

  const score: StudentScore = useMemo(
    () => ({
      국어: pctInput(국어),
      수학: 수학미응시 ? null : pctInput(수학),
      영어: 영어 === "" ? null : Number(영어),
      탐구: pctInput(탐구),
    }),
    [국어, 수학, 수학미응시, 영어, 탐구],
  );

  const active = hasScore(score);
  const trackArg = track === "전체" ? null : track;
  const ranked = useMemo(
    () => (active ? rankByGun(score, trackArg) : null),
    [active, score, trackArg],
  );
  const combo = useMemo(
    () => (active ? recommendCombo(score, trackArg) : null),
    [active, score, trackArg],
  );
  const excludedCount = useMemo(() => {
    if (track === "전체") return 0;
    return jungsiEntries.filter(
      (e) =>
        (e.gun === "가" || e.gun === "나" || e.gun === "다") &&
        !isCompatibleTrack(e.silgi, track),
    ).length;
  }, [track]);

  const inputCls =
    "w-full rounded-md border border-white/15 bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/25 focus:border-accent/60 focus:outline-none";

  return (
    <div className="rounded-lg border border-white/10 bg-[#0a0a0a] p-5 md:p-6">
      {/* 입력 폼 */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <label className="block">
          <span className="mb-1 block text-[11px] text-white/50">국어 백분위</span>
          <NumberField value={국어} onChange={set국어} placeholder="0~100" />
        </label>
        <label className="block">
          <span className="mb-1 block text-[11px] text-white/50">수학 백분위</span>
          <NumberField value={수학} onChange={set수학} placeholder="0~100" disabled={수학미응시} />
        </label>
        <label className="block">
          <span className="mb-1 block text-[11px] text-white/50">영어 등급</span>
          <select
            value={영어}
            onChange={(e) => set영어(e.target.value)}
            className={`${inputCls} [&>option]:bg-[#0a0a0a] [&>option]:text-white`}
          >
            <option value="" className="bg-[#0a0a0a] text-white/50">등급</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((g) => (
              <option key={g} value={g} className="bg-[#0a0a0a] text-white">
                {g}등급
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-[11px] text-white/50">탐구 백분위</span>
          <NumberField value={탐구} onChange={set탐구} placeholder="2과목 평균" />
        </label>
      </div>
      <label className="mt-2.5 inline-flex cursor-pointer items-center gap-2 text-[12px] text-white/55">
        <input
          type="checkbox" checked={수학미응시}
          onChange={(e) => set수학미응시(e.target.checked)}
          className="h-3.5 w-3.5 accent-[color:var(--accent,#e0ff4f)]"
        />
        수학 미응시 (국어·탐구 위주로 봅니다)
      </label>

      {/* 실기유형 선택 */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-[12px] text-white/55">지금 준비하는 실기</span>
        {TRACK_OPTIONS.map((opt) => {
          const on = track === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setTrack(opt.value)}
              aria-pressed={on}
              className={`rounded-full border px-3 py-1 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                on
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-white/15 text-white/60 hover:border-white/35 hover:text-white/85"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      {track !== "전체" && (
        <p className="mt-2 text-[12px] leading-relaxed text-white/45">
          <span className="text-white/70">{track}</span>으로 지원 가능한 대학만
          보여드립니다 — 선택실기·비실기 포함.
          {excludedCount > 0 && (
            <> 다른 실기 준비가 필요한 {excludedCount}곳은 제외했습니다.</>
          )}
        </p>
      )}

      {!active && (
        <p className="mt-4 text-[13px] leading-relaxed text-white/45">
          모의고사·수능 백분위를 입력하면, 대학마다 다른 반영식으로 환산해{" "}
          <span className="text-white/70">가·나·다군에서 유리한 대학</span>을 정렬해
          드립니다.
        </p>
      )}

      {/* 결과 */}
      {active && ranked && combo && (
        <div className="mt-6">
          {/* 추천 조합 */}
          <p className="mb-1 text-sm font-bold text-white">
            내 점수로 유리한 3장 조합
          </p>
          <p className="mb-2 text-[11px] text-white/40">
            카드를 누르면 아래 <span className="text-white/60">군별 대학 표</span>의
            해당 대학으로 이동합니다.
          </p>
          <div className="grid gap-2 md:grid-cols-3">
            {(["가", "나", "다"] as Gun[]).map((g) => {
              const pick = combo[g];
              const inner = (
                <>
                  <p className="text-[11px] font-mono text-accent">{GUN_LABEL[g]}</p>
                  {pick ? (
                    <>
                      <p className="mt-1 text-sm font-bold text-white">
                        {pick.entry.university}
                        {pick.entry.campus ? (
                          <span className="text-white/50"> {pick.entry.campus}</span>
                        ) : null}
                      </p>
                      <p className="mt-0.5 text-[11px] text-white/45">
                        {SILGI_META[pick.entry.silgi].short} · 환산{" "}
                        <span className="font-mono text-white/70">
                          {pick.converted?.toFixed(1)}
                        </span>
                        {pick.tier ? ` · ${pick.tier}` : ""}
                      </p>
                    </>
                  ) : (
                    <p className="mt-1 text-[12px] text-white/40">
                      해당 점수대 추천 대기 — 아래 목록 참고
                    </p>
                  )}
                </>
              );
              return pick ? (
                <button
                  key={g}
                  type="button"
                  onClick={() => focusUniversity(pick.entry.id, g)}
                  title="아래 상세 표에서 이 대학 보기"
                  className="rounded-md border border-accent/30 bg-accent/[0.06] p-3 text-left transition-colors hover:border-accent/60 hover:bg-accent/[0.12] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {inner}
                </button>
              ) : (
                <div
                  key={g}
                  className="rounded-md border border-accent/30 bg-accent/[0.06] p-3"
                >
                  {inner}
                </div>
              );
            })}
          </div>

          {/* 군별 전체 정렬 */}
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {(["가", "나", "다"] as Gun[]).map((g) => (
              <div key={g}>
                <p className="mb-2 text-xs font-bold text-white/70">
                  {GUN_LABEL[g]}{" "}
                  <span className="font-normal text-white/35">
                    환산 높은 순
                  </span>
                </p>
                <ul className="space-y-2">
                  {ranked[g].slice(0, 6).map((r) => (
                    <RankRow key={r.entry.id} r={r} />
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-6 flex flex-col items-center gap-3 rounded-lg border border-accent/30 bg-accent/[0.06] p-4 text-center md:flex-row md:justify-between md:text-left">
            <p className="text-[13px] leading-relaxed text-white/70">
              <span className="font-bold text-white">여기까지는 수능 점수 기준입니다.</span>{" "}
              실기 실력·지망 학과까지 넣은 정확한 조합은 상담에서 잡아 드립니다.
            </p>
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-accent px-6 py-3 text-sm font-bold text-black transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              내 조합 무료 진단
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      )}

      {/* 유의 */}
      <p className="mt-4 border-t border-white/10 pt-3 text-[11px] leading-relaxed text-white/35">
        참고용입니다. 반영식은 각 대학 모집요강 기준이지만, 합격선은 2025학년도
        참고치가 있는 {RECOMMEND_COVERAGE.withCutoff}곳만 안정/적정/도전을 표시하며
        실기 성적은 반영하지 않습니다. 영어·한국사 등급 환산은 대학마다 달라
        어림값입니다. 서울대·삼육대 등 자체 환산 대학은 계산에서 제외됩니다.
      </p>
    </div>
  );
}
