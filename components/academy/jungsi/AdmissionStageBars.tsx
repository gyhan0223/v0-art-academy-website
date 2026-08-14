import type { AdmissionStage, StagePart } from "@/lib/jungsi-data";

/* 색만으로 구분하지 않도록 bar 옆에 항상 "수능 40% · 실기 60%" 텍스트를 함께 표기합니다. */
const PART_CLASS: Record<StagePart["type"], string> = {
  수능: "bg-accent",
  "1단계 성적": "bg-accent/50",
  실기: "bg-white/70",
  학생부: "bg-white/40",
  서류: "bg-white/40",
  면접: "bg-white/25",
  기타: "bg-white/25",
};

const partName = (p: StagePart) => p.label ?? p.type;

export default function AdmissionStageBars({
  stages,
  showNotes = false,
}: {
  stages: AdmissionStage[];
  /** 상세보기에서만 단계별 비고(배수·학과별 예외)까지 표시 */
  showNotes?: boolean;
}) {
  return (
    <div className="space-y-2.5">
      {stages.map((stage) => (
        <div key={stage.label}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
            <span className="shrink-0 text-[11px] font-medium tracking-wide text-white/45">
              {stage.label}
            </span>
            <span className="min-w-0 text-[11px] leading-snug text-white/65">
              {stage.parts.map((p) => `${partName(p)} ${p.value}%`).join(" · ")}
            </span>
          </div>
          <div
            aria-hidden
            className="mt-1 flex h-2 w-full overflow-hidden rounded-full bg-white/10"
          >
            {stage.parts.map((p, i) => (
              <div
                key={`${p.type}-${i}`}
                className={PART_CLASS[p.type]}
                style={{ width: `${p.value}%` }}
              />
            ))}
          </div>
          {showNotes && stage.note && (
            <p className="mt-1 text-[11px] leading-relaxed text-white/40">
              {stage.note}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
