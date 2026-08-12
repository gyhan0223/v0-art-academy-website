"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { jungsiEntries, silgiShort, type Gun } from "@/lib/jungsi-data";
import {
  hasScore,
  isCompatibleTrack,
  isWomensUniv,
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
  { value: "발상과표현", label: "발상과 표현" },
  { value: "기초조형·소양평가", label: "기초조형·소양평가" },
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

type DialOption = { value: number | null; label: string };

const DIAL_ITEM_H = 40;
const DIAL_VISIBLE = 5;

const PCT_OPTIONS: DialOption[] = [
  { value: null, label: "—" },
  ...Array.from({ length: 101 }, (_, i) => ({
    value: 100 - i,
    label: String(100 - i),
  })),
];

const GRADE_OPTIONS: DialOption[] = [
  { value: null, label: "—" },
  ...Array.from({ length: 9 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1}등급`,
  })),
];

/** 팝업 안에서 위아래로 굴리는 다이얼 휠 (iOS 피커 스타일) */
function DialWheel({
  options,
  value,
  onChange,
  label,
}: {
  options: DialOption[];
  value: number | null;
  onChange: (v: number | null) => void;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const settleTimer = useRef<number | undefined>(undefined);
  const index = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const target = index * DIAL_ITEM_H;
    if (Math.abs(el.scrollTop - target) > 2) el.scrollTop = target;
  }, [index]);

  useEffect(() => () => window.clearTimeout(settleTimer.current), []);

  const commit = (i: number) => {
    const opt = options[Math.max(0, Math.min(options.length - 1, i))];
    if (opt && opt.value !== value) onChange(opt.value);
  };

  const handleScroll = () => {
    window.clearTimeout(settleTimer.current);
    settleTimer.current = window.setTimeout(() => {
      const el = ref.current;
      if (el) commit(Math.round(el.scrollTop / DIAL_ITEM_H));
    }, 120);
  };

  const selected = options[index];
  return (
    <div className="relative overflow-hidden rounded-lg">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-2 top-1/2 z-0 -translate-y-1/2 rounded-md bg-white/[0.08]"
        style={{ height: DIAL_ITEM_H }}
      />
      <div
        ref={ref}
        role="spinbutton"
        aria-label={label}
        aria-valuenow={value ?? undefined}
        aria-valuetext={selected?.label ?? "미입력"}
        tabIndex={0}
        onScroll={handleScroll}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp") {
            e.preventDefault();
            commit(index - 1);
          } else if (e.key === "ArrowDown") {
            e.preventDefault();
            commit(index + 1);
          }
        }}
        className="relative z-10 snap-y snap-mandatory overflow-y-auto overscroll-contain outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{
          height: DIAL_ITEM_H * DIAL_VISIBLE,
          paddingTop: (DIAL_ITEM_H * (DIAL_VISIBLE - 1)) / 2,
          paddingBottom: (DIAL_ITEM_H * (DIAL_VISIBLE - 1)) / 2,
        }}
      >
        {options.map((opt, i) => (
          <div
            key={opt.label}
            onClick={() => commit(i)}
            className={`flex snap-center items-center justify-center font-mono text-lg transition-colors ${
              i === index ? "font-bold text-accent" : "cursor-pointer text-white/30"
            }`}
            style={{ height: DIAL_ITEM_H }}
          >
            {opt.label}
          </div>
        ))}
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-10 bg-gradient-to-b from-[#131313] to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-10 bg-gradient-to-t from-[#131313] to-transparent"
      />
    </div>
  );
}

/** 값 표시 칸 — 누르면 다이얼 팝업이 열린다. 텍스트 입력이 없어 모바일 포커스 확대가 생기지 않는다 */
function DialPickerField({
  label,
  options,
  value,
  onChange,
  disabled,
  placeholder,
}: {
  label: string;
  options: DialOption[];
  value: number | null;
  onChange: (v: number | null) => void;
  disabled?: boolean;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const wheelWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    wheelWrapRef.current?.querySelector<HTMLElement>('[role="spinbutton"]')?.focus();
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const selected = options.find((o) => o.value === value);
  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(true)}
        className={`flex w-full items-center justify-between gap-2 rounded-md border border-white/15 px-3 py-2 text-left text-sm transition-colors hover:border-white/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
          disabled ? "opacity-40" : ""
        }`}
      >
        <span
          className={
            value != null ? "font-mono font-bold text-white" : "text-white/25"
          }
        >
          {value != null ? selected?.label : placeholder}
        </span>
        <svg width="9" height="6" viewBox="0 0 9 6" fill="none" aria-hidden
          className="shrink-0 text-white/40">
          <path d="M1 1L4.5 4.5L8 1" stroke="currentColor" strokeWidth="1.4"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${label} 선택`}
          className="fixed inset-0 z-[100] flex items-end justify-center md:items-center"
        >
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setOpen(false)}
          />
          <div
            ref={wheelWrapRef}
            className="relative w-full rounded-t-2xl border border-white/10 bg-[#131313] p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl md:w-80 md:rounded-2xl"
          >
            <p className="mb-2 text-center text-sm font-bold text-white">
              {label}
            </p>
            <DialWheel
              options={options}
              value={value}
              onChange={onChange}
              label={label}
            />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-4 w-full rounded-md bg-accent py-2.5 text-sm font-bold text-black transition-opacity hover:opacity-85"
            >
              완료
            </button>
          </div>
        </div>,
        document.body,
      )}
    </>
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
            {silgiShort(entry)} · {entry.units}
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
  const [국어, set국어] = useState<number | null>(null);
  const [수학, set수학] = useState<number | null>(null);
  const [수학미응시, set수학미응시] = useState(false);
  const [영어, set영어] = useState<number | null>(null); // 등급 1~9
  const [탐구, set탐구] = useState<number | null>(null);
  const [성별, set성별] = useState<"남" | "여" | null>(null);
  const [track, setTrack] = useState<PrepTrack | "전체">("전체");

  const score: StudentScore = useMemo(
    () => ({
      국어,
      수학: 수학미응시 ? null : 수학,
      영어,
      탐구: 탐구,
    }),
    [국어, 수학, 수학미응시, 영어, 탐구],
  );

  const active = hasScore(score);
  const trackArg = track === "전체" ? null : track;
  const excludeWomens = 성별 === "남";
  const ranked = useMemo(
    () => (active ? rankByGun(score, trackArg, { excludeWomens }) : null),
    [active, score, trackArg, excludeWomens],
  );
  const combo = useMemo(
    () => (active ? recommendCombo(score, trackArg, { excludeWomens }) : null),
    [active, score, trackArg, excludeWomens],
  );
  const womensCount = useMemo(
    () =>
      new Set(
        jungsiEntries
          .filter(
            (e) =>
              (e.gun === "가" || e.gun === "나" || e.gun === "다") &&
              isWomensUniv(e),
          )
          .map((e) => e.university),
      ).size,
    [],
  );
  const excludedCount = useMemo(() => {
    if (track === "전체") return 0;
    return jungsiEntries.filter(
      (e) =>
        (e.gun === "가" || e.gun === "나" || e.gun === "다") &&
        !isCompatibleTrack(e.subjects, track),
    ).length;
  }, [track]);

  return (
    <div className="rounded-lg border border-white/10 bg-[#0a0a0a] p-5 md:p-6">
      {/* 입력 폼 */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div>
          <span className="mb-1 block text-[11px] text-white/50">국어 백분위</span>
          <DialPickerField
            label="국어 백분위"
            options={PCT_OPTIONS}
            value={국어}
            onChange={set국어}
            placeholder="0~100"
          />
        </div>
        <div>
          <span className="mb-1 block text-[11px] text-white/50">수학 백분위</span>
          <DialPickerField
            label="수학 백분위"
            options={PCT_OPTIONS}
            value={수학}
            onChange={set수학}
            disabled={수학미응시}
            placeholder="0~100"
          />
        </div>
        <div>
          <span className="mb-1 block text-[11px] text-white/50">영어 등급</span>
          <DialPickerField
            label="영어 등급"
            options={GRADE_OPTIONS}
            value={영어}
            onChange={set영어}
            placeholder="등급"
          />
        </div>
        <div>
          <span className="mb-1 block text-[11px] text-white/50">탐구 백분위</span>
          <DialPickerField
            label="탐구 백분위"
            options={PCT_OPTIONS}
            value={탐구}
            onChange={set탐구}
            placeholder="2과목 평균"
          />
        </div>
      </div>
      <p className="mt-2 text-[11px] text-white/35">
        칸을 누르면 다이얼이 열립니다. 위아래로 굴려 맞춘 뒤 완료를 누르세요.
      </p>
      <label className="mt-2.5 inline-flex cursor-pointer items-center gap-2 text-[12px] text-white/55">
        <input
          type="checkbox" checked={수학미응시}
          onChange={(e) => set수학미응시(e.target.checked)}
          className="h-3.5 w-3.5 accent-[color:var(--accent,#e0ff4f)]"
        />
        수학 미응시 (국어·탐구 위주로 봅니다)
      </label>

      {/* 성별 선택 — 남학생은 여대 제외 */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-[12px] text-white/55">성별</span>
        {(["남", "여"] as const).map((g) => {
          const on = 성별 === g;
          return (
            <button
              key={g}
              type="button"
              onClick={() => set성별(on ? null : g)}
              aria-pressed={on}
              className={`rounded-full border px-3 py-1 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                on
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-white/15 text-white/60 hover:border-white/35 hover:text-white/85"
              }`}
            >
              {g}학생
            </button>
          );
        })}
        {excludeWomens && (
          <span className="text-[12px] text-white/45">
            여대 {womensCount}곳은 추천에서 제외합니다.
          </span>
        )}
      </div>

      {/* 실기 종목 선택 */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
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
          보여드립니다 — 이 종목으로 응시할 수 있는 택1 대학과 비실기 대학 포함.
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
          <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
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
                      <p className="mt-0.5 truncate text-[11px] text-white/55">
                        {pick.entry.units}
                      </p>
                      <p className="mt-0.5 text-[11px] text-white/45">
                        {silgiShort(pick.entry)} · 환산{" "}
                        <span className="font-mono text-white/70">
                          {pick.converted?.toFixed(1)}
                        </span>
                        {pick.stretch ? (
                          <span className="text-amber-300"> · 도전 카드</span>
                        ) : pick.tier ? (
                          ` · ${pick.tier}`
                        ) : (
                          ""
                        )}
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
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
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
              <span className="font-bold text-white">
                지원 가능한 대학은 확인했습니다. 이제 어떤 조합으로 지원할지가
                중요합니다.
              </span>{" "}
              실기 실력·지망 학과까지 넣은 가·나·다군 조합은 상담에서 함께 잡아
              드립니다.
            </p>
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-accent px-6 py-3 text-sm font-bold text-black transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              정시 지원 전략 상담받기
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      )}

      {/* 유의 */}
      <p className="mt-4 border-t border-white/10 pt-3 text-[11px] leading-relaxed text-white/35">
        참고용입니다. 반영식은 각 대학 모집요강 기준이지만, 합격선은 2026학년도
        입시결과가 공개된 {RECOMMEND_COVERAGE.withCutoff}곳만 안정/적정/도전을 표시하며
        실기 성적은 반영하지 않습니다. 영어·한국사 등급 환산은 대학마다 달라
        어림값입니다. 서울대는 표준점수 자체 환산을 백분위로 근사해 예술계열(국·탐)과
        디자인과(국·수·탐) 중 유리한 쪽 기준으로 계산한 어림값이며, 삼육대 등 자체
        등급환산 대학은 계산에서 제외됩니다.
      </p>
    </div>
  );
}
