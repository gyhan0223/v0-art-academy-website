"use client";

import { useMemo, useState } from "react";
import {
  GUN_ORDER,
  SILGI_META,
  jungsiEntries,
  pendingUniversities,
  type Gun,
  type JungsiEntry,
  type Major,
  type SilgiType,
} from "@/lib/jungsi-data";

/* ─────────────────────────── 배지 · 비율 바 ─────────────────────────── */

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
      className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] font-medium tracking-wide ${SILGI_BADGE[type]}`}
    >
      {SILGI_META[type].label}
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
      <div className="mt-1.5 flex gap-3 text-[11px] text-white/45">
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

/** 카드 상단: 실기내용 · 화지 · 시간 + 모집인원/경쟁률 요약 */
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

  const specParts = [entry.practical, entry.paper, entry.duration].filter(
    (v): v is string => Boolean(v),
  );

  return (
    <div className="mt-4 space-y-2">
      {specParts.length > 0 && (
        <p className="text-[12px] leading-relaxed text-white/55">
          <span className="text-white/40">실기</span>{" "}
          {specParts.join(" · ")}
        </p>
      )}
      {(totalQuota > 0 || minRate != null) && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px]">
          {totalQuota > 0 && (
            <span className="text-white/70">
              <span className="text-white/40">모집 </span>
              <span className="font-mono text-white">{totalQuota}</span>명
            </span>
          )}
          {minRate != null && (
            <span className="text-white/70">
              <span className="text-white/40">2025 경쟁률 </span>
              <span className="font-mono text-accent">
                {minRate === maxRate
                  ? fmtRate(minRate)
                  : `${minRate.toFixed(2)}~${maxRate!.toFixed(2)} : 1`}
              </span>
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/** 접이식 학과별 표 */
function MajorTable({ majors }: { majors: Major[] }) {
  if (majors.length === 0) return null;
  return (
    <details className="group/major mt-3">
      <summary className="flex cursor-pointer list-none items-center gap-1.5 text-[12px] font-medium text-white/55 transition-colors hover:text-accent">
        <span className="text-accent transition-transform group-open/major:rotate-90">
          ▸
        </span>
        학과별 모집 상세 · {majors.length}개 전공
      </summary>
      <ul className="mt-2 divide-y divide-white/5 rounded-md border border-white/10 bg-black/30">
        {majors.map((m) => (
          <li
            key={m.name}
            className="flex items-center justify-between gap-3 px-3 py-2"
          >
            <span className="min-w-0 text-[12px] leading-tight text-white/80">
              {m.name}
              {m.stageTag && (
                <span className="ml-1.5 rounded-sm bg-white/8 px-1 py-0.5 align-middle text-[10px] text-white/45">
                  {m.stageTag}
                </span>
              )}
              {(m.practical || m.duration) && (
                <span className="mt-0.5 block text-[10px] text-white/35">
                  {[m.practical, m.duration].filter(Boolean).join(" · ")}
                </span>
              )}
            </span>
            <span className="shrink-0 text-right text-[11px] leading-tight text-white/50">
              <span className="font-mono text-white/70">
                {m.quota != null ? `${m.quota}명` : m.quotaNote ?? "—"}
              </span>
              <span className="mt-0.5 block font-mono text-accent/80">
                {fmtRate(m.rate)}
              </span>
            </span>
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

function UniversityCard({
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
    <article
      className={`flex flex-col rounded-lg border bg-[#0a0a0a] p-5 transition-colors ${
        selected
          ? "border-accent/70 shadow-[0_0_0_1px_rgba(245,136,70,0.25)]"
          : "border-white/10 hover:border-white/25"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold leading-tight text-white">
            {entry.university}
            {entry.campus && (
              <span className="ml-1.5 text-xs font-medium text-white/45">
                {entry.campus}
              </span>
            )}
            {entry.unverified && (
              <span className="ml-2 align-middle text-[10px] font-medium text-yellow-500/90">
                확정 대기
              </span>
            )}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-white/55">
            {entry.units}
          </p>
        </div>
        <SilgiBadge type={entry.silgi} />
      </div>

      <ul className="mt-3 space-y-1">
        {entry.method.map((line) => (
          <li
            key={line}
            className="text-[13px] leading-relaxed text-white/80 before:mr-2 before:text-accent before:content-['·']"
          >
            {line}
          </li>
        ))}
      </ul>

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
                  className="rounded-sm bg-white/5 px-1.5 py-0.5 text-[11px] text-white/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          {entry.note && (
            <p className="mt-2 text-[11px] leading-relaxed text-white/40">
              {entry.note}
            </p>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => onToggle(entry)}
        aria-pressed={selected}
        className={`mt-4 w-full rounded-md border py-2 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
          selected
            ? "border-accent/60 bg-accent/15 text-accent hover:bg-accent/25"
            : "border-white/15 text-white/70 hover:border-accent/50 hover:text-accent"
        }`}
      >
        {selected ? `${slotName}에서 빼기` : `${slotName}에 담기`}
      </button>
    </article>
  );
}

