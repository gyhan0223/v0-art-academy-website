"use client";

/**
 * "성적이 한 등급씩 오른다면?" 비교 섹션.
 * 모바일: 현재 → 상승 후 세로 배치 / 데스크톱: 좌우 비교.
 * 새로 지원권에 들어온 대학은 accent로 강조하되,
 * 합격을 단정하는 카피는 쓰지 않는다.
 */

import { useEffect, useRef } from "react";
import type { Gun } from "@/lib/jungsi-data";
import type { Ranked } from "@/lib/jungsi-recommend";
import { trackDiagnosis } from "@/lib/diagnosis/analytics";
import { ComboCard } from "./ComboCards";

const GUNS: Gun[] = ["가", "나", "다"];

function ComboColumn({
  title,
  combo,
  newUniversities,
}: {
  title: React.ReactNode;
  combo: Partial<Record<Gun, Ranked>>;
  newUniversities?: Set<string>;
}) {
  return (
    <div>
      <p className="mb-3 text-[14px] font-bold text-white/70">{title}</p>
      <div className="space-y-3">
        {GUNS.map((g) => (
          <ComboCard
            key={g}
            gun={g}
            pick={combo[g]}
            highlight={
              newUniversities != null &&
              combo[g] != null &&
              newUniversities.has(combo[g]!.entry.university)
            }
          />
        ))}
      </div>
    </div>
  );
}

export default function GradeUpComparison({
  current,
  gradeUp,
}: {
  current: Partial<Record<Gun, Ranked>>;
  gradeUp: Partial<Record<Gun, Ranked>>;
}) {
  // 섹션이 실제로 보였을 때 한 번만 집계
  const ref = useRef<HTMLElement>(null);
  const seen = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      if (!seen.current) {
        seen.current = true;
        trackDiagnosis("diagnosis_gradeup_view");
      }
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting) && !seen.current) {
        seen.current = true;
        trackDiagnosis("diagnosis_gradeup_view");
        observer.disconnect();
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const currentUniversities = new Set(
    GUNS.map((g) => current[g]?.entry.university).filter(
      (u): u is string => u != null,
    ),
  );
  const newUniversities = new Set(
    GUNS.map((g) => gradeUp[g]?.entry.university).filter(
      (u): u is string => u != null && !currentUniversities.has(u),
    ),
  );

  return (
    <section ref={ref} aria-label="한 등급 상승 시나리오">
      <h2 className="text-[22px] font-bold leading-snug text-white">
        성적이 한 등급씩 오른다면?
      </h2>
      <p className="mt-2 text-[14px] leading-relaxed text-white/55">
        국어·영어·탐구가 각각 한 등급 상승한 수준으로 시뮬레이션했어요.
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <ComboColumn title="지금" combo={current} />
        <div className="md:hidden" aria-hidden>
          <p className="text-center text-lg text-white/30">↓</p>
        </div>
        <ComboColumn
          title={<span className="text-accent">한 등급 상승 수준</span>}
          combo={gradeUp}
          newUniversities={newUniversities}
        />
      </div>

      {newUniversities.size > 0 && (
        <p className="mt-4 text-[14px] leading-relaxed text-white/70">
          한 등급씩 올리면 지원 전략이{" "}
          <span className="font-bold text-accent">
            {[...newUniversities].join(" · ")}
          </span>
          까지 넓어져요.
        </p>
      )}

      <p className="mt-4 text-[12px] leading-relaxed text-white/35">
        성적 상승 결과는 등급 변화에 따른 참고 시뮬레이션이며 실제
        표준점수·백분위는 시험 난이도에 따라 달라질 수 있습니다.
      </p>
    </section>
  );
}
