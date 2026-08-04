"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
import { useReportBottomBar } from "@/components/academy/NaverTalk";

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
              {m.applicants != null && (
                <span className="mt-0.5 block font-mono text-[10px] text-white/35">
                  지원 {m.applicants}명
                </span>
              )}
              {m.rateQuota != null && m.rateQuota !== m.quota && (
                <span className="mt-0.5 block text-[10px] text-white/35">
                  당시 {m.rateQuota}명 모집
                </span>
              )}
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

/* ─────────────────────────── 공유 · 저장 ─────────────────────────── */

const MAIN_GUNS: Gun[] = ["가", "나", "다"];

function slotLine(entry: JungsiEntry) {
  const name = entry.campus
    ? `${entry.university} ${entry.campus}`
    : entry.university;
  return { name, silgi: SILGI_META[entry.silgi].label };
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
  ctx.fillText("2026 미대 정시", PAD, 108);
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
  ctx.fillText("일산 · 031-916-8885 · 무료 진단 예약 가능", PAD, H - 24);

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

  // 예약 페이지로 넘어가기 전에 조합 요약을 복사해 두면
  // 요청사항란에 붙여넣기만 하면 됨 → 상담 리드에 조합 정보가 따라붙음
  const handleCta = async () => {
    const ok = await copyText(buildDiagnosisText(selection, byId, analysis));
    if (ok)
      showToast(
        "조합 내용을 복사했어요 — 예약 '요청사항'란에 붙여넣어 주세요.",
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
          <p className="text-[11px] tracking-wider text-white/45">
            내 원서 조합{" "}
            <span className="font-mono text-accent">{filledCount}</span>
            <span className="text-white/35"> / 3장</span>
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveImage}
              disabled={saving}
              className="flex items-center gap-1 text-[11px] text-white/55 transition-colors hover:text-accent disabled:opacity-50"
            >
              <svg aria-hidden width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M7 1v8m0 0L4 6.2M7 9l3-2.8M1.5 10.5V12a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {saving ? "만드는 중…" : "이미지 저장"}
            </button>
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center gap-1 text-[11px] text-white/55 transition-colors hover:text-accent"
            >
              <svg aria-hidden width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M5.8 8.2a2.8 2.8 0 0 0 4 0l2-2a2.83 2.83 0 0 0-4-4l-1 1M8.2 5.8a2.8 2.8 0 0 0-4 0l-2 2a2.83 2.83 0 0 0 4 4l1-1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              링크 복사
            </button>
            <button
              type="button"
              onClick={onClear}
              className="text-[11px] text-white/40 underline underline-offset-2 transition-colors hover:text-white/70"
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
            {complete ? (
              <span className="font-bold text-accent">
                ✓ 3장 완성! 이 조합, 지금 바로 진단받아 보세요.
              </span>
            ) : (
              analysis.headline && (
                <>
                  <span className="font-medium text-accent">
                    {analysis.headline}
                  </span>{" "}
                  <span className="text-white/55">{analysis.detail}</span>
                </>
              )
            )}
          </p>
          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleCta}
            className={
              complete
                ? "w-full shrink-0 rounded-md bg-accent px-6 py-3 text-center text-sm font-bold text-black shadow-[0_0_0_3px_rgba(255,255,255,0.12)] transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:w-auto"
                : "shrink-0 rounded-md bg-accent px-5 py-2.5 text-center text-xs font-bold text-black transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            }
          >
            {complete ? "이 3장 조합 무료 진단 받기" : "이 조합으로 무료 진단 받기"}
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
  const [gun, setGun] = useState<Gun>("가");
  const [silgi, setSilgi] = useState<SilgiType | "전체">("전체");
  const [query, setQuery] = useState("");
  const [selection, setSelection] = useState<Selection>({});
  const [focusId, setFocusId] = useState<string | null>(null);

  // 다른 섹션(성적 추천기)에서 "이 대학으로 이동" 요청을 받으면 해당 군으로 전환
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ id: string; gun: Gun }>).detail;
      if (!detail) return;
      setGun(detail.gun);
      setSilgi("전체");
      setQuery("");
      setFocusId(detail.id);
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

  // 군 전환으로 카드가 렌더된 뒤, 대상 대학으로 스크롤 + 강조
  useEffect(() => {
    if (!focusId) return;
    const el = document.getElementById(`uni-${focusId}`);
    if (!el) return;
    // scrollIntoView는 body 스크롤 컨테이너 때문에 뷰포트를 못 움직여서 window.scrollTo 사용.
    // 스티키 헤더(64px)+군 탭바(약 110px) 아래로 오도록 오프셋 확보.
    const top = el.getBoundingClientRect().top + window.scrollY - 176;
    // 네이티브 smooth는 reduced-motion 환경에서 no-op이 되므로 즉시 이동으로 확실히 처리
    window.scrollTo(0, Math.max(0, top));
    el.classList.add("ring-2", "ring-accent", "ring-offset-2", "ring-offset-black");
    const t = setTimeout(
      () =>
        el.classList.remove(
          "ring-2",
          "ring-accent",
          "ring-offset-2",
          "ring-offset-black",
        ),
      1800,
    );
    setFocusId(null);
    return () => clearTimeout(t);
  }, [focusId, filtered]);

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
          {GUN_ORDER.map((g) => {
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
              className="w-36 rounded-md border border-white/25 bg-white/[0.07] py-2 pl-8 pr-3 text-xs text-white placeholder:text-white/50 focus:border-accent/60 focus:bg-white/[0.1] focus:outline-none md:w-52"
            />
          </div>
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
              <div className="grid gap-4">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    id={`uni-${entry.id}`}
                    className="scroll-mt-44 rounded-lg transition-shadow"
                  >
                    <UniversityCard
                      entry={entry}
                      selected={selection[entry.gun] === entry.id}
                      onToggle={toggleEntry}
                    />
                  </div>
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
