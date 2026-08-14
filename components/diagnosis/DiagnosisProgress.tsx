"use client";

/** 상단 얇은 진행 바 — 숫자를 강조하지 않고 진행감만 준다 */
export default function DiagnosisProgress({
  current,
  total,
}: {
  current: number; // 1-based. 0이면 숨김
  total: number;
}) {
  if (current <= 0) {
    return <div className="h-0.5 w-full" aria-hidden />;
  }
  const pct = Math.min(100, Math.round((current / total) * 100));
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={current}
      aria-label={`진단 진행 단계 ${current} / ${total}`}
      className="h-0.5 w-full bg-white/10"
    >
      <div
        className="h-full bg-accent transition-[width] duration-300 ease-out motion-reduce:transition-none"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
