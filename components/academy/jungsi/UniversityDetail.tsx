import { type JungsiEntry, type Major } from "@/lib/jungsi-data";
import { splitMethod } from "@/lib/jungsi-stages";

function fmtRate(rate: number | null) {
  return rate == null ? "—" : `${rate.toFixed(2)} : 1`;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h5 className="text-[11px] font-medium tracking-wider text-accent/90">
        {title}
      </h5>
      <div className="mt-1.5">{children}</div>
    </section>
  );
}

/** 학과별 모집인원·경쟁률 표 (상세보기 안에서 항상 펼쳐 보임) */
function MajorList({ majors }: { majors: Major[] }) {
  return (
    <ul className="divide-y divide-white/5 rounded-md border border-white/10 bg-black/30">
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
  );
}

/**
 * 카드 클릭 시 펼쳐지는 상세 영역.
 * 순서: 전형 방법 → 수능 반영 → 실기 → 모집 학과·인원·경쟁률 → 비고
 */
export default function UniversityDetail({ entry }: { entry: JungsiEntry }) {
  const { admission, suneung } = splitMethod(entry);
  const specParts = [entry.practical, entry.paper, entry.duration].filter(
    (v): v is string => Boolean(v),
  );
  const majors = entry.majors ?? [];
  const quotas = majors
    .map((m) => m.quota)
    .filter((q): q is number => q != null);
  const totalQuota = quotas.reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-4 border-t border-white/10 pt-4">
      <Section title="전형 방법">
        <ul className="space-y-1">
          {admission.map((line) => (
            <li
              key={line}
              className="text-[13px] leading-relaxed text-white/80 before:mr-2 before:text-accent before:content-['·']"
            >
              {line}
            </li>
          ))}
        </ul>
      </Section>

      {suneung.length > 0 && (
        <Section title="수능 반영">
          <ul className="space-y-1">
            {suneung.map((line) => (
              <li
                key={line}
                className="text-[13px] leading-relaxed text-white/80"
              >
                {line}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {specParts.length > 0 && (
        <Section title="실기">
          <p className="text-[13px] leading-relaxed text-white/70">
            {specParts.join(" · ")}
          </p>
        </Section>
      )}

      {majors.length > 0 && (
        <Section
          title={
            totalQuota > 0
              ? `모집 학과 · ${totalQuota}명 · 2026 경쟁률`
              : "모집 학과 · 2026 경쟁률"
          }
        >
          <MajorList majors={majors} />
        </Section>
      )}

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
        <p className="text-[11px] leading-relaxed text-white/40">{entry.note}</p>
      )}
    </div>
  );
}