/* ─────────────────────────── 조합 분석 ─────────────────────────── */

type Selection = Partial<Record<Gun, string>>;

function analyzeSelection(picked: JungsiEntry[]): {
  headline: string;
  detail: string;
} {
  const main = picked.filter((e) => e.gun !== "별도");
  const types = new Set(main.map((e) => e.silgi));
  const hasKarts = picked.some((e) => e.gun === "별도");

  if (types.has("자체실기") || (hasKarts && main.length > 0)) {
    return {
      headline: "자체 실기 대비가 들어가는 조합",
      detail:
        "서울대·한예종은 대학이 직접 출제하는 실기라 기초소양·기초디자인과 별도의 준비 시간이 필요합니다.",
    };
  }
  if (types.has("비실기") && types.size > 1) {
    return {
      headline: "실기 + 수능·서류를 병행하는 조합",
      detail:
        "홍익대 슬롯은 그림 대신 수능과 미술활동보고서 관리가 승부처입니다. 나머지 카드의 실기와 시간 배분이 필요합니다.",
    };
  }
  if (types.size === 1 && types.has("비실기")) {
    return {
      headline: "실기 없이 가는 조합",
      detail:
        "실기고사 부담이 없는 대신, 수능 성적과 서류 완성도가 당락을 결정합니다.",
    };
  }
  if (types.has("기초소양") && types.has("기초디자인")) {
    return {
      headline: "함께 준비 가능한 조합",
      detail:
        "기초소양과 기초디자인은 병행 준비가 되는 유형이라, 상위권·중위권을 동시에 노리는 표준 전략입니다.",
    };
  }
  if (main.length > 0 || hasKarts) {
    return {
      headline: "한 유형으로 끝나는 조합",
      detail: "실기 준비를 한 갈래에 집중할 수 있는 조합입니다.",
    };
  }
  return { headline: "", detail: "" };
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
  const analysis = analyzeSelection(picked);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/90 backdrop-blur-md">
      <div className="mx-auto max-w-4xl px-5 py-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] tracking-wider text-white/45">
            내 원서 조합{" "}
            <span className="font-mono text-accent">{filledCount}</span>
            <span className="text-white/35"> / 3장</span>
          </p>
          <button
            type="button"
            onClick={onClear}
            className="text-[11px] text-white/40 underline underline-offset-2 transition-colors hover:text-white/70"
          >
            비우기
          </button>
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
                <span className="text-[10px] text-white/50">
                  {SILGI_META[entry.silgi].short}
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
          <p aria-live="polite" className="text-[12px] leading-relaxed">
            {analysis.headline && (
              <>
                <span className="font-medium text-accent">
                  {analysis.headline}
                </span>{" "}
                <span className="text-white/55">{analysis.detail}</span>
              </>
            )}
          </p>
          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-md bg-accent px-5 py-2.5 text-center text-xs font-bold text-black transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            이 조합으로 무료 진단 받기
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── 메인 탐색기 ─────────────────────────── */

const SILGI_FILTERS: (SilgiType | "전체")[] = [
  "전체",
  "기초디자인",
  "기초소양",
  "선택실기",
  "자체실기",
  "비실기",
];

export default function JungsiExplorer({
  ctaHref = "#",
}: {
  ctaHref?: string;
}) {
  const [gun, setGun] = useState<Gun | "전체">("전체");
  const [silgi, setSilgi] = useState<SilgiType | "전체">("전체");
  const [query, setQuery] = useState("");
  const [selection, setSelection] = useState<Selection>({});

  const byId = useMemo(
    () => new Map(jungsiEntries.map((e) => [e.id, e])),
    [],
  );

  const gunCounts = useMemo(() => {
    const counts = { 가: 0, 나: 0, 다: 0, 별도: 0 } as Record<Gun, number>;
    for (const e of jungsiEntries) counts[e.gun] += 1;
    return counts;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim();
    return jungsiEntries.filter(
      (e) =>
        (gun === "전체" || e.gun === gun) &&
        (silgi === "전체" || e.silgi === silgi) &&
        (q === "" ||
          e.university.includes(q) ||
          (e.campus ?? "").includes(q) ||
          e.units.includes(q)),
    );
  }, [gun, silgi, query]);

  const visibleGuns = GUN_ORDER.filter((g) =>
    filtered.some((e) => e.gun === g),
  );

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
  };

  const hasSelection = Object.keys(selection).length > 0;

  return (
    <div>
      {/* 군 탭 + 필터 */}
      <div
        role="tablist"
        aria-label="모집군 선택"
        className="sticky top-16 z-30 -mx-5 border-b border-white/10 bg-black/85 px-5 py-3 backdrop-blur-md"
      >
        <div className="flex gap-2 overflow-x-auto">
          {(["전체", ...GUN_ORDER] as (Gun | "전체")[]).map((g) => {
            const active = gun === g;
            return (
              <button
                key={g}
                role="tab"
                aria-selected={active}
                onClick={() => setGun(g)}
                className={`shrink-0 rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  active
                    ? "bg-accent text-black"
                    : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {g === "전체" ? "전체" : GUN_LABEL[g]}
                {g !== "전체" && (
                  <span
                    className={`ml-1.5 font-mono text-[11px] ${
                      active ? "text-black/60" : "text-white/35"
                    }`}
                  >
                    {gunCounts[g]}
                  </span>
                )}
              </button>
            );
          })}
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="대학·학과 검색"
            aria-label="대학 또는 학과 검색"
            className="ml-auto w-32 shrink-0 rounded-md border border-white/15 bg-transparent px-3 py-2 text-xs text-white placeholder:text-white/30 focus:border-accent/60 focus:outline-none md:w-44"
          />
        </div>

        <div className="mt-2.5 flex items-center gap-2 overflow-x-auto">
          <span className="shrink-0 text-[11px] tracking-wider text-white/35">
            실기유형
          </span>
          {SILGI_FILTERS.map((s) => {
            const active = silgi === s;
            return (
              <button
                key={s}
                onClick={() => setSilgi(s)}
                aria-pressed={active}
                className={`shrink-0 rounded-full border px-3 py-1 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  active
                    ? "border-accent bg-accent/15 text-accent"
                    : "border-white/15 text-white/55 hover:border-white/35 hover:text-white/85"
                }`}
              >
                {s === "전체" ? "전체" : SILGI_META[s].label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 사용 안내 (선택 전에만) */}
      {!hasSelection && (
        <p className="mt-5 rounded-md border border-white/10 bg-white/[0.03] px-4 py-3 text-[13px] leading-relaxed text-white/55">
          카드의 <span className="text-accent">담기</span> 버튼을 누르면 아래에
          원서 조합이 만들어집니다. 군마다 1곳씩, 3장을 채워 보세요 — 실기유형
          궁합을 바로 알려드립니다.
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
              setGun("전체");
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
          return (
            <section key={g} className="pt-10" aria-label={GUN_LABEL[g]}>
              <div className="mb-4 flex items-baseline gap-3">
                <h3 className="text-lg font-bold text-white">
                  <span className="mr-2 font-mono text-accent">
                    {g === "별도" ? "+" : g}
                  </span>
                  {GUN_LABEL[g]}
                </h3>
                <span className="text-xs text-white/40">
                  {entries.length}개 대학
                </span>
                {g === "별도" && (
                  <span className="text-xs text-white/40">
                    가나다군과 별개로 지원 가능
                  </span>
                )}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {entries.map((entry) => (
                  <UniversityCard
                    key={entry.id}
                    entry={entry}
                    selected={selection[entry.gun] === entry.id}
                    onToggle={toggleEntry}
                  />
                ))}
              </div>
            </section>
          );
        })
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
              className="mt-2 text-[13px] leading-relaxed text-white/60"
            >
              <span className="font-medium text-white/85">
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
