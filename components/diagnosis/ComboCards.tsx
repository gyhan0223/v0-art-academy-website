"use client";

/**
 * 가·나·다군 추천 조합 카드.
 * 환산 숫자보다 지원권(안정/적정/도전/참고) 표현을 중심에 둔다 —
 * 대학마다 환산 만점·방식이 달라 숫자를 직접 비교하면 안 되기 때문.
 * 색만으로 구분하지 않도록 뱃지에 항상 텍스트를 함께 쓴다.
 */

import type { Gun } from "@/lib/jungsi-data";
import { silgiShort } from "@/lib/jungsi-data";
import { isSilgiFree } from "@/lib/diagnosis/silgi";
import type { DiagnosisComboPick } from "@/lib/diagnosis/score-engine";

const GUN_LABEL: Record<Gun, string> = {
  가: "가군",
  나: "나군",
  다: "다군",
  별도: "별도",
};

export const TIER_BADGE: Record<string, string> = {
  안정: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  적정: "border-accent/50 bg-accent/15 text-accent",
  도전: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  참고: "border-white/20 bg-white/5 text-white/60",
};

export function TierBadge({ tier }: { tier?: string }) {
  const label = tier && tier !== "낮음" ? tier : "참고";
  return (
    <span
      className={`inline-block shrink-0 rounded-full border px-2.5 py-1 text-[12px] font-medium ${TIER_BADGE[label] ?? TIER_BADGE["참고"]}`}
    >
      {label}
    </span>
  );
}

export function ComboCard({
  gun,
  pick,
  highlight = false,
}: {
  gun: Gun;
  pick?: DiagnosisComboPick;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-5 ${
        highlight
          ? "border-accent/60 bg-accent/[0.08]"
          : "border-white/10 bg-white/[0.02]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="font-mono text-[13px] text-accent">{GUN_LABEL[gun]}</p>
        {highlight && (
          <span className="rounded-full border border-accent/50 bg-accent/15 px-2 py-0.5 text-[11px] font-medium text-accent">
            새로 지원권
          </span>
        )}
      </div>
      {pick ? (
        <>
          <div className="mt-1.5 flex items-start justify-between gap-3">
            <p className="text-lg font-bold leading-snug text-white">
              {pick.entry.university}
              {pick.entry.campus ? (
                <span className="text-[14px] font-normal text-white/50">
                  {" "}
                  {pick.entry.campus}
                </span>
              ) : null}
            </p>
            {/* 도전 상향 카드는 입결 비공개라도 '도전'으로 표기 */}
            <TierBadge tier={pick.stretch ? "도전" : pick.tier} />
          </div>
          <p className="mt-1 text-[13px] leading-relaxed text-white/55">
            {pick.entry.units}
          </p>
          <p className="mt-1.5 text-[12px] text-white/40">
            {silgiShort(pick.entry)}
            {isSilgiFree(pick.entry) && " · 실기 무관"}
          </p>
          <details className="group mt-3">
            <summary className="cursor-pointer list-none text-[13px] text-white/45 transition-colors hover:text-accent group-open:text-accent">
              왜 추천했나요?
            </summary>
            <div className="mt-2 space-y-1.5">
              {pick.entry.method.map((m) => (
                <p
                  key={m}
                  className="text-[12px] leading-relaxed text-white/55"
                >
                  {m}
                </p>
              ))}
              {pick.cutoffLabel && (
                <p className="text-[12px] text-white/40">
                  참고 합격선: {pick.cutoffLabel}
                </p>
              )}
              {!pick.cutoffLabel && (
                <p className="text-[12px] text-white/40">
                  이 대학은 최근 입시결과가 공개되지 않아 지원권 판정 없이
                  참고로 보여드려요.
                </p>
              )}
            </div>
          </details>
        </>
      ) : (
        <p className="mt-2 text-[14px] leading-relaxed text-white/45">
          이 군에서는 조건에 맞는 추천 대학을 찾지 못했어요. 실기 유형이나
          성적 조건을 바꿔 다시 진단해보세요.
        </p>
      )}
    </div>
  );
}
